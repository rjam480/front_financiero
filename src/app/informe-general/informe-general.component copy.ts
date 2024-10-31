import { Component, OnInit } from '@angular/core';
import { CrmApiService } from '../crm-api.service';
import Swal from 'sweetalert2';
import Chart from 'chart.js/auto';  // Corrección aquí
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Config } from 'src/app/config';
import * as CryptoJS from 'crypto-js'


@Component({
  selector: 'app-informe-general',
  templateUrl: './informe-general.component.html',
  styleUrls: ['./informe-general.component.scss']
})
export class InformeGeneralComponent implements OnInit {
  promedioRadicacion: any = {};
  private chart: Chart | null = null;  // Add this line
  cabecera: any[] = [];
  primeraSeccion: any[] = [];
  segundaSeccion: any[] = [];
  terceraSeccion: any[] = [];
  total2024: any[] = [];
  intervencionMes: any[] = [];
  public isAdmin: boolean=false;
  public isview: boolean=true;
  public role: number=0;
  keys2024 = [
    { label: 'RADICACION', key: 'radicacion' },
    { label: 'PRESTACION', key: 'prestacion' },
    { label: 'GIROS', key: 'giros' },
    { label: '% GIRO', key: 'porcentaje_giros' }
  ];
  meses = [
    { key: 'ENE', label: 'Enero' },
    { key: 'FEB', label: 'Febrero' },
    { key: 'MAR', label: 'Marzo' },
    { key: 'ABR', label: 'Abril' },
    { key: 'MAY', label: 'Mayo' },
    { key: 'JUN', label: 'Junio' },
    { key: 'JUL', label: 'Julio' },
    { key: 'AGO', label: 'Agosto' },
    { key: 'SEP', label: 'Septiembre' },
    { key: 'OCT', label: 'Octubre' },
    { key: 'NOV', label: 'noviembre' },
    { key: 'DIC', label: 'Diciembre' },
  ]
  colores = [
    { label: 'hola', color: 'rgba(135, 206, 235, 0.6)', borde: 'rgba(135, 206, 235, 1)' },
    { label: 'SIN IDENTIFICAR', color: 'rgba(255, 206, 86, 0.2)', borde: 'rgba(255, 206, 86, 1)' },
    { label: 'ANTERIOR', color: 'rgba(144, 238, 144, 0.6)', borde: 'rgba(144, 238, 144, 1)' }

  ]
  constructor(private crmApiService: CrmApiService, private config: Config, private authService: AuthService, private router: Router) {

  }

  ngOnInit(): void {
    // this.crmApiService.loadConfig(800084362);
    const nit = sessionStorage.getItem('PRESTADOR');
    const clave = localStorage.getItem('ROL');
    if (clave) {
      this.role = this.decryptData(clave);
      if(this.role==1){
        this.isAdmin=true;
        this.isview=false;
        return;

      }

    }
    if (nit) {
      this.ConsultarData(nit);
    }
  

  }
  async ConsultarData(nit: string) {
    this.isview=true;
    const mensaje = "Consultando data...";
    this.showLoading(mensaje);
    this.crmApiService.consultarData(nit).subscribe(
      res => {
        this.cabecera = res.cabecera; // Asigna la cabecera a la propiedad
        this.primeraSeccion = res.primer_seccion;
        this.segundaSeccion = res.segunda_seccion;
        this.terceraSeccion = res.tercer_seccion
        this.total2024 = res.total_2024;
        this.total2024 = res.total_2024;
        this.intervencionMes = res.intervencion_mes;
        this.createChart();
        this.promedioRadicacion = {
          //  cxp: res.cabecera[0].cxp,
          /*
            en_proceso: res.cabecera[0].en_proceso,
            glosas: res.cabecera[0].glosas,
            devolucion: res.cabecera[0].devolucion,
            total_cartera: res.cabecera[0].total_cartera,
            giro_mes_actual: res.cabecera[0].giro_mes_actual,
            */
        };
        this.closeLoading();
      },
      err => {
        this.closeLoading();
        this.showError("", "Prestador no encontrado");

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


  createChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    const labels = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP'];

    // Extraer datos para cada clasificación
    const corriente = this.primeraSeccion.find(item => item.Clasificacion === 'CORRIENTE') || { Clasificacion: 'CORRIENTE', ENE: 0, FEB: 0, MAR: 0, ABR: 0, MAY: 0, JUN: 0, JUL: 0, AGO: 0, SEP: 0, OCT: 0, NOV: 0, DIC: 0 };
    const sinIdentificar = this.primeraSeccion.find(item => item.Clasificacion === 'SIN IDENTIFICAR') || { Clasificacion: 'SIN IDENTIFICAR', ENE: 0, FEB: 0, MAR: 0, ABR: 0, MAY: 0, JUN: 0, JUL: 0, AGO: 0, SEP: 0, OCT: 0, NOV: 0, DIC: 0 };
    const anterior = this.primeraSeccion.find(item => item.Clasificacion === 'ANTERIOR') || { Clasificacion: 'ANTERIOR', ENE: 0, FEB: 0, MAR: 0, ABR: 0, MAY: 0, JUN: 0, JUL: 0, AGO: 0, SEP: 0, OCT: 0, NOV: 0, DIC: 0 };

    const giros = this.segundaSeccion.find(item => item.Clasificacion === 'Giros') || { Clasificacion: 'Giros', ENE: 0, FEB: 0, MAR: 0, ABR: 0, MAY: 0, JUN: 0, JUL: 0, AGO: 0, SEP: 0 };

    const dataCorriente = labels.map(label => corriente[label]);
    const dataSinIdentificar = labels.map(label => sinIdentificar[label]);
    const dataAnterior = labels.map(label => anterior[label]);
    // const trendlineData = this.calculateMovingAverage(dataCorriente, 3);
    const dataGiros = labels.map(label => giros[label]);
    console.log(dataCorriente);

    const colorCorriente = this.getColorByLabel('CORRIENTE');
    const colorSin = this.getColorByLabel('SIN IDENTIFICAR');
    const colorAnterior = this.getColorByLabel('ANTERIOR');
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels, // Meses como etiquetas
        datasets: [
          {
            label: this.colores[0].label,
            data: dataCorriente,
            backgroundColor: colorCorriente?.color, // Azul claro
            borderColor: colorCorriente?.borde,
            borderWidth: 1
          },
          {
            label: 'SIN IDENTIFICAR',
            data: dataSinIdentificar,
            backgroundColor: colorSin?.color,
            borderColor: colorSin?.borde,
            borderWidth: 1
          },
          {
            label: 'ANTERIOR',
            data: dataAnterior,
            backgroundColor: colorAnterior?.color, // Verde claro
            borderColor: colorAnterior?.borde,
            borderWidth: 1
          },
          /*
          {
            label: 'Tendencia Polinómica',
            data: trendlineData,
            type: 'line',
            borderColor: 'rgba(255, 0, 0, 1)', // Color de la línea de tendencia
            fill: false,
            borderWidth: 2,
            tension: 0.1 // Para suavizar la línea
          },*/
          {
            label: 'Giros ',
            data: dataGiros,
            borderColor: 'rgba(255, 0, 0, 1 )',
            // backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
            type: 'line',
            order: 0
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  cerrarSesion() {
    console.log('hola');
    this.authService.logout();
    this.router.navigate(['/']);
  }





  calculateMovingAverage(data: number[], windowSize: number): number[] {
    const movingAverages: number[] = [];
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - Math.floor(windowSize / 2));
      const end = Math.min(data.length - 1, i + Math.floor(windowSize / 2));
      const subset = data.slice(start, end + 1);
      const average = subset.reduce((a, b) => a + b, 0) / subset.length;
      movingAverages.push(average);
    }
    return movingAverages;
  }

  getColorByLabel(label: string) {
    return this.colores.find(item => item.label === label);
  }


  public decryptData(encryptedData: string): number {
    // Convertir la clave a un objeto WordArray
    const key = CryptoJS.enc.Hex.parse(CryptoJS.SHA256(this.config.secretKey).toString());

    // Desencriptar el valor usando AES y la clave
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });

    // Convertir el valor desencriptado a texto plano
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

    // Devolver el valor como número entero
    return parseInt(decryptedString, 10);
  }



}