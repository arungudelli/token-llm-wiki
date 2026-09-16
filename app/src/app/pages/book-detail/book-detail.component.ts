import { Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-book-detail',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.scss',
})
export class BookDetailComponent {
  private readonly books = inject(BookService);
  protected readonly cart = inject(CartService);

  // Bound from the :id route param via withComponentInputBinding().
  readonly id = input.required<string>();
  protected readonly book = computed(() => this.books.getById(this.id()));
}
