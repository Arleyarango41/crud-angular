// En el modelo se crea la clase que va a ser exportada para cada uno de
// servicos a utilizar, se definen las variables con su tipo de dato.


// Modelo para login
export class Post1 {
    id: string; //Se agrega 'id' para identificar los documentos en Firebase
    title: string;
    content: string;
    author: string;
}


// Modelo para registro
export class Post2 {
    id: string; //Se agrega 'id' para identificar los documentos en Firebase
    Nombre: string;
    Usuario: string;
    Contraseña: string;
}


// Modelo para energia solar
export class EnergiaSolar {
    id_solar: string; // Se agrega 'id' para identificar los documentos en Firebase
    pais: string;
    anio: number;
    cantidad_poblacion: number;
    potencia_kW: number;
    eficiencia_15_20: number;
    horas_sol_h: number;
    demanda_energetica_kW: number;
    horas_uso_h: number;
  }

  
  
// hidroelectrica.model.ts
export class Hidroelectrica {
    constructor(
      public id_hidroelectrica: string = '', //Se agrega 'id' para identificar los documentos en Firebase
      public pais: string = '',
      public anio: number = 0,
      public energia_generada_kwh: number = 0,
      public caudal_agua_m3: number = 0,
      public altura_caida_m: number = 0,
      public aceleracion_por_gravedad: number = 0,  // Valor por defecto en m/s²
      public eficienciaSistema: number = 0,
      public tiempo_horas: number = 0,
      public cantidad_poblacion: number = 0,
      public energia_requerida: number = 0
    ) {}
  }

  // Modelo para eolica
  export class Eolica {
    constructor(
      public id_eolica: string = '', //Se agrega 'id' para identificar los documentos en Firebase
      public pais: string = '',
      public anio: number = 0,
      public cantidad_poblacion: number = 0,
      public densidad_1225: number = 0,
      public areaBarrido: number = 0,
      public velocidadViento: number = 0,  // Valor por defecto en m/s²
      public  tiempoOperacion_horas: number = 0,
      public eficienciaTurbina_035_045: number = 0,
      
    ) {}
  }

  //Modelo para la energia Biomasa
  export class Biomasa {
    constructor(
      public id_bio: string = '', //Se agrega 'id' para identificar los documentos en Firebase
      public pais: string = '',
      public anio: number = 0,
      public cantidad_poblacion: number = 0,
      public cantidad_materia_prima: number = 0,
      public poder_calorifico_kwh: number = 0,
      public  tiempoOperacion_horas: number = 0,
      public eficiencia: number = 0,
      
    ) {}
  }
   
// Modelo para energia geotermica.
  export class Geotermica {
    constructor(
      public id_geo: string = '', //Se agrega 'id' para identificar los documentos en Firebase
      public pais: string = '',
      public anio: number = 0,
      public cantidad_poblacion: number = 0,
      public Caudal_Flujo: number = 0,
      public Temperatura_Entrada: number = 0,
      public Temperatura_Salida: number = 0,
      public Capacidad_Calorifica: number = 0,
      public Eficiencia: number = 0,
      public Tiempo_operacion: number = 0,
    ) {}
  }