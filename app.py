from flask import Flask, jsonify, request, Response
import sqlite3
import os

app = Flask(__name__)

DB_PATH = os.path.join(os.path.dirname(__file__), 'mensualidades.db')

SUCURSALES = ["Escobedo", "Montes Berneses"]
HORARIOS = {
    "Escobedo": ["16:00", "17:00", "18:00", "19:00", "20:00"],
    "Montes Berneses": ["16:30", "17:30", "18:30", "19:30"]
}
MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
CINTAS = ["Blanca","Amarilla","Amarilla Avanzada","Naranja","Verde","Verde Avanzada","Azul","Azul Avanzada","Marrón","Roja","Rojinegra","Negra"]
METODOS_PAGO = ["Efectivo","Transferencia"]
MENSUALIDAD = 700.0
INSCRIPCION = 450.0
RECARGO = 50.0

@app.after_request
def add_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response

@app.route("/api/<path:p>", methods=["OPTIONS"])
def options_handler(p):
    return add_cors(Response())

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS alumnos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        telefono TEXT,
        sucursal TEXT NOT NULL DEFAULT 'Escobedo',
        horario TEXT NOT NULL,
        dia_corte INTEGER NOT NULL DEFAULT 5,
        fecha_inscripcion TEXT,
        inscripcion_pagada INTEGER DEFAULT 0,
        cinta TEXT DEFAULT 'Blanca',
        activo INTEGER DEFAULT 1,
        fecha_registro TEXT DEFAULT CURRENT_TIMESTAMP
    )''')
    try:
        c.execute("ALTER TABLE alumnos ADD COLUMN cinta TEXT DEFAULT 'Blanca'")
    except:
        pass
    c.execute('''CREATE TABLE IF NOT EXISTS pagos_mensuales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        alumno_id INTEGER NOT NULL,
        anio INTEGER NOT NULL,
        mes INTEGER NOT NULL,
        pagado INTEGER DEFAULT 0,
        monto REAL DEFAULT 700.0,
        recargo_aplicado INTEGER DEFAULT 0,
        fecha_pago TEXT,
        metodo_pago TEXT DEFAULT 'Efectivo',
        notas TEXT,
        FOREIGN KEY (alumno_id) REFERENCES alumnos(id),
        UNIQUE(alumno_id, anio, mes)
    )''')
    try:
        c.execute("ALTER TABLE pagos_mensuales ADD COLUMN metodo_pago TEXT DEFAULT 'Efectivo'")
    except:
        pass
    c.execute('''CREATE TABLE IF NOT EXISTS gastos_mes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        anio INTEGER NOT NULL,
        mes INTEGER NOT NULL,
        concepto TEXT NOT NULL,
        monto REAL NOT NULL,
        sucursal TEXT DEFAULT 'General'
    )''')
    conn.commit()
    conn.close()

# ---- ALUMNOS ----

@app.route('/api/alumnos', methods=['GET'])
def get_alumnos():
    conn = get_db()
    alumnos = conn.execute('SELECT * FROM alumnos ORDER BY apellido, nombre').fetchall()
    conn.close()
    return jsonify([dict(a) for a in alumnos])

@app.route('/api/alumnos', methods=['POST'])
def crear_alumno():
    d = request.json
    conn = get_db()
    cur = conn.execute(
        'INSERT INTO alumnos (nombre, apellido, telefono, sucursal, horario, dia_corte, fecha_inscripcion, inscripcion_pagada, cinta) VALUES (?,?,?,?,?,?,?,?,?)',
        (d['nombre'], d['apellido'], d.get('telefono',''), d.get('sucursal','Escobedo'), d['horario'], d.get('dia_corte',5), d.get('fecha_inscripcion',''), d.get('inscripcion_pagada',0), d.get('cinta','Blanca'))
    )
    conn.commit()
    alumno = conn.execute('SELECT * FROM alumnos WHERE id=?', (cur.lastrowid,)).fetchone()
    conn.close()
    return jsonify(dict(alumno)), 201

@app.route('/api/alumnos/<int:id>', methods=['PUT'])
def actualizar_alumno(id):
    d = request.json
    conn = get_db()
    conn.execute(
        'UPDATE alumnos SET nombre=?, apellido=?, telefono=?, sucursal=?, horario=?, dia_corte=?, fecha_inscripcion=?, inscripcion_pagada=?, cinta=?, activo=? WHERE id=?',
        (d['nombre'], d['apellido'], d.get('telefono',''), d['sucursal'], d['horario'], d.get('dia_corte',5), d.get('fecha_inscripcion',''), d.get('inscripcion_pagada',0), d.get('cinta','Blanca'), d.get('activo',1), id)
    )
    conn.commit()
    alumno = conn.execute('SELECT * FROM alumnos WHERE id=?', (id,)).fetchone()
    conn.close()
    return jsonify(dict(alumno))

@app.route('/api/alumnos/<int:id>/historial', methods=['GET'])
def historial_alumno(id):
    conn = get_db()
    rows = conn.execute('SELECT * FROM pagos_mensuales WHERE alumno_id=? ORDER BY anio DESC, mes DESC', (id,)).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

# ---- PAGOS MENSUALES ----

@app.route('/api/mes/<int:anio>/<int:mes>', methods=['GET'])
def get_mes(anio, mes):
    conn = get_db()
    alumnos = conn.execute('SELECT * FROM alumnos WHERE activo=1 ORDER BY sucursal, horario, apellido').fetchall()
    result = []
    for a in alumnos:
        pago = conn.execute(
            'SELECT * FROM pagos_mensuales WHERE alumno_id=? AND anio=? AND mes=?',
            (a['id'], anio, mes)
        ).fetchone()
        item = dict(a)
        if pago:
            item['pago'] = dict(pago)
        else:
            item['pago'] = {'pagado': 0, 'monto': MENSUALIDAD, 'recargo_aplicado': 0, 'fecha_pago': None, 'metodo_pago': 'Efectivo', 'notas': ''}
        result.append(item)
    conn.close()
    return jsonify(result)

@app.route('/api/mes/<int:anio>/<int:mes>/alumno/<int:alumno_id>', methods=['PUT'])
def actualizar_pago_mes(anio, mes, alumno_id):
    d = request.json
    conn = get_db()
    existing = conn.execute(
        'SELECT id FROM pagos_mensuales WHERE alumno_id=? AND anio=? AND mes=?',
        (alumno_id, anio, mes)
    ).fetchone()
    if existing:
        conn.execute(
            'UPDATE pagos_mensuales SET pagado=?, monto=?, recargo_aplicado=?, fecha_pago=?, metodo_pago=?, notas=? WHERE id=?',
            (d.get('pagado',0), d.get('monto', MENSUALIDAD), d.get('recargo_aplicado',0), d.get('fecha_pago',''), d.get('metodo_pago','Efectivo'), d.get('notas',''), existing['id'])
        )
    else:
        conn.execute(
            'INSERT INTO pagos_mensuales (alumno_id, anio, mes, pagado, monto, recargo_aplicado, fecha_pago, metodo_pago, notas) VALUES (?,?,?,?,?,?,?,?,?)',
            (alumno_id, anio, mes, d.get('pagado',0), d.get('monto', MENSUALIDAD), d.get('recargo_aplicado',0), d.get('fecha_pago',''), d.get('metodo_pago','Efectivo'), d.get('notas',''))
        )
    conn.commit()
    conn.close()
    return jsonify({'ok': True})

# ---- GASTOS MES ----

@app.route('/api/gastos/<int:anio>/<int:mes>', methods=['GET'])
def get_gastos(anio, mes):
    conn = get_db()
    rows = conn.execute('SELECT * FROM gastos_mes WHERE anio=? AND mes=? ORDER BY id', (anio, mes)).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

@app.route('/api/gastos/<int:anio>/<int:mes>', methods=['POST'])
def agregar_gasto(anio, mes):
    d = request.json
    conn = get_db()
    cur = conn.execute(
        'INSERT INTO gastos_mes (anio, mes, concepto, monto, sucursal) VALUES (?,?,?,?,?)',
        (anio, mes, d['concepto'], d['monto'], d.get('sucursal','General'))
    )
    conn.commit()
    g = conn.execute('SELECT * FROM gastos_mes WHERE id=?', (cur.lastrowid,)).fetchone()
    conn.close()
    return jsonify(dict(g)), 201

@app.route('/api/gastos/<int:id>', methods=['DELETE'])
def borrar_gasto(id):
    conn = get_db()
    conn.execute('DELETE FROM gastos_mes WHERE id=?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'ok': True})

# ---- CAJA ----

@app.route('/api/caja/<int:anio>/<int:mes>', methods=['GET'])
def get_caja(anio, mes):
    conn = get_db()
    rows = conn.execute('''
        SELECT a.sucursal, pm.metodo_pago,
               SUM(pm.monto + CASE WHEN pm.recargo_aplicado THEN 50 ELSE 0 END) as total,
               COUNT(*) as cantidad
        FROM pagos_mensuales pm
        JOIN alumnos a ON a.id = pm.alumno_id
        WHERE pm.anio=? AND pm.mes=? AND pm.pagado=1
        GROUP BY a.sucursal, pm.metodo_pago
        ORDER BY a.sucursal, pm.metodo_pago
    ''', (anio, mes)).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

# ---- CATALOGO ----

@app.route('/api/catalogo', methods=['GET'])
def catalogo():
    return jsonify({
        'sucursales': SUCURSALES,
        'horarios': HORARIOS,
        'meses': MESES,
        'cintas': CINTAS,
        'metodos_pago': METODOS_PAGO,
        'mensualidad': MENSUALIDAD,
        'inscripcion': INSCRIPCION,
        'recargo': RECARGO
    })

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5056, debug=False)
