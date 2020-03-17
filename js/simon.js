function empezarJuego() {
    /* 
        A través del método  getElementById(id) se obtiene un elemento del DOM.
        En este caso se almacena en una constante para acceder posteriormente.
    */
    const celeste = document.getElementById("celeste")
    const violeta = document.getElementById("violeta")
    const naranja = document.getElementById("naranja")
    const verde = document.getElementById("verde")

    /* 
        Se crea un objeto JSON (https://en.wikipedia.org/wiki/JSON) de tipo Clave: valor
        En donde las claves son una cadena de texto y los valores corresponden a los 
        elementos HTML traidos del DOM en las líneas anteriores        
    */
    let listaColores = {
        'celeste' : celeste,
        'violeta' : violeta,
        'naranja' : naranja,
        'verde' : verde
    }
    
    /* 
        Desde su especificación ECS6 JS permite la creación de objetos como lo conocemos
        en los diferentes lenguajes de programación, en este caso se crea un objeto llamado
        juego que es instancia de la clase Juego. Como parámetro al constructor se envía el
        objeto JSON que contiene la lista de colores. El objeto creado es guardado en una constante
    */
    const juego = new Juego(listaColores) //Para poder verlo en consola
}