

/**************************************************
** MUSIC CLASS
**************************************************/
var Music = function(juego, mobile, engine) {
    
    this.arranca_ = function(){
         /* Musica */

        //Una instancia del player por cada sonido
        var music_player = new CPlayer();
        var flag_song = false;
        music_player.init(song);


        var ataque_player = new CPlayer();
        ataque_player.init(ataque);
        var flag_ataque = false;
        window.ataque_audio;

        
        var bloqueo_player = new CPlayer();
        bloqueo_player.init(bloqueo);
        var flag_bloqueo = false;
        window.bloqueo_audio;

        
        var ostia_player = new CPlayer();
        ostia_player.init(ostia);
        var flag_ostia = false;
        window.ostia_audio;
        
        var ostia_final_player = new CPlayer();
        ostia_final_player.init(ostia_final);
        var flag_ostia_final = false;
        window.ostia_final_audio;
        
        var sirena_player = new CPlayer();
        sirena_player.init(sirena);
        var flag_sirena = false;
        window.sirena_audio;
        
        var viento_player = new CPlayer();
        viento_player.init(viento);
        var flag_viento = false;
        window.viento_audio;
        
        var menu_player = new CPlayer();
        menu_player.init(menu);
        var flag_menu = false;
        window.menu_audio;


        var done = false;
        var intervalo_cancion = setInterval(function () {

            

            if (done) {
                //Cuando todo está cargado inicio el asunto...

                //Pinto el meni
                juego.muestra_menu_(juego.ctx, false);

                //Y empieza el ciclo del juego
                engine.frame_();
                
                //Limpio este intervalo para no dejar cosas sueltas
                clearInterval(intervalo_cancion);
                return;
            }

            if(!flag_song){
                var music_percent = music_player.generate();
                juego.pinta_cargador_(music_percent, juego.ctx);
                if(music_percent >= 1){
                    flag_song = true;
                }
            }

            if(!flag_bloqueo){
                if(bloqueo_player.generate() >= 1){
                    flag_bloqueo = true;
                }
            }
            
            if(!flag_ataque){
                if(ataque_player.generate() >= 1){
                    flag_ataque = true;
                }
            }
            
            if(!flag_ostia){
                if(ostia_player.generate() >= 1){
                    flag_ostia = true;
                }
            }
            
            if(!flag_ostia_final){
                if(ostia_final_player.generate() >= 1){
                    flag_ostia_final = true;
                }
            }
            
            if(!flag_sirena){
                if(sirena_player.generate() >= 1){
                    flag_sirena = true;
                }
            }
            
            if(!flag_viento){
                if(viento_player.generate() >= 1){
                    flag_viento = true;
                }
            }
            
            if(!flag_menu){
                if(menu_player.generate() >= 1){
                    flag_menu = true;
                }
            }
            
            
            

            done = (flag_song && flag_bloqueo && flag_ataque && flag_ostia && flag_ostia_final && flag_sirena && flag_viento && flag_menu);

            if (done) {

                //Cuando todo está OK y antes de limpiar este intervalo, genero un elemento de audio para cada sonido

                var wave = music_player.createWave();
                var audio = document.createElement("audio");
                audio.src = URL.createObjectURL(new Blob([wave], {type: "audio/wav"}));
                audio.loop=true;
                audio.play();
                audio.volume = 0.1;

                var wave2 = bloqueo_player.createWave();
                window.bloqueo_audio = document.createElement("audio");
                window.bloqueo_audio.src = URL.createObjectURL(new Blob([wave2], {type: "audio/wav"}));
                window.bloqueo_audio.volume = 1;
                
                var wave3 = ataque_player.createWave();
                window.ataque_audio = document.createElement("audio");
                window.ataque_audio.src = URL.createObjectURL(new Blob([wave3], {type: "audio/wav"}));
                
                var wave4 = ostia_player.createWave();
                window.ostia_audio = document.createElement("audio");
                window.ostia_audio.src = URL.createObjectURL(new Blob([wave4], {type: "audio/wav"}));
                
                var wave5 = ostia_final_player.createWave();
                window.ostia_final_audio = document.createElement("audio");
                window.ostia_final_audio.src = URL.createObjectURL(new Blob([wave5], {type: "audio/wav"}));
                
                var wave6 = sirena_player.createWave();
                window.sirena_audio = document.createElement("audio");
                window.sirena_audio.src = URL.createObjectURL(new Blob([wave6], {type: "audio/wav"}));

                
                var wave7 = viento_player.createWave();
                window.viento_audio = document.createElement("audio");
                window.viento_audio.src = URL.createObjectURL(new Blob([wave7], {type: "audio/wav"}));
                
                
                var wave8 = menu_player.createWave();
                window.menu_audio = document.createElement("audio");
                window.menu_audio.src = URL.createObjectURL(new Blob([wave8], {type: "audio/wav"}));
                
            }
        }, 40);
    }
}