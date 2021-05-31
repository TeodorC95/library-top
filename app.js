"use strict";

const container = document.querySelector(".container");
const addBookButton = document.querySelector("button");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".modal-overlay");
const bookForm = document.querySelector(".book-form");
const submitBtn = document.querySelector("#formSubmit");
let myLibrary = [];

const Book = function (title, author, pages, read = false, id) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.id = id;
};

const addBookToLibrary = function (book) {
  myLibrary.push(book);
};

// display card
const displayCards = function (arr) {
  arr.forEach(book => {
    const html = `
            <div class="card" data-bookid="${book.id}">
              <h2 class="title-card">${book.title}</h2>
              <h3 class="title-author">${book.author}</h3>
              <p>Pages: ${book.pages}</p>
              <p class="read">Procitano: <span>${
                book.read ? "DA" : "NE"
              }</span><i class="fa fa-refresh" aria-hidden="true"></i>
              </p>
              
              <i class="fa fa-window-close-o delete-book" aria-hidden="true"></i>
            </div>
          `;
    container.insertAdjacentHTML("beforeend", html);
  });
};
const resetModal = function () {
  overlay.classList.add("modal-hidden");
  modal.classList.add("modal-hidden");
};

addBookButton.addEventListener("click", function () {
  overlay.classList.remove("modal-hidden");
  modal.classList.remove("modal-hidden");
});
overlay.addEventListener("click", function () {
  resetModal();
});

bookForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.querySelector("#ft");
  const author = document.querySelector("#fa");
  const pages = document.querySelector("#fp");
  let read = document.querySelector("#read");
  read.checked ? (read = true) : (read = false);
  const d = new Date();
  const id = d.getTime();

  // create new book
  const newBook = new Book(title.value, author.value, pages.value, read, id);
  addBookToLibrary(newBook);

  // display cards
  container.innerHTML = "";
  displayCards(myLibrary);

  // assign an id and store books to local storage
  const card = document.querySelector(".card:last-child");
  newBook.id = card.dataset.bookid;
  localStorage.setItem(id, JSON.stringify(newBook));

  resetModal();
  title.value = "";
  author.value = "";
  pages.value = "";

  console.log(myLibrary);
});

window.addEventListener("load", function () {
  const localStorageItems = { ...localStorage };
  console.log(localStorageItems);
  for (const id in localStorageItems) {
    myLibrary.push(JSON.parse(localStorageItems[id]));
  }
  displayCards(myLibrary);
});

/******************
 * DELETE BUTTON
 */
function getBookId(e) {
  return e.target.closest(".card").dataset.bookid;
}
container.addEventListener("click", function (e) {
  if (!e.target.classList.contains("delete-book")) return;
  const id = getBookId(e);
  myLibrary.forEach((book, i) => {
    if (book.id === id) {
      console.log(book.id);
      myLibrary.splice(i, 1);
      localStorage.removeItem(book.id);
    }
  });

  container.innerHTML = "";
  displayCards(myLibrary);
});

/****************
 * REVERSE READ
 */

container.addEventListener("click", function (e) {
  if (!e.target.classList.contains("fa-refresh")) return;
  const id = getBookId(e);

  myLibrary.forEach(book => {
    if (book.id === id) {
      let read = e.target.closest(".read").querySelector("span");
      read.innerHTML === "NE"
        ? (read.innerHTML = "DA")
        : (read.innerHTML = "NE");
      const book = JSON.parse(localStorage.getItem(id));
      book.read ? (book.read = false) : (book.read = true);
      localStorage.setItem(id, JSON.stringify(book));
    }
  });
});
