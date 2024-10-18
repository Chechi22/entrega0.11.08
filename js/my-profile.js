// Evento para cerrar sesión
document.getElementById("salir").addEventListener("click", function() {
    localStorage.removeItem("usuarioLogueado");
    window.location.href = "login.html";
});

// Obtener el valor del usuario logueado (login.js) desde Local Storage
const usuarioLogueado = localStorage.getItem("usuarioLogueado");

// Verificar si hay un usuario logueado
if (usuarioLogueado) {
    // Asignar el valor del email al span en el HTML
    document.getElementById("profileEmail").textContent = usuarioLogueado;

    // Asignar el valor del email también al campo de entrada en el formulario
    document.getElementById("email").value = usuarioLogueado;
}


// Función para guardar los cambios en el perfil
function guardarCambios() {
    // Obtener los valores de los campos
    const nombre = document.getElementById('nombre').value;
    const segundoNombre = document.getElementById('segundoNombre').value;
    const apellido = document.getElementById('apellido').value;
    const segundoApellido = document.getElementById('segundoApellido').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;

    // Validar campos obligatorios
    if (!nombre || !apellido || !email) {
        alert('Por favor completa los campos obligatorios.');
        return;
    }

    // Guardar en el Local Storage
    const perfil = {
        nombre: nombre,
        segundoNombre: segundoNombre,
        apellido: apellido,
        segundoApellido: segundoApellido,
        email: email,
        telefono: telefono
    };

    localStorage.setItem('perfilUsuario', JSON.stringify(perfil));
    alert('Los cambios han sido guardados exitosamente.');

}

function aplicarModoOscuro() {
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
    const elementosConModoOscuro = [
        document.documentElement, // <html>
        document.body,           
        document.querySelector('main'), 
    ];

    // Aplica o quita la clase dark-mode según la preferencia
    elementosConModoOscuro.forEach(el => el.classList.toggle('dark-mode', darkModeEnabled));
    darkModeSwitch.checked = darkModeEnabled;

    // Evento para alternar modo oscuro y guardar la preferencia
    darkModeSwitch.addEventListener('change', () => {
        elementosConModoOscuro.forEach(el => el.classList.toggle('dark-mode'));
        localStorage.setItem('darkMode', darkModeSwitch.checked);
    });
}

document.addEventListener('DOMContentLoaded', aplicarModoOscuro);
