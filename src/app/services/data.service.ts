import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient
  ) { }

  public get(endpoint: string, params: string|number = '') {
    return this.http.get<any>(apiUrl+endpoint+params)
  }

  public post(endpoint: string, params: string|number, payload: any) {
    return this.http.post<any>(apiUrl+endpoint+params, payload)
  }

  public delete(endpoint: string, params: string|number) {
    return this.http.delete<any>(apiUrl+endpoint+params)
  }

  public download(endpoint: string, params: string|number = '',) {
   return this.http.get(apiUrl+endpoint+params, { responseType: 'blob' })
  }

  public fetchAssets(endpoint: string) {
    return this.http.get<any>('./assets/' + endpoint)
  }
}
