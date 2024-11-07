import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//importamos nuestros componentes

import { CreateComponent } from './components/create/create.component';

import { PrincipalComponent } from './principal/principal.component';
import { RegistroComponent } from './registro/registro.component';
import { SolarComponent } from './solar/solar.component';
import { HidroComponent } from './components/hidro/hidro.component';
import { EolicaComponent } from './components/eolica/eolica.component';
import { BiomasaComponent } from './components/biomasa/biomasa.component';
import { GeotermicaComponent } from './components/geotermica/geotermica.component';


//creamos la constante para las Rutas
const routes: Routes = [
  { path: '', redirectTo: '/create', pathMatch: 'full' },
  { path: 'solar', component: SolarComponent },
  { path: 'eolica', component: EolicaComponent },
  { path: 'hidro', component: HidroComponent },
  { path: 'principal', component: PrincipalComponent },
  { path: 'registro', component: RegistroComponent },  
  { path: 'create', component: CreateComponent},
  { path: 'biomasa', component: BiomasaComponent},
  { path: 'geotermica', component: GeotermicaComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
