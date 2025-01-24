import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appSettings } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  apiUrl = appSettings.apiUrl

  constructor(
    private http: HttpClient
  ) { }

  public get(endpoint: string, params: string|number = '') {
    return this.http.get<any>(this.apiUrl+endpoint+params)
  }

  public post(endpoint: string, params: string|number, payload: any) {
    return this.http.post<any>(this.apiUrl+endpoint+params, payload)
  }

  public delete(endpoint: string, params: string|number) {
    return this.http.delete<any>(this.apiUrl+endpoint+params)
  }

  public download(endpoint: string, params: string|number = '',) {
   return this.http.get(this.apiUrl+endpoint+params, { responseType: 'blob' })
  }

  public fetchAssets(endpoint: string) {
    return this.http.get<any>('./assets/' + endpoint)
  }
}
