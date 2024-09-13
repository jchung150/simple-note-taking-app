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
    this.autoSaveInterval = null;
    this.autoLoadInterval = null;

    this.loadAllNotes();
    this.autoSave();
    this.autoLoad();
  }

  getCurrentTime() {
    return new Date().toLocaleTimeString();
  }

  autoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    this.autoSaveInterval = setInterval(() => {
      this.saveAllNotes();
      this.displaySavedTime();
    }, 2000);
  }

  stopAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
  }

  autoLoad() {
    if (this.autoLoadInterval) {
      clearInterval(this.autoLoadInterval);
    }
    this.autoLoadInterval = setInterval(() => {
      this.loadAllNotes();
      this.displayUpdatedTime();
    }, 2000);
  }

  stopAutoLoad() {
    if (this.autoLoadInterval) {
      clearInterval(this.autoLoadInterval);
    }
  }

  addNote() {
    const newNote = new Note(this.nextId++);
    newNote.renderWritePage();
    StorageManager.saveNextIdToStorage(this.nextId);

    // Save the updated notes array immediately
    this.saveAllNotes();
  }

  // addNote() {
  //   const newNote = new Note(this.nextId++);
  //   newNote.renderWritePage();
  //   StorageManager.saveNextIdToStorage(this.nextId);
  // }

  saveAllNotes() {
    const notesArray = [];
    document.querySelectorAll(".card").forEach((noteElement) => {
      const noteId = parseInt(noteElement.dataset.noteId);
      const noteText = noteElement.querySelector("input").value;
      const note = new Note(noteId);
      note.updateText(noteText);
      notesArray.push(note);
    });
    StorageManager.saveNotesArrayToStorage(notesArray);
  }

  // saveAllNotes() {
  //   document.querySelectorAll(".card").forEach((note) => {
  //     const newNoteId = parseInt(note.dataset.noteId); // Get the correct noteId
  //     const newNoteText = note.querySelector("input").value;
  //     const newNote = new Note(newNoteId);
  //     newNote.updateText(newNoteText);
  //     StorageManager.saveNoteToStorage(newNote);
  //   });
  // }

  //remove all notes from the DOM
  removeAllNotes() {
    document.querySelectorAll(".card").forEach((card) => {
      card.remove();
    });
  }

  loadAllNotes() {
    this.removeAllNotes();

    // Update nextId from localStorage
    this.nextId = parseInt(localStorage.getItem("nextId")) || 0;

    const notesArray = StorageManager.getNotesArrayFromStorage();

    if (notesArray.length === 0) {
      console.log("No notes. Skipping load.");
      return;
    }

    notesArray.forEach((noteData) => {
      const loadedNote = new Note(noteData.id);
      loadedNote.updateText(noteData.text);

      const isWriterPage = document.getElementById("card-container") !== null;
      const isReaderPage =
        document.getElementById("read-card-container") !== null;

      if (isWriterPage) {
        loadedNote.renderWritePage();
      } else if (isReaderPage) {
        loadedNote.renderReadPage();
      }
    });
  }

  // loadAllNotes() {
  //   this.removeAllNotes();

  //   this.nextId = parseInt(localStorage.getItem("nextId")) || 0;

  //   if (localStorage.length === 0) {
  //     console.log("No notes. Skipping load.");
  //     return;
  //   }

  //   for (let id = 0; id < this.nextId; id++) {
  //     const noteData = localStorage.getItem(id);

  //     // If the note with the current ID exists, process it
  //     if (noteData) {
  //       const parsedNote = JSON.parse(noteData);
  //       const loadedNote = new Note(parsedNote.id);
  //       loadedNote.updateText(parsedNote.text);

  //       const isWriterPage = document.getElementById("card-container") !== null;
  //       const isReaderPage =
  //         document.getElementById("read-card-container") !== null;

  //       if (isWriterPage) {
  //         loadedNote.renderWritePage();
  //       } else if (isReaderPage) {
  //         loadedNote.renderReadPage();
  //       }
  //     }
  //   }
  // }

  displaySavedTime() {
    const savedTimeDisplay = document.getElementById("saved-time-display");
    const currentTime = this.getCurrentTime();

    if (savedTimeDisplay) {
      // overwrite the saved time
      savedTimeDisplay.innerHTML = `${messages.savedAt}${currentTime}`;
    } else {
      const savedTime = document.createElement("div");
      savedTime.className = "saved-time";
      savedTime.id = "saved-time-display";
      savedTime.innerHTML = `<p>Saved at: ${currentTime}</p>`;

      const timeContainer = document.getElementById("saved-time-container");
      timeContainer.appendChild(savedTime);
    }
  }

  displayUpdatedTime() {
    const updatedTimeDisplay = document.getElementById("updated-time-display");
    const currentTime = this.getCurrentTime();

    if (updatedTimeDisplay) {
      updatedTimeDisplay.innerHTML = `${messages.updatedAt}${currentTime}`;
    } else {
      const updatedTime = document.createElement("div");
      updatedTime.className = "updated-time";
      updatedTime.id = "updated-time-display";
      updatedTime.innerHTML = `<p>Updated at: ${currentTime}</p>`;

      const updatedTimeContainer = document.getElementById(
        "updated-time-container"
      );
      updatedTimeContainer.appendChild(updatedTime);
    }
  }
}

class StorageManager {
  static saveNotesArrayToStorage(notesArray) {
    localStorage.setItem("notesArray", JSON.stringify(notesArray));
  }

  static getNotesArrayFromStorage() {
    const notesData = localStorage.getItem("notesArray");
    return notesData ? JSON.parse(notesData) : [];
  }

  static saveNextIdToStorage(nextId) {
    localStorage.setItem("nextId", nextId);
  }

  static removeNoteFromStorage(noteId) {
    let notesArray = StorageManager.getNotesArrayFromStorage();
    notesArray = notesArray.filter((note) => note.id !== noteId);
    StorageManager.saveNotesArrayToStorage(notesArray);
  }

  static removeAllFromStorage() {
    localStorage.removeItem("notesArray");
    localStorage.removeItem("nextId");
    console.log("All notes removed from localStorage");
  }

  // static saveNoteToStorage(note) {
  //   localStorage.setItem(note.id, JSON.stringify(note));
  // }

  // static saveNextIdToStorage(nextId) {
  //   localStorage.setItem("nextId", nextId);
  // }

  // static removeFromStorage(id) {
  //   localStorage.removeItem(id);
  //   console.log(`Note ${id} removed from localStorage`);
  // }

  // static removeAllFromStorage() {
  //   localStorage.clear();
  //   localStorage.removeItem("nextId");
  //   console.log("All notes removed from localStorage");
  // }
}
class Note {
  constructor(id) {
    this.id = id;
    this.text = "";
  }

  renderWritePage() {
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

  renderReadPage() {
    const card = document.createElement("div");
    card.className = "card mb-4 shadow-sm";
    card.setAttribute("data-note-id", this.id);

    const noteElement = document.createElement("div");
    noteElement.className = "card-body";
    noteElement.id = `note-${this.id}`;
    noteElement.innerText = this.text;

    card.appendChild(noteElement);

    const readCardContainer = document.getElementById("read-card-container");
    readCardContainer.appendChild(card);
  }

  updateText(newText) {
    this.text = newText;
  }

  remove() {
    const card = document.querySelector(`[data-note-id="${this.id}"]`);
    if (card) {
      card.remove(); // Remove from DOM
      StorageManager.removeNoteFromStorage(this.id); // Remove from localStorage
    }
  }

  // remove() {
  //   const card = document.querySelector(`[data-note-id="${this.id}"]`);
  //   if (card) {
  //     card.remove(); // this only removes the note from DOM
  //     StorageManager.removeFromStorage(this.id);
  //   }
  // }
}

const appManager = new AppManager();

const addButton = document.getElementById("add-btn");
addButton.addEventListener("click", () => {
  appManager.addNote();
});

// very powerful clear button
const clearButton = document.getElementById("clear-btn");
clearButton.addEventListener("click", () => {
  console.log("Clearing data...");
  appManager.stopAutoSave();
  appManager.removeAllNotes(); // remove all from the DOM
  StorageManager.removeAllFromStorage(); // remove all from localStorage
  setTimeout(() => {
    location.reload();
  }, 2000); // Reload the page after 2 second
});

// 1- open the writer.html and reader.html in two different tabs of same browser.
// Would the reader.html have access to the content stored in the local storage by the writer.html?
// Yes, the reader.html has access to the content stored in the local storage by the writer.html.

// 2- open the writer.html and reader.html in two different tabs of two different browsers
// ( e.g. one in chrome, one in Firefox) . Would the reader.html have access to the content
// stored in the local storage by the writer.html?
// No, the reader.html won't have access to the content stored in the local storage by the writer.html.
