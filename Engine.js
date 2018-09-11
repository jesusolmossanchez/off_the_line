

/**************************************************
** ENGINE CLASS
**************************************************/
var Engine = function(juego, mobile) {

    juego.counter = 0; 

    

    this.dt = 0;
    this.now,
    this.last = juego.timestamp_();
    this.then_ = juego.timestamp_();

    this.frame_ = function(){

        //debug start
        //window.stats.begin();


        mobile.controla_if_mobile_();

        if(window.innerWidth < 820){
            ancho_total_ = window.innerWidth * 2,
            alto_total_  = window.innerHeight * 2;

        }
        else{
            ancho_total_ = window.innerWidth,
            alto_total_  = window.innerHeight;
        }
        
        juego.canvas_.width  = ancho_total_;
        juego.canvas_.height = alto_total_;

        if(!juego.empezado_){
            juego.muestra_menu_(juego.ctx, juego.modo_seleccionado_);
            requestAnimationFrame(this.frame_.bind(this));
            return;
        }
        if(juego.pausa_){
            requestAnimationFrame(this.frame_.bind(this));
            return;
        }

        this.now = juego.timestamp_();
        
        this.dt = this.dt + Math.min(1, (this.now - this.last) / 1000);

        while(this.dt > juego.step_) {
            this.dt = this.dt - juego.step_;

            var elapsed = this.now - this.then_;
    
            if (elapsed > juego.fpsInterval) {
                juego.update_(juego.step_);
            }
            
            this.then_ = this.now - (elapsed % juego.fpsInterval);
            this.last = this.now;
        }


        juego.pre_shake_();
        juego.render(juego.ctx, juego.counter, this.dt);
        juego.post_shake_();
        
        juego.counter++;
        
        //debug start
        //window.stats.end();

        requestAnimationFrame(this.frame_.bind(this), canvas);
    }   
}