import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InventarioComponent } from './components/inventario/inventario.component';
import { AuthGuard } from './guards/auth.guard';
import { EmpleadoComponent } from './components/rh/empleado/empleado.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TiendaCocinaComponent } from './components/inv/tienda-cocina/tienda-cocina.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent }, // Acceso directo al login
    { path: 'inventario', component: InventarioComponent, canActivate: [AuthGuard] },
    { path: 'empleados', component: EmpleadoComponent, canActivate: [AuthGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'tiendaCocina', component: TiendaCocinaComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'login', pathMatch: 'full' } // Wildcard redirige al componente por defecto
];
