import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  {
    path: 'books',
    loadComponent: () => import('./pages/book-list/book-list.component').then((m) => m.BookListComponent),
  },
  {
    path: 'books/:id',
    loadComponent: () => import('./pages/book-detail/book-detail.component').then((m) => m.BookDetailComponent),
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart.component').then((m) => m.CartComponent),
  },
  { path: '**', redirectTo: 'books' },
];
