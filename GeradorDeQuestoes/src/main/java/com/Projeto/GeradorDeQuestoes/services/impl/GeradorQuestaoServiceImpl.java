package com.Projeto.GeradorDeQuestoes.services.impl;

import com.Projeto.GeradorDeQuestoes.dto.GerarQuestaoRequest;
import com.Projeto.GeradorDeQuestoes.dto.ListaQuestoes;
import com.Projeto.GeradorDeQuestoes.services.GeradorQuestaoService;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GeradorQuestaoServiceImpl implements GeradorQuestaoService {

    private final ChatClient chatClient;
    private final VectorStore vectorStore;

    public GeradorQuestaoServiceImpl(ChatClient.Builder chatClientBuilder, VectorStore vectorStore) {
        this.chatClient = chatClientBuilder.build();
        this.vectorStore = vectorStore;
    }

    @Override
    public ListaQuestoes gerarQuestoes(GerarQuestaoRequest request) {
        System.out.println("SERVICE: Gerando " + request.quantidade() 
                         + " questões sobre: " + request.topico());

        List<Document> documentosRelevantes = this.vectorStore.similaritySearch(request.topico());

        String contexto = documentosRelevantes.stream()
                .map(Document::getText)
                .collect(Collectors.joining("\n---\n"));


            String promptTemplate = """
            Você é um assistente especialista em criar provas de Redes de Computadores.
            Seu trabalho é gerar {quantidade} questões de múltipla escolha sobre o tópico de {topico}.

            Use **EXCLUSIVAMENTE** o contexto abaixo para formular as questões.
            Se o contexto não for suficiente, informe que não pode gerar as questões.

            Sua resposta DEVE ser um objeto JSON válido, e nada mais (sem texto introdutório).
            O JSON deve ter uma única chave "questoes", que é uma lista.
            Cada item na lista (cada questão) deve ter a seguinte estrutura: 

            \\{
            "enunciado": "O enunciado da questão aqui",
            "alternativas": \\{ "a": "Texto da alternativa A", "b": "Texto da alternativa B", "c": "Texto da alternativa C", "d": "Texto da alternativa D" \\},
            "respostaCorreta": "a" (ou "b", "c", "d")
            \\}

            Contexto:
            {contexto}
            """;

        PromptTemplate template = new PromptTemplate(promptTemplate);
        Prompt prompt = template.create(Map.of(
                "topico", request.topico(),
                "quantidade", request.quantidade(),
                "contexto", contexto
        ));

        return this.chatClient.prompt(prompt)
                .call()
                .entity(ListaQuestoes.class);
    }
}