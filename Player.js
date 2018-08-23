

/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(juego, x, y, gravedad, impulso, posicion, cpu, tipo) {

    this.x                 = x;
    this.y                 = y;
    this.block_size_       = 3;
    this.alto_              = this.block_size_ * 17;
    this.ancho_             = this.block_size_ * 13;
    this.dx                = 0;
    this.dy                = 0;
    

    this.wasleft           = false;
    this.wasright          = false;
    this.gravity_           = gravedad*2;

    this.rotacion_          = 0;


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
    this.no_rebota_time_    = juego.timestamp_();
    
    this.CPU_ = cpu;    
    this.izquierda_ = false;
    if(cpu){
        this.izquierda_ = true;
    }


    if(posicion == 1){
        this.limite_derecha_    = juego.ancho_total_;
        this.limite_izquierda_  = 0; 
    }
    else{
        this.limite_derecha_    = juego.ancho_total_;
        this.limite_izquierda_  = 0;   
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
                    this.tiempo_enfadado_ = juego.timestamp_()+400;
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

        var x_relativo = Math.ceil(this.x/4) + 2;
        var alto_cuerda = juego.cuerda_[x_relativo];
        var altura_jugador = Math.ceil(this.y + this.alto_);

        
        if(altura_jugador > alto_cuerda){
            this.y = alto_cuerda - this.alto_;
            if (this.dy >= 0) {
                //this.y = juego.alto_total_/1.5 - this.alto_;
                this.dy = - this.dy/3;
                this.jumping = false;
            }
        }
        
        
        //Si va a la derecha
        if (this.dx > 0) {

            //Choco con la red
            if(this.x + this.ancho_ >= this.limite_derecha_){
                this.x = this.limite_derecha_ - this.ancho_;
                this.dx = 0;
            }
        }
        //Si va a la izquierda
        else if (this.dx < 0) {

            if(this.x <= this.limite_izquierda_){
                this.x = this.limite_izquierda_;
                this.dx = 0;
            }
        }
    };

    this.pinta_player_ = function( dt, ctx, counter) {

        var x_player = this.x + (this.dx * dt);
        var y_player = this.y + (this.dy * dt);
        var ancho_player = this.ancho_;
        var alto_player = this.alto_;



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
        cuerpo["down"] = [];
        cuerpo["up"][0] = [
            [ ,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  , 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ],
            [1, 1,  ,  , 1, 1, 1, 1,  , 1, 1,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  , 1, 1],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        ];
        cuerpo["up"][1] = [
            [ ,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  , 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ],
            [ ,  , 1,  , 1, 1, 1, 1,  ,  , 1, 1,  ],
            [ , 1,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ , 1,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        ];
        cuerpo["down"][0] = [
            [ ,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  , 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ],
            [1, 1,  ,  , 1, 1, 1, 1,  , 1, 1,  ,  ],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  , 1, 1],
            [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        ];
        cuerpo["down"][1] = [
            [ ,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ ,  , 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ],
            [ ,  , 1,  , 1, 1, 1, 1,  ,  , 1, 1,  ],
            [ , 1,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
            [ , 1,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
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
        /*
        pies[3] = [
            [ ,  ,  ,  , 1,  ,  , 1,  ,  ,  ,  ,  ],
            [ ,  ,  ,  , 1,  ,  ,  , 1,  ,  ,  ,  ],
            [ ,  ,  ,  , 1,  ,  ,  , 1,  ,  ,  ,  ],
            [ ,  ,  , 1,  ,  ,  ,  ,  , 1,  ,  ,  ],
            [ ,  ,  , 1,  ,  ,  ,  ,  , 1,  ,  ,  ],
        ];
        */

        var palo = [];
        palo[0] = [
            [1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
            [ ,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ],
            [ ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1, 1, 1, 1],
        ];
        palo[1] = [
            [,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1],
            [,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ],
            [1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
        ];

        ctx.beginPath();
        

        var que_pie = 0;
        var que_palo = 0;
        var que_cuerpo = 0;
        var pos_cuerpo = "up";
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


        if(this.jumping){
            que_pie = 3;
        }

        ctx.save();
        ctx.translate(x_player, y_player);
        x_player = 0;
        y_player = 0;
        if(this.izquierda_){
            x_player = -this.ancho_;
            ctx.scale(-1, 1);
        }

        var idle_movimiento = negativo_tween * 3;
        var idle_movimiento2 = negativo_tween * 2.5;

        juego.pinta_filas_columnas_(ctx, x_player + (this.block_size_ * 6) - (mas_menos * this.block_size_/2), y_player + mas_abajo + idle_movimiento, cabeza, this.block_size_, "#00ff00");
        juego.pinta_filas_columnas_(ctx, x_player, y_player + (this.block_size_ * 5) + mas_abajo + idle_movimiento2, cuerpo[pos_cuerpo][que_cuerpo], this.block_size_, "#0000ff");
        
        juego.pinta_filas_columnas_(ctx, x_player, y_player + (this.block_size_ * 12), pies[que_pie], this.block_size_, "#ffff00");

        if(this.tiempo_enfadado_ > juego.timestamp_()){

            //PRUEBA PINTANDO ATAQUE 1
            if((this.tiempo_enfadado_ - juego.timestamp_()) > 300){
                ctx.rotate(270 * Math.PI / 180);
            }
            else if((this.tiempo_enfadado_ - juego.timestamp_()) > 200){
                ctx.rotate(300 * Math.PI / 180);
            }
            else if((this.tiempo_enfadado_ - juego.timestamp_()) > 100){
                ctx.rotate(350 * Math.PI / 180);
            }

        }
        else{

        }
        
        juego.pinta_filas_columnas_(ctx, x_player - (this.block_size_ * 5), y_player + (this.block_size_ * 8) + mas_abajo + idle_movimiento2, palo[que_palo], this.block_size_, "#ff0000");
        
        
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
