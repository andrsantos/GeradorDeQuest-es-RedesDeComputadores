package com.Projeto.GeradorDeQuestoes.services;

import com.Projeto.GeradorDeQuestoes.dto.GerarQuestaoRequest;
import com.Projeto.GeradorDeQuestoes.dto.ListaQuestoes;
import com.Projeto.GeradorDeQuestoes.dto.Prova;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GeradorProvaService {

   
    private static final Map<UUID, Prova> provasEmMemoria = new ConcurrentHashMap<>();

    private final GeradorQuestaoService questaoService;

    public GeradorProvaService(GeradorQuestaoService questaoService) {
        this.questaoService = questaoService;
    }

  
    public Prova criarNovaProva() {
        Prova novaProva = new Prova();
        provasEmMemoria.put(novaProva.getId(), novaProva);
        System.out.println("SERVICE: Nova prova criada. ID: " + novaProva.getId());
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

        System.out.println("SERVICE: Adicionadas " + novasQuestoes.questoes().size() 
                         + " questões à prova " + idProva);
        return prova;
    }

  
    public Prova descartarQuestao(UUID idProva, int indiceQuestao) {
        Prova prova = getProva(idProva);
        if (prova == null) {
            throw new RuntimeException("Prova não encontrada!");
        }

        System.out.println("SERVICE: Removendo questão índice " + indiceQuestao 
                         + " da prova " + idProva);
        prova.removerQuestao(indiceQuestao);
        return prova;
    }
}