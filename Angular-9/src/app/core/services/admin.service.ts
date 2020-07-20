import { Injectable } from '@angular/core';
import { BaseUrl } from '../../config/url-config'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  api = BaseUrl.baseApiUrl;
  constructor(private http: HttpClient,
    private _localStorageService: LocalStorageService) { }

  addProfile(data): Observable<any> {
    return this.http.post<any>(this.api + 'AuthAPI/UpdateProfile', data);
  }

}

