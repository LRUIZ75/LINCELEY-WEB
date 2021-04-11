import { catchError } from 'rxjs/internal/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { NewLineKind } from 'typescript';

export interface Company {
  fullName: string;
  shortName: string;
  isActive: boolean;
  location: {
    lat: number;
    lng: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  public endpoint: string;

  constructor(private http: HttpClient) {
    this.endpoint = environment.apiURL + 'company/';
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

  private extractData(res: Response): any {
    const body = res;
    return body || {};
  }

  /**
   * Adds new user by API
   * @param  {any} body -New data for user
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

  updateData(id: string, body: any): Observable<any> {
    return this.http
      .put(this.endpoint + id, body)
      .pipe(map(this.extractData), catchError(this.handleError));
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
