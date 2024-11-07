import { Component, OnInit } from '@angular/core';
import { Biomasa, Eolica, Hidroelectrica } from 'src/app/post.model';
import { EnergiaBiomasaService, EnergiaEolicaService } from 'src/app/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hidro',
  templateUrl: './biomasa.component.html',
  styleUrls: ['./biomasa.component.css']
})
export class BiomasaComponent implements OnInit {
 

  energiaBioList: Biomasa[] = [];
  selectedEnergiaBiomasa: Biomasa = new Biomasa();
  demandaEnergeticaPorPais: any[] = [];
  mostrarMensajeGuardado = false;
  mensajeTemporizadoActivo = false;

  constructor(private energiaBiomasaService: EnergiaBiomasaService, private router: Router) {}
  

  ngOnInit(): void {
    this.obtenerEnergiaBioList();
  }

  obtenerEnergiaBioList() {
    this.energiaBiomasaService.obtenerEnergiasBio().subscribe((data: Biomasa[]) => {
      this.energiaBioList = data;
      this.agruparDemandaEnergetica();
    });
  }

  agruparDemandaEnergetica() {
    const demandaMap = new Map<string, { anio: number; demandaTotal: number }>();

    this.energiaBioList.forEach(item => {
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
      alert("Datos invalidos");
      //this.mostrarMensaje('Por favor, ingresa valores mayores a cero en todos los campos requeridos.', true);
      return;
    }

    if (this.selectedEnergiaBiomasa.id_bio) {
      this.energiaBiomasaService.updateEnergiaBio(this.selectedEnergiaBiomasa)
        .then(() => {
          alert("datos actualizados correctametne");
          //this.mostrarMensaje('Datos actualizados correctamente');
         
          this.resetForm();
          this.obtenerEnergiaBioList();
        })
        .catch(error => {
         // this.mostrarMensaje('Error al actualizar los datos: ' + error.message, true);
        });
    } else {
      this.energiaBiomasaService.guardarEnergiaBio(this.selectedEnergiaBiomasa)
        .then(() => {
          alert("datos guardados correctametne");
          //this.mostrarMensaje('Datos guardados correctamente');
          this.resetForm();
          this.obtenerEnergiaBioList();
        })
        .catch(error => {
          //this.mostrarMensaje('Error al guardar los datos: ' + error.message, true);
        });
    }
     

     setTimeout(() => {
      this.alertaActiva = true;
    }, 3000); 
  }


  validarDatos(): boolean {
    const { cantidad_poblacion, cantidad_materia_prima, poder_calorifico_kwh, 
      tiempoOperacion_horas, eficiencia } = this.selectedEnergiaBiomasa;
    return (
      cantidad_poblacion > 0 &&
      cantidad_materia_prima > 0 &&
      poder_calorifico_kwh > 0 &&
      tiempoOperacion_horas > 0 &&
      eficiencia  > 0   
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
    this.selectedEnergiaBiomasa = new Biomasa();
    //this.mostrarMensajeGuardado = false;
  }

  onSelect(energia:Biomasa) {
    this.selectedEnergiaBiomasa = { ...energia };
  }

  onDelete(id: string) {
    this.energiaBiomasaService.eliminarEnergiaBio(id)
      .then(() => console.log('Documento eliminado con éxito!'))
      .catch(error => console.error('Error al eliminar el documento:', error));
  }

  calcularConsumo(): void {
    const consumoTotal = this.selectedEnergiaBiomasa.cantidad_poblacion * (3000); // Consumo total en kWh
    alert(
      `******Parametros usados para el calculo*****************:\n\n` +
      `Para calcular el consumo total de energia durante un año:\n` +
      `hemos utilizado una formula estandar donde multiplicamos \n` +
      `la cantidad de la poblacion : ${this.selectedEnergiaBiomasa.cantidad_poblacion.toFixed(2)} \n` +
      `Por el consumo promedio por persona al año que es de 3.000 kwh \n` +
      `Para un consumo total del : ${consumoTotal.toFixed(2)}%`
    );
  }

  calcularProduccion(): void {
    // Energía generada por la turbina eólica (en kWh)
    const energiaGenerada = this.selectedEnergiaBiomasa.cantidad_materia_prima *
     this.selectedEnergiaBiomasa.poder_calorifico_kwh
     * this.selectedEnergiaBiomasa.eficiencia 
     * this.selectedEnergiaBiomasa.tiempoOperacion_horas; 
    // Retornar energía generada en kWh
    alert(
      `******Parametros usados para el calculo*****************:\n\n` +
      `Para calcular la produccion total de energia durante un año:\n` +
      `hemos utilizado una formula estandar donde multiplicamos \n` +
      `el area de barrido por las aspas  : ${this.selectedEnergiaBiomasa.cantidad_materia_prima.toFixed(2)} \n` +
      `la velocidad del viento   : ${this.selectedEnergiaBiomasa.poder_calorifico_kwh.toFixed(2)} \n` +
      `la eficiencia de las turbinas que varian entre el 35% y el 40%  :  ${this.selectedEnergiaBiomasa.eficiencia.toFixed(2)} \n` +
      ` y el tiempo de operacion en horas  : ${this.selectedEnergiaBiomasa.tiempoOperacion_horas.toFixed(2)} \n` +
      `Para una produccion total de : ${energiaGenerada.toFixed(2)}KWH`
    );
  }

  calcularPorcentajeRenovable(): void {
    const energiaGenerada = this.selectedEnergiaBiomasa.cantidad_materia_prima *
    this.selectedEnergiaBiomasa.poder_calorifico_kwh
    * this.selectedEnergiaBiomasa.eficiencia 
    * this.selectedEnergiaBiomasa.tiempoOperacion_horas;   // Obtener energía generada
    const energiaRequerida = this.selectedEnergiaBiomasa.cantidad_poblacion * (3000); // Obtener consumo total

    // Verificar que el consumo requerido no sea cero para evitar división por cero
   

    const porcentajeRenovable = (energiaGenerada / energiaRequerida) * 100;
    
    // Mostrar alerta con el porcentaje de energía renovable y otros datos relevantes
    alert(
      `Porcentaje de Energía Renovable:\n\n` +
      `Energía Generada (Renovable): ${energiaGenerada.toFixed(2)} kWh\n` +
      `Consumo Total: ${energiaRequerida.toFixed(2)} kWh\n` +
      `Porcentaje Renovable: ${porcentajeRenovable.toFixed(2)}%`
    );
  }

  generarInformeBio(): void {
    // Desestructuración de los datos de la turbina eólica seleccionada
   // const { cantidad_poblacion, areaBarrido, velocidadViento, tiempoOperacion_horas, eficienciaTurbina_035_045 } = this.selectedEnergiaBiomasa;
    const energiaGenerada = this.selectedEnergiaBiomasa.cantidad_materia_prima * 
    this.selectedEnergiaBiomasa.poder_calorifico_kwh
    * this.selectedEnergiaBiomasa.eficiencia 
    * this.selectedEnergiaBiomasa.tiempoOperacion_horas;  // Obtener energía generada
    const energiaRequerida = this.selectedEnergiaBiomasa.cantidad_poblacion * (3000); 
    // Validar que el consumo total no sea cero
    if (energiaRequerida === 0) {
      alert("El consumo total no puede ser cero. Verifica los datos ingresados.");
      return;
    }

    // Calcular el porcentaje de energía renovable
    const porcentajeRenovable = (energiaGenerada / energiaRequerida) * 100;

    // Crear el informe con los datos relevantes
    const informe = `
      Informe de Energía Biomasa
      ============================
      Población: ${this.selectedEnergiaBiomasa.cantidad_poblacion}
      Cantidad de materia prima dispuesta: ${this.selectedEnergiaBiomasa.cantidad_materia_prima} m²
      Poder calorifico generado por la materia prima: ${this.selectedEnergiaBiomasa.poder_calorifico_kwh} m/s
      Eficiencia de la produccion en porcentaje: ${this.selectedEnergiaBiomasa.eficiencia } horas
      Tiempo de operacion en horas: ${this.selectedEnergiaBiomasa.tiempoOperacion_horas} horas
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
    this.resetForm();
  }

  navegarAPrincipal(): void {
    this.router.navigate(['/principal']); // Cambia 'principal' por la ruta adecuada si es diferente
  }
  
}
