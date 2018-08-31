

/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(juego, x, y, gravedad, impulso, player_num, cpu, tipo) {

    this.x                 = x;
    this.y                 = y;
    this.block_size_       = 3;
    this.alto_             = this.block_size_ * 17;
    this.ancho_            = this.block_size_ * 13;
    this.dx                = 0;
    this.dy                = 0;
    
    this.player_num_       = player_num;

    this.wasleft           = false;
    this.wasright          = false;
    this.gravity_          = gravedad*2;

    this.rotacion_         = 0;


    if(tipo){
        this.tipo = tipo;
    }
    else{
        this.tipo = 1;
    }


    this.maxdx_             = 250;
    this.maxdy_             = 800;

    switch (this.tipo){
        case 2:
            this.maxdx_             = 150 * 1.3;
            this.maxdy_             = 600 * 1.3;
            break;
        case 3:
            this.maxdx_             = 150 * 2;
            this.maxdy_             = 600 * 0.8;
            break;
        case 4:
            this.maxdx_             = 150 * 0.7;
            this.maxdy_             = 600 * 0.7;
            break;
    }

    this.impulse_           = impulso;
    this.accel_             = this.maxdx_ / (juego.ACCEL_);
    this.friction_          = this.maxdx_ / (juego.FRICTION_);
    this.tiempo_enfadado_   = juego.timestamp_();
    this.tiempo_ostiazo_   = juego.timestamp_();
    
    this.CPU_ = cpu;    
    this.izquierda_ = false;
    if(cpu){
        this.izquierda_ = true;
    }


    this.update = function(dt) {
        //Control de si iba hacia la izquierda o a la derecha y friccion y aceleración... Ahora no lo uso, pero puede ser util
        this.wasleft    = this.dx  < 0;
        this.wasright   = this.dx  > 0;
      
        //reseteo las aceleraciones
        this.ddx = 0;
        this.ddy = this.gravity_;

        //movimientos
        if(!juego.hay_muerte_){
            if (this.left){
                this.ddx = this.ddx - this.accel_;
                this.izquierda_ = true;
            }
            else if (this.wasleft){
                this.ddx = this.ddx + this.friction_;
            }
          
            if (this.right){
                this.ddx = this.ddx + this.accel_;
                this.izquierda_ = false;
            }
            else if (this.wasright){
                this.ddx = this.ddx - this.friction_;
            }

            //Salto
            if (this.jump && !this.jumping){
                this.ddy = this.ddy - this.impulse_; // an instant big force impulse
                this.jumping = true;
               
            }

        
            //Si se pulsa acción
            if(this.accion){
                if (juego.timestamp_() > this.tiempo_enfadado_ + 300){
                    this.tiempo_enfadado_ = juego.timestamp_()+200;
                }
            }
        }

        //Posiciones
        this.x  = this.x  + (dt * this.dx);
        this.y  = this.y  + (dt * this.dy);

        //velocidades
        this.dx = juego.bound_(this.dx + (dt * this.ddx), -this.maxdx_, this.maxdx_);
        this.dy = juego.bound_(this.dy + (dt * this.ddy), -this.maxdy_, this.maxdy_);

        //Cambiando la velocidad con el level, andando
        var multiplica = -1;
        if(this.CPU_){
            if(this.dx > 0){
                multiplica = 1;
            }
            this.dx = this.dx - (10 - juego.level_) * 7 * multiplica;
        }

        
        
        if ((this.wasleft  && (this.dx > 0)) ||
            (this.wasright && (this.dx < 0))) {
          this.dx = 0; // clamp at zero to prevent friction from making us jiggle side to side
        }



        //NUEVA COMPROBACION...

        this.check_cuerda_colisions_();
        this.check_players_colisions_();

        
        
        
        
    };

    this.check_cuerda_colisions_ = function() {
        
        var x_relativo = Math.ceil(this.x/4) + 2;
        var alto_cuerda = juego.cuerda_[x_relativo];
        var altura_jugador = Math.ceil(this.y + this.alto_);

        
        if(altura_jugador > alto_cuerda){
            this.y = alto_cuerda - this.alto_;
            if (this.dy >= 0) {
                //this.y = alto_total_/1.5 - this.alto_;
                this.dy = - this.dy/3;
                this.jumping = false;
            }
        }
    }


    this.check_players_colisions_ = function() {

        /** LIMITES DE LA PANTALLA */
        //Comprobación que no pasa de limite a la derecha
        if(this.dx > 0 && (this.x + this.ancho_ >= ancho_total_)
            || this.x >= ancho_total_){ //Comprobación de si está fuera de la pantalla
            this.x = ancho_total_ - this.ancho_;
            this.dx = 0;
        }
        //Comprobación que no pasa de limite a la izquierda
        if(this.dx < 0 && (this.x <= 0)){
            this.x = 0;
            this.dx = 0;
        }




        
        /** COLISION CON EL OTRO JUGADOR SIN OSTIAZO */
        //TODO: esto habría que rehacerlo, mucho codigo...

        var player_contrario = juego.player_;

        if(this.player_num_ === 1){
            player_contrario = juego.player2_;
        }
        
        
        if(this.dx > 0 
            && (this.x + this.ancho_ >= player_contrario.x)
            && (this.x < player_contrario.x)
            && (this.y > player_contrario.y - this.alto_)
            && (this.y < player_contrario.y + this.alto_*2)
        ){
            this.x = this.x;
            this.dx = 0;
        }
        if(this.dx < 0
            &&(this.x <= player_contrario.x + this.ancho_)
            &&(this.x > player_contrario.x)
            && (this.y > player_contrario.y - this.alto_)
            && (this.y < player_contrario.y + this.alto_*2)
        ){
            this.x = player_contrario.x + this.ancho_;
            this.dx = 0;
        }


        
        /** COLISION CON EL OTRO JUGADOR CON OSTIAZO */

        //TODO: hacer un "tiempo_ostiazo" y controlar que no se pueda volver a pegar en ese tiempo (¿mismo tiempo que enfado?)

        if((this.tiempo_enfadado_ - juego.timestamp_()) > 0
            && (this.tiempo_enfadado_ - juego.timestamp_()) < 150
            && (player_contrario.tiempo_ostiazo_ <= juego.timestamp_())
            ){
            
                var amplitud_ostiazo = 60; 
            
                if((this.x <= player_contrario.x + this.ancho_ + amplitud_ostiazo)
                    &&(this.x > player_contrario.x)
                    && (this.y > player_contrario.y - this.alto_)
                    && (this.y < player_contrario.y + this.alto_*2)
                    && (this.izquierda_)
                ){
                    player_contrario.tiempo_ostiazo_ = juego.timestamp_()+200;
                    if(this.up){ 
                        if(player_contrario.up){  
                            console.log("golpe parado - ARRIBA");
                        }
                        else{
                            console.log("le atizo por la derecha - ARRIBA");
                        }
                    }
                    else if(this.down){  
                        if(player_contrario.up){  
                            console.log("golpe parado - ABAJO");
                        }
                        else{
                            console.log("le atizo por la derecha - ABAJO");
                        }
                    }
                    else{
                        if(!player_contrario.up & !player_contrario.down){  
                            console.log("golpe parado - MEDIO");
                        }
                        else{
                            console.log("le atizo por la derecha - MEDIO");
                        }
                    }
                }
                if((this.x + this.ancho_ >= player_contrario.x - amplitud_ostiazo)
                    && (this.x < player_contrario.x)
                    && (this.y > player_contrario.y - this.alto_)
                    && (this.y < player_contrario.y + this.alto_*2)
                    && (!this.izquierda_)
                ){
                    
                    player_contrario.tiempo_ostiazo_ = juego.timestamp_()+200;
                    if(this.up){ 
                        if(player_contrario.up){  
                            console.log("golpe parado - ARRIBA");
                        }
                        else{
                            console.log("le atizo por la izquierda - ARRIBA");
                        }
                    }
                    else if(this.down){  
                        if(player_contrario.up){  
                            console.log("golpe parado - ABAJO");
                        }
                        else{
                            console.log("le atizo por la izquierda - ABAJO");
                        }
                    }
                    else{
                        if(!player_contrario.up & !player_contrario.down){  
                            console.log("golpe parado - MEDIO");
                        }
                        else{
                            console.log("le atizo por la izquierda - MEDIO");
                        }
                    }
                }
                
        }

    }



    this.pinta_player_ = function( dt, ctx, counter) {

        var x_player = this.x + (this.dx * dt);
        var y_player = this.y + (this.dy * dt);



        //cuerpo

        var cabeza = [
            [ , 1, 1, 1, ],
            [1, 1, 1, 1, ],
            [1,  , 1,  , ],
            [1, 1, 1,  , ],
            [1, 1,  ,  , ],
        ];

        var cuerpo = [];
        cuerpo["up"] = [];
        cuerpo["middle"] = [];
        cuerpo["down"] = [];
        cuerpo["up"][0] = [
            [ ,  ,  , 1, 1, 1, 1, 1,  , 1,  ,  ,  ],
            [ ,  ,  , 1, 1, 1, 1, 1, 1,  ,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1, 1,  , 1,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  , 1,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        ];
        cuerpo["up"][1] = [
            [ ,  ,  , 1, 1, 1, 1, 1, 1,  ,  , 1,  ],
            [ ,  ,  , 1, 1, 1, 1, 1,  , 1, 1,  ,  ],
            [ ,  ,  , 1, 1, 1, 1, 1, 1,  ,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        ];
        cuerpo["up"][2] = [
            [ ,  ,  , 1, 1, 1, 1, 1, 1, 1,  ,  ,  ],
            [ ,  ,  , 1, 1, 1, 1, 1,  ,  , 1, 1,  ],
            [ ,  ,  , 1, 1, 1, 1, 1, 1, 1,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        ];
        cuerpo["up"][3] = [
            [ ,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  ,  , 1, 1, 1, 1, 1, 1,  ,  ,  ,  ],
            [ ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  , 1, 1,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        ];


        cuerpo["middle"][0] = [
            [ ,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  , 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ],
            [1, 1,  ,  , 1, 1, 1, 1,  , 1, 1,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  , 1, 1],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        ];
        cuerpo["middle"][1] = [
            [ ,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  , 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ],
            [ ,  , 1,  , 1, 1, 1, 1,  ,  , 1, 1,  ],
            [ , 1,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ , 1,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        ];
        cuerpo["middle"][2] = [
            [ ,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  , 1, 1,  , 1, 1, 1, 1, 1, 1,  ,  ],
            [ ,  , 1,  ,  , 1, 1, 1, 1,  ,  , 1, 1],
            [ ,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ],
            [ ,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ],
            [ ,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ],
            [ ,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ],
        ];
        
        cuerpo["middle"][3] = [
            [ ,  ,  ,  ,  , 1, 1, 1, 1,  ,  , 1, 1],
            [ ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1,  ,  ],
            [ ,  ,  , 1,  , 1, 1, 1, 1,  ,  ,  ,  ],
            [ ,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ],
            [ ,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ],
            [ ,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ],
            [ ,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ],
        ];


        cuerpo["down"][0] = [
            [1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  ,  , 1, 1, 1, 1, 1, 1,  ,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  , 1,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  , 1,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  , 1,  ,  ],
        ];
        cuerpo["down"][1] = [
            [ ,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  , 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ],
            [1, 1,  ,  , 1, 1, 1, 1,  , 1, 1,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  , 1, 1],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        ];
        cuerpo["down"][2] = [
            [ ,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  , 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ],
            [ ,  , 1,  , 1, 1, 1, 1,  , 1,  ,  ,  ],
            [ ,  , 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        ];
        cuerpo["down"][3] = [
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  ,  , 1, 1, 1, 1, 1, 1, 1,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  , 1, 1,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        ];

        var pies = [];

        pies[0] = [
            [ ,  ,  ,  , 1,  ,  , 1,  ,  ,  ,  ,  ],
            [ ,  ,  ,  , 1,  ,  , 1,  ,  ,  ,  ,  ],
            [ ,  ,  ,  , 1,  ,  ,  , 1,  ,  ,  ,  ],
            [ ,  ,  , 1,  ,  ,  ,  , 1,  ,  ,  ,  ],
            [ ,  ,  , 1,  ,  ,  ,  , 1,  ,  ,  ,  ],
        ];
        pies[1] = [
            [ ,  ,  ,  , 1,  ,  , 1,  ,  ,  ,  ,  ],
            [ ,  ,  ,  , 1,  ,  ,  , 1,  ,  ,  ,  ],
            [ ,  ,  ,  , 1,  ,  ,  , 1,  ,  ,  ,  ],
            [ ,  ,  , 1,  ,  , 1, 1,  ,  ,  ,  ,  ],
            [ ,  ,  , 1,  ,  ,  ,  ,  ,  ,  ,  ,  ],
        ];
        pies[2] = [
            [ ,  ,  ,  , 1,  ,  , 1,  ,  ,  ,  ,  ],
            [ ,  ,  ,  , 1,  ,  ,  , 1,  ,  ,  ,  ],
            [ ,  , 1, 1,  ,  ,  ,  , 1,  ,  ,  ,  ],
            [ ,  ,  ,  ,  ,  ,  ,  ,  , 1,  ,  ,  ],
            [ ,  ,  ,  ,  ,  ,  ,  ,  , 1,  ,  ,  ],
        ];
        pies[3] = [
            [ ,  ,  ,  , 1,  ,  , 1,  ,  ,  ,  ,  ],
            [ ,  ,  ,  , 1,  ,  , 1,  ,  ,  ,  ,  ],
            [ ,  ,  ,  , 1,  ,  , 1,  ,  ,  ,  ,  ],
            [ ,  ,  ,  , 1,  ,  , 1,  ,  ,  ,  ,  ],
            [ ,  ,  , 1,  ,  , 1,  ,  ,  ,  ,  ,  ],
        ];

        pies[4] = [
            [ ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
            [ ,  ,  ,  ,  , 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  ,  ,  ,  , 1,  , 1, 1,  ,  ,  ,  ],
            [ ,  ,  , 1, 1, 1,  ,  , 1,  ,  ,  ,  ],
            [ ,  ,  , 1,  ,  ,  ,  , 1,  ,  ,  ,  ],
        ];

        

        var palo = [];
        palo[0] = [
            [1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
            [ ,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ],
            [ ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1, 1, 1, 1],
        ];
        palo[1] = [
            [ ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1],
            [ ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ],
            [1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
        ];


        var paloprueba = [
            [1]]

        ctx.beginPath();
        

        var que_pie = 0;
        var que_palo = 0;
        var que_cuerpo = 0;
        var pos_cuerpo = "middle";
        var mas_menos = 0;
        var tween = this.tween_frames_(counter, 60);
        var negativo_tween = tween - 1;

        if (Math.abs(this.dx) > 0) {
            if(tween <= 0.25){
                que_pie = 0;
                que_palo = 0;
                que_cuerpo = 0;
                mas_menos = 0;
            }
            else if(tween > 0.25 && tween <= 0.5){
                que_pie = 1;
                que_palo = 0;
                que_cuerpo = 0;
                mas_menos = 0;
            }
            else if(tween > 0.5 && tween <= 0.75){
                que_pie = 2;
                que_palo = 1;
                que_cuerpo = 1;
                mas_menos = 1;
            }
            else{
                que_pie = 3;
                que_palo = 1;
                que_cuerpo = 1;
                mas_menos = 1;
            }
        }

        var mas_abajo = 0;
        if(this.down){
            pos_cuerpo = "down";
            mas_abajo = 3 * this.block_size_;
        }

        if(this.up){
            pos_cuerpo = "up";
        }


        if(this.jumping){
            que_pie = 3;
        }

        ctx.save();

        var x_translate = x_player + this.ancho_/2;
        var y_translate = y_player + this.alto_/2;
        ctx.translate(x_translate, y_translate);

        x_player = 0;
        y_player = 0;
        if(this.izquierda_){
            //x_player = -this.ancho_;
            ctx.scale(-1, 1);
        }


        var idle_movimiento = negativo_tween * 3;
        var idle_movimiento2 = negativo_tween * 2.5;

        var corrige_x_palo = 12;
        var corrige_y_palo = 1;

        var rotacion = false;

        if(this.tiempo_enfadado_ > juego.timestamp_()){

            if(this.up){
                //PRUEBA PINTANDO ATAQUE UP
                if((this.tiempo_enfadado_ - juego.timestamp_()) > 150){
                    
                    var ostia_rotacion = 35 * Math.PI / 180;
                    
                    corrige_x_palo = 20;
                    corrige_y_palo = 7;
                    que_cuerpo = 2;
                    que_pie = 4;
                    mas_abajo = 2 * this.block_size_;
                    rotacion = 95 * Math.PI / 180;
                    
                    var ostia_nueva = new Ostiazo(x_player + (this.block_size_ * 2),  y_player - this.alto_/2 + (this.block_size_ * -19), 0, this.block_size_, "rgba(255,255,255, 0.4)", x_translate, y_translate, this.izquierda_, ostia_rotacion);
                    
                    juego.ostiazos_.push(ostia_nueva);



                }
                else if((this.tiempo_enfadado_ - juego.timestamp_()) > 50){

                    var ostia_rotacion = 35 * Math.PI / 180;

                    corrige_x_palo = 20;
                    corrige_y_palo = 7;
                    que_cuerpo = 3;
                    que_pie = 4;
                    mas_abajo = 2 * this.block_size_;
                    rotacion = 145 * Math.PI / 180;
                    
                    var ostia_nueva = new Ostiazo(x_player + (this.block_size_ * 3), y_player - this.alto_/2 + (this.block_size_ * -20), 0, this.block_size_*1.3, "rgba(241,143,1, 0.6)", x_translate, y_translate, this.izquierda_, ostia_rotacion);
                    juego.ostiazos_.push(ostia_nueva);

                }
            }
            
            else if(this.down){
                //PRUEBA PINTANDO ATAQUE DOWN
                if((this.tiempo_enfadado_ - juego.timestamp_()) > 150){
                    
                    var ostia_rotacion = -35 * Math.PI / 180;
                    
                    rotacion = -125 * Math.PI / 180;
                    
                    corrige_x_palo = 22;
                    corrige_y_palo = 7;
                    que_cuerpo = 2;
                    que_pie = 4;
                    mas_abajo = 2 * this.block_size_;
                    
                    var ostia_nueva = new Ostiazo(x_player + (this.block_size_ * 1),  y_player - this.alto_/2 + (this.block_size_ * 25), 0, this.block_size_, "rgba(255,255,255, 0.4)", x_translate, y_translate, this.izquierda_, ostia_rotacion);
                    
                    juego.ostiazos_.push(ostia_nueva);



                }
                else if((this.tiempo_enfadado_ - juego.timestamp_()) > 50){

                    var ostia_rotacion = -35 * Math.PI / 180;

                    
                    rotacion = -195 * Math.PI / 180;
                    
                    corrige_x_palo = 23;
                    corrige_y_palo = 7;
                    que_cuerpo = 2;
                    que_pie = 4;
                    mas_abajo = 2 * this.block_size_;
                    
                    var ostia_nueva = new Ostiazo(x_player + (this.block_size_ * 5), y_player - this.alto_/2 + (this.block_size_ * 17), 0, this.block_size_*1.3, "rgba(8,19,127,0.6)", x_translate, y_translate, this.izquierda_, ostia_rotacion);
                    juego.ostiazos_.push(ostia_nueva);

                }
            }
            
            else{

                //PINTANDO ATAQUE MIDDLE
                if((this.tiempo_enfadado_ - juego.timestamp_()) > 150){
                    
                    rotacion = -1 * Math.PI / 180;
                    
                    corrige_x_palo = 8;
                    corrige_y_palo = 1;
                    que_cuerpo = 2;
                    que_pie = 4;
                    mas_abajo = 2 * this.block_size_;

                    var ostia_nueva = new Ostiazo(x_player + (this.block_size_ * 9),  y_player - this.alto_/2 + (this.block_size_ * 3), 0, this.block_size_, "rgba(255,255,255, 0.4)", x_translate, y_translate, this.izquierda_, rotacion);

                    juego.ostiazos_.push(ostia_nueva);
                }
                else if((this.tiempo_enfadado_ - juego.timestamp_()) > 50){

                    rotacion = -15 * Math.PI / 180;

                    corrige_x_palo = -3;
                    corrige_y_palo = 4;
                    que_cuerpo = 3;
                    que_pie = 4;
                    mas_abajo = 2 * this.block_size_;

                    var ostia_nueva = new Ostiazo(x_player + (this.block_size_ * 11), y_player - this.alto_/2 + (this.block_size_ * 0), 0, this.block_size_*1.3, "rgba(216,17,89, 0.4)", x_translate, y_translate, this.izquierda_, rotacion);
                    juego.ostiazos_.push(ostia_nueva);
                }
            }

        }
        else{

        }


        

        juego.pinta_filas_columnas_(ctx, x_player + (this.block_size_ * 0) - (mas_menos * this.block_size_/2), y_player - this.alto_/2 + mas_abajo + idle_movimiento, cabeza, this.block_size_, "#00ff00");
        juego.pinta_filas_columnas_(ctx, x_player - this.ancho_/2, y_player - this.alto_/2 + (this.block_size_ * 5) + mas_abajo + idle_movimiento2, cuerpo[pos_cuerpo][que_cuerpo], this.block_size_, "#0000ff");
        
        
        juego.pinta_filas_columnas_(ctx, x_player - this.ancho_/2, y_player - this.alto_/2 + (this.block_size_ * 12), pies[que_pie], this.block_size_, "#ffff00");
        
        
        if(this.down){
            ctx.rotate(10 * Math.PI / 180);
        }
        
        if(this.up){
            ctx.rotate(45 * Math.PI / 180);
            corrige_x_palo = 20;
            corrige_y_palo = 7;
        }


        if(rotacion){
            
            ctx.rotate(rotacion);
        }
        
        
        juego.pinta_filas_columnas_(ctx, x_player - (this.block_size_ * corrige_x_palo), y_player - (this.block_size_ * corrige_y_palo) + mas_abajo + idle_movimiento2, palo[que_palo], this.block_size_, "#ff0000");
        
        
        //para debug del centro de la escena
        juego.pinta_filas_columnas_(ctx, 0, 0, paloprueba, this.block_size_, "#ffffff");


        //ctx.fillStyle = "green";
        //ctx.fillRect(x_player,y_player,this.ancho_,this.alto)

        //console.log(this.tween_frames_(10,20));
        ctx.restore();
    };

    //TODO: igual lo suyo es usar esto para otras cosas y meterlo en el Game.js
    this.tween_frames_ = function(frame, duration) {
        var half  = duration/2,
            pulse = frame%duration;
        return pulse < half ? (pulse/half) : 1-(pulse-half)/half;
    };

};
