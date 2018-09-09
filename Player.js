

/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(juego, x, y, gravedad, impulso, player_num, cpu, tipo, bloque) {

    this.x                 = x;
    this.y                 = y;
    if(bloque){
        this.block_size_       = bloque;
    }
    else{
        this.block_size_       = 4;
    }
    this.alto_             = this.block_size_ * 17;
    this.ancho_            = this.block_size_ * 13;
    this.dx                = 0;
    this.dy                = 0;
    
    this.player_num_       = player_num;

    this.wasleft           = false;
    this.wasright          = false;
    this.gravity_          = gravedad*2;

    this.rotacion_         = 0;

    this.estoy_muerto_     = false;
    this.vida_inicial_      = 100;
    this.vida_             = this.vida_inicial_;

    this.color_ = juego.COLOR_.YELLOW;

    /*

    BLACK: '#000000', 
                      YELLOW: '#ECD078', 
                      BRICK: '#D95B43', 
                      PINK: '#C02942', 
                      PURPLE: '#542437', 
                      GREY: '#333', 
                      SLATE: '#53777A', 
                      GOLD: 'gold'

                      */

    if(tipo){
        this.tipo_ = tipo;
    }
    else{
        this.tipo_ = 1;
    }


    this.maxdx_             = 250;
    this.maxdy_             = 800;
    this.pow_               = 8;

    this.cambia_tipo_ = function(tipo) {
        switch (tipo){
            case 2:
                this.maxdx_             = 250 * 1.5;
                this.maxdy_             = 800 * 1.5;
                this.pow_               = 3;
                this.color_             = juego.COLOR_.PINK;
                break;
            case 3:
                this.maxdx_             = 250 * 2;
                this.maxdy_             = 800 * 0.8;
                this.pow_               = 4;
                this.color_             = juego.COLOR_.PURPLE;
                break;
            case 4:
                this.maxdx_             = 250 * 0.7;
                this.maxdy_             = 800 * 0.7;
                this.pow_               = 15;
                this.color_             = juego.COLOR_.GOLD;
                break;
        }
    }

    this.cambia_tipo_(this.tipo_);

    this.impulse_           = impulso;
    this.accel_             = this.maxdx_ / (juego.ACCEL_);
    this.friction_          = this.maxdx_ / (juego.FRICTION_);
    this.tiempo_enfadado_   = juego.timestamp_();
    this.tiempo_ostiazo_   = juego.timestamp_();
    this.ostia_izquierda_   = false;
    this.tiempo_bloqueo_   = juego.timestamp_();
    
    this.CPU_ = cpu;    
    this.izquierda_ = false;
    if(cpu){
        this.izquierda_ = true;
    }


    this.cabeza_ = [];
    this.cabeza_[0] = [
        [ , 1, 1, 1, ],
        [1, 1, 1, 1, ],
        [1,  , 1,  , ],
        [1, 1, 1,  , ],
        [1, 1,  ,  , ],
    ];

    this.cabeza_[1] = [
        [ , 1, 1, 1, ],
        [1,  , 1, 1, ],
        [1,  , 1,  , ],
        [1, 1, 1,  , ],
        [1, 1,  ,  , ],
    ];

    this.cuerpo_ = [];
    this.cuerpo_["up"] = [];
    this.cuerpo_["middle"] = [];
    this.cuerpo_["down"] = [];
    this.cuerpo_["golpe"] = [];
    this.cuerpo_["saltando"] = [];
    this.cuerpo_["up"][0] = [
        [ ,  ,  , 1, 1, 1, 1, 1,  , 1,  ,  ,  ],
        [ ,  ,  , 1, 1, 1, 1, 1, 1,  ,  ,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1, 1,  , 1,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  , 1,  ,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
    ];
    this.cuerpo_["up"][1] = [
        [ ,  ,  , 1, 1, 1, 1, 1, 1,  ,  , 1,  ],
        [ ,  ,  , 1, 1, 1, 1, 1,  , 1, 1,  ,  ],
        [ ,  ,  , 1, 1, 1, 1, 1, 1,  ,  ,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
    ];
    this.cuerpo_["up"][2] = [
        [ ,  ,  , 1, 1, 1, 1, 1, 1, 1,  ,  ,  ],
        [ ,  ,  , 1, 1, 1, 1, 1,  ,  , 1, 1,  ],
        [ ,  ,  , 1, 1, 1, 1, 1, 1, 1,  ,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  , 1, 1,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
    ];
    this.cuerpo_["up"][3] = [
        [ ,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  ,  , 1, 1, 1, 1, 1, 1,  ,  ,  ,  ],
        [ ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  , 1, 1,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
    ];


    this.cuerpo_["middle"][0] = [
        [ ,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  , 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ],
        [1, 1,  ,  , 1, 1, 1, 1,  , 1, 1,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  , 1, 1],
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
    ];
    this.cuerpo_["middle"][1] = [
        [ ,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  , 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ],
        [ ,  , 1,  , 1, 1, 1, 1,  ,  , 1, 1,  ],
        [ , 1,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        [ , 1,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
    ];
    this.cuerpo_["middle"][2] = [
        [ ,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  , 1, 1,  , 1, 1, 1, 1, 1, 1,  ,  ],
        [ ,  , 1,  ,  , 1, 1, 1, 1,  ,  , 1, 1],
        [ ,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ],
        [ ,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ],
        [ ,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ],
        [ ,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ],
    ];
    
    this.cuerpo_["middle"][3] = [
        [ ,  ,  ,  ,  , 1, 1, 1, 1,  ,  , 1, 1],
        [ ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1,  ,  ],
        [ ,  ,  , 1,  , 1, 1, 1, 1,  ,  ,  ,  ],
        [ ,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ],
        [ ,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ],
        [ ,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ],
        [ ,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ],
    ];


    this.cuerpo_["down"][0] = [
        [1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  ,  , 1, 1, 1, 1, 1, 1,  ,  ,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  , 1,  ,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  , 1,  ,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  , 1,  ,  ],
    ];
    this.cuerpo_["down"][1] = [
        [ ,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  , 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ],
        [1, 1,  ,  , 1, 1, 1, 1,  , 1, 1,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  , 1, 1],
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
    ];
    this.cuerpo_["down"][2] = [
        [ ,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  , 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ],
        [ ,  , 1,  , 1, 1, 1, 1,  , 1,  ,  ,  ],
        [ ,  , 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
    ];
    this.cuerpo_["down"][3] = [
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  ,  , 1, 1, 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  ,  , 1, 1, 1, 1, 1, 1, 1,  ,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  , 1, 1,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
    ];
    
    this.cuerpo_["golpe"][0] = [
        [ ,  ,  , 1, 1, 1, 1, 1,  ,  , 1, 1,  ],
        [ ,  ,  , 1, 1, 1, 1, 1, 1, 1,  ,  ,  ],
        [ ,  , 1,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  , 1,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  , 1,  ,  , 1, 1, 1, 1,  ,  ,  ,  ],
        [ ,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ],
        [ ,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ],
    ];
    
    this.cuerpo_["golpe"][1] = [
        [ ,  ,  ,  ,  ,  ,  ,  ,  , 1,  ,  ,  ],
        [ ,  ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  ,  , 1,  , 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  ,  , 1,  , 1, 1, 1, 1,  ,  ,  ,  ],
        [ ,  ,  , 1,  , 1, 1, 1, 1,  ,  ,  ,  ],
    ];
    
    this.cuerpo_["saltando"][0] =  [
        [ , 1,  ,  , 1, 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  , 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  , 1,  ,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  , 1,  ,  ,  ],
        [ ,  ,  ,  , 1, 1, 1, 1,  , 1,  ,  ,  ],
    ];

    this.pies_ = [];

    this.pies_[0] = [
        [ ,  ,  ,  , 1,  ,  , 1,  ,  ,  ,  ,  ],
        [ ,  ,  ,  , 1,  ,  , 1,  ,  ,  ,  ,  ],
        [ ,  ,  ,  , 1,  ,  ,  , 1,  ,  ,  ,  ],
        [ ,  ,  , 1,  ,  ,  ,  , 1,  ,  ,  ,  ],
        [ ,  ,  , 1,  ,  ,  ,  , 1,  ,  ,  ,  ],
    ];
    this.pies_[1] = [
        [ ,  ,  ,  , 1,  ,  , 1,  ,  ,  ,  ,  ],
        [ ,  ,  ,  , 1,  ,  ,  , 1,  ,  ,  ,  ],
        [ ,  ,  ,  , 1,  ,  ,  , 1,  ,  ,  ,  ],
        [ ,  ,  , 1,  ,  , 1, 1,  ,  ,  ,  ,  ],
        [ ,  ,  , 1,  ,  ,  ,  ,  ,  ,  ,  ,  ],
    ];
    this.pies_[2] = [
        [ ,  ,  ,  , 1,  ,  , 1,  ,  ,  ,  ,  ],
        [ ,  ,  ,  , 1,  ,  ,  , 1,  ,  ,  ,  ],
        [ ,  , 1, 1,  ,  ,  ,  , 1,  ,  ,  ,  ],
        [ ,  ,  ,  ,  ,  ,  ,  ,  , 1,  ,  ,  ],
        [ ,  ,  ,  ,  ,  ,  ,  ,  , 1,  ,  ,  ],
    ];
    this.pies_[3] = [
        [ ,  ,  ,  , 1,  ,  , 1,  ,  ,  ,  ,  ],
        [ ,  ,  ,  , 1,  ,  , 1,  ,  ,  ,  ,  ],
        [ ,  ,  ,  , 1,  ,  , 1,  ,  ,  ,  ,  ],
        [ ,  ,  ,  , 1,  ,  , 1,  ,  ,  ,  ,  ],
        [ ,  ,  , 1,  ,  , 1,  ,  ,  ,  ,  ,  ],
    ];

    this.pies_[4] = [
        [ ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
        [ ,  ,  ,  ,  , 1, 1, 1,  ,  ,  ,  ,  ],
        [ ,  ,  ,  ,  , 1,  , 1, 1,  ,  ,  ,  ],
        [ ,  ,  , 1, 1, 1,  ,  , 1,  ,  ,  ,  ],
        [ ,  ,  , 1,  ,  ,  ,  , 1,  ,  ,  ,  ],
    ];

    //this.PIES_ DE OSTIAZO
    this.pies_[5] = [
        [,  ,  ,  ,  ,  , 1,  , 1,  ,  ,  ,  ],
        [,  ,  ,  ,  ,  , 1,  ,  , 1,  ,  ,  ],
        [,  ,  ,  ,  ,  , 1, 1,  , 1,  ,  ,  ],
        [,  ,  ,  ,  ,  ,  , 1,  ,  , 1,  ,  ],
        [,  ,  ,  ,  ,  ,  , 1,  ,  , 1,  ,  ],
    ];
    this.pies_[6] = [
        [,  ,  ,  ,  , 1,  ,  , 1,  ,  ,  ,  ],
        [,  ,  ,  ,  , 1,  ,  ,  , 1,  ,  ,  ],
        [,  ,  ,  ,  ,  , 1, 1,  ,  , 1, 1,  ],
        [,  ,  ,  ,  ,  ,  , 1, 1,  ,  ,  ,  ],
        [,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
    ];

    //Saltando
    this.pies_[7] = [
        [ ,  ,  ,  , 1,  ,  , 1,  ,  ,  ,  ,  ],
        [ ,  ,  , 1,  ,  , 1,  ,  ,  ,  ,  ,  ],
        [ ,  ,  , 1,  ,  , 1,  ,  ,  ,  ,  ,  ],
        [ ,  ,  ,  ,  ,  , 1,  ,  ,  ,  ,  ,  ]
    ];

        

    this.palo_ = [];
    this.palo_[0] = [
        [1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
        [ ,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ],
        [ ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1, 1, 1, 1],
    ];
    this.palo_[1] = [
        [ ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1],
        [ ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ],
        [1, 1, 1, 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
    ];


    this.paloprueba = [
        [1]]


    this.update = function(dt) {
        
        //Control de si iba hacia la izquierda o a la derecha y friccion y aceleración... Ahora no lo uso, pero puede ser util
        this.wasleft    = this.dx  < 0;
        this.wasright   = this.dx  > 0;
      
        //reseteo las aceleraciones
        this.ddx = 0;
        this.ddy = this.gravity_;

        //movimientos
        
        
        if(!this.estoy_muerto_){

            if (this.tiempo_ostiazo_ - 100 > juego.timestamp_()){
                if(this.ostia_izquierda_){
                    this.ddx = this.ddx + this.accel_*5;
                }
                else{
                    this.ddx = this.ddx - this.accel_*5;
                }
            }
            if(juego.tiempo_cuenta_atras_ > juego.timestamp_()){
                
                if(juego.tiempo_cuenta_atras_ > juego.timestamp_() + 3000){
                    if (this.player_num_ == 1){
                        this.ddx = this.ddx + this.accel_ - this.friction_/15;
                        this.izquierda_ = false;
                        this.jumping = true;
                    }
                    else{
                        this.ddx = this.ddx - this.accel_ + this.friction_/15;
                        this.izquierda_ = true;
                        this.jumping = true;

                    }
                }
                else{
                    this.dx = 0;
                }
            }
            else{
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
        else{
            if(!this.jumping){
                this.ddy = this.ddy - this.impulse_/1.5; 
                this.jumping = true;

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
        if(this.dx > 0 && 
            (this.x + this.ancho_ >= (ancho_total_ - 80) && (this.y + this.alto_ > alto_total_ /3))){ //Comprobación de si está fuera de la pantalla
            this.x = ancho_total_ - this.ancho_ - 80;
            this.dx = 0;
        }
        //Comprobación que no pasa de limite a la izquierda
        if(this.dx < 0 && (this.x <= 80 && (this.y + this.alto_ > alto_total_ /3))){
            this.x = 80;
            this.dx = 0;
        }
        if(this.x >= ancho_total_ - this.ancho_){
            var ed_cerca = 0;
            if(this.y + this.alto_ > alto_total_ /3){
                ed_cerca = 80;
            }
            this.x = ancho_total_ - this.ancho_ - ed_cerca;
        }
        if(this.x < 0){
            this.x = 0;
        }


        if(this.y + this.alto_ < alto_total_ /3 && this.y > 0){
            if(this.x <= 70 || (this.x + this.ancho_ >= (ancho_total_ - 70))){
                if(this.dy > 0){
                    this.dy = - this.dy/3;
                    this.tiempo_enfadado_ = juego.timestamp_();
                    var seft = this;
                    setTimeout(function(){
                        seft.jumping = false;
                        },200);
                    this.y = alto_total_ /3 - this.alto_ - 1;
                }
            }
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

        if(this.tiempo_enfadado_ > juego.timestamp_()
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
                        if(player_contrario.tiempo_enfadado_ > juego.timestamp_()){
                            //console.log("golpe parado - SALTANDO");
                            bloqueo = true;
                        }
                        else{
                            cuanto_quita = 0.3;
                            player_contrario.ostia_izquierda_ = false;
                            console.log("le atizo por la derecha - SALTANDO");
                        }
                    }
                    else if(this.up || this.jumping){ 
                        if(player_contrario.up){  
                            //console.log("golpe parado - ARRIBA");
                            bloqueo = true;

                        }
                        else{
                            cuanto_quita = 1;
                            player_contrario.ostia_izquierda_ = false;
                            console.log("le atizo por la derecha - ARRIBA");
                        }
                    }
                    else if(this.down){  
                        if(player_contrario.down){  
                            //console.log("golpe parado - ABAJO");
                            bloqueo = true;
                        }
                        else{
                            cuanto_quita = 1;
                            player_contrario.ostia_izquierda_ = false;
                            console.log("le atizo por la derecha - ABAJO");
                        }
                    }
                    else{
                        if(!player_contrario.up & !player_contrario.down){  
                            //console.log("golpe parado - MEDIO");
                            bloqueo = true;
                        }
                        else{
                            cuanto_quita = 2;
                            player_contrario.ostia_izquierda_ = false;
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
                        if(player_contrario.tiempo_enfadado_ > juego.timestamp_()){
                            //console.log("golpe parado - SALTANDO");
                            bloqueo = true;
                        }
                        else{
                            cuanto_quita = 0.3;
                            player_contrario.ostia_izquierda_ = true;
                            console.log("le atizo por la izquierda - SALTANDO");
                        }
                    }
                    else if(this.up || this.jumping){ 
                        if(player_contrario.up){  
                            //console.log("golpe parado - ARRIBA");
                            bloqueo = true;
                        }
                        else{
                            cuanto_quita = 1;
                            player_contrario.ostia_izquierda_ = true;
                            console.log("le atizo por la izquierda - ARRIBA");
                        }
                    }
                    else if(this.down){  
                        if(player_contrario.down){  
                            //console.log("golpe parado - ABAJO");
                            bloqueo = true;
                        }
                        else{
                            cuanto_quita = 1;
                            player_contrario.ostia_izquierda_ = true;
                            console.log("le atizo por la izquierda - ABAJO");
                        }
                    }
                    else{
                        if(!player_contrario.up & !player_contrario.down){  
                            //console.log("golpe parado - MEDIO");
                            bloqueo = true;
                            
                        }
                        else{
                            cuanto_quita = 2;
                            player_contrario.ostia_izquierda_ = true;
                            console.log("le atizo por la izquierda - MEDIO");
                        }
                    }
                }

                if(bloqueo){

                    juego.tiempo_shacke_ = juego.timestamp_() + 100;
                    juego.intensidad_shacke_ = 10;

                    var ostia_nueva = new Ostiazo(this.block_size_ * - 15, 0 - this.alto_/2 + (this.block_size_ * -3), 1, bloqueo_size, "rgba(255,255,255, "+percent_bloqueo+")", player_contrario.x + player_contrario.ancho_/2, this.y + this.alto_/2, !this.izquierda_, ostia_rotacion);
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
            ctx.scale(-1, 1);
        }


        var idle_movimiento = negativo_tween * 3;
        var idle_movimiento2 = negativo_tween * 2.5;

        var corrige_x_palo = 12;
        var corrige_y_palo = 1;

        var rotacion = false;

        
        if(this.estoy_muerto_){
            
            que_cabeza = 1;
            mas_menos_cabeza_x = 5;
            cabeza_golpe = 1 * this.block_size_;

            que_cuerpo = 0;
            pos_cuerpo = "golpe"
            que_pie = 5;
            mas_abajo = 2 * this.block_size_;
            rotacion = -25 * Math.PI / 180;
        }
        else if(this.jumping){
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
            else if(this.tiempo_ostiazo_ > juego.timestamp_()){
            
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
                
                ctx.translate(0, 10);
                var rueda = 15 * counter * Math.PI / 180;
                if(this.izquierda_){
                    rueda = 15 * Math.PI / 180 * counter;
                }
                ctx.rotate(rueda);
                ctx.translate(0, -10);
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


        

        

        //CUERPO
        juego.pinta_filas_columnas_(ctx, x_player - this.ancho_/2, y_player - this.alto_/2 + (this.block_size_ * 6) + mas_abajo + idle_movimiento2, this.cuerpo_[pos_cuerpo][que_cuerpo], this.block_size_, this.color_);
        
        
        if(this.tiempo_ostiazo_ > juego.timestamp_()){
            ctx.rotate(20 * Math.PI / 180);
        }

        //CABEZA
        juego.pinta_filas_columnas_(ctx, x_player + (this.block_size_ * 0) - (mas_menos_cabeza_x * this.block_size_/2), y_player + (this.block_size_ * 1) - this.alto_/2 + mas_abajo + idle_movimiento + cabeza_golpe, this.cabeza_[que_cabeza], this.block_size_,  this.color_);
        
        if(this.tiempo_ostiazo_ > juego.timestamp_()){
            ctx.rotate(-20 * Math.PI / 180);
        }
        
        //PIES
        juego.pinta_filas_columnas_(ctx, x_player - this.ancho_/2, y_player - this.alto_/2 + (this.block_size_ * 12), this.pies_[que_pie], this.block_size_, this.color_);
        
        
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
        
        
        //palo
        juego.pinta_filas_columnas_(ctx, x_player - (this.block_size_ * corrige_x_palo), y_player - (this.block_size_ * (corrige_y_palo - 1)) + mas_abajo + idle_movimiento2, this.palo_[que_palo], this.block_size_, "#ff0000");
        
        
        //para debug del centro de la escena
        //juego.pinta_filas_columnas_(ctx, 0, 0, this.paloprueba, this.block_size_, "#ffffff");


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
            if(this.player_num_ == 1){
                if(juego.modo_ == 2){
                    juego.ganador_ = "2";
                }
                else{
                    juego.ganador_ = "cpu";
                }
            }
            else{
                if(juego.modo_ == 2){
                    juego.ganador_ = "1";
                }
                else{
                    juego.ganador_ = "1_cpu";
                }
            }

            this.estoy_muerto_ = true;
            
            
            juego.tiempo_shacke_ = juego.timestamp_() + 500;
            juego.intensidad_shacke_ = 20;
            juego.fpsInterval     = 1000 / 20;
            if(juego.modo_ == 1 && juego.level_ < 4){
                juego.siguiente_oponente_(ctx);
            }
            else{
                juego.game_over_(ctx);
            }
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
