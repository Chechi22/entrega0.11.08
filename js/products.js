
//para cerrar sesion
document.getElementById("salir").addEventListener("click", function() {
    localStorage.removeItem("usuarioLogueado");
    window.location.href = "login.html";
});

document.addEventListener('DOMContentLoaded', function(){
    fetch("https://japceibal.github.io/emercado-api/cats_products/101.json")
    .then(response=>response.json())
    .then(autos=>{

        let listaautos="";
        for(let auto of autos.products){
            listaautos+=`
            <div class="auto-item">
                <img src="${auto.image}" class="imagenAutos" alt="Imagen de ${auto.name}">
                <h5>${auto.name}</h5>
                <p>Descripción: ${auto.description}</p>
                <p>${auto.currency} ${auto.cost}</p>
                <p>Vendidos: ${auto.soldCount}</p>
            </div><br>`;
        }
        document.getElementById("autos").innerHTML=listaautos;
    })
});

