'use client';

import { useState } from 'react';
import { Upload, CheckCircle2, AlertCircle, FileAudio, Loader2 } from 'lucide-react';
import { getPresignedUrl } from '../actions/upload';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'getting_url' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Basic validation
      if (!selectedFile.type.startsWith('audio/')) {
        setErrorMessage('請選擇有效的音訊檔案 (MP3, WAV, M4A)');
        setStatus('error');
        return;
      }
      if (selectedFile.size > 100 * 1024 * 1024) { // 100MB limit
        setErrorMessage('檔案大小不能超過 100MB');
        setStatus('error');
        return;
      }
      
      setFile(selectedFile);
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setStatus('getting_url');
      
      // 1. Get Presigned URL
      const presignedData = await getPresignedUrl(file.name, file.type);
      
      if (!presignedData.success || !presignedData.url) {
        throw new Error(presignedData.error || '無法取得上傳連結');
      }

      setStatus('uploading');

      // 2. Upload to S3
      const uploadResponse = await fetch(presignedData.url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('上傳至儲存桶失敗');
      }

      setStatus('success');
      setFile(null); // Clear file after success
    } catch (error: any) {
      console.error('Upload failed:', error);
      setStatus('error');
      setErrorMessage(error.message || '上傳過程中發生錯誤');
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-border-subtle">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-normal text-brand-primary mb-3">
              錄音檔上傳
            </h1>
            <p className="text-text-secondary">
              Phase 1 手動驗證專用。請上傳家訪錄音檔，我們將在 24 小時內處理完畢。
            </p>
          </div>

          <div className="space-y-6">
            {/* File Drop Zone Visual */}
            <div className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-colors ${
              status === 'error' ? 'border-red-300 bg-red-50' : 
              file ? 'border-brand-accent bg-surface-variant/20' : 'border-border-strong hover:border-brand-accent hover:bg-surface-variant/10'
            }`}>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={status === 'uploading' || status === 'getting_url'}
              />
              
              <div className="flex flex-col items-center justify-center gap-4 pointer-events-none">
                {file ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                      <FileAudio className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{file.name}</p>
                      <p className="text-sm text-text-secondary">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-text-muted">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">點擊或拖曳檔案至此</p>
                      <p className="text-sm text-text-secondary">支援 MP3, WAV, M4A (Max 100MB)</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Error Message */}
            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}

            {/* Success Message */}
            {status === 'success' && (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 p-4 rounded-lg">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-medium">上傳成功！</p>
                  <p className="text-sm">我們已收到您的錄音，處理完成後將寄送至您的信箱。</p>
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleUpload}
              disabled={!file || status === 'uploading' || status === 'getting_url'}
              className="w-full py-4 rounded-xl bg-brand-primary text-white font-medium text-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === 'getting_url' || status === 'uploading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {status === 'getting_url' ? '準備上傳...' : '上傳中...'}
                </>
              ) : (
                '開始上傳'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
