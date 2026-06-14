"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResponse(null);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/analyze-file", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze dataset. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900">
            AI Business Analytics Dashboard
          </h1>

          <p className="mt-3 text-lg text-slate-600">
            Upload business datasets and generate analytical insights.
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            Upload Dataset
          </h2>

          <input
            type="file"
            accept=".csv,.xlsx"
            className="block w-full text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium hover:file:bg-blue-100"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setFile(e.target.files[0]);
              }
            }}
          />

          {file && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-blue-700 font-medium">{file.name}</p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            {loading ? "Analyzing..." : "Upload & Analyze"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
            {error}
          </div>
        )}

        {/* Empty Dataset */}
        {response?.is_empty && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl">
            Uploaded dataset is empty.
          </div>
        )}

        {/* Results */}
        {response && !response.is_empty && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <KpiCard title="Rows" value={response.rows} />
              <KpiCard title="Columns" value={response.columns} />
              <KpiCard
                title="Missing Values"
                value={response.missing_values.total}
              />
              <KpiCard title="Duplicates" value={response.duplicates} />
              <KpiCard
                title="Numerical Features"
                value={response.numerical_features.length}
              />
              <KpiCard
                title="Categorical Features"
                value={response.categorical_features.length}
              />
            </div>

            {/* Features */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-slate-900">
                Dataset Features ({response.features.length})
              </h2>

              <div className="flex flex-wrap gap-3">
                {response.features.map((feature: string) => (
                  <span
                    key={feature}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-blue-50 hover:text-blue-700 transition"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Dataset Preview */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-6 text-slate-900">
                Dataset Preview
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200">
                      {Object.keys(response.preview[0] || {}).map((col) => (
                        <th
                          key={col}
                          className="text-left p-3 font-semibold text-slate-700"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {response.preview.map(
                      (row: any, index: number) => (
                        <tr
                          key={index}
                          className="border-b border-slate-100 hover:bg-slate-50"
                        >
                          {Object.values(row).map(
                            (value: any, i: number) => (
                              <td
                                key={i}
                                className="p-3 text-slate-600"
                              >
                                {String(value)}
                              </td>
                            )
                          )}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function KpiCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <p className="text-slate-500 text-sm mb-2">{title}</p>

      <h3 className="text-5xl font-bold text-slate-900">
        {value}
      </h3>
    </div>
  );
}