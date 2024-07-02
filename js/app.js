//variables 
const carrito = document.querySelector('#carrito');
const listaCursos = document.querySelector('#lista-cursos');
const vaciarCarrito = document.querySelector('#vaciar-carrito');
const contenedorCarrito = document.querySelector('tbody');
let articulosCarrito=[];

const agregarCurso = (e) =>{
    if(e.target.classList.contains('agregar-carrito')){
        e.preventDefault()
        const cursoSeleccionado = e.target.parentElement.parentElement;
        LeerDatos(cursoSeleccionado);
    }
} 
const LeerDatos = (curso) =>{
    //acceder a los elementos del div . Lee el contenido del html y extrae la informacion del curso 
    const infoCurso={
    imagen: curso.querySelector('img').src,
    titulo :curso.querySelector('h4').textContent,
    precio:curso.querySelector('span').textContent,
    id:curso.querySelector('a').getAttribute('data-id'),
    cantidad: 1,
    }
    //Se reutiliza la funcion info curso ya que contiene la información, en este caso el id , que voy a usar a la hora de verificar el stock
    //[infocurso.id-1] porque si el id es 1 empieza en 0 porque es un array , el id sería como el length del array
    const stock = conciertos [infoCurso.id-1].stock
    //La condición es 1 y no 0 , ya que al poner 0 te permite comprar una entrada más, y se supone que ya no tiene que haber 
    if (stock == 1) {
        curso.querySelector('.stocks').textContent = `AGOTADO`
        
    }
    else{
        //cada vez que presione el boton comprar se va a restar el stock 
        curso.querySelector('.stocks').textContent = `entradas: ${stock-1}`
        conciertos[infoCurso.id-1].stock = conciertos[infoCurso.id-1].stock-1
         //fijarse si existe ya en el carrito comparando el id ,  luego se va iterando con el map, hasta que econtremos uno duplicado 
        const existe = articulosCarrito.some(curso => curso.id == infoCurso.id);
         //si el id del curso comprado coincide con que el que esta en el carrito de compras , suma la cantidad
         if (existe){
            const cursos = articulosCarrito.map(curso=> {
              if(curso.id == infoCurso.id){
                curso.cantidad++;
                return curso;

            }
            else{
                return curso;
            }
        })
        //desesctructura el arreglo en ambos casos , agrega el objeto al carrito 
        articulosCarrito=[...cursos]
    }
    else{
        articulosCarrito=[...articulosCarrito,infoCurso]
    }
   
    carritoHTML()
}};
//para que sea más ordenado , se hizo una función en donde van a estar todos los eventos adicionados 
cargarEventos()
function cargarEventos(){
    //agregar un curso presionando agregar 
    listaCursos.addEventListener('click', agregarCurso)
    //elimina cursos del carrito 
    carrito.addEventListener('click',actualizaCantidad)
    //vaciar carrito (limpia de la base de datos ,y visualmente del html)
    vaciarCarrito.addEventListener('click',() =>{
        articulosCarrito = [];
        limpiarHTML();
        //modificarStock();
        
    });

   
}
//muestra el carrito de compras en el html 
//En el table body vacio me va a ir agreando el curso 
function carritoHTML(){
    limpiarHTML()
    articulosCarrito.forEach(curso =>{
        //desestructuraccion del objeto y crear el carrito de compras html 
        const{titulo,imagen,precio,cantidad,id}=curso; 
        const row= document.createElement('tr');
        row.innerHTML=`
        <td><img src='${imagen}'heigth=100px width=150px> </td>
        <td class='blanco'>${titulo}</td>
        <td class='blanco'>${precio}</td>
        <td class='blanco'>${cantidad}</td>
        <td><a class ="decrementa-cantidad" data-id = ${id}>- </a></td>
        <td><a class ="incrementa-cantidad" data-id = ${id}> + </a></td>
        <td> <a href ="#" class ="borrar-curso" data-id = ${id} > X </a></td>
        `;
        contenedorCarrito.appendChild(row);
    })
}
function limpiarHTML(){
while(contenedorCarrito.firstChild){
contenedorCarrito.removeChild(contenedorCarrito.firstChild);
}}
/*
function modificarStock(articulo) {
            //const stock = conciertos[articulo.id-1].stock
            //listaCursos.querySelector(`#stock-${articulo.id}`).innerHTML = `entradas: ${stock+articulo.cantidad}`
            //conciertos[articulo.id-1].stock = stock + articulo.cantidad
}*/




//funcion eliminar
function actualizaCantidad(e) {
    // boton eliminar , si contiene esa clase hace un filtro con todos los curso.id diferentes a cursoId 
    if(e.target.classList.contains('borrar-curso')){
        const cursoId = e.target.getAttribute('data-id')
        e.preventDefault()
        articulosCarrito.forEach(articulo=>{ 
            if (cursoId == articulo.id) {
                articulosCarrito = articulosCarrito.filter(articulo=>articulo.id !== cursoId)
                const stock = conciertos[articulo.id-1].stock
                listaCursos.querySelector(`#stock-${articulo.id}`).innerHTML = `entradas: ${stock+articulo.cantidad}`
                conciertos[articulo.id-1].stock = stock + articulo.cantidad
                carritoHTML()// elimina el curso del carrito 
            }
        })
    }
    //boton mas , si el id del concierto comprado coindice con el id del articulo que esta en el carrito previamene , le va a sumar la cantidad 
    if (e.target.classList.contains('incrementa-cantidad')){
        const sumaId = e.target.getAttribute('data-id');
         articulosCarrito.forEach(articulo =>{
            //selecciono el stock actual 
           const stock = conciertos[articulo.id-1].stock
           if (stock < 1) {
               listaCursos.querySelector(`#stock-${articulo.id}`).innerHTML = `AGOTADO`
            } else {
                if (sumaId === articulo.id) {
                    articulo.cantidad++;
                    carritoHTML(); 
                    listaCursos.querySelector(`#stock-${articulo.id}`).innerHTML = `entradas: ${stock-1}`
                    conciertos[articulo.id-1].stock = stock-1
                }   
            }
       })
    }
   //boton menos
    if (e.target.classList.contains('decrementa-cantidad')){ 
        // cada vez que se agrega el curso al carrito va a tener un id, si el id del carrito coincide con el id de la card , lo va a decrementar y mostrar en el html la cantidad de stock que hay  
    const restaId = e.target.getAttribute('data-id'); 
        articulosCarrito.forEach(articulo =>{
            if (restaId === articulo.id) {
                //Si la cantidad es 1 al presionar nuevamente el boton menos , se crea un nuevo array filtrando todos los productos que tengan un id distino a restaId
                if (articulo.cantidad == 1) {
                        articulosCarrito = articulosCarrito.filter(articulo=>restaId !==  articulo.id )
                       // carritoHTML()
                    } else {
                        articulo.cantidad--
                        //carritoHTML()
                }
                //selecciono de la base de datos el id del concierto menos 1 , ya que se selecciona por el indice , como es un array , el indice empieza en 0 
                const stock = conciertos[articulo.id-1].stock
                listaCursos.querySelector(`#stock-${articulo.id}`).innerHTML = `entradas: ${stock+1}`
                conciertos[articulo.id-1].stock = stock+1
            } 

            carritoHTML();
        })
    }    
}
function crearRow() {
    const row = document.createElement('div');
    row.classList = 'row'
    listaCursos.appendChild(row)

};
function crearCard (concierto){
    //desestructura un objeto y en base a eso crea los elementos
    const {titulo, precio, lugar , oferta , imagen, id , stock} = concierto;
    const contendorCard = document.createElement('DIV')
    const cardHTML = document.createElement ('DIV');
    const imagenHTML = document.createElement('IMG');
    const infoCard = document.createElement('DIV');
    const tituloHTML = document.createElement('H4');
    const precioHTML = document.createElement('P');
    const lugarHTML = document.createElement('P')
    const ofertaHTML = document.createElement('SPAN'); 
    const linkHTML = document.createElement('A') ;
    const stockHTML = document.createElement ('P');

 
    contendorCard.classList = 'four columns';
    cardHTML.classList = 'card';
    cardHTML.id = id
    infoCard.classList = 'info-card';
    precioHTML.classList = 'precio';
    stockHTML.id = `stock-${id}`
    stockHTML.classList = 'stocks'
    imagenHTML.src = imagen;
    imagenHTML.classList = 'imagen-curso u-full-width';
    tituloHTML.textContent = titulo;
    precioHTML.textContent =precio;
    lugarHTML.textContent = lugar;
    ofertaHTML.textContent = oferta;
    ofertaHTML.classList = 'u-pull-right'
    linkHTML.classList = 'u-full-width button input agregar-carrito';
    linkHTML.textContent = "Comprar";
    linkHTML.setAttribute('data-id' , id);
    stockHTML.textContent = `entradas ${stock}`;

    
    




    precioHTML.appendChild(ofertaHTML);
    infoCard.appendChild(tituloHTML);
    infoCard.appendChild(lugarHTML);
    infoCard.appendChild(precioHTML);
    infoCard.appendChild(stockHTML);
    infoCard.appendChild(linkHTML);
    cardHTML.appendChild(imagenHTML);
    cardHTML.appendChild(infoCard);
    contendorCard.appendChild(cardHTML);
    return(contendorCard);
}
// cantidad de cards adentro del row 

function mostrarConciertos(listaDeConciertos) {
    let cardImpresa =  3
    listaDeConciertos.forEach(concierto => {
       if (cardImpresa == 3 ) {
        crearRow()
        // le agrega al contenedor de las cards la card que previamente se hizo al llamar la funcion 
        listaCursos.lastChild.appendChild(crearCard(concierto))
        cardImpresa = 1
       } else {
        // si el numero de cards imopresas no es 3, crea una card sin row hasta que llegue a 3 
        listaCursos.lastChild.appendChild(crearCard(concierto))
        cardImpresa++
       }
        
    })
   
}
