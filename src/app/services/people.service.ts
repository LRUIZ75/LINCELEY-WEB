import { catchError } from 'rxjs/internal/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

export interface Person {
    _id: string,
    names: string,
    lastNames: string,
    citizenId: string,
    picture: any,
    phone: string,
    mobile: string,
    birthdate: string,
    homeAddress: string,
    isUser: boolean,
    isEmployee: boolean,
    isClient: boolean
}

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  public endpoint: string;
  constructor(
    private http: HttpClient) {
    this.endpoint = environment.apiURL + 'person/';
    console.log('Conectando a :' + this.endpoint);
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Ocurrió un error:', error.status, error.error.message);
    } else {
      console.error(
        `El backend devolvió =>
    ${error.message}`
      );
      console.debug(JSON.stringify(error.error));
    }
    return throwError(`${error.status} ` + JSON.stringify(error.error));
  }

  private extractData(res: HttpResponse<any>): any {
    const body = res;
    return body || {};
  }

  /**
   * Adds new person by API
   * @param  {any} body -New data for person
   */
  addData(body: any): Observable<any> {
    return this.http
      .post(this.endpoint, body)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  getData(): Observable<any> {
    return this.http.get(this.endpoint).pipe(map(this.extractData), catchError(this.handleError));
  }

  getDataById(id: string): Observable<any> {
    return this.http
      .get(this.endpoint + id)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  getPicture(id: string): Observable<any> {
    return this.http
      .get(this.endpoint + 'picture/' + id)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  updateData(id: string, body: any): Observable<any> {
    return this.http
      .put(this.endpoint + id, body)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  updatePicture(id: string, picture: File): Observable<any> {
    let formData: FormData = new FormData();
    formData.append('picture', picture);
    const req = new HttpRequest('PUT', `${this.endpoint}picture/${id}`, formData, {
      reportProgress: true,
      responseType: 'json',
    });
    return this.http.request(req).pipe(map(this.extractData), catchError(this.handleError));
  }

  deleteData(id: string): Observable<any> {
    return this.http
      .delete(this.endpoint + id)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  deactivateData(id: string): Observable<any> {
    return this.http
      .delete(this.endpoint + id)
      .pipe(map(this.extractData), catchError(this.handleError));
  }
}
