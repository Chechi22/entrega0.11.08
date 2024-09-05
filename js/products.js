// Asigna un evento de clic al botón de "salir" para cerrar la sesión
document.getElementById("salir").addEventListener("click", function() {
    // Elimina el item "usuarioLogueado" del almacenamiento local (localStorage), lo que efectivamente cierra la sesión del usuario
    localStorage.removeItem("usuarioLogueado");
    // Redirige al usuario a la página de login
    window.location.href = "login.html";
});

const categoriaId=localStorage.getItem('catID'); //guarda el valor del id de la categoria que selecciono el usuario

// Escucha el evento "DOMContentLoaded" para ejecutar el código una vez que todo el contenido del DOM haya sido completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Realiza una solicitud fetch a la URL especificada para obtener los datos de los productos (en este caso, una lista de autos)
    fetch("https://japceibal.github.io/emercado-api/cats_products/"+categoriaId+".json")//añade el id de la categoria al link de la api
    .then(response => response.json()) // Convierte la respuesta a un objeto JSON
    .then(productos => {
        // Inicializa una cadena vacía que almacenará el contenido HTML generado para cada auto
        let listaProductos = "";

        // Itera sobre cada producto (auto) en la lista obtenida del JSON
        for (let producto of productos.products) {
            // Crea un bloque de HTML para cada auto, que incluye una imagen, nombre, descripción, costo y cantidad vendida
            listaProductos += `
            <div class="producto-item">
                <img src="${producto.image}" class="imagenProductos" alt="Imagen de ${producto.name}">
                <h5>${producto.name}</h5>
                <p>Descripción: ${producto.description}</p>
                <p>${producto.currency} ${producto.cost}</p>
                <p>Vendidos: ${producto.soldCount}</p>
            </div><br>`;
        }
        let nombreCat = productos.catName;
        // Inserta el contenido HTML generado dentro del contenedor con id "autos"
        document.getElementById('titulo').innerHTML= "<h2>Categoría/"+nombreCat+"</h2><br>";
        document.getElementById("productos").innerHTML = listaProductos;
    })
    .catch(error => console.error('Error fetching data:', error)); // Maneja cualquier error que ocurra durante el fetch
});