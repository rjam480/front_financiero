import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'; 
import { InformeComponent } from './informe/informe.component'; 
import { InformeGeneralComponent } from './informe-general/informe-general.component'; 

const routes: Routes = [
  { path: '', redirectTo: '/informeGeneral', pathMatch: 'full' }, // Redirige a /login por defecto
  { path: 'login', component: LoginComponent } ,// Ruta para el componente de login
  { path: 'informe', component: InformeComponent },
  { path: 'informeGeneral', component: InformeGeneralComponent },
  // Aquí puedes agregar más rutas según sea necesario
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
