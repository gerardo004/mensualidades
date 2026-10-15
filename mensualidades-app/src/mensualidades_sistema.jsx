import { useState, useEffect } from "react";

//const API = "http://192.168.1.85:5056/api";
const API = "http://localhost:5056/api";

const CINTA_COLORS = {
  "Blanca": { bg: "#f8f9fa", text: "#212529", border: "#dee2e6" },
  "Amarilla": { bg: "#fff3cd", text: "#856404", border: "#ffc107" },
  "Amarilla Avanzada": { bg: "#ffe066", text: "#7a5c00", border: "#f0b800" },
  "Naranja": { bg: "#ffe0b2", text: "#8d4e00", border: "#ff9800" },
  "Verde": { bg: "#d4edda", text: "#155724", border: "#28a745" },
  "Verde Avanzada": { bg: "#a8d5b0", text: "#0d3b1a", border: "#1a7a35" },
  "Azul": { bg: "#cce5ff", text: "#004085", border: "#007bff" },
  "Azul Avanzada": { bg: "#8ab8f0", text: "#002060", border: "#0056b3" },
  "Marrón": { bg: "#d7c4a8", text: "#4a2c00", border: "#8B4513" },
  "Roja": { bg: "#f8d7da", text: "#721c24", border: "#dc3545" },
  "Rojinegra": { bg: "#2c0a0a", text: "#f8d7da", border: "#7b1a1a" },
  "Negra": { bg: "#343a40", text: "#f8f9fa", border: "#000" },
};

function CintaBadge({ cinta }) {
  const c = CINTA_COLORS[cinta] || CINTA_COLORS["Blanca"];
  return (
    <span style={{
      background: c.bg, color: c.text, border: `2px solid ${c.border}`,
      borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700,
      whiteSpace: "nowrap", fontFamily: "monospace"
    }}>{cinta}</span>
  );
}

const inputStyle = {
  background: "#e8e8e8", border: "1px solid #c0392b", borderRadius: 6,
  color: "#1a1a1a", padding: "8px 12px", width: "100%", fontSize: 14, boxSizing: "border-box"
};
const btnStyle = (color = "#c0392b") => ({
  background: color, border: "none", borderRadius: 6,
  color: "#1a1a1a", padding: "8px 16px", cursor: "pointer", fontSize: 14, fontWeight: 600
});

function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={{
        background: "#ffffff", border: "1px solid #c0392b", borderRadius: 12,
        padding: 28, minWidth: 340, maxWidth: 560, width: "95%", maxHeight: "92vh", overflowY: "auto"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ color: "#c0392b", margin: 0, fontFamily: "'Bebas Neue', cursive", fontSize: 22, letterSpacing: 2 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#666", fontSize: 22, cursor: "pointer" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ================= TICKET WHATSAPP =================
function generarTicket(alumno, pago, mes, anio, mesesNombres) {
  const fechaHoy = new Date().toLocaleDateString('es-MX');
  const totalConRecargo = pago.recargo_aplicado ? pago.monto + 50 : pago.monto;

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Ticket - ${alumno.nombre} ${alumno.apellido}</title>
<style>
  body { font-family: 'Courier New', monospace; padding: 20px; background: #f4f4f4; }
  .ticket {
    width: 380px; margin: 0 auto; background: #fff; border: 2px dashed #c0392b;
    border-radius: 10px; padding: 24px; box-sizing: border-box;
  }
  .logo-row { text-align: center; margin-bottom: 10px; }
  .logo-row img { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid #c0392b; }
  .brand { text-align: center; font-size: 20px; font-weight: 900; color: #c0392b; letter-spacing: 2px; margin: 8px 0 2px; }
  .sub { text-align: center; font-size: 10px; color: #888; letter-spacing: 1px; margin-bottom: 14px; }
  .divider { border-top: 2px dashed #c0392b; margin: 12px 0; }
  .row { display: flex; justify-content: space-between; font-size: 13px; margin: 5px 0; color: #333; }
  .row b { color: #111; }
  .total-row { display: flex; justify-content: space-between; font-size: 18px; font-weight: 900; color: #c0392b; margin-top: 10px; }
  .status { text-align: center; font-weight: 900; font-size: 14px; padding: 8px; border-radius: 6px; margin-top: 14px; letter-spacing: 1px; }
  .status.pagado { background: #d4edda; color: #155724; }
  .status.pendiente { background: #f8d7da; color: #721c24; }
  .footer { text-align: center; font-size: 10px; color: #999; margin-top: 16px; }
  @media print { button { display: none; } body { background: #fff; } }
</style>
</head>
<body>
  <button onclick="window.print()" style="display:block;margin:0 auto 16px;padding:10px 24px;background:#c0392b;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:14px;">🖨️ Imprimir / Guardar</button>
  <div class="ticket">
    <div class="logo-row"><img src="/logo.png" onerror="this.style.display='none'" alt="logo"/></div>
    <div class="brand">RED TAEKWONDO</div>
    <div class="sub">COMPROBANTE DE MENSUALIDAD</div>
    <div class="divider"></div>
    <div class="row"><span>Alumno:</span><b>${alumno.nombre} ${alumno.apellido}</b></div>
    <div class="row"><span>Sucursal:</span><b>${alumno.sucursal}</b></div>
    <div class="row"><span>Horario:</span><b>${alumno.horario}</b></div>
    <div class="row"><span>Periodo:</span><b>${mesesNombres[mes-1]} ${anio}</b></div>
    <div class="row"><span>Fecha de pago:</span><b>${pago.fecha_pago || fechaHoy}</b></div>
    <div class="row"><span>Método:</span><b>${pago.metodo_pago || 'Efectivo'}</b></div>
    <div class="divider"></div>
    <div class="row"><span>Mensualidad:</span><span>$${pago.monto.toLocaleString('es-MX')}</span></div>
    ${pago.recargo_aplicado ? `<div class="row"><span>Recargo:</span><span>$50</span></div>` : ''}
    <div class="total-row"><span>TOTAL:</span><span>$${totalConRecargo.toLocaleString('es-MX')}</span></div>
    <div class="status ${pago.pagado ? 'pagado' : 'pendiente'}">${pago.pagado ? '✅ PAGADO' : '⏳ PENDIENTE'}</div>
    <div class="footer">Gracias por confiar en Red Taekwondo<br/>${fechaHoy}</div>
  </div>
</body>
</html>`;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
}

// ================= APP =================
export default function App() {
  const [catalogo, setCatalogo] = useState({ sucursales: [], horarios: {}, meses: [], cintas: [], metodos_pago: [], mensualidad: 700, inscripcion: 450, recargo: 50 });
  const [error, setError] = useState(false);
  const [tab, setTab] = useState("control");

  useEffect(() => {
    fetch(`${API}/catalogo`).then(r => r.json()).then(setCatalogo).catch(() => setError(true));
  }, []);

  if (error) return (
    <div style={{ background: "#f4f4f4", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: "#c0392b" }}>
        <p style={{ fontSize: 24 }}>⚠️ No se puede conectar al servidor</p>
        <p style={{ color: "#666" }}>Asegúrate de que el backend está corriendo:<br /><code style={{ color: "#1a1a1a" }}>python app.py</code></p>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#f4f4f4", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", color: "#1a1a1a" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
      <div style={{ background: "linear-gradient(135deg, #c0392b 0%, #922b21 100%)", borderBottom: "3px solid #c0392b", padding: "16px 28px", display: "flex", alignItems: "center", gap: 18 }}>
        <img src="/logo.png" alt="Red Taekwondo" style={{ width: 64, height: 64, borderRadius: "50%", border: "2px solid #c0392b", objectFit: "cover", flexShrink: 0 }} />
        <div>
          <h1 style={{ margin: 0, fontFamily: "'Bebas Neue', cursive", fontSize: 30, letterSpacing: 5, color: "#ffffff" }}>RED TAEKWONDO</h1>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: 11, letterSpacing: 3, fontFamily: "'Bebas Neue', cursive" }}>CONTROL DE MENSUALIDADES</p>
        </div>
      </div>
      <div style={{ background: "#ffffff", borderBottom: "1px solid #ddd", padding: "0 28px", display: "flex", gap: 4 }}>
        {[["control", "📅 Control Mensual"], ["alumnos", "👥 Alumnos"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            background: "none", border: "none", color: tab === key ? "#c0392b" : "#aaa",
            padding: "14px 20px", cursor: "pointer", fontFamily: "'Bebas Neue', cursive",
            fontSize: 16, letterSpacing: 2, borderBottom: tab === key ? "3px solid #c0392b" : "3px solid transparent"
          }}>{label}</button>
        ))}
      </div>
      <div style={{ padding: "24px 28px", maxWidth: 1300, margin: "0 auto" }}>
        {tab === "control" && <ControlMensualTab catalogo={catalogo} />}
        {tab === "alumnos" && <AlumnosTab catalogo={catalogo} />}
      </div>
    </div>
  );
}

// ================= CONTROL MENSUAL TAB =================
function ControlMensualTab({ catalogo }) {
  const hoy = new Date();
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [mes, setMes] = useState(hoy.getMonth() + 1);
  const [datos, setDatos] = useState([]);
  const [sucursalFilter, setSucursalFilter] = useState("todas");
  const [horarioFilter, setHorarioFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [editPago, setEditPago] = useState(null);
  const [editForm, setEditForm] = useState({ pagado: false, monto: 700, recargo_aplicado: false, fecha_pago: "", metodo_pago: "Efectivo", notas: "" });
  const [soloDeudores, setSoloDeudores] = useState(false);
  const [caja, setCaja] = useState([]);
  const [showCaja, setShowCaja] = useState(false);

  useEffect(() => { loadMes(); loadCaja(); }, [anio, mes]);

  async function loadMes() {
    const r = await fetch(`${API}/mes/${anio}/${mes}`);
    setDatos(await r.json());
  }

  async function loadCaja() {
    const r = await fetch(`${API}/caja/${anio}/${mes}`);
    setCaja(await r.json());
  }

  function diaActualVsCorte(diaCorte) {
    if (anio !== hoy.getFullYear() || mes !== hoy.getMonth() + 1) return false;
    return hoy.getDate() > diaCorte;
  }

  function openEditPago(item) {
    setEditPago(item);
    setEditForm({
      pagado: !!item.pago.pagado,
      monto: item.pago.monto || catalogo.mensualidad,
      recargo_aplicado: !!item.pago.recargo_aplicado,
      fecha_pago: item.pago.fecha_pago || new Date().toISOString().split("T")[0],
      metodo_pago: item.pago.metodo_pago || "Efectivo",
      notas: item.pago.notas || ""
    });
  }

  async function guardarPago() {
    await fetch(`${API}/mes/${anio}/${mes}/alumno/${editPago.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm)
    });
    setEditPago(null);
    loadMes(); loadCaja();
  }

  async function togglePagoRapido(item) {
    const nuevoPagado = !item.pago.pagado;
    await fetch(`${API}/mes/${anio}/${mes}/alumno/${item.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pagado: nuevoPagado ? 1 : 0,
        monto: item.pago.monto || catalogo.mensualidad,
        recargo_aplicado: item.pago.recargo_aplicado || 0,
        fecha_pago: nuevoPagado ? new Date().toISOString().split("T")[0] : "",
        metodo_pago: item.pago.metodo_pago || "Efectivo",
        notas: item.pago.notas || ""
      })
    });
    loadMes(); loadCaja();
  }

  const horariosDisponibles = sucursalFilter === "todas"
    ? [...new Set([...(catalogo.horarios["Escobedo"]||[]), ...(catalogo.horarios["Montes Berneses"]||[])])]
    : (catalogo.horarios[sucursalFilter] || []);

  const filtrados = datos.filter(a => {
    const matchSearch = `${a.nombre} ${a.apellido}`.toLowerCase().includes(search.toLowerCase());
    const matchSucursal = sucursalFilter === "todas" || a.sucursal === sucursalFilter;
    const matchHorario = horarioFilter === "todos" || a.horario === horarioFilter;
    return matchSearch && matchSucursal && matchHorario;
  });

  const deudores = filtrados.filter(a => !a.pago.pagado);
  const totalDeuda = deudores.reduce((sum, a) => sum + (a.pago.recargo_aplicado ? (a.pago.monto || catalogo.mensualidad) + catalogo.recargo : (a.pago.monto || catalogo.mensualidad)), 0);
  const totalCobrado = filtrados.filter(a => a.pago.pagado).reduce((sum, a) => sum + (a.pago.recargo_aplicado ? a.pago.monto + catalogo.recargo : a.pago.monto), 0);
  const listaFinal = soloDeudores ? deudores : filtrados;

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <select value={mes} onChange={e => setMes(parseInt(e.target.value))} style={{ ...inputStyle, width: "auto", minWidth: 150 }}>
          {catalogo.meses.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
        </select>
        <select value={anio} onChange={e => setAnio(parseInt(e.target.value))} style={{ ...inputStyle, width: "auto", minWidth: 100 }}>
          {[hoy.getFullYear()-1, hoy.getFullYear(), hoy.getFullYear()+1].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Buscar alumno..." style={{ ...inputStyle, flex: 1, minWidth: 180 }} />
        <select value={sucursalFilter} onChange={e => { setSucursalFilter(e.target.value); setHorarioFilter("todos"); }} style={{ ...inputStyle, width: "auto", minWidth: 160 }}>
          <option value="todas">Todas las sucursales</option>
          {catalogo.sucursales.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={horarioFilter} onChange={e => setHorarioFilter(e.target.value)} style={{ ...inputStyle, width: "auto", minWidth: 130 }}>
          <option value="todos">Todos los horarios</option>
          {horariosDisponibles.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <div style={{ background: "#e8e8e8", borderRadius: 8, padding: "10px 18px", textAlign: "center" }}>
          <p style={{ color: "#666", margin: "0 0 2px", fontSize: 11 }}>👥 Total</p>
          <p style={{ color: "#1a1a1a", margin: 0, fontWeight: 700, fontSize: 18 }}>{filtrados.length}</p>
        </div>
        <div style={{ background: "#d4edda", borderRadius: 8, padding: "10px 18px", textAlign: "center" }}>
          <p style={{ color: "#155724", margin: "0 0 2px", fontSize: 11 }}>✅ Cobrado</p>
          <p style={{ color: "#155724", margin: 0, fontWeight: 700, fontSize: 18 }}>${totalCobrado.toLocaleString("es-MX")}</p>
        </div>
        <button onClick={() => setShowCaja(true)} style={{ background: "#e8f4fd", border: "1px solid #3498db", borderRadius: 8, padding: "10px 18px", textAlign: "center", cursor: "pointer", color: "#1a5276" }}>
          <p style={{ margin: "0 0 2px", fontSize: 11 }}>💵 Ver Caja</p>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>Efectivo / Transferencia</p>
        </button>
        <button onClick={() => setSoloDeudores(!soloDeudores)} style={{
          background: soloDeudores ? "#c0392b" : "#fff3cd", border: soloDeudores ? "none" : "1px solid #ffc107",
          borderRadius: 8, padding: "10px 18px", textAlign: "center", cursor: "pointer",
          color: soloDeudores ? "#fff" : "#856404"
        }}>
          <p style={{ margin: "0 0 2px", fontSize: 11 }}>💸 Deudores</p>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 18 }}>{deudores.length} — ${totalDeuda.toLocaleString("es-MX")}</p>
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#c0392b", color: "#ffffff" }}>
              {["Alumno", "Cinta", "Sucursal", "Horario", "Corte", "Estado", "Monto", "Método", "Recargo", ""].map(h => (
                <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontFamily: "'Bebas Neue', cursive", letterSpacing: 1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {listaFinal.map((a, i) => {
              const vencido = !a.pago.pagado && diaActualVsCorte(a.dia_corte);
              return (
                <tr key={a.id} style={{ background: i % 2 === 0 ? "#f9f9f9" : "#ffffff", borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "8px 10px", color: "#1a1a1a", fontWeight: 600 }}>{a.nombre} {a.apellido}</td>
                  <td style={{ padding: "8px 10px" }}><CintaBadge cinta={a.cinta || "Blanca"} /></td>
                  <td style={{ padding: "8px 10px" }}>
                    <span style={{
                      background: a.sucursal === "Montes Berneses" ? "#e8f4fd" : "#fdeeee",
                      color: a.sucursal === "Montes Berneses" ? "#1a5276" : "#922b21",
                      border: `1px solid ${a.sucursal === "Montes Berneses" ? "#3498db" : "#c0392b"}`,
                      borderRadius: 12, padding: "2px 10px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap"
                    }}>{a.sucursal}</span>
                  </td>
                  <td style={{ padding: "8px 10px", color: "#666" }}>{a.horario}</td>
                  <td style={{ padding: "8px 10px", color: "#666" }}>Día {a.dia_corte}</td>
                  <td style={{ padding: "8px 10px" }}>
                    <button onClick={() => togglePagoRapido(a)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700 }}>
                      {a.pago.pagado ? <span style={{ color: "#28a745" }}>✅ Pagado</span> : vencido ? <span style={{ color: "#dc3545" }}>🔴 Vencido</span> : <span style={{ color: "#856404" }}>⏳ Pendiente</span>}
                    </button>
                  </td>
                  <td style={{ padding: "8px 10px", color: "#1a1a1a" }}>${(a.pago.monto || catalogo.mensualidad).toLocaleString("es-MX")}</td>
                  <td style={{ padding: "8px 10px", color: "#666", fontSize: 12 }}>{a.pago.metodo_pago || "Efectivo"}</td>
                  <td style={{ padding: "8px 10px" }}>{a.pago.recargo_aplicado ? <span style={{ color: "#dc3545", fontWeight: 700 }}>+${catalogo.recargo}</span> : "-"}</td>
                  <td style={{ padding: "8px 10px", display: "flex", gap: 6 }}>
                    <button onClick={() => openEditPago(a)} style={{ background: "none", border: "none", color: "#c0392b", cursor: "pointer", fontSize: 18 }}>✏️</button>
                    <button onClick={() => generarTicket(a, a.pago, mes, anio, catalogo.meses)} title="Generar Ticket" style={{ background: "none", border: "none", color: "#1a3a6b", cursor: "pointer", fontSize: 18 }}>🧾</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {listaFinal.length === 0 && <p style={{ color: "#666", textAlign: "center", marginTop: 20 }}>No hay alumnos para mostrar</p>}
      </div>

      {editPago && (
        <Modal title={`Pago — ${editPago.nombre} ${editPago.apellido}`} onClose={() => setEditPago(null)}>
          <div style={{ display: "grid", gap: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#444", cursor: "pointer" }}>
              <input type="checkbox" checked={editForm.pagado} onChange={e => setEditForm({ ...editForm, pagado: e.target.checked })} />
              Pago recibido
            </label>
            <div>
              <label style={{ color: "#666", fontSize: 12, display: "block", marginBottom: 4 }}>Monto ($)</label>
              <input type="number" value={editForm.monto} onChange={e => setEditForm({ ...editForm, monto: parseFloat(e.target.value) })} style={inputStyle} />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#444", cursor: "pointer" }}>
              <input type="checkbox" checked={editForm.recargo_aplicado} onChange={e => setEditForm({ ...editForm, recargo_aplicado: e.target.checked })} />
              Aplicar recargo (+$50)
            </label>
            <div>
              <label style={{ color: "#666", fontSize: 12, display: "block", marginBottom: 4 }}>Método de Pago</label>
              <select value={editForm.metodo_pago} onChange={e => setEditForm({ ...editForm, metodo_pago: e.target.value })} style={inputStyle}>
                {catalogo.metodos_pago.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: "#666", fontSize: 12, display: "block", marginBottom: 4 }}>Fecha de pago</label>
              <input type="date" value={editForm.fecha_pago} onChange={e => setEditForm({ ...editForm, fecha_pago: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ color: "#666", fontSize: 12, display: "block", marginBottom: 4 }}>Notas</label>
              <input value={editForm.notas} onChange={e => setEditForm({ ...editForm, notas: e.target.value })} style={inputStyle} placeholder="Observaciones..." />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button style={btnStyle("#444")} onClick={() => setEditPago(null)}>Cancelar</button>
              <button style={btnStyle()} onClick={guardarPago}>💾 Guardar</button>
            </div>
          </div>
        </Modal>
      )}

      {showCaja && (
        <Modal title={`Caja — ${catalogo.meses[mes-1]} ${anio}`} onClose={() => setShowCaja(false)}>
          {caja.length === 0
            ? <p style={{ color: "#666", textAlign: "center" }}>Sin pagos registrados este mes</p>
            : (() => {
                const sucursales = [...new Set(caja.map(c => c.sucursal))];
                return sucursales.map(suc => {
                  const items = caja.filter(c => c.sucursal === suc);
                  const total = items.reduce((s, c) => s + c.total, 0);
                  return (
                    <div key={suc} style={{ marginBottom: 20 }}>
                      <h4 style={{ color: "#c0392b", fontFamily: "'Bebas Neue', cursive", letterSpacing: 2, margin: "0 0 10px" }}>{suc}</h4>
                      {items.map(item => (
                        <div key={item.metodo_pago} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: item.metodo_pago === "Efectivo" ? "#d4edda" : "#cce5ff", borderRadius: 8, padding: "10px 16px", marginBottom: 8 }}>
                          <span style={{ fontWeight: 700 }}>{item.metodo_pago === "Efectivo" ? "💵" : "🏦"} {item.metodo_pago}</span>
                          <span style={{ color: "#666", fontSize: 13 }}>{item.cantidad} pago(s)</span>
                          <span style={{ fontWeight: 900, fontSize: 18 }}>${item.total.toLocaleString("es-MX")}</span>
                        </div>
                      ))}
                      <div style={{ display: "flex", justifyContent: "space-between", background: "#e8e8e8", borderRadius: 8, padding: "10px 16px", fontWeight: 700 }}>
                        <span>TOTAL {suc.toUpperCase()}</span>
                        <span style={{ color: "#c0392b", fontSize: 18 }}>${total.toLocaleString("es-MX")}</span>
                      </div>
                    </div>
                  );
                });
              })()
          }
        </Modal>
      )}
    </div>
  );
}

// ================= ALUMNOS TAB =================
function AlumnosTab({ catalogo }) {
  const [alumnos, setAlumnos] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editAlumno, setEditAlumno] = useState(null);
  const [historial, setHistorial] = useState(null);
  const [filtroActivo, setFiltroActivo] = useState("activos");
  const [form, setForm] = useState({ nombre: "", apellido: "", telefono: "", sucursal: "Escobedo", horario: "", dia_corte: 5, fecha_inscripcion: "", inscripcion_pagada: false, cinta: "Blanca", activo: true });

  useEffect(() => { loadAlumnos(); }, []);

  async function loadAlumnos() {
    const r = await fetch(`${API}/alumnos`);
    setAlumnos(await r.json());
  }

  async function verHistorial(alumno) {
    const r = await fetch(`${API}/alumnos/${alumno.id}/historial`);
    setHistorial({ alumno, data: await r.json() });
  }

  async function saveAlumno() {
    if (!form.nombre || !form.apellido || !form.horario) return alert("Nombre, apellido y horario son requeridos");
    const payload = { ...form, inscripcion_pagada: form.inscripcion_pagada ? 1 : 0, activo: form.activo ? 1 : 0 };
    if (editAlumno) {
      await fetch(`${API}/alumnos/${editAlumno.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    } else {
      await fetch(`${API}/alumnos`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    }
    setShowForm(false); setEditAlumno(null);
    resetForm();
    loadAlumnos();
  }

  function resetForm() {
    setForm({ nombre: "", apellido: "", telefono: "", sucursal: "Escobedo", horario: "", dia_corte: 5, fecha_inscripcion: "", inscripcion_pagada: false, cinta: "Blanca", activo: true });
  }

  function openEdit(a) {
    setForm({
      nombre: a.nombre, apellido: a.apellido, telefono: a.telefono || "",
      sucursal: a.sucursal, horario: a.horario, dia_corte: a.dia_corte,
      fecha_inscripcion: a.fecha_inscripcion || "", inscripcion_pagada: !!a.inscripcion_pagada,
      cinta: a.cinta || "Blanca", activo: a.activo !== 0
    });
    setEditAlumno(a); setShowForm(true);
  }

  const filtered = alumnos.filter(a => {
    const matchSearch = `${a.nombre} ${a.apellido}`.toLowerCase().includes(search.toLowerCase());
    const matchActivo = filtroActivo === "todos" || (filtroActivo === "activos" ? a.activo !== 0 : a.activo === 0);
    return matchSearch && matchActivo;
  });
  const horariosDisp = catalogo.horarios[form.sucursal] || [];

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Buscar alumno..." style={{ ...inputStyle, flex: 1, minWidth: 200 }} />
        <div style={{ display: "flex", gap: 4 }}>
          {[["activos","✅ Activos"], ["inactivos","❌ Inactivos"], ["todos","Todos"]].map(([val, label]) => (
            <button key={val} onClick={() => setFiltroActivo(val)} style={{
              ...btnStyle(filtroActivo === val ? "#c0392b" : "#e8e8e8"),
              fontSize: 12, padding: "6px 12px", color: filtroActivo === val ? "#fff" : "#444"
            }}>{label}</button>
          ))}
        </div>
        <button style={btnStyle()} onClick={() => { setEditAlumno(null); resetForm(); setShowForm(true); }}>+ Nuevo Alumno</button>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#c0392b", color: "#ffffff" }}>
              {["Alumno", "Cinta", "Sucursal", "Horario", "Día Corte", "Teléfono", "Inscripción", "Estado", "Acciones"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontFamily: "'Bebas Neue', cursive", letterSpacing: 1, fontSize: 15 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, i) => (
              <tr key={a.id} style={{ background: i % 2 === 0 ? "#ffffff" : "#f4f4f4", borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px 12px", color: "#1a1a1a", fontWeight: 600 }}>{a.nombre} {a.apellido}</td>
                <td style={{ padding: "10px 12px" }}><CintaBadge cinta={a.cinta || "Blanca"} /></td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={{
                    background: a.sucursal === "Montes Berneses" ? "#e8f4fd" : "#fdeeee",
                    color: a.sucursal === "Montes Berneses" ? "#1a5276" : "#922b21",
                    border: `1px solid ${a.sucursal === "Montes Berneses" ? "#3498db" : "#c0392b"}`,
                    borderRadius: 12, padding: "2px 10px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap"
                  }}>{a.sucursal}</span>
                </td>
                <td style={{ padding: "10px 12px", color: "#666" }}>{a.horario}</td>
                <td style={{ padding: "10px 12px", color: "#666" }}>Día {a.dia_corte}</td>
                <td style={{ padding: "10px 12px", color: "#666" }}>{a.telefono || "-"}</td>
                <td style={{ padding: "10px 12px" }}>{a.inscripcion_pagada ? "✅" : "⬜"}</td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={{
                    background: a.activo !== 0 ? "#d4edda" : "#f8d7da",
                    color: a.activo !== 0 ? "#155724" : "#721c24",
                    borderRadius: 12, padding: "2px 10px", fontSize: 11, fontWeight: 700
                  }}>{a.activo !== 0 ? "Activo" : "Inactivo"}</span>
                </td>
                <td style={{ padding: "10px 12px", display: "flex", gap: 8 }}>
                  <button style={btnStyle("#e8e8e8")} onClick={() => openEdit(a)}>✏️</button>
                  <button style={btnStyle("#ffffff")} onClick={() => verHistorial(a)}>📋 Historial</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={{ color: "#666", textAlign: "center", marginTop: 30 }}>No se encontraron alumnos</p>}
      </div>
      <p style={{ color: "#666", fontSize: 13, marginTop: 10 }}>Total: {alumnos.length} alumnos</p>

      {showForm && (
        <Modal title={editAlumno ? "Editar Alumno" : "Nuevo Alumno"} onClose={() => setShowForm(false)}>
          <div style={{ display: "grid", gap: 12 }}>
            {[["nombre","Nombre *"], ["apellido","Apellido *"], ["telefono","Teléfono"]].map(([k, label]) => (
              <div key={k}>
                <label style={{ color: "#666", fontSize: 12, display: "block", marginBottom: 4 }}>{label}</label>
                <input value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} style={inputStyle} />
              </div>
            ))}
            <div>
              <label style={{ color: "#666", fontSize: 12, display: "block", marginBottom: 4 }}>Cinta Actual</label>
              <select value={form.cinta} onChange={e => setForm({ ...form, cinta: e.target.value })} style={inputStyle}>
                {catalogo.cintas.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: "#666", fontSize: 12, display: "block", marginBottom: 4 }}>Sucursal</label>
              <select value={form.sucursal} onChange={e => setForm({ ...form, sucursal: e.target.value, horario: "" })} style={inputStyle}>
                {catalogo.sucursales.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: "#666", fontSize: 12, display: "block", marginBottom: 4 }}>Horario *</label>
              <select value={form.horario} onChange={e => setForm({ ...form, horario: e.target.value })} style={inputStyle}>
                <option value="">-- Seleccionar --</option>
                {horariosDisp.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: "#666", fontSize: 12, display: "block", marginBottom: 4 }}>Día de Corte</label>
              <select value={form.dia_corte} onChange={e => setForm({ ...form, dia_corte: parseInt(e.target.value) })} style={inputStyle}>
                <option value={5}>Día 5</option>
                <option value={20}>Día 20</option>
              </select>
            </div>
            <div>
              <label style={{ color: "#666", fontSize: 12, display: "block", marginBottom: 4 }}>Fecha de Inscripción</label>
              <input type="date" value={form.fecha_inscripcion} onChange={e => setForm({ ...form, fecha_inscripcion: e.target.value })} style={inputStyle} />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#444", cursor: "pointer" }}>
              <input type="checkbox" checked={form.inscripcion_pagada} onChange={e => setForm({ ...form, inscripcion_pagada: e.target.checked })} />
              Inscripción pagada (${catalogo.inscripcion} — incluye uniforme)
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#444", cursor: "pointer" }}>
              <input type="checkbox" checked={form.activo} onChange={e => setForm({ ...form, activo: e.target.checked })} />
              Alumno activo
            </label>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
              <button style={btnStyle("#444")} onClick={() => setShowForm(false)}>Cancelar</button>
              <button style={btnStyle()} onClick={saveAlumno}>💾 Guardar</button>
            </div>
          </div>
        </Modal>
      )}

      {historial && (
        <Modal title={`Historial — ${historial.alumno.nombre} ${historial.alumno.apellido}`} onClose={() => setHistorial(null)}>
          {historial.data.length === 0
            ? <p style={{ color: "#666", textAlign: "center" }}>Sin pagos registrados aún</p>
            : (
              <div style={{ display: "grid", gap: 8 }}>
                {historial.data.map(p => (
                  <div key={p.id} style={{
                    background: p.pagado ? "#d4edda" : "#f8d7da",
                    borderRadius: 8, padding: "10px 16px",
                    display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8
                  }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, color: "#1a1a1a" }}>
                        {catalogo.meses[p.mes - 1]} {p.anio}
                      </p>
                      {p.fecha_pago && <p style={{ margin: 0, fontSize: 12, color: "#666" }}>Pagado el {p.fecha_pago}</p>}
                      {p.metodo_pago && <p style={{ margin: 0, fontSize: 12, color: "#666" }}>{p.metodo_pago === "Efectivo" ? "💵" : "🏦"} {p.metodo_pago}</p>}
                      {p.notas && <p style={{ margin: 0, fontSize: 12, color: "#666" }}>{p.notas}</p>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ margin: 0, fontWeight: 700, color: p.pagado ? "#155724" : "#721c24" }}>
                        {p.pagado ? "✅ Pagado" : "⏳ Pendiente"}
                      </p>
                      <p style={{ margin: 0, fontSize: 13, color: "#333" }}>
                        ${p.monto.toLocaleString("es-MX")}{p.recargo_aplicado ? ` + $${catalogo.recargo} recargo` : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </Modal>
      )}
    </div>
  );
}
