import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { EnergiaSolar, Eolica, Hidroelectrica, Post1, Post2, Biomasa, Geotermica } from './post.model';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class PostService {
  constructor(private angularFirestore: AngularFirestore) {}

  // Obtener todos los posts
  getPosts() {
    return this.angularFirestore
            .collection("Energia hidroelectrica")
            .snapshotChanges();
  }

  // Obtener un solo post por ID
  getPostById(id: string) {
    return this.angularFirestore
            .collection("Energia hidroelectrica")
            .doc(id)
            .valueChanges();
  }

  // Crear un post
  createPost(Hidroelectrica: Post1) {
    return new Promise<any>((resolve, reject) => {
      this.angularFirestore
          .collection("Energia hidroelectrica")
          .add(Hidroelectrica)
          .then(response => {
            console.log(response);
            resolve(response);
          }, error => reject(error));
    });
  }

  // Actualizar un post
  updatePost(Hidroelectrica: Post1, id: string) {
    return this.angularFirestore
      .collection("Energia hidroelectrica")
      .doc(id)
      .update({
        title: Hidroelectrica.title,
        content: Hidroelectrica.content,
        author: Hidroelectrica.author
      });
  }

  // Eliminar un post
  deletePost(id: string) {
    return this.angularFirestore
      .collection("Energia hidroelectrica")
      .doc(id)
      .delete();
  }
}




// Para Login

@Injectable({
  providedIn: 'root'
})

export class PostService2 {
  constructor(private angularFirestore: AngularFirestore) {}

  // Obtener todos los posts
  getPosts() {
    return this.angularFirestore
      .collection("Login")
      .snapshotChanges();
  }

  // Obtener un solo post por ID
  getPostById(id: string) {
    return this.angularFirestore
      .collection("Login")
      .doc(id)
      .valueChanges();
  }

  // Crear un post
  createPost(Login: Post2) {
    return new Promise<any>((resolve, reject) => {
      this.angularFirestore
        .collection("Login")
        .add(Login)
        .then(
          response => {
            console.log(response);
            resolve(response);
          },
          error => reject(error)
        );
    });
  }

  // Actualizar un post
  updatePost(Login: Post2, id: string) {
    return this.angularFirestore
      .collection("Login")
      .doc(id)
      .update({
        Nombre: Login.Nombre,
        Usuario: Login.Usuario,
        Contraseña: Login.Contraseña
      });
  }

  // Eliminar un post
  deletePost(id: string) {
    return this.angularFirestore
      .collection("Login")
      .doc(id)
      .delete();
  }

  // Validar si un usuario con los mismos datos ya existe
  validatePost(data: { Nombre: string, Usuario: string, Contraseña: string }): Observable<boolean> {
    return this.angularFirestore.collection('Login', ref => 
      ref.where('Nombre', '==', data.Nombre)
         .where('Usuario', '==', data.Usuario)
         .where('Contraseña', '==', data.Contraseña)
    ).get().pipe(
      map(snapshot => !snapshot.empty) // Retorna true si se encontró un usuario existente
    );
  }

  // Validar si existe un usuario con la misma contraseña
  /*validatePassword(inContraseña: string): Observable<boolean> {
    return this.angularFirestore
      .collection("Login", ref => ref.where('Contraseña', '==', inContraseña))
      .get()
      .pipe(
        map(querySnapshot => !querySnapshot.empty) // Devuelve true si existe, false si no
      );
  }*/
}


//navegador de los botones de principal




@Injectable({
  providedIn: 'root'
})
export class PostService3 {
  constructor(private router: Router) {}

  navigateToEnergias(energia: string): void {
    this.router.navigate([`/${energia}`]);
  }
}



//Servicio para energia solar




@Injectable({
  providedIn: 'root'
})
export class EnergiaSolarService {
  createId(): string {
    throw new Error('Method not implemented.');
  }
  private collectionName = 'energiaSolar'; // Nombre de la colección en Firestore

  constructor(private firestore: AngularFirestore) {}

  // Método para guardar un documento de EnergiaSolar en Firebase
  guardarEnergiaSolar(energiaSolar: EnergiaSolar): Promise<void> {
    const id = this.firestore.createId(); // Generar un ID único para el documento
    energiaSolar.id_solar = id; // Asignar el ID al modelo

    return this.firestore
      .collection(this.collectionName)
      .doc(id)
      .set({ ...energiaSolar }); // Guardar el documento en Firestore
  }
  
  obtenerEnergiasSolar(): Observable<EnergiaSolar[]> {
    return this.firestore.collection<EnergiaSolar>(this.collectionName).valueChanges();
  }
  
  // Método para eliminar un documento de energía solar por ID
  eliminarEnergiaSolar(id: string): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(id).delete();
  }

  updateEnergiaSolar(energiaSolar: EnergiaSolar): Promise<void> {
    return this.firestore.collection('energiaSolar').doc(energiaSolar.id_solar).update({
      pais: energiaSolar.pais,
      anio: energiaSolar.anio,
      cantidad_poblacion: energiaSolar.cantidad_poblacion,
      potencia_kW: energiaSolar.potencia_kW,
      eficiencia_15_20: energiaSolar.eficiencia_15_20,
      horas_sol_h: energiaSolar.horas_sol_h,
      demanda_energetica_kW: energiaSolar.demanda_energetica_kW,
      horas_uso_h: energiaSolar.horas_uso_h,
    });
  }
  
  btenerEnergiaSolar(): Observable<any[]> {
    return this.firestore.collection('energiaSolar').valueChanges(); // Asegúrate de usar el nombre correcto de la colección
  }
}

//servicio para hidroelectrica

@Injectable({
  providedIn: 'root'
})
export class EnergiaHidroService {
  private collectionName = 'Hidro'; // Nombre de la colección en Firestore

  constructor(private firestore: AngularFirestore) {}

  // Método para guardar un documento de Hidroelectrica en Firebase
  guardarEnergiaHidro(Hidro: Hidroelectrica): Promise<void> {
    const id = this.firestore.createId(); // Generar un ID único para el documento
    Hidro.id_hidroelectrica = id; // Asignar el ID al modelo

    return this.firestore
      .collection(this.collectionName)
      .doc(id)
      .set({ ...Hidro }); // Guardar el documento en Firestore
  }
  
  // Método para obtener todos los documentos de Hidroelectrica
  obtenerEnergiasHidro(): Observable<Hidroelectrica[]> {
    return this.firestore.collection<Hidroelectrica>(this.collectionName).valueChanges();
  }
  
  // Método para eliminar un documento de Hidroelectrica por ID
  eliminarEnergiaHidro(id: string): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(id).delete();
  }

  // Método para actualizar un documento de Hidroelectrica
  updateEnergiaHidro(Hidro: Hidroelectrica): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(Hidro.id_hidroelectrica).update({
      energia_generada_kwh: Hidro.energia_generada_kwh,
      caudal_agua_m3: Hidro.caudal_agua_m3,
      altura_caida_m: Hidro.altura_caida_m,
      aceleracion_por_gravedad: Hidro.aceleracion_por_gravedad, 
      eficienciaSistema: Hidro.eficienciaSistema,
      tiempo_horas: Hidro.tiempo_horas,
      pais: Hidro.pais,
      anio: Hidro.anio,
      cantidad_poblacion: Hidro.cantidad_poblacion,
      energia_requerida: Hidro.energia_requerida,
    });
  }
}


// Servicio para energia eolica.

@Injectable({
  providedIn: 'root'
})

export class EnergiaEolicaService {
  private collectionName = 'eolica'; // Nombre de la colección en Firestore

  constructor(private firestore: AngularFirestore) {}

  // Método para guardar un documento de Hidroelectrica en Firebase
  guardarEnergiaEolica(eolica: Eolica): Promise<void> {
    const id = this.firestore.createId(); // Generar un ID único para el documento
    eolica.id_eolica = id; // Asignar el ID al modelo

    return this.firestore
      .collection(this.collectionName)
      .doc(id)
      .set({ ...eolica }); // Guardar el documento en Firestore
  }
  
  // Método para obtener todos los documentos de Hidroelectrica
  obtenerEnergiasEolica(): Observable<Eolica[]> {
    return this.firestore.collection<Eolica>(this.collectionName).valueChanges();
  }
  
  // Método para eliminar un documento de Hidroelectrica por ID
  eliminarEnergiaEolica(id: string): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(id).delete();
  }

  // Método para actualizar un documento de Hidroelectrica
  updateEnergiaEolica(eolica: Eolica): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(eolica.id_eolica).update({
      pais:  eolica.pais,
      anio:  eolica.anio,
     cantidad_poblacion: eolica.cantidad_poblacion,
     densidad_1225:  eolica.densidad_1225,
     areaBarrido:  eolica. areaBarrido,
     velocidadViento:  eolica. velocidadViento,
     tiempoOperacion_horas:  eolica.tiempoOperacion_horas,
     eficienciaTurbina_035_045: eolica.eficienciaTurbina_035_045,
    });
  }
}

//Servicio para Biomasa

@Injectable({
  providedIn: 'root'
})

export class EnergiaBiomasaService {
  private collectionName = 'biomasa'; // Nombre de la colección en Firestore

  constructor(private firestore: AngularFirestore) {}

  // Método para guardar un documento de Hidroelectrica en Firebase
  guardarEnergiaBio(biomasa: Biomasa): Promise<void> {
    const id = this.firestore.createId(); // Generar un ID único para el documento
    biomasa.id_bio = id; // Asignar el ID al modelo

    return this.firestore
      .collection(this.collectionName)
      .doc(id)
      .set({ ...biomasa }); // Guardar el documento en Firestore
  }
  
  // Método para obtener todos los documentos de Hidroelectrica
  obtenerEnergiasBio(): Observable<Biomasa[]> {
    return this.firestore.collection<Biomasa>(this.collectionName).valueChanges();
  }
  
  // Método para eliminar un documento de Hidroelectrica por ID
  eliminarEnergiaBio(id: string): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(id).delete();
  }

  // Método para actualizar un documento de Hidroelectrica
  updateEnergiaBio(biomasa: Biomasa): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(biomasa.id_bio).update({
      pais:  biomasa.pais,
      anio:  biomasa.anio,
     cantidad_poblacion: biomasa.cantidad_poblacion,
     cantidad_materia_prima:  biomasa.cantidad_materia_prima,
     poder_calorifico_kwh:  biomasa. poder_calorifico_kwh,
     tiempoOperacion_horas:  biomasa. tiempoOperacion_horas,
     eficiencia:  biomasa.eficiencia,
    
    });
  }
}



// Servico para energia geotermica

@Injectable({
  providedIn: 'root'
})

export class EnergiaGeoService {
  private collectionName = 'geotermica'; // Nombre de la colección en Firestore

  constructor(private firestore: AngularFirestore) {}

  // Método para guardar un documento de Hidroelectrica en Firebase
  guardarEnergiaGeo(geotermica: Geotermica): Promise<void> {
    const id = this.firestore.createId(); // Generar un ID único para el documento
    geotermica.id_geo = id; // Asignar el ID al modelo

    return this.firestore
      .collection(this.collectionName)
      .doc(id)
      .set({ ...geotermica }); // Guardar el documento en Firestore
  }
  
  // Método para obtener todos los documentos de Hidroelectrica
  obtenerEnergiasGeo(): Observable<Geotermica[]> {
    return this.firestore.collection<Geotermica>(this.collectionName).valueChanges();
  }
  
  // Método para eliminar un documento de Hidroelectrica por ID
  eliminarEnergiaGeo(id: string): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(id).delete();
  }

  // Método para actualizar un documento de Hidroelectrica
  updateEnergiaGeo(geotermica: Geotermica): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(geotermica.id_geo).update({
      pais:  geotermica.pais,
      anio:  geotermica.anio,
     cantidad_poblacion: geotermica.cantidad_poblacion,
     Caudal_Flujo: geotermica.Caudal_Flujo,
     Temperatura_Entrada:  geotermica. Temperatura_Entrada,
     Temperatura_Salida:  geotermica. Temperatura_Salida,
     Capacidad_Calorífica:  geotermica.Capacidad_Calorifica,
     Eficiencia:  geotermica.Eficiencia,
     Tiempo_operacion:  geotermica.Tiempo_operacion,

    
    });
  }
}