import { Injectable } from '@angular/core';
import { BaseUrl } from '../../config/url-config'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  api = BaseUrl.baseApiUrl;
  constructor(private http: HttpClient,
    private _localStorageService: LocalStorageService) { }

  registered(data): Observable<any> {
    return this.http.post<any>(this.api + 'AuthAPI/Register', data);
  }

  login(data) {
    return this.http.post<any>(this.api + 'AuthAPI/Login', data);
  }

  sendForgotPasswordEmail(data): Observable<any> {
    return this.http.post<any>(this.api + 'AuthAPI/SetResetPasswordToken', data);
  }

  verifyEmailToken(data): Observable<any> {
    return this.http.post<any>(this.api + 'AuthAPI/ValidateResetPasswordToken', data);
  }
  resetPassword(data): Observable<any> {
    return this.http.post<any>(this.api + 'AuthAPI/ChangePassword', data);
  }

}

