

/**************************************************
** GAME CLASS
**************************************************/
var Game = function() {


    //-------------------------------------------------------------------------
    // UTILITIES
    //-------------------------------------------------------------------------

    this.is_touch_device_ = function() {
        return 'ontouchstart' in document.documentElement;
    };

    this.onkey_ = function(ev, key, down) {
        switch(key) {
            case this.KEY.LEFT:  
                ev.preventDefault(); 
                if(!this.empezado_){
                    if(down){
                        if(this.numero_jugadores_ && !this.player1_selected_){
                            this.mueve_selec_player_(true, "left");
                        }
                    }
                }
                else{
                    if(this.modo_ === 1){
                        player.left  = down; 
                    }
                    else{
                        player2.left  = down; 
                    }
                }
                return false;
            case this.KEY.RIGHT: 
                ev.preventDefault(); 
                if(!this.empezado_){
                    if(down){
                        if(this.numero_jugadores_ && !this.player1_selected_){
                            this.mueve_selec_player_(true, "right");
                        }
                    }
                }
                else{
                    if(this.modo_ === 1){
                        player.right  = down; 
                    }
                    else{
                        player2.right  = down; 
                    } 
                } 
                return false;
            case this.KEY.UP: 
                ev.preventDefault(); 
                if(!this.empezado_){
                    if(down){
                        if(!this.numero_jugadores_){
                            this.mueve_menu_(false);
                        }
                        else if(!this.player1_selected_){
                            this.mueve_selec_player_(true, "up");
                        }
                    }
                }
                else{
                    if(this.modo_ === 1){
                        player.up  = down; 
                    }
                    else{
                        player2.up  = down; 
                    } 
                }
                return false;
            case this.KEY.DOWN: 
                ev.preventDefault(); 
                if(!this.empezado_){
                    if(down){
                        if(!this.numero_jugadores_){
                            this.mueve_menu_(true);
                        }
                        else if(!this.player1_selected_){
                            this.mueve_selec_player_(true, "down");
                        }
                    }
                }
                else{
                    if(this.modo_ === 1){
                        player.down  = down; 
                    }
                    else{
                        player2.down  = down; 
                    }
                }
                return false;
            case this.KEY.ENTER: 
                ev.preventDefault(); 
                if(!this.empezado_){
                    if(down){
                        if(!this.numero_jugadores_){
                            this.selecciona_menu_();
                        }
                        else{
                            this.selec_player_(true);
                        }
                    }
                }
                else{
                    if(this.modo_ === 1){
                        player.accion  = down; 
                    }
                    else{
                        player2.accion  = down; 
                    }
                }
                return false;
            case this.KEY.SHIFT: 
                ev.preventDefault(); 
                if(!this.empezado_){
                    if(down){
                        if(!this.numero_jugadores_){
                            this.selecciona_menu_();
                        }
                        else{
                            this.selec_player_(true);
                        }
                    }
                }
                else{
                    if(this.modo_ === 1){
                        player.jump  = down; 
                    }
                    else{
                        player2.jump  = down; 
                    }
                }
                return false;
            case this.KEY.Z: 
                ev.preventDefault(); 
                if(!this.empezado_){
                    if(down){
                        if(!this.numero_jugadores_){
                            this.selecciona_menu_();
                        }
                        else{
                            this.selec_player_(false);
                        }
                    }
                }
                else{
                    player.accion  = down;  
                }
                return false;
            case this.KEY.X: 
                ev.preventDefault(); 
                if(this.empezado_){
                    player.jump  = down; 
                }
                return false;
            case this.KEY.R: 
                ev.preventDefault(); 
                if(!this.empezado_){
                    if(down){
                        if(!this.numero_jugadores_){
                            this.mueve_menu_(false);
                        }
                        else if(!this.player2_selected_){
                            this.mueve_selec_player_(false, "up");
                        }
                    }
                }
                else{
                    if(this.modo_ === 2){
                        player.up  = down; 
                    }
                }
                return false;
            case this.KEY.D: 
                ev.preventDefault(); 
                if(!this.empezado_){
                    if(down){
                        if(this.numero_jugadores_ && !this.player2_selected_){
                            this.mueve_selec_player_(false, "left");
                        }
                    }
                }
                else{
                    if(this.modo_ === 2){
                        player.left  = down; 
                    }
                }
                return false;
            case this.KEY.F: 
                ev.preventDefault(); 
                if(!this.empezado_){
                    if(down){
                        if(!this.numero_jugadores_){
                            this.mueve_menu_(true);
                        }
                        else if(!this.player2_selected_){
                            this.mueve_selec_player_(false, "down");
                        }
                    }
                }
                else{
                    if(this.modo_ === 2){
                        player.down  = down; 
                    }
                }
                return false;
            case this.KEY.G: 
                ev.preventDefault();  
                if(!this.empezado_){
                    if(down){
                        if(this.numero_jugadores_ && !this.player2_selected_){
                            this.mueve_selec_player_(false, "right");
                        }
                    }
                }
                else{
                    if(this.modo_ === 2){
                        player.right  = down; 
                    }
                }
                return false;
        }
    };

    this.timestamp_ = function() {
        return new Date().getTime();
    };

    //Limite entre dos máximos
    this.bound_ = function(x, min, max) {
        return Math.max(min, Math.min(max, x));
    };

    //comprueba si algo está dentro de algo
    this.overlap_ = function(x1, y1, w1, h1, x2, y2, w2, h2) {
        return !(((x1 + w1 - 1) < x2) ||
                ((x2 + w2 - 1) < x1) ||
                ((y1 + h1 - 1) < y2) ||
                ((y2 + h2 - 1) < y1));
    };



    //Para pintar cosas por filas y columnas
    this.pinta_filas_columnas_ = function(ctx, x, y, que_pintar, size, color, controla_distancia){
        if(!color){
            ctx.fillStyle = "#ffffff";
        }
        else{
            ctx.fillStyle = color;
        }

        if(controla_distancia){
            var new_color = this.hex_to_rgb_(color);
        }

        var currX = x;
        var currY = y;
        var addX = 0;
        for (var i_y = 0; i_y < que_pintar.length; i_y++) {
            var row = que_pintar[i_y];
            for (var i_x = 0; i_x < row.length; i_x++) {
                if (row[i_x]) {
                    if(controla_distancia){
                        var distancia_centro = 0;
                        var a = 0;
                        var b = 0;
                        a = Math.abs(currX + i_x * size - this.player_.centro_x_);
                        b = Math.abs(currY - this.player_.centro_y_);
                        distancia_centro = Math.sqrt( a*a + b*b );



                        var opacidad = (1 - distancia_centro/(this.radio_vision_ * 2.5));

                        if(distancia_centro > this.radio_vision_ * 2.5){
                            continue;
                        }

                        ctx.fillStyle = "rgba("+new_color.r+","+new_color.g+","+new_color.b+","+opacidad+")";
                        ctx.fillRect(currX + i_x * size, currY, size, size);
                    }
                    else{
                        ctx.fillRect(currX + i_x * size, currY, size*1.1, size*1.1);

                    }
                }
            }
            addX = Math.max(addX, row.length * size);
            currY += size;
        }
        currX += size + addX;
    };




    /*** UPDATE ***/
    //Función que se debe ejecutar cada frame
    this.update_ = function(dt) {

        
        
        this.canvas_.width  = ancho_total_;
        this.canvas_.height = alto_total_;


        if(this.is_game_over_){
            return;
        }

        player.update(dt);
        player2.update(dt);
    };





    this.empieza_ = function(){
        
        //TODO: parametrizar donde empiezan los jugadores

        player.x = 96;
        player.y = alto_total_ - player2.alto_ - 50;
        
        player2.x = ancho_total_ - 96 - player2.ancho_;
        player2.y = alto_total_ - player2.alto_ - 50;


        this.hay_muerte_ = false;
    };


    this.game_over_ = function(ctx) {
        //TODO: Hacer algo más guay si ganas
        var game_over;
        if(this.ganador_ === "1_cpu"){
            game_over =  [
                            [ 1, 1,  , 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1,  , 1,  , 1,  ],
                            [  , 1, 1, 1,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  ,  ,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1,  ,  , 1,  ,  , 1,  , 1,  , 1,  ],
                            [  , 1, 1, 1,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1,  , 1, 1, 1,  , 1,  ,  , 1,  , 1,  , 1,  ],
                            [  , 1, 1, 1,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  ,  ,  ,  , 1,  , 1,  , 1,  , 1, 1,  , 1, 1,  , 1, 1,  ,  ,  ,  ,  ,  ,  ,  ],
                            [  , 1, 1, 1,  ,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  ,  ,  ,  , 1,  , 1,  ,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1,  , 1,  , 1,  ]
                        ];
        }
        else if(this.ganador_ === "cpu"){

            game_over =  [
                            [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1, 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1],
                            [ 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1, 1, 1,  , 1, 1,  ,  ,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  ,  ,  , 1, 1,  , 1],
                            [ 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1, 1,  ,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1],
                            [ 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  ,  ,  ,  ,  , 1, 1,  , 1,  ,  , 1,  , 1,  , 1, 1,  ,  ,  , 1, 1, 1,  ],
                            [ 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1, 1, 1,  ,  ,  , 1, 1, 1, 1,  ,  ,  , 1,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1]
                        ];
        }
        else if(this.ganador_ === "1"){

            game_over =  [
                            [ 1, 1, 1, 1,  ,  ,  ,  ,  , 1, 1,  ,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1,  , 1, 1,  ,  , 1,  , 1, 1, 1, 1,  ,  , 1,  , 1,  ],
                            [ 1, 1,  , 1,  ,  ,  ,  , 1, 1, 1,  ,  ,  ,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1,  ,  , 1,  , 1, 1,  ,  ,  ,  , 1,  , 1,  ],
                            [ 1, 1,  , 1,  ,  ,  ,  ,  , 1, 1,  ,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1,  , 1, 1, 1,  , 1,  , 1, 1, 1, 1,  ,  , 1,  , 1,  ],
                            [ 1, 1, 1, 1,  ,  ,  ,  ,  , 1, 1,  ,  ,  ,  ,  , 1,  , 1,  , 1,  , 1, 1,  , 1, 1,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  ,  ,  ,  ],
                            [ 1, 1,  ,  ,  , 1,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  , 1,  , 1,  ,  , 1, 1,  , 1, 1,  ,  , 1,  , 1, 1, 1, 1,  ,  , 1,  , 1,  ]
                        ];
        }
        else if(this.ganador_ === "2"){

            game_over =  [
                            [ 1, 1, 1, 1,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1,  , 1, 1,  ,  , 1,  , 1, 1, 1, 1,  ,  , 1,  , 1,  ],
                            [ 1, 1,  , 1,  ,  ,  ,  ,  ,  , 1, 1,  ,  ,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1,  ,  , 1,  , 1, 1,  ,  ,  ,  , 1,  , 1,  ],
                            [ 1, 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1,  , 1, 1, 1,  , 1,  , 1, 1, 1, 1,  ,  , 1,  , 1,  ],
                            [ 1, 1, 1, 1,  ,  ,  ,  , 1, 1,  ,  ,  ,  ,  ,  , 1,  , 1,  , 1,  , 1, 1,  , 1, 1,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  ,  ,  ,  ],
                            [ 1, 1,  ,  ,  , 1,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  , 1,  , 1,  ,  , 1, 1,  , 1, 1,  ,  , 1,  , 1, 1, 1, 1,  ,  , 1,  , 1,  ]
                        ];
        }


        this.pinta_filas_columnas_(ctx, ancho_total_/2 - 330, 250, game_over, this.marcador_size_ * 4);
        
        this.is_game_over_ = true;

    };



    //-------------------------------------------------------------------------
    // RENDERING
    //-------------------------------------------------------------------------
  
    this.render = function(ctx, frame, dt) {

        
        

        //Si hay game over return y hago otra cosa -> TODO
        if(this.is_game_over_){
            return;
        }

        //Limpio lo que hay
        ctx.clearRect(0, 0, ancho_total_, alto_total_);

        //Renderizo los objetos
        this.render_player_(ctx, dt);
        this.render_player2_(ctx, dt);
        this.render_cuerda_(ctx, dt);

        this.render_ostiazo_(ctx, dt);
        
    };

    

    this.render_player_ = function(ctx, dt) {
        player.pinta_player_(dt, ctx, this.counter);
    };

  
    this.render_player2_ = function(ctx, dt) {  
        player2.pinta_player_(dt, ctx, this.counter);    
    };


        

    this.render_cuerda_ = function(ctx, dt) {
        cuerda.render_(dt, ctx, this.counter);
    };
    
    this.render_ostiazo_ = function(ctx, dt) {

        while((ostia_actual=this.ostiazos_.pop()) != null){ 
            
            ctx.save();
            ctx.translate(ostia_actual.x_translate_, ostia_actual.y_translate_);

            if(ostia_actual.izquierda_){  
                ctx.scale(-1, 1);
            }

            ctx.rotate(ostia_actual.rotacion_);

            this.pinta_filas_columnas_(ctx, ostia_actual.x, ostia_actual.y, ostia_actual.que_ostia_, ostia_actual.block_size_, ostia_actual.color_);
        
            ctx.restore();
        }

    };


    // SCREEN SHACKE!

    this.dx_shacke = 0;
    this.dy_shacke = 0;

    this.pre_shake_ = function() {
        if(this.tiempo_shacke_ > this.timestamp_()){
            this.ctx.save();
            if(!this.dx_shacke && !this.dy_shacke){
                this.dx_shacke = (Math.random() - 0.5) * 20;
                this.dy_shacke = (Math.random() - 0.5) * 20;

            }
            else{
                this.dy_shacke = this.dy_shacke * (-0.9);
                this.dx_shacke = this.dx_shacke * (-0.9);
            }
            
            this.ctx.translate(this.dx_shacke, this.dy_shacke); 
        }
        else{
                this.dx_shacke = 0;
                this.dy_shacke = 0;

        }
    };

    
    this.post_shake_ = function() {
        this.ctx.restore();
    };
    
    //FIN SCREEN SHACKE



  



    this.muestra_logo_ = function(ctx) {
        var logo =  [
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1, 1, 1,  ,  , 1, 1,  ,  ,  , 1, 1,  , 1, 1,  ,  , 1,  , 1, 1, 1, 1],
                        [ 1, 1,  , 1,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  ,  ,  ,  , 1, 1,  ,  , 1, 1,  , 1,  , 1, 1,  ,  ,  ,  , 1, 1,  ,  ,  ,  ,  ,  , 1, 1, 1,  , 1,  , 1, 1,  ,  ],
                        [ 1, 1,  , 1,  , 1, 1, 1,  ,  , 1, 1, 1,  ,  ,  ,  ,  , 1, 1,  ,  , 1, 1, 1, 1,  , 1, 1, 1,  ,  ,  , 1, 1,  ,  ,  , 1, 1,  , 1, 1,  , 1, 1,  , 1, 1, 1,  ],
                        [ 1, 1,  , 1,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  ,  ,  ,  , 1, 1,  ,  , 1, 1,  , 1,  , 1, 1,  ,  ,  ,  , 1, 1,  ,  ,  , 1, 1,  , 1, 1,  ,  , 1,  , 1, 1,  ,  ],
                        [ 1, 1, 1, 1,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  ,  ,  ,  , 1, 1,  ,  , 1, 1,  , 1,  , 1, 1, 1, 1,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1, 1,  ,  , 1,  , 1, 1, 1, 1],
                ];

        var size_logo_px = 8;
        var x_logo = ancho_total_/2 - (size_logo_px * logo[0].length)/2;
        var y_logo = alto_total_/4;

        this.pinta_filas_columnas_(ctx, x_logo, y_logo, logo, size_logo_px);
        
    };


    //Pinto un cargador muy simple
    //TODO: hacerlo bonito
    this.pinta_cargador_ = function(percent, ctx) {

        
        ancho_total_ = window.innerWidth,
        alto_total_  = window.innerHeight;
        
        this.canvas_.width  = ancho_total_;
        this.canvas_.height = alto_total_;


        
        ctx.fillStyle = "#ffffff";
        var ancho_cargador = 200;
        var alto_cargador = 80;
        ctx.fillRect((ancho_total_ - ancho_cargador)/2, alto_total_/2 + 50, percent * ancho_cargador, alto_cargador);

        ctx.strokeStyle="#ffffff";
        ctx.lineWidth=10;
        ctx.strokeRect((ancho_total_ - ancho_cargador)/2, alto_total_/2 + 50, ancho_cargador - 5, alto_cargador);

        
        this.muestra_logo_(this.ctx);
    };


    this.muestra_menu_ = function(ctx, select_player) {
        //Si es movil... lanzo el juego directamente (con modo = 1... 1player)
        if(this.is_touch_device_()){
            this.setup_();
            this.empieza_();
            this.empezado_ = true;
            return
        }

        
        ancho_total_ = window.innerWidth,
        alto_total_  = window.innerHeight;
        
        this.canvas_.width  = ancho_total_;
        this.canvas_.height = alto_total_;
        
        ctx.clearRect(0, 0, ancho_total_, alto_total_);

        
        //Mestro el menu de 1 player / 2 player

        //TODO: optimizar estos arrays gordisimos
        menu =  [
                    [  , 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1,  ,  , 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
                    [ 1, 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1,  ,  ,  , 1, 1,  , 1,  ,  , 1, 1,  ,  , 1, 1,  ,  ,  , 1, 1,  , 1,  ,  ,  ,  ,  ],
                    [  , 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  ,  ,  , 1, 1, 1, 1,  ,  , 1, 1,  ,  , 1, 1, 1,  ,  , 1, 1,  , 1,  ,  ,  ,  ,  ],
                    [  , 1, 1,  ,  ,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  , 1, 1,  , 1,  ,  , 1, 1,  ,  , 1, 1,  ,  ,  , 1, 1, 1,  ,  ,  ,  ,  ,  ],
                    [ 1, 1, 1, 1,  ,  , 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1,  ,  , 1, 1,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1,  ,  ,  ,  ,  ],
                    [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                    [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                    [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                    [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                    [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                    [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                    [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                    [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                    [ 1, 1, 1, 1,  ,  , 1, 1, 1, 1,  , 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1,  ,  , 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1],
                    [  ,  , 1, 1,  ,  , 1, 1,  , 1,  , 1, 1,  ,  ,  , 1, 1,  , 1,  ,  , 1, 1,  ,  , 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1,  ,  ],
                    [ 1, 1, 1, 1,  ,  , 1, 1, 1, 1,  , 1, 1,  ,  ,  , 1, 1, 1, 1,  ,  , 1, 1,  ,  , 1, 1, 1,  ,  , 1, 1,  , 1,  , 1, 1, 1, 1],
                    [ 1, 1,  ,  ,  ,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  , 1, 1,  , 1,  ,  , 1, 1,  ,  , 1, 1,  ,  ,  , 1, 1, 1,  ,  ,  ,  , 1, 1],
                    [ 1, 1, 1, 1,  ,  , 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1,  ,  , 1, 1,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1, 1, 1]
            ];

        

        // Cuando está todo seleccionado, cambio el empieza y debería rular
        var size_menu_px = 8;
        var largo_menu = size_menu_px * menu[0].length;
        var largo_menu = size_menu_px * menu[0].length;
        var x_menu = ancho_total_/2 - largo_menu/2;
        var y_menu = 200;



        // Si es menu de seleccionar jugador...
        // pinto el seleccionar jugador
        if(select_player){
            //Me creo una instacia de jugador falso para pintar el jugador en el menu

            //TODO: Cambiar esto... pintar la cara de cada jugador...

            var size_caract = 6;

            fake_player = new Player(this, 60, 100, 0, 60000, 1, false, 1);
            fake_player.pinta_player_(0, ctx, this.counter);

            caracteristicas1 =  [
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  , 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1,  ,  ,  , 1, 1,  , 1,  ,  , 1, 1, 1, 1,  ,  , 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  , 1,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1, 1,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [  ,  ,  , 1,  , 1, 1,  ,  ,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1, 1, 1,  , 1, 1,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                        [ 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  , 1, 1,  , 1, 1,  , 1,  , 1, 1, 1, 1, 1, 1,  , 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [  ,  , 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1,  , 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  , 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                ];
            this.pinta_filas_columnas_(ctx, 160, 100, caracteristicas1, size_caract);


            
            fake_player2 = new Player(this, 60, 300, 0, 60000, 1, false, 3);
            fake_player2.pinta_player_(0, ctx, this.counter);

            caracteristicas2 =  [
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  , 1,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1,  ,  ,  , 1, 1,  , 1,  ,  , 1, 1, 1, 1,  ,  , 1,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  , 1,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1, 1,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  ,  , 1,  , 1, 1,  ,  ,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1, 1, 1, 1,  , 1, 1,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                        [ 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  , 1, 1,  , 1, 1,  , 1,  , 1, 1, 1, 1, 1, 1,  , 1,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [  ,  , 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1,  , 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  , 1,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                ];
            this.pinta_filas_columnas_(ctx, 160, 300, caracteristicas2, size_caract);
            
            fake_player3 = new Player(this, 440, 100, 0, 60000, 1, false, 2);
            fake_player3.pinta_player_(0, ctx, this.counter);

            caracteristicas3 =  [
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  , 1,  ,  , 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1,  ,  ,  , 1, 1,  , 1,  ,  , 1, 1, 1, 1,  ,  , 1,  ,  , 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  , 1,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  , 1],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1, 1,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  , 1],
                        [  ,  ,  , 1,  , 1, 1,  ,  ,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  , 1],
                        [ 1, 1, 1, 1,  , 1, 1,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                        [ 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  , 1, 1,  , 1, 1,  , 1,  , 1, 1, 1, 1, 1, 1,  , 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  , 1],
                        [  ,  , 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  , 1],
                        [ 1,  , 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  , 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  , 1],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                ];
            this.pinta_filas_columnas_(ctx, 540, 100, caracteristicas3, size_caract);


            
            fake_player4 = new Player(this, 440, 300, 0, 60000, 1, false, 4);
            fake_player4.pinta_player_(0, ctx, this.counter);

            caracteristicas4 =  [
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  , 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1, 1,  ,  ,  , 1, 1,  , 1,  ,  , 1, 1, 1, 1,  ,  , 1,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1, 1,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  , 1,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [ 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1, 1,  ,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [  ,  ,  , 1,  , 1, 1,  ,  ,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1, 1, 1,  , 1, 1,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                        [ 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  , 1, 1,  , 1, 1,  , 1,  , 1, 1, 1, 1, 1, 1,  , 1,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [  ,  , 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1,  , 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1,  , 1,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1],
                        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                        [  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
                ];
            this.pinta_filas_columnas_(ctx, 540, 300, caracteristicas4, size_caract);


        }
        


        //Pinto la ayuda de teclas...
        var usa_keys  =  [
                    [  1, 1,  , 1,  ,  1, 1, 1,  , 1,  , 1,  , 1, 1, 1,  ,  ],
                    [  1, 1, 1,  ,  ,  1, 1,  ,  ,  , 1,  ,  , 1,  ,  ,  , 1],
                    [  1, 1,  ,  ,  ,  1, 1, 1,  ,  , 1,  ,  , 1, 1, 1,  ,  ],
                    [  1, 1, 1,  ,  ,  1, 1,  ,  ,  , 1,  ,  ,  ,  , 1,  , 1],
                    [  1, 1,  , 1,  ,  1, 1, 1,  ,  , 1,  ,  , 1, 1, 1,  ,  ], 
            ];

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
                    [  ,  , 1,  ,  ]
            ];
        var flecha_abj=  [
                    [  ,  , 1,  ,  ],
                    [ 1, 1, 1, 1, 1],
                    [  , 1, 1, 1,  ],
                    [  ,  , 1,  ,  ]
            ];
        var zeta=  [
                    [ 1, 1, 1, 1, ],
                    [  ,  ,  , 1, ],
                    [  ,  , 1,  , ],
                    [  , 1,  ,  , ],
                    [ 1, 1, 1, 1, ]
            ];
        var equis=  [
                    [ 1,  ,  ,  ,1],
                    [  , 1,  , 1, ],
                    [  ,  , 1,  , ],
                    [  , 1,  , 1, ],
                    [ 1,  ,  ,  ,1]
            ];
        var erre=  [
                    [ 1, 1, 1, 1, ],
                    [ 1,  ,  , 1, ],
                    [ 1,  , 1,  , ],
                    [ 1, 1, 1,  , ],
                    [ 1,  ,  , 1, ]
            ];
        var de=  [
                    [ 1, 1, 1, 1, ],
                    [ 1,  ,  , 1, ],
                    [ 1,  ,  , 1, ],
                    [ 1,  ,  , 1, ],
                    [ 1, 1, 1,  , ]
            ];
        var efe=  [
                    [ 1, 1, 1, 1, ],
                    [ 1,  ,  ,  , ],
                    [ 1, 1, 1,  , ],
                    [ 1,  ,  ,  , ],
                    [ 1,  ,  ,  , ]
            ];
        var ge=  [
                    [ 1, 1, 1, 1, ],
                    [ 1,  ,  ,  , ],
                    [ 1,  , 1, 1, ],
                    [ 1,  ,  , 1, ],
                    [ 1, 1, 1, 1, ]
            ];
        var enter_key=  [
                    [  ,  ,  , 1, ],
                    [  ,  ,  , 1, ],
                    [  , 1,  , 1, ],
                    [ 1, 1, 1, 1, ],
                    [  , 1,  ,  , ]
            ];
        var shift_key=  [
                    [  ,  ,  , 1,  ,  ,  ],
                    [  ,  , 1,  , 1,  ,  ],
                    [  , 1,  ,  ,  , 1,  ],
                    [ 1, 1, 1,  , 1, 1, 1],
                    [  ,  , 1, 1, 1,  ,  ]
            ];


        var size_flecha_px = 3;


        this.pinta_filas_columnas_(ctx, 50, alto_total_ - 130, usa_keys, 3);
        var y_select = y_menu - (size_menu_px * 4);
        if(this.modo_ == 2){
            y_select = y_select + size_menu_px * 14;


            //size_flecha_px = size_flecha_px/2;
            this.pinta_filas_columnas_(ctx, 50, alto_total_ - 50, de, size_flecha_px);
            this.pinta_filas_columnas_(ctx, 105, alto_total_ - 50, ge, size_flecha_px);
            this.pinta_filas_columnas_(ctx, 80, alto_total_ - 75, erre, size_flecha_px);
            this.pinta_filas_columnas_(ctx, 80, alto_total_ - 50, efe, size_flecha_px);
            this.pinta_filas_columnas_(ctx, 160, alto_total_ - 50, zeta, size_flecha_px);
            this.pinta_filas_columnas_(ctx, 200, alto_total_ - 50, equis, size_flecha_px);


            this.pinta_filas_columnas_(ctx, ancho_total_ - 220, alto_total_ - 50, flecha_izq, size_flecha_px*1.5);
            this.pinta_filas_columnas_(ctx, ancho_total_ - 155, alto_total_ - 50, flecha_der, size_flecha_px*1.5);
            this.pinta_filas_columnas_(ctx, ancho_total_ - 190, alto_total_ - 70, flecha_arr, size_flecha_px*1.5);
            this.pinta_filas_columnas_(ctx, ancho_total_ - 190, alto_total_ - 45, flecha_abj, size_flecha_px*1.5);
            this.pinta_filas_columnas_(ctx, ancho_total_ - 100, alto_total_ - 55, enter_key, size_flecha_px*2);
            this.pinta_filas_columnas_(ctx, ancho_total_ - 60, alto_total_ - 50, shift_key, size_flecha_px*1.3);
        }
        else{

            this.pinta_filas_columnas_(ctx, ancho_total_/2 - 90, alto_total_ - 50, flecha_izq, size_flecha_px*1.8);
            this.pinta_filas_columnas_(ctx, ancho_total_/2 + 5, alto_total_ - 50, flecha_der, size_flecha_px*1.8);
            this.pinta_filas_columnas_(ctx, ancho_total_/2 - 45, alto_total_ - 80, flecha_arr, size_flecha_px*1.8);
            this.pinta_filas_columnas_(ctx, ancho_total_/2 - 45, alto_total_ - 45, flecha_abj, size_flecha_px*1.8);
            this.pinta_filas_columnas_(ctx, ancho_total_/2 + 75, alto_total_ - 50, zeta, size_flecha_px*1.5);
            this.pinta_filas_columnas_(ctx, ancho_total_/2 + 125, alto_total_ - 50, equis, size_flecha_px*1.5);

        }


        if(!select_player){
            
            ctx.strokeStyle="#ffffff";
            ctx.lineWidth=10;
            ctx.strokeRect(x_menu - (size_menu_px * 4), y_select, largo_menu + (size_menu_px * 8), 12 * size_menu_px);
            this.pinta_filas_columnas_(ctx, x_menu, y_menu, menu, size_menu_px);
        }
        else{


            if(this.modo_ === 2){
                p2 =  [
                            [ 1, 1, 1, 1,  ,  , 1, 1, 1],
                            [ 1, 1,  , 1,  ,  ,  ,  , 1],
                            [ 1, 1, 1, 1,  ,  , 1, 1, 1],
                            [ 1, 1,  ,  ,  ,  , 1,  ,  ],
                            [ 1, 1,  ,  ,  ,  , 1, 1, 1]
                        ];

                var x_p2 = 340;
                var y_p2 = 52;

                var x_selec_player = 40;
                var y_selec_player = 80;
                var ancho_selec_player = 370;
                var alto_selec_player = 140;
                switch(this.player2_tipo_) {
                
                    case 2: 
                        x_selec_player = 420;
                        y_selec_player = 80;
                        x_p2 = 720;
                        y_p2 = 52;
                        break;
                    case 3: 
                        x_selec_player = 40;
                        y_selec_player = 280;
                        x_p2 = 340;
                        y_p2 = 252;

                        break;
                    case 4: 
                        x_selec_player = 420;
                        y_selec_player = 280;
                        x_p2 = 720;
                        y_p2 = 252;

                        break;
                }
                this.pinta_filas_columnas_(ctx, x_p2, y_p2, p2, 4, this.COLOR_.PURPLE);
                ctx.strokeStyle = this.COLOR_.PURPLE;
                ctx.strokeRect(x_selec_player, y_selec_player, ancho_selec_player, alto_selec_player);
                if(this.player2_selected_){
                    this.ctx.globalAlpha = 0.5;
                    this.ctx.fillStyle = this.COLOR_.PURPLE;
                    this.ctx.fillRect(x_selec_player, y_selec_player, ancho_selec_player, alto_selec_player);
                    this.ctx.globalAlpha = 1.0;
                }
            }



            p1 =  [
                        [ 1, 1, 1, 1,  ,  ,  , 1, 1],
                        [ 1, 1,  , 1,  ,  , 1, 1, 1],
                        [ 1, 1, 1, 1,  ,  ,  , 1, 1],
                        [ 1, 1,  ,  ,  ,  ,  , 1, 1],
                        [ 1, 1,  ,  ,  ,  ,  , 1, 1]
                    ];

            var x_p1 = 70;
            var y_p1 = 52;

            var x_selec_player = 40;
            var y_selec_player = 80;
            var ancho_selec_player = 370;
            var alto_selec_player = 140;
            switch(this.player1_tipo_) {
            
                case 2: 
                    x_selec_player = 420;
                    y_selec_player = 80;
                    x_p1 = 450;
                    y_p1 = 52;
                    break;
                case 3: 
                    x_selec_player = 40;
                    y_selec_player = 280;
                    x_p1 = 70;
                    y_p1 = 252;

                    break;
                case 4: 
                    x_selec_player = 420;
                    y_selec_player = 280;
                    x_p1 = 450;
                    y_p1 = 252;

                    break;
            }
            this.pinta_filas_columnas_(ctx, x_p1, y_p1, p1, 4, this.COLOR_.YELLOW);
            ctx.strokeStyle = this.COLOR_.YELLOW;
            ctx.strokeRect(x_selec_player, y_selec_player, ancho_selec_player, alto_selec_player);
            if(this.player1_selected_){
                this.ctx.globalAlpha = 0.5;
                this.ctx.fillStyle = this.COLOR_.YELLOW;
                this.ctx.fillRect(x_selec_player, y_selec_player, ancho_selec_player, alto_selec_player);
                this.ctx.globalAlpha = 1.0;
            }


        }


    };

    this.mueve_menu_ = function (abajo) {

        //aal moverme por el menu, hago sonar un sonidico
        window.croqueta_audio.play();

        //cambio el modo
        if(abajo){
            this.modo_ = 2;
        }
        else{
            this.modo_ = 1;
        }
        //Y vuelvo a pintar el menu
        this.muestra_menu_(this.ctx, false);
    }

    this.mueve_selec_player_ = function (player1, dir) {

        window.croqueta_audio.play();

        if(player1){
            switch(dir) {
                case "up":  
                    if(this.player1_tipo_ > 2){
                        this.player1_tipo_ = this.player1_tipo_ - 2;
                    }
                    break;
                case "down":  
                    if(this.player1_tipo_ < 3){
                        this.player1_tipo_ = this.player1_tipo_ + 2;
                    }
                    break;
                case "left":  
                    if(this.player1_tipo_ === 2 || this.player1_tipo_ === 4){
                        this.player1_tipo_ = this.player1_tipo_ - 1;
                    }
                    break;
                case "right":  
                    if(this.player1_tipo_ === 1 || this.player1_tipo_ === 3){
                        this.player1_tipo_ = this.player1_tipo_ + 1;
                    }
                    break;
            }
        }
        else{
            switch(dir) {
                case "up":  
                    if(this.player2_tipo_ > 2){
                        this.player2_tipo_ = this.player2_tipo_ - 2;
                    }
                    break;
                case "down":  
                    if(this.player2_tipo_ < 3){
                        this.player2_tipo_ = this.player2_tipo_ + 2;
                    }
                    break;
                case "left":  
                    if(this.player2_tipo_ === 2 || this.player2_tipo_ === 4){
                        this.player2_tipo_ = this.player2_tipo_ - 1;
                    }
                    break;
                case "right":  
                    if(this.player2_tipo_ === 1 || this.player2_tipo_ === 3){
                        this.player2_tipo_ = this.player2_tipo_ + 1;
                    }
                    break;
            }

        }

        this.muestra_menu_(this.ctx, true);
    }

    this.selecciona_menu_ = function () {
        window.golpe_audio2.play();
        this.muestra_menu_(this.ctx, true);
        this.numero_jugadores_ = this.modo_;

        //this.setup_();
        //this.empieza_(true);
        //this.empezado_ = true;
    }

    this.selec_player_ = function (player1) {

        var x_selec_player = 40;
        var y_selec_player = 80;
        var ancho_selec_player = 370;
        var alto_selec_player = 140;

        var player_pinta = this.player1_tipo_;

        
        if(player1 && this.player1_selected_){
            return;
        }
        else if(!player1 && this.player2_selected_){
            return;
        }
        

        var color = this.COLOR_.YELLOW;
        if(!player1){
            this.player2_selected_ = true;
            player_pinta = this.player2_tipo_;
            color = this.COLOR_.PURPLE;
        }
        else{
            this.player1_selected_ = true;
        }

        switch(player_pinta) {
        
            case 2: 
                x_selec_player = 420;
                y_selec_player = 80;
                break;
            case 3: 
                x_selec_player = 40;
                y_selec_player = 280;

                break;
            case 4: 
                x_selec_player = 420;
                y_selec_player = 280;
                break;
        }

       
        this.ctx.globalAlpha = 0.5;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x_selec_player, y_selec_player, ancho_selec_player, alto_selec_player);
        this.ctx.globalAlpha = 1.0;

        if(this.modo_ === 1 || this.player1_selected_ && this.player2_selected_){
            this.setup_();
            this.empieza_();
            this.empezado_ = true;
            
        }
    }
    


    this.setup_ = function() {

        player = new Player(this, 96, 1107, 800, 60000, 1, false, this.player1_tipo_);
        var cpu = true;
        var tipo2 = false;
        if(this.modo_ == 2){
            cpu = false;
            tipo2 = this.player2_tipo_;
        }
        player2 = new Player(this, 1850, 1107, 800, 60000, 2, cpu, tipo2);

        cuerda = new Cuerda(this);

    };





    /***** LANZAAAAA ****/

    this.modo_ = 1; // modo=1 -> 1player + modo=2 -> 2 players
    this.level_ = 1; // modo=1 -> 1player + modo=2 -> 2 players

    this.empezado_ = false; // controla cuando la partida ha empezado

    this.pausa_ = false; // juego en pausa
    this.is_game_over_ = false; //controla el findel juego

    this.numero_jugadores_ = false;

    this.player1_tipo_ = 1;
    this.player2_tipo_ = 1;
    this.player1_selected_ = false;
    this.player2_selected_ = false;

    /*
    ancho_total_ = 840,
    alto_total_  = 600,
    */
    ancho_total_ = window.innerWidth,
    alto_total_  = window.innerHeight,
  
    
    this.ACCEL_    = 0.01,     // default take 1/2 second to reach maxdx (horizontal acceleration)
    this.FRICTION_ = 0.001,     // default take 1/6 second to stop from maxdx (horizontal friction)
    
    this.COLOR_    = { BLACK: '#000000', 
                      YELLOW: '#ECD078', 
                      BRICK: '#D95B43', 
                      PINK: '#C02942', 
                      PURPLE: '#542437', 
                      GREY: '#333', 
                      SLATE: '#53777A', 
                      GOLD: 'gold'
                  },
   
    this.KEY      = { ENTER: 13, SHIFT: 16, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, Z: 90, X: 88, R: 82, D: 68, F: 70, G: 71 },
      
    this.fps_            = 60,
    this.step_           = 1/this.fps_,
    this.canvas_         = document.getElementById('canvas'),
    this.ctx            = this.canvas_.getContext('2d'),
    this.canvas_.width  = ancho_total_,
    this.canvas_.height = alto_total_,
    
    
    this.hay_muerte_      = false, //Aqui voy a controlar cuando se mate a alguien
    

    this.tiempo_shacke_ = this.timestamp_(),
    
    this.cuerda_ = [];  //puntos que ocupa la cuerda

    this.marcador_size_ = 4,


    this.ostiazos_ = [];


    //Se muestra logo nada más empezar
    this.muestra_logo_(this.ctx);

};

