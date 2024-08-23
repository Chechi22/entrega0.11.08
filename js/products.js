document.addEventListener('DOMContentLoaded', function(){
    fetch("https://japceibal.github.io/emercado-api/cats_products/101.json")
    .then(response=>response.json())
    .then(autos=>{

        let listaautos="";
        for(let auto of autos.products){
            listaautos+="<table><tr><td rowspan=4 class='imagenAutos'><img src="+ auto.image +"></td><td>"+ auto.name +"</td></tr><tr><td>Descripción: "+ auto.description
            +"</td></tr><tr><td>"+auto.currency+" "+auto.cost+"</td></tr><tr><td>Vendidos: "+auto.soldCount+"</td></tr></table> <br>";
        }
        document.getElementById("autos").innerHTML=listaautos;

    })
})

