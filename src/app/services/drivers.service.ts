import { catchError } from 'rxjs/internal/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

export interface Driver
{
  employee: string,
  isExternal: boolean,
  person: string,
  company: string,
  isActive: boolean,
  isAvailable: boolean,
  documents: {
    licenseCard: string,
    insuranceCard: string
  },
  documentsComparison: {
      licenseCard: string,
      insuranceCard: string,
      isOk: boolean
  }
}

@Injectable({
  providedIn: 'root'
})
export class DriversService {
  public endpoint: string;
  constructor(
    private http: HttpClient) {
    this.endpoint = environment.apiURL +  'driver/';
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
   * Adds new driver by API
   * @param  {any} body -New data for driver
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

  updatePicture(id: string, picture: any): Observable<any> {

    let formData: FormData = new FormData;
    formData.append('picture', picture as Blob);

    return this.http
      .put(this.endpoint + 'picture/' + id, formData)
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
