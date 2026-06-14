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
      <KpiCard title="Missing Values" value={response.missing_values.total} />
      <KpiCard title="Duplicates" value={response.duplicates} />
      <KpiCard title="Numerical Features" value={response.numerical_features.length} />
      <KpiCard title="Categorical Features" value={response.categorical_features.length} />
    </div>

    {/* Missing Values Breakdown */}
    <details className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mb-6">
      <summary className="cursor-pointer text-2xl font-semibold text-slate-900">
        Missing Values Breakdown ({Object.keys(response.missing_values.columns || {}).length})
      </summary>
      <div className="mt-6 space-y-3">
        {response.missing_values.columns &&
          Object.entries(response.missing_values.columns).map(([feature, count]: any) => (
            <div key={feature} className="flex justify-between items-center border-b border-slate-100 py-2">
              <span className="font-medium text-slate-700">{feature}</span>
              <span className="text-red-600 font-semibold">{count} missing</span>
            </div>
          ))}
      </div>
    </details>

    {/* Numerical Features */}
    <details className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mb-6">
      <summary className="cursor-pointer text-2xl font-semibold text-slate-900">
        Numerical Features ({response.numerical_features.length})
      </summary>
      <div className="flex flex-wrap gap-3 mt-6">
        {response.numerical_features.map((feature: string) => (
          <span key={feature} className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700">
            {feature}
          </span>
        ))}
      </div>
    </details>

    {/* Categorical Features */}
    <details className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mb-6">
      <summary className="cursor-pointer text-2xl font-semibold text-slate-900">
        Categorical Features ({response.categorical_features.length})
      </summary>
      <div className="flex flex-wrap gap-3 mt-6">
        {response.categorical_features.map((feature: string) => (
          <span key={feature} className="px-4 py-2 rounded-lg bg-green-50 text-green-700">
            {feature}
          </span>
        ))}
      </div>
    </details>

    {/* Correlation Analysis */}
    <details className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mb-6">
      <summary className="cursor-pointer text-2xl font-semibold text-slate-900">Correlation Analysis</summary>
      <div className="mt-6">
        <h3 className="font-semibold text-slate-700 mb-3">Strongly Correlated Features (|{`>`}0.5|)</h3>
        <div className="flex flex-wrap gap-3">
          {response.correlation?.relevant.map((feature: string) => (
            <span key={feature} className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700">
              {feature} ({response.correlation.all[feature].toFixed(2)})
            </span>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <h3 className="font-semibold text-slate-700 mb-3">Weakly Correlated Features (|{`<`}0.3|)</h3>
        <div className="flex flex-wrap gap-3">
          {response.correlation?.irrelevant.map((feature: string) => (
            <span key={feature} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700">
              {feature} ({response.correlation.all[feature].toFixed(2)})
            </span>
          ))}
        </div>
      </div>
    </details>

    {/* Outlier Detection */}
    <details className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mb-6">
      <summary className="cursor-pointer text-2xl font-semibold text-slate-900">
        Outlier Detection ({Object.keys(response.outliers).length})
      </summary>
      <div className="mt-6 space-y-3">
        {Object.entries(response.outliers)
          .sort((a: any, b: any) => b[1] - a[1])
          .map(([feature, count]: any) => (
            <div key={feature} className="flex justify-between border-b border-slate-100 py-2">
              <span className="text-slate-700">{feature}</span>
              <span className="font-semibold text-orange-600">{count} outliers</span>
            </div>
          ))}
      </div>
    </details>

    {/* Unique Values (Categorical) */}
    <details className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mb-6">
      <summary className="cursor-pointer text-2xl font-semibold text-slate-900">
        Categorical Unique Values
      </summary>
      <div className="mt-6 grid gap-4">
        {Object.entries(response.unique).map(([feature, value]: any) => (
          <details
          key={feature}
          className="group border border-slate-200 rounded-xl bg-slate-50 overflow-hidden"
        >
          <summary className="cursor-pointer list-none flex items-center justify-between px-5 py-4 font-medium text-slate-800 hover:bg-slate-100 transition">
            <span>{feature}</span>
        
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">
                {value.count} values
              </span>
        
              <span className="group-open:rotate-180 transition-transform">
                ▼
              </span>
            </div>
          </summary>
        
          <div className="px-5 pb-5 border-t border-slate-200">
            <div className="flex flex-wrap gap-2 mt-4">
              {value.types.map((v: string) => (
                <span
                  key={v}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        </details>
        ))}
      </div>
    </details>

    {/* Dataset Features */}
    <details className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mb-8">
      <summary className="cursor-pointer text-2xl font-semibold text-slate-900">
        Dataset Features ({response.features.length})
      </summary>
      <div className="flex flex-wrap gap-3 mt-6">
        {response.features.map((feature: string) => (
          <span key={feature} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-blue-50 hover:text-blue-700 transition">
            {feature}
          </span>
        ))}
      </div>
    </details>

    {/* Dataset Preview */}
    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
      <h2 className="text-2xl font-semibold mb-6 text-slate-900">Dataset Preview</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              {Object.keys(response.preview[0] || {}).map((col) => (
                <th key={col} className="text-left p-3 font-semibold text-slate-700 whitespace-nowrap">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {response.preview.map((row: any, index: number) => (
              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                {Object.values(row).map((value: any, i: number) => (
                  <td key={i} className="p-3 text-slate-600 whitespace-nowrap">
                    {String(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
            {/* AI Insights */}
{response.ai_insights && (
  <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mt-8">
    <h2 className="text-2xl font-semibold text-slate-900 mb-8">
      AI Business Insights
    </h2>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Executive Summary */}
      <div className="lg:col-span-2 bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Executive Summary
        </h3>

        <p className="text-slate-700 leading-7">
          {response.ai_insights.executive_summary}
        </p>
      </div>

      {/* Key Insights */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Key Insights
        </h3>

        <ul className="space-y-3">
          {response.ai_insights.key_insights.map(
            (insight: string, index: number) => (
              <li
                key={index}
                className="text-slate-700 flex gap-3"
              >
                <span className="text-blue-600 font-bold">•</span>
                <span>{insight}</span>
              </li>
            )
          )}
        </ul>
      </div>

      {/* Risks */}
      <div className="bg-white border border-red-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-red-700 mb-4">
          Risks
        </h3>

        <ul className="space-y-3">
          {response.ai_insights.risks.map(
            (risk: string, index: number) => (
              <li
                key={index}
                className="text-slate-700 flex gap-3"
              >
                <span className="text-red-500 font-bold">⚠</span>
                <span>{risk}</span>
              </li>
            )
          )}
        </ul>
      </div>

      {/* Recommendations */}
      <div className="lg:col-span-2 bg-green-50 border border-green-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-green-800 mb-4">
          Recommendations
        </h3>

        <ul className="space-y-3">
          {response.ai_insights.recommendations.map(
            (rec: string, index: number) => (
              <li
                key={index}
                className="text-slate-700 flex gap-3"
              >
                <span className="text-green-600 font-bold">✓</span>
                <span>{rec}</span>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  </div>
)}
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
    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition">
      <p className="text-slate-500 text-sm mb-3">{title}</p>

      <h3 className="text-5xl font-bold text-slate-900">
        {value}
      </h3>
    </div>
  );
}