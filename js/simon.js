
/**
 * Al cargar la página, agregar un escuchador del evento click al elemento de la página
 * con id="instrucciones"
 */
document.getElementById('instrucciones').addEventListener('click',mostrarInstrucciones)

/**
 * Método que será ejecutado para el evento click, 
 * Hace uso de la librería SweetAlert para mostrar mensajes más elegantes
 * https://sweetalert.js.org/guides/
 */
function mostrarInstrucciones (e) {
    e.preventDefault()
    swal('Instrucciones del juego', 
    'Este juego consiste en seguir la secuencia de colores que se iluminan, por cada nivel que avance deberá recordar un color adicional y seguir toda la secuencia completa.',
    'info')
}


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
        A través del método  getElementById(id) se obtiene un elemento del DOM.
        En este caso se cambia su valor a través del atributo innerText.
        https://www.w3schools.com/jsref/prop_node_innertext.asp
        https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText
        Tambien existe el atributo innerHTML
        https://developer.mozilla.org/es/docs/Web/API/Element/innerHTML

    */
    document.getElementById('tiempo-juego').innerText = '00:00'

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

    const pageElements = {
        'header' : document.getElementsByTagName('nav')[0],
        'footer' : document.getElementsByTagName('footer')[0],
        'nombreJugador': document.getElementById('nombre-jugador'),
        'nivelActual': document.getElementById('nivel-actual'),
        'ultimoNivel': document.getElementById('ultimo-nivel'),
        'tiempoJuego': document.getElementById('tiempo-juego'),
        'vidasRestantes': document.getElementById('vidas-restantes'),
        'estadoJuego': document.getElementById('estado-juego'),
    }
    
    /* 
        Uso de la librería de Sweet Alert para mostrar mensajes más elegantes.
        En este caso se solicita el nombre a la persona que va a jugar
        https://sweetalert.js.org/guides/
    */
    swal({
        title: 'Bienvenido a Simon',
        text: 'Por favor escriba su nombre',
        icon: "info",
        content: {
          element: "input",
          attributes: {
            placeholder: "Escriba su nombre",
            type: "text",
          },
        },
      }).then( (value) => {
          /* El método .then recibe como parámetro una función, en este caso usamos la sintaxis
            de una arrow function. Para más información:
            https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Funciones/Arrow_functions
            https://www.w3schools.com/js/js_arrow_function.asp
          */
        if(value){ //Si el usuario ingresó un valor se inicia el juego

            /* 
                Desde su especificación ECS6 JS permite la creación de objetos como lo conocemos
                en los diferentes lenguajes de programación, en este caso se crea un objeto llamado
                juego que es instancia de la clase Juego. Como parámetro al constructor se envía el
                objeto JSON que contiene la lista de colores. El objeto creado es guardado en una constante
            */
            window.juego = new Juego(value,listaColores,pageElements) //Para poder verlo en consola
        } else {//de lo contrario se llama nuevamente al método actual
            empezarJuego()
        }
      } )
}