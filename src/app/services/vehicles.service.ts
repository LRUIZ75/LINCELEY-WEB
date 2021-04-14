import { catchError } from 'rxjs/internal/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';



export enum VehicleType {
  AUTO = 'AUTO',
  MOTO = 'MOTO',
  PICKUPTRUCK = 'PICKUP',
  TRUCK = 'TRUCK',
}

export interface Vehicle {
  _id: string,
  plateNumber: string,
  vehicleType: VehicleType | string,
  brand: string,
  model: string,
  year: number,
  color: string,
  isExternal: boolean
  company: string,
  isActive: boolean,
  isAvailable: boolean,
  registrationCard: string,
  insuranceCard: string,
  owner: string

}

@Injectable({
  providedIn: 'root'
})
export class VehiclesService {
  public endpoint: string;
  constructor(private http: HttpClient) {
    this.endpoint = environment.apiURL + 'vehicle/';
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


  /**
   * Update pictures into fields insuranceCard or registrationCard
   * @param fieldname insuranceCard | registrationCard
   * @param id Vehicle OID
   * @param picture File
   * @returns response or error
   */
  updatePicture(fieldname: string, id: string,  picture: File): Observable<any> {
    let formData: FormData = new FormData();
    formData.append('picture', picture);
    const req = new HttpRequest('PUT', `${this.endpoint}${fieldname}/${id}`, formData, {
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
