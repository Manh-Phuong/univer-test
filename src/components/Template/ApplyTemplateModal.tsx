import React, { useEffect, useState } from 'react';
import { useTemplate } from '../../hooks/useTemplate';
import { useConnection } from '../../hooks/useConnection';
import { Template, DataConnection, ColumnMapping } from '../../types/template.types';

interface Props {
  template: Template;
  onClose: () => void;
  onSuccess: (workbookId: string) => void;
}

export const ApplyTemplateModal: React.FC<Props> = ({ template, onClose, onSuccess }) => {
  const { applyTemplate, isLoading } = useTemplate();
  const { listConnections } = useConnection();

  const [workbookName, setWorkbookName] = useState(`${template.name} - ${new Date().toLocaleDateString()}`);
  const [useDataSource, setUseDataSource] = useState(false);
  
  // Connection config
  const [connections, setConnections] = useState<DataConnection[]>([]);
  const [selectedConnectionId, setSelectedConnectionId] = useState('');
  const [queryText, setQueryText] = useState('');
  const [dataStartRow, setDataStartRow] = useState(1);
  const [sheetId, setSheetId] = useState('sheet-1');
  
  // Query params
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [paramKey, setParamKey] = useState('');
  const [paramValue, setParamValue] = useState('');

  // Column mapping
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [queryColumn, setQueryColumn] = useState('');
  const [sheetColumn, setSheetColumn] = useState('0');
  const [format, setFormat] = useState<'currency' | 'number' | 'percentage' | 'date' | ''>('');

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    const result = await listConnections();
    if (result.success && result.data) {
      setConnections(result.data);
    }
  };

  const addQueryParam = () => {
    if (paramKey && paramValue) {
      setQueryParams({ ...queryParams, [paramKey]: paramValue });
      setParamKey('');
      setParamValue('');
    }
  };

  const removeQueryParam = (key: string) => {
    const newParams = { ...queryParams };
    delete newParams[key];
    setQueryParams(newParams);
  };

  const addColumnMapping = () => {
    if (queryColumn && sheetColumn) {
      setColumnMappings([
        ...columnMappings,
        {
          queryColumn,
          sheetColumn: parseInt(sheetColumn),
          format: format || undefined,
        },
      ]);
      setQueryColumn('');
      setSheetColumn('0');
      setFormat('');
    }
  };

  const removeColumnMapping = (index: number) => {
    setColumnMappings(columnMappings.filter((_, i) => i !== index));
  };

  const handleApply = async () => {
    if (!workbookName) {
      alert('Please enter workbook name');
      return;
    }

    if (useDataSource) {
      if (!selectedConnectionId || !queryText || columnMappings.length === 0) {
        alert('Please fill in connection, query, and column mappings');
        return;
      }
    }

    const result = await applyTemplate(template.id, {
      name: workbookName,
      connectionId: useDataSource ? selectedConnectionId : undefined,
      queryText: useDataSource ? queryText : undefined,
      dataStartRow: useDataSource ? dataStartRow : undefined,
      sheetId: useDataSource ? sheetId : undefined,
      columnMappings: useDataSource ? columnMappings : undefined,
    });

    if (result.success && result.data) {
      alert('Workbook created successfully!');
      onSuccess(result.data.id);
    } else {
      alert(`Failed: ${result.error}`);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '24px',
          width: '90%',
          maxWidth: '700px',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: '0 0 24px 0' }}>Apply Template: {template.name}</h2>

        {/* Workbook Name */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Workbook Name:
          </label>
          <input
            type="text"
            value={workbookName}
            onChange={(e) => setWorkbookName(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
        </div>

        {/* Data Source Toggle */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={useDataSource}
              onChange={(e) => setUseDataSource(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            <span>Connect Data Source</span>
          </label>
        </div>

        {useDataSource && (
          <>
            {/* Connection Selection */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Connection:
              </label>
              <select
                value={selectedConnectionId}
                onChange={(e) => setSelectedConnectionId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              >
                <option value="">Select connection...</option>
                {connections.map((conn) => (
                  <option key={conn.id} value={conn.id}>
                    {conn.name} ({conn.type} - {conn.host}:{conn.port})
                  </option>
                ))}
              </select>
            </div>

            {/* Query Text */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Query:
              </label>
              <textarea
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="SELECT column1, column2 FROM table WHERE condition = :param"
                rows={4}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                }}
              />
            </div>

            {/* Query Params */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Query Parameters:
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  placeholder="Key (e.g., month)"
                  value={paramKey}
                  onChange={(e) => setParamKey(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                />
                <input
                  type="text"
                  placeholder="Value (e.g., 10)"
                  value={paramValue}
                  onChange={(e) => setParamValue(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                />
                <button
                  onClick={addQueryParam}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#28a745',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Add
                </button>
              </div>
              {Object.entries(queryParams).map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    marginBottom: '4px',
                  }}
                >
                  <span>
                    {key}: {value}
                  </span>
                  <button
                    onClick={() => removeQueryParam(key)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Data Start Row */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Insert data starting from row:
              </label>
              <input
                type="number"
                value={dataStartRow}
                onChange={(e) => setDataStartRow(parseInt(e.target.value))}
                min={0}
                style={{
                  width: '100px',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              />
            </div>

            {/* Column Mapping */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Column Mapping:
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  placeholder="Query column"
                  value={queryColumn}
                  onChange={(e) => setQueryColumn(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                />
                <input
                  type="number"
                  placeholder="Sheet column (0=A, 1=B)"
                  value={sheetColumn}
                  onChange={(e) => setSheetColumn(e.target.value)}
                  style={{
                    width: '150px',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                />
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  style={{
                    width: '120px',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                >
                  <option value="">No format</option>
                  <option value="currency">Currency</option>
                  <option value="number">Number</option>
                  <option value="percentage">Percentage</option>
                  <option value="date">Date</option>
                </select>
                <button
                  onClick={addColumnMapping}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#28a745',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Add
                </button>
              </div>
              {columnMappings.map((mapping, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    marginBottom: '4px',
                  }}
                >
                  <span>
                    {mapping.queryColumn} → Column {String.fromCharCode(65 + mapping.sheetColumn)}
                    {mapping.format && ` (${mapping.format})`}
                  </span>
                  <button
                    onClick={() => removeColumnMapping(index)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={isLoading}
            style={{
              padding: '8px 16px',
              backgroundColor: isLoading ? '#ccc' : '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Creating...' : 'Create Workbook'}
          </button>
        </div>
      </div>
    </div>
  );
};