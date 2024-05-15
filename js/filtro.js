document.addEventListener('DOMContentLoaded', () =>{
buscarConciertos()
})
const busqueda = document.getElementById('Search');
//cada vez que se escriba en el input se filtras los elementos 

function buscarConciertos() {
    busqueda.addEventListener("input", e =>{
        limpiarFiltro()
        const inputText = e.target.value.toLowerCase().trim();
        const mostrarFiltro = conciertos.filter(concierto => concierto.titulo.toLowerCase().startsWith(inputText));
       mostrarConciertos(mostrarFiltro)
    })
};


function limpiarFiltro(){
while(listaCursos.firstChild){
    listaCursos.removeChild(listaCursos.firstChild)
}
}

//el problema que tengo es que borra solo el titulo conciertos 
//trim metodo que elimina los espacios en blanco 