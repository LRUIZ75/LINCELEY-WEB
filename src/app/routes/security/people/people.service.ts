import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  public baseURL: string;
  constructor(private clienteAPI: HttpClient) {
    this.baseURL = environment.apiURL + 'person/';
    console.log('Conectando a :' + this.baseURL);
  }

  /**
   * Adds new person by API
   * @param  {any} body -New data for person
   */
  addData(body: any) {
    return this.clienteAPI.post(this.baseURL, body);
  }

  getData() {
    return this.clienteAPI.get(this.baseURL);
  }

  getDataById(id: string) {
    return this.clienteAPI.get(this.baseURL + id);
  }

  getPicture(id: string) {
    return this.clienteAPI.get(this.baseURL + 'picture/' + id);
  }

  updateData(id: string, body: any) {
    return this.clienteAPI.put(this.baseURL + id, body);
  }

  updatePicture(id: string, picture: string) {
    return this.clienteAPI.put(this.baseURL + 'picture/' + id, picture);
  }

  deleteData(id: string) {
    //return this.clienteAPI.delete(this.baseURL + id);
  }

  deactivateData(id: string) {
    return this.clienteAPI.delete(this.baseURL + id);
  }
}
