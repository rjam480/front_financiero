import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Config } from 'src/app/config';


@Injectable({
  providedIn: 'root'
})
export class CrmApiService {
  public apiEndpoint = this.config.apiEndpoint;

  constructor(private http: HttpClient, private config: Config) {
   this.loadConfig();
  }

  loadConfig(): Promise<void> {
    return fetch('assets/config.json')
      .then(response => response.json())
      .then(config => {
        this.apiEndpoint =  this.apiEndpoint // Carga la URL desde config.json
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
    const url = `${this.apiEndpoint}/auth/login`;
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
    const token = window.sessionStorage.getItem("ACCESS_TOKEN"); // Obtener el token
    // Crear las cabeceras con el token Bearer
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const url = `${this.apiEndpoint}/consulta_financiero/${nit_prestador}`;
    return this.http.get(url, { headers }).pipe(
      catchError(err => {
        console.error('Error al realizar la solicitud:', err);
        return throwError(err);
      })
    );
  }


  recuperarPassword(data: any): Observable<any> {
    // Asegúrate de que apiEndpoint esté definido antes de realizar la solicitud
    if (!this.apiEndpoint) {
      return throwError('API endpoint no está definido.');
    }
    const url = `${this.apiEndpoint}/enviar-email`;
    return this.http.post(url,data).pipe(
      catchError(err => {
     //   console.error('Error al realizar la solicitud:', err);
        return throwError(err);
      })
    );
  }


  verificarToken(data: any): Observable<any> {
    // Asegúrate de que apiEndpoint esté definido antes de realizar la solicitud
    if (!this.apiEndpoint) {
      return throwError('API endpoint no está definido.');
    }
    const url = `${this.apiEndpoint}/recuperar-password`;
    return this.http.post(url,data).pipe(
      catchError(err => {
       // console.error('Error al realizar la solicitud:', err);
        return throwError(err);
      })
    );
  }

  obtenerPoliticas(): Observable<any> {
    const url = `${this.apiEndpoint}/politicas`;
    return this.http.get(url);
  }


  cerrarSesion(): Observable<any> {
    // Asegúrate de que apiEndpoint esté definido antes de realizar la solicitud
    if (!this.apiEndpoint) {
      return throwError('API endpoint no está definido.');
    }
    const url = `${this.apiEndpoint}/auth/logout`;
    const token = window.sessionStorage.getItem("ACCESS_TOKEN"); 
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    console.log(token);
    return this.http.post(url, {}, { headers }).pipe( // Pasa el objeto headers aquí en lugar del cuerpo
      catchError(err => {
        return throwError(err);
      })
    );
  }
  



}
