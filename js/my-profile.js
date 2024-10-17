// Evento para cerrar sesión
document.getElementById("salir").addEventListener("click", function () {
    localStorage.removeItem("usuarioLogueado");
    window.location.href = "login.html";
});

// Variable para almacenar la imagen de perfil
let imagenPerfil = undefined

// Obtener el valor del usuario logueado (login.js) desde Local Storage
const emailUsuarioLogueado = localStorage.getItem("usuarioLogueado");

// Verificar si hay un email de usuario logueado
if (emailUsuarioLogueado) {

    //devuelve el perfil del usuario logueado
    var perfilUsuariologueado = JSON.parse(localStorage.getItem(emailUsuarioLogueado))
    if (perfilUsuariologueado) {
       
        // Asigna los valores del perfil a los campos correspondientes en el formulario
        document.getElementById('nombre').value = perfilUsuariologueado.nombre;
        document.getElementById('segundoNombre').value = perfilUsuariologueado.segundoNombre;
        document.getElementById('apellido').value = perfilUsuariologueado.apellido;
        document.getElementById('segundoApellido').value = perfilUsuariologueado.segundoApellido;
        document.getElementById('email').value = perfilUsuariologueado.email;
        document.getElementById('telefono').value = perfilUsuariologueado.telefono;
       
   // Si hay una foto de perfil, la asigna al elemento de imagen correspondiente
        if (perfilUsuariologueado.foto) {
            imagenPerfil = perfilUsuariologueado.foto;
            document.getElementById('profilePic').src = perfilUsuariologueado.foto;
        }
    }


    // Asignar el valor del email al span en el HTML
    document.getElementById("profileEmail").textContent = emailUsuarioLogueado;

    // Asignar el valor del email también al campo de entrada en el formulario
    document.getElementById("email").value = emailUsuarioLogueado;
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
        return;  // Salir de la función si hay campos vacíos
    }

     // Crear un objeto con los datos del perfil 
    const perfil = {
        nombre: nombre,
        segundoNombre: segundoNombre,
        apellido: apellido,
        segundoApellido: segundoApellido,
        email: email,
        telefono: telefono,
        foto: imagenPerfil // Incluye la imagen de perfil
    };

    // Guarda el perfil en Local Storage, usando el email como clave
    //localStorage.setItem('perfilUsuario', JSON.stringify(perfil)); modifico para que el valor se modifique al cambiar el usuario.
    localStorage.setItem(perfil.email, JSON.stringify(perfil));
    alert('Los cambios han sido guardados exitosamente.');
}

// Funcionalidad para cambiar la foto de perfil
document.addEventListener('DOMContentLoaded', function () {
    const profilePicInput = document.getElementById('profilePicInput'); // Referencia a la entrada de la imagen
    const profilePic = document.getElementById('profilePic'); // Referencia a la imagen de perfil

    // Manejar cambio de foto de perfil
    profilePicInput.addEventListener('change', function (e) {
        const file = e.target.files[0]; // Obtener el archivo subido
        if (file) {
            const reader = new FileReader(); // Crear un lector de archivos
            reader.onload = function (e) {
                profilePic.src = e.target.result; // Cambiar la imagen de perfil
                imagenPerfil = e.target.result; // Guardar la imagen en localStorage
            };
            reader.readAsDataURL(file); // Leer el archivo como URL de datos
        }
    });


});