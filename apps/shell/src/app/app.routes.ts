import { Route } from '@angular/router';

import { Home } from './home';

export const appRoutes: Route[] = [
  {
    path: 'employees',
    loadChildren: () => import('employees/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'cart',
    loadChildren: () => import('cart/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'flights',
    loadChildren: () => import('flights/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: '',
    component: Home,
  },
];
