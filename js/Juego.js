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
    constructor(nombre,colores, pageElements) {
        this.nombre = nombre
        this.colores = colores
        this.pageElements = pageElements
        this.inicializar()
        this.iniciarTiempo()
        setTimeout(this.siguienteNivel.bind(this),500)
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
        this.vidas = 3
        this.nivel = 1
        this.ULTIMO_NIVEL = 5
        
        this.setHeaderColor('#000')
        this.setFooterColor('#000')
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
        this.actualizarValoresElementosPagina()
    }

    /**
     * En esta función se desea controlar el tiempo que se muestra en la aplicación
     */
    iniciarTiempo() {
        this.tiempo = 0 //Se declara una variable global tiempo
        /**
         * Se hace uso de la función setInterval cuyo objetivo es ejecutar una función cada
         * n cantidad de milisegundos.Más información:
         * https://www.w3schools.com/jsref/met_win_setinterval.asp
         * https://developer.mozilla.org/es/docs/Web/API/WindowTimers/setInterval
         */
        this.idIntervalo = setInterval(()=>{
            this.tiempo++
            const tiempoMinSeg = this.convertirNumeroATiempo(this.tiempo)
            this.pageElements.tiempoJuego.innerText = tiempoMinSeg
        },1000)
    }

    /**
     * Función para parar el avance del tiempo y dejarlo nuevamente en 0,
     * Usa el método clearInterval que para la ejecución de una función 
     * setInterval llamada anteriormente.
     * https://www.w3schools.com/jsref/met_win_clearinterval.asp
     * https://developer.mozilla.org/es/docs/Web/API/WindowTimers/clearInterval
     */
    finalizarTiempo() {
        this.tiempo = 0 //Se declara una variable global tiempo
        clearInterval(this.idIntervalo)
        this.pageElements.tiempoJuego.innerText = '00:00'
    }

    /**
     * retorna una cadena de tipo mm:ss
     * @param {*} numero cantidad de segundos
     */
    convertirNumeroATiempo(numero) {
        const minutos = this.convertirADosDigitos(parseInt(numero/60))
        const segundos = this.convertirADosDigitos(parseInt(numero%60))
        return `${minutos}:${segundos}`
    }

    /**
     * Si el número es de menos dígitos, retorna uno con dos dígitos
     * @param {*} numero numero convertir
     */
    convertirADosDigitos(numero) {
        if(numero<10){
            return '0' + numero
        }
        return numero
    }

    /**
     * En este método se actualizan los elementos del DOM para que los valores de nuestras variables de Javascript
     * sean visibles al usuario final y sepa cómo se va desarrollando su juego.
     * Los elementos del DOM se toman del objeto JSON pageElements que se recibe desde el constructor
     */
    actualizarValoresElementosPagina(){
        this.pageElements.nombreJugador.innerText = this.nombre
        this.pageElements.ultimoNivel.innerText = this.ULTIMO_NIVEL
        this.pageElements.nivelActual.innerText = this.nivel
        this.pageElements.vidasRestantes.innerText = this.vidas
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
        this.actualizarValoresElementosPagina()
        this.iluminarSecuencia()
    }

    /* 
        Para iluminar los colores al usuario, se debe recorrer el arreglo de secuencia almacenado como atributo global.
        Como en el arreglo tenemos únicamente números, se deben convertir a texto con la finalidad de obtener el objeto DOM
        del objeto JSON de colores que como claves tiene las cadenas de texto con el nombre de los colores.
    */
    iluminarSecuencia() {
        this.actualizarEstadoJuego(0)
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
            }, 700 * i )
        }
        /**
         * Se desea que el juego permita hacer click en los colores únicamente cuando la secuencia termine de ejecutarse.
         */
        setTimeout(()=>{
            this.actualizarEstadoJuego(1)
            this.agregarEventosClick()
        }, (this.nivel)*700)
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

    /**
     * Método para mostrar al usuario el estado actual del juego
     * @param {*} nuevoEstado numero con el nuevo estado [0: Iluminar Secuencia, 1: Tu Turno]
     */
    actualizarEstadoJuego(nuevoEstado){
        const estado = (nuevoEstado==0) ? 'Iluminar Secuencia' : '¡Tu turno!'
        const colorEstado = (nuevoEstado==0) ? 'red' : 'green'
        this.pageElements.estadoJuego.innerText = estado
        this.pageElements.estadoJuego.style.color = colorEstado
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
     * Toma del objeto global pageElements el header y actualiza su estilo,
     * específicamente su color de fondo
     * @param {*} color string con código hexadecimal del nuevo color
     */
    setHeaderColor(color){
        this.pageElements.header.style.backgroundColor = color
    }

    /**
     * Toma del objeto global pageElements el footer y actualiza su estilo,
     * específicamente su color de fondo
     * @param {*} color string con código hexadecimal del nuevo color
     */
    setFooterColor(color){
        this.pageElements.footer.style.backgroundColor = color
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
        const hexaColor = this.transformarColorDeTextoAHexadecimal(nombreColor)
        this.setHeaderColor(hexaColor)
        this.setFooterColor(hexaColor)
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
                    this.avanzarDeNivel()
                }
            }
        } else {
            this.vidas--
            //Evaluar la cantidad de vidas
            if(this.vidas == 0){
                this.perdio()
            } else {
                this.perdioVida()
            }
        }
    }

    /**
     * El usuario realizó bien toda la secuencia de un nivel, se le informa y se le pasa al
     * siguiente.
     */
    avanzarDeNivel(){
        this.actualizarValoresElementosPagina()
        swal('¡Pasaste de Nivel!', `Muy bien, avanzaste de nivel. Siguiente: ${this.nivel}`, 'success').then(()=>{
            this.setHeaderColor('#000')
            this.setFooterColor('#000')
            const self = this
            setTimeout( function () {
                self.siguienteNivel()
            },500)
        })
    }

    /**
     * El usuario realizó mal la cadena, aún tenía vidas, se le alerta del nuevo estado
     */
    perdioVida() {
        swal('¡Fallaste!', `Te queda(n) ${this.vidas} vida(s)`, 'warning').then(()=>{
            this.setHeaderColor('#000')
            this.setFooterColor('#000')
            this.eliminarEventosClick()
            const self = this
            this.actualizarValoresElementosPagina()
            setTimeout( function () {
                self.siguienteNivel()
            },1000)
        })
    }

    /* 
        Uso de la librería de Sweet Alert para mostrar mensajes más elegantes.
        https://sweetalert.js.org/guides/
    */
    gano(){
        //Se desea guardar la referencia de la variable this ya que al llamar a setTimeout el valor de this cambia
        const tiempoMinSeg = this.convertirNumeroATiempo(this.tiempo)
        this.finalizarTiempo()
        const self = this 
        swal ( "¡Ganaste!" ,  
            "Has completado todos los niveles del juego correctamente. Tardaste " + tiempoMinSeg ,  
            "success" ).then(function(){
            self.inicializar()
        })
    }

    /* 
        Uso de la librería de Sweet Alert para mostrar mensajes más elegantes.
        https://sweetalert.js.org/guides/
    */
    perdio () {
        //Se desea guardar la referencia de la variable this ya que al llamar a setTimeout el valor de this cambia
        const tiempoMinSeg = this.convertirNumeroATiempo(this.tiempo)
        this.finalizarTiempo()
        const self = this 
        swal ( "¡Perdió!" ,  
        "Has perdido la totalidad de tus vidas. ¡Intentalo de nuevo!. Tardaste " + tiempoMinSeg ,  
        "error" ).then(function(){
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

    /* 
        Uso de la estructura de control switch, para evaluar una cadena y retornar otra
        Recibe el nombre del color y retorna su cadena hexadecimal
        https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/switch
    */
   transformarColorDeTextoAHexadecimal(color) {
        switch (color) {
            case 'celeste':
                return '#22a6b3'
            case 'violeta':
                return '#be2edd'
            case 'naranja':
                return '#f0932b'
            case 'verde':
                return '#6ab04c'
        }
    }

}