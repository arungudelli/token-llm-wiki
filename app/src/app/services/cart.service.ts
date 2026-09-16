import { Injectable, computed, signal } from '@angular/core';
import { Book } from '../models/book';
import { CartItem } from '../models/cart-item';

/**
 * Signal-based cart state, shared app-wide (providedIn: 'root'). Both the
 * book-detail page (add) and the cart page (edit/checkout) consume it — that
 * cross-page coupling is one of the "facts" worth caching about these pages.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = signal<CartItem[]>([]);
  readonly items = this._items.asReadonly();
  readonly count = computed(() => this._items().reduce((n, i) => n + i.quantity, 0));
  readonly total = computed(() => this._items().reduce((s, i) => s + i.book.price * i.quantity, 0));

  add(book: Book, quantity = 1): void {
    this._items.update((items) => {
      const existing = items.find((i) => i.book.id === book.id);
      if (existing) {
        return items.map((i) => (i.book.id === book.id ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...items, { book, quantity }];
    });
  }

  setQuantity(bookId: string, quantity: number): void {
    this._items.update((items) =>
      items.map((i) => (i.book.id === bookId ? { ...i, quantity } : i)).filter((i) => i.quantity > 0),
    );
  }

  remove(bookId: string): void {
    this._items.update((items) => items.filter((i) => i.book.id !== bookId));
  }

  clear(): void {
    this._items.set([]);
  }
}
