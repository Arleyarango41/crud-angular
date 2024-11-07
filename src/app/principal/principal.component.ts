import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService3 } from 'src/app/post.service'; // Ajusta la ruta según tu estructura de carpetas

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  constructor(private router: Router) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  navigateToEnergias(ruta: string): void {
    this.router.navigate([ruta]);
  }
}

