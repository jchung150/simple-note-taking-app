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
