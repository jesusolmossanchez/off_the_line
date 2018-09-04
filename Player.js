

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

    this.vida_inicial_      = 100;
    this.vida_             = this.vida_inicial_;


    if(tipo){
        this.tipo = tipo;
    }
    else{
        this.tipo = 1;
    }


    this.maxdx_             = 250;
    this.maxdy_             = 800;
    this.pow_               = 8;

    switch (this.tipo){
        case 2:
            this.maxdx_             = 150 * 1.3;
            this.maxdy_             = 600 * 1.3;
            this.pow_               = 3;
            break;
        case 3:
            this.maxdx_             = 150 * 2;
            this.maxdy_             = 600 * 0.8;
            this.pow_               = 4;
            break;
        case 4:
            this.maxdx_             = 150 * 0.7;
            this.maxdy_             = 600 * 0.7;
            this.pow_               = 15;
            break;
    }

    this.impulse_           = impulso;
    this.accel_             = this.maxdx_ / (juego.ACCEL_);
    this.friction_          = this.maxdx_ / (juego.FRICTION_);
    this.tiempo_enfadado_   = juego.timestamp_();
    this.tiempo_ostiazo_   = juego.timestamp_();
    this.tiempo_bloqueo_   = juego.timestamp_();
    
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

            
            //Colisiones...

            this.check_cuerda_colisions_();
            this.check_players_colisions_();

        
            //Si se pulsa acción
            if(this.accion){
                if ((juego.timestamp_() > this.tiempo_enfadado_ + 300)
                    && juego.timestamp_() > this.tiempo_ostiazo_ + 100){

                        var mas_enfado = 0;
                        if(this.jumping){
                            mas_enfado = 300;
                        }
                    this.tiempo_enfadado_ = juego.timestamp_()+200+mas_enfado;
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
                if(this.jumping){
                    this.tiempo_enfadado_ = juego.timestamp_();

                }
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
            //&& (this.tiempo_enfadado_ - juego.timestamp_()) < 150
            && (player_contrario.tiempo_ostiazo_ <= juego.timestamp_())
            ){
            
                var amplitud_ostiazo = 60; 

                var cuanto_quita = 0;
                
                var bloqueo = false;
                var ostia_rotacion = -35 * Math.PI / 180;
                var tiempo_estimado_enfadado = 150;
                var sumatorio = 1.5;
                if(this.jumping){
                    tiempo_estimado_enfadado = 600;
                    sumatorio = 0.7;
                }
                var percent_bloqueo = (tiempo_estimado_enfadado - (this.tiempo_enfadado_ - juego.timestamp_()))/200;
                var bloqueo_size = this.block_size_ * (percent_bloqueo/2 + sumatorio);
            
                if((this.x <= player_contrario.x + this.ancho_ + amplitud_ostiazo)
                    &&(this.x > player_contrario.x)
                    && (this.y > player_contrario.y - this.alto_)
                    && (this.y < player_contrario.y + this.alto_*2)
                    && (this.izquierda_)
                ){
                    if(player_contrario.jumping){
                        //TODO: controlar ostiazo en el aire
                    }
                    else if(this.up || this.jumping){ 
                        if(player_contrario.up){  
                            console.log("golpe parado - ARRIBA");
                            bloqueo = true;

                        }
                        else{
                            cuanto_quita = 1;
                            console.log("le atizo por la derecha - ARRIBA");
                        }
                    }
                    else if(this.down){  
                        if(player_contrario.down){  
                            console.log("golpe parado - ABAJO");
                            bloqueo = true;
                        }
                        else{
                            cuanto_quita = 1;
                            console.log("le atizo por la derecha - ABAJO");
                        }
                    }
                    else{
                        if(!player_contrario.up & !player_contrario.down){  
                            console.log("golpe parado - MEDIO");
                            bloqueo = true;
                        }
                        else{
                            cuanto_quita = 2;
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
                    
                    if(player_contrario.jumping){
                        //TODO: controlar ostiazo en el aire
                        
                    }
                    else if(this.up || this.jumping){ 
                        if(player_contrario.up){  
                            console.log("golpe parado - ARRIBA");
                            bloqueo = true;
                        }
                        else{
                            cuanto_quita = 1;
                            console.log("le atizo por la izquierda - ARRIBA");
                        }
                    }
                    else if(this.down){  
                        if(player_contrario.down){  
                            console.log("golpe parado - ABAJO");
                            bloqueo = true;
                        }
                        else{
                            cuanto_quita = 1;
                            console.log("le atizo por la izquierda - ABAJO");
                        }
                    }
                    else{
                        if(!player_contrario.up & !player_contrario.down){  
                            console.log("golpe parado - MEDIO");
                            bloqueo = true;
                            
                        }
                        else{
                            cuanto_quita = 2;
                            console.log("le atizo por la izquierda - MEDIO");
                        }
                    }
                }

                if(bloqueo){
                    var ostia_nueva = new Ostiazo(this.block_size_ * -10, 0 - this.alto_/2 + (this.block_size_ * -1), 1, bloqueo_size, "rgba(255,255,255, "+percent_bloqueo+")", player_contrario.x + player_contrario.ancho_/2, this.y + this.alto_/2, !this.izquierda_, ostia_rotacion);
                    juego.ostiazos_.push(ostia_nueva);

                    
                    player_contrario.tiempo_bloqueo_ = juego.timestamp_()+150;
                }
                
                if(cuanto_quita){
                    player_contrario.tiempo_ostiazo_ = juego.timestamp_()+200;
                    player_contrario.vida_ = player_contrario.vida_ - (this.pow_ * cuanto_quita);
                }
                
        }

    }



    this.pinta_player_ = function( dt, ctx, counter) {


        var x_player = this.x + (this.dx * dt);
        var y_player = this.y + (this.dy * dt);



        //cuerpo
        var cabeza = [];
        cabeza[0] = [
            [ , 1, 1, 1, ],
            [1, 1, 1, 1, ],
            [1,  , 1,  , ],
            [1, 1, 1,  , ],
            [1, 1,  ,  , ],
        ];

        cabeza[1] = [
            [ , 1, 1, 1, ],
            [1,  , 1, 1, ],
            [1,  , 1,  , ],
            [1, 1, 1,  , ],
            [1, 1,  ,  , ],
        ];

        var cuerpo = [];
        cuerpo["up"] = [];
        cuerpo["middle"] = [];
        cuerpo["down"] = [];
        cuerpo["golpe"] = [];
        cuerpo["saltando"] = [];
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
        
        cuerpo["golpe"][0] = [
            [ ,  ,  , 1, 1, 1, 1, 1,  ,  , 1, 1,  ],
            [ ,  ,  , 1, 1, 1, 1, 1, 1, 1,  ,  ,  ],
            [ ,  , 1,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  , 1,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  , 1,  ,  , 1, 1, 1, 1,  ,  ,  ,  ],
            [ ,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ],
            [ ,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ],
        ];
        
        cuerpo["golpe"][1] = [
            [ ,  ,  ,  ,  ,  ,  ,  ,  , 1,  ,  ,  ],
            [ ,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  ,  , 1,  , 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  ,  , 1,  , 1, 1, 1, 1,  ,  ,  ,  ],
            [ ,  ,  , 1,  , 1, 1, 1, 1,  ,  ,  ,  ],
        ];
        
        cuerpo["saltando"][0] =  [
            [ , 1,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  , 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  , 1,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  , 1,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  , 1,  ,  ,  ],
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

        //PIES DE OSTIAZO
        pies[5] = [
            [,  ,  ,  ,  ,  , 1,  , 1,  ,  ,  ,  ],
            [,  ,  ,  ,  ,  , 1,  ,  , 1,  ,  ,  ],
            [,  ,  ,  ,  ,  , 1, 1,  , 1,  ,  ,  ],
            [,  ,  ,  ,  ,  ,  , 1,  ,  , 1,  ,  ],
            [,  ,  ,  ,  ,  ,  , 1,  ,  , 1,  ,  ],
        ];
        pies[6] = [
            [,  ,  ,  ,  , 1,  ,  , 1,  ,  ,  ,  ],
            [,  ,  ,  ,  , 1,  ,  ,  , 1,  ,  ,  ],
            [,  ,  ,  ,  ,  , 1, 1,  ,  , 1, 1,  ],
            [,  ,  ,  ,  ,  ,  , 1, 1,  ,  ,  ,  ],
            [,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
        ];

        //Saltando
        pies[7] = [
            [ ,  ,  ,  , 1,  ,  , 1,  ,  ,  ,  ,  ],
            [ ,  ,  , 1,  ,  , 1,  ,  ,  ,  ,  ,  ],
            [ ,  ,  , 1,  ,  , 1,  ,  ,  ,  ,  ,  ],
            [ ,  ,  ,  ,  ,  , 1,  ,  ,  ,  ,  ,  ]
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
        
        var que_cabeza = 0;
        var que_pie = 0;
        var que_palo = 0;
        var que_cuerpo = 0;
        var pos_cuerpo = "middle";
        var mas_menos_cabeza_x = 0;
        var cabeza_golpe = 0;
        var tween = this.tween_frames_(counter, 60);
        var negativo_tween = tween - 1;

        if (Math.abs(this.dx) > 0) {
            if(tween <= 0.25){
                que_pie = 0;
                que_palo = 0;
                que_cuerpo = 0;
                mas_menos_cabeza_x = 0;
            }
            else if(tween > 0.25 && tween <= 0.5){
                que_pie = 1;
                que_palo = 0;
                que_cuerpo = 0;
                mas_menos_cabeza_x = 0;
            }
            else if(tween > 0.5 && tween <= 0.75){
                que_pie = 2;
                que_palo = 1;
                que_cuerpo = 1;
                mas_menos_cabeza_x = 1;
            }
            else{
                que_pie = 3;
                que_palo = 1;
                que_cuerpo = 1;
                mas_menos_cabeza_x = 1;
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

        if(this.jumping){
            que_pie = 7;
            que_cuerpo = 0;
            pos_cuerpo = "saltando";
            mas_abajo = 3 * this.block_size_;

            if(this.tiempo_enfadado_ > juego.timestamp_()){
                
                

                    var ostia_rotacion = 35 * Math.PI / 180;

                    corrige_x_palo = 9;
                    corrige_y_palo = 2;
                    mas_abajo = 2 * this.block_size_;
                    rotacion = 40 * Math.PI / 180;
                    
                    var ostia_nueva = new Ostiazo(x_player + (this.block_size_ * 2), y_player - this.alto_/2 + (this.block_size_ * 3), 0, this.block_size_*1.3, "rgba(241,143,1, 0.6)", x_translate, y_translate, this.izquierda_, ostia_rotacion);
                    juego.ostiazos_.push(ostia_nueva);

                
            }
            else{
                var rueda = 15 * counter * Math.PI / 180;
                if(this.izquierda_){
                    rueda = 15 * Math.PI / 180 * counter;
                }
                ctx.rotate(rueda);
            }
        }
        else if(this.tiempo_ostiazo_ > juego.timestamp_()){
            
                if((this.tiempo_ostiazo_ - juego.timestamp_()) > 80){
                    
                    
                    //corrige_x_palo = -10;
                    //corrige_y_palo = -5;
                    

                    que_cabeza = 1;
                    mas_menos_cabeza_x = 5;
                    cabeza_golpe = 1 * this.block_size_;

                    que_cuerpo = 0;
                    pos_cuerpo = "golpe"
                    que_pie = 5;
                    mas_abajo = 2 * this.block_size_;
                    rotacion = -25 * Math.PI / 180;



                }
                else{

                    //corrige_x_palo = -10;
                    //corrige_y_palo = -5;

                    que_cabeza = 1;
                    mas_menos_cabeza_x = 5;
                    cabeza_golpe = 1 * this.block_size_;

                    que_cuerpo = 1;
                    pos_cuerpo = "golpe"
                    que_pie = 6;
                    mas_abajo = 2 * this.block_size_;
                    rotacion = -30 * Math.PI / 180;


                }
        }
        else if(this.tiempo_enfadado_ > juego.timestamp_()){

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


        

        

        
        juego.pinta_filas_columnas_(ctx, x_player - this.ancho_/2, y_player - this.alto_/2 + (this.block_size_ * 5) + mas_abajo + idle_movimiento2, cuerpo[pos_cuerpo][que_cuerpo], this.block_size_, "#0000ff");
        
        
        if(this.tiempo_ostiazo_ > juego.timestamp_()){
            ctx.rotate(20 * Math.PI / 180);
        }
        juego.pinta_filas_columnas_(ctx, x_player + (this.block_size_ * 0) - (mas_menos_cabeza_x * this.block_size_/2), y_player - this.alto_/2 + mas_abajo + idle_movimiento + cabeza_golpe, cabeza[que_cabeza], this.block_size_, "#00ff00");
        if(this.tiempo_ostiazo_ > juego.timestamp_()){
            ctx.rotate(-20 * Math.PI / 180);
        }
        juego.pinta_filas_columnas_(ctx, x_player - this.ancho_/2, y_player - this.alto_/2 + (this.block_size_ * 12), pies[que_pie], this.block_size_, "#ffff00");
        
        
        if(this.jumping){

        }
        else if(this.down){
            ctx.rotate(10 * Math.PI / 180);
        }
        else if(this.up){
            ctx.rotate(45 * Math.PI / 180);
            corrige_x_palo = 20;
            corrige_y_palo = 7;
        }

        if(rotacion){
            ctx.rotate(rotacion);
        }
        
        
        juego.pinta_filas_columnas_(ctx, x_player - (this.block_size_ * corrige_x_palo), y_player - (this.block_size_ * corrige_y_palo) + mas_abajo + idle_movimiento2, palo[que_palo], this.block_size_, "#ff0000");
        
        
        //para debug del centro de la escena
        //juego.pinta_filas_columnas_(ctx, 0, 0, paloprueba, this.block_size_, "#ffffff");


        //console.log(this.tween_frames_(10,20));
        ctx.restore();
    };

    this.pinta_vida_ = function (ctx){

        var ancho_cargador = 200;
        var alto_cargador = 50;
        var percent = this.vida_/this.vida_inicial_;

        if(percent <= 0){
            //TODO: lanza gameover ganador el otro
            percent = 0;
        }

        var opacidad = 1;
        
        ctx.fillStyle="rgba(11, 204, 0, "+opacidad+")";
        if(percent < 0.8){
            ctx.fillStyle="rgba(224, 239, 20, "+opacidad+")";
        }
        if(percent < 0.6){
            ctx.fillStyle="rgba(204, 199, 0, "+opacidad+")";
        }
        if(percent < 0.4){
            ctx.fillStyle="rgba(239, 92, 20, "+opacidad+")";
        }
        if(percent < 0.2){
            ctx.fillStyle="rgba(255, 0, 0, "+opacidad+")";
        }

        var y_vida = 50;
        var x_vida = 50;
        if(this.player_num_ != 1){
            x_vida = ancho_total_ - 50 - ancho_cargador;
        }

        ctx.fillRect(x_vida, y_vida, percent * ancho_cargador, alto_cargador);

        ctx.strokeStyle = "rgba(255,255,255,"+opacidad+")";
        ctx.lineWidth = 5;
        ctx.strokeRect(x_vida, y_vida, ancho_cargador, alto_cargador);


    }

    //TODO: igual lo suyo es usar esto para otras cosas y meterlo en el Game.js
    this.tween_frames_ = function(frame, duration) {
        var half  = duration/2,
            pulse = frame%duration;
        return pulse < half ? (pulse/half) : 1-(pulse-half)/half;
    };

};
