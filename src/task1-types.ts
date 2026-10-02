// Задание 1: Интерфейсы и типы
// Описание модели каталога книг

// Модель книги каталога.
export interface Book {
  readonly id: string;
  title: string;
  authors: string[];
  year?: number;
  rating?: number;
}

// Каталог хранит книги по их идентификаторам.
export type Catalog = Record<string, Book>;

// Фильтр возвращает true для подходящей книги.
export type BookFilter = (book: Book) => boolean;

// Форматирует название, год (если он указан) и авторов книги.
export function formatBook(book: Book): string {
  const year = book.year !== undefined ? ` (${book.year})` : "";
  return `${book.title}${year} — ${book.authors.join(", ")}`;
}

// Считает среднее только по книгам с указанным годом.
export function calculateAverageYear(books: Book[]): number {
  const years = books
    .filter((book) => book.year !== undefined)
    .map((book) => book.year as number);

  if (years.length === 0) {
    return 0;
  }

  return years.reduce((sum, year) => sum + year, 0) / years.length;
}
