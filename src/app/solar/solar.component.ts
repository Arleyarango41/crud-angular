import { Component, OnInit } from '@angular/core';
import { EnergiaSolar } from '../post.model';
import { EnergiaSolarService } from '../post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-solar',
  templateUrl: './solar.component.html',
  styleUrls: ['./solar.component.css']
})
export class SolarComponent implements OnInit {

  
  energiaSolarList: EnergiaSolar[] = [];
  selectedEnergiaSolar: EnergiaSolar = new EnergiaSolar();
  demandaEnergeticaPorPais: any[] = []; // Almacena la demanda energética agrupada
  

  constructor(private energiaSolarService: EnergiaSolarService,  private router: Router) {}

  ngOnInit(): void {
    this.obtenerEnergiaSolarList();
  }

  obtenerEnergiaSolarList() {
    this.energiaSolarService.obtenerEnergiasSolar().subscribe((data: EnergiaSolar[]) => {
      this.energiaSolarList = data;
      this.agruparDemandaEnergetica(); 
    });
  }

  agruparDemandaEnergetica() {
    const demandaMap = new Map<string, { anio: number; pais: string; demandaTotal: number }>();

    this.energiaSolarList.forEach(item => {
      const key = `${item.pais}-${item.anio}`; // Clave única por país y año
      const demanda = item.cantidad_poblacion * 3000;

      if (demandaMap.has(key)) {
        // Si la clave existe, sumamos la demanda
        demandaMap.get(key)!.demandaTotal += demanda;
      } else {
        // Si no existe, la creamos
        demandaMap.set(key, { anio: item.anio, pais: item.pais,demandaTotal: demanda });
      }
    });

    // Convertir el mapa a un array
    this.demandaEnergeticaPorPais = Array.from(demandaMap.values());
    this.mostrarGrafico(); // Llama al método para mostrar el gráfico
  }

  mostrarGrafico() {
    // Este método se encargará de emitir los datos al componente gráfico
  }


  onCreateUpdate(): void {
    // Validar que los campos no sean vacíos ni contengan valores inválidos
    if (typeof this.selectedEnergiaSolar.pais !== 'string' || !this.selectedEnergiaSolar.pais.trim() || !isNaN(Number(this.selectedEnergiaSolar.pais))) {
      alert('El campo "Pais" debe ser una cadena de texto no vacía y no puede ser un número.');
      return;
    }
    
  
    if (!this.selectedEnergiaSolar.anio || this.selectedEnergiaSolar.anio <= 0 || !/\d{4}$/.test(this.selectedEnergiaSolar.anio.toString())) {
      alert('El año debe ser un número de 4 cifras.');
      return;
    }
  
    if (!this.selectedEnergiaSolar.potencia_kW || this.selectedEnergiaSolar.potencia_kW <= 0) {
      alert('La potencia debe ser un número mayor que cero.');
      return;
    }
  
    if (!this.selectedEnergiaSolar.horas_sol_h || this.selectedEnergiaSolar.horas_sol_h <= 0) {
      alert('Las horas de sol deben ser un número mayor que cero.');
      return;
    }
  
    if (!this.selectedEnergiaSolar.eficiencia_15_20 || this.selectedEnergiaSolar.eficiencia_15_20 <= 0 || this.selectedEnergiaSolar.eficiencia_15_20 > 100) {
      alert('La eficiencia debe ser un número entre 0 y 100.');
      return;
    }
  
    if (!this.selectedEnergiaSolar.horas_uso_h || this.selectedEnergiaSolar.horas_uso_h <= 0) {
      alert('Las horas de uso deben ser un número mayor que cero.');
      return;
    }
  
    if (!this.selectedEnergiaSolar.cantidad_poblacion || this.selectedEnergiaSolar.cantidad_poblacion <= 0) {
      alert('La cantidad de población debe ser un número mayor que cero.');
      return;
    }
  
    // Validar que los campos que deberían ser cadenas no contengan números
    if (typeof this.selectedEnergiaSolar.id_solar !== 'string') {
      alert('El ID de la energía solar debe ser una cadena.');
      return;
    }
  
    // Si pasa todas las validaciones, continuar con la operación
    if (this.selectedEnergiaSolar.id_solar) {
      // Actualizar
      this.energiaSolarService.updateEnergiaSolar(this.selectedEnergiaSolar)
        .then(() => {
          alert('Datos actualizados correctamente');
          this.resetForm();
          this.obtenerEnergiaSolarList(); // Recargar la lista después de actualizar
        })
        .catch(error => {
          console.error('Error al actualizar: ', error);
          alert('Error al actualizar los datos: ' + error.message);
        });
    } else {
      // Crear nuevo registro
      this.energiaSolarService.guardarEnergiaSolar(this.selectedEnergiaSolar)
        .then(() => {
          alert('Datos guardados correctamente');
          this.resetForm();
          this.obtenerEnergiaSolarList(); // Recargar la lista después de guardar
        })
        .catch(error => {
          console.error('Error al guardar: ', error);
          alert('Error al guardar los datos: ' + error.message);
        });
    }
  }
  
  resetForm(): void {
    this.selectedEnergiaSolar = new EnergiaSolar(); // Reinicia el formulario
  }
  onSelect(energia: EnergiaSolar) {
    this.selectedEnergiaSolar = { ...energia };
  }

  onDelete(id: string) {
    this.energiaSolarService.eliminarEnergiaSolar(id)
      .then(() => console.log('Documento eliminado con éxito!'))
      .catch(error => console.error('Error al eliminar el documento:', error));
  }
  calcularProduccion(potencia_kW: number, horas_sol_h: number, eficiencia: number): void {
    const produccion = potencia_kW * horas_sol_h * (eficiencia / 100);
    alert(
      `Cálculo de Producción de Energía Solar:\n\n` +
      `Potencia Instalada: ${potencia_kW} kW\n` +
      `Horas de Sol por Día: ${horas_sol_h} horas\n` +
      `Eficiencia del Sistema: ${eficiencia}%\n\n` +
      `Producción Estimada de Energía: ${produccion.toFixed(2)} kW\n\n` +
      `Este resultado representa la producción de energía en función de la potencia, las horas de sol y la eficiencia del sistema.`
    );
}

calcularConsumo(potencia_kW: number, horas_uso_h: number, cantidad_poblacion: number): void {
  const consumo = potencia_kW * horas_uso_h * cantidad_poblacion;
  alert(
    `Cálculo de Consumo de Energía:\n\n` +
    `Potencia por Dispositivo: ${potencia_kW} kW\n` +
    `Horas de Uso por Día: ${horas_uso_h} horas\n` +
    `Cantidad de Población: ${cantidad_poblacion}\n\n` +
    `Consumo Estimado de Energía: ${consumo.toFixed(2)} kW\n\n` +
    `Este resultado representa el consumo total estimado en función de la potencia, las horas de uso y la cantidad de personas o dispositivos.`
  );
}



  calcularPorcentajeRenovable(potencia_kW: number, horas_sol_h: number, eficiencia: number, horas_uso_h: number, cantidad_poblacion: number): void {
    // Calcular producción
    const produccionRenovable = potencia_kW * horas_sol_h * (eficiencia / 100);

    // Calcular consumo
    const consumoTotal = potencia_kW * horas_uso_h * cantidad_poblacion;

    if (consumoTotal === 0) {
        alert("El consumo total no puede ser cero. Verifica los datos ingresados.");
        return;
    }

    const porcentajeRenovable = (produccionRenovable / consumoTotal) * 100;
    alert(
      `Cálculo de Porcentaje de Energía Renovable:\n\n` +
      `Producción de Energía Renovable: ${produccionRenovable.toFixed(2)} kW\n` +
      `Consumo Total de Energía: ${consumoTotal.toFixed(2)} kW\n\n` +
      `Porcentaje de Energía Renovable: ${porcentajeRenovable.toFixed(2)}%\n\n` +
      `Este resultado muestra la proporción de energía renovable respecto al consumo total.`
    );
}

generarInforme(potencia_kW: number, horas_sol_h: number, eficiencia: number, horas_uso_h: number, cantidad_poblacion: number): void {
  // Calcular producción
  const produccionRenovable = potencia_kW * horas_sol_h * (eficiencia / 100);

  // Calcular consumo
  const consumoTotal = potencia_kW * horas_uso_h * cantidad_poblacion;

  // Verificar que el consumo total no sea cero
  if (consumoTotal === 0) {
      alert("El consumo total no puede ser cero. Verifica los datos ingresados.");
      return;
  }

  // Calcular porcentaje renovable
  const porcentajeRenovable = (produccionRenovable / consumoTotal) * 100;

  // Crear el contenido del informe
  const informe = `
  Informe de Energía Renovable
  =============================

  Potencia Instalada: ${potencia_kW} kW
  Horas de Sol por Día: ${horas_sol_h} horas
  Eficiencia del Sistema: ${eficiencia}%
  Horas de Uso por Día: ${horas_uso_h} horas
  Cantidad de Población: ${cantidad_poblacion}

  Producción de Energía Renovable: ${produccionRenovable.toFixed(2)} kW
  Consumo Total de Energía: ${consumoTotal.toFixed(2)} kW
  Porcentaje de Energía Renovable: ${porcentajeRenovable.toFixed(2)}%

  Este informe resume los cálculos realizados para determinar la producción, el consumo y el porcentaje de energía renovable en relación con el consumo total.
  `;

  // Mostrar alerta con el contenido del informe
  alert(informe); // Muestra el informe en una alerta

  // Preguntar si el usuario desea guardar el informe
  const confirmacion = confirm("¿Deseas guardar este informe como un archivo de texto?");

  // Si el usuario confirma, guardar el informe como un archivo de texto
  if (confirmacion) {
      const blob = new Blob([informe], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'informe_energia_renovable.txt';
      a.click();
      window.URL.revokeObjectURL(url);
      alert("El informe ha sido guardado exitosamente.");
  } else {
      alert("El informe no fue guardado.");
  }
  
}

navegarAPrincipal(): void {
  this.router.navigate(['/principal']); // Cambia 'principal' por la ruta adecuada si es diferente
}


}