import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CrmApiService } from '../crm-api.service'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] // Si estás usando SCSS
})
export class LoginComponent  {
  public username: string;
  password: string;
  errorMessage: string;
  public sedes: any = [];
  public isPrimerPaso: boolean;
  public selectedSede: any; 
  //public prestador;

  constructor(private crmApiService: CrmApiService) {
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
            this.showError("","Prestador no encontrado");

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


  async login(form:NgForm){
    //form.TipoUsuario.setValue("Interno");
    const mensaje = "Iniciando sesión...";
   
      const loginData = {
        Password: form.controls['Password'].value, // Obtiene la contraseña
        sedea: this.selectedSede // Asegúrate de que esta variable tenga el objeto completo
      };
      this.showLoading(mensaje);

    this.crmApiService.login(loginData).subscribe(
      async (res)=>{
        console.log(res);
        if(res == null){
       //   await this.loading.dismiss(); 
          this.showError("","Contraseña inválida");
        }
        else{
          window.sessionStorage.setItem("ACCESS_TOKEN", res.return);
          window.sessionStorage.setItem("EXPIRES_IN", '180'); //Expira cada 3 minutos
          window.sessionStorage.setItem("PRESTADOR",  JSON.stringify(form.controls['sedea'].value));
          window.localStorage.setItem("PARAMETROS", res.parametros);
          this.closeLoading();
            /*
          await this.loading.dismiss();
        
          this.isPrimerPaso = true;
          this.menuCtrl.enable(true);
          this.router.navigate(['/radicar-referencia']); 
          */
        }
      },
      async (err)=>{
       // await this.loading.dismiss(); 
        alert("Error de autenticación");
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

  private showLoading(mensaje:any) {
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
}
