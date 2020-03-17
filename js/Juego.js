/* 
    Sintaxis para crear una clase de JS desde ECS6
*/
class Juego {

    /* 
        El método constructor es el primero a ser ejecutado cuando se crea una instancia
        de esta clase. Recibe por parámetro el objeto JSON de colores que es almacenado en
        un atributo de clase llamado colores. Para ello se utiliza la palabra reservada this.
        https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Classes/constructor
    */
    constructor(colores) {
        this.colores = colores
        this.inicializar()
        this.siguienteNivel()
    }

    /* 
        Al iniciar el juego se deben crear algunas condiciones para que el usuario final inicie
        su juego. Primero crearemos una variable de nivel que nos indicará cómo va avanzando el
        usuario final dentro del juego. se crea además un atributo de clase llamada ULTIMO_NIVEL
        con el fin de que en caso de querer hacer un juego con más niveles se actualice su valor
        y no se deba tocar nada más dentro del código.
        https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Funciones
    */
    inicializar () {
        this.nivel = 1
        this.ULTIMO_NIVEL = 5
        
        //Obtener un elemento del DOM a través de su ID
        // document.getElementById("btnEmpezar").classList.add('hide')
        //Ejecutar métodos internos de la clase
        this.toggleButton()
        this.generarSecuencia()
        /* 
            Para no perder la referencia del "this" se utiliza la función bind, en adelante sin importar
             en donde es llamada la función elegirColor() tendrá como referencia de this al Juego actual 
        */
        this.elegirColor = this.elegirColor.bind(this)
        //console.log("Quiere inicializar con nivel: " + this.nivel)
    }

    /* Método creado para mostrar/ocultar el botón de "Empezar a jugar!" */
    toggleButton() {
        //Elemento DOM obtenido por su ID
        const button = document.getElementById("btnEmpezar")
        /* 
            El atributo classList del botón corresponde a las clases que este tiene definidas en el HTML.
            En este caso preguntamos si el elemento DOM contiene la clase 'hide'.
            https://developer.mozilla.org/es/docs/Web/API/Element/classList
        */
        if( button.classList.contains('hide') ){
            //Si tiene la clase se remueve
            button.classList.remove('hide')
        } else {
            //Si no la tiene se agrega
            button.classList.add('hide')
        }
    }

    /* 
        Para almacenar la secuencia de colores se usará un arreglo numérico en el que cada posición
        corresponde a un número entero entre el 0 y 3 que posteriormente será mapeado a un color.
        Este método crea el arreglo numérico y lo almacena en el atributo global secuencia.
        Nota: No es necesario crear el atributo global secuencia en ningún otro lugar, con definirlo
        dentro del método ya queda definiro de manera global. Comportamiento de JS
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Class_fields            
    */
    generarSecuencia () {
        this.secuencia = new Array(this.ULTIMO_NIVEL).fill(0).map( function (n) {
            return Math.floor(Math.random() * 4)
        } )
        //Esta porción de código es la manera de hacer manualmente el map de la parte superior
        // for(let i =0; i<this.secuencia.length; i++){
        //     this.secuencia[i] = Math.floor(Math.random() * 4)
        // }
        // console.log(this.secuencia)
    }

    /* 
        Cada vez que el usuario avanza de nivel se deben hacer 3 cosas.
        1. El usuario debe empezar desde 0 la secuencia por lo que la variable subnivel debe volver a 0.
        2. Se debe iluminar la secuencia hasta el nivel en el que va el usuario.
        3. Se agregan los eventos de click a los div que tienen los colores para permitir interacción del usuario.
     */
    siguienteNivel() {
        this.subnivel = 0
        this.iluminarSecuencia()
        this.agregarEventosClick()
    }

    /* 
        Para iluminar los colores al usuario, se debe recorrer el arreglo de secuencia almacenado como atributo global.
        Como en el arreglo tenemos únicamente números, se deben convertir a texto con la finalidad de obtener el objeto DOM
        del objeto JSON de colores que como claves tiene las cadenas de texto con el nombre de los colores.
    */
    iluminarSecuencia() {
        for( let i = 0; i<this.nivel; i++ ){
            //Almacenar el retorno de una función de clase en una variable, se envía como parámetro el número en la posición i de secuencia
            let nombreColor = this.transformarColorDeNumeroATexto( this.secuencia[i] )
            //Se desea guardar la referencia de la variable this ya que al llamar a setTimeout el valor de this cambia
            const self = this 
            /**
             * Se le solicita al navegador que agregue a la pila de ejecución el llamado a la función en N milisegundos.
             * Como primer parámetro el método recibe una función y como segundo parámetro en cuantos milisegundos debe ser ejecutada.
             * En nuestro caso el tiempo depende directamente del valor de i. Por lo que el primer color se alumbrará en 0 milisegundos,
             * el segundo en 1000 milisegundos, el tercero en 2000 milisegundos y así sucesivamente.
             * Event Loop: https://www.youtube.com/watch?v=bWvnWhVCHAc&feature=youtu.be
             * SetTimeout: https://developer.mozilla.org/es/docs/Web/API/WindowTimers/setTimeout
             */
            setTimeout(function(){
                self.iluminarColor(nombreColor)
            }, 1000 * i )
        }
    }

    /* 
        Método para iluminar un color de los almacenados en el objeto JSON recibido por parámetro
    */
    iluminarColor(color) {
        //Agregar una clase a la lista de clases. Atributo classList de un elemento del DOM
        this.colores[color].classList.add("light")
        //Se desea guardar la referencia de la variable this ya que al llamar a setTimeout el valor de this cambia
        const self = this 
        /**
         * Se le solicita al navegador que agregue a la pila de ejecución el llamado a la función en N milisegundos.
         * Como primer parámetro el método recibe una función y como segundo parámetro en cuantos milisegundos debe ser ejecutada.
         * En nuestro caso el tiempo depende directamente del valor de i. Por lo que el primer color se alumbrará en 0 milisegundos,
         * el segundo en 1000 milisegundos, el tercero en 2000 milisegundos y así sucesivamente.
         * Event Loop: https://www.youtube.com/watch?v=bWvnWhVCHAc&feature=youtu.be
         * SetTimeout: https://developer.mozilla.org/es/docs/Web/API/WindowTimers/setTimeout
         */
        setTimeout( function() {
            self.apagarColor(color)
        }, 400 )
    }

    
    apagarColor(color) {
        //Quitar una clase de la lista de clases "classList"
        this.colores[color].classList.remove("light")
    }

    /* 
        Los usuarios interactuan con nuestras páginas web, es por ello que debemos escuchar los eventos que realiza
        dentro de nuestra página. Cada elemento del DOM puede tener uno o más eventos a la escucha y en cada uno de
        ellos ejecutar una función diferente.
        Eventos: https://developer.mozilla.org/es/docs/Web/Events
    */
    agregarEventosClick () {
        /* 
            Agregar un escuchador de evento a un elemento del DOM. Cuando el usuario haga click, ejecute la función elegirColor
            Ojo: No se ejecuta la función (No se colocan los paréntesis). Sólo se envía la referencia de la función.
            https://developer.mozilla.org/es/docs/Web/API/EventTarget/addEventListener
        */
        this.colores.celeste.addEventListener( 'click',  this.elegirColor)
        this.colores.violeta.addEventListener( 'click',  this.elegirColor)
        this.colores.naranja.addEventListener( 'click',  this.elegirColor)
        this.colores.verde.addEventListener( 'click',  this.elegirColor)
    }

    
    eliminarEventosClick () {
        /* 
            Eliminar un escuchador de evento a un elemento del DOM. 
            Queremos que se deje de ejecutar la función elegirColor cuando el usuario haga click
            Ojo: No se ejecuta la función (No se colocan los paréntesis). Sólo se envía la referencia de la función.
            https://developer.mozilla.org/es/docs/Web/API/EventTarget/removeEventListener
        */
        this.colores.celeste.removeEventListener( 'click',  this.elegirColor)
        this.colores.violeta.removeEventListener( 'click',  this.elegirColor)
        this.colores.naranja.removeEventListener( 'click',  this.elegirColor)
        this.colores.verde.removeEventListener( 'click',  this.elegirColor)
    }

    /**
     * Método en donde va la lógica del juego. Cuando el usuario hace clic en uno de los colores
     * este método es ejecutado. Aqui se verifican todos los parámetros involucrados como el nivel,
     * el subnivel, la secuencia, los colores y demás.
     * @param {ev} el parámetro recibido corresponde a un objeto recibido desde el evento
     * https://www.w3schools.com/jsref/met_element_addeventlistener.asp
     */
    elegirColor(ev){
        //console.log(ev.target.dataset.color)
        const nombreColor = ev.target.dataset.color
        const numeroColor = this.transformarColorDeTextoANumero(nombreColor)
        // console.log(numeroColor)
        this.iluminarColor(nombreColor)
        if( this.secuencia[ this.subnivel ] === numeroColor){
            // console.log("Bien !")
            this.subnivel++
            if(this.subnivel == this.nivel){
                this.nivel++
                this.eliminarEventosClick()
                if((this.ULTIMO_NIVEL+1) == this.nivel){
                    this.gano()
                } else {
                    const self = this
                    setTimeout( function () {
                        self.siguienteNivel()
                    },1000)
                }
            }
        } else {
            this.perdio()
        }
    }

    /* 
        Uso de la librería de Sweet Alert para mostrar mensajes más elegantes.
        https://sweetalert.js.org/guides/
    */
    gano(){
        //Se desea guardar la referencia de la variable this ya que al llamar a setTimeout el valor de this cambia
        const self = this 
        swal ( "Simon" ,  "Ganó!" ,  "success" ).then(function(){
            self.inicializar()
        })
    }

    /* 
        Uso de la librería de Sweet Alert para mostrar mensajes más elegantes.
        https://sweetalert.js.org/guides/
    */
    perdio () {
        //Se desea guardar la referencia de la variable this ya que al llamar a setTimeout el valor de this cambia
        const self = this 
        swal ( "Simon" ,  "Perdió!" ,  "error" ).then(function(){
            self.inicializar()
        })
    }

    /* 
        Uso de la estructura de control switch, para evaluar un número y retornar una cadena
        https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/switch
    */
    transformarColorDeNumeroATexto(color) {
        switch (color) {
            case 0:
                return 'celeste'
            case 1:
                return 'violeta'
            case 2:
                return 'naranja'
            case 3:
                return 'verde'
        }
    }

    /* 
        Uso de la estructura de control switch, para evaluar una cadena y retornar un número
        https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/switch
    */
    transformarColorDeTextoANumero(color) {
        switch (color) {
            case 'celeste':
                return 0
            case 'violeta':
                return 1
            case 'naranja':
                return 2
            case 'verde':
                return 3
        }
    }

}