import { FileDown, Download } from "lucide-react";
import { downloadFile } from "../lib/api";
import { useState } from "react";

export default function ExportPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleExport = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      await downloadFile("/export/csv", "inventory-export.csv");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to export inventory data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>

      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-full">
                <FileDown className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Export Inventory Data
            </h1>
            <p className="text-lg text-gray-600">
              Download your complete inventory in CSV format for easy analysis and sharing
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-red-800">Export Failed</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Export Successful</h3>
                <p className="text-green-700 text-sm">Your inventory data has been downloaded</p>
              </div>
            </div>
          )}

          {/* Main Export Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-8">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">CSV Export</h2>
                  <p className="text-blue-100 text-sm">Standard, universal format</p>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8">
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">What's included:</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Product names and SKU codes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Categories and stock quantities</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Pricing information and current status</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-8 border border-blue-100">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-blue-900">💡 Tip:</span> CSV files can be opened with Excel, Google Sheets, or any spreadsheet application. Perfect for data analysis and backup.
                </p>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl"
              >
                <Download className="w-5 h-5" />
                {isLoading ? "Preparing Download..." : "Download CSV File"}
              </button>

              <p className="text-center text-gray-500 text-sm mt-4">
                File will be saved as <code className="bg-gray-100 px-2 py-1 rounded">inventory-export.csv</code>
              </p>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-2">📊 Large Datasets</h3>
              <p className="text-gray-600 text-sm">CSV format handles large inventories efficiently without file size limitations</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-2">🔄 Easy Integration</h3>
              <p className="text-gray-600 text-sm">Import your data to other systems or use for reporting and analysis</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
