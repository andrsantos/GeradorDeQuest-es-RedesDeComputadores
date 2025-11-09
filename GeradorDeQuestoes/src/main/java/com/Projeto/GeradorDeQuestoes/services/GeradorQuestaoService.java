package com.Projeto.GeradorDeQuestoes.services;

import com.Projeto.GeradorDeQuestoes.dto.GerarQuestaoRequest;
import com.Projeto.GeradorDeQuestoes.dto.ListaQuestoes;

public interface GeradorQuestaoService {
    ListaQuestoes gerarQuestoes(GerarQuestaoRequest request);
}