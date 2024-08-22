 //para cerrar sesion
 document.getElementById("salir").addEventListener("click", function() {
    localStorage.removeItem("usuarioLogueado");
    window.location.href = "login.html";
});