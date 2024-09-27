//para cerrar sesion
document.getElementById("salir").addEventListener("click", function () {
    localStorage.removeItem("usuarioLogueado");
    window.location.href = "login.html";
});
document.addEventListener('DOMContentLoaded', function () {
    // Obtiene el ID del producto seleccionado desde el almacenamiento local
    const productId = localStorage.getItem('selectedProductId');

    if (productId) {
        // Realiza una solicitud fetch para obtener la información del producto desde la API
        fetch(`https://japceibal.github.io/emercado-api/products/${productId}.json`)
            .then(response => response.json()) // Convierte la respuesta en JSON
            .then(product => {
                // Actualiza la información del producto en el HTML
                document.getElementById('product-name').textContent = product.name;
                document.getElementById('product-description').textContent = product.description;
                document.getElementById('category-name').textContent = product.category;
                document.getElementById('sold-quantity').textContent = product.soldCount;

                // Obtiene el contenedor de imágenes y limpia cualquier contenido previo
                const imagesContainer = document.getElementById('product-images');
                imagesContainer.innerHTML = ''; // Limpia cualquier contenido previo

                if (product.images && product.images.length > 0) {
                    // Crear el contenedor del carrusel
                    const carouselDiv = document.createElement('div');
                    carouselDiv.id = 'productCarousel'; // Asegúrate de que el ID sea único
                    carouselDiv.classList.add('carousel', 'slide');
                    carouselDiv.setAttribute('data-bs-ride', 'carousel');

                    // Crear la parte de carousel-inner
                    const carouselInnerDiv = document.createElement('div');
                    carouselInnerDiv.classList.add('carousel-inner');

                    // Agregar imágenes al carrusel
                    product.images.forEach((imageUrl, index) => {
                        const carouselItemDiv = document.createElement('div');
                        carouselItemDiv.classList.add('carousel-item');

                        // Marca el primer item como activo
                        if (index === 0) {
                            carouselItemDiv.classList.add('active');
                        }

                        // Crea el elemento de imagen y lo agrega al item del carrusel
                        const img = document.createElement('img');
                        img.src = imageUrl;
                        img.classList.add('d-block', 'w-100'); // Clase Bootstrap para asegurar que la imagen ocupa todo el ancho del contenedor
                        img.alt = `Imagen ${index + 1}`;


                        // Ajusta el tamaño de las imágenes sin recortarlas
                        img.style.maxHeight = '400px'; // Ajusta la altura máxima según sea necesario
                        img.style.width = 'auto'; // Ajusta el ancho automáticamente para mantener la proporción
                        img.style.height = 'auto'; // Ajusta la altura automáticamente para mantener la proporción
                        img.style.objectFit = 'contain'; // Asegura que la imagen se ajuste dentro del contenedor sin recortarse
                        img.style.display = 'block'; // Asegura que la imagen se muestre como un bloque
                        img.style.margin = '0 auto'; // Centra la imagen dentro del contenedor
                        


                        carouselItemDiv.appendChild(img); // Añade la imagen al item del carrusel
                        carouselInnerDiv.appendChild(carouselItemDiv); // Añade el item al contenedor del carrusel
                    });

                    // Crear los controles del carrusel (botones de anterior y siguiente)
                    const prevButton = document.createElement('button');
                    prevButton.classList.add('carousel-control-prev');
                    prevButton.setAttribute('type', 'button');
                    prevButton.setAttribute('data-bs-target', '#productCarousel'); // Asegúrate de que el selector coincida con el ID del carrusel
                    prevButton.setAttribute('data-bs-slide', 'prev');
                    prevButton.innerHTML = `
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                `;

                    const nextButton = document.createElement('button');
                    nextButton.classList.add('carousel-control-next');
                    nextButton.setAttribute('type', 'button');
                    nextButton.setAttribute('data-bs-target', '#productCarousel'); // Asegúrate de que el selector coincida con el ID del carrusel
                    nextButton.setAttribute('data-bs-slide', 'next');
                    nextButton.innerHTML = `
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                `;

                    // Ensamblar el carrusel: añade el contenedor de imágenes, y los controles al contenedor del carrusel
                    carouselDiv.appendChild(carouselInnerDiv);
                    carouselDiv.appendChild(prevButton);
                    carouselDiv.appendChild(nextButton);

                    // Agregar el carrusel al contenedor de imágenes
                    imagesContainer.appendChild(carouselDiv);
                } else {
                    // Muestra un mensaje si no hay imágenes disponibles
                    imagesContainer.innerHTML = '<p>No images available.</p>';
                }
            })
            .catch(error => console.error('Error fetching product data:', error));
    } else {
        console.error('No product ID found in localStorage.');
    }
});



//product.images.forEach(imageUrl => {
// const img = document.createElement('img');
// img.src = imageUrl;
//  img.classList.add('img-fluid'); // Agrega clases de Bootstrap para la responsividad
//  imagesContainer.appendChild(img);

