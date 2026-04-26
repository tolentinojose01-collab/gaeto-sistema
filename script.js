// CONFIGURACIÓN FIREBASE GAETO
const firebaseConfig = {
  apiKey: "AIzaSyCxR1mRUenuJd4Fvd7Q635LJwctrtk0ZVE",
  authDomain: "crm-gaeto.firebaseapp.com",
  databaseURL: "https://crm-gaeto-default-rtdb.firebaseio.com",
  projectId: "crm-gaeto",
  storageBucket: "crm-gaeto.firebasestorage.app",
  messagingSenderId: "1054553218054",
  appId: "1:1054553218054:web:0322b0598710bf655d3787"
};

// Inicialización de seguridad
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();
let myChart;

// ENTRADA AL GAETO SISTEMA
function ingresarAlSistema() {
    const u = document.getElementById('login-nombre').value.trim();
    const p = document.getElementById('login-clave').value.trim();

    // Acceso exacto con tu nombre
    if(u === "Jose Tolentino" && p === "GT123") {
        document.getElementById('login-screen').style.display='none';
        document.getElementById('app-container').style.display='flex';
        cargarTodo();
    } else { 
        alert("❌ ACCESO DENEGADO\nUsuario: Jose Tolentino\nClave: GT123\n(Respeta mayúsculas y espacios)"); 
    }
}

function cerrarSesion() {
    location.reload();
}

function mostrarSeccion(id) {
    document.getElementById('sec-dashboard').style.display = (id === 'dashboard') ? 'block' : 'none';
    document.getElementById('sec-registro').style.display = (id === 'registro') ? 'block' : 'none';
    document.getElementById('sec-vendedores').style.display = (id === 'vendedores') ? 'block' : 'none';
}

// ALTA VENDEDOR EN GAETO SISTEMA
document.getElementById('btn-registrar').onclick = function() {
    const nom = document.getElementById('new-nombre').value.trim();
    const cla = document.getElementById('new-clave').value.trim();
    
    if(!nom || !cla) {
        alert("⚠️ Por favor escribe el nombre y la clave");
        return;
    }

    // Guardamos en la nube
    db.ref('usuarios/' + nom.replace(/\s/g, '_')).set({
        nombre: nom,
        clave: cla
    }).then(() => {
        alert("✅ ÉXITO: Vendedor " + nom + " registrado en GAETO SISTEMA.");
        document.getElementById('new-nombre').value = "";
        document.getElementById('new-clave').value = "";
    }).catch(err => alert("Error: " + err.message));
};

// GUARDAR VENTA
function guardarVenta() {
    const m = document.getElementById('v-monto').value;
    const p = document.getElementById('v-plaza').value;
    const c = document.getElementById('v-concepto').value;
    
    if(!m || !c) return alert("⚠️ Falta monto o concepto");

    db.ref('ventas').push({
        monto: parseFloat(m),
        plaza: p,
        concepto: c,
        fecha: new Date().toLocaleDateString()
    }).then(() => {
        alert("✅ Venta registrada en la nube.");
        document.getElementById('v-monto').value = "";
        document.getElementById('v-concepto').value = "";
    });
}

function cargarTodo() {
    // Cargar Vendedores en la lista
    db.ref('usuarios').on('value', (snap) => {
        const div = document.getElementById('lista-vendedores');
        div.innerHTML = "";
        snap.forEach(child => {
            div.innerHTML += `<div class="item-v">👤 ${child.val().nombre}</div>`;
        });
    });

    // Cargar Totales y Gráfica
    db.ref('ventas').on('value', (snap) => {
        let total = 0;
        let plazas = {};
        snap.forEach(child => {
            const v = child.val();
            total += v.monto;
            plazas[v.plaza] = (plazas[v.plaza] || 0) + v.monto;
        });
        document.getElementById('total-general').innerText = "$" + total.toLocaleString();
        actualizarGrafica(plazas);
    });
}

function actualizarGrafica(datos) {
    const ctx = document.getElementById('graficaVentas').getContext('2d');
    if(myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(datos),
            datasets: [{ label: 'Ventas por Plaza $', data: Object.values(datos), backgroundColor: '#1a73e8' }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}