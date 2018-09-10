

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
                        if(this.numero_jugadores_ && !this.player2_selected_){
                            this.mueve_selec_player_(false, "left");
                        }
                    }
                }
                else{
                    if(this.modo_ === 1){
                        this.player_.left  = down; 
                    }
                    else{
                        this.player2_.left  = down; 
                    }
                }
                return false;
            case this.KEY.RIGHT: 
                ev.preventDefault(); 
                if(!this.empezado_){
                    if(down){
                        if(this.numero_jugadores_ && !this.player2_selected_){
                            this.mueve_selec_player_(false, "right");
                        }
                    }
                }
                else{
                    if(this.modo_ === 1){
                        this.player_.right  = down; 
                    }
                    else{
                        this.player2_.right  = down; 
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
                        else if(!this.player2_selected_){
                            this.mueve_selec_player_(false, "up");
                        }
                    }
                }
                else{
                    if(this.modo_ === 1){
                        this.player_.up  = down; 
                    }
                    else{
                        this.player2_.up  = down; 
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
                        else if(!this.player2_selected_){
                            this.mueve_selec_player_(false, "down");
                        }
                    }
                }
                else{
                    if(this.modo_ === 1){
                        this.player_.down  = down; 
                    }
                    else{
                        this.player2_.down  = down; 
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
                            this.selec_player_(false);
                        }
                    }
                }
                else{
                    if(this.modo_ === 1){
                        this.player_.accion  = down; 
                    }
                    else{
                        this.player2_.accion  = down; 
                    }
                }
                return false;
            case this.KEY.SHIFT: 
                ev.preventDefault(); 
                if(this.empezado_){
                    if(this.modo_ === 1){
                        this.player_.jump  = down; 
                    }
                    else{
                        this.player2_.jump  = down; 
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
                            this.selec_player_(true);
                        }
                    }
                }
                else{
                    this.player_.accion  = down;  
                }
                return false;
            case this.KEY.X: 
                ev.preventDefault(); 
                if(this.empezado_){
                    this.player_.jump  = down; 
                }
                return false;
            case this.KEY.R: 
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
                    if(this.modo_ === 2){
                        this.player_.up  = down; 
                    }
                }
                return false;
            case this.KEY.D: 
                ev.preventDefault(); 
                if(!this.empezado_){
                    if(down){
                        if(this.numero_jugadores_ && !this.player1_selected_){
                            this.mueve_selec_player_(true, "left");
                        }
                    }
                }
                else{
                    if(this.modo_ === 2){
                        this.player_.left  = down; 
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
                        else if(!this.player1_selected_){
                            this.mueve_selec_player_(true, "down");
                        }
                    }
                }
                else{
                    if(this.modo_ === 2){
                        this.player_.down  = down; 
                    }
                }
                return false;
            case this.KEY.G: 
                ev.preventDefault();  
                if(!this.empezado_){
                    if(down){
                        if(this.numero_jugadores_ && !this.player1_selected_){
                            this.mueve_selec_player_(true, "right");
                        }
                    }
                }
                else{
                    if(this.modo_ === 2){
                        this.player_.right  = down; 
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
                    ctx.fillRect(currX + i_x * size, currY, size*1.1, size*1.1);
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



        if(this.is_game_over_){
            return;
        }

        this.player_.update(dt);
        this.player2_.update(dt);
    };





    this.empieza_ = function(){
        
        //TODO: parametrizar donde empiezan los jugadores

        this.player_.x = 15;
        this.player_.y = 100;
        
        if(this.modo_ == 1){
            this.player2_.tipo_ = this.level_;
            this.player2_.cambia_tipo_(this.level_);
        }
        this.player2_.x = ancho_total_ - this.player2_.ancho_ - 5;
        this.player2_.y = 100;

        this.fpsInterval     = 1000 / 60;
        //console.log(this.player2_);

        this.hay_muerte_ = false;

        this.tiempo_cuenta_atras_ = this.timestamp_() + 4000;

    };


    this.game_over_ = function(ctx) {
        //TODO: Hacer algo más guay si ganas
        var game_over;
        
        if(this.ganador_ === "1_cpu"){
            game_over = this.you_win_; 
        }
        else if(this.ganador_ === "cpu"){
            game_over = this.you_lost_; 
        }
        else if(this.ganador_ === "1"){
            game_over = this.p1_win_;
        }
        else if(this.ganador_ === "2"){
            game_over = this.p2_win_;
        }

        this.pinta_filas_columnas_(ctx, ancho_total_/2 - 330, 250, game_over, this.marcador_size_ * 4);
        
        //this.is_game_over_ = true;

    };

    this.siguiente_oponente_ = function(ctx){
        this.pinta_filas_columnas_(ctx, ancho_total_/2 - 330, 250, this.you_win_, this.marcador_size_ * 4);

        if(this.hay_siguiente_oponente_ && this.tiempo_siguiente_oponente_ < this.timestamp_()){
            ++this.level_;
            
            this.select_cpu_ = true;
            this.tiempo_select_cpu_ = this.timestamp_() + 6000;
            this.empezado_ = false;
            this.hay_siguiente_oponente_ = false;
            this.muestra_menu_(ctx, true);
        }
        else if(!this.hay_siguiente_oponente_){
            this.hay_siguiente_oponente_ = true;
            this.tiempo_siguiente_oponente_ = this.timestamp_() + 3000;
        }
    }

    //-------------------------------------------------------------------------
    // RENDERING
    //-------------------------------------------------------------------------
  
    this.render = function(ctx, frame, dt) {

        //Si hay game over return y hago otra cosa -> TODO
        if(this.is_game_over_){
            return;
        }

        //Limpio lo que hay
        //ctx.clearRect(0, 0, ancho_total_, alto_total_);

        

        //Renderizo los objetos
        this.render_paisaje_(ctx, dt);

        
        if(this.tiempo_cuenta_atras_ > this.timestamp_()){
            this.pinta_cuenta_atras(ctx);
        }

        this.render_cuerda_(ctx, dt);
        this.render_edificios_cerca_(ctx, dt);
        this.render_player_(ctx, dt);
        this.render_player2_(ctx, dt);

        this.render_ostiazo_(ctx, dt);
        
        
    };

    

    this.render_player_ = function(ctx, dt) {
        this.player_.pinta_vida_(ctx);
        this.player_.pinta_player_(dt, ctx, this.counter);
    };

  
    this.render_player2_ = function(ctx, dt) {  
        this.player2_.pinta_vida_(ctx);
        this.player2_.pinta_player_(dt, ctx, this.counter);    
    };


        

    this.render_cuerda_ = function(ctx, dt) {
        cuerda.render_(dt, ctx, this.counter);
    };
        

    this.render_edificios_cerca_ = function(ctx, dt) {
        ctx.fillStyle= "#0a2830";
        ctx.fillRect(0, alto_total_ /3 , 80, 1500);
        ctx.fillRect(ancho_total_ - 80, alto_total_ / 3, 80, 1500);
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

    this.render_paisaje_ = function(ctx, dt) {

        var alto_luz = alto_total_/4 + this.counter/140;
    

        var grd=ctx.createLinearGradient(0, 0, 0 , alto_luz);
        grd.addColorStop(0,"#aa92c9");
        grd.addColorStop(1,"#ffbda2");
        ctx.fillStyle=grd;
        ctx.fillRect(0,0,ancho_total_,alto_total_);
        
        var x_sol = -350 + this.counter/140;
        var y_sol = -150 + this.counter/140;
        var w_sol = 60;
        var h_sol_line = 15;
        //SOL
        var anchos = [8,14,16,18,20,22,23,24,25,26,27,27,28,29,29,29,30,30,30,30,29,29,29,28,27,27,26,25,24,23,22,20,18,16,14,8]

        for (var i = 0; i < anchos.length; i++) {
            y_sol = y_sol+6;
            w_sol_now = anchos[i]*7.5;
            x_sol_now  = ancho_total_/2 + x_sol - w_sol_now/2
            
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(x_sol_now, alto_total_/3 + y_sol, w_sol_now, h_sol_line);
            
        }

        //edificios
        var color_lejos = "#ec8e9e";
        var color_medio = "#cb6b8d";
        var color_medio2 = "#904b6b";

        ctx.fillStyle=color_lejos;
        ctx.fillRect(5, alto_total_/2 - 200, 100, 1300);
        ctx.fillRect(165, alto_total_/2 - 150, 80, 1320);
        ctx.fillRect(350, alto_total_/2 - 130, 120, 1220);
        ctx.fillRect(650, alto_total_/2 - 180, 160, 1320);
        ctx.fillRect(850, alto_total_/2 - 50, 110, 1220);

        
        ctx.fillRect(1005, alto_total_/2 - 200, 100, 1300);
        ctx.fillRect(1165, alto_total_/2 - 150, 70, 1320);
        ctx.fillRect(1350, alto_total_/2 - 130, 120, 1220);
        ctx.fillRect(1650, alto_total_/2 - 180, 160, 1320);
        ctx.fillRect(1850, alto_total_/2 - 50, 110, 1220);

        
        ctx.fillStyle="rgba(255,255,255,0.5)";
        for (j = 0; j < 20; j++) {
            for (i = 0; i < 4; i++) {
                if(this.random_array_[(i+1)*(j+1)]>0){
                    ctx.fillRect(20 + i*20, alto_total_/2 - 180 + j*20, 10, 10);
                    ctx.fillRect(370 + i*20, alto_total_/2 - 110 + j*20, 10, 10);
                    ctx.fillRect(870 + i*20, alto_total_/2 - 30 + j*20, 10, 10);
                    ctx.fillRect(1170 + i*20, alto_total_/2 - 140 + j*20, 10, 10);
                    ctx.fillRect(1680 + i*20, alto_total_/2 - 160 + j*20, 10, 10);
                }
                if(this.random_array_[(i+1)*(j+1)*2]>0){
                    ctx.fillRect(170 + i*20, alto_total_/2 - 140 + j*20, 10, 10);
                    ctx.fillRect(680 + i*20, alto_total_/2 - 160 + j*20, 10, 10);
                    ctx.fillRect(1020 + i*20, alto_total_/2 - 180 + j*20, 10, 10);
                    ctx.fillRect(1370 + i*20, alto_total_/2 - 110 + j*20, 10, 10);
                    ctx.fillRect(1870 + i*20, alto_total_/2 - 30 + j*20, 10, 10);  
                }
            }
        }


        ctx.fillStyle=color_medio;
        ctx.fillRect(45, alto_total_/1.5 - 200, 150, 1300);
        ctx.fillRect(235, alto_total_/1.5 - 150, 130, 1370);
        ctx.fillRect(390, alto_total_/1.5 - 130, 180, 1290);
        ctx.fillRect(590, alto_total_/1.5 - 180, 200, 1370);
        ctx.fillRect(850, alto_total_/1.5 - 50, 180, 1250);

        ctx.fillRect(1045, alto_total_/1.5 - 200, 200, 1350);
        ctx.fillRect(1235, alto_total_/1.5 - 150, 130, 1370);
        ctx.fillRect(1390, alto_total_/1.5 - 130, 180, 1310);
        ctx.fillRect(1590, alto_total_/1.5 - 180, 200, 1370);
        ctx.fillRect(1850, alto_total_/1.5 - 50, 180, 1250);

        ctx.fillStyle="rgba(255,255,255,0.5)";
        for (j = 0; j < 20; j++) {
            for (i = 0; i < 5; i++) {
                if(this.random_array_[(i+1)*(j+1)*3]>0){
                    ctx.fillRect(65 + i*26, alto_total_/1.5 - 180 + j*26, 13, 13);
                    ctx.fillRect(410 + i*26, alto_total_/1.5 - 110 + j*26, 13, 13);
                    ctx.fillRect(870 + i*26, alto_total_/1.5 - 30 + j*26, 13, 13);
                    ctx.fillRect(1255 + i*26, alto_total_/1.5 - 130 + j*26, 13, 13);
                    ctx.fillRect(1610 + i*26, alto_total_/1.5 - 160 + j*26, 13, 13);
                    ctx.fillRect(1870 + i*26, alto_total_/1.5 - 30 + j*26, 13, 13);
                }
                if(this.random_array_[(i+1)*(j+1)*4]>0){
                    ctx.fillRect(255 + i*26, alto_total_/1.5 - 130 + j*26, 13, 13);
                    ctx.fillRect(610 + i*26, alto_total_/1.5 - 160 + j*26, 13, 13);
                    ctx.fillRect(1065 + i*26, alto_total_/1.5 - 180 + j*26, 13, 13);
                    ctx.fillRect(1410 + i*26, alto_total_/1.5 - 110 + j*26, 13, 13);
                    ctx.fillRect(1870 + i*26, alto_total_/1.5 - 30 + j*26, 13, 13);
                    ctx.fillRect(2255 + i*26, alto_total_/1.5 - 130 + j*26, 13, 13);
                }
            }
        }

        
        ctx.fillStyle=color_medio2;
        ctx.fillRect(-25, alto_total_ - 200, 280, 1300);
        ctx.fillRect(335, alto_total_ - 350, 260, 1370);
        ctx.fillRect(640, alto_total_ - 180, 280, 1290);
        ctx.fillRect(990, alto_total_ - 270, 300, 1370);
        ctx.fillRect(1350, alto_total_ - 250, 380, 1250);
        
        ctx.fillRect(1105, alto_total_ - 200, 350, 1300);
        ctx.fillRect(1335, alto_total_ - 350, 230, 1370);
        ctx.fillRect(1640, alto_total_ - 180, 280, 1290);
        ctx.fillRect(1990, alto_total_ - 270, 300, 1370);
        ctx.fillRect(2350, alto_total_ - 250, 380, 1250);

        
        ctx.fillStyle="rgba(255,255,255,0.5)";
        for (j = 0; j < 20; j++) {
            for (i = 0; i < 6; i++) {
                if(this.random_array_[(i+1)*(j+1)*5]>0){
                    ctx.fillRect(-5 + i*44, alto_total_ - 180 + j*44, 22, 22);
                    ctx.fillRect(1010 + i*44, alto_total_ - 250 + j*44, 22, 22);
                }
                if(this.random_array_[(i+1)*(j+1)*6]>0){
                    ctx.fillRect(345 + i*44, alto_total_ - 330 + j*44, 22, 22);
                    ctx.fillRect(1370 + i*44, alto_total_ - 230 + j*44, 22, 22);
                }
                if(this.random_array_[(i+1)*(j+1)*7]>0){
                    ctx.fillRect(660 + i*44, alto_total_ - 160 + j*44, 22, 22);
                }
            }
        }
        
           
    };


    // SCREEN SHACKE!

    this.dx_shacke = 0;
    this.dy_shacke = 0;

    this.pre_shake_ = function() {
        if(this.tiempo_shacke_ > this.timestamp_()){
            this.ctx.save();
            if(!this.dx_shacke && !this.dy_shacke){
                this.dx_shacke = (Math.random() - 0.5) * this.intensidad_shacke_;
                this.dy_shacke = (Math.random() - 0.5) * this.intensidad_shacke_;

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



  



    this.pinta_cuenta_atras = function(ctx) {
        var numeros = []
        
        numeros[3] =  [
                        [ 1, 1, 1, 1],
                        [  ,  , 1, 1],
                        [ 1, 1, 1, 1],
                        [  ,  , 1, 1],
                        [ 1, 1, 1, 1],
                ];
        numeros[2] =  [
                        [ 1, 1, 1, 1],
                        [ 1, 1, 1, 1],
                        [  ,  , 1, 1],
                        [ 1, 1, 1,  ],
                        [ 1, 1, 1, 1],
                ];
        numeros[1] =  [
                        [  ,  , 1, 1],
                        [  ,  , 1, 1],
                        [  ,  , 1, 1],
                        [  ,  , 1, 1],
                        [  ,  , 1, 1],
                ];
        numeros[0] =  [
                        [ 1, 1, 1, 1,  , 1, 1,  , 1, 1, 1, 1, 1,  , 1,  , 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1, 1],
                        [ 1, 1,  ,  ,  , 1, 1,  , 1, 1,  ,  ,  ,  , 1,  , 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1, 1],
                        [ 1, 1, 1, 1,  , 1, 1,  , 1, 1,  , 1, 1,  , 1, 1, 1, 1,  ,  , 1, 1,  ,  , 1, 1,  , 1, 1],
                        [ 1, 1,  ,  ,  , 1, 1,  , 1, 1,  ,  , 1,  , 1,  , 1, 1,  ,  , 1, 1,  ,  ,  ,  ,  ,  ,  ],
                        [ 1, 1,  ,  ,  , 1, 1,  , 1, 1, 1, 1, 1,  , 1,  , 1, 1,  ,  , 1, 1,  ,  , 1, 1,  , 1, 1],
                ];
        

        numero_decimal = (this.tiempo_cuenta_atras_- this.timestamp_())/1000;
        numero = Math.floor(numero_decimal);

        var size_cuenta_atras = 8 * (2 + numero - numero_decimal);
        var x_logo = ancho_total_/2 - (size_cuenta_atras * numeros[numero][1].length)/2;
        var y_logo = alto_total_/4;
        
        this.pinta_filas_columnas_(ctx, x_logo, y_logo, numeros[numero], size_cuenta_atras);

        if(this.modo_ == 1){
            this.pinta_filas_columnas_(ctx, this.player_.x + this.player_.ancho_/2, this.player_.y - 50, this.p1 , 3, this.COLOR_.YELLOW);
            this.pinta_filas_columnas_(ctx, this.player_.x + this.player_.ancho_/2 + 5, this.player_.y - 30, this.triangulin_ , 3, this.COLOR_.YELLOW);
        }
        else{
            this.pinta_filas_columnas_(ctx, this.player_.x + this.player_.ancho_/2, this.player_.y - 50, this.p1 , 3, this.COLOR_.YELLOW);
            this.pinta_filas_columnas_(ctx, this.player_.x + this.player_.ancho_/2 + 5, this.player_.y - 30, this.triangulin_ , 3, this.COLOR_.YELLOW);

            this.pinta_filas_columnas_(ctx, this.player2_.x + this.player2_.ancho_/2 - 15, this.player2_.y - 50, this.p2 , 3, this.COLOR_.PURPLE);
            this.pinta_filas_columnas_(ctx, this.player2_.x + this.player2_.ancho_/2 - 10, this.player2_.y - 30, this.triangulin_ , 3, this.COLOR_.PURPLE);

        }
        
    };
  



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

        if(window.innerWidth < 820){
            ancho_total_ = window.innerWidth * 2,
            alto_total_  = window.innerHeight * 1.5;

        }
        else{
            ancho_total_ = window.innerWidth,
            alto_total_  = window.innerHeight;
        }
        
        this.canvas_.width  = ancho_total_;
        this.canvas_.height = alto_total_;

        
        this.render_paisaje_(ctx);
        
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
        
        if(this.is_touch_device_() && !select_player){   
            this.modo_ = 1;
            this.modo_seleccionado_ = true;
        }
        
        if(window.innerWidth < 820){
            ancho_total_ = window.innerWidth * 2,
            alto_total_  = window.innerHeight * 1.5;

        }
        else{
            ancho_total_ = window.innerWidth,
            alto_total_  = window.innerHeight;
        }
        
        this.canvas_.width  = ancho_total_;
        this.canvas_.height = alto_total_;
        
        //ctx.clearRect(0, 0, ancho_total_, alto_total_);

        
        
        
        this.render_paisaje_(ctx);
        
        //Mestro el menu de 1 this.player_ / 2 this.player_

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
        var y_menu = alto_total_/4;


        
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = "#000000";
        
        ctx.fillRect(0,0,ancho_total_,alto_total_);
        ctx.globalAlpha = 1;
        

        // Si es menu de seleccionar jugador...
        // pinto el seleccionar jugador
        if(select_player){
            
            //Me creo una instacia de jugador falso para pintar el jugador en el menu

            //TODO: Cambiar esto... pintar la cara de cada jugador...
            var size_caract = 6;

            this.x_selector_player_1_ = ancho_total_ / 2.3 - 6*35;
            this.y_selector_player_1_ = alto_total_ / 4;
            
            this.x_selector_player_2_ = ancho_total_ / 2.3 + 6*35;
            this.y_selector_player_2_ = alto_total_ / 2;

            fake_player = new Player(this, this.x_selector_player_1_ - 85, this.y_selector_player_1_ + 10, 0, 60000, 1, false, 1, 4);

            if(this.level_ > 1){
                fake_player.estoy_muerto_ = true;
            }

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
            this.pinta_filas_columnas_(ctx, this.x_selector_player_1_, this.y_selector_player_1_, caracteristicas1, size_caract);
            
            fake_player2 = new Player(this, this.x_selector_player_1_ - 85, this.y_selector_player_2_ + 10, 0, 60000, 1, false, 3, 4);
            if(this.level_ > 3){
                fake_player2.estoy_muerto_ = true;
            }
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
                
            this.pinta_filas_columnas_(ctx, this.x_selector_player_1_, this.y_selector_player_2_, caracteristicas2, size_caract);
            
            fake_player3 = new Player(this, this.x_selector_player_2_ - 85, this.y_selector_player_1_ + 10, 0, 60000, 1, false, 2, 4);
            if(this.level_ > 2){
                fake_player3.estoy_muerto_ = true;
            }
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
            this.pinta_filas_columnas_(ctx, this.x_selector_player_2_, this.y_selector_player_1_, caracteristicas3, size_caract);


            fake_player4 = new Player(this, this.x_selector_player_2_ - 85, this.y_selector_player_2_ + 10, 0, 60000, 1, false, 4, 4);
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
            this.pinta_filas_columnas_(ctx, this.x_selector_player_2_, this.y_selector_player_2_, caracteristicas4, size_caract);


        }
        


        if(!this.is_touch_device_()){
            //Pinto la ayuda de teclas...
            var usa_keys  =  [
                        [  1, 1,  , 1,  ,  1, 1, 1,  , 1,  , 1,  , 1, 1, 1,  ,  ],
                        [  1, 1, 1,  ,  ,  1, 1,  ,  ,  , 1,  ,  , 1,  ,  ,  , 1],
                        [  1, 1,  ,  ,  ,  1, 1, 1,  ,  , 1,  ,  , 1, 1, 1,  ,  ],
                        [  1, 1, 1,  ,  ,  1, 1,  ,  ,  , 1,  ,  ,  ,  , 1,  , 1],
                        [  1, 1,  , 1,  ,  1, 1, 1,  ,  , 1,  ,  , 1, 1, 1,  ,  ], 
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


                this.pinta_filas_columnas_(ctx, ancho_total_ - 220, alto_total_ - 50, this.flecha_izq, size_flecha_px*1.5);
                this.pinta_filas_columnas_(ctx, ancho_total_ - 155, alto_total_ - 50, this.flecha_der, size_flecha_px*1.5);
                this.pinta_filas_columnas_(ctx, ancho_total_ - 190, alto_total_ - 70, this.flecha_arr, size_flecha_px*1.5);
                this.pinta_filas_columnas_(ctx, ancho_total_ - 190, alto_total_ - this.flecha_abj, size_flecha_px*1.5);
                this.pinta_filas_columnas_(ctx, ancho_total_ - 100, alto_total_ - 55, enter_key, size_flecha_px*2);
                this.pinta_filas_columnas_(ctx, ancho_total_ - 60, alto_total_ - 50, shift_key, size_flecha_px*1.3);
            }
            else{

                this.pinta_filas_columnas_(ctx, ancho_total_/2 - 90, alto_total_ - 50, this.flecha_izq, size_flecha_px*1.8);
                this.pinta_filas_columnas_(ctx, ancho_total_/2 + 5, alto_total_ - 50, this.flecha_der, size_flecha_px*1.8);
                this.pinta_filas_columnas_(ctx, ancho_total_/2 - 45, alto_total_ - 80, this.flecha_arr, size_flecha_px*1.8);
                this.pinta_filas_columnas_(ctx, ancho_total_/2 - 45, alto_total_ - this.flecha_abj, size_flecha_px*1.8);
                this.pinta_filas_columnas_(ctx, ancho_total_/2 + 75, alto_total_ - 50, zeta, size_flecha_px*1.5);
                this.pinta_filas_columnas_(ctx, ancho_total_/2 + 125, alto_total_ - 50, equis, size_flecha_px*1.5);

            }

        }

        ctx.lineWidth=10;
        if(!select_player){
            
            ctx.strokeStyle="#ffffff";
            ctx.strokeRect(x_menu - (size_menu_px * 4), y_select, largo_menu + (size_menu_px * 8), 12 * size_menu_px);
            this.pinta_filas_columnas_(ctx, x_menu, y_menu, menu, size_menu_px);
        }
        else{

            if(this.modo_ === 2 || this.select_cpu_){
                
                var que_pinta2 = this.p2;
                if(this.select_cpu_){
                    var que_pinta2 = this.cpu_;
                    var diff_select_cpu = this.tiempo_select_cpu_ - this.timestamp_();
                    if(this.ultimo_select_cpu_ < this.timestamp_()){
                        this.player2_tipo_ = Math.floor(Math.random()*(5 - this.level_)) + this.level_;
                        this.ultimo_select_cpu_ = this.timestamp_() + 150;
                    }
                    if(diff_select_cpu < 0){
                        this.player2_tipo_ = this.level_;
                        if(diff_select_cpu < -2000){
                            //console.log("empieza aqui otra vez?")
                            this.setup_();
                            this.empieza_();
                            this.empezado_ = true;
                        }
                    }


                }
                

                var x_selec_player = this.x_selector_player_1_ - 120;
                var y_selec_player = this.y_selector_player_1_  - 20;
                
                if(this.level_>1){
                    
                    this.ctx.globalAlpha = 0.4;
                    this.ctx.fillStyle = "#000000";

                    this.ctx.fillRect(x_selec_player, y_selec_player, this.ancho_selec_player_, this.alto_selec_player_);
                    
                    if(this.level_>2){
                        this.ctx.fillRect(this.x_selector_player_2_ - 120, y_selec_player, this.ancho_selec_player_, this.alto_selec_player_);
                    }
                    if(this.level_>3){
                        this.ctx.fillRect(x_selec_player, this.y_selector_player_2_  - 20, this.ancho_selec_player_, this.alto_selec_player_);
                    }

                    this.ctx.globalAlpha = 1.0;
                }

                switch(this.player2_tipo_) {
                    case 2: 
                        x_selec_player = this.x_selector_player_2_ - 120;
                        y_selec_player = this.y_selector_player_1_  - 20;
                        break;
                    case 3: 
                        x_selec_player = this.x_selector_player_1_ - 120;
                        y_selec_player = this.y_selector_player_2_  - 20;
                        break;
                    case 4: 
                        x_selec_player = this.x_selector_player_2_ - 120;
                        y_selec_player = this.y_selector_player_2_  - 20;
                        break;
                }

                

                var x_p2 = x_selec_player + 320;
                var y_p2 = y_selec_player - 30;
                this.pinta_filas_columnas_(ctx, x_p2, y_p2, que_pinta2, 4, this.COLOR_.PURPLE);
                ctx.strokeStyle = this.COLOR_.PURPLE;
                ctx.strokeRect(x_selec_player, y_selec_player, this.ancho_selec_player_, this.alto_selec_player_);
                if(this.player2_selected_){
                    this.ctx.globalAlpha = 0.5;
                    this.ctx.fillStyle = this.COLOR_.PURPLE;
                    this.ctx.fillRect(x_selec_player, y_selec_player, this.ancho_selec_player_, this.alto_selec_player_);
                    this.ctx.globalAlpha = 1.0;
                }
            }

            var x_selec_player = this.x_selector_player_1_ - 120;
            var y_selec_player = this.y_selector_player_1_  - 20;

            switch(this.player1_tipo_) {
                case 2: 
                    x_selec_player = this.x_selector_player_2_ - 120;
                    y_selec_player = this.y_selector_player_1_  - 20;
                    break;
                case 3: 
                    x_selec_player = this.x_selector_player_1_ - 120;
                    y_selec_player = this.y_selector_player_2_  - 20;
                    break;
                case 4: 
                    x_selec_player = this.x_selector_player_2_ - 120;
                    y_selec_player = this.y_selector_player_2_  - 20;
                    break;
            }
            
            var x_p1 = x_selec_player + 15;
            var y_p1 = y_selec_player - 30;

            this.pinta_filas_columnas_(ctx, x_p1, y_p1, this.p1, 4, this.COLOR_.YELLOW);
            ctx.strokeStyle = this.COLOR_.YELLOW;
            ctx.strokeRect(x_selec_player, y_selec_player, this.ancho_selec_player_, this.alto_selec_player_);


            if(this.player1_selected_){
                this.ctx.globalAlpha = 0.5;
                this.ctx.fillStyle = this.COLOR_.YELLOW;
                this.ctx.fillRect(x_selec_player, y_selec_player, this.ancho_selec_player_, this.alto_selec_player_);
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
    }

    this.mueve_selec_player_ = function (player1, dir) {

        window.croqueta_audio.play();
        if(player1 || this.modo_ == 1){
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
    }

    this.selecciona_menu_ = function () {
        window.golpe_audio2.play();
        this.modo_seleccionado_ = true;
        this.numero_jugadores_ = this.modo_;

        //this.setup_();
        //this.empieza_(true);
        //this.empezado_ = true;
    }

    this.selec_player_ = function (player1) {
        
        if(!player1 && this.player2_selected_){
            return;
        }
        else if(player1 && this.player1_selected_){
            return;
        }
        
        if(!player1){
            this.player2_selected_ = true;
            player_pinta = this.player2_tipo_;
            color = this.COLOR_.PURPLE;
        }
        else{
            this.player1_selected_ = true;
        }

        //TODO: Hacer algún tipo de delay para no entrar a lo loco a la partida
        if(this.modo_ === 1){

            this.select_cpu_ = true;
            this.player1_selected_ = true;
            this.tiempo_select_cpu_ = this.timestamp_() + 3000;

        }else if (this.player1_selected_ && this.player2_selected_){
            this.setup_();
            this.empieza_();
            this.empezado_ = true;
            
        }
        
        
    }
    


    this.setup_ = function() {

        this.player_ = new Player(this, ancho_total_ + 20, 20, 800, 60000, 1, false, this.player1_tipo_);
        var cpu = true;
        var tipo2 = false;
        if(this.modo_ == 2){
            cpu = false;
            tipo2 = this.player2_tipo_;
        }
        this.player2_ = new Player(this, ancho_total_ - 120, 20, 800, 60000, 2, cpu, tipo2);

        cuerda = new Cuerda(this);

    };





    /***** LANZAAAAA ****/

    this.modo_ = 1; // modo=1 -> 1player + modo=2 -> 2 players
    this.level_ = 1; 

    
    this.p1 =  [
        [ 1, 1, 1, 1,  ,  ,  , 1, 1],
        [ 1, 1,  , 1,  ,  , 1, 1, 1],
        [ 1, 1, 1, 1,  ,  ,  , 1, 1],
        [ 1, 1,  ,  ,  ,  ,  , 1, 1],
        [ 1, 1,  ,  ,  ,  ,  , 1, 1]
    ];

    this.p2 =  [
        [ 1, 1, 1, 1,  ,  , 1, 1, 1],
        [ 1, 1,  , 1,  ,  ,  ,  , 1],
        [ 1, 1, 1, 1,  ,  , 1, 1, 1],
        [ 1, 1,  ,  ,  ,  , 1,  ,  ],
        [ 1, 1,  ,  ,  ,  , 1, 1, 1]
    ];
    this.cpu_ =  [
        [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1,  , 1, 1],
        [ 1, 1,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1],
        [ 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1,  , 1, 1],
        [ 1, 1,  ,  ,  , 1, 1,  ,  ,  , 1,  , 1, 1],
        [ 1, 1, 1, 1,  , 1, 1,  ,  ,  , 1, 1, 1, 1]
    ];

    this.triangulin_ =  [
        [ 1, 1, 1, 1, 1],
        [  , 1, 1, 1,  ],
        [  ,  , 1,  ,  ]
    ];

    this.flecha_der =  [
            [  , 1,  ,  ],
            [  , 1, 1,  ],
            [ 1, 1, 1, 1],
            [  , 1, 1,  ],
            [  , 1,  ,  ]
    ];
    this.flecha_izq =  [
            [  ,  , 1,  ],
            [  , 1, 1,  ],
            [ 1, 1, 1, 1],
            [  , 1, 1,  ],
            [  ,  , 1,  ]
    ];
    this.flecha_arr =  [
            [  ,  , 1,  ,  ],
            [  , 1, 1, 1,  ],
            [ 1, 1, 1, 1, 1],
            [  ,  , 1,  ,  ]
    ];
    this.flecha_abj =  [
            [  ,  , 1,  ,  ],
            [ 1, 1, 1, 1, 1],
            [  , 1, 1, 1,  ],
            [  ,  , 1,  ,  ]
    ];


    this.you_win_ =  [
                    [ 1, 1,  , 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1,  , 1,  , 1,  ],
                    [  , 1, 1, 1,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  ,  ,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1,  ,  , 1,  ,  , 1,  , 1,  , 1,  ],
                    [  , 1, 1, 1,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1,  , 1, 1, 1,  , 1,  ,  , 1,  , 1,  , 1,  ],
                    [  , 1, 1, 1,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  ,  ,  ,  , 1,  , 1,  , 1,  , 1, 1,  , 1, 1,  , 1, 1,  ,  ,  ,  ,  ,  ,  ,  ],
                    [  , 1, 1, 1,  ,  , 1, 1, 1, 1,  , 1, 1, 1, 1,  ,  ,  ,  ,  , 1,  , 1,  ,  , 1, 1,  , 1, 1,  ,  , 1,  ,  , 1,  , 1,  , 1,  ]
                ];


    this.you_lost_ =  [
            [ 1, 1, 1, 1,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1, 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1],
            [ 1, 1,  ,  ,  , 1, 1,  , 1,  , 1, 1, 1, 1,  , 1, 1,  ,  ,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  ,  ,  , 1, 1,  , 1],
            [ 1, 1,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1, 1,  ,  ,  ,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1, 1, 1,  , 1, 1, 1, 1],
            [ 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1,  ,  ,  ,  ,  , 1, 1,  , 1,  ,  , 1,  , 1,  , 1, 1,  ,  ,  , 1, 1, 1,  ],
            [ 1, 1, 1, 1,  , 1, 1,  , 1,  , 1, 1,  , 1,  , 1, 1, 1, 1,  ,  ,  , 1, 1, 1, 1,  ,  ,  , 1,  ,  , 1, 1, 1, 1,  , 1, 1,  , 1]
        ];

    this.p1_win_ =  [
            [ 1, 1, 1, 1,  ,  ,  ,  ,  , 1, 1,  ,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1,  , 1, 1,  ,  , 1,  , 1, 1, 1, 1,  ,  , 1,  , 1,  ],
            [ 1, 1,  , 1,  ,  ,  ,  , 1, 1, 1,  ,  ,  ,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1,  ,  , 1,  , 1, 1,  ,  ,  ,  , 1,  , 1,  ],
            [ 1, 1,  , 1,  ,  ,  ,  ,  , 1, 1,  ,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1,  , 1, 1, 1,  , 1,  , 1, 1, 1, 1,  ,  , 1,  , 1,  ],
            [ 1, 1, 1, 1,  ,  ,  ,  ,  , 1, 1,  ,  ,  ,  ,  , 1,  , 1,  , 1,  , 1, 1,  , 1, 1,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  ,  ,  ,  ],
            [ 1, 1,  ,  ,  , 1,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  , 1,  , 1,  ,  , 1, 1,  , 1, 1,  ,  , 1,  , 1, 1, 1, 1,  ,  , 1,  , 1,  ]
        ];


    this.p2_win_  =  [
            [ 1, 1, 1, 1,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1,  , 1, 1,  ,  , 1,  , 1, 1, 1, 1,  ,  , 1,  , 1,  ],
            [ 1, 1,  , 1,  ,  ,  ,  ,  ,  , 1, 1,  ,  ,  , 1, 1,  , 1,  , 1,  ,  ,  ,  , 1, 1,  ,  , 1,  , 1, 1,  ,  ,  ,  , 1,  , 1,  ],
            [ 1, 1,  , 1,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  , 1, 1,  , 1,  , 1,  , 1, 1,  , 1, 1, 1,  , 1,  , 1, 1, 1, 1,  ,  , 1,  , 1,  ],
            [ 1, 1, 1, 1,  ,  ,  ,  , 1, 1,  ,  ,  ,  ,  ,  , 1,  , 1,  , 1,  , 1, 1,  , 1, 1,  , 1, 1,  ,  ,  , 1, 1,  ,  ,  ,  ,  ,  ],
            [ 1, 1,  ,  ,  , 1,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  , 1,  , 1,  ,  , 1, 1,  , 1, 1,  ,  , 1,  , 1, 1, 1, 1,  ,  , 1,  , 1,  ]
        ];


    this.ancho_selec_player_ = 370;
    this.alto_selec_player_ = 140;

    this.modo_seleccionado_ = false;

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
    if(window.innerWidth < 820){
        ancho_total_ = window.innerWidth * 2,
        alto_total_  = window.innerHeight * 1.5;

    }
    else{
        ancho_total_ = window.innerWidth,
        alto_total_  = window.innerHeight;
    }

    
  
    
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
      
    this.intensidad_shacke_ = 20;

    this.fps_            = 60,
    this.step_           = 1/this.fps_,
    this.fpsInterval     = 1000 / this.fps_;


    this.canvas_         = document.getElementById('canvas'),
    this.ctx            = this.canvas_.getContext('2d'),
    this.canvas_.width  = ancho_total_,
    this.canvas_.height = alto_total_,
    
    
    this.hay_muerte_      = false, //Aqui voy a controlar cuando se mate a alguien
    

    this.tiempo_shacke_ = this.timestamp_(),
    this.tiempo_cuenta_atras_ = this.timestamp_(),
    this.tiempo_select_cpu_ = this.timestamp_(),
    this.ultimo_select_cpu_ = this.timestamp_(),
    this.tiempo_siguiente_oponente_ = this.timestamp_(),
    this.select_cpu_ = false,
    
    this.cuerda_ = [];  //puntos que ocupa la cuerda

    this.marcador_size_ = 4,


    this.ostiazos_ = [];
    this.random_array_ = [];

    for (i = 0; i < 1000; i++) {
        var a = Math.floor(Math.random() * 2);
        this.random_array_.push(a);
    }

    //Se muestra logo nada más empezar
    this.muestra_logo_(this.ctx);

};

