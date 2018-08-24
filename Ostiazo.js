
/**************************************************
** OSTIAZO CLASS
**************************************************/
var Ostiazo = function(x, y, que_ostia, block_size, color, x_translate, y_translate, izquierda, rotacion) {




    this.x = x;
    this.y = y;

    this.x_translate_ = x_translate;
    this.y_translate_ = y_translate;
    this.izquierda_ = izquierda;
    this.rotacion_ = rotacion;

    this.ostiazos_ = [];
    this.ostiazos_[0] = [
        [ ,  ,  ,  ,  ,  , 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
        [ ,  ,  ,  ,  ,  ,  , 1,  ,  ,  ,  ,  ,  ,  ,  ,  ],
        [ ,  ,  ,  ,  ,  ,  ,  , 1, 1,  , 1,  , 1,  ,  ,  ],
        [ ,  ,  ,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1,  ,  ,  ],
        [ ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1, 1, 1, 1,  ,  ],
        [ ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1,  ],
        [ ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1],
        [ ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1],
        [ ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1,  ],
        [ ,  ,  ,  ,  ,  ,  ,  ,  ,  , 1, 1, 1, 1, 1, 1,  ],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  ],
        [ ,  ,  ,  ,  ,  , 1, 1, 1,  , 1, 1, 1,  ,  ,  ,  ],
        [ ,  ,  ,  ,  , 1, 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
        [ ,  ,  ,  , 1,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
        [ ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ],
    ];

    this.que_ostia_ = this.ostiazos_[que_ostia];

    this.block_size_ = block_size;

    this.color_ = color;


}