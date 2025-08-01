import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import axios from "axios";

export default function Workspace() {
  const [selectedNoteId, SetSelectedNoteId] = useState(0);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [noteContent, setNoteContent] = useState("");

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { id } = useParams();

  const [folders, setFolders] = useState([
    { id: 1, name: "Inbox" },
    { id: 2, name: "Projects" },
  ]);
  const [notes, setNotes] = useState([
    { id: 1, folderId: 1, name: "Welcome.md", content: "content1" },
    { id: 2, folderId: 2, name: "ProjectPlan.md", content: "content2" },
  ]);

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  useEffect(() => {
    async function fetchData() {
      try {
        const foldersRes = await axios.get(
          "http://localhost:8000/api/folders/",
          config
        );
        setFolders(foldersRes.data.results);

        const notesRes = await axios.get(
          "http://localhost:8000/api/notes/",
          config
        );
        setNotes(notesRes.data.results);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedNote) {
      setNoteContent(selectedNote.content);
    }
  }, [selectedNote]);

  const handleAddFolder = async () => {
    const name = prompt("folder name: ");
    if (!name) return;
    try {
      const res = await axios.post(
        "http://localhost:8000/api/folders/",
        {
          name,
        },
        config
      );
      setFolders([...folders, res.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddNote = async (folderId: number) => {
    const name = prompt("Note name: ");
    if (!name) return;
    try {
      const res = await axios.post(
        "http://localhost:8000/api/Notes/",
        {
          name,
          folderId,
          content: "",
        },
        config
      );
      setNotes([...notes, res.data]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full min-h-screen flex">
      <div className="w-64 bg-gray-800 border-r border-gray-700 pl-2">
        <h1 className="text-center text-gray-200">workspace {id}</h1>
        <button onClick={handleAddFolder}> +Folder</button>
        <ul>
          {folders.map((folder) => (
            <li key={folder.id} className=" text-gray-200">
              {folder.name}
              <ul className="ml-4">
                <button
                  onClick={() => {
                    handleAddNote(folder.id);
                  }}
                >
                  +Notes
                </button>
                {notes
                  .filter((note) => note.folderId === folder.id)
                  .map((note) => (
                    <li
                      key={note.id}
                      className="text-gray-400"
                      onClick={() => SetSelectedNoteId(note.id)}
                    >
                      {note.name}
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-grow p-8 bg-gray-600">
        {selectedNote ? (
          <div>
            <h2 className="font-bold text-xl text-gray-200 mb-4">
              {selectedNote.name}
            </h2>
            <div className="flex gap-2 mb-4">
              <button
                className={`px-3 py-1 rounded ${
                  !isPreviewing ? "bg-blue-500 text-white" : "bg-gray-300"
                }`}
                onClick={() => setIsPreviewing(false)}
                disabled={!isPreviewing}
              >
                Edit
              </button>
              <button
                className={`px-3 py-1 rounded ${
                  isPreviewing ? "bg-blue-500 text-white" : "bg-gray-300"
                }`}
                onClick={() => setIsPreviewing(true)}
                disabled={isPreviewing}
              >
                Preview
              </button>
            </div>
            {!isPreviewing ? (
              <textarea
                className="w-full h-64 p-2 rounded bg-gray-700 text-gray-200"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
            ) : (
              <div className="prose bg-gray-700 p-4 rounded text-gray-200">
                <ReactMarkdown>{noteContent}</ReactMarkdown>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-200">Select a note</div>
        )}
      </div>
    </div>
  );
}
