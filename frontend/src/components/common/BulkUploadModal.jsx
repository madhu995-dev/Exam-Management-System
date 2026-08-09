import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, Download, X } from 'lucide-react';

const BulkUploadModal = ({
  isOpen,
  onClose,
  title,
  entityName,
  sampleCsv,
  requiredColumns,
  onUpload,
}) => {
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setError('');
    setResults(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileContent(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleDownloadSample = () => {
    const blob = new Blob([sampleCsv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `sample_${entityName.toLowerCase()}_template.csv`;
    link.click();
    window.URL.revokeObjectURL(link.href);
  };

  const parseCsv = (text) => {
    const lines = text.trim().split('\n').filter((l) => l.trim().length > 0);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
      if (values.length === headers.length) {
        const obj = {};
        headers.forEach((h, idx) => {
          obj[h] = values[idx];
        });
        rows.push(obj);
      }
    }
    return rows;
  };

  const handleStartImport = async () => {
    if (!fileContent) {
      setError('Please select or paste CSV data first');
      return;
    }

    const records = parseCsv(fileContent);
    if (records.length === 0) {
      setError('No valid CSV data rows found. Ensure file has header row and content.');
      return;
    }

    setUploading(true);
    setError('');
    setProgress({ current: 0, total: records.length });

    try {
      const summary = await onUpload(records, (current) => {
        setProgress({ current, total: records.length });
      });
      setResults(summary);
    } catch (err) {
      setError(err.message || 'Bulk upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFileContent('');
    setFileName('');
    setResults(null);
    setError('');
    setProgress({ current: 0, total: 0 });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UploadCloud size={22} style={{ color: 'var(--primary-500)' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{title || `Bulk Import ${entityName}`}</h3>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {error && <div className="alert alert-danger">{error}</div>}

          {!results ? (
            <>
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px dashed var(--primary-500)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  textAlign: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <UploadCloud size={40} style={{ color: 'var(--primary-500)', marginBottom: '0.75rem' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                  Upload CSV File or Paste Data
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Select a CSV file formatted with headers: <code>{requiredColumns.join(', ')}</code>
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                  <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
                    <FileText size={16} /> Choose CSV File
                    <input type="file" accept=".csv, .txt" onChange={handleFileChange} style={{ display: 'none' }} />
                  </label>

                  <button onClick={handleDownloadSample} className="btn btn-secondary btn-sm" type="button">
                    <Download size={16} /> Download Sample Template
                  </button>
                </div>

                {fileName && (
                  <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--accent-emerald)', fontWeight: '600' }}>
                    Selected File: {fileName}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rawCsv">Or Paste CSV Content Directly</label>
                <textarea
                  id="rawCsv"
                  className="form-control"
                  rows="4"
                  style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
                  placeholder={`header1,header2,header3\nval1,val2,val3`}
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                />
              </div>

              {uploading && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <span>Processing Batch Upload...</span>
                    <strong>{progress.current} / {progress.total}</strong>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-card)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${progress.total ? (progress.current / progress.total) * 100 : 0}%`,
                        background: 'var(--primary-500)',
                        transition: 'width 0.2s ease',
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <CheckCircle2 size={50} style={{ color: 'var(--accent-emerald)', marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                Bulk Import Completed!
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Successfully processed <strong>{results.successCount}</strong> out of <strong>{results.total}</strong> records.
              </p>

              {results.failedRecords && results.failedRecords.length > 0 && (
                <div className="alert alert-warning" style={{ textAlign: 'left', maxHeight: '160px', overflowY: 'auto' }}>
                  <strong>{results.failedRecords.length} Failed Records:</strong>
                  <ul style={{ margin: '0.5rem 0 0 1rem', fontSize: '0.8rem' }}>
                    {results.failedRecords.map((f, i) => (
                      <li key={i}>
                        Row #{f.index + 1}: {f.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          {!results ? (
            <>
              <button onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button
                onClick={handleStartImport}
                className="btn btn-primary"
                disabled={uploading || !fileContent.trim()}
              >
                {uploading ? 'Importing Batch...' : 'Start Bulk Import'}
              </button>
            </>
          ) : (
            <>
              <button onClick={handleReset} className="btn btn-secondary">
                Import Another Batch
              </button>
              <button onClick={onClose} className="btn btn-primary">
                Done
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkUploadModal;
