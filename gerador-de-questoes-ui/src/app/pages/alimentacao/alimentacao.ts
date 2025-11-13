import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AlimentacaoService } from '../../services/alimentacao/alimentacao-service';

@Component({
  selector: 'app-alimentacao',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './alimentacao.html',
  styleUrls: ['./alimentacao.scss']
})
export class Alimentacao {

  public arquivo: File | null = null;
  public topico: string = 'Redes TCP/IP'; 
  public isHovering = false;
  public uploadProgress: number | null = null;
  public isProcessing = false; 

  constructor(
    private alimentacaoService: AlimentacaoService,
    private toastr: ToastrService
  ) {}

  onFileSelected(event: any): void {
    const file = event.target?.files?.[0];
    if (file && file.type === 'application/pdf') {
      this.arquivo = file;
    } else if (file) {
      this.toastr.error('Por favor, selecione apenas arquivos PDF.', 'Formato Inválido');
    }
    this.isHovering = false;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isHovering = true;
  }
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isHovering = false;
  }
  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file && file.type === 'application/pdf') {
      this.arquivo = file;
    } else if (file) {
      this.toastr.error('Por favor, selecione apenas arquivos PDF.', 'Formato Inválido');
    }
    this.isHovering = false;
  }

  removerArquivo(): void {
    this.arquivo = null;
    this.uploadProgress = null;
    this.isProcessing = false;
  }

  iniciarUpload(): void {
    if (!this.arquivo) {
      this.toastr.warning('Nenhum arquivo selecionado.');
      return;
    }

    this.isProcessing = false; 
    this.uploadProgress = 0; 

    this.alimentacaoService.uploadPdf(this.arquivo, this.topico).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * (event.loaded / (event.total || 1)));
        
        } else if (event.type === HttpEventType.ResponseHeader) {
          if (event.status === 200) {
            this.isProcessing = true; 
          }

        } else if (event.type === HttpEventType.Response) {
          this.isProcessing = false;
          this.uploadProgress = 100;
          this.toastr.success(event.body, 'Sucesso!');
          this.arquivo = null; 
        }
      },
      error: (err) => {
        console.error(err);
        this.toastr.error(err.error || 'Falha no upload.', 'Erro');
        this.uploadProgress = null;
        this.isProcessing = false;
      }
    });
  }
}