// Defino dos variables para el rango de precios mínimo y máximo
let minimoPrecio = undefined;
let maximoPrecio = undefined;


// Asigna un evento de clic al botón de "salir" para cerrar la sesión
document.getElementById("salir").addEventListener("click", function () {
    // Elimina el item "usuarioLogueado" del almacenamiento local (localStorage), lo que efectivamente cierra la sesión del usuario
    localStorage.removeItem("usuarioLogueado");
    // Redirige al usuario a la página de login
    window.location.href = "login.html";
});
// Obtiene el ID de la categoría seleccionada del almacenamiento local
const categoriaId = localStorage.getItem('catID'); 

// Escucha el evento "DOMContentLoaded" para ejecutar el código una vez que todo el contenido del DOM haya sido completamente cargado
document.addEventListener('DOMContentLoaded', function () {
    //Llama a la función para mostrar la lista de productos. invoco la funcion creada a continuacion para no perder funcionalidad
    MostrarListaProductos();
});

// Creo una funcion mostrar lista de productos con el llamado a la API

function MostrarListaProductos() {
    // Realiza una solicitud fetch a la URL especificada para obtener los datos de los productos (en este caso, una lista de autos)
    fetch("https://japceibal.github.io/emercado-api/cats_products/" + categoriaId + ".json")//añade el id de la categoria al link de la api
        .then(response => response.json()) // Convierte la respuesta a un objeto JSON
        .then(productos => {
            // Inicializa una cadena vacía que almacenará el contenido HTML generado para cada auto
            let listaProductos = "";

            // Itera sobre cada producto en la lista obtenida del JSON
            for (let producto of productos.products) {
                // creo un if, si el rango de precio minimo y maximo es nulo o si el precio del producto es menor al maximo y mayor al minimo, muestra los productos
                if ((minimoPrecio == undefined && maximoPrecio == undefined) || (maximoPrecio != undefined && minimoPrecio == undefined && producto.cost <= maximoPrecio) || (minimoPrecio != undefined && maximoPrecio == undefined && producto.cost >= minimoPrecio) || (producto.cost <= maximoPrecio && producto.cost >= minimoPrecio)) {
                    // Crea un bloque de HTML para cada producto, que incluye una imagen, nombre, descripción, costo y cantidad vendida
                    listaProductos += `
<div class="producto-item">
    <img src="${producto.image}" class="imagenProductos" alt="Imagen de ${producto.name}">
    <h5>${producto.name}</h5>
    <p>Descripción: ${producto.description}</p>
    <p>${producto.currency} ${producto.cost}</p>
    <p>Vendidos: ${producto.soldCount}</p>
</div><br>`;

                }

            }
             // Si no hay productos que coincidan con el rango de precios, muestra un mensaje indicando que no hay productos en el rango
            if (listaProductos == "") {
                listaProductos += `<p>No hay productos en el rango de precios indicado</p>`;
            }
   // Obtiene el nombre de la categoría y lo muestra en el título
            let nombreCat = productos.catName;
            // Inserta el contenido HTML generado dentro del contenedor con id "productos"
            document.getElementById('titulo').innerHTML = "<h2>Categoría/" + nombreCat + "</h2><br>";
            document.getElementById("productos").innerHTML = listaProductos;
        })
        .catch(error => console.error('Error fetching data:', error)); // Maneja cualquier error que ocurra durante el fetch

}
// Creando el filtro de precio

document.getElementById("rangoFiltroPrecio").addEventListener("click", function () {
    //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
    //de productos por categoría.
    minimoPrecio = document.getElementById("precioMinimo").value;
    maximoPrecio = document.getElementById("precioMaximo").value;

    if ((minimoPrecio != undefined) && (minimoPrecio != "") && (parseInt(minimoPrecio)) >= 0) {
        minimoPrecio = parseInt(minimoPrecio);
    }
    else {
        minimoPrecio = undefined;
    }

    if ((maximoPrecio != undefined) && (maximoPrecio != "") && (parseInt(maximoPrecio)) >= 0) {
        maximoPrecio = parseInt(maximoPrecio);
    }
    else {
        maximoPrecio = undefined;
    }
      // Verifica que el rango de precios sea válido; si el máximo es menor o igual al mínimo, muestra un mensaje de error
    if (maximoPrecio != undefined && minimoPrecio != undefined && maximoPrecio <= minimoPrecio) {
        alert("Error en rango de precios"); 
        limpiarFiltro(); // Limpia los filtros si hay un error en el rango
    }
     // Vuelve a mostrar la lista de productos aplicando los nuevos filtros de precio
    MostrarListaProductos();

});
// Evento para borrar los filtros de precios
document.getElementById("limpiarRangoFiltroPrecio").addEventListener("click", function () {
   // Limpia los filtros y vuelve a mostrar la lista de productos sin filtros
    limpiarFiltro();
    MostrarListaProductos();
});

// Función para limpiar los filtros de precios
function limpiarFiltro() {
      // Limpia los valores de los campos de precio mínimo y máximo en el formulario
    document.getElementById("precioMaximo").value = "";
    document.getElementById("precioMinimo").value = "";

    minimoPrecio = undefined;
    maximoPrecio = undefined;

}