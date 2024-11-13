// Defino dos variables para el rango de precios mínimo y máximo
let minimoPrecio = undefined;
let maximoPrecio = undefined;
let searchQuery = undefined;

//criterios de ordenacion
const ORDEN_DE_PRECIO_MENOR_A_MAYOR = "PrecioAscendente";  // Ordenar de MENOR a MAYOR
const ORDEN_DE_PRECIO_MAYOR_A_MENOR = "PrecioDescendente"; // Ordenar de MAYOR a MENOR
const ORDEN_MAYOR_A_MENOR_DE_VENDIDOS = "VendidosDescendentes"; // Ordenar por cantidad de productos vendidos
let criterioDeOrdenacionActual = undefined; //criterio de ordenacion elegido por el usuario


// Obtiene el ID de la categoría seleccionada del almacenamiento local
const categoriaId = localStorage.getItem('catID');

// Escucha el evento "DOMContentLoaded" para ejecutar el código una vez que todo el contenido del DOM haya sido completamente cargado
document.addEventListener('DOMContentLoaded', function () {
    //Llama a la función para mostrar la lista de productos. invoco la funcion creada a continuacion para no perder funcionalidad
    MostrarListaProductos();
});

//Cuando apreto los botones sucede esto:
document.getElementById("menorAMayor").addEventListener("click", function () {
    ordenaYMuestraProductos(ORDEN_DE_PRECIO_MENOR_A_MAYOR);
});

document.getElementById("mayorAMenor").addEventListener("click", function () {
    ordenaYMuestraProductos(ORDEN_DE_PRECIO_MAYOR_A_MENOR);
});

document.getElementById("vendidosDescendente").addEventListener("click", function () {
    ordenaYMuestraProductos(ORDEN_MAYOR_A_MENOR_DE_VENDIDOS);
});

//En funcion del click que se hace en los botones se ordena la lista
function ordenaYMuestraProductos(criterioDeOrdenacionEnviado) {
    criterioDeOrdenacionActual = criterioDeOrdenacionEnviado;

    // Mostrar las productos ordenadas
    MostrarListaProductos();
}

// Asegurarte de agregar el manejador de eventos después de que los productos se hayan cargado
document.addEventListener('DOMContentLoaded', function () {
    // Llama a la función para mostrar la lista de productos (ya debe agregar los eventos)
    MostrarListaProductos();
});

// Función para mostrar los productos
function MostrarListaProductos() {
    fetch("https://japceibal.github.io/emercado-api/cats_products/" + categoriaId + ".json")
        .then(response => response.json())
        .then(productos => {
            let listaProductos = "";
            let listaOrdenada = OrdenarProductos(productos.products);

            for (let producto of listaOrdenada) {
                listaProductos += `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100 shadow-sm">
                            <a href="product-info.html" onclick="setProductId('${producto.id}')">
                                <img src="${producto.image}" class="card-img-top" alt="Imagen de ${producto.name}">
                            </a>
                            <div class="card-body">
                                <h5 class="card-title">${producto.name}</h5>
                                <p class="card-text">${producto.description}</p>
                                <p class="card-text text-primary"><strong>${producto.currency} ${producto.cost}</strong></p>
                                <p class="card-text text-muted">Vendidos: ${producto.soldCount}</p>
                                <!-- Botón de agregar al carrito -->
                                <button class="btn btn-outline-primary agregarCarrito" data-id="${producto.id}">
                                    <i class="fas fa-shopping-cart"></i> Agregar al carrito
                                </button>
                            </div>
                        </div>
                    </div>`;
            }

            document.getElementById("productos").innerHTML = listaProductos;

            // Agregar el manejador de eventos para los botones de agregar al carrito
            document.querySelectorAll('.agregarCarrito').forEach((boton) => {
                boton.addEventListener('click', function (event) {
                    // Obtener el ID del producto desde el atributo data-id
                    let productoId = event.target.getAttribute('data-id');
                    let producto = listaOrdenada.find(item => item.id == productoId);
                    if (producto) {
                        agregarAlCarrito(producto);  // Pasar el objeto producto a la función agregarAlCarrito
                    }
                });
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}



document.addEventListener('DOMContentLoaded', () => {
    // Seleccionar todos los botones de agregar al carrito
    let botonesAgregar = document.querySelectorAll('.agregarCarrito');

    botonesAgregar.forEach((btn) => {
        btn.addEventListener('click', () => {
            // Obtener el ID del producto desde el atributo data-id
            const productId = btn.getAttribute('data-id');

            // Aquí deberías obtener el producto, ya sea desde un array de productos
            // o desde localStorage, según cómo estés manejando tus productos.
            const product = getProductById(productId);

            // Llamar a la función para agregar el producto al carrito
            agregarAlCarrito(product);
        });
    });
});

// Función para obtener un producto por su ID (ajusta según cómo guardes los productos)
function getProductById(productId) {
    const productos = JSON.parse(localStorage.getItem('productos')) || []; // O de otro lugar, si tienes un array de productos
    return productos.find(product => product.id === productId); // O consulta según el producto
}

/// Función para agregar el producto al carrito
function agregarAlCarrito(product) {
    let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    let existeEnCarrito = false;

    // Verifica si el producto ya está en el carrito
    carrito.forEach((productoEnCarrito) => {
        if (productoEnCarrito.id === product.id) {
            productoEnCarrito.quantity += 1;
            productoEnCarrito.subtotal = productoEnCarrito.cost * productoEnCarrito.quantity;
            existeEnCarrito = true;
        }
    });

    // Si no existe en el carrito, agregarlo
    if (!existeEnCarrito) {
        const nuevoProducto = {
            id: product.id,
            name: product.name,
            description: product.description,
            cost: product.cost,
            currency: product.currency,
            image: product.images && product.images.length > 0 ? product.images[0] : 'ruta/por/defecto/imagen.jpg', // Verifica y asigna una imagen por defecto
            subtotal: product.cost,
            quantity: 1
        };
        carrito.push(nuevoProducto);
    }

    // Guardar carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Actualizar el contador de productos en el carrito
    updateCantProductos();
}



// Función para actualizar la cantidad de productos en el carrito
function updateCantProductos() {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    const totalCant = carrito.reduce((acc, producto) => acc + producto.quantity, 0);
    localStorage.setItem('cantProductos', totalCant);
    document.getElementById('cantCarrito').innerText = totalCant;  // Asegúrate de que este id esté en el HTML
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
    limpiarOrden();
    limpiarBuscador()
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

// Función para limpiar ordenamiento
function limpiarOrden() {
    criterioDeOrdenacionActual = undefined;
}

//Funcion para ordenar los productos 

function OrdenarProductos(listaDeProductosAOrdenar) {
    let listaDeProductosOrdenados = [];

    // Ordenar(SORT) productos de menor a mayor
    if (criterioDeOrdenacionActual === ORDEN_DE_PRECIO_MENOR_A_MAYOR) {
        listaDeProductosOrdenados = listaDeProductosAOrdenar.sort(function (a, b) {
            if (a.cost < b.cost) { return -1; }
            if (a.cost > b.cost) { return 1; }
            return 0;
        });
    }
    // Ordenar productos de mayor a menor
    else if (criterioDeOrdenacionActual === ORDEN_DE_PRECIO_MAYOR_A_MENOR) {
        listaDeProductosOrdenados = listaDeProductosAOrdenar.sort(function (a, b) {
            if (a.cost > b.cost) { return -1; }
            if (a.cost < b.cost) { return 1; }
            return 0;
        });
    }
    // Ordenar por cantidad de productos vendidos
    else if (criterioDeOrdenacionActual === ORDEN_MAYOR_A_MENOR_DE_VENDIDOS) {
        listaDeProductosOrdenados = listaDeProductosAOrdenar.sort(function (a, b) {
            if (a.soldCount > b.soldCount) { return -1; }
            if (a.soldCount < b.soldCount) { return 1; }
            return 0;
        });
    }
    else {
        listaDeProductosOrdenados = listaDeProductosAOrdenar;
    }
    return listaDeProductosOrdenados;
}

// Función que guarda el ID del producto en localStorage y redirige a product-info.html
function setProductId(productId) {
    localStorage.setItem('selectedProductId', productId);
}

//apartado para el funcionamiento de la búsqueda en products.html
document.addEventListener('DOMContentLoaded', function () {  
    // Añade un evento de búsqueda para el campo de búsqueda
    document.getElementById("searchInput").addEventListener("keyup", function (event) {
        if (event.key === 'Enter') {
            searchQuery = document.getElementById("searchInput").value.trim().toLowerCase();
            MostrarListaProductos()
        }
    });
});

// Función para limpiar buscador
function limpiarBuscador() {
    document.getElementById("searchInput").value = ""
    searchQuery = undefined;
   }
   
   