import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import GlowCard from '../ui/GlowCard';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function BodyScanUploader({ onMeasurementsExtracted }) {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setError(null);

    try {
      // Upload the file
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      // Extract measurement data from the file
      const result = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            measurements: {
              type: "object",
              properties: {
                chest: { type: "number" },
                waist: { type: "number" },
                hips: { type: "number" },
                shoulder_width: { type: "number" },
                sleeve_length: { type: "number" },
                inseam: { type: "number" },
                torso_length: { type: "number" },
                back_length: { type: "number" }
              }
            },
            unit: { type: "string", enum: ["inches", "cm"] },
            body_type: { type: "string" },
            scan_date: { type: "string" }
          }
        }
      });

      if (result.status === 'success' && result.output) {
        onMeasurementsExtracted(result.output);
      } else {
        setError(result.details || 'Failed to extract measurements from file');
      }
    } catch (err) {
      setError('Error processing body scan file. Please ensure it contains valid measurement data.');
      console.error('Body scan upload error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <GlowCard glowColor="cyan" className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-400 border-2 border-black">
          <Upload className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Import Body Scan Data</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload measurements from other apps (JSON, CSV, Excel)
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* File Input */}
        <label className="block">
          <input
            type="file"
            accept=".json,.csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
            id="body-scan-upload"
          />
          <div className="cursor-pointer border-3 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
            {file ? (
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-5 h-5 text-purple-500" />
                <span className="font-medium text-gray-700 dark:text-gray-300">{file.name}</span>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Click to select a file
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JSON, CSV, or Excel files supported
                </p>
              </>
            )}
          </div>
        </label>

        {/* Upload Button */}
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              onClick={handleUpload}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Extract Measurements
                </>
              )}
            </Button>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-2 p-3 bg-red-50 border-2 border-red-300 rounded-lg"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </motion.div>
        )}

        {/* Info */}
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p className="font-medium">Supported formats:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-2">
            <li>3D body scan apps (JSON export)</li>
            <li>Measurement tracking spreadsheets</li>
            <li>Tailor measurement records</li>
          </ul>
        </div>
      </div>
    </GlowCard>
  );
}