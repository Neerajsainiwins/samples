import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  private notifier: NotifierService;

  constructor(private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    notifier: NotifierService, ) {
    this.notifier = notifier;
  }

  responsedata: any;

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParams.email
    this.token = this.route.snapshot.queryParams.token
    let query = {
      email: this.email,
      token: this.token
    }
    this.authService.verifyEmailToken(query).subscribe(
      response => {
        this.responsedata = response;
      },
      error => {
        if (error.error.Status == false) {
          this.router.navigateByUrl("auth/error");
        }
      })
  }

  email: string;
  token: string
  responseData: any;

  resetData = {
    // token: null,
    email:this.email,
    newPassword: null,
    username: null
  }

  data = {
    password: null
  }

  setPassword(form: NgForm) {
    debugger;
    if (form.valid) {
      // this.resetData.token = this.token;
      this.resetData.email =this.route.snapshot.queryParams.email ;

      this.authService.resetPassword(this.resetData).subscribe(
        response => {
          this.responseData = response.Data;
          this.notifier.notify("success", this.responseData.Message);
          this.router.navigateByUrl("/login");
        },
        error => {
          this.notifier.notify( "error", error.error.Message );
        })
    }
  }

}
