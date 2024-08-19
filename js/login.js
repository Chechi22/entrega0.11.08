// Agrega un "listener" para el evento de envío del formulario
// Esto significa que cuando el usuario intente enviar el formulario, se ejecutará la función especificada
document.getElementById("loginForm").addEventListener("submit", function (event) {

    // Evita que el formulario se envíe de la forma tradicional, que recargaría la página
    // Esto nos permite manejar el envío del formulario con JavaScript en lugar de hacer una recarga
    event.preventDefault();

    // Obtiene el valor que el usuario ha ingresado en el campo de nombre de usuario
    // Usa el ID "username" para encontrar el campo de entrada correspondiente en el HTML
    const username = document.getElementById("username").value;

    // Obtiene el valor que el usuario ha ingresado en el campo de contraseña
    // Usa el ID 'password' para encontrar el campo de entrada correspondiente en el HTML
    const password = document.getElementById("password").value;

    // Verifica si el nombre de usuario y la contraseña son correctos
    // Este es solo un ejemplo de verificación. En un caso real, la verificación de credenciales se realizaría en un servidor
    if (username === "USUARIO" && password === "CONTRASEÑA") {
        // Si el nombre de usuario y la contraseña son correctos, redirige al usuario a la página principal
        window.location.href = "index.html";
    } else {
        // Si el nombre de usuario o la contraseña son incorrectos, muestra un mensaje de error
        // El mensaje se mostrará en el elemento con el ID 'error-message'
        document.getElementById("error-message").textContent = "Nombre de usuario o contraseña incorrectos";
    }
});
