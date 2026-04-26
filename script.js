const firebaseConfig = {
  apiKey: "AIzaSyCxR1mRUenuJd4Fvd7Q635LJwctrtk0ZVE",
  authDomain: "crm-gaeto.firebaseapp.com",
  databaseURL: "https://crm-gaeto-default-rtdb.firebaseio.com",
  projectId: "crm-gaeto",
  storageBucket: "crm-gaeto.firebasestorage.app",
  messagingSenderId: "1054553218054",
  appId: "1:1054553218054:web:0322b0598710bf655d3787"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let myChart;

function ingresarAlSistema() {
    const u = document.getElementById('login-nombre').value;
    const p = document.getElementById('login-clave').value;
    if(u === "Jose Tolentino" && p === "GT123") {
        document.getElementById('login-screen').style.display='none';
        document.getElementById('app-container').style.display='flex';
        cargarDashboard();
    } else { alert("Acceso Incorrecto"); }
}

function mostrarSeccion(id) {
    ['sec-dashboard', 'sec-registro', 'sec-vendedores'].forEach(s => {
        document.getElementById(s).style.display = (s === 'sec-'+id) ? 'block' : 'none';
    });
}

function guardarVenta() {
    const m = document.getElementById('v-monto').value;
    const p = document.getElementById('v-plaza').value;
    const c = document.getElementById('v-concepto').value;
    if(!m || !c) return alert("Por favor llena todos los campos");

    db.ref('ventas').push({
        monto: parseFloat(m),
        plaza: p,
        concepto: c,
        fecha: new Date().toLocaleDateString()
    }).then(() => {
        alert("¡Venta registrada con éxito!");
        document.getElementById('v-monto').value = "";
        document.getElementById('v-concepto').value = "";
        cargarDashboard();
    });
}

function cargarDashboard() {
    db.ref('ventas').on('value', (snapshot) => {
        let total = 0;
        let datosPlazas = {};
        snapshot.forEach(child => {
            const v = child.val();
            total += v.monto;
            datosPlazas[v.plaza] = (datosPlazas[v.plaza] || 0) + v.monto;
        });
        document.getElementById('total-general').innerText = "$" + total.toLocaleString();
        actualizarGrafica(datosPlazas);
    });
}

function actualizarGrafica(datos) {
    const ctx = document.getElementById('graficaVentas').getContext('2d');
    if(myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(datos),
            datasets: [{ label: 'Ventas por Plaza', data: Object.values(datos), backgroundColor: '#1a73e8' }]
        }
    });
}