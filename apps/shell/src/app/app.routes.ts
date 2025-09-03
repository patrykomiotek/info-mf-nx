import { NxWelcome } from './nx-welcome';
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
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
    component: NxWelcome,
  },
];
