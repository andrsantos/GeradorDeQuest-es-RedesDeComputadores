import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prova } from '../../models/prova.model';
import { GerarQuestaoRequest } from '../../models/gerar-questao-request.model';

@Injectable({
  providedIn: 'root',
})
export class ProvaService {

  private readonly API_URL = 'http://localhost:8080/api/provas';

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
  
}
