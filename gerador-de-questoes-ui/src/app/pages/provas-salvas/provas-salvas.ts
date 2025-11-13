import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Importe DatePipe
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ProvaInfo } from '../../models/prova-info.model';
import { ProvaService } from '../../services/prova/prova-service';
import { NotificationService } from '../../services/notification/notification-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-provas-salvas',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe], 
  templateUrl: './provas-salvas.html', 
  styleUrls: ['./provas-salvas.scss']    
})
export class ProvasSalvas implements OnInit {
  
  public provas$!: Observable<ProvaInfo[]>;

  constructor(private provaService: ProvaService,
              private notificationService: NotificationService,
              private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.showToastOnLoad();
    this.provas$ = this.provaService.getProvasSalvas();
  }

  private showToastOnLoad(): void {
    console.log("Chegou no toast");
    const message = this.notificationService.getAndClearMessage();
    console.log("Mensagem do toast:", message);
    if (message) {
      this.toastr.success(message, 'Sucesso!');
    }
  }

}