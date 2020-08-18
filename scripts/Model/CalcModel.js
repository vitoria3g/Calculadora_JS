class Model {
/*get e set serão os CONTROLADORES desses dados 
-> get (pega algum dado)
-> set (envia algum dado)
-> (quando chamar de fora usar eles)
-> apricar regras aqui
ex: 
    obj_calc.displayCalc; - CORRETO
    obj_calc._displayCalc; - ERRADO (nunca chamar os atributos privados diretamente)
*/
get displayCalc(){ 
    return this._DisplayEl.innerHTML;
}

set displayCalc(valor){

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

get FormataDataHora(){ //inserindo o obj data (formatado) no html

    this.DisplayDate = this.DataHora.toLocaleDateString(this._Locale);
    this.DisplayTime = this.DataHora.toLocaleTimeString(this._Locale);

}
}