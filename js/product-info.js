 //para cerrar sesion
 document.getElementById("salir").addEventListener("click", function() {
    localStorage.removeItem("usuarioLogueado");
    window.location.href = "login.html";
});

document.addEventListener('DOMContentLoaded', function() {
    const productId = localStorage.getItem('selectedProductId');

    if (productId) {
        // Realiza una solicitud fetch para obtener la información del producto.
        fetch(`https://japceibal.github.io/emercado-api/products/${productId}.json`)
        .then(response => response.json())
        .then(product => {
            // Actualiza la información del producto en el HTML
            document.getElementById('product-name').textContent = product.name;
            document.getElementById('product-description').textContent = product.description;
            document.getElementById('category-name').textContent = product.category;
            document.getElementById('sold-quantity').textContent = product.soldCount;

            // Agrega las imágenes del producto
            const imagesContainer = document.getElementById('product-images');
            imagesContainer.innerHTML = ''; // Limpia cualquier contenido previo
            product.images.forEach(imageUrl => {
                const img = document.createElement('img');
                img.src = imageUrl;
                img.classList.add('img-fluid'); // Agrega clases de Bootstrap para la responsividad
                imagesContainer.appendChild(img);

                
            });
        })
        .catch(error => console.error('Error fetching product data:', error));
    } else {
        console.error('No product ID found in localStorage.');
    }
});
