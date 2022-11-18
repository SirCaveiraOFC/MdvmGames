var largura = window.innerWidth, altura = window.innerHeight;

if (largura <= 600) {
  largura = 600;
  altura = 600;
} else if (largura >= 900) {
  largura = 600;
  altura = 600;
}

var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");

var img;

var teclas = {};

var esquerda = {
  x: 10,
  y: canvas.height / 2 - 60,
  altura: 120,
  largura: 30,
  diry: 0,
  score: 0,
  speed: 10
};

var direita = {
  x: canvas.width - 40,
  y: canvas.height / 2 - 60,
  altura: 120,
  largura: 30,
  diry: 0,
  score: 0,
  speed: 10
};

var bola = {
  x: canvas.width / 2 - 15,
  y: canvas.height / 2 - 15,
  altura: mdvmHead.altura,
  largura: mdvmHead.altura,
  dirx: -1,
  diry: 1,
  mod: 0,
  speed: 1,

  desenha: function() {
    ctx.save();
    ctx.translate(this.x + this.largura / 2, this.y + this.altura / 2);
    mdvmHead.desenha(-this.largura / 2, -this.altura / 2);
    ctx.restore();
  }
};

if (largura <= 600) {
  largura = 600;
  altura = 600;
}

if (window.innerWidth > 700) {
  document.addEventListener("keydown", function(e) {
    teclas[e.keyCode] = true;
  }, false);

  document.addEventListener("keyup", function(e) {
    delete teclas[e.keyCode];
  }, false);
}

if (window.innerWidth < 700) {
  alert('a');
}

function movebloco() {
  if (87 in teclas && esquerda.y > 0)
    esquerda.y -= esquerda.speed;

  else if (83 in teclas && esquerda.y + esquerda.altura < canvas.height)
    esquerda.y += esquerda.speed;

  if (38 in teclas && direita.y > 0)
    direita.y -= direita.speed;

  else if (40 in teclas && direita.y + direita.altura < canvas.height)
    direita.y += direita.speed;
};

function movebola() {
  if (bola.y + bola.altura >= esquerda.y && bola.y <= esquerda.y + esquerda.altura && bola.x <= esquerda.x + esquerda.largura) {
    bola.dirx = 1;
    bola.mod += 0.2;
  } else if (bola.y + bola.altura >= direita.y && bola.y <= direita.y + direita.altura && bola.x + bola.largura >= direita.x) {
    bola.dirx = -1;
    bola.mod += 0.2;
  }

  if (bola.y <= 0)
    bola.diry = 1;

  else if (bola.y + bola.altura >= canvas.height)
    bola.diry = -1;

  bola.x += (bola.speed + bola.mod) * bola.dirx;
  bola.y += (bola.speed + bola.mod) * bola.diry;

  if (bola.x < esquerda.x + esquerda.largura - 45)
    newgame("player 2");

  else if (bola.x + bola.largura > direita.x + 45)
    newgame("player 1");
};

function newgame(winner) {
  if (winner == "player 1")
    esquerda.score++;
  else
    direita.score++;

  esquerda.y = canvas.height / 2 - esquerda.altura / 2;
  direita.y = esquerda.y;
  bola.y = canvas.height / 2 - bola.altura / 2;
  bola.x = canvas.width / 2 - bola.largura / 2;
  bola.mod = 0;
};

function desenha() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bola.desenha();
  movebloco();
  movebola();

  ctx.fillStyle = "white";

  ctx.fillRect(esquerda.x, esquerda.y, esquerda.largura, esquerda.altura);
  ctx.fillRect(direita.x, direita.y, direita.largura, direita.altura);

  ctx.font = "20px Arial";
  ctx.fillText("Player 1: " + esquerda.score, 50, 20);
  ctx.fillText("Player 2: " + direita.score, canvas.width - 150, 20);

  window.requestAnimationFrame(desenha);
};

img = new Image();
img.src = "./assets/images/sprites.png";

desenha();