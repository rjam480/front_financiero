import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Asegúrate de importar HttpClient
import { Config } from 'src/app/config'; // Ruta correcta a tu Config
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators'; // Asegúrate de importar tap
import { JwtHelperService } from '@auth0/angular-jwt';

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

  constructor(private httpClient: HttpClient, private config: Config, public jwtHelper: JwtHelperService) {
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
    window.sessionStorage.clear();
    window.localStorage.clear();
    this.authSubject.next(false);
    //window.location.reload();


  }

  isLoggedIn() {
    return this.authSubject.asObservable();
  }
  public isAuthenticated(): boolean {
    const token = window.sessionStorage.getItem("ACCESS_TOKEN");
    let expirationTime = window.sessionStorage.getItem("EXPIRES_IN");

    // Validar la existencia del token
    if (!token) {
        return false; // No hay token
    }

    // Validar la existencia del tiempo de expiración
    if (!expirationTime) {
        return false; // No hay tiempo de expiración
    }

    // Comprobar si el token ha expirado
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
