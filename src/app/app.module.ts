import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Importaciones de Firestore y otros módulos necesarios
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

// Configuración de Firebase
import { environment } from '../environments/environment';

// Importación del módulo de enrutamiento y componentes
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateComponent } from './components/create/create.component';
import { PrincipalComponent } from './principal/principal.component';
import { RegistroComponent } from './registro/registro.component';
import { SolarComponent } from './solar/solar.component';
import { HidroComponent } from './components/hidro/hidro.component';
import { EolicaComponent } from './components/eolica/eolica.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Importa GraficoComponent en imports porque es standalone
import { GraficoComponent } from './grafico/grafico.component';
import { BiomasaComponent } from './components/biomasa/biomasa.component';
import { Geotermica } from './post.model';
import { GeotermicaComponent } from './components/geotermica/geotermica.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateComponent,
    PrincipalComponent,
    RegistroComponent,
    SolarComponent,
    HidroComponent,
    EolicaComponent,
    BiomasaComponent,
    GeotermicaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
    GraficoComponent // Importar el componente standalone aquí
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
