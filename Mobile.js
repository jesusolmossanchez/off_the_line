

/**************************************************
** MOBILE CLASS
**************************************************/
var Mobile = function(juego) {


    var self = this;

  
    this.pinta_cosas_mobile_ = function() {

        this.canvas_mobile   = document.getElementById('canvas_mobile');
        this.ctx_mobile      = this.canvas_mobile.getContext('2d');
        this.canvas_mobile.style.display = "block";
        var ancho_window = window.innerWidth
        this.canvas_mobile.width  = ancho_total_;
        this.canvas_mobile.height = 100;


        var flecha_der =  [
                    [  , 1,  ,  ],
                    [  , 1, 1,  ],
                    [ 1, 1, 1, 1],
                    [  , 1, 1,  ],
                    [  , 1,  ,  ]
            ];
        var flecha_izq =  [
                    [  ,  , 1,  ],
                    [  , 1, 1,  ],
                    [ 1, 1, 1, 1],
                    [  , 1, 1,  ],
                    [  ,  , 1,  ]
            ];
        var flecha_arr=  [
                    [  ,  , 1,  ,  ],
                    [  , 1, 1, 1,  ],
                    [ 1, 1, 1, 1, 1],
                    [  , 1, 1, 1,  ],
                    [  , 1, 1, 1,  ]
            ];
        var accion_boton=  [
                    [ 1,  , 1,  , 1],
                    [  , 1, 1, 1,  ],
                    [ 1, 1, 1, 1, 1],
                    [  , 1, 1, 1,  ],
                    [ 1,  , 1,  , 1]
            ];


        var size_flecha_px = 12;

        this.ctx_mobile.clearRect(0, 0, ancho_total_, 100);
        juego.pinta_filas_columnas_(this.ctx_mobile, 20, 20, flecha_izq, size_flecha_px);
        juego.pinta_filas_columnas_(this.ctx_mobile, 120, 20, flecha_der, size_flecha_px);
        juego.pinta_filas_columnas_(this.ctx_mobile, ancho_window - 180, 20, flecha_arr, size_flecha_px);
        juego.pinta_filas_columnas_(this.ctx_mobile, ancho_window - 80, 20, accion_boton, size_flecha_px);

        

       
          
    }

    this.mobile_listeners_ = function(){
        
        if(juego.is_touch_device_()){
            document.getElementById('controles_mobile').style.display = "block";

            document.getElementById('der_mobile').addEventListener('touchstart', function(e){
                juego.player_.right = true;
                this.className = "tecla_mobile pulsada";
                e.preventDefault();
            });

            document.getElementById('izq_mobile').addEventListener('touchstart', function(e){ 
                juego.player_.left = true;
                this.className = "tecla_mobile pulsada";
                e.preventDefault();
            });

            document.getElementById('arr_mobile').addEventListener('touchstart', function(e){ 
                juego.player_.jump = true;
                this.className = "tecla_mobile pulsada";
                e.preventDefault();
            });

            document.getElementById('accion_mobile').addEventListener('touchstart', function(e){ 
                juego.player_.accion = true;
                this.className = "tecla_mobile pulsada";
                e.preventDefault();
            });



            document.getElementById('der_mobile').addEventListener('touchend', function(e){
                juego.player_.right = false;
                this.className = "tecla_mobile";
                e.preventDefault();
            });

            document.getElementById('izq_mobile').addEventListener('touchend', function(e){ 
                juego.player_.left = false;
                this.className = "tecla_mobile";
                e.preventDefault();
            });

            document.getElementById('arr_mobile').addEventListener('touchend', function(e){ 
                juego.player_.jump = false;
                this.className = "tecla_mobile";
                e.preventDefault();
            });

            document.getElementById('accion_mobile').addEventListener('touchend', function(e){ 
                juego.player_.accion = false;
                this.className = "tecla_mobile";
                e.preventDefault();
            });
        }
    }

    
    this.controla_if_mobile_ = function(){
        if(juego.is_touch_device_()){
            self.pinta_cosas_mobile_();
        }
    };

}