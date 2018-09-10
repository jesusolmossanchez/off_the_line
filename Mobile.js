

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
        this.canvas_mobile.height = 200;


        
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


        var largo = window.innerHeight;
        if(window.innerWidth>window.innerHeight){
            largo = window.innerWidth;
        }
        var size_flecha_px = largo/80;

        this.ctx_mobile.clearRect(0, 0, ancho_total_, 200);
        juego.pinta_filas_columnas_(this.ctx_mobile, 20, 105, juego.flecha_izq, size_flecha_px);
        juego.pinta_filas_columnas_(this.ctx_mobile, 95, 105, juego.flecha_der, size_flecha_px);
        juego.pinta_filas_columnas_(this.ctx_mobile, 52, 60, juego.flecha_arr, size_flecha_px);
        juego.pinta_filas_columnas_(this.ctx_mobile, 52, 160, juego.flecha_abj, size_flecha_px);
        juego.pinta_filas_columnas_(this.ctx_mobile, ancho_window - 65 - size_flecha_px*10, 145, flecha_arr, size_flecha_px);
        juego.pinta_filas_columnas_(this.ctx_mobile, ancho_window - 20 -size_flecha_px*5, 145, accion_boton, size_flecha_px);

        

       
          
    }

    this.mobile_listeners_ = function(){
        
        if(juego.is_touch_device_()){
            document.getElementById('controles_mobile').style.display = "block";

            document.getElementById('up_mobile').addEventListener('touchstart', function(e){
                if(juego.empezado_){
                    juego.player_.up = true;
                }
                this.className = "tecla_mobile pulsada";
                e.preventDefault();
            });
            document.getElementById('down_mobile').addEventListener('touchstart', function(e){
                if(juego.empezado_){
                    juego.player_.down = true;
                }
                this.className = "tecla_mobile pulsada";
                e.preventDefault();
            });
            document.getElementById('der_mobile').addEventListener('touchstart', function(e){
                if(juego.empezado_){
                    juego.player_.right = true;
                }
                this.className = "tecla_mobile pulsada";
                e.preventDefault();
            });

            document.getElementById('izq_mobile').addEventListener('touchstart', function(e){ 
                if(juego.empezado_){
                    juego.player_.left = true;
                }
                this.className = "tecla_mobile pulsada";
                e.preventDefault();
            });

            document.getElementById('arr_mobile').addEventListener('touchstart', function(e){
                if(juego.empezado_){ 
                    juego.player_.jump = true;
                }
                this.className = "tecla_mobile pulsada";
                e.preventDefault();
            });

            document.getElementById('accion_mobile').addEventListener('touchstart', function(e){ 
                if(juego.empezado_){
                    juego.player_.accion = true;
                }
                this.className = "tecla_mobile pulsada";
                e.preventDefault();
            });



            document.getElementById('up_mobile').addEventListener('touchend', function(e){
                if(!juego.empezado_){
                    juego.mueve_selec_player_(false, "up");
                }
                else{
                    juego.player_.up = false;
                }
                this.className = "tecla_mobile";
                e.preventDefault();
            });


            document.getElementById('down_mobile').addEventListener('touchend', function(e){
                if(!juego.empezado_){
                    juego.mueve_selec_player_(false, "down");
                }
                else{
                    juego.player_.dow = false;
                }
                this.className = "tecla_mobile";
                e.preventDefault();
            });


            document.getElementById('der_mobile').addEventListener('touchend', function(e){
                if(!juego.empezado_){
                    juego.mueve_selec_player_(false, "right");
                }
                else{
                    juego.player_.right = false;
                }
                this.className = "tecla_mobile";
                e.preventDefault();
            });

            document.getElementById('izq_mobile').addEventListener('touchend', function(e){ 
                if(!juego.empezado_){
                    juego.mueve_selec_player_(false, "left");
                }
                else{
                    juego.player_.left = false;
                }
                this.className = "tecla_mobile";
                e.preventDefault();
            });

            document.getElementById('arr_mobile').addEventListener('touchend', function(e){ 
                
                if(juego.empezado_){
                    juego.player_.jump = false;
                }
                this.className = "tecla_mobile";
                e.preventDefault();
            });

            document.getElementById('accion_mobile').addEventListener('touchend', function(e){ 
                if(juego.empezado_){
                    juego.player_.accion = false;
                }
                else{
                    juego.selec_player_(false);
                }
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