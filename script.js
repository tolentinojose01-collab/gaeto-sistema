// CONFIGURACIÓN FIREBASE GAETO VENTAS 2026
const firebaseConfig = {
  apiKey: "AIzaSyCxR1mRUenuJd4Fvd7Q635LJwctrtk0ZVE",
  authDomain: "gaeto-ventas-2026.firebaseapp.com",
  databaseURL: "https://gaeto-ventas-2026-default-rtdb.firebaseio.com",
  projectId: "gaeto-ventas-2026",
  storageBucket: "gaeto-ventas-2026.appspot.com",
  messagingSenderId: "1054553218054",
  appId: "1:1054553218054:web:0322b0598710bf655d3787"
};

// Inicializar Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();
let myChart;

// 1. FUNCIÓN PARA ENTRAR AL SISTEMA
function ingresarAlSistema() {
    const u = document.getElementById('login-nombre').value.toLowerCase().trim();
    const p = document.getElementById('login-clave').value.trim();

    // Acceso simplificado para ti
    if((u === "jose" || u === "jose tolentino") && p === "GT123") {
        document.getElementById('login-screen').style.display='none';
        document.getElementById('app-container').style.display='flex';
        cargarTodo(); 
    } else { 
        alert("DATOS INCORRECTOS\nUsuario: Jose\nClave: GT123"); 
    }
}

// 2. REGISTRAR VENDEDOR (Aquí es donde daba el error de permiso)
document.getElementById('btn-registrar').onclick = function() {
    const nom = document.getElementById('new-nombre').value.trim();
    const cla = document.getElementById('new-clave').value.trim();
    
    if(!nom || !cla) {
        alert("Por favor, escribe nombre y clave");
        return;
    }

    // Guardar en la nueva base de datos
    db.ref('usuarios/' + nom.replace(/\s/g, '_')).set({
        nombre: nom,
        clave: cla
    }).then(() => {
        alert("✅ ÉXITO: Vendedor " + nom + " registrado correctamente.");
        document.getElementById('new-nombre').value = "";
        document.getElementById('new-clave').value = "";
    }).catch(err => {
        alert("ERROR DE PERMISO: " + err.message + "\nRevisa que en Firebase diga 'true'.");
    });
};

// 3. CARGAR DATOS EN TIEMPO REAL
function cargarTodo() {
    // Cargar Lista de Vendedores
    db.ref('usuarios').on('value', (snap) => {
        const div = document.getElementById('lista-vendedores');
        div.innerHTML = "";
        snap.forEach(child => {
            div.innerHTML += `<div style="background:#fff; padding:10px; margin:5px 0; border-left:4px solid #28a745; border-radius:5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">👤 ${child.val().nombre}</div>`;
        });
    });

    // Cargar Ventas y Gráfica
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

// 4. FUNCIÓN PARA LA GRÁFICA DE VENTAS
function actualizarGrafica(datos) {
    const ctx = document.getElementById('graficaVentas').getContext('2d');
    if(myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(datos),
            datasets: [{ 
                label: 'Ventas por Plaza $', 
                data: Object.values(datos), 
                backgroundColor: '#1a73e8' 
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false 
        }
    });
}

// 5. CERRAR SESIÓN
function cerrarSesion() {
    location.reload();
}