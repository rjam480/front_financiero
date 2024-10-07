import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CrmApiService {
  private apiEndpoint: string = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {
   this.loadConfig();
  }

  loadConfig(): Promise<void> {
    return fetch('assets/config.json')
      .then(response => response.json())
      .then(config => {
        this.apiEndpoint = config.apiEndpoint; // Carga la URL desde config.json
      })
      .catch(error => {
        console.error('Error al cargar la configuración:', error);
        return Promise.reject('Error al cargar configuración');
      });
  }

  consultarSedesPorNITPrestador(nit_prestador: string): Observable<any> {
    // Asegúrate de que apiEndpoint esté definido antes de realizar la solicitud
    if (!this.apiEndpoint) {
      return throwError('API endpoint no está definido.');
    }
    const url = `${this.apiEndpoint}/ConsultarSedesPorNITPrestador?nit_prestador=${nit_prestador}`;
    return this.http.get(url).pipe(
      catchError(err => {
        console.error('Error al realizar la solicitud:', err);
        return throwError(err);
      })
    );
  }



  login(data: any): Observable<any> {
    // Asegúrate de que apiEndpoint esté definido antes de realizar la solicitud
    if (!this.apiEndpoint) {
      return throwError('API endpoint no está definido.');
    }
    const url = `${this.apiEndpoint}/ObtenerTokenAutenticacion`;
    return this.http.post(url,data).pipe(
      catchError(err => {
        console.error('Error al realizar la solicitud:', err);
        return throwError(err);
      })
    );
  }


  consultarData(nit_prestador: string): Observable<any> {
    // Asegúrate de que apiEndpoint esté definido antes de realizar la solicitud
    if (!this.apiEndpoint) {
      return throwError('API endpoint no está definido.');
    }
    const url = `${this.apiEndpoint}/consulta_financiero/${nit_prestador}`;
    return this.http.get(url).pipe(
      catchError(err => {
        console.error('Error al realizar la solicitud:', err);
        return throwError(err);
      })
    );
  }






}
