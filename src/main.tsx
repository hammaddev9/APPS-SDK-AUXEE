import React from "react";
import { createRoot } from "react-dom/client";

declare global {
  interface Window {
    openai: { callTool: (name: string, args?: any) => Promise<any> };
    toolOutput?: any; 
  }
}

if (!window.openai) {
  console.warn("Running in local mode (mocking window.openai + toolOutput)");

  window.openai = {
    callTool: async (name: string, args?: any) => {
      console.log("[Mock callTool]", name, args);
      if (name === "create_note") {
        const note = {
          id: `n${Date.now()}`,
          title: args?.title || "Untitled",
          tags: args?.tags || [],
        };
        window.toolOutput.notes.unshift(note);
        alert(`Note created: ${note.title}`);
      }
      return { ok: true };
    },
  };

  window.toolOutput = {
    notes: [
      { id: "n1", title: "Local test note", tags: ["local"] },
      { id: "n2", title: "Another mock note", tags: ["demo"] },
    ],
  };
}

type Note = { id: string; title: string; tags?: string[] };

function App() {
  const [notes, setNotes] = React.useState<Note[]>(window.toolOutput?.notes ?? []);

  async function addNote() {
    await window.openai.callTool("create_note", {
      title: "New from UI",
      content: "Created via Apps SDK UI",
      tags: ["from-ui"],
    });

    if (!window.openai.callTool.toString().includes("fetch"))
      setNotes([...window.toolOutput.notes]);
  }

  return (
    <div style={{ fontFamily: "Inter, system-ui", padding: 16 }}>
      <h2>Auxee Notes</h2>
      <button onClick={addNote}>➕ Create note</button>

      <ul style={{ marginTop: 12 }}>
        {notes.map((n) => (
          <li key={n.id} style={{ marginBottom: 6 }}>
            <strong>{n.title}</strong>{" "}
            <span style={{ opacity: 0.7 }}>
              {(n.tags ?? []).map((t) => `#${t}`).join(" ")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
