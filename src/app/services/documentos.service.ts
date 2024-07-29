import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  constructor(private http: HttpClient) { }

  getToken():string {
    return localStorage.getItem('token') || ''
  }

  getheaders() {
    return {
      headers: { 'x-token': this.getToken() }
    }
  }



}
