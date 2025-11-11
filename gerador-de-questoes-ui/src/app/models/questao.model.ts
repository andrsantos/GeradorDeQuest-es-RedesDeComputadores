export interface Questao {
    enunciado: string;
    alternativas: {[key:string]: string};
    respostaCorreta: string;
}