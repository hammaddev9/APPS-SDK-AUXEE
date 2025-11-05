import React from "react";

interface Note {
  readonly id: string;
  readonly content: string;
  readonly updatedAt?: string;
}

interface Props {
  readonly notes: ReadonlyArray<Readonly<Note>>;
  readonly onBack: () => void;
}

export function NotesList({ notes, onBack }: Readonly<Props>) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  if (notes.length === 0) {
    return (
      <div className="notes-list">
        <button className="back-btn" onClick={onBack}>⬅ Back to Notebooks</button>
        <p className="empty">No notes found in this notebook.</p>
      </div>
    );
  }

  return (
    <div className="notes-list">
      <button className="back-btn" onClick={onBack}>⬅ Back to Notebooks</button>
      <h2>📝 Notes</h2>
      <div className="accordion-list">
        {notes.map((note, i) => {
          const plain = note.content
            ?.replace(/<[^>]+>/g, "")
            .replace(/\s+/g, " ")
            .trim();
          const preview = plain?.slice(0, 100) || "(empty note)";
          const open = openIndex === i;
          const contentId = `note-content-${note.id}`;

          return (
            <div key={note.id} className="accordion-item">
              {/* Use a native button for accessibility instead of a div with onClick */}
              <button
                type="button"
                className="accordion-header"
                aria-expanded={open}
                aria-controls={contentId}
                onClick={() => setOpenIndex(open ? null : i)}
                style={{ all: "unset", display: "flex", width: "100%", cursor: "pointer" }}
              >
                <span style={{ flex: 1 }}>{preview}</span>
                <span className="accordion-icon" aria-hidden="true">{open ? "▲" : "▼"}</span>
              </button>

              {open && (
                <div id={contentId} className="accordion-content">
                  <p>{plain || "(empty note)"}</p>
                  {note.updatedAt && (
                    <small>Last updated: {new Date(note.updatedAt).toLocaleString()}</small>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
