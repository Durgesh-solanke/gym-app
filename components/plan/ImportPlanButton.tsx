"use client";
import { useState, useRef } from "react";
import { Upload, Download, X, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

export function ImportPlanButton() {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const downloadTemplate = () => {
    window.location.href = "/api/plans/template";
    setResult({ ok: true, message: "Template downloaded! Check your downloads folder." });
    setTimeout(() => setResult(null), 3000);
  };

  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setResult({ ok: false, message: "Please upload an .xlsx or .xls file" });
      return;
    }
    setLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/plans/import", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setResult({ ok: true, message: `Plan "${data.planName}" created with ${data.daysCreated} days!` });
        setTimeout(() => { setOpen(false); setResult(null); router.refresh(); }, 2000);
      } else {
        setResult({ ok: false, message: data.error });
      }
    } catch {
      setResult({ ok: false, message: "Upload failed. Please try again." });
    }
    setLoading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 border border-violet-300 text-violet-600 text-sm px-4 py-2 rounded-lg hover:bg-violet-50 transition-colors"
      >
        <Upload size={16} /> Import from Excel
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl space-y-5 p-6">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Import plan from Excel</h3>
              <button onClick={() => { setOpen(false); setResult(null); }}>
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 flex items-start gap-3">
              <Download size={18} className="text-violet-500 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-violet-800">Step 1 — Download the template</p>
                <p className="text-xs text-violet-600 mt-0.5">
                  Fill in your plan name, days and exercises. A reference sheet is included with valid values.
                </p>
                <button
                  onClick={downloadTemplate}
                  className="mt-2 text-xs bg-violet-600 text-white px-3 py-1.5 rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Download gym-buddy-plan-template.xlsx
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Step 2 — Upload your filled file</p>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
                  ${dragging ? "border-violet-400 bg-violet-50" : "border-gray-200 hover:border-violet-300 hover:bg-gray-50"}`}
              >
                <Upload size={24} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">{loading ? "Uploading..." : "Drag & drop your .xlsx file here"}</p>
                <p className="text-xs text-gray-400 mt-1">or click to browse</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file); }}
                />
              </div>
            </div>

            {result && (
              <div className={`flex items-start gap-2 p-3 rounded-xl text-sm
                ${result.ok ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
                {result.ok ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> : <AlertCircle size={16} className="mt-0.5 shrink-0" />}
                {result.message}
              </div>
            )}

            <div className="text-xs text-gray-400 space-y-1">
              <p>· One row per exercise per day</p>
              <p>· For rest days set is_rest_day to <strong>yes</strong> and leave exercise columns empty</p>
              <p>· Importing will activate the new plan automatically</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
