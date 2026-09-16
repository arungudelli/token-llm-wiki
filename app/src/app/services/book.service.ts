import { Injectable } from '@angular/core';
import { Book } from '../models/book';

/**
 * In-memory catalog. Stands in for a real HTTP-backed data source so the demo
 * runs with zero backend. The "facts" for each page describe how the pages
 * consume this service — not the data itself.
 */
@Injectable({ providedIn: 'root' })
export class BookService {
  private readonly books: Book[] = [
    { id: 'dune', title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi', price: 12.99, cover: '🏜️', blurb: 'Political intrigue and giant sandworms on the desert planet Arrakis.' },
    { id: 'lotr', title: 'The Fellowship of the Ring', author: 'J.R.R. Tolkien', genre: 'Fantasy', price: 14.5, cover: '💍', blurb: 'A hobbit sets out to destroy a ring of terrible power.' },
    { id: 'gatsby', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic', price: 9.99, cover: '🥂', blurb: 'Wealth, longing, and the American dream on Long Island.' },
    { id: 'clean-code', title: 'Clean Code', author: 'Robert C. Martin', genre: 'Tech', price: 29.99, cover: '💻', blurb: 'A handbook of agile software craftsmanship.' },
    { id: 'pragmatic', title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', genre: 'Tech', price: 34.95, cover: '🛠️', blurb: 'Timeless advice for the journey to mastery.' },
    { id: 'foundation', title: 'Foundation', author: 'Isaac Asimov', genre: 'Sci-Fi', price: 11.25, cover: '🪐', blurb: 'Psychohistory predicts the fall of a galactic empire.' },
  ];

  getAll(): Book[] {
    return this.books;
  }

  getById(id: string): Book | undefined {
    return this.books.find((b) => b.id === id);
  }

  genres(): string[] {
    return [...new Set(this.books.map((b) => b.genre))].sort();
  }
}
