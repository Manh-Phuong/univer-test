import React, { useEffect, useState } from "react";
import { useTemplate } from "../../hooks/useTemplate";
import { Template } from "../../types/template.types";

export const TemplateGallery: React.FC<{
  onWorkbookCreated?: (workbookId: string) => void;
}> = ({ onWorkbookCreated }) => {
  const { listTemplates, deleteTemplate, applyTemplate } = useTemplate();
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const result = await listTemplates();
    if (result.success && result.data) {
      setTemplates(result.data);
    }
  };

  const handleDelete = async (templateId: string) => {
    if (!confirm("Are you sure?")) return;

    const result = await deleteTemplate(templateId);
    if (result.success) {
      loadTemplates();
      alert("Template deleted");
    }
  };

  const handleUseTemplate = async (template: Template) => {
    // Apply template WITHOUT connection (create empty workbook)
    const result = await applyTemplate(template.id, {
      name: `${template.name} - ${new Date().toLocaleDateString()}`,
      // No connectionId - just create workbook from template
    });

    if (result.success && result.data) {
      alert("Workbook created from template!");
      if (onWorkbookCreated) {
        onWorkbookCreated(result.data.id);
      }
    } else {
      alert(`Failed: ${result.error}`);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h2 style={{ marginBottom: "24px" }}>Templates</h2>

      {templates.length === 0 ? (
        <p style={{ color: "#999" }}>
          No templates yet. Create one from a workbook!
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {templates.map((template) => (
            <div
              key={template.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                backgroundColor: "#fff",
              }}
            >
              <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>
                {template.name}
              </h3>

              {template.description && (
                <p
                  style={{
                    margin: "0 0 16px 0",
                    fontSize: "14px",
                    color: "#666",
                    minHeight: "40px",
                  }}
                >
                  {template.description}
                </p>
              )}

              <div
                style={{
                  fontSize: "12px",
                  color: "#999",
                  marginBottom: "16px",
                }}
              >
                Created: {new Date(template.created_at).toLocaleDateString()}
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => handleUseTemplate(template)}
                  style={{
                    flex: 1,
                    padding: "8px 16px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Use
                </button>
                <button
                  onClick={() => handleDelete(template.id)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
