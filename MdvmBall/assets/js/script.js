// MdvmBall - MDVM
// Desenvolvido por: Sr.Caveira

// Variáveis do game
var canvas,
contexto,
altura,
largura,
maxPulos = 3,
velocidade = 6,
estadoAtual,
record,
img,
pontosParaNovaFase = [10, 25, 40, 55, 70, 85, 100],
faseAtual = 0,
som_HIT = new Audio('./assets/audios/hit.wav'),
som_game = new Audio('./assets/audios/CliffJump.mp3'),
som_game_p = false,

labelNovaFase = {
  texto: '',
  opacidade: 0.0,
  fadeIn: function (fTime) {
    var fadeInIV = setInterval(function() {
      if (labelNovaFase.opacidade < 1.0) {
        labelNovaFase.opacidade += 0.01;
      } else {
        clearInterval(fadeInIV);
      }
    }, 10 * fTime);
  },
  fadeOut: function (fTime) {
    var fadeOutIV = setInterval(function() {
      if (labelNovaFase.opacidade > 0.0) {
        labelNovaFase.opacidade -= 0.01;
      } else {
        clearInterval(fadeOutIV);
      }
    }, 10 * fTime);
  }
},

estados = {
  jogar: 0,
  jogando: 1,
  perdeu: 2
},

chao = {
  y: window.innerWidth <= 600 ? 590 : 550,
  x: 0,
  altura: 50,
  atualiza: function() {
    this.x -= velocidade;

    if (this.x <= - 600) {
      this.x += 600;
    }
  },
  desenha: function() {
    spriteChao.desenha(this.x, this.y);
    spriteChao.desenha(this.x + spriteChao.largura, this.y);
  }
},

mdvm_head = {
  x: 50,
  y: 0,
  altura: spriteBoneco.altura,
  largura: spriteBoneco.largura,
  gravidade: 1.6,
  velocidade: 0,
  forcaDoPulo: 23.6,
  pulos: 0,
  score: 0,
  rotacao: 0,
  vidas: 3,
  colidindo: false,
  atualiza: function() {
    this.velocidade += this.gravidade;
    this.y += this.velocidade;
    this.rotacao += Math.PI / 180 * velocidade;

    if (this.y > chao.y - this.altura && estadoAtual != estados.perdeu) {
      this.y = chao.y - this.altura;
      this.pulos = 0;
      this.velocidade = 0;
    }
  },
  pula: function() {
    if (this.pulos < maxPulos) {
      this.velocidade =- this.forcaDoPulo;
      this.pulos++;
    }
  },
  reset: function() {
    this.velocidade = 0;
    this.y = 0;

    if (this.score > record) {
      localStorage.setItem('record', this.score);
      record = this.score;
    }

    this.vidas = 3;
    this.score = 0;

    velocidade = 6;
    faseAtual = 0;
    this.gravidade = 1.6;
  },
  desenha: function() {
    context.save();
    context.translate(this.x + this.largura / 2, this.y + this.altura / 2);
    context.rotate(this.rotacao);
    spriteBoneco.desenha(-this.largura / 2, -this.altura / 2);
    context.restore();
  }
},

obstaculos = {
  _obs: [],
  _scored: false,
  _sprites: [arabeObstacleNigga, arabeObstacleWhite, arabeObstacleNigga, arabeObstacleWhite],
  tempoInsere: 0,
  insere: function() {
    this._obs.push({
      x: largura,
      y: chao.y - Math.floor(20 + Math.random() * 100),
      largura: 50,
      sprite: this._sprites[Math.floor(this._sprites.length * Math.random())]
    });

    this.tempoInsere = 70 + Math.floor(21 * Math.random());
  },

  atualiza: function() {
    if (this.tempoInsere == 0) {
      this.insere();
    } else {
      this.tempoInsere--;
    }

    for (var i = 0, len = this._obs.length; i < len; i++) {
      var obs = this._obs[i];

      obs.x -= velocidade;

      if (!mdvm_head.colidindo && mdvm_head.x < obs.x + obs.largura && mdvm_head.x + mdvm_head.largura >= obs.x
        && mdvm_head.y + mdvm_head.altura >= obs.y) {
        mdvm_head.colidindo = true;

        som_HIT.play();

        setTimeout(function() {
          mdvm_head.colidindo = false;
        }, 500);

        if (mdvm_head.vidas >= 1) {
          mdvm_head.vidas--;
        } else {
          estadoAtual = estados.perdeu;
        }
      }

      else if (obs.x <= 0 && !obs._scored) {
        mdvm_head.score++;

        obs._scored = true;

        if (faseAtual < pontosParaNovaFase.length &&
          mdvm_head.score == pontosParaNovaFase[faseAtual]) {
          passarDeFase();
        } else if (faseAtual < pontosParaNovaFase.length) {
          dificuldade();
        }
      }

      else if (obs.x <= - obs.largura) {
        this._obs.splice(i, 1);
        len--;
        i--;
      }
    }
  },

  limpa: function () {
    this._obs = [];
  },

  desenha: function() {
    for (var i = 0, len = this._obs.length; i < len; i++) {
      var obs = this._obs[i];

      obs.sprite.desenha(obs.x, obs.y);
    } 
  }
};

function clique(e) {
  canvas.requestFullscreen();

  switch(estadoAtual) {
    case estados.jogando:
      mdvm_head.pula();
    break;
    case estados.jogar:
      estadoAtual = estados.jogando;
      som_game.play();
      som_game_p = true;
    break;
    case estados.perdeu:
      if (mdvm_head.y >= 3 * altura) {
        estadoAtual = estados.jogar;
        obstaculos.limpa();
        mdvm_head.reset();
        som_game.pause();
        som_game.currentTime = 0;
      }
    break;
  }
}

function passarDeFase() {
  velocidade++;
  faseAtual++;
  mdvm_head.vidas++;

  labelNovaFase.texto = `Level ${faseAtual}`;
  labelNovaFase.fadeIn(0.4);

  setTimeout(function() {
    labelNovaFase.fadeOut(0.4);
  }, 800);
}

function dificuldade () {
  switch(faseAtual) {
    case 0:
      obstaculos.tempoInsere = 55 + Math.floor(21 * Math.random());
    break;
    case 1:
      obstaculos.tempoInsere = 45 + Math.floor(21 * Math.random());
    break;
    case 2:
      obstaculos.tempoInsere = 35 + Math.floor(13 * Math.random());
      mdvm_head.gravidade = 1.1;
      velocidade = 10.5;
    break;
    case 3:
      obstaculos.tempoInsere = 25 + Math.floor(13 * Math.random());
    break;
    case 4:
      obstaculos.tempoInsere = 10 + Math.floor(8 * Math.random());
      mdvm_head.gravidade = 0.95;
    break;
    case 5:
      obstaculos.tempoInsere = 5 + Math.floor(13 * Math.random());
      mdvm_head.gravidade = 0.84;
    break;
    case 6:
      obstaculos.tempoInsere = 1 + Math.floor(4 * Math.random());
      mdvm_head.gravidade = 0.75;
    break;
  }
}

function main() {
  largura = window.innerWidth;
  altura = window.innerHeight;

  if (largura <= 600) {
    largura = 600;
    altura = 600;
  } else if (largura >= 900) {
    largura = 600;
    altura = 600;
  }

  canvas = document.createElement('canvas');

  canvas.width = largura;
  canvas.height = altura;

  context = canvas.getContext('2d');

  document.body.appendChild(canvas);

  if (window.innerWidth <= 600) {
    document.addEventListener('touchstart', clique);
  } else {
    document.addEventListener('mousedown', clique);
  }

  estadoAtual = estados.jogar;

  record = localStorage.getItem('record');

  if (record == null) {
    record = 0;
  }

  img = new Image();
  img.src = "./assets/images/sprites.png";

  roda();
}

function roda() {
  atualiza();
  desenha();

  window.requestAnimationFrame(roda);
}

function atualiza() {
  switch (estadoAtual) {
    case estados.jogando:
      obstaculos.atualiza();
  }

  if (estadoAtual == estados.perdeu && som_game_p) {
    som_game.pause();
    som_game.currentTime = 0;
    som_game_p = false;
  }

  chao.atualiza();

  mdvm_head.atualiza();
}

function desenha() {
  bg.desenha(0, 0);

  context.fillStyle = "#fff";
  context.font = "50px Arial";
  context.fillText(`Score: ${mdvm_head.score}`, 30, 60);
  context.fillText(`Vidas: ${mdvm_head.vidas}`, 400, 60);

  context.fillStyle = `rgba(0, 0, 0, ${labelNovaFase.opacidade})`;
  context.fillText(labelNovaFase.texto, canvas.width / 2 - context.measureText(labelNovaFase.texto).width / 2, canvas.height / 3);

  switch(estadoAtual) {
    case estados.jogando:
      obstaculos.desenha();
    break;
  }

  chao.desenha();
  mdvm_head.desenha();

  switch(estadoAtual) {
    case estados.jogar:
      jogar.desenha(largura / 2 - jogar.largura / 2, altura / 2 - jogar.altura / 2);
    break;
    case estados.perdeu:
      perdeu.desenha(largura / 2 - perdeu.largura / 2, altura / 2 - perdeu.altura / 2 - spriteRecord.altura / 2);
      spriteRecord.desenha(largura / 2 - spriteRecord.largura / 2, altura / 2 + perdeu.altura / 2 - spriteRecord.altura / 2 - 25);

      context.fillStyle = "#fff";

      if (mdvm_head.score > record) {
        novo.desenha(largura / 2 - 180, altura / 2 + 30);
        context.fillText(mdvm_head.score, 420, 470);
      } else {
        context.fillText(mdvm_head.score, 375, 395);
        context.fillText(record, 420, 475);
      }
    break;
  }
}

// Inicia o game
main();