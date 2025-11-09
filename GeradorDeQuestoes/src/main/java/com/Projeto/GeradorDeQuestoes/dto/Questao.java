package com.Projeto.GeradorDeQuestoes.dto;
import java.util.Map;

public record Questao(
    String enunciado,
    Map<String, String> alternativas, 
    String respostaCorreta 
) {
}