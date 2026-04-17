import { FileText, FileSpreadsheet, File } from "lucide-react";
import { getApiBaseUrl } from "../lib/api";

export default function ExportPage() {
  const handleExport = (type) => {
    if (type === "CSV") {
      window.open(`${getApiBaseUrl()}/export/csv`, "_blank");
      return;
    }

    alert(`${type} export is not implemented yet. CSV is connected to the backend.`);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br">
      <div className="max-w-7xl mx-auto mt-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Export Inventory Data</h1>
        <p className="text-slate-500 mb-8">Download your inventory reports in multiple formats.</p>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          <div className="bg-white/80 backdrop-blur-md border p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Export PDF</h2>
              <FileText className="text-red-500" />
            </div>

            <p className="text-gray-500 mb-4">Download inventory report as a PDF file.</p>

            <button
              onClick={() => handleExport("PDF")}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2"
            >
              Download PDF
            </button>
          </div>

          <div className="bg-white/80 backdrop-blur-md border p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Export CSV</h2>
              <File className="text-green-500" />
            </div>

            <p className="text-gray-500 mb-4">Export inventory data in CSV format.</p>

            <button
              onClick={() => handleExport("CSV")}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
            >
              Download CSV
            </button>
          </div>

          <div className="bg-white/80 backdrop-blur-md border p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Export Excel</h2>
              <FileSpreadsheet className="text-blue-500" />
            </div>

            <p className="text-gray-500 mb-4">Download inventory spreadsheet.</p>

            <button
              onClick={() => handleExport("Excel")}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              Download Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
