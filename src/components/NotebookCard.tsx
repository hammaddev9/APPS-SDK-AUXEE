import React from "react";
import { Notebook } from "src/types";

interface Props {
  readonly n: Readonly<Notebook>;
}

export function NotebookCard({ n }: Readonly<Props>) {
  return (
    <div className="notebook-card">
      <h3>{n.title}</h3>
      <p>
        {n.owner ? `By ${n.owner}` : "Unknown"} ·{" "}
        {n.updatedAt ? new Date(n.updatedAt).toLocaleDateString() : ""}
      </p>
    </div>
  );
}
