import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://127.0.0.1:5000";
  const notesInitial = [];

  //First val : current val, func to update val and last's initial val;
  const [notes, setNotes] = useState(notesInitial);

  //Get all notes
  const getNotes = async () => {
    const response = await fetch(`${host}/api/notes/fetchAllNotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
        localStorage.getItem('token'),
      },
    });
    const json = await response.json();
    console.log(json);
    setNotes(json);
  };

  //Add a note
  const addNote = async (title, description, tag) => {
    //TODO API CALl
    // TODO: API Call
    // API Call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem('token'),
      },
      body: JSON.stringify({ title, description, tag }),
    });

    
    const note = await response.json();
    setNotes(notes.concat(note));
  };

  //Delete a note
  const deleteNote = async (id) => {
    //API CALL
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjUyMjkzOGM2ZGQxMmNkNDkyMzJlODgwIn0sImlhdCI6MTY5Njc3MjY4M30.e1AJ8rZ02nByYkITQjCgcdQuP9ne2pt4kdV_tcZ_LYU",
      },
    });
    const json = response.json();
    console.log(json);

    console.log("Deleted the note with this id" + id);
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };

  //Edit a note
  const editNote = async (id, title, description, tag) => {
    //API call
    const response = await fetch(
      `${host}/api/notes/updatenotes/ localStorage.getItem();`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token":
          localStorage.getItem('token'),
        },
        //Here we're dealing with the updatation in the client side 
        body: JSON.stringify({ title, description, tag }),
      }
    );
    const json = response.json();

    //this will create a deep copy of the notes array
    const newNotes = JSON.parse(JSON.stringify(notes));

    // Logic for editing notes in client side
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  };

  return (
    <NoteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, getNotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
