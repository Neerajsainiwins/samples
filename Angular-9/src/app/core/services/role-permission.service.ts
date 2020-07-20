import { Injectable } from '@angular/core';
import { BaseUrl } from '../../config/url-config'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RolePermissionService {

  api = BaseUrl.baseApiUrl;
  constructor(private http: HttpClient) { }


  addUserRole(data): Observable<any> {
    return this.http.post<any>(this.api + 'RoleAPI/AddRole', data);
  }
  
  GetAllRoles(data): Observable<any> {
    return this.http.post<any>(this.api + 'RoleAPI/GetAllRoles', data);
  }

  UpdateRole(data): Observable<any> {
    return this.http.post<any>(this.api + 'RoleAPI/UpdateRole', data);
  }

  DeleteRole(data): Observable<any> {
    return this.http.post<any>(this.api + 'RoleAPI/DeleteRole', data);
  }

}
