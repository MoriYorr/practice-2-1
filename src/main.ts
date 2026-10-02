import './styles.css';
import { formatBook } from './task1-types';
import type { Book, BookFilter, Catalog } from './task1-types';
import { addBook, removeBook } from './task2-functions';
import { applyFilters, filterByAuthor, filterByMinYear } from './task3-filters';
import { createBookFromForm } from './task4-integration';

// Готовые данные для старта
const initialBooks: Book[] = [
  { id: '1', title: 'TypeScript Guide', authors: ['John Doe'], year: 2023 },
  { id: '2', title: 'JavaScript Basics', authors: ['Jane Smith'], year: 2022 },
];

const bookList = document.getElementById('bookList') as HTMLDivElement;
const bookForm = document.getElementById('bookForm') as HTMLFormElement;
const filters = document.getElementById('filters') as HTMLDivElement;
const filterAuthorInput = document.getElementById('filterAuthor') as HTMLInputElement;
const filterYearInput = document.getElementById('filterYear') as HTMLInputElement;
const applyFiltersButton = document.getElementById('applyFilters') as HTMLButtonElement;
const bookYearInput = bookForm.elements.namedItem('year') as HTMLInputElement;
bookForm.noValidate = true;

let catalog: Catalog = initialBooks.reduce<Catalog>((result, book) => addBook(result, book), {});
let appliedFilters: BookFilter[] = [];

const formError = document.createElement('p');
const filterError = document.createElement('p');
formError.setAttribute('role', 'alert');
filterError.setAttribute('role', 'alert');
bookForm.after(formError);
filters.append(filterError);

function renderBooks() {
  const books = applyFilters(Object.values(catalog), appliedFilters);
  bookList.replaceChildren();
  books.forEach((book) => {
    const card = document.createElement('div');
    card.className = 'book-card';
    const text = document.createElement('p');
    text.textContent = formatBook(book);
    card.append(text);

    if (book.rating !== undefined) {
      const rating = document.createElement('p');
      rating.textContent = `Рейтинг: ${book.rating}`;
      card.append(rating);
    }

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Удалить';
    deleteButton.addEventListener('click', () => {
      catalog = removeBook(catalog, book.id);
      renderBooks();
    });
    card.append(deleteButton);
    bookList.append(card);
  });
}

// Отрисовать начальные книги
renderBooks();

// Обработчик формы
bookForm.addEventListener('submit', (event) => {
  event.preventDefault();
  formError.textContent = '';
  try {
    if (bookYearInput.validity.badInput) {
      throw new Error('Год должен быть целым числом');
    }
    const book = createBookFromForm(new FormData(bookForm));
    catalog = addBook(catalog, book);
    bookForm.reset();
    renderBooks();
  } catch (error) {
    formError.textContent = error instanceof Error ? error.message : 'Не удалось добавить книгу';
  }
});

// Обработчик фильтров
applyFiltersButton.addEventListener('click', () => {
  filterError.textContent = '';
  const yearText = filterYearInput.value.trim();
  const badInput = filterYearInput.validity?.badInput === true;
  if (badInput || (yearText !== '' && !Number.isInteger(Number(yearText)))) {
    filterError.textContent = 'Минимальный год должен быть целым числом';
    return;
  }

  const nextFilters: BookFilter[] = [filterByAuthor(filterAuthorInput.value.trim())];
  if (yearText !== '') {
    nextFilters.push(filterByMinYear(Number(yearText)));
  }
  appliedFilters = nextFilters;
  renderBooks();
});
