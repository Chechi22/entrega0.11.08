document.addEventListener('DOMContentLoaded', function() {
    const categoriaId = localStorage.getItem('catID'); // Obtén el ID de la categoría desde localStorage

    // Realiza una solicitud fetch a la URL especificada para obtener los datos de los productos
    fetch("https://japceibal.github.io/emercado-api/cats_products/" + categoriaId + ".json")
    .then(response => response.json())
    .then(productos => {
        // Inicializa una cadena vacía que almacenará el contenido HTML generado para cada producto
        let listaProductos = "";

        // Itera sobre cada producto en la lista obtenida del JSON
        for (let producto of productos.products) {
            // Crea un bloque de HTML para cada producto, que incluye un enlace alrededor de la imagen
            listaProductos += `
            <div class="producto-item">
                <a href="product-info.html" onclick="setProductId('${producto.id}')">
                    <img src="${producto.image}" class="imagenProductos" alt="Imagen de ${producto.name}">
                </a>
                <h5>${producto.name}</h5>
                <p>Descripción: ${producto.description}</p>
                <p>${producto.currency} ${producto.cost}</p>
                <p>Vendidos: ${producto.soldCount}</p>
            </div><br>`;
        }
        let nombreCat = productos.catName;
        // Inserta el contenido HTML generado dentro del contenedor con id "productos"
        document.getElementById('titulo').innerHTML = "<h2>Categoría/" + nombreCat + "</h2><br>";
        document.getElementById("productos").innerHTML = listaProductos;
    })
    .catch(error => console.error('Error fetching data:', error)); // Maneja cualquier error que ocurra durante el fetch
});

// Función que guarda el ID del producto en localStorage y redirige a product-info.html
function setProductId(productId) {
    localStorage.setItem('selectedProductId', productId);
}
