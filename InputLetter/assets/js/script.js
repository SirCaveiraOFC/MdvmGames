// Input Letter - MDVM
// Desenvolvido por: Sr.Caveira

var iniciado = false;
var terminado = false;

var recorde_el = document.getElementById('recorde');

if (localStorage.getItem('recorde') > 0) {
  recorde_el.innerText = localStorage.getItem('recorde');
}

// Iniciar contagem do game
function start() {
  let timer = 60;
  let time_game = document.getElementById('time_game');

  let intervalo_timer_game = setInterval(function() {
    timer--;
    time_game.innerText = (timer <= 9 ? `0:0${timer}` : `0:${timer}`);

    if (timer == 0) { terminado = true; }

    if (terminado) {
      clearInterval(intervalo_timer_game);

      document.getElementById('letter').setAttribute('disabled', true);

      document.getElementById('result-wpm').innerText = `${acertos} WPM`;

      document.getElementById('result-wpm-correct-b').innerText = acertos;

      document.getElementById('result-wpm-correct').innerText = acertos;
      
      document.getElementById('result-wpm-wrong-b').innerText = erros;

      document.getElementById('result-wpm-wrong').innerText = erros;

      document.getElementById('total_teclas').innerText = `= ${acertos + erros}`;

      var csr = document.getElementById('container-section-result');

      csr.classList.add('animate__animated');
      csr.classList.add('animate__rubberBand');

      csr.style.display = "flex";

      setTimeout(function() {
        csr.style.opacity = "1";
      }, 200);

      var recorde_el = document.getElementById('recorde');

      if (recorde_el.innerText == "0") {
        localStorage.setItem('recorde', acertos);

        recorde_el.innerText = acertos;
      }

      if (acertos > localStorage.getItem('recorde')) {
        Swal.fire({
          icon: 'success',
          title: 'Novo recorde!',
          width: 600,
          padding: '3em',
          backdrop: `
            rgba(0,0,123,0.4)
            url("assets/images/nyan-cat.gif")
            left top
            no-repeat
          `
        });

        localStorage.setItem('recorde', acertos);

        recorde_el.innerText = acertos;
      }
    }
  }, 1000);
}

// Randomizar arrays
function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);

    currentIndex--;

    [array[currentIndex],
    array[randomIndex]] = [array[randomIndex],
    array[currentIndex]];
  }

  return array;
}

// Pegar um array aleátorio
function array_rand(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Gerar palavras novas
function new_words() {
  var words_arrays = [words_2, words_3, words_4, words_5, words_6, words_7];

  var new_words = array_rand(words_arrays);

  for (let i = 0; i < new_words.length; i++) {
    var span = document.createElement('span');

    span.innerText = `${new_words[i]} `;
    span.setAttribute('class', 'word');
    span.setAttribute('wordnumber', i);

    words_section.appendChild(span);
  }

  document.getElementsByClassName('word')[0].setAttribute('class', 'selected');
}

// Variáveis necessárias
let input = document.getElementById('letter');
let words_section = document.getElementById('words-section');

// Arrays de palavras
let words = [
  'mdvm',
  'mdvm árabe',
  'madson danilo',
  '112.791.104-06',
  'madson danilo viana macedo',
  'josé querino de macedo filho',
  'madsondanilovm@gmail.com',
  '31/01/1999'
];

let words_2 = [
  'mdvm árabe torradeira',
  '814.770.314-72',
  'mdvm aidético',
  'madsondanilo@hotmail.com',
  '36806730',
  'madson',
  'danilo'
];

let words_3 = [
  'suzana marcia de melo viana',
  '09:15',
  'mdvm paraguaio',
  'madsondanilopagamento@gmail.com',
  'árabe torrada',
  'torrada',
  '13/12/1977'
];

let words_4 = [
  'alagoas',
  'rua félix bandeira',
  '383',
  '57014-420',
  'ponta grossa',
  '023.249.824-55',
  'madsondanilovariado@gmail.com'
];

let words_5 = [
  'mdvmkkj',
  'madsondanilo2@gmail.com',
  '49',
  'árabe torradeira',
  '17/12/1971',
  'olimpia malaquias da silva',
  'josé querino de macedo'
];

let words_6 = [
  '22',
  'aquário',
  'viana',
  '06874798395',
  '0428 4852 1708',
  'torrada',
  'maceió'
];

var words_7 = [
  'mdvm judeu',
  'gay mulato do cú roxo',
  'sagitário',
  '43',
  'macedo',
  '57014-276',
  'suzana marcia viana macedo'
];

// Randomizando palavras
words = shuffle(words);
words_2 = shuffle(words_2);
words_3 = shuffle(words_3);
words_4 = shuffle(words_4);
words_5 = shuffle(words_5);
words_6 = shuffle(words_6);
words_7 = shuffle(words_7);

// Pontuação do game
let erros = 0;
let acertos = 0;

// Gerar palavras (inicialmente, onload)
new_words();

document.onkeypress = function (e) {
  if (!iniciado) {
    start();

    iniciado = true;
  }

  if (e.keyCode == 13) {
    if (document.activeElement.nodeName == "INPUT") {
      if (input.value == "") { return false; }

      var wordAtual = document.querySelector('span.selected');

      if (typeof(wordAtual) != 'undefined') {
        if (wordAtual.innerText.trim() == input.value) {
          wordAtual.classList.add('success');
          wordAtual.classList.remove('selected');

          if (wordAtual.nextElementSibling.matches('span')) {
            wordAtual.nextElementSibling.classList.add('selected');
            input.value = "";

            acertos += 1;
          }
        } else {
          wordAtual.classList.add('error');
          wordAtual.classList.remove('error-bg');
          wordAtual.classList.remove('selected');

          if (wordAtual.nextElementSibling.matches('span')) {
            wordAtual.nextElementSibling.classList.add('selected');
            input.value = "";

            erros += 1;
          }
        }
      }
    }
  }
};

document.onkeydown = function (e) {
  var wordAtual = document.querySelector('span.selected');

  if (e.keyCode == 13) {
    if (document.activeElement.nodeName == "INPUT") {
      if (parseInt(wordAtual.getAttribute('wordnumber')) >= 6) {
        words_section.innerText = " ";
        input.value = "";

        new_words();
      }
    }
  }
}

input.oninput = function (e) {
  var wordAtual = document.querySelector('span.selected');

  if (wordAtual.innerText.trim() != input.value) {
    wordAtual.classList.add('error-bg');
  }

  if (input.value.length == wordAtual.innerText.trim().length && wordAtual.innerText.trim() != input.value) {
    wordAtual.classList.add('error-bg');
  } else if (wordAtual.innerText.trim() == input.value) {
    wordAtual.classList.remove('error-bg');
  }
}

document.ondragstart = () => { return false; }

document.ondragend = () => { return false; }