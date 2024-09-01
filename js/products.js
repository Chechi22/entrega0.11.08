// Asigna un evento de clic al botón de "salir" para cerrar la sesión
document.getElementById("salir").addEventListener("click", function() {
    // Elimina el item "usuarioLogueado" del almacenamiento local (localStorage), lo que efectivamente cierra la sesión del usuario
    localStorage.removeItem("usuarioLogueado");
    // Redirige al usuario a la página de login
    window.location.href = "login.html";
});

// Escucha el evento "DOMContentLoaded" para ejecutar el código una vez que todo el contenido del DOM haya sido completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Realiza una solicitud fetch a la URL especificada para obtener los datos de los productos (en este caso, una lista de autos)
    fetch("https://japceibal.github.io/emercado-api/cats_products/101.json")
    .then(response => response.json()) // Convierte la respuesta a un objeto JSON
    .then(autos => {
        // Inicializa una cadena vacía que almacenará el contenido HTML generado para cada auto
        let listaautos = "";

        // Itera sobre cada producto (auto) en la lista obtenida del JSON
        for (let auto of autos.products) {
            // Crea un bloque de HTML para cada auto, que incluye una imagen, nombre, descripción, costo y cantidad vendida
            listaautos += `
            <div class="auto-item">
                <img src="${auto.image}" class="imagenAutos" alt="Imagen de ${auto.name}">
                <h5>${auto.name}</h5>
                <p>Descripción: ${auto.description}</p>
                <p>${auto.currency} ${auto.cost}</p>
                <p>Vendidos: ${auto.soldCount}</p>
            </div><br>`;
        }

        // Inserta el contenido HTML generado dentro del contenedor con id "autos"
        document.getElementById("autos").innerHTML = listaautos;
    })
    .catch(error => console.error('Error fetching data:', error)); // Maneja cualquier error que ocurra durante el fetch
});