const firebaseConfig = {
  apiKey: "AIzaSyCxR1mRUenuJd4Fvd7Q635LJwctrtk0ZVE",
  authDomain: "gaeto-ventas-2026.firebaseapp.com",
  databaseURL: "https://gaeto-ventas-2026-default-rtdb.firebaseio.com",
  projectId: "gaeto-ventas-2026",
  storageBucket: "gaeto-ventas-2026.appspot.com",
  messagingSenderId: "1054553218054",
  appId: "1:1054553218054:web:0322b0598710bf655d3787"
};

if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const db = firebase.database();
let myChart;

function ingresarAlSistema() {
    const u = document.getElementById('login-nombre').value.toLowerCase().trim();
    const p = document.getElementById('login-clave').value.trim();

    if((u === "jose" || u === "jose tolentino") && p === "GT123") {
        document.getElementById('login-screen').style.display='none';
        document.getElementById('app-container').style.display='flex';
        cargarTodo();
    } else { 
        alert("DATOS INCORRECTOS\nUsa: Jose\nClave: GT123"); 
    }
}

function mostrarSeccion(id) {
    document.getElementById('sec-dashboard').style.display = 'none';
    document.getElementById('sec-registro').style.display = 'none';
    document.getElementById('sec-vendedores').style.display = 'none';
    document.getElementById('sec-' + id).style.display = 'block';
}

document.getElementById('btn-registrar').onclick = function() {
    const nom = document.getElementById('new-nombre').value.trim();
    const cla = document.getElementById('new-clave').value.trim();
    if(!nom || !cla) return alert("Llena los campos");

    db.ref('usuarios/' + nom.replace(/\s/g, '_')).set({
        nombre: nom,
        clave: cla
    }).then(() => {
        alert("✅ ÉXITO: Vendedor guardado.");
        document.getElementById('new-nombre').value = "";
        document.getElementById('new-clave').value = "";
    }).catch(err => alert("ERROR: " + err.message));
};

function guardarVenta() {
    const m = document.getElementById('v-monto').value;
    const p = document.getElementById('v-plaza').value;
    const c = document.getElementById('v-concepto').value;
    if(!m || !c) return alert("Llena monto y concepto");

    db.ref('ventas').push({
        monto: parseFloat(m),
        plaza: p,
        concepto: c,
        fecha: new Date().toLocaleDateString()
    }).then(() => {
        alert("✅ Venta Guardada");
        document.getElementById('v-monto').value = "";
        document.getElementById('v-concepto').value = "";
    });
}

function cargarTodo() {
    db.ref('usuarios').on('value', (snap) => {
        const div = document.getElementById('lista-vendedores');
        div.innerHTML = "";
        snap.forEach(child => {
            div.innerHTML += `<div style="background:white; padding:10px; margin:5px; border-left:5px solid #1a73e8; border-radius:5px;">👤 ${child.val().nombre}</div>`;
        });
    });

    db.ref('ventas').on('value', (snap) => {
        let total = 0; let plazas = {};
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
            datasets: [{ label: 'Ventas $', data: Object.values(datos), backgroundColor: '#1a73e8' }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function cerrarSesion() { location.reload(); }