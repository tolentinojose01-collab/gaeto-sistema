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

function ingresarAlSistema() {
    const user = document.getElementById('login-nombre').value;
    const pass = document.getElementById('login-clave').value;
    
    if (user === "Jose Tolentino" && pass === "GT123") {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app-container').style.display = 'block';
        cargarVendedores();
    } else {
        alert("Acceso denegado. Verifica usuario y clave.");
    }
}

function cargarVendedores() {
    db.ref('usuarios').on('value', (snapshot) => {
        const div = document.getElementById('lista-vendedores');
        div.innerHTML = "";
        if (!snapshot.exists()) {
            div.innerHTML = "No hay vendedores aún.";
            return;
        }
        snapshot.forEach((child) => {
            const v = child.val();
            div.innerHTML += `<div style="padding:8px; border-bottom:1px solid #eee;">👤 <strong>${v.nombre}</strong> (Clave: ${v.clave})</div>`;
        });
    });
}

document.getElementById('btn-registrar').onclick = function() {
    const nom = document.getElementById('new-nombre').value;
    const cla = document.getElementById('new-clave').value;

    if(!nom || !cla) {
        alert("Llena ambos campos.");
        return;
    }

    alert("Subiendo a la nube de GAETO...");

    db.ref('usuarios/' + nom.replace(/\s/g, '_')).set({
        nombre: nom,
        clave: cla,
        depto: "VENTAS"
    }).then(() => {
        alert("✅ Vendedor guardado correctamente.");
        document.getElementById('new-nombre').value = "";
        document.getElementById('new-clave').value = "";
    }).catch(e => alert("Error: " + e.message));
};