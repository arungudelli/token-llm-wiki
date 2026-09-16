import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-book-list',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
})
export class BookListComponent {
  private readonly books = inject(BookService);
  protected readonly cart = inject(CartService);

  protected readonly genres = this.books.genres();
  protected readonly search = signal('');
  protected readonly genre = signal<string>('All');

  protected readonly filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    const g = this.genre();
    return this.books.getAll().filter(
      (b) =>
        (g === 'All' || b.genre === g) &&
        (!q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)),
    );
  });

  protected onSearch(e: Event): void {
    this.search.set((e.target as HTMLInputElement).value);
  }
  protected onGenre(e: Event): void {
    this.genre.set((e.target as HTMLSelectElement).value);
  }
}
