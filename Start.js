
(function() { // module pattern

    //instancia del juego
    var juego = new Game();

    //instancia de movil para controlar sus cosas
    var mobile = new Mobile(juego);
    
    //Controlo orientación (solo para movil)
    mobile.controla_orientacion_();

    //el bucle general del juego
    var engine = new Engine(juego, mobile);

    // MUSICA -> ojo, es la que lanza el juego, cuando está ok! LOL
    var musica = new Music(juego, mobile, engine);
    musica.arranca_();


    //MAPEAO KEY DOWN Y UPS
    document.addEventListener('keydown', function(ev) { return juego.onkey_(ev, ev.keyCode, true);  }, false);
    document.addEventListener('keyup',   function(ev) { return juego.onkey_(ev, ev.keyCode, false); }, false);


    /* Control de salir de la pestaña... para que pause el juego */
    function handleVisibilityChange() {
        if (document.hidden) {
            juego.pausa_ = true;
        } else  {
            juego.pausa_ = false;
            mobile.controla_orientacion_();
        }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange, false);
    /* Fin control de pestaña actual */


})();