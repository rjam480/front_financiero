import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CrmApiService } from '../crm-api.service';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Config } from 'src/app/config';
import * as CryptoJS from 'crypto-js'
declare var bootstrap: any; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] // Si estás usando SCSS
})
export class LoginComponent {
  public username: string;
  password: string;
  errorMessage: string;
  public sedes: any = [];
  public isPrimerPaso: boolean;
  public selectedSede: any;
  //public prestador;

  constructor(private authService: AuthService,
    private crmApiService: CrmApiService,
    private config: Config,
    private router: Router,

  ) {
    this.username = '';
    this.password = '';
    this.errorMessage = '';
    this.isPrimerPaso = true;
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      // Lógica para manejar el inicio de sesión
      console.log('Usuario:', this.username);
      console.log('Contraseña:', this.password);
    } else {
      this.errorMessage = 'Por favor, complete todos los campos requeridos.';
    }
  }


  async ConsultarSedesPorNIT(form: NgForm) {
    const mensaje = "Consultando prestador...";
    this.showLoading(mensaje);
    console.log(mensaje);
    if (form.valid) {
      this.crmApiService.consultarSedesPorNITPrestador(form.value.nit).subscribe(
        async (res) => {
          console.log(res);
          if (res != null) {
            window.localStorage.setItem("SEDES_PRESTADOR", JSON.stringify(res));
            this.isPrimerPaso = false;
            this.sedes = JSON.parse(window.localStorage.getItem("SEDES_PRESTADOR") || '[]');
            this.closeLoading();// Manejo seguro en caso de que no haya datos
          } else {
            this.closeLoading();
            this.showError("", "Prestador no encontrado");

          }
          // Aquí puedes cerrar un loader si lo tenías abierto
        },
        async (err) => {
          alert("Prestador no encontrado");
          console.error('Error:', err); // Muestra el error en la consola
          // Aquí también puedes cerrar un loader si lo tenías abierto
        }
      );
    } else {
      this.errorMessage = 'Por favor, complete todos los campos requeridos.';
    }
  }


  async login(form: NgForm) {
    //form.TipoUsuario.setValue("Interno");
    const mensaje = "Iniciando sesión...";
    const loginData = {
      password: form.controls['Password'].value, // Obtiene la contraseña
      nit: form.controls['nit'].value,
      acepta_terminos: form.controls['politicas'].value
    };
    this.showLoading(mensaje);

    this.authService.login(loginData).subscribe(
      async (res:any) => {
        console.log(res);
        if (res.access_token	 == "") {
          //   await this.loading.dismiss(); 
          this.showError("", "Contraseña o usuario inválidos");
        }
        else {
          const expirationDurationInSeconds = 180; // Por ejemplo, 3 minutos
          const expirationTime = Date.now() + expirationDurationInSeconds * 1000; 
          window.sessionStorage.setItem("ACCESS_TOKEN", res.access_token	);
          window.sessionStorage.setItem("EXPIRES_IN", expirationTime.toString()); //Expira cada 3 minutos
          window.sessionStorage.setItem("PRESTADOR", form.controls['nit'].value);
          window.localStorage.setItem("MSG", res.msg	);
          window.localStorage.setItem("ROL", this.encryptData(res.data.is_admin)	);
          this.closeLoading();
          this.router.navigate(['/informeGeneral']); 
          /*
        await this.loading.dismiss();
      
        this.isPrimerPaso = true;
        this.menuCtrl.enable(true);
     
        */
        }
      },
      async (err) => {
        // await this.loading.dismiss(); 
        this.closeLoading();
        this.showError("", err.error.msg);
        console.log();
      }
    );

  }



  private showSuccess(title: string, text: string) {
    Swal.fire({
      icon: 'success',
      title: title,
      text: text
    });
  }

  private showLoading(mensaje: any) {
    Swal.fire({
      title: mensaje,
      text: 'Por favor espera...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null); // Mostrar el loading cuando se abre la alerta
      }
    });
  }

  private showError(title: string, text: string) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: text
    });
  }


  private closeLoading() {
    Swal.close();
  }


  public encryptData(data: number): string {
    // Convertir el número a una cadena
    const numberData = data.toString();
    // Convertir la clave a un objeto WordArray
    const key = CryptoJS.enc.Hex.parse(CryptoJS.SHA256(this.config.secretKey).toString());
  
    // Encriptar el valor usando AES y la clave
    const encrypted = CryptoJS.AES.encrypt(numberData, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
  
    // Devolver el valor encriptado como string en Base64
    return encrypted.toString();
  }

  openModal(event: MouseEvent) {
    event.preventDefault(); // Evitar la acción predeterminada del enlace
    const modalElement = document.getElementById('staticBackdrop');
    if (modalElement) {
      const modal =  new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  
}
