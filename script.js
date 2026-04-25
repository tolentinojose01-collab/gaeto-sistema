// Configuración de tu base de datos GAETO
const firebaseConfig = {
  apiKey: "AIzaSyCxR1mRUenuJd4Fvd7Q635LJwctrtk0ZVE",
  authDomain: "crm-gaeto.firebaseapp.com",
  databaseURL: "https://crm-gaeto-default-rtdb.firebaseio.com",
  projectId: "crm-gaeto",
  storageBucket: "crm-gaeto.firebasestorage.app",
  messagingSenderId: "1054553218054",
  appId: "1:1054553218054:web:0322b0598710bf655d3787"
};

// Iniciar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Función para entrar (Tus datos: Jose Tolentino / GT123)
function ingresarAlSistema() {
    const user = document.getElementById('login-nombre').value;
    const pass = document.getElementById('login-clave').value;
    
    if (user === "Jose Tolentino" && pass === "GT123") {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app-container').style.display = 'block';
        cargarVendedores();
    } else {
        alert("❌ Datos incorrectos. Verifica tu nombre y clave.");
    }
}

// Función para ver a los vendedores en tiempo real
function cargarVendedores() {
    db.ref('usuarios').on('value', (snapshot) => {
        const listaDiv = document.getElementById('lista-vendedores');
        listaDiv.innerHTML = "";
        if (!snapshot.exists()) {
            listaDiv.innerHTML = "No hay vendedores registrados.";
            return;
        }
        snapshot.forEach((childSnapshot) => {
            const datos = childSnapshot.val();
            listaDiv.innerHTML += `
                <div style="background:#f9f9f9; padding:10px; margin:5px; border-radius:5px; border-left:5px solid #28a745; text-align:left;">
                    <strong>👤 ${datos.nombre}</strong> <br>
                    <small>Clave: ${datos.clave} | Depto: ${datos.depto}</small>
                </div>`;
        });
    });
}

// Lógica del botón de registro
document.getElementById('btn-registrar').onclick = function() {
    const nom = document.getElementById('new-nombre').value;
    const cla = document.getElementById('new-clave').value;

    if(nom === "" || cla === "") {
        alert("⚠️ Por favor escribe el nombre y la clave.");
        return;
    }

    alert("Conectando con la base de datos de GAETO...");

    // Guardar en la nube
    db.ref('usuarios/' + nom.replace(/\s/g, '_')).set({
        nombre: nom,
        clave: cla,
        depto: "VENTAS"
    }).then(() => {
        alert("✅ Vendedor registrado con éxito en la nube.");
        document.getElementById('new-nombre').value = "";
        document.getElementById('new-clave').value = "";
    }).catch((error) => {
        alert("Ocurrió un error: " + error.message);
    });
};