import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './landing.component.html'
})
export class LandingComponent {

  chatbotsList: any = [];
  constructor(private dataService: DataService,
    private router: Router,
    private toast: ToastrService
  ) {
  }

  ngOnInit() {
    this.getChatbotData();
  }

  getChatbotData() {
    this.dataService.getChatbotData().then((resp: any) => {
      if (resp.statusCode == 200) {
        this.chatbotsList = resp.chatbotsData;
      } else {
        this.toast.error(resp.message);
      }
    }, (err) => {
      this.toast.error(err.message);
    })
  }
}
