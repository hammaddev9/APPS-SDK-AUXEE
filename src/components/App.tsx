import React from "react";
import type { Notebook } from "../types";
import { NotebookList } from "./NotebookList";
import { useOpenAiGlobal } from "../hooks/useOpenAiGlobal";

type Note = {
  content?: string;
};

export default function App() {
  const [notebooks, setNotebooks] = React.useState<Notebook[]>([]);
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [selectedNotebook, setSelectedNotebook] = React.useState<Notebook | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [loadingNotes, setLoadingNotes] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState("");

  const toolOutput = useOpenAiGlobal("toolOutput");
  const displayMode = useOpenAiGlobal("displayMode");

  React.useEffect(() => {
    if (toolOutput?.data?.notebooks) {
      setNotebooks(toolOutput.data.notebooks);
      setLoading(false);
      return;
    }

    async function loadNotebooks() {
      try {
        const res = await fetch("/notebooks");
        const data = await res.json();
        setNotebooks(data);
      } catch (err) {
        console.error("Failed to fetch notebooks", err);
      } finally {
        setLoading(false);
      }
    }

    loadNotebooks();
  }, [toolOutput]);

  async function addNotebook() {
    if (!newTitle.trim()) {
      alert("Enter a title first");
      return;
    }
    try {
      await fetch("/create-notebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
      setNewTitle("");
      const res = await fetch("/notebooks");
      setNotebooks(await res.json());
    } catch (err) {
      console.error("Failed to create notebook", err);
    }
  }

  async function handleNotebookClick(notebook: Notebook) {
    setSelectedNotebook(notebook);
    setLoadingNotes(true);
    try {
      const res = await fetch(`/notes/${notebook.id}`);
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Failed to fetch notes", err);
      setNotes([]);
    } finally {
      setLoadingNotes(false);
    }
  }

  function handleBack() {
    setSelectedNotebook(null);
    setNotes([]);
  }

  let notesSection: React.ReactNode = null;
  if (loadingNotes) {
    notesSection = <p>Loading notes...</p>;
  } else if (notes.length > 0) {
    notesSection = (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {notes.map((note, idx) => (
          <details key={idx} style={{ background: "white", padding: 12, borderRadius: 8 }}>
            <summary style={{ cursor: "pointer", fontWeight: 500 }}>
              Note {idx + 1}
            </summary>
            <p style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
              {note.content?.replace(/<[^>]+>/g, "") || "(empty note)"}
            </p>
          </details>
        ))}
      </div>
    );
  } else {
    notesSection = <p>No notes found in this notebook.</p>;
  }

  return (
    <div
      style={{
        fontFamily: "Inter, system-ui",
        padding: 20,
        background: "#fafafa",
        minHeight: "100vh",
      }}
    >
      <h2>Auxee Notebooks {displayMode ? `(Mode: ${displayMode})` : ""}</h2>

      {selectedNotebook === null ? (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <input
              type="text"
              placeholder="New notebook title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{
                flex: 1,
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: 6,
              }}
            />
            <button
              onClick={addNotebook}
              style={{
                padding: "8px 16px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: 6,
              }}
            >
              Create
            </button>
          </div>

          {loading ? (
            <p>Loading notebooks...</p>
          ) : (
            <NotebookList notebooks={notebooks} onNotebookClick={handleNotebookClick} />
          )}
        </>
      ) : (
        <div>
          <button
            onClick={handleBack}
            style={{
              background: "#2563eb",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: 6,
              marginBottom: 20,
              cursor: "pointer",
            }}
          >
            Back
          </button>
          <h2>{selectedNotebook.title}</h2>
          {notesSection}
        </div>
      )}
    </div>
  );
}
