/*
  This JavaScript file contains code generated with assistance from ChatGPT,
  an AI language model developed by OpenAI.

  ChatGPT was used for advice on certain functionalities and structures in
  this project.

  For more information, visit: https://openai.com/chatgpt
*/

window.addEventListener("DOMContentLoaded", () => {
  let headerPath = "./pages/header.html";
  if (window.location.pathname.includes("/pages/")) {
    headerPath = "./header.html";
  }

  fetch(headerPath)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header").innerHTML = data;
    });

  const writeButton = document.getElementById("btn-write");
  const readButton = document.getElementById("btn-read");

  if (writeButton) {
    writeButton.onclick = () => {
      location.href = "./pages/writer.html";
    };
  }

  if (readButton) {
    readButton.onclick = () => {
      location.href = "./pages/reader.html";
    };
  }
});

class AppManager {
  constructor(currentPage, id) {
    this.currentPage = currentPage;
    this.id = id;
  }
  initializePage() {
    if (!localStoreage) {
      StorageManager.loadFromStorage();
    } else {
      const noteCards = new NoteCards();
      return;
    }
  }
  handleAutoSave(interval) {}
  handleAutoLoad(interval) {}
  stopAutoSave() {}
}

class StorageManaer {
  // saveToStorage(notes)
  // loadFromStorage()
  // removeFromStorage(id)
  // getCurrentTime()
  getCurrentTime() {
    const d = new Date();
    const hour = d.getHours();
    const minute = d.getMinutes().toString().padStart(2, "0");
    const second = d.getSeconds().toString().padStart(2, "0");
    // return `<p>Stored at: ${hour}:${minute}:${second}</p>`;
  }
}

class NoteCard {
  constructor(id, text) {
    this.id = id;
    this.text = text;
  }

  render() {
    const noteElement = document.createElement("div");
    noteElement.className = "note-card";
    noteElement.id = `${this.id}`;

    noteElement.innerHTML = `<p>${this.text}</p>`;

    const textAreaElement = document.getElementById("text-area");
    textAreaElement.appendChild(noteElement);
  }

  updateText(newText) {}
}

class NoteCards {
  constructor() {
    this.noteCards = [];
    this.nextId = 0;
    this.loadNotes();
    document
      .getElementById("add-btn")
      .addEventListener("click", () => this.addNote());
  }

  addNote() {
    const inputElement = document.getElementById("user-input");
    const text = inputElement ? inputElement.value.trim() : "";

    if (text !== "") {
      const newNote = new NoteCard(this.nextId++, text);
      newNote.render();
      this.noteCards.push(newNote); // add new noteCard obj to the array
      this.saveAllNotes();
    }
  }

  saveAllNotes() {
    localStorage.setItem("notes", JSON.stringify(this.noteCards));
  }

  loadNotes() {
    const storedNoteCards = JSON.parse(localStorage.getItem("notes"));
    if (storedNoteCards && storedNoteCards.length > 0) {
      storedNoteCards.forEach((storedNote) => {
        const loadedNote = new NoteCard(storedNote.id, storedNote.text);
        this.noteCards.push(loadedNote);
        loadedNote.render();
      });
    }
  }

  // addNote(text)
  // loadNotes()
  // saveAllNotes()
  // removeNote(id)
}

// App Manager - handles the page lifecycle
// Properties:
// - currentPage: (string)
// - autoSaveIntervalId: (number)
// Methods:
// - initializePage()
// - handleAutoSave(interval)
// - handleAutoLoad(interval)
// - stopAutoSave()

// StorageManager - handles all localStorage interactions
// Methods:
// saveToStorage(notes)
// loadFromStorage()
// removeFromStorage(id)
// getCurrentTime()

// NoteCard - represents individual notes and handles DOM interactions for a note
// Properties:
// id: (number)
// textArea: (HTML element)
// removeButton: (HTML element)
// Methods:
// constructor(text, id)
// render()
// remove()
// updateText(newText)

// NoteCards - manages multiple noteCard objects, including loading, adding, and removing notes
// Properties:
// notes: (array)
// Methods:
// constructor()
// addNote(text)
// loadNotes()
// saveAllNotes()
// removeNote(id)
