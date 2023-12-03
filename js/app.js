//agregar, eliminar y vaciar carrito 
//cuando hago click en alguna parte del carrito compro un elemento 
//variables 
const carrito = document.querySelector('#carrito');
const listaCursos = document.querySelector('#lista-cursos');
const vaciarCarrito = document.querySelector('#vaciar-carrito');
const contenedorCarrito = document.querySelector('tbody');
let articulosCarrito=[];

// crear un array donde voy a poner todos los cursos, en principio va a estar vacio.
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
        //curso .queryselector porque hay que seleccionar desde el div ya seleccionado 
    imagen: curso.querySelector('img').src,
    titulo :curso.querySelector('h4').textContent,
    precio:curso.querySelector('span').textContent,
    id:curso.querySelector('a').getAttribute('data-id'),
    cantidad : 1,
    }
    //reutilizo esta funcion que  lee el contenido del curso para modificar el stock 
    //selecciono el stock desde la base de datos 
    //con info curso obtrendria el id del concierto de la base de datos 
    //[infocurso.id-1] porque si el id es 1 empieza en 0 porque es un array 
    const stock = conciertos [infoCurso.id-1].stock
    //si no hay stock me muestra un alert que dice no stock 
    if (stock===1) {
        curso.querySelector('.stocks').textContent = `AGOTADO`
        
    }
    else{
        //en mi caso seria concierto 
        //${para usar variables dentro de string }
        //le resto a la entradas disponibles 
        curso.querySelector('.stocks').textContent = `entradas: ${stock-1}`
        // del array obtengo el stock 
        conciertos[infoCurso.id-1].stock = conciertos[infoCurso.id-1].stock-1



    //fijarse si existe ya en el carrito 
    // se va aiterando con el map, hasta que econtremos uno duplicado 
    const existe = articulosCarrito.some(curso => curso.id=== infoCurso.id);
    if (existe){
        //actualizamos la cantidad, cuando lo encuentro le indremento la cantidad 
        const cursos=articulosCarrito.map(curso=> {
            if(curso.id===infoCurso.id){
                curso.cantidad++;
                return curso;

            }
            //retorna los objetos que no son duplicados 
            else{
                return curso;
            }
        })
        articulosCarrito=[...cursos]
    }
    else{
        //si es diferente va al nievo array 
        //agregamos curso al carrito, ya que no estaba
         //spreed operator. 
        articulosCarrito=[...articulosCarrito,infoCurso]
    }
    //debe modificar la cantidad, si alguno es igual al que estamos tratando de agrerar se mdofica la cantidad 
    //agrega elementos al carrito, el objeto 
   
    carritoHTML()
}};




//agregar este objeto al array 


//poner los eventos 
cargarEventos()
function cargarEventos(){
    //agregar un curso presionando agregar 
    listaCursos.addEventListener('click', agregarCurso)
    //elimina cursos del carrito 

    carrito.addEventListener('click',actualizaCantidad)
    //vaciar carrito 
    vaciarCarrito.addEventListener('click',() =>{
        //borrar el array y limpiar el html 
        articulosCarrito = [];
        limpiarHTML();
    });
    document.addEventListener('DOMContentLoaded',() => {
        mostrarConciertos()
    });
   
}
//muestra el carrito de compras en el html 
//En el table body vacio me va a ir agreando el curso 
function carritoHTML(){
    limpiarHTML()
    articulosCarrito.forEach(curso =>{
        //desestructuraccion del objeto para que quede mejor, "mas cheto" segun ruben 
        const{titulo,imagen,precio,cantidad,id}=curso; 
        //crear el tr 
        const row= document.createElement('tr');
        row.innerHTML=`
        <td><img src='${curso.imagen}'heigth=100px width=150px> </td>
        <td class='blanco'>${titulo}</td>
        <td class='blanco'>${precio}</td>
        <td class='blanco'>${cantidad}</td>
        <td><a class ="decrementa-cantidad" data-id=${id}> - </a></td>
        <td><a class ="incrementa-cantidad" data-id=${id}> + </a></td>
        <td> <a href ="#" class ="borrar-curso" data-id="${id}" > X </a></td>

        `;
        //eliminar el archivo del array, y del html 
        //al hacer un click borro el tbody, hacer una funcion 
        //contenedor carrito abre un hijo, es el que cree ahi 
        //antes de agregarlo hay que vaciar el html previo. 
        contenedorCarrito.appendChild(row);
    })
}
function limpiarHTML(){
    //forma lenta
//contenedorCarrito.innerHTML='';
while(contenedorCarrito.firstChild){
    contenedorCarrito.removeChild(contenedorCarrito.firstChild)
}
}
//funcion eliminar
function actualizaCantidad(e) {

    //la clase de la x 
    if(e.target.classList.contains('borrar-curso')){

        //obtener el id del curso que quiero eliminar
        const cursoId=e.target.getAttribute('data-id')
        //elimina el array 
        //filter: genera un nuevo array, cada item es un curso.
        articulosCarrito=articulosCarrito.filter(curso=>curso.id !== cursoId)
       carritoHTML()//iterar sobre el carrito y mostrar el html 

    }
    //si tiene esa clase entra al if 
    if (e.target.classList.contains('incrementa-cantidad')){
        //obtener el id del boton 
        const sumaId=e.target.getAttribute('data-id');
        //recorrer el array 
       articulosCarrito.forEach(articulo =>{

           // toma el stock actual
           const stock = conciertos[articulo.id-1].stock
           // le cambia el text content y dice que no hay mas entradas 
           if (stock < 1) {
               listaCursos.querySelector(`#stock-${articulo.id}`).innerHTML = `AGOTADO`
            } else {
                //condicion donde si el id es igual suma la cantidad 
                if (sumaId === articulo.id) {
                    articulo.cantidad++;
                    carritoHTML(); 
                    
                    //modifico del dom 
                    listaCursos.querySelector(`#stock-${articulo.id}`).innerHTML = `entradas: ${stock-1}`
                    //modifico de la bse de datos 
                    conciertos[articulo.id-1].stock = stock-1
                }
                
            }
       })
    }
    //si contiene esa clase entra al if 
    if (e.target.classList.contains('decrementa-cantidad')){ 

        //obtengo el id del boton 
        const restaId=e.target.getAttribute('data-id');
         //recorrer el array con un for each 
         //si el producto seleccionado tiene el mismo id que el que el quiero decrementar, lo va a decrementar 
        articulosCarrito.forEach(articulo =>{
            if (restaId === articulo.id) {
                //primero me fijo la CANTIDAD 
                if (articulo.cantidad == 1) {
                        articulosCarrito=articulosCarrito.filter(articulo=>restaId !==  articulo.id )
                        carritoHTML()
                        //le restas en los dos casos 
                    } else {
                        articulo.cantidad--
                        carritoHTML()
                }
                //selecciono de la lista de cursos el id 
                //modificar el textcontent y la base de datos 
                //si es  menor que 1 va a borrar el html 
                // toma el stock actual
                const stock = conciertos[articulo.id-1].stock
                //modifico del dom 
                listaCursos.querySelector(`#stock-${articulo.id}`).innerHTML = `entradas: ${stock+1}`
                //modifico de la bse de datos 
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

}
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
    precioHTML.textContent = precio;
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
let cardImpresa =  3
function mostrarConciertos() {
    conciertos.forEach(concierto => {
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
