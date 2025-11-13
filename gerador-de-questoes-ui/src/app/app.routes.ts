import { Routes } from '@angular/router';
import { GeradorProva } from './pages/gerador-prova/gerador-prova';
import { Dashboard } from './components/dashboard/dashboard';
import { ProvasSalvas } from './pages/provas-salvas/provas-salvas';
import { DetalheProva } from './pages/detalhe-prova/detalhe-prova';
import { Alimentacao } from './pages/alimentacao/alimentacao';

export const routes: Routes = [
   {
    path: '', 
    component: Dashboard,
    title: 'Início - Gerador de Provas'
  },
  {
    
    path: 'gerar-prova', 
    component: GeradorProva,
    title: 'Gerar Nova Prova'
  },
  {
    path: 'provas-salvas',
    component: ProvasSalvas,
    title: 'Provas Salvas'
  },
  {
    path: 'provas-salvas/:id', 
    component: DetalheProva,
    title: 'Detalhe da Prova'
  },
  {
    path:'alimentacao',
    component: Alimentacao,
    title:'Alimentacao - RAG'
  }
];
