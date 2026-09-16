import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  protected readonly cart = inject(CartService);
  protected readonly placed = signal(false);

  protected onQty(bookId: string, e: Event): void {
    this.cart.setQuantity(bookId, Number((e.target as HTMLInputElement).value));
  }

  protected checkout(): void {
    this.placed.set(true);
    this.cart.clear();
  }
}
