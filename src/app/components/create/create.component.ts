import { Component, OnInit } from '@angular/core';
import { PostService2 } from 'src/app/post.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  public postForm: UntypedFormGroup;

  constructor( 
    public postService: PostService2,
    public formBuilder: UntypedFormBuilder,
    public router: Router
  ) {
    this.postForm = this.formBuilder.group({
      Usuario: ['', Validators.required],
      Contraseña: ['', [Validators.required]],
      Nombre: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    const Nombre = this.postForm.get('Nombre')?.value;
    const Usuario = this.postForm.get('Usuario')?.value;
    const Contraseña = this.postForm.get('Contraseña')?.value;

    // Validar si el usuario, la contraseña y el nombre ya existen
    this.postService.validatePost({ Nombre, Usuario, Contraseña }).subscribe((exists: boolean) => {
      if (exists) {
        alert('Usuario encontrado. Ingresando al componente principal.');
        this.router.navigate(['/principal']);
      } else {
        alert('Usuario no encontrado. Por favor registrese para ingresar');
        this.resetForm();  // Restablece el formulario después del error
      }
    });
  }

  redirigirModuloRegistro(): void {
    this.router.navigate(['/registro']);
  }

  resetForm(): void {
    this.postForm.reset(); // Limpia todos los campos del formulario
  }
}
