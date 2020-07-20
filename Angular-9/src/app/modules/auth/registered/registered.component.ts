import { Component, OnInit } from '@angular/core';
import { AuthModel } from 'src/app/core/models/auth.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-registered',
  templateUrl: './registered.component.html',
  styleUrls: ['./registered.component.scss']
})
export class RegisteredComponent implements OnInit {
  private notifier: NotifierService;
  registeredFormData: AuthModel = {
    email: null,
    password: null,
  }
  constructor(
    private authService: AuthService,
    private _activatedRoute: Router,
    notifier: NotifierService
  ) {
    this.notifier = notifier;
  }

  ngOnInit(): void {

  }

  registered(form: NgForm) {
    if (form.valid) {
      this.authService.registered(this.registeredFormData).subscribe(res => {
        this.notifier.notify("success", res.Message);
        setTimeout(() => {
          this._activatedRoute.navigateByUrl('/');
        }, 1000)
      }, error => {
        this.notifier.notify("error", error.error.Message);
      })
    }
  }



}
