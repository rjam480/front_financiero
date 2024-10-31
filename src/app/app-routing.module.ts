import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'; 
import { InformeComponent } from './informe/informe.component'; 
import { InformeGeneralComponent } from './informe-general/informe-general.component'; 
import { AuthGuardService } from './services/auth-guard.service';
import { RecuperarContrasenaComponent } from './recuperar-contrasena/recuperar-contrasena.component';



const routes: Routes = [
  { path: '', component: LoginComponent }, // Redirige a /login por defecto
  { path: 'login', component: LoginComponent } ,// Ruta para el componente de login
  { path: 'informe', component: InformeComponent, canActivate: [AuthGuardService] },
  { path: 'informeGeneral', component: InformeGeneralComponent, canActivate: [AuthGuardService] },
  { path: 'recuperarContrasena', component: RecuperarContrasenaComponent } ,// Ruta para el componente de login
  { path: '**', redirectTo: '' },
  
  // Aquí puedes agregar más rutas según sea necesario
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
