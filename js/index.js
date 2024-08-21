document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
    //para cerrar sesion
    document.getElementById("salir").addEventListener("click", function() {
        localStorage.removeItem("usuarioLogueado");
        window.location.href = "login.html";
    });
});

var ElUsuarioEstaLogueado=localStorage.getItem("usuarioLogueado")
    if (ElUsuarioEstaLogueado===null){
        document.getElementById("ingreso").style.display = 'block';
        document.getElementById("salir").style.display = 'none';
        document.getElementById("usuarioMostrado").style.display = 'none';
    } 
    else {
        document.getElementById("ingreso").style.display = 'none';
        document.getElementById("salir").style.display = 'inline';
        document.getElementById("usuarioMostrado").style.display = 'inline';
        document.getElementById("usuarioMostrado").textContent=ElUsuarioEstaLogueado;
        
    }

    