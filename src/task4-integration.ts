// Задание 4: Интеграция с DOM (Парсинг сырых данных)
// Преобразование данных из HTML-формы в строго типизированный объект

import type { Book } from "./task1-types";

/**
 * Создаёт объект Book из данных HTML-формы.
 *
 * Данные из формы проверяются и преобразуются в нужные типы.
 */
export function createBookFromForm(formData: FormData): Book {
  const rawTitle = formData.get("title");
  const rawAuthors = formData.get("authors");
  const rawYear = formData.get("year");
  const rawRating = formData.get("rating");

  if (typeof rawTitle !== "string") {
    throw new Error("Название книги должно быть строкой");
  }
  if (typeof rawAuthors !== "string") {
    throw new Error("Авторы книги должны быть строкой");
  }

  const title = rawTitle.trim();
  if (title.length === 0) {
    throw new Error("Название книги не может быть пустым");
  }

  const authors = rawAuthors
    .split(",")
    .map((author) => author.trim())
    .filter((author) => author.length > 0);
  if (authors.length === 0) {
    throw new Error("Укажите хотя бы одного автора");
  }

  let year: number | undefined;
  if (rawYear !== null) {
    if (typeof rawYear !== "string") {
      throw new Error("Год должен быть строкой");
    }
    const yearText = rawYear.trim();
    if (yearText.length > 0) {
      const parsedYear = Number(yearText);
      if (!Number.isFinite(parsedYear) || !Number.isInteger(parsedYear)) {
        throw new Error("Год должен быть целым числом");
      }
      year = parsedYear;
    }
  }

  let rating: number | undefined;
  if (rawRating !== null) {
    if (typeof rawRating !== "string") {
      throw new Error("Рейтинг должен быть строкой");
    }
    const ratingText = rawRating.trim();
    if (ratingText.length > 0) {
      const parsedRating = Number(ratingText);
      if (!Number.isFinite(parsedRating) || parsedRating < 0 || parsedRating > 5) {
        throw new Error("Рейтинг должен быть числом от 0 до 5");
      }
      rating = parsedRating;
    }
  }

  return {
    id: crypto.randomUUID(),
    title,
    authors,
    ...(year !== undefined ? { year } : {}),
    ...(rating !== undefined ? { rating } : {}),
  };
}
