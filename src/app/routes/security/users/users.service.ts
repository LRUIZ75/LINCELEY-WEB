import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  public baseURL: string;

  constructor(private clienteAPI: HttpClient) {
    this.baseURL = environment.apiURL + 'user/';
    console.log('Conectando a :' + this.baseURL);
  }
  /**
   * Adds new user by API
   * @param  {any} body -New data for user
   */
  addData(body: any){
    return this.clienteAPI.post(this.baseURL,body);
  }

  getData() {
    return this.clienteAPI.get(this.baseURL);
  }

  getDataById(id: string) {
    return this.clienteAPI.get(this.baseURL + id);
  }

  updateData(id: string, body: any) {
    return this.clienteAPI.put(this.baseURL + id, body);
  }

  deleteData(id: string) {
    //return this.clienteAPI.delete(this.baseURL + id);
  }

  deactivateData(id: string){
    return this.clienteAPI.delete(this.baseURL + id);
  }
  
}
