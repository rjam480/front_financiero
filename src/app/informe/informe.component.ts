import { Component,OnInit  } from '@angular/core';

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.scss']
})
export class InformeComponent implements OnInit {
 prestador = {
    nit: '800084362',
    nombre: 'E.S.E. HOSPITAL CIVIL DE IPIALES',
    tipo: 'Pública',
    zonal: 'NARIÑO',
    red: 'RED S Y C',
    giroAdres: 'SI',
  };

  promedioRadicacion = {
    cxp: 1.179,
    enProcesamiento: -2.857,
    glosas: 4.657,
    devoluciones: 1.191,
    totalCartera: 1.923,
    girosMesActual: 4.912,
  };

  total2024 = {
    radicacion: 10.607,
    prestacion: 7.067,
  };

  corriente = {
    giros: 5.780,
    porcentajes: [9119, 118, 6, 57, 89, 79, 51, 1952, 63],
  };

  sinIdentificar = {
    datos: [5, 0, 8, 0, 2, 139, 913, 0, 670],
    porcentajeGiro: '82%',
  };

  intervencionMes = {
    radicacion: 7.510,
    prestacion: 5.709,
    giros: 4.657,
  };

  simulacion = {
    pago80: -89,
    pago90: 481,
  };

  ngOnInit(): void {
    // Fetch or set data for prestadorInfo and numericData here
  }
}