import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setItem(key: string, value: any, toJSON: boolean) {
    let val: any
    if(toJSON) {
      val = JSON.stringify(value)
    } else {
      val = value
    }
    localStorage.setItem(key, val);
  }

  getItem(key: string, ofJSON: boolean) {
    //return item ? JSON.parse(item) : null;
    const item= localStorage.getItem(key);

    if(item) {
      if(ofJSON){
        return JSON.parse(item)
      } else {
        return item
      }
    } else {
      return null
    }
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }

  clear(){
    localStorage.clear();
  }
}
