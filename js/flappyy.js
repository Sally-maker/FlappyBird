function NovoElemento(tagName, className){
  const elemento = document.createElement(tagName)
  elemento.className = className
  return elemento
}

function barreira(barreirReversa = false){
  this.element = novoElemento('div', 'barreir')

  const corpo = novoElemento('div', 'corpo')
  const borda = novoElemento('div', 'borda')
   
  this.element.appendChild(barreirReversa ? corpo : borda)
  this.element.appendChild(barreirReversa ? borda : corpo)

  this.setAltura = altura => corpo.style.height = `${altura}`
}

function ParDeBarreiras(altura,abertura,x){
   this.element = novoElemento('div', 'par-de-barreiras')

   this.superior = new Barreira(true)
   this.inferior = new Barreira(false)

  this.element.appendChild(this.superior.element)
  this.element.appendChild(this.inferior.element)

  this.SortearAbertura = () =>{
    const alturaSuperior = Math.random() * altura - abertura 
    const alturaInferior = altura - abertura - alturaSuperior
    this.superior.setAltura(alturaSuperior)
    this.inferior.setAltura(alturaInferior)
  }

  this.getX = () => parseInt(this.element.style.left.split('px')[0])
  this.setX = x => this.element.style.left = `${x}`
  this.getLargura = () => this.element.clientWidth
  
  this.SortearAbertura()
  this.setX(x)
}

function Barreiras(altura,largura,abertura, espaço, notificarPonto){
  this.pares = [
    new ParDeBarreiras(altura,largura,abertura),
    new ParDeBarreiras(altura,largura,abertura + espaço),
    new ParDeBarreiras(altura,largura,abertura + espaço * 2),
    new ParDeBarreiras(altura,largura,abertura + espaço * 3)
  ]
  const deslocamento = 3
  this.animar = () => {
    this.pares.forEach(par => {
      par.setX(par.getX() - deslocamento)


      if(par.setX() < -par.getLargura){
        par.setX(par.getX() + espaço * this.pares.length)
        par.SortearAbertura()
      }
      const meio = largura / 2
      const cruzouOmeio = par.getX() + deslocamento >= meio && par.getX() < meio
      cruzouOmeio && notificarPonto()
    })
  }
}

function Passaro(alturaJogo){
  let voando = false
  this.element = novoElemento('img', 'passaro')
  this.element.src = 'imgs/passaro.png'

  this.getY = () => parseInt(this.element.bottom.split('px')[0])
  this.setY = y => this.element.clientHeight = `${y}`
  window.onkeydown = e => voando = true
  window.onkeyup = e => voando = false

  this.animar = () =>{
    const Novoy = this.getY() * (voando? 8 : -5)
    const alturaMaxima = alturaJogo + this.element.clientHeight

    if(Novoy <= 0){
      this.setY(0)
    }else if(alturaMaxima){
      this.setY(alturaMaxima)
    }else{
      this.setY(Novoy)
    }
  }  
  this.setY(alturaJogo / 2)
}