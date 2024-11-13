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
   
});
//cuando el contenido del documento HTML este cargado
document.addEventListener('DOMContentLoaded',()=>{
    // se obtiene el valor asociado a la clave "usuarioLogueado" del localStorage.
let ElUsuarioEstaLogueado=localStorage.getItem("usuarioLogueado")

 //  ElUsuarioEstaLogueado será null si no hay ningún valor asociado a esa clave, 
 //significa que el usuario no está logueado.
 //if, si el usuario no ha iniciado sesión 
if (ElUsuarioEstaLogueado===null){
    //Muestra el elemento con el ID ingreso, que podría ser un botón o enlace para iniciar sesión.
        document.getElementById("ingreso").style.display = 'block';
        //Oculta el elemento con el ID usuarioMostrado, que podría mostrar el nombre del usuario.
        document.getElementById("usuarioMostrado").style.display = 'none';
        //Redirige al usuario a la página login.html
        location.href="login.html";
    } 
// Si ElUsuarioEstaLogueado no es null, esto indica que el usuario está logueado.

    else {
        //Oculta el elemento con el ID ingreso, ya que no es necesario mostrar la opción de inicio de sesión.
        document.getElementById("ingreso").style.display = 'none';
        //Muestra el elemento con el ID usuarioMostrado
        document.getElementById("usuarioMostrado").style.display = 'inline';
        //Establece el contenido de texto del elemento con el ID usuarioMostrado al valor de ElUsuarioEstaLogueado,
        // que es el nombre del usuario almacenado en localStorage.
        document.getElementById("usuarioMostrado").textContent=ElUsuarioEstaLogueado;
    }
});

document.addEventListener('DOMContentLoaded', function(){
    let cantProductos=localStorage.getItem('cantProductos');
    document.getElementById('cantCarrito').innerText=cantProductos;
})

function updateCantProductos() {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    const totalCant = carrito.reduce((acc, producto) => acc + producto.quantity, 0);
    
    // Guarda el total de productos en localStorage
    localStorage.setItem('cantProductos', totalCant);

    // Actualiza el contador con el id 'cantCarrito'
    const cantCarritoElement = document.getElementById('cantCarrito');
    if (cantCarritoElement) {
        cantCarritoElement.innerText = totalCant;
    }

    // Actualiza todos los elementos con la clase 'cart-count'
    document.querySelectorAll('.cart-count').forEach(function(element) {
        element.innerText = totalCant;
    });
}

// Llama a la función cuando se carga la página
document.addEventListener('DOMContentLoaded', updateCantProductos);