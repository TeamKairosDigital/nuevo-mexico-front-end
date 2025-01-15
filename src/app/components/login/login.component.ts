import { Component } from '@angular/core';
import { ImportsModule } from '../../tools/imports';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { LoginResponseDto } from '../../models/login/response/loginResponse.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ImportsModule, ReactiveFormsModule, FormsModule, InputTextModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService,
     private messageService: MessageService,
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
        const { username, password } = this.loginForm.value;
        this.authService.login(username, password).subscribe({
            next: (response) => {
              if(response.success && response.data != null){
                  // Almacenar datos del usuario
                  this.storeUserData(response.data);
                  // Redirigir al usuario
                  this.router.navigate(['/inventario']);
              } else {
                  this.messageService.add({
                      severity: 'error', 
                      summary: 'Error', 
                      detail: response.message 
                  });
              }
            },
            error: (err) => {
              let errorMessage = 'Error del servidor, intenta nuevamente';

              // Si el error es 401 o 404, se muestran mensajes específicos
              if (err.status === 401) {
                  errorMessage = 'Contraseña incorrecta';
              } else if (err.status === 404) {
                  errorMessage = 'Usuario no encontrado';
              }

              this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: errorMessage
              });
            }
        });
    }
  }


  // Función para almacenar datos del usuario en el localStorage
  private storeUserData(data: LoginResponseDto): void {
    this.storageService.setItem('userId', data.id);
    this.storageService.setItem('username', data.username);
    this.storageService.setItem('access_token', data.access_token);
  }

}
