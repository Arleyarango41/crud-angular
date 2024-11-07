import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { PostService2 } from '../post.service';
import { Router } from '@angular/router';
import { Post2 } from '../post.model';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  public postForm: UntypedFormGroup;

  constructor( 
    public postService: PostService2,
    public formBuilder: UntypedFormBuilder,
    public router: Router
  ) {
    // Expresión regular para validar que el usuario tenga al menos una @, una mayúscula y dos números
    const usuarioPattern = /^(?=.*[A-Z])(?=.*\d.*\d)(?=.*[@]).+$/;
    // Expresión regular para validar que la contraseña tenga al menos una mayúscula, un carácter especial y dos números
   // const contraseñaPattern = /^(?=.*[A-Z])(?=.*\d.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;

    this.postForm = this.formBuilder.group({
      Nombre: ['', Validators.required],
      Usuario: ['', [Validators.required, Validators.pattern(usuarioPattern)]],
      Contraseña: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.postForm.valid) {
      const postData: Post2 = this.postForm.value;
  
      // Llama al servicio para crear un nuevo usuario
      this.postService.createPost(postData)
        .then(() => {
          alert('Usuario registrado exitosamente.');
          this.router.navigate(['/create']); // Redirige a otra página si es necesario
        })
        .catch(error => {
          console.error('Error al crear el usuario:', error);
          alert('Hubo un problema al registrar el usuario.'); // Manejo de errores
        });
    } else {
      alert('Por favor, completa el formulario correctamente.'); // Mensaje si el formulario no es válido
    }
  }
  
}
