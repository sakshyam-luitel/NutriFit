import React, { useState, useEffect } from 'react';
import { medicalAPI } from '../api';

const MedicalReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [reportType, setReportType] = useState('blood_test');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await medicalAPI.getMedicalReports();
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage('Please select a file');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      await medicalAPI.uploadReport({
        file: selectedFile,
        report_type: reportType,
      });
      setMessage('Report uploaded successfully!');
      setSelectedFile(null);
      e.target.reset();
      await fetchReports();
    } catch (error) {
      setMessage('Error uploading report');
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async (reportId) => {
    setAnalyzing(reportId);
    setMessage('');

    try {
      await medicalAPI.analyzeReport(reportId);
      setMessage('Report analyzed successfully!');
      await fetchReports();
    } catch (error) {
      setMessage('Error analyzing report');
    } finally {
      setAnalyzing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading medical reports...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Medical Reports</h1>

        {message && (
          <div className={`mb-6 p-4 rounded ${
            message.includes('success')
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-4">Upload Medical Report</h2>
          <p className="text-gray-600 mb-4">
            Upload your medical documents (blood reports, prescriptions, etc.) for AI analysis
          </p>

          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="blood_test">Blood Test</option>
                <option value="prescription">Prescription</option>
                <option value="diagnosis">Diagnosis Report</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select File
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Report'}
            </button>
          </form>
        </div>

        {/* Reports List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Medical Reports</h2>
          {reports.length > 0 ? (
            <div className="space-y-6">
              {reports.map((report) => (
                <div key={report.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-white capitalize">
                          {report.report_type.replace('_', ' ')}
                        </h3>
                        <p className="text-white/90 text-sm">
                          {new Date(report.scan_date).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        report.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : report.status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    {report.status === 'pending' && (
                      <button
                        onClick={() => handleAnalyze(report.id)}
                        disabled={analyzing === report.id}
                        className="mb-4 bg-secondary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary disabled:opacity-50"
                      >
                        {analyzing === report.id ? 'Analyzing...' : 'Analyze Report'}
                      </button>
                    )}

                    {report.detected_conditions && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Detected Conditions:</h4>
                        <div className="flex flex-wrap gap-2">
                          {report.detected_conditions.split(',').map((condition, idx) => (
                            <span
                              key={idx}
                              className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                            >
                              {condition.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {report.health_metrics && Object.keys(report.health_metrics).length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Health Metrics:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(report.health_metrics)
                            .filter(([key]) => !key.endsWith('_status'))
                            .map(([key, value]) => (
                              <div key={key} className="bg-gray-50 p-3 rounded">
                                <div className="text-sm text-gray-600 capitalize">
                                  {key.replace('_', ' ')}
                                </div>
                                <div className="text-lg font-bold">{value}</div>
                                {report.health_metrics[`${key}_status`] && (
                                  <div className={`text-xs mt-1 ${
                                    report.health_metrics[`${key}_status`] === 'normal'
                                      ? 'text-green-600'
                                      : 'text-red-600'
                                  }`}>
                                    {report.health_metrics[`${key}_status`]}
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {report.ai_insights && (
                      <div className="mb-4 p-4 bg-blue-50 rounded">
                        <h4 className="font-semibold mb-2 text-blue-900">AI Insights:</h4>
                        <p className="text-sm text-blue-700">{report.ai_insights}</p>
                      </div>
                    )}

                    {report.dietary_recommendations && (
                      <div className="p-4 bg-green-50 rounded">
                        <h4 className="font-semibold mb-2 text-green-900">Dietary Recommendations:</h4>
                        <p className="text-sm text-green-700 whitespace-pre-line">
                          {report.dietary_recommendations}
                        </p>
                      </div>
                    )}

                    {report.extracted_text && (
                      <details className="mt-4">
                        <summary className="cursor-pointer font-semibold text-gray-700 hover:text-primary">
                          View Extracted Text
                        </summary>
                        <div className="mt-2 p-4 bg-gray-50 rounded text-sm text-gray-600 whitespace-pre-wrap">
                          {report.extracted_text}
                        </div>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-lg shadow text-center">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-gray-500 mb-4">No medical reports uploaded yet</p>
              <p className="text-sm text-gray-400">Upload your first report to get AI-powered health insights</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalReports;