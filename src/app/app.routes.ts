import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InventarioComponent } from './components/inventario/inventario.component';
import { TrabajadoresComponent } from './components/trabajadores/trabajadores.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent }, // Acceso directo al login
    { path: 'inventario', component: InventarioComponent, canActivate: [AuthGuard] },
    { path: 'trabajadores', component: TrabajadoresComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'login', pathMatch: 'full' } // Wildcard redirige al componente por defecto
];
