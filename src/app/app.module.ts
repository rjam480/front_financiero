import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { InformeComponent } from './informe/informe.component';
import { RecuperarContrasenaComponent } from './recuperar-contrasena/recuperar-contrasena.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Config } from './config';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';


import { InformeGeneralComponent } from './informe-general/informe-general.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InformeComponent,
    InformeGeneralComponent,
    RecuperarContrasenaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    
    BrowserAnimationsModule,


  ],
  providers: [ Config, { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
