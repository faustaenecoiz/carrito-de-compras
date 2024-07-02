//muestra las cards en el html 
document.addEventListener('DOMContentLoaded', () =>{
buscarConciertos()
})
const busqueda = document.getElementById('Search');
//cada vez que se escriba en el input se filtras los elementos 

function buscarConciertos() {
    busqueda.addEventListener("input", e =>{
        limpiarFiltrado()
        const inputText = e.target.value.toLowerCase().trim();
        //filtrar por el titulo 
        const mostrarFiltro = conciertos.filter(concierto => concierto.titulo.toLowerCase().startsWith(inputText));
        //como las cards ya estan creadas desde app.js la vuelvo a llamar aca 
       mostrarConciertos(mostrarFiltro)

    })
};
mostrarConciertos(conciertos)

function limpiarFiltrado (){
    while(listaCursos.firstChild)
        listaCursos.removeChild(listaCursos.firstChild)
}