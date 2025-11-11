package com.Projeto.GeradorDeQuestoes.services;

import com.Projeto.GeradorDeQuestoes.dto.GerarQuestaoRequest;
import com.Projeto.GeradorDeQuestoes.dto.ListaQuestoes;
import com.Projeto.GeradorDeQuestoes.dto.Prova;
import com.Projeto.GeradorDeQuestoes.dto.Questao;
import com.Projeto.GeradorDeQuestoes.entities.ProvaEntity;
import com.Projeto.GeradorDeQuestoes.entities.QuestaoProvaEntity;
import com.Projeto.GeradorDeQuestoes.repositories.ProvaRepository;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GeradorProvaService {

    private static final Map<UUID, Prova> provasEmMemoria = new ConcurrentHashMap<>();
    private final GeradorQuestaoService questaoService;
    private final ProvaRepository provaRepository;
    private final PdfService pdfService;

    public GeradorProvaService(GeradorQuestaoService questaoService, 
    ProvaRepository provaRepository, 
    PdfService pdfService
    ) {
        this.questaoService = questaoService;
        this.provaRepository = provaRepository;
        this.pdfService = pdfService;
    }

  
    public Prova criarNovaProva() {
        Prova novaProva = new Prova();
        provasEmMemoria.put(novaProva.getId(), novaProva);
        return novaProva;
    }


    public Prova getProva(UUID id) {
        return provasEmMemoria.get(id);
    }

  
    public Prova adicionarQuestoes(UUID idProva, GerarQuestaoRequest request) {
        Prova prova = getProva(idProva);
        if (prova == null) {
            throw new RuntimeException("Prova não encontrada!"); 
        }

        ListaQuestoes novasQuestoes = questaoService.gerarQuestoes(request);

        novasQuestoes.questoes().forEach(prova::adicionarQuestao);

        return prova;
    }

  
    public Prova descartarQuestao(UUID idProva, int indiceQuestao) {
        Prova prova = getProva(idProva);
        if (prova == null) {
            throw new RuntimeException("Prova não encontrada!");
        }
        prova.removerQuestao(indiceQuestao);
        return prova;
    }

    public byte[] finalizarEGerarPdf(UUID idProva) throws IOException {
        Prova provaEmMemoria = getProva(idProva);
        if (provaEmMemoria == null) {
            throw new RuntimeException("Prova não encontrada!");
        }

        ProvaEntity provaEntity = new ProvaEntity();
        provaEntity.setId(provaEmMemoria.getId());
        provaEntity.setDataCriacao(OffsetDateTime.now());
        provaEntity.setTitulo("Prova de Redes - " + provaEmMemoria.getId().toString().substring(0, 8));

        for (Questao questaoDto : provaEmMemoria.getQuestoes()) {
            QuestaoProvaEntity questaoEntity = new QuestaoProvaEntity();
            questaoEntity.setEnunciado(questaoDto.enunciado());
            questaoEntity.setAlternativas(questaoDto.alternativas());
            questaoEntity.setRespostaCorreta(questaoDto.respostaCorreta());
            
            provaEntity.addQuestao(questaoEntity); 
        }

        provaRepository.save(provaEntity);

        byte[] pdfBytes = pdfService.gerarPdfProva(provaEmMemoria);
        System.out.println("SERVICE: PDF gerado para prova " + idProva);

        provasEmMemoria.remove(idProva);
        System.out.println("SERVICE: Prova " + idProva + " removida da memória.");
        
        return pdfBytes;
    }
}