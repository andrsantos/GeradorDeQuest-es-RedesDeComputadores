import { Component } from '@angular/core';
import { Prova } from '../../models/prova.model';
import { Observable } from 'rxjs/internal/Observable';
import { ProvaService } from '../../services/prova/prova-service';
import { GerarQuestaoRequest } from '../../models/gerar-questao-request.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gerador-prova',
  imports: [CommonModule, FormsModule],
  templateUrl: './gerador-prova.html',
  styleUrl: './gerador-prova.scss',
  standalone: true
})
export class GeradorProva {
  prova$: Observable<Prova> | null = null;
  provaId: string | null = null;
  topico: string = "Modelo OSI";
  quantidade: number = 5;
  isLoadingCriar = false;
  isLoadingAdicionar = false;
  isLoadingFinalizar = false;
  descartandoIndex: number | null = null;

  constructor(private provaService: ProvaService, private toastr: ToastrService) { }

  

  onCriarProva() {
      this.isLoadingCriar = true; 
      this.prova$ = this.provaService.criarProva();
      this.prova$.subscribe({
        next: p => {
          this.provaId = p.id;
          this.isLoadingCriar = false; 
        },
        error: () => this.isLoadingCriar = false 
      });
    }

  onAdicionarQuestoes() {
      if (!this.provaId) return;
      this.isLoadingAdicionar = true; 

      const request: GerarQuestaoRequest = {
        topico: this.topico,
        quantidade: this.quantidade
      };

      this.prova$ = this.provaService.adicionarQuestoes(this.provaId, request);
      this.prova$.subscribe({
        next: () => this.isLoadingAdicionar = false, 
        error: () => this.isLoadingAdicionar = false 
      });
    }

  onDescartarQuestao(indice: number) {
        if (!this.provaId) return;
        this.descartandoIndex = indice; 

        this.prova$ = this.provaService.descartarQuestao(this.provaId, indice);
        this.prova$.subscribe({
          next: () => this.descartandoIndex = null, 
          error: () => this.descartandoIndex = null 
        });
  
      }

  onFinalizarProva() {
    if (!this.provaId) {
      alert("Nenhuma prova ativa.");
      return;
    }
    this.isLoadingFinalizar = true;
    this.provaService.finalizarProvaPdf(this.provaId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `prova_${this.provaId}.pdf`; 
        
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        a.remove();

        this.prova$ = null;
        this.provaId = null;
        this.isLoadingFinalizar = false;
        this.toastr.success("Prova gerada com sucesso!", 'Sucesso!');
      },
      error: (err) => {
        console.error("Erro ao finalizar a prova:", err);
        alert("Falha ao gerar o PDF da prova.");
        this.isLoadingFinalizar = false;
      }
    });
  }

}
