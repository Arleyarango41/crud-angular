import { Component, OnInit } from '@angular/core';
import { Hidroelectrica } from 'src/app/post.model';
import { EnergiaHidroService } from 'src/app/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hidro',
  templateUrl: './hidro.component.html',
  styleUrls: ['./hidro.component.css']
})
export class HidroComponent implements OnInit {

  energiaHidroList: Hidroelectrica[] = [];
  selectedEnergiaHidro: Hidroelectrica = new Hidroelectrica();
  demandaEnergeticaPorPais: any[] = [];
 

  constructor(private energiaHidroService: EnergiaHidroService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerEnergiaHidroList();
  }

  obtenerEnergiaHidroList() {
    this.energiaHidroService.obtenerEnergiasHidro().subscribe((data: Hidroelectrica[]) => {
      this.energiaHidroList = data;
      this.agruparDemandaEnergetica();
    });
  }

  agruparDemandaEnergetica() {
    const demandaMap = new Map<string, { anio: number; pais: String;demandaTotal: number }>();

    this.energiaHidroList.forEach(item => {
      const key = `${item.pais}-${item.anio}`;
      const demanda = item.energia_requerida;

      if (demandaMap.has(key)) {
        demandaMap.get(key)!.demandaTotal += demanda;
      } else {
        demandaMap.set(key, { anio: item.anio, pais: item.pais,demandaTotal: demanda });
      }
    });

    this.demandaEnergeticaPorPais = Array.from(demandaMap.values());
    this.mostrarGrafico();
  }

  mostrarGrafico() {
    // Este método se encargará de emitir los datos al componente gráfico
  }

  onCreateUpdate(): void {
    if (!this.validarDatos()) {
     alert('Por favor, ingresa valores mayores a cero en todos los campos requeridos.', );
      return;
    }

    if (this.selectedEnergiaHidro.id_hidroelectrica) {
      this.energiaHidroService.updateEnergiaHidro(this.selectedEnergiaHidro)
        .then(() => {
          alert('Datos actualizados correctamente');
          this.resetForm();
          this.obtenerEnergiaHidroList();
        })
        
        .catch(error => {
          alert('Error al actualizar los datos: ' + error.message);
        });
     
       
    } else {
      this.energiaHidroService.guardarEnergiaHidro(this.selectedEnergiaHidro)
        .then(() => {
        
          this.resetForm();
          this.obtenerEnergiaHidroList();
        })
        .catch(error => {
          alert('Error al guardar los datos: ' + error.message);
        });
        alert('Datos guardados correctamente');
        
    }
  }

  validarDatos(): boolean {
    const { caudal_agua_m3, altura_caida_m, aceleracion_por_gravedad, eficienciaSistema, tiempo_horas, cantidad_poblacion } = this.selectedEnergiaHidro;
    return (
      caudal_agua_m3 > 0 &&
      altura_caida_m > 0 &&
      aceleracion_por_gravedad > 0 &&
      eficienciaSistema > 0 &&
      tiempo_horas > 0 &&
      cantidad_poblacion > 0
    );
  }

  /*mostrarMensaje(mensaje: string, esError: boolean = false): void {
    if (esError) {
      console.error(mensaje);
    } else {
      if (!this.mensajeTemporizadoActivo) {
        alert(mensaje);
        this.mensajeTemporizadoActivo = true;

        // Temporizador para evitar la repetición del mensaje
        setTimeout(() => {
          this.mensajeTemporizadoActivo = false;
        }, 3000); // Espera 3 segundos antes de permitir mostrar otro mensaje
      }
    }
  }
*/
  resetForm(): void {
    this.selectedEnergiaHidro = new Hidroelectrica();
    
  }

  onSelect(energia: Hidroelectrica) {
    this.selectedEnergiaHidro = { ...energia };
  }

  onDelete(id: string) {
    this.energiaHidroService.eliminarEnergiaHidro(id)
      .then(() => console.log('Documento eliminado con éxito!'))
      .catch(error => console.error('Error al eliminar el documento:', error));
  }

  calcularProduccion(): void {
    const { caudal_agua_m3, altura_caida_m, aceleracion_por_gravedad, eficienciaSistema, tiempo_horas } = this.selectedEnergiaHidro;
    const potencia_kW = (caudal_agua_m3 * aceleracion_por_gravedad * altura_caida_m) / 1000;
    this.selectedEnergiaHidro.energia_generada_kwh = potencia_kW * tiempo_horas * (eficienciaSistema / 100);

    alert(
      `Cálculo de Producción de Energía Hidroeléctrica:\n\n` +
      `Potencia Instalada (kW): ${potencia_kW.toFixed(2)}\n` +
      `Altura de Caída: ${altura_caida_m} metros\n` +
      `Eficiencia del Sistema: ${eficienciaSistema}%\n` +
      `Producción Estimada: ${this.selectedEnergiaHidro.energia_generada_kwh.toFixed(2)} kWh`
    );
  }

  calcularConsumo(): void {
    const { energia_generada_kwh, tiempo_horas, cantidad_poblacion } = this.selectedEnergiaHidro;
    this.selectedEnergiaHidro.energia_requerida = energia_generada_kwh * tiempo_horas * cantidad_poblacion;

    alert(
      `Cálculo de Consumo de Energía:\n\n` +
      `Producción de Energía: ${energia_generada_kwh} kWh\n` +
      `Tiempo de Uso: ${tiempo_horas} horas\n` +
      `Población Total: ${cantidad_poblacion}\n` +
      `Consumo Total Estimado: ${this.selectedEnergiaHidro.energia_requerida.toFixed(2)} kWh`
    );
  }

  calcularPorcentajeRenovable(): void {
    const { energia_generada_kwh, energia_requerida } = this.selectedEnergiaHidro;

    if (energia_requerida === 0) {
      alert("El consumo total no puede ser cero. Verifica los datos ingresados.");
      return;
    }

    const porcentajeRenovable = (energia_generada_kwh / energia_requerida) * 100;
    alert(
      `Porcentaje de Energía Renovable:\n\n` +
      `Energía Generada (Renovable): ${energia_generada_kwh.toFixed(2)} kWh\n` +
      `Consumo Total: ${energia_requerida.toFixed(2)} kWh\n` +
      `Porcentaje Renovable: ${porcentajeRenovable.toFixed(2)}%`
    );
  }

  generarInformeHidro(): void {
    const { energia_generada_kwh, energia_requerida, caudal_agua_m3, altura_caida_m, aceleracion_por_gravedad, eficienciaSistema, tiempo_horas, cantidad_poblacion } = this.selectedEnergiaHidro;

    if (energia_requerida === 0) {
      alert("El consumo total no puede ser cero. Verifica los datos ingresados.");
      return;
    }

    const porcentajeRenovable = (energia_generada_kwh / energia_requerida) * 100;

    const informe = `
      Informe de Energía Hidroeléctrica
      =============================
      Caudal de Agua: ${caudal_agua_m3} m³
      Altura de Caída: ${altura_caida_m} m
      Aceleración por Gravedad: ${aceleracion_por_gravedad} m/s²
      Eficiencia del Sistema: ${eficienciaSistema}%
      Tiempo de Operación: ${tiempo_horas} horas
      Población: ${cantidad_poblacion}
      Energía Generada: ${energia_generada_kwh.toFixed(2)} kWh
      Consumo Total: ${energia_requerida.toFixed(2)} kWh
      Porcentaje Renovable: ${porcentajeRenovable.toFixed(2)}%
    `;

    alert(informe);

    const confirmacion = confirm("¿Deseas guardar este informe como un archivo de texto?");
    if (confirmacion) {
      const blob = new Blob([informe], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'informe_energia_hidroelectrica.txt';
      a.click();
      window.URL.revokeObjectURL(url);
      alert
    }
  }

  navegarAPrincipal(): void {
    this.router.navigate(['/principal']); // Cambia 'principal' por la ruta adecuada si es diferente
  }
}