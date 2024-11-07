import { Component, OnInit } from '@angular/core';
import { Eolica, Hidroelectrica } from 'src/app/post.model';
import { EnergiaEolicaService } from 'src/app/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hidro',
  templateUrl: './eolica.component.html',
  styleUrls: ['./eolica.component.css']
})
export class EolicaComponent implements OnInit {
 

  energiaEolicaList: Eolica[] = [];
  selectedEnergiaEolica: Eolica = new Eolica();
  demandaEnergeticaPorPais: any[] = [];
  mostrarMensajeGuardado = false;
  mensajeTemporizadoActivo = false;

  constructor(private energiaEolicaService: EnergiaEolicaService, private router: Router) {}
  

  ngOnInit(): void {
    this.obtenerEnergiaEolicaList();
  }

  obtenerEnergiaEolicaList() {
    this.energiaEolicaService.obtenerEnergiasEolica().subscribe((data: Eolica[]) => {
      this.energiaEolicaList = data;
      this.agruparDemandaEnergetica();
    });
  }

  agruparDemandaEnergetica() {
    const demandaMap = new Map<string, { anio: number; demandaTotal: number }>();

    this.energiaEolicaList.forEach(item => {
      const key = `${item.pais}-${item.anio}`;
      const demanda = item.cantidad_poblacion * 4;

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
  //private alertaActiva = false;
  onCreateUpdate(event: Event): void {
    event.preventDefault();  // Evita que el formulario se envíe automáticamente
  
    // Validaciones
    if (typeof this.selectedEnergiaEolica.pais !== 'string' || !this.selectedEnergiaEolica.pais.trim() || !isNaN(Number(this.selectedEnergiaEolica.pais))) {
      alert('El campo "Pais" debe ser una cadena de texto no vacía y no puede ser un número.');
      return;
    }
    
  
    if (!this.selectedEnergiaEolica.anio || this.selectedEnergiaEolica.anio <= 0 || this.selectedEnergiaEolica.anio.toString().length !== 4) {
      alert('El año debe ser un número de 4 cifras y mayor que 0.');
      return;
    }
  
    if (!this.selectedEnergiaEolica.cantidad_poblacion || this.selectedEnergiaEolica.cantidad_poblacion <= 0) {
      alert('La cantidad de población debe ser un número mayor que 0.');
      return;
    }
  
    if (!this.selectedEnergiaEolica.densidad_1225 || this.selectedEnergiaEolica.densidad_1225 <= 0) {
      alert('La densidad del aire debe ser un número mayor que 0.');
      return;
    }
  
    if (!this.selectedEnergiaEolica.areaBarrido || this.selectedEnergiaEolica.areaBarrido <= 0) {
      alert('El área de barrido debe ser un número mayor que 0.');
      return;
    }
  
    if (!this.selectedEnergiaEolica.velocidadViento || this.selectedEnergiaEolica.velocidadViento <= 0) {
      alert('La velocidad del viento debe ser un número mayor que 0.');
      return;
    }
  
    if (!this.selectedEnergiaEolica.tiempoOperacion_horas || this.selectedEnergiaEolica.tiempoOperacion_horas <= 0) {
      alert('El tiempo de operación (en horas) debe ser un número mayor que 0.');
      return;
    }
  
    if (!this.selectedEnergiaEolica.eficienciaTurbina_035_045 || this.selectedEnergiaEolica.eficienciaTurbina_035_045 <= 0) {
      alert('La eficiencia de la turbina debe ser un número mayor que 0.');
      return;
    }
  
    // Si todas las validaciones pasan, proceder con la actualización o creación de datos
    if (this.selectedEnergiaEolica.id_eolica) {
      // Actualizar
      this.energiaEolicaService.updateEnergiaEolica(this.selectedEnergiaEolica)
        .then(() => {
          alert('Datos actualizados correctamente');
          this.resetForm();
          this.obtenerEnergiaEolicaList(); // Recargar la lista después de actualizar
        })
        .catch(error => {
          console.error('Error al actualizar: ', error);
          alert('Error al actualizar los datos: ' + error.message);
        });
    } else {
      // Crear nuevo registro
      this.energiaEolicaService.guardarEnergiaEolica(this.selectedEnergiaEolica)
        .then(() => {
          alert('Datos guardados correctamente');
          this.resetForm();
          this.obtenerEnergiaEolicaList(); // Recargar la lista después de guardar
        })
        .catch(error => {
          console.error('Error al guardar: ', error);
          alert('Error al guardar los datos: ' + error.message);
        });
    }
  
  
    /* setTimeout(() => {
      this.alertaActiva = true;
    }, 3000); */

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
    this.selectedEnergiaEolica = new Eolica();
    //this.mostrarMensajeGuardado = false;
  }

  onSelect(energia:Eolica) {
    this.selectedEnergiaEolica = { ...energia };
  }

  onDelete(id: string) {
    this.energiaEolicaService.eliminarEnergiaEolica(id)
      .then(() => console.log('Documento eliminado con éxito!'))
      .catch(error => console.error('Error al eliminar el documento:', error));
  }

  calcularConsumo(): void {
    const consumoTotal = this.selectedEnergiaEolica.cantidad_poblacion * (3000 / 12); // Consumo total en kWh
    alert(
      `******Parametros usados para el calculo*****************:\n\n` +
      `Para calcular el consumo total de energia durante un año:\n` +
      `hemos utilizado una formula estandar donde multiplicamos \n` +
      `la cantidad de la poblacion : ${this.selectedEnergiaEolica.cantidad_poblacion.toFixed(2)} \n` +
      `Por el consumo promedio por persona al año que es de 3.000 kwh \n` +
      `Para un consumo total del : ${consumoTotal.toFixed(2)}%`
    );
  }

  calcularProduccion(): void {
    // Energía generada por la turbina eólica (en kWh)
    const energiaGenerada = this.selectedEnergiaEolica.areaBarrido *
     Math.pow(this.selectedEnergiaEolica.velocidadViento, 3) 
     * this.selectedEnergiaEolica.eficienciaTurbina_035_045 
     * this.selectedEnergiaEolica.tiempoOperacion_horas; 
    // Retornar energía generada en kWh
    alert(
      `******Parametros usados para el calculo*****************:\n\n` +
      `Para calcular la produccion total de energia durante un año:\n` +
      `hemos utilizado una formula estandar donde multiplicamos \n` +
      `el area de barrido por las aspas  : ${this.selectedEnergiaEolica.areaBarrido.toFixed(2)} \n` +
      `la velocidad del viento   : ${this.selectedEnergiaEolica.velocidadViento.toFixed(2)} \n` +
      `la eficiencia de las turbinas que varian entre el 35% y el 40%  : 
      ${this.selectedEnergiaEolica.eficienciaTurbina_035_045.toFixed(2)} \n` +
      ` y el tiempo de operacion en horas  : 
      ${this.selectedEnergiaEolica.tiempoOperacion_horas.toFixed(2)} \n` +
      `Para una produccion total de : ${energiaGenerada.toFixed(2)}KWH`
    );
  }

  calcularPorcentajeRenovable(): void {
    const energiaGeneradaKwh = this.selectedEnergiaEolica.areaBarrido 
    * Math.pow(this.selectedEnergiaEolica.velocidadViento, 3) 
    * this.selectedEnergiaEolica.eficienciaTurbina_035_045 
    *  this.selectedEnergiaEolica.tiempoOperacion_horas;  // Obtener energía generada
    const energiaRequerida = this.selectedEnergiaEolica.cantidad_poblacion * (3000); // Obtener consumo total

    // Verificar que el consumo requerido no sea cero para evitar división por cero
   

    const porcentajeRenovable = (energiaGeneradaKwh / energiaRequerida) * 100;
    
    // Mostrar alerta con el porcentaje de energía renovable y otros datos relevantes
    alert(
      `Porcentaje de Energía Renovable:\n\n` +
      `Energía Generada (Renovable): ${energiaGeneradaKwh.toFixed(2)} kWh\n` +
      `Consumo Total: ${energiaRequerida.toFixed(2)} kWh\n` +
      `Porcentaje Renovable: ${porcentajeRenovable.toFixed(2)}%`
    );
  }

  generarInformeEolica(): void {
    // Desestructuración de los datos de la turbina eólica seleccionada
    const { cantidad_poblacion, areaBarrido, velocidadViento, tiempoOperacion_horas, eficienciaTurbina_035_045 } = this.selectedEnergiaEolica;
    const energiaGenerada = this.selectedEnergiaEolica.areaBarrido *
     Math.pow(this.selectedEnergiaEolica.velocidadViento, 3) 
     * this.selectedEnergiaEolica.eficienciaTurbina_035_045 
     * this.selectedEnergiaEolica.tiempoOperacion_horas; // Obtener energía generada
    const energiaRequerida = this.selectedEnergiaEolica.cantidad_poblacion * (3000); 
    // Validar que el consumo total no sea cero
    if (energiaRequerida === 0) {
      alert("El consumo total no puede ser cero. Verifica los datos ingresados.");
      return;
    }

    // Calcular el porcentaje de energía renovable
    const porcentajeRenovable = (energiaGenerada / energiaRequerida) * 100;

    // Crear el informe con los datos relevantes
    const informe = `
      Informe de Energía Eólica
      ============================
      Población: ${cantidad_poblacion}
      Área de Barrido: ${areaBarrido} m²
      Velocidad del Viento: ${velocidadViento} m/s
      Tiempo de Operación: ${tiempoOperacion_horas} horas
      Energía Generada: ${energiaGenerada.toFixed(2)} kWh
      Consumo Total: ${energiaRequerida.toFixed(2)} kWh
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
