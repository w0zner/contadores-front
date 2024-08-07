import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  public headers: HttpHeaders= new HttpHeaders;

  constructor(private localStorageService: LocalStorageService) {
    this.setHeaders();
   }

   private setHeaders() {
    const token = this.localStorageService.getItem('token', false);
    if (token) {
      this.headers = new HttpHeaders({
        'x-token': `${token}`
      });
    }
  }

  public updateHeaders() {
    const token = this.localStorageService.getItem('token', false);
    if (token) {
      this.headers = new HttpHeaders({
        'x-token': `${token}`
      });
    }
  }

}
