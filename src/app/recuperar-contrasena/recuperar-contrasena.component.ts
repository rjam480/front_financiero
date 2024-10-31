import { Component , OnInit } from '@angular/core';
import { CrmApiService } from '../crm-api.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrl: './recuperar-contrasena.component.scss'
})
export class RecuperarContrasenaComponent implements OnInit {
  public token: string='';
  public tokenValido: boolean = false;
  public nit: string='';

  constructor(private crmApiService: CrmApiService,   private route: ActivatedRoute,  private router: Router,) {

  }


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.nit = params['nit'];
      if (this.token) {
        //this.startTimer();
        this.tokenValido = true;
     //   this.verificarToken(this.token);
      }
    });
    // this.etapa='paso1';
  
  }


  async recuperar(form: NgForm) {
    //form.TipoUsuario.setValue("Interno");
    const mensaje = "Verificando nit...";
    const loginData = {
      nit: form.controls['nit'].value,

    };
    this.showLoading(mensaje);

    this.crmApiService.recuperarPassword(loginData).subscribe(
      async (res:any) => {
        console.log(res);
        if (res.msg) {
          this.showSuccess("", res.msg);
          this.router.navigate(['/']); 
        }
        else {
          this.closeLoading();
       
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

  passwordsMatch(form: NgForm): boolean {
    const password = form.controls['Password'];
    const confirmPassword = form.controls['conf_password'];
    return password && confirmPassword && password.value === confirmPassword.value;
}

  async verificarToken(form: NgForm) {
    const mensaje = "Validando token...";
    this.showLoading(mensaje);
    const data = {
      nit: this.nit,
      token:this.token,
      password:form.controls['conf_password'].value

    };
    
    this.crmApiService.verificarToken(data).subscribe(
      async (res:any) => {
        console.log(res);
        if (res.msg	) {
      
          this.showSuccess("", res.msg);
          this.router.navigate(['/']); 
   
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


isPasswordValid(password: string): boolean {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars;
}


}

