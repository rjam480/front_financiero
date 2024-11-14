import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Asegúrate de importar HttpClient
import { Config } from 'src/app/config'; // Ruta correcta a tu Config
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators'; // Asegúrate de importar tap
import { JwtHelperService } from '@auth0/angular-jwt';
import { CrmApiService } from '../crm-api.service';

interface AuthResponse {
  return: boolean;
  // Otros campos que esperas en la respuesta
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  AUTH_SERVER_ADDRESS: string; // Inicializar en el constructor
  authSubject = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient, private config: Config, public jwtHelper: JwtHelperService, private crmApiService: CrmApiService) {
    this.AUTH_SERVER_ADDRESS = this.config.apiEndpoint; // Inicializa aquí
  }

  login(data: any): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.AUTH_SERVER_ADDRESS}/auth/login`, data).pipe(
      tap(res => {
        if (res && res.return) {
          this.authSubject.next(true);
        } else {
          this.authSubject.next(false); // Opcional: si la respuesta no es válida
        }
      })
    );
  }

  async logout() {
    this.crmApiService.cerrarSesion().subscribe(
      () => {
        window.sessionStorage.clear();
        window.localStorage.clear();
        this.authSubject.next(false);
      },
      (error) => {
        console.error('Error al cerrar sesión:', error);
      }
    );
  }

  isLoggedIn() {
    return this.authSubject.asObservable();
  }
  public isAuthenticated(): boolean {
    const token = window.sessionStorage.getItem("ACCESS_TOKEN");
    let expirationTime = window.sessionStorage.getItem("EXPIRES_IN");
    if (!token) {
      return false;
    }
    if (!expirationTime) {
      return false;
    }
    const currentTime = Date.now();
    if (currentTime > parseInt(expirationTime, 10)) {
      // El token ha expirado
      this.logout(); // Opcional: cerrar sesión
      return false;
    }
    return true; // Token válido y no ha expirado
  }


  private isValidSanctumToken(token: string | null): boolean {
    if (!token) return false; // Si no hay token, no está autenticado

    // Comprueba que el token tenga dos partes
    const parts = token.split('|');
    return parts.length === 2; // Debe tener exactamente dos partes
  }
}
