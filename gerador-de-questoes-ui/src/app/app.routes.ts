import { Routes } from '@angular/router';
import { GeradorProva } from './pages/gerador-prova/gerador-prova';
import { Dashboard } from './components/dashboard/dashboard';
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
  }
];
