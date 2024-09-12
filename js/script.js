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
  constructor() {
    this.nextId = parseInt(localStorage.getItem("nextId")) || 0;
    this.loadNotes();
    this.handleAutoSave();
  }

  handleAutoSave() {
    setInterval(() => {
      this.saveAllNotes();
    }, time.interval * 1000); // Save every 2 seconds
  }

  addNoteCard() {
    const newNoteCard = new NoteCard(this.nextId++);
    newNoteCard.render();
    localStorage.setItem("nextId", this.nextId);
  }

  saveAllNotes() {
    document.querySelectorAll(".card").forEach((card) => {
      const noteId = parseInt(card.dataset.noteId); // Get the correct noteId
      const noteText = card.querySelector("input").value;
      const note = new NoteCard(noteId);
      note.updateText(noteText);
      StorageManager.saveNoteToStorage(note);
    });
  }

  loadNotes() {
    let notesExist = false;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!isNaN(key)) {
        notesExist = true;
        break;
      }
    }

    if (!notesExist) {
      console.log("No notes in the localStorage.");
      localStorage.setItem("nextId", "0");
      this.nextId = 0;
      return;
    }

    let notes = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!isNaN(key)) {
        const noteData = JSON.parse(localStorage.getItem(key));
        notes.push(noteData);
      }
    }
    notes.sort((a, b) => a.id - b.id);
    notes.forEach((noteData) => {
      const loadedNote = new NoteCard(noteData.id);
      loadedNote.updateText(noteData.text);
      loadedNote.render();
    });
  }
}

class StorageManager {
  static saveNoteToStorage(note) {
    localStorage.setItem(note.id, JSON.stringify(note));
    StorageManager.displaySavedTime();
    console.log(`Note ${note.id} saved at ${StorageManager.getCurrentTime()}`);
  }

  static removeFromStorage(id) {
    localStorage.removeItem(id);
    console.log(`Note ${id} removed from localStorage`);
  }

  static displaySavedTime() {
    const savedTimeDisplay = document.getElementById("saved-time-display");

    if (savedTimeDisplay) {
      savedTimeDisplay.innerHTML = `Saved at: ${StorageManager.getCurrentTime()}`;
    } else {
      const savedTime = document.createElement("div");
      savedTime.className = "saved-time";
      savedTime.id = "saved-time-display";
      savedTime.innerHTML = `<p>Saved at: ${StorageManager.getCurrentTime()}</p>`;

      const timeContainer = document.getElementById("time-container");
      timeContainer.appendChild(savedTime);
    }
  }

  static getCurrentTime() {
    return new Date().toLocaleTimeString();
  }
}
class NoteCard {
  constructor(id) {
    this.id = id;
    this.text = "";
  }

  render() {
    const card = document.createElement("div");
    card.className = "card mb-4 shadow-sm";
    card.setAttribute("data-note-id", this.id);

    const noteElement = document.createElement("div");
    noteElement.className = "card-body";
    noteElement.id = `note-${this.id}`;

    const inputElement = document.createElement("input");
    inputElement.className = "form-control mb-3";
    inputElement.type = "text";
    inputElement.placeholder = "Write your note here...";
    inputElement.value = this.text;
    inputElement.addEventListener("input", (event) => {
      this.updateText(event.target.value);
      StorageManager.saveNoteToStorage(this);
    });

    const buttonElement = document.createElement("button");
    buttonElement.className = "btn btn-outline-danger mt-2";
    buttonElement.innerText = "Remove";

    buttonElement.addEventListener("click", () => {
      this.remove();
      StorageManager.removeFromStorage(this.id);
    });

    noteElement.appendChild(inputElement);
    noteElement.appendChild(buttonElement);

    card.appendChild(noteElement);

    const cardContainer = document.getElementById("card-container");
    cardContainer.appendChild(card);
  }

  updateText(newText) {
    this.text = newText;
  }

  remove() {
    const card = document.querySelector(`[data-note-id="${this.id}"]`);
    if (card) {
      card.remove();
    }
  }
}

const appManager = new AppManager();
const addButton = document.getElementById("add-btn");
addButton.addEventListener("click", () => {
  appManager.addNoteCard();
});
