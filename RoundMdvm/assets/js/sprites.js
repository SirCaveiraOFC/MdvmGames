function Sprite(x, y, largura, altura) {
	this.x = x;
	this.y = y;
	this.largura = largura;
	this.altura = altura;
	
	this.desenha = function (xCanvas, yCanvas) {
		ctx.drawImage(img, this.x, this.y, this.largura, this.altura, xCanvas, yCanvas, this.largura, this.altura);
	}
}

var
bg = new Sprite(0, 0, 600, 780),
boneca = new Sprite(883, 362, 55, 86),
personagem = new Sprite(633, 199, 34, 50),
arvore = new Sprite(790, 513, 210, 260),
red_man = new Sprite(886, 276, 47, 79);