import React from "react";

interface Props {
  readonly newTitle: string;
  readonly onChange: (val: string) => void;
  readonly onCreate: () => void;
}

export function CreateNotebookForm({ newTitle, onChange, onCreate }: Readonly<Props>) {
  return (
    <div className="create-form">
      <input
        type="text"
        placeholder="New notebook title..."
        value={newTitle}
        onChange={(e) => onChange(e.target.value)}
      />
      <button onClick={onCreate}>➕ Create</button>
    </div>
  );
}
