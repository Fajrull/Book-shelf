const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';
 
document.addEventListener('DOMContentLoaded', function () {
    const inputBook = document.getElementById('inputBook');
    inputBook.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });
    if (isStorageExist()) {
      loadDataFromStorage();
    }
  });
 
  function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;
 
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, isComplete, false);
    books.push(bookObject);
 
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
 
  function generateId() {
    return +new Date();
  }
 
  function generateBookObject(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete
    }
  }
 
  document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');

    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';
 
    for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
      if (!bookItem.isComplete) {
        incompleteBookshelfList.append(bookElement);
      }else {
        completeBookshelfList.append(bookElement);
      }
    }
  });
 
  function makeBook(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;
 
    const textAuthor = document.createElement('p');
    textAuthor.innerText ="Penulis : " + bookObject.author;
 
    const textYear = document.createElement('p');
    textYear.innerText ="Tahun : " + bookObject.year;
 
    const textbook_shelf = document.createElement('div');
    textbook_shelf.classList.add('book_item');
    textbook_shelf.append(textTitle, textAuthor, textYear);
 
    const book_shelf = document.createElement('div');
    book_shelf.classList.add('book_item');
    book_shelf.append(textbook_shelf);
    book_shelf.setAttribute('id', `book-${bookObject.id}`);

    const buttonbook_shelf = document.createElement('div');
    buttonbook_shelf.classList.add('action');
    book_shelf.append(buttonbook_shelf);
 
  if (bookObject.isComplete) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('green');
    undoButton.innerText = "Belum selesai dibaca";
 
    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(bookObject.id);
    });
 
    const trashButton = document.createElement('button');
    trashButton.classList.add('red');
    trashButton.innerText = "Hapus buku";
 
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(bookObject.id);
    });
 
    buttonbook_shelf.append(undoButton, trashButton);
  } else { 
    const checkButton = document.createElement('button');
    checkButton.classList.add('green');
    checkButton.innerText = "Selesai dibaca";
 
    checkButton.addEventListener('click', function () {
      addTaskFromCompleted(bookObject.id);
    });
 
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('red');
    deleteButton.innerText = "Hapus buku";
 
    deleteButton.addEventListener('click', function () {
      removeTaskFromCompleted(bookObject.id);
    });
 
    buttonbook_shelf.append(checkButton, deleteButton);
 
  }
  return book_shelf;
}

function checkButton() {
  const checkBox = document.querySelector("inputBookIsComplete");
  checkBox.addEventListener("checked", function () {
    if (checkBox == isComplete) addTaskToComplete(id);
  });
}

function undoTaskFromCompleted(bookId) {

  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addTaskFromCompleted (bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;
  alert('Yakin sudah selesai membaca?');
  bookTarget.isComplete = true;
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
}

function findBook(bookId) {
  for (const book_item of books) {
    if (book_item.id === bookId) {
      return book_item;
    }
  }
  return null;
}

function removeTaskFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;
  alert('Yakin mau menghapus buku?');
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books)
 {
  if (books[index].id === bookId) {
    return index;
  }
 }
 return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.getElementById('searchBook').addEventListener('submit', function (event) {
  event.preventDefault();
  const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
  const book_list = document.querySelectorAll('.book_item > h3');
  for (book of book_list) {
    if (book.innerText.toLowerCase().includes(searchBook)) {
      book.parentElement.parentElement.style.display = "block";
    } else {
      book.parentElement.parentElement.style.display = "none";
    }
  }
});  