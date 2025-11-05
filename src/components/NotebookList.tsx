import React from "react";
import { NotebookCard } from "./NotebookCard";
import { Notebook } from "src/types";

interface NotebookListProps {
  readonly notebooks: ReadonlyArray<Readonly<Notebook>>;
  readonly onNotebookClick: (notebook: Readonly<Notebook>) => void;
}

export function NotebookList({ notebooks, onNotebookClick }: Readonly<NotebookListProps>) {
  if (notebooks.length === 0) {
    return <div className="empty">No notebooks yet. Start by creating one</div>;
  }

  return (
    <div className="notebook-grid">
      {notebooks.map((n) => (
        <button
          key={n.id}
          type="button"
          onClick={() => onNotebookClick(n)}
          style={{
            all: "unset",
            cursor: "pointer",
            display: "block",
            width: "100%",
          }}
          aria-label={`Open notebook ${n.title}`}
        >
          <NotebookCard n={n} />
        </button>
      ))}
    </div>
  );
}
