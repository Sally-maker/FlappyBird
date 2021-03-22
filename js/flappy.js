function novoElemento(tagName, className) {
  const e = document.createElement(tagName);
  e.className = className;
  return e;
}

function Barreira(reversa = false) {
  this.e = novoElemento('div', 'barreira');
  
  const borda = novoElemento('div', 'borda');
  const corpo = novoElemento('div', 'corpo');

  this.e.appendChild(reversa ? corpo : borda);
  this.e.appendChild(reversa ? borda : corpo);

  this.setAltura = altura => corpo.style.height = `${altura}px`;
}

function ParDeBarreiras(altura, abertura, x) {
  this.e = novoElemento('div', 'par-de-barreiras');

  this.superior = new Barreira(true);
  this.inferior = new Barreira(false);

  this.e.appendChild(this.superior.e);
  this.e.appendChild(this.inferior.e);

  this.sortearAbertura = () => {
      const alturaSuperior = Math.random() * (altura - abertura);
      const alturaInferior = altura - abertura - alturaSuperior;
      this.superior.setAltura(alturaSuperior);
      this.inferior.setAltura(alturaInferior);
  }

  this.getX = () => parseInt(this.e.style.left.split('px')[0]);
  this.setX = x => this.e.style.left = `${x}px`;
  this.getLargura = () => this.e.clientWidth;

  this.sortearAbertura();
  this.setX(x);
}


//const b = new ParDeBarreiras(400,200,400)
//document.querySelector('[wm-flappy]').appendChild(b.e)

function Barreiras(altura, largura, abertura, espaço, notificarPonto){
  this.pares = [
    new ParDeBarreiras(altura, abertura, largura),
    new ParDeBarreiras(altura, abertura, largura + espaço),
    new ParDeBarreiras(altura, abertura, largura + espaço * 2 ),
    new ParDeBarreiras(altura, abertura, largura + espaço * 3 ),
  ]
  const deslocamento = 3
  this.animar = () =>{

    this.pares.forEach(par => {
      par.setX(par.getX() - deslocamento)


      if(par.getX() < -par.getLargura()){
          par.setX(par.getX()+ espaço * this.pares.length)
          par.sortearAbertura()
      }
      const meio = largura / 2
      const cruzouOmeio = par.getX() + deslocamento >= meio && par.getX() < meio
      cruzouOmeio && notificarPonto()
    })
  }
}
  function Passaro(alturaJogo){
    let voando = false
    this.e = novoElemento('img','passaro')
    this.e.src = 'imgs/passaro.png'

    this.getY= () => parseInt(this.e.style.bottom.split('px')[0])
    this.setY = y => this.e.style.bottom = `${y}px`
    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false
  
  
    this.animar = () =>{
      const novoY = this.getY() + (voando ? 8 : -5)
      const alturaMaxima = alturaJogo + this.e.clientHeight

      if(novoY <= 0){
        this.setY(0)
      }else if(novoY >= alturaMaxima){
        this.setY(alturaMaxima)
      }else {
        this.setY(novoY)  
      }

    }
    this.setY(alturaJogo / 2)
  }







function Progresso() {
this.e = novoElemento('span','progresso')
this.atualizarPontos = pontos => {
  this.e.innerHTML = pontos
}
this.atualizarPontos(0)
}


function estaoSobrepostos(elementoA,elementoB){
  const a = elementoA.getBoundingClientRect()
  const b = elementoB.getBoundingClientRect()

  const horizontal = a.left + a.width >= b.left &&  b.left + b.width >= a.left
  const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top;

  return horizontal && vertical

}
function colidiu(passaro,barreiras){
  let colidiu = false
  barreiras.pares.forEach(parDeBarreiras => {
    if(!colidiu){
      const superior = parDeBarreiras.superior.e
      const inferior = parDeBarreiras.inferior.e
      colidiu = estaoSobrepostos(passaro.e,superior) || estaoSobrepostos(passaro.e, inferior)
    }
  })

  return colidiu
}

function Flaybird(){
    let pontos = 0

    const areaDojogo = document.querySelector('[wm-flappy]')
    const altura = areaDojogo.clientHeight
    const largura = areaDojogo.clientWidth

    const progresso = new Progresso()
    const barreiras = new Barreiras(altura,largura, 200,400, ()=> progresso.atualizarPontos(++pontos))
    const passaro = new Passaro(altura)

    areaDojogo.appendChild(progresso.e)
    areaDojogo.appendChild(passaro.e)
    barreiras.pares.forEach(par => areaDojogo.appendChild(par.e))




    this.start = ()=>{
        const temporizador = setInterval(() =>{
          barreiras.animar()  
          passaro.animar()
          if(colidiu(passaro, barreiras)){
              clearInterval(temporizador)
          }
        },20)
    }
}

new Flaybird().start()