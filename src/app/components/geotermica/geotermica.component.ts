import { Component, OnInit } from '@angular/core';
import { Eolica, Geotermica, Hidroelectrica } from 'src/app/post.model';
import { EnergiaGeoService } from 'src/app/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hidro',
  templateUrl: './geotermica.component.html',
  styleUrls: ['./geotermica.component.css']
})
export class GeotermicaComponent implements OnInit {
 

  energiaGeoList: Geotermica[] = [];
  selectedEnergiaGeotermica: Geotermica = new Geotermica();
  demandaEnergeticaPorPais: any[] = [];
  mostrarMensajeGuardado = false;
  mensajeTemporizadoActivo = false;

  constructor(private energiaGeoService: EnergiaGeoService, private router: Router) {}
  

  ngOnInit(): void {
    this.obtenerEnergiaGeoList();
  }

  obtenerEnergiaGeoList() {
    this.energiaGeoService.obtenerEnergiasGeo().subscribe((data: Geotermica[]) => {
      this.energiaGeoList = data;
      this.agruparDemandaEnergetica();
    });
  }

  agruparDemandaEnergetica() {
    const demandaMap = new Map<string, { anio: number; demandaTotal: number }>();

    this.energiaGeoList.forEach(item => {
      const key = `${item.pais}-${item.anio}`;
      const demanda = item.cantidad_poblacion * 3000;

      if (demandaMap.has(key)) {
        demandaMap.get(key)!.demandaTotal += demanda;
      } else {
        demandaMap.set(key, { anio: item.anio, demandaTotal: demanda });
      }
    });

    this.demandaEnergeticaPorPais = Array.from(demandaMap.values());
    this.mostrarGrafico();
  }

  mostrarGrafico() {
    // Este método se encargará de emitir los datos al componente gráfico
  }
  private alertaActiva = false;
  onCreateUpdate(): void {
   
    if (this.alertaActiva) return; 
    if (!this.validarDatos()) {
      //this.mostrarMensaje('Por favor, ingresa valores mayores a cero en todos los campos requeridos.', true);
      return;
    }

    if (this.selectedEnergiaGeotermica.id_geo) {
      this.energiaGeoService.updateEnergiaGeo(this.selectedEnergiaGeotermica)
        .then(() => {
          //this.mostrarMensaje('Datos actualizados correctamente');
         
          this.resetForm();
          this.obtenerEnergiaGeoList();
        })
        .catch(error => {
         // this.mostrarMensaje('Error al actualizar los datos: ' + error.message, true);
        });
    } else {
      this.energiaGeoService.guardarEnergiaGeo(this.selectedEnergiaGeotermica)
        .then(() => {
          //this.mostrarMensaje('Datos guardados correctamente');
          this.resetForm();
          this.obtenerEnergiaGeoList();
        })
        .catch(error => {
          //this.mostrarMensaje('Error al guardar los datos: ' + error.message, true);
        });
    }
     alert("datos actualizados correctametne");

     setTimeout(() => {
      this.alertaActiva = true;
    }, 3000); 
  }


  validarDatos(): boolean {
    const {  Caudal_Flujo, Temperatura_Entrada, Temperatura_Salida, Capacidad_Calorifica, 
      Eficiencia, Tiempo_operacion } = this.selectedEnergiaGeotermica;
    return (
      Caudal_Flujo > 0 &&
      Temperatura_Entrada > 0 &&
      Temperatura_Salida > 0 &&
      Capacidad_Calorifica > 0 &&
      Eficiencia > 0 &&
      Tiempo_operacion > 0
    );
  }

 /* mostrarMensaje(mensaje: string, esError: boolean = false): void {
    if (esError) {
      console.error(mensaje);
    } else {
      if (!this.mensajeTemporizadoActivo) {
        alert(mensaje);
        this.mensajeTemporizadoActivo = true;

        // Temporizador para evitar la repetición del mensaje
        setTimeout(() => {
          this.mensajeTemporizadoActivo = true;
        }, 3000); // Espera 3 segundos antes de permitir mostrar otro mensaje
      }
    }
  }
*/
  resetForm(): void {
    this.selectedEnergiaGeotermica = new Geotermica();
    //this.mostrarMensajeGuardado = false;
  }

  onSelect(energia:Geotermica) {
    this.selectedEnergiaGeotermica = { ...energia };
  }

  onDelete(id: string) {
    this.energiaGeoService.eliminarEnergiaGeo(id)
      .then(() => console.log('Documento eliminado con éxito!'))
      .catch(error => console.error('Error al eliminar el documento:', error));
  }

  calcularConsumo(): void {
    const consumoTotal = this.selectedEnergiaGeotermica.cantidad_poblacion * (3000); // Consumo total en kWh
    alert(
      `******Parametros usados para el calculo*****************:\n\n` +
      `Para calcular el consumo total de energia durante un año:\n` +
      `hemos utilizado una formula estandar donde multiplicamos \n` +
      `la cantidad de la poblacion : ${this.selectedEnergiaGeotermica.cantidad_poblacion.toFixed(2)} \n` +
      `Por el consumo promedio por persona al año que es de 3.000 kwh \n` +
      `Para un consumo total del : ${consumoTotal.toFixed(2)}%`
    );
  }

  calcularProduccion(): void {
   
    // Energía generada por la turbina eólica (en kWh)
    const energiaGenerada = this.selectedEnergiaGeotermica.Caudal_Flujo * 
     this.selectedEnergiaGeotermica.Capacidad_Calorifica * 
     (this.selectedEnergiaGeotermica.Temperatura_Entrada -
       this.selectedEnergiaGeotermica.Temperatura_Salida) 
       *this.selectedEnergiaGeotermica.Eficiencia  
       *this.selectedEnergiaGeotermica.Tiempo_operacion
    // Retornar energía generada en kWh
    alert(
      `******Parametros usados para el calculo*****************:\n\n` +
      `Para calcular la produccion total de energia durante un año:\n` +
      `hemos utilizado una formula estandar donde multiplicamos \n` +
      `el Caudal de Flujo (m³/s), equivalente al Volumen de agua o vapor geotérmico extraído por segundo.  : ${this.selectedEnergiaGeotermica.Caudal_Flujo.toFixed(2)} \n` +
      `la Capacidad Calorífica (kJ/kg°C): Energía necesaria para aumentar la temperatura de 
      un kilogramo de fluido en un grado Celsius.   : ${this.selectedEnergiaGeotermica.Capacidad_Calorifica.toFixed(2)} \n` +
      `Por la resta de la Temperatura de Entrada (°C): Temperatura del fluido 
      geotérmico en el momento de la extracción.  ${this.selectedEnergiaGeotermica.Temperatura_Entrada.toFixed(2)} \n` +
      `menos la Temperatura de Salida (°C): Temperatura del fluido después de la 
      extracción de energía.  : ${this.selectedEnergiaGeotermica.Temperatura_Salida.toFixed(2)} \n` +
     `para multiplicarlo luego por la Eficiencia de Conversión (%): Porcentaje de energía térmica convertida en electricidad
     .  : ${this.selectedEnergiaGeotermica.Eficiencia.toFixed(2)} \n` +
     `y por el Tiempo de Operación (horas): Total de horas de operación en un periodo determinado.
     .  : ${this.selectedEnergiaGeotermica.Tiempo_operacion.toFixed(2)} \n` +

      `Para una produccion total de : ${energiaGenerada.toFixed(2)}KWH`
    );
  }

  calcularPorcentajeRenovable(): void {
    const energiaGenerada = this.selectedEnergiaGeotermica.Caudal_Flujo * 
     this.selectedEnergiaGeotermica.Capacidad_Calorifica * 
     (this.selectedEnergiaGeotermica.Temperatura_Entrada -
       this.selectedEnergiaGeotermica.Temperatura_Salida) 
       *this.selectedEnergiaGeotermica.Eficiencia  
       *this.selectedEnergiaGeotermica.Tiempo_operacion  // Obtener energía generada
       const consumoTotal = this.selectedEnergiaGeotermica.cantidad_poblacion * (3000); // Obtener consumo total

    // Verificar que el consumo requerido no sea cero para evitar división por cero
   

    const porcentajeRenovable = (energiaGenerada / consumoTotal) * 100;
    
    // Mostrar alerta con el porcentaje de energía renovable y otros datos relevantes
    alert(
      `Porcentaje de Energía Renovable:\n\n` +
      `Energía Generada (Renovable): ${energiaGenerada.toFixed(2)} kWh\n` +
      `Consumo Total: ${consumoTotal.toFixed(2)} kWh\n` +
      `Porcentaje Renovable: ${porcentajeRenovable.toFixed(2)}%`
    );
  }

  generarInformeEolica(): void {
    // Desestructuración de los datos de la turbina eólica seleccionada
   // const { cantidad_poblacion, areaBarrido, velocidadViento, tiempoOperacion_horas, eficienciaTurbina_035_045 } = this.selectedEnergiaEolica;
    const energiaGenerada = this.selectedEnergiaGeotermica.Caudal_Flujo * 
    this.selectedEnergiaGeotermica.Capacidad_Calorifica * 
    (this.selectedEnergiaGeotermica.Temperatura_Entrada -
      this.selectedEnergiaGeotermica.Temperatura_Salida) 
      *this.selectedEnergiaGeotermica.Eficiencia  
      *this.selectedEnergiaGeotermica.Tiempo_operacion  // Obtener energía generada
      const consumoTotal = this.selectedEnergiaGeotermica.cantidad_poblacion * (3000); // Obtener consumo total

    // Validar que el consumo total no sea cero
    if (consumoTotal === 0) {
      alert("El consumo total no puede ser cero. Verifica los datos ingresados.");
      return;
    }

    // Calcular el porcentaje de energía renovable
    const porcentajeRenovable = (energiaGenerada / consumoTotal) * 100;

    // Crear el informe con los datos relevantes
    const informe = `
      Informe de Energía Geotrmica
      ============================
      Población: ${this.selectedEnergiaGeotermica.pais}
      Población: ${this.selectedEnergiaGeotermica.anio}
      Población: ${this.selectedEnergiaGeotermica.cantidad_poblacion}
      Población: ${this.selectedEnergiaGeotermica.Caudal_Flujo}
      Área de Barrido: ${this.selectedEnergiaGeotermica.Temperatura_Entrada} m²
      Velocidad del Viento: ${this.selectedEnergiaGeotermica.Temperatura_Salida} m/s
      Tiempo de Operación: ${this.selectedEnergiaGeotermica.Capacidad_Calorifica} horas
      Tiempo de Operación: ${this.selectedEnergiaGeotermica.Eficiencia}
      Tiempo de Operación: ${this.selectedEnergiaGeotermica.Tiempo_operacion}
      Energía Generada: ${energiaGenerada.toFixed(2)} kWh
      Consumo Total: ${consumoTotal.toFixed(2)} kWh
      Porcentaje Renovable: ${porcentajeRenovable.toFixed(2)}%
    `;

    // Mostrar el informe al usuario
    alert(informe);

    // Preguntar al usuario si desea guardar el informe como un archivo de texto
    const confirmacion = confirm("¿Deseas guardar este informe como un archivo de texto?");
    if (confirmacion) {
      // Crear un archivo de texto con el informe
      const blob = new Blob([informe], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'informe_energia_eolica.txt'; // Nombre del archivo
      a.click(); // Simular clic para descargar
      window.URL.revokeObjectURL(url); // Revocar la URL creada
      alert("Informe guardado como 'informe_energia_eolica.txt'."); // Mensaje de confirmación
    }
  }

  navegarAPrincipal(): void {
    this.router.navigate(['/principal']); // Cambia 'principal' por la ruta adecuada si es diferente
  }
  
}
