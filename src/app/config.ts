import { Injectable } from '@angular/core';

Injectable()
export class Config {
  // apiEndpoint = "https://infinancieraback.nuevaeps.com.co/api";
  // apiEndpoint = "http://infinancierabackqa.nuevaeps.com.co/api";
  apiEndpoint = "http://127.0.0.1:8000/api";
  apiCovidEnpoint = "http://192.168.90.57/covid19/services/Gestor-Casos/public";
  urlFiles = "http://192.168.95.19/referencias";
  secretKey = '0191324e02c87cd3b6abda52150cabf0';
  /*
  apiEndpoint = "http://localhost/APILumen/public/index.php";
  apiCovidEnpoint = "http://192.168.90.57/covid19/services/Gestor-Casos/public";
  urlFiles = "http://192.168.95.19/referencias/";   
  */

}

