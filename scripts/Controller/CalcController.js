class CalcController{ //Criando classe 

//criar o metodo construtor (ele é executado quando a classe é instanciada)
constructor(){  
    /*
    -> O "this" permitira que esses valores sejam acessados pela classe toda e não apenas nesse bloco (é como uma variavel)
    -> This faz referencia a atributos e metodos*/
    
    //a estrutura diz que é um atributo PRIVADO
    this._DisplayEl = document.querySelector('#display'); 
    this._DateEl = document.querySelector('#data');
    this._HoraEl = document.querySelector('#hora');
    this._Locale = 'pt-BR';  

    this._Operadores = [];
    this._DisplayEl.innerHTML = "0"; //o que aparecerá na telinha (display) da calculadora
    this._ultimoOperador = '';
    this._ultimoNumero = '';
    this.DataHora;

    this._audioOnOff = true; //audio está como true ou seja ligado
    this._audio = new Audio('click.mp3'); //criando uma instancia para audio e adicionado arquivo
    this.FormataDataHora(); //executa antes de 1s
    this.InityButtonsEvent(); //inicia os botões
    this.InityKeyBoard(); //inicia os eventos do teclado
    this.Inity(); //inicia a calculadora
    //this.addEventListenerAll();
}


//inicialização
Inity(){ 

setInterval( ()=>{ //execute isso por tanto tempo        

   this.FormataDataHora();//executa após 1s
   
 }, 1000); //em milesegundos

/*
setTimeout(()=>{ //execute isso após tanto tempo 

    console.log("5 min," + this.FormataDataHora());
},60000);*/

    this.pasteFromClipBoard(); //inicia o metodo colar

    //seleciona os botões 'ac' e adiciona um evento neles
    document.querySelectorAll('.btn-ac').forEach(btn=>{

        btn.addEventListener('dblclick', e=>{
            this.toggleAudio(); //metodo para ativar e desativar o audio
        });

    });


} 

InityButtonsEvent(){ //adicionando evento aos botões

let buttons = document.querySelectorAll("#buttons > g, #parts > g"); //selecionando TODOS os filhos ('g') de buttons e parts 

/*->seleciona os botões com o querySelectorAll
->Percore os botões e adiciona o evento em cada */

buttons.forEach((btn, index)=>{
   this.addEventListenerAll(btn,"click,drag", e => {

        let txtBtn = btn.className.baseVal.replace("btn-","");
        this.execBtn(txtBtn);

    });
    this.addEventListenerAll(btn, "mouseover,mouseup,mousedown", e=>{

        btn.style.cursor = "pointer"; //Trocando o cursor do mouser para a mãozinha

    });
});  
}

InityKeyBoard(){ //iniciando os eventos do teclado

    document.addEventListener('keyup', e=>{
        //keyup -> quando o usuário solta uma tecla (como na variavel 'windows' se tem varios atributos, como ctrlKey (se precionou ctrl) e etc)
        //O 'key' é o nome da tecla precionada pelo usuario

        //console.log(e.key);

        this.playAudio();
        switch(e.key)
        {

            case 'Backspace':
                this.clearEntry();
            break;
            case 'Escape': //esc
                this.clearAll();
            break;
            case '+':
            case '-':
            case '*':
            case '/':
            case '%':
                this.addOperation(e.key);
            break;
            case 'Enter':
            case '=':
                this.Calcula();
            break;
            case ',':
            case '.':
                this.addDot();
            
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(e.key));
            break;
            case 'c':
                if(e.ctrlKey){ //se o ctrl for apertado junto com 'c'
                    this.copyToClickBoard(); //metodo para copiar
                }
            break;
    

        }

    });
}

copyToClickBoard(){ //copiando para area de transferencia


    let input = document.createElement('input'); //criando um elemento input
    input.value = this.displayCalc; //armazena o que está no display
    document.body.appendChild(input); //adicionando um filho ao body

    input.select(); //selecionado o que tem no input
    document.execCommand('Copy'); //copiando o conteudo

    input.remove(); //removendo o input

}

pasteFromClipBoard(){ //colando algo da area de transferencia

    document.addEventListener('paste', e=>{ //usar o paste para colar

        let text = e.clipboardData.getData('Text'); //pegando um texto da area de transferencia e armazenando em uma variavel

        this.displayCalc = parseFloat(text); //convertendo o que o usuario colou e mostrando no display
        //console.log('texto selecionado '+text);
    });
}



//Criando metodo para adicionar os eventos 
addEventListenerAll(elemento,eventos,funcoes){

    eventos.split(',').forEach(event =>{

        elemento.addEventListener(event, funcoes,false);
    });
}

clearAll(){ //apaga toda a operação
    this._Operadores = [];
    this._ultimoNumero = ''; //apaga o valor da variavel
    this._ultimoOperador = ''; //apaga o valor da variavel
    this.setLastNumberToDisplay();
    //console.log('array ac: ' +this._Operadores);
}
clearEntry(){ //apaga a ultima coisa digitada após o sinal
    this._Operadores.pop(); //apaga o ultimo indice do array
    this.setLastNumberToDisplay();
    //console.log('array ce: ' +this._Operadores);
}
setError(){
    this.displayCalc = "ERROR";
}

getLastOperation(){ //"pegar o proximo operador seja numero ou sinal"

    return this._Operadores[this._Operadores.length - 1];//retornando o valor do ultimo valor pelo indice dele
}

isOperator(valor){ 
    //verificando qual o sinal escolhido pelo usuário
    if(['+','-','*','/','%'].indexOf(valor) > -1){
                                                  // '['+','-','*','/','%'].indexOf(valor)' vai percorer o array e verificar se o valor está ali dentro, 
                                                  //trazendo como resposta o indice dele. Caso o valor não seja encontrado ele retorna '-1'.

        return true;
    }
    else{
        return false;
    }

}
setLastNumber(valor){ //substituir o ultimo valor do ultimo indice do array

    this._Operadores[this._Operadores.length - 1] = valor;

}

pushOparator(valor){ //adiciona um novo item no array

    this._Operadores.push(valor);

    if (this._Operadores.length > 3){ //se o array tiver mais de 4 valores 

        this.Calcula(); //calcular os 2 ultimos valores digitados
        
    }
    
}

getResult(){ //calcula e retorna o resultado da conta

    try //tente fazer a conta
    { 
    return eval(this._Operadores.join("")); //o join funciona como o "toString" + acrescentador de algo no array. Nesse caso substituindo as virgulas por "";
                                                    /*OBSERVAÇÃO: 
                                                       -> No 'split' selecionamos onde queremos cortar algo (ex: split(',') que separará o conteudo a cada virgula encontrada)
                                                          Já no 'join' é possivel acrescentar algo nas separações do array (ex: acrscentar '1' entre os valores 2 e 3 do array
                                                          a = [2,3] -> a.join(1) -> a=[2,1,3])*/
    }
    //ao contrario daes outras linguagens o js não precisa instanciar o Exception
    catch(e) //se falhar a conta então
    {
        //console.log(this.setError());

        setTimeout(()=>{ //execute isso após tanto tempo 
            this.setError(); //para exibir o erro na tela do usuario
        }, 1);
        
        alert("Erro ao realizar a operação.");
        
    }
}

getLastItem(isOperator = true){ //para pegar o ultimo numero ou sinal do array

    let Item;

    for(let i = this._Operadores.length-1; i>=0; i--){ //do ultimo até o primeiro procurando por um número

        //if(!this.isOperator(this._Operadores[i])) //se não for um sinal (o '!' nega, é como o "se não for isso...")
        if(this.isOperator(this._Operadores[i]) == isOperator) //verdadeiro ou falso
        {

            Item = this._Operadores[i];
            break; //para o for

        }
    }

    if(!Item){
            //se isso for verdade então (?) faça isso se não (:) faça isso
        Item = (isOperator) ? this._ultimoOperador : this._ultimoNumero;
    }
    return Item;


}

Calcula(){

    let ultimoValorArray = '';
    this._ultimoOperador = this.getLastItem();

    if(this._Operadores.length < 3){

        let Nmr = this._Operadores[0];
        this._Operadores = [Nmr,this._ultimoOperador, this._ultimoNumero];

    }

    if(this._Operadores.length > 3){ //não deixa passar de 3 valores, vai calculando de 3 em 3
   
        ultimoValorArray = this._Operadores.pop(); //tira o ultimo valor e armazena em uma variavel
        
        this._ultimoNumero = this.getResult(); 
    }

    else if(this._Operadores.length == 3){
        this._ultimoNumero = this.getLastItem(false);
    }


    //console.log('ultimo resultado ' +this._ultimoNumero);
   // console.log('ultimo sinal ' +this._ultimoOperador);

    let resultado = this.getResult();

    if(ultimoValorArray == '%'){ //tratando a '%', pois apenas o '%' é tratado como modulo na matematica

        //resultado = resultado/100;
        resultado /=100; //isso aqui é a mesma coisa que o de cima 
        this._Operadores = [resultado]; //já substitui direto 
    }
    else{

        this._Operadores = [resultado]; //substitui os valores do array pelo calculo atual mais o ultimo operador

        if(ultimoValorArray){
            this._Operadores.push(ultimoValorArray);

        }

    }
    this.setLastNumberToDisplay();
}

setLastNumberToDisplay(){ //mostrando o ultimo número no display

   let NmrDisplay = this.getLastItem(false);

    if(!NmrDisplay){ //se estiver vazio então
        NmrDisplay = 0;
    }
    this.displayCalc = NmrDisplay;


}

addOperation(valor){ //adicionando valores ao array
    //console.log(this._Operadores[this._Operadores.length - 1]);

    //se o ULTIMO VALOR DO ARRAY não for número faça... ('isNaN' valida se NÃO É numero e retora true ou false)
    if (isNaN(this.getLastOperation())){ //Recebe uma string
        
        if(this.isOperator(valor)){
            //se for um operador (troca o operador pelo atual colocado pelo usuário)
            this.setLastNumber(valor); //substitui o ultimo operador ('+','-', etc) pelo atual
        }
        else if (isNaN(valor)){ //undefined, null, etc
            console.log('isNaN ' +valor);
        }
        else{

            this.pushOparator(valor);//adiciona um novo item no array 
            this.setLastNumberToDisplay();

        }

    }
    //se o ULTIMO VALOR DO ARRAY for número faça...
    else{ //Recebe um number

        if(this.isOperator(valor)) //verifica se é um sinal
        {
            this.pushOparator(valor); //adiciona um novo item no array
        }
        else{ //se não for concratena
            
        let novoValor = this.getLastOperation().toString() + valor.toString(); //pega o valor retornado de getLastOperation e concratena com o novo valor
        //transforma em string para ele não somar e sim juntar
        //console.log('novo valor: '+novoValor);                                                                           
        this.setLastNumber(novoValor);

        //atualiza display
            this.setLastNumberToDisplay();
        }



        

    }
    
    //console.log('array: ' +this._Operadores);
}

addDot(){

    let lastOperation = this.getLastOperation();

    //se o tipo dessa variavel for string e (dividiu os itens do array) procurando o ponto, a resposta for maior que -1 (ou seja achou um ponto)
    if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) //para se o usuário já tiver digitado um ponto
    {
        return //não faz nada apenas retorna
    }


    if(this.isOperator(lastOperation) || !lastOperation)
    { //verifica se é um operador ou se está vazio
        this.pushOparator('0.');
    }
    else
    {
        this.setLastNumber(lastOperation.toString() + '.');
    }

    this.setLastNumberToDisplay();



    console.log(lastOperation);
}

execBtn(valor){

this.playAudio(); //executa o audio quando as teclas são precionadas
switch (valor){

    case 'ac':
        this.clearAll(); // limpa todo o conteudo
    break;
    case 'ce':
        this.clearEntry(); //limpa o ultimo valor
    break;
    case 'soma':
        this.addOperation('+');
    break;

    case 'subtracao':
        this.addOperation('-');
    break;

    case 'multiplicacao':
        this.addOperation('*');
    break;

    case 'divisao':
        this.addOperation('/');
    break;

    case 'igual':
        this.Calcula();
    break;

    case 'porcento':
        this.addOperation('%');
    break;

    case 'ponto':
        this.addDot();
    break;

    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
        this.addOperation(parseInt(valor));
    break;

    default:
        this.setError();
    break;
}
}


toggleAudio(){ //verifica se o audio está ou não ligado

        //se isso for verdade então (?) faça isso se não (:) faça isso (IF ternario)
        //se for vdd então falso, se for falso então vdd
        this._audioOnOff = (this._audioOnOff) ? false : true;

        //Outro jeito de fazer a mesma coisa
        //this._audioOnOff = !this._audioOnOff //um recebe o inverso do outro

}

playAudio(){ //Toca o audio

    if(this._audioOnOff){ //se for true ou seja se for para tocar então...
        this._audio.currentTime = 0; //o som sempre iniciará do inicio, ou seja, a cada tecla ele zera e recomeça
        this._audio.play(); //executa o audio
    }
}

FormataDataHora(){ //inserindo o obj data (formatado) no html

    this.DisplayDate = this.DataHora.toLocaleDateString(this._Locale, {
    //formatando a data
    day: "2-digit",
    month: "short",
    year: "numeric"
    });
    this.DisplayTime = this.DataHora.toLocaleTimeString(this._Locale);

}

get displayCalc(){ 
    return this._DisplayEl.innerHTML;
}

set displayCalc(valor){

    //tranforma o valor em texto, vê a quantidade de caracter e executa
    if(valor.toString().length > 10){ //se o número de caracters do display for maior que 10 então exibe um erro na tela
        this.setError();
        alert("Limite de caracteres ultrapassados!");
        return //retorna vazio o metodo
    }
    this._DisplayEl.innerHTML = valor;
}

get DataHora(){ //metodo de instancia do obj Data do js

    return new Date();
}
set DataHora(dataHora){

    this.DataHora = dataHora;

}
get DisplayDate(){

    return this._DateEl.innerHTML;
}
set DisplayDate(data){
    this._DateEl.innerHTML = data;
}

get DisplayTime(){

    return this._HoraEl.innerHTML;
}
set DisplayTime(hora){
    this._HoraEl.innerHTML = hora;
}


}