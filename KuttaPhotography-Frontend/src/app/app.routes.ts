import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { ServicesComponent } from './pages/services/services.component';
import { ContactComponent } from './pages/contact/contact.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { LoginComponent } from './admin/login/login.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Kutta Photography | Video & Photo' },
  { path: 'about', component: AboutComponent, title: 'About Us | Kutta Photography' },
  { path: 'portfolio', component: PortfolioComponent, title: 'Portfolio | Kutta Photography' },
  { path: 'services', component: ServicesComponent, title: 'Services | Kutta Photography' },
  { path: 'contact', component: ContactComponent, title: 'Contact | Kutta Photography' },
  { path: 'admin/login', component: LoginComponent, title: 'Admin Login' },
  { path: 'admin', component: DashboardComponent, title: 'Admin Dashboard', canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
