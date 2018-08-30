

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

        var croqueta_player = new CPlayer();
        croqueta_player.init(croqueta);
        var flag_croqueta = false;
        window.croqueta_audio;

        var golpe_player = new CPlayer();
        golpe_player.init(golpe);
        var flag_golpe = false;
        window.golpe_audio;

        var golpe_player2 = new CPlayer();
        golpe_player2.init(golpe2);
        var flag_golpe2 = false;
        window.golpe_audio2;

        var punto_player = new CPlayer();
        punto_player.init(punto);
        var flag_punto = false;
        window.punto_audio;

        var levelup_player = new CPlayer();
        levelup_player.init(levelup);
        var flag_levelup = false;
        window.levelup_audio2;


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

            if(!flag_croqueta){
                if(croqueta_player.generate() >= 1){
                    flag_croqueta = true;
                }
            }
            
            if(!flag_golpe){
                if(golpe_player.generate() >= 1){
                    flag_golpe = true;
                }
            }
            
            if(!flag_golpe2){
                if(golpe_player2.generate() >= 1){
                    flag_golpe2 = true;
                }
            }
            
            if(!flag_levelup){
                if(levelup_player.generate() >= 1){
                    flag_levelup = true;
                }
            }
            
            if(!flag_punto){
                if(punto_player.generate() >= 1){
                    flag_punto = true;
                }
            }
            

            done = (flag_song && flag_croqueta && flag_golpe && flag_golpe2);

            if (done) {

            //Cuando todo está OK y antes de limpiar este intervalo, genero un elemento de audio para cada sonido

            var wave = music_player.createWave();
            var audio = document.createElement("audio");
            audio.src = URL.createObjectURL(new Blob([wave], {type: "audio/wav"}));
            audio.loop=true;
            audio.play();
            audio.volume = 0.3;


            var wave2 = croqueta_player.createWave();
            window.croqueta_audio = document.createElement("audio");
            window.croqueta_audio.src = URL.createObjectURL(new Blob([wave2], {type: "audio/wav"}));
            window.croqueta_audio.volume = 0.7;
            
            var wave3 = golpe_player.createWave();
            window.golpe_audio = document.createElement("audio");
            window.golpe_audio.src = URL.createObjectURL(new Blob([wave3], {type: "audio/wav"}));
            
            var wave4 = golpe_player2.createWave();
            window.golpe_audio2 = document.createElement("audio");
            window.golpe_audio2.src = URL.createObjectURL(new Blob([wave4], {type: "audio/wav"}));
            
            var wave5 = levelup_player.createWave();
            window.levelup_audio2 = document.createElement("audio");
            window.levelup_audio2.src = URL.createObjectURL(new Blob([wave5], {type: "audio/wav"}));
            
            var wave6 = punto_player.createWave();
            window.punto_audio = document.createElement("audio");
            window.punto_audio.src = URL.createObjectURL(new Blob([wave6], {type: "audio/wav"}));
            
            }
        }, 40);
    }
}