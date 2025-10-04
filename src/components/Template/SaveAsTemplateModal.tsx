import React, { useState } from "react";
import { useTemplate } from "../../hooks/useTemplate";

interface Props {
  snapshot: any; // Changed from workbookId
  onClose: () => void;
  onSuccess: () => void;
}

export const SaveAsTemplateModal: React.FC<Props> = ({
  snapshot,
  onClose,
  onSuccess,
}) => {
  const { createTemplate, isLoading } = useTemplate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = async () => {
    if (!name) {
      alert("Please enter template name");
      return;
    }

    if (!snapshot) {
      alert("No snapshot available");
      return;
    }

    const result = await createTemplate({
      name,
      description,
      snapshot, // Pass directly
    });

    if (result.success) {
      onSuccess();
    } else {
      alert(`Failed: ${result.error}`);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "24px",
          width: "90%",
          maxWidth: "500px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: "0 0 24px 0" }}>Save as Template</h2>

        <div style={{ marginBottom: "16px" }}>
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
          >
            Template Name: *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Monthly Sales Report"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
          >
            Description (optional):
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Template for monthly sales reporting"
            rows={3}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
              resize: "vertical",
            }}
          />
        </div>

        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            style={{
              padding: "8px 16px",
              backgroundColor: isLoading ? "#ccc" : "#9c27b0",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "Saving..." : "Save Template"}
          </button>
        </div>
      </div>
    </div>
  );
};
