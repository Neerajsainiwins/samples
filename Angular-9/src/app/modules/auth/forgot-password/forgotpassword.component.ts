import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthModel } from 'src/app/core/models/auth.model';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Location } from '@angular/common';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';


@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  private notifier: NotifierService;
  emailSent: boolean = true;
  resetPassword: boolean = false;


  resetFormData: AuthModel = {
    email: null,
    password: null,
    token: null
  }
  data = {
    confirmpassword: null
  }
  pageLocation: any;
  path: any;

  constructor(private authService: AuthService,
    private route: ActivatedRoute,
    notifier: NotifierService,
    private location: Location,
    private localStorageService: LocalStorageService
  ) {
    this.notifier = notifier;
  }


  sendForgotPasswordEmail(form: NgForm) {
    debugger;
    if (form.valid) {
      let query = {
        email: this.resetFormData.email,
        url: this.pageLocation
      }
      this.authService.sendForgotPasswordEmail(query).subscribe(response => {
        this.notifier.notify("success", response.Message);
      },
        error => {
          this.notifier.notify("error", error.error.Message);
        })
    }
  }

  ngOnInit(): void {
    this.path = "/reset-password";
    this.pageLocation = window.location.origin + this.path;

  }

}
