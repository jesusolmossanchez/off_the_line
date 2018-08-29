

/**************************************************
** ENGINE CLASS
**************************************************/
var Engine = function(juego, mobile) {

    juego.counter = 0; 

    

    this.dt = 0;
    this.now,
    this.last = juego.timestamp_();

    this.fpsInterval = 1000 / 30;

    this.then_ = juego.timestamp_();

    this.frame_ = function(){

        
        mobile.controla_if_mobile_();
        ancho_total_ = window.innerWidth,
        alto_total_  = window.innerHeight;


        if(!juego.empezado_ || juego.pausa_){
            requestAnimationFrame(this.frame_.bind(this));
            return;
        }
        this.now = juego.timestamp_();
        this.dt = this.dt + Math.min(1, (this.now - this.last) / 1000);
        while(this.dt > juego.step_) {
            this.dt = this.dt - juego.step_;
            if(!juego.hay_muerte_){
                juego.update_(juego.step_);
            }
        }
        if(juego.hay_muerte_){
            var elapsed = this.now - this.then_;

            if (elapsed > this.fpsInterval) {
                juego.pre_shake_();
                juego.render(juego.ctx, juego.counter, this.dt);
                juego.post_shake_();
                juego.update_(juego.step_);
                this.then_ = this.now - (elapsed % this.fpsInterval);
            }
        }
        else{
            juego.pre_shake_();
            juego.render(juego.ctx, juego.counter, this.dt);
            juego.post_shake_();
        }

        this.last = this.now;
        juego.counter++;
        requestAnimationFrame(this.frame_.bind(this), canvas);
    }   
}