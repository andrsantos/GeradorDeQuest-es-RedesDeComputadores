import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prova } from '../../models/prova.model';
import { GerarQuestaoRequest } from '../../models/gerar-questao-request.model';
import { ProvaInfo } from '../../models/prova-info.model';
import { ProvaSalva } from '../../models/prova-entity.model';

@Injectable({
  providedIn: 'root',
})
export class ProvaService {

  private readonly API_URL = 'http://localhost:8080/api/provas';
  private readonly API_URL_SALVAS = 'http://localhost:8080/api/provas-salvas';

  constructor(private http: HttpClient) {}

  criarProva(): Observable<Prova> {
    return this.http.post<Prova>(this.API_URL, {});
  }

  getProva(id: string): Observable<Prova> {
    return this.http.get<Prova>(`${this.API_URL}/${id}`);
  }

  adicionarQuestoes(id: string, request: GerarQuestaoRequest): Observable<Prova> {
    return this.http.post<Prova>(`${this.API_URL}/${id}/questoes`, request);
  }

  descartarQuestao(id: string, indice: number): Observable<Prova> {
    const params = new HttpParams().set('indice', indice.toString());
    return this.http.delete<Prova>(`${this.API_URL}/${id}/questoes`, { params });
  }

  finalizarProvaPdf(id: string): Observable<Blob> {
    return this.http.post(`${this.API_URL}/${id}/finalizar-pdf`, {}, {
      responseType: 'blob' 
    });
  }

  getProvasSalvas(): Observable<ProvaInfo[]> {
    return this.http.get<ProvaInfo[]>(this.API_URL_SALVAS);
  }

  getDetalheProva(id: string): Observable<ProvaSalva> {
    return this.http.get<ProvaSalva>(`${this.API_URL_SALVAS}/${id}`);
  }

  deleteProva(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL_SALVAS}/${id}`);
  }

  downloadProvaSalvaPdf(id: string): Observable<Blob> {
    return this.http.get(`${this.API_URL_SALVAS}/${id}/download-pdf`, {
      responseType: 'blob' 
    });
  }
  
}
