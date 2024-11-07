import { Component, Input } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-grafico',
  standalone: true,
  imports: [],
  templateUrl: './grafico.component.html',
  styleUrl: './grafico.component.css'
})
export class GraficoComponent {

  @Input() demandaEnergeticaPorPais: any[] = []; // Recibe la lista de demanda energética
  public chart: any;

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.mostrarGrafico();
  }

  ngOnChanges(): void {
    if (this.chart) {
      this.chart.destroy(); // Destruir el gráfico anterior si existe
    }
    this.mostrarGrafico(); // Mostrar el gráfico nuevamente con los nuevos datos
  }

  mostrarGrafico() {
    const etiquetas = this.demandaEnergeticaPorPais.map(item => `${item.pais} - ${item.anio}`); // Etiquetas con país y año
    const datosDemanda = this.demandaEnergeticaPorPais.map(item => item.demandaTotal); // Datos de demanda total

    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: etiquetas,
        datasets: [
          {
            label: 'Demanda Energética Total (kW)',
            data: datosDemanda,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2
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

}
