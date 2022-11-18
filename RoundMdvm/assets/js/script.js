// Variáveis
var
estadoAtual,
canvas = document.getElementById("mycanvas"),
ctx = canvas.getContext("2d"),
largura,
altura,
img = new Image(),
audio = new Audio(),
time_timeout,
deveVirar,

// Label
label = {
  texto: '',
  opacidade: 0.0,

  fadeIn: function (dt) {
    var fadeInID = setInterval(function() {
      if (label.opacidade < 1.0) {
        label.opacidade += 0.01; 
      } else {
        clearInterval(fadeInID);
      }
    }, 10 * dt);
  },

  fadeOut: function (dt) {
    var fadeOutID = setInterval(function() {
      if (label.opacidade > 0.0) {
        label.opacidade -= 0.01; 
      } else {
        clearInterval(fadeOutID);
      }
    }, 10 * dt);
  }
},

// Estados
estados = {
  jogar: 0, 
  jogando: 1,
  perdeu: 2,
  ganhou: 3
},

// Linha vermelha do jogo
linha_vermelha = {
  x: canvas.width / 1 - 600,
  y: canvas.height / 2.8 - 1,
  altura: 10,
  largura: 600,
};

// Boneca
boneca_game = {
  x: canvas.width / 2 - 30.2,
  y: 186,
  altura: boneca.altura,
  largura: boneca.largura,
  virada: false,

  // Desenhar
  desenha: function() {
    boneca.desenha(this.x, this.y);
  },

  // Limpar
  limpa: function() {
    this.virada = false;
    deveVirar = false;
    boneca = new Sprite(883, 362, 55, 86);
  },

  // Virar
  virar: function() {
    boneca = new Sprite(796, 360, 55, 85);
    deveVirar = true;
    this.virada = true;
  },

  // Desvirar
  desvirar: function() {
    if (this.virada) {
      bf123();
      deveVirar = false;
      this.limpa();
    }
  }
}

// Red man
red_man_game = {
  x: 130,
  y: 190,
  altura: boneca.altura,
  largura: boneca.largura,

  // Desenhar
  desenha: function() {
    red_man.desenha(this.x, this.y);
    red_man.desenha(this.x * 3.2, this.y);
  },

  // Limpar
  limpa: function() {
    this.x = 130;
    this.y = 190;
  },
};

// Personagem
personagem_game = {
  x: canvas.width / 2 - 25,
  y: 733,
  altura: personagem.altura,
  largura: personagem.largura,
  mvTop: false,
  mvDown: false,
  mvRight: false,
  mvLeft: false,
  speed: 0.4, 
  salvo: false,
  movendo: false,
  countAnime: 650,

  // Desenhar
  desenha: function() {
    personagem.desenha(this.x, this.y);
  },

  // Limpar
  limpa: function() {
    this.salvo = false;
    this.speed = 0.4; 
    this.mvTop = false;
    this.mvDown = false;
    this.mvLeft = false;
    this.mvRight = false;
    this.movendo = false;
    this.x = canvas.width / 2 - 25;
    this.y = 733;
    personagem = new Sprite(633, 201, 34, 46)
  },

  // Mover
  move: function () {
    if (this.mvTop) {
      this.y -= this.speed;
      personagem = new Sprite(633, 199, 34, 50);
    } else if (this.mvDown) {
      this.y += this.speed;
      personagem = new Sprite(633, 9, 34, 46);
    }

    if (this.mvRight) {
      this.x += this.speed;
      personagem = new Sprite(635, 137, 34, 46);
    } else if (this.mvLeft) {
      this.x -= this.speed;
      personagem = new Sprite(633, 73, 34, 46);
    }

    if (this.mvTop || this.mvDown || this.mvLeft || this.mvRight) {
      if (boneca_game.virada)
        this.movendo = true;
    }

    // Impossibilitar saída do personagem ao canvas
    this.x = Math.max(Math.min(canvas.width - this.largura, this.x), 0);
    this.y = Math.max(Math.min(canvas.height - this.altura, this.y), 0);

    // Verificar se o personagem está a salvo(fora ou dentro da linha vermelha)
    if (this.y + this.altura < linha_vermelha.y + linha_vermelha.altura) {
      this.salvo = true;
    } else {
      this.salvo = false;
    }

    if (this.salvo && this.y + this.altura < linha_vermelha.y + linha_vermelha.altura *- 1) {
      estadoAtual = estados.ganhou;
    }

    // Matar o personagem caso ele se mexa e esteja fora da linha vermelha
    if (boneca_game.virada && personagem_game.movendo && !personagem_game.salvo && personagem_game.y >= linha_vermelha.y - 25) {
        boneca = new Sprite(623, 447, 55, 85);
        estadoAtual = estados.perdeu;
        
        audio.src = './assets/audios/disparo.mp3';
        audio.play();
    }
  }
};

canvas.onclick = () => {
  if (estadoAtual == estados.jogar) {
    previousTimeStamp = Date.now();
  }
}

// Adicionando eventos nas teclas
window.addEventListener('keydown', keyDownHandler, false);
window.addEventListener('keyup', keyUpHandler, false);

// Randomizar array
function array_random(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Detectar tecla e movimentar
function keyDownHandler (event) {
  switch (event.keyCode) {
    case 87:
    case 38:
      personagem_game.mvTop = true;
      personagem_game.mvDown = false;
      personagem_game.mvLeft = false;
      personagem_game.mvRight = false;
    break;
    case 83:
    case 40:
      personagem_game.mvDown = true;
      personagem_game.mvTop = false;
      personagem_game.mvLeft = false;
      personagem_game.mvRight = false;
    break;
    case 65:
    case 37:
      personagem_game.mvLeft = true;
      personagem_game.mvRight = false;
      personagem_game.mvDown = false;
      personagem_game.mvTop = false;
    break;
    case 68:
    case 39:
      personagem_game.mvRight = true;
      personagem_game.mvLeft = false;
      personagem_game.mvDown = false;
      personagem_game.mvTop = false;
    break;
  }
}

// Detectar tecla e movimentar
function keyUpHandler (event) {
  switch (event.keyCode) {
    case 87:
    case 38:
      personagem_game.mvTop = false;
    break;
    case 83:
    case 40:
      personagem_game.mvDown = false;
    break;
    case 65:
    case 37:
      personagem_game.mvLeft = false;
    break;
    case 68:
    case 39:
      personagem_game.mvRight = false;
    break;
  }
}

// Reproduzir os áudios
function bf123() {
  // Váriaveis de áudios
  var audios = [
    normal = ['batatinha_frita_123'],
    doisx = ['batatinha_frita_123_1_60x'],
    tresx = ['batatinha_frita_123_1_80x'],
    quatrox = ['batatinha_frita_123_2_50x'],
    cincox = ['batatinha_frita_123_3x']
  ];

  // Salva o array
  var array_audio_gen = array_random(audios);

  switch (array_audio_gen[0]) {
    case 'batatinha_frita_123':
      audio.src = `./assets/audios/batatinha_frita_123.mp3`;
      time_timeout = 5000;
    break;
    case 'batatinha_frita_123_1_60x':
      audio.src = `./assets/audios/batatinha_frita_123_1_60x.mp3`;
      time_timeout = 3500;
    break;
    case 'batatinha_frita_123_1_80x':
      audio.src = `./assets/audios/batatinha_frita_123_1_80x.mp3`;
      time_timeout = 3100;
    break;
    case 'batatinha_frita_123_2_50x':
      audio.src = `./assets/audios/batatinha_frita_123_2_50x.mp3`;
      time_timeout = 2500;
    break;
    case 'batatinha_frita_123_3x':
      audio.src = `./assets/audios/batatinha_frita_123_3x.mp3`;
      time_timeout = 1800;
    break;
  }

  // Reproduz o áudio de inicio
  audio.play();
}

// Limpa - Reseta o jogo
function reset() {
  personagem_game.limpa();
  boneca_game.limpa();
  red_man_game.limpa();
  estadoAtual = estados.jogar;
}

// Função para ativar ao clicar
function clique() {
  switch(estadoAtual) {
    case estados.jogar:
      estadoAtual = estados.jogando;
      bf123();
    break;
    case estados.perdeu:
      reset();
    break;
    case estados.ganhou:
      reset();
    break;
  }
}

// Função padrão
function main() {
  estadoAtual = estados.jogar;
  // Define largura e altura da janela
  largura = window.innerWidth = 600;
  altura = window.innerHeight  = 600;

  // Evento de clique para chamar a função clique e rodar o jogo
  document.addEventListener('click', clique);

  img.src = "./assets/images/sprites__5.png"
  estadoAtual = estados.jogar;

  roda();
}

// Função para rodar o código
function roda() {
  atualiza();
  desenha();
  window.requestAnimationFrame(roda);
}

// Função para atualizar
function atualiza() {
  if (estadoAtual == estados.jogando) {
    personagem_game.move();

    const now = Date.now();
    const elapsed = now - previousTimeStamp;

    if (elapsed >= time_timeout + 800) {
      if (!deveVirar)
        boneca_game.virar();
      else
        boneca_game.desvirar();
        previousTimeStamp = now;
    }
  }
}

// Função para desenhar textos
function textos(text, fadeintime, textcolor, textfontandsize, rgba, fadeout = true) {
  label.texto = text;
  label.fadeIn(fadeintime);
  ctx.fillStyle = textcolor;
  ctx.font = textfontandsize;
  ctx.fillStyle = `rgba(${rgba}, ${label.opacidade})`;
  ctx.fillText(label.texto, canvas.width / 2 - ctx.measureText(label.texto).width / 2, canvas.height / 2);

  if (fadeout) { label.fadeOut(0.4); }
}

// Função para desenhar
function desenha() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenha o background de areia
  bg.desenha(0, 0);
  arvore.desenha(189.2, 5);

  // Seta cor vermelha na linha
  ctx.fillStyle = "red"; 

  // Cria a linha
  ctx.fillRect(linha_vermelha.x, linha_vermelha.y, linha_vermelha.largura, linha_vermelha.altura);

  // Desenha a boneca
  boneca_game.desenha();

  // Desenha os caras de vermelho
  red_man_game.desenha();

  // Desenha o personagem
  personagem_game.desenha();

  if (estadoAtual == estados.jogar) {
     textos('Toque para jogar', 0.4, 'white', '50px Arial', '255, 255, 255', false);
  }

  if (estadoAtual == estados.perdeu) {
    textos('Você morreu!', 0.4, 'red', '50px Arial', '255, 0, 0', false);
  }

  if (estadoAtual == estados.ganhou) {
    textos('Parabéns, você ganhou!!!', 0.4, 'lime', '50px Arial', '13, 255, 0', false);
  }
};

// Inicializa o jogo
main();