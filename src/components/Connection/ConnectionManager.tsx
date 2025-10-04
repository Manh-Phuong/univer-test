import React, { useEffect, useState } from 'react';
import { useConnection } from '../../hooks/useConnection';
import { DataConnection } from '../../types/template.types';
import { CreateConnectionModal } from './CreateConnectionModal';

export const ConnectionManager: React.FC = () => {
  const { listConnections, deleteConnection, testConnection } = useConnection();
  const [connections, setConnections] = useState<DataConnection[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    const result = await listConnections();
    if (result.success && result.data) {
      setConnections(result.data);
    }
  };

  const handleDelete = async (connectionId: string) => {
    if (!confirm('Are you sure you want to delete this connection?')) return;

    const result = await deleteConnection(connectionId);
    if (result.success) {
      loadConnections();
      alert('Connection deleted');
    }
  };

  const handleTest = async (connectionId: string) => {
    setTestingId(connectionId);
    const result = await testConnection(connectionId);
    setTestingId(null);

    if (result.success) {
      alert('✅ Connection successful!');
    } else {
      alert(`❌ Connection failed: ${result.error}`);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>Data Connections</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          + New Connection
        </button>
      </div>

      {connections.length === 0 ? (
        <p style={{ color: '#999' }}>No connections yet. Create one to connect to your data sources.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {connections.map((conn) => (
            <div
              key={conn.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#fff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{conn.name}</h3>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                    <div>Type: <strong>{conn.type}</strong></div>
                    <div>Host: {conn.host}:{conn.port}</div>
                    {conn.type === 'trino' && conn.catalog && (
                      <div>Catalog: {conn.catalog} / Schema: {conn.schema || 'default'}</div>
                    )}
                    {conn.type === 'postgresql' && conn.database_name && (
                      <div>Database: {conn.database_name}</div>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    Created: {new Date(conn.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleTest(conn.id)}
                    disabled={testingId === conn.id}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: testingId === conn.id ? '#ccc' : '#28a745',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: testingId === conn.id ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    {testingId === conn.id ? 'Testing...' : 'Test'}
                  </button>
                  <button
                    onClick={() => handleDelete(conn.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateConnectionModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadConnections();
          }}
        />
      )}
    </div>
  );
};