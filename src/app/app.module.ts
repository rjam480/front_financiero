import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { InformeComponent } from './informe/informe.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { InformeGeneralComponent } from './informe-general/informe-general.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InformeComponent,
    InformeGeneralComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    
    BrowserAnimationsModule,


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
