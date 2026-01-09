'use client';

import { Play, FileText, CheckCircle2, Copy, Download, RefreshCw, Wand2, MessageSquare, FileJson, UploadCloud, FileAudio } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { MOCK_ISP, MOCK_SOAP, MOCK_TRANSCRIPT } from '../content/demo';

export default function DemoSection() {
  const [phase, setPhase] = useState<'idle' | 'uploading' | 'processing' | 'generating' | 'complete'>('idle');
  const [activeTab, setActiveTab] = useState<'ISP' | 'SOAP'>('ISP');
  const [uploadProgress, setUploadProgress] = useState(0);
  const transcriptRef = useRef<HTMLDivElement>(null);

  // Workflow Automation
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (phase === 'uploading') {
      interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setPhase('processing'), 500);
            return 100;
          }
          return prev + 5; // Upload speed
        });
      }, 50);
    }

    if (phase === 'processing') {
      const timer = setTimeout(() => {
        setPhase('generating');
      }, 2500); // Analysis time
      return () => clearTimeout(timer);
    }

    if (phase === 'generating') {
      const timer = setTimeout(() => {
        setPhase('complete');
      }, 2000); // Generation time
      return () => clearTimeout(timer);
    }

    return () => clearInterval(interval);
  }, [phase]);

  // Auto-scroll transcript when complete
  useEffect(() => {
    if ((phase === 'generating' || phase === 'complete') && transcriptRef.current) {
      transcriptRef.current.scrollTop = 0;
    }
  }, [phase]);

  const handleStartDemo = () => {
    setPhase('uploading');
    setUploadProgress(0);
    setActiveTab('ISP');
  };

  const handleReset = () => {
    setPhase('idle');
    setUploadProgress(0);
    setActiveTab('ISP');
  };

  return (
    <section className="px-4 py-20 bg-bg-secondary/50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-sm font-medium mb-4">
            <Wand2 className="w-4 h-4" />
            Interactive Demo
          </div>
          <h2 className="text-3xl md:text-4xl font-normal mb-4 text-text-primary">按下錄音，工作就完成了</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            別再把時間花在回想與登打。家訪結束的同時，您的訪視紀錄也準備好了。
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-stretch">
          
          {/* Step 1: Upload */}
          <div className={`flex flex-col h-full bg-bg-primary rounded-3xl border transition-all duration-300 ${phase === 'uploading' ? 'border-brand-primary shadow-lg ring-1 ring-brand-primary/20' : 'border-border-subtle shadow-sm'}`}>
            <div className="p-6 border-b border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${phase === 'uploading' ? 'bg-brand-primary text-white' : 'bg-surface-container text-text-secondary'}`}>
                  <UploadCloud className="w-5 h-5" />
                </div>
                <h3 className="font-medium text-text-primary">1. 錄音上傳</h3>
              </div>
              {phase !== 'idle' && (
                 <button onClick={handleReset} className="text-text-muted hover:text-text-primary transition-colors p-2" title="重置">
                    <RefreshCw className="w-4 h-4" />
                 </button>
              )}
            </div>
            
            <div className="p-6 flex-1 flex flex-col justify-center items-center">
              {phase === 'idle' ? (
                <div 
                  onClick={handleStartDemo}
                  className="w-full h-full min-h-[200px] border-2 border-dashed border-border-strong rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-brand-primary hover:bg-surface-container/50 transition-all group"
                >
                  <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-text-muted group-hover:text-brand-primary group-hover:scale-110 transition-all">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-text-primary mb-1">點擊上傳錄音檔</p>
                    <p className="text-xs text-text-muted">支援 MP3, WAV, M4A</p>
                  </div>
                  <button className="px-4 py-2 bg-brand-primary text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition-colors mt-2">
                    帶入範例檔案
                  </button>
                </div>
              ) : (
                <div className="w-full">
                  <div className="bg-surface-container rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                        <FileAudio className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-text-primary text-sm">陳伯伯家訪.mp3</p>
                        <p className="text-xs text-text-muted">15.4 MB • 00:10</p>
                      </div>
                      {phase !== 'uploading' && <CheckCircle2 className="w-5 h-5 text-state-success" />}
                    </div>
                    
                    {phase === 'uploading' ? (
                      <div className="space-y-2">
                        <div className="h-2 bg-border-subtle rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand-primary transition-all duration-100 ease-linear"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-text-secondary text-right">上傳中 {uploadProgress}%...</p>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                         <button className="flex-1 py-2 rounded-lg bg-white border border-border-subtle text-xs font-medium text-text-primary flex items-center justify-center gap-2 hover:bg-surface-variant/20">
                           <Play className="w-3 h-3" /> 播放原音
                         </button>
                      </div>
                    )}
                  </div>
                  {phase !== 'uploading' && (
                    <div className="flex gap-2 justify-center">
                       <span className="text-xs px-2 py-1 rounded bg-brand-primary/10 text-brand-primary border border-brand-primary/20">國語</span>
                       <span className="text-xs px-2 py-1 rounded bg-brand-primary/10 text-brand-primary border border-brand-primary/20">台語</span>
                       <span className="text-xs px-2 py-1 rounded bg-brand-primary/10 text-brand-primary border border-brand-primary/20">客語</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Transcript */}
          <div className={`flex flex-col h-full bg-bg-primary rounded-3xl border transition-all duration-300 ${phase === 'processing' ? 'border-brand-primary shadow-lg ring-1 ring-brand-primary/20' : 'border-border-subtle shadow-sm'}`}>
            <div className="p-6 border-b border-border-subtle flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${phase === 'processing' ? 'bg-brand-primary text-white' : 'bg-surface-container text-text-secondary'}`}>
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-medium text-text-primary">2. 逐字稿輸出</h3>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto max-h-[300px] custom-scrollbar relative" ref={transcriptRef}>
               {/* State: Idle or Uploading */}
               {(phase === 'idle' || phase === 'uploading') && (
                 <div className="h-full flex flex-col items-center justify-center text-text-muted text-sm gap-3">
                   <div className="w-12 h-1 bg-border-subtle rounded-full opacity-50" />
                   <p>等待錄音輸入...</p>
                 </div>
               )}

               {/* State: Processing (Loading) */}
               {phase === 'processing' && (
                 <div className="h-full flex flex-col items-center justify-center text-center p-4 animate-fade-in">
                   <div className="relative mb-4">
                     <div className="w-12 h-12 rounded-full border-4 border-surface-container border-t-brand-primary animate-spin" />
                     <div className="absolute inset-0 flex items-center justify-center">
                       <Wand2 className="w-4 h-4 text-brand-primary" />
                     </div>
                   </div>
                   <h4 className="font-medium text-text-primary mb-1">AI 正在轉寫與分析語意...</h4>
                   <p className="text-xs text-text-muted">識別語者身份 • 標註方言片段 • 提取關鍵資訊</p>
                 </div>
               )}

               {/* State: Generating or Complete (Show Full Transcript) */}
               {(phase === 'generating' || phase === 'complete') && (
                 <div className="space-y-4 animate-fade-in">
                  {MOCK_TRANSCRIPT.map((item, idx) => (
                    <div key={idx} className="flex flex-col animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                      <div className={`flex flex-col ${item.speaker === '個管師' ? 'items-end' : 'items-start'}`}>
                        <span className="text-xs text-text-muted mb-1 px-1">{item.speaker}</span>
                        <div className={`p-3 rounded-2xl max-w-[90%] text-sm leading-relaxed ${
                          item.speaker === '個管師' 
                            ? 'bg-brand-primary text-white rounded-tr-none' 
                            : 'bg-surface-container text-text-primary rounded-tl-none'
                        }`}>
                          {item.text}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 text-xs text-state-success px-2 py-2 bg-state-success/10 rounded-lg justify-center mt-2">
                    <CheckCircle2 className="w-3 h-3" />
                    轉寫完成，準確率 98%
                  </div>
                 </div>
               )}
            </div>
          </div>

          {/* Step 3: Structured Output */}
          <div className={`flex flex-col h-full bg-bg-primary rounded-3xl border transition-all duration-300 ${phase === 'generating' || phase === 'complete' ? 'border-brand-primary shadow-lg ring-1 ring-brand-primary/20' : 'border-border-subtle shadow-sm'}`}>
            <div className="p-6 border-b border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${phase === 'generating' || phase === 'complete' ? 'bg-brand-primary text-white' : 'bg-surface-container text-text-secondary'}`}>
                  <FileJson className="w-5 h-5" />
                </div>
                <h3 className="font-medium text-text-primary">3. ISP & SOAP 輸出</h3>
              </div>
              {(phase === 'generating' || phase === 'complete') && (
                <div className="flex bg-surface-container rounded-lg p-1">
                  <button 
                    onClick={() => setActiveTab('ISP')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'ISP' ? 'bg-white text-brand-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'}`}
                  >
                    ISP
                  </button>
                  <button 
                    onClick={() => setActiveTab('SOAP')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'SOAP' ? 'bg-white text-brand-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'}`}
                  >
                    SOAP
                  </button>
                </div>
              )}
            </div>
            
            <div className="p-6 flex-1 relative min-h-[300px]">
              {phase === 'idle' || phase === 'uploading' || phase === 'processing' ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted">
                    <div className="w-16 h-16 rounded-full bg-surface-container mb-4 flex items-center justify-center opacity-50">
                      <FileText className="w-8 h-8" />
                    </div>
                    <p className="text-sm">等待分析完成...</p>
                 </div>
              ) : (
                <div className="h-full flex flex-col">
                   <div className="flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2">
                     <div className="prose prose-sm max-w-none text-text-secondary">
                        <pre className="font-sans whitespace-pre-wrap text-sm leading-relaxed animate-fade-in">
                          {activeTab === 'ISP' ? MOCK_ISP : MOCK_SOAP}
                        </pre>
                     </div>
                   </div>
                   
                   {phase === 'complete' && (
                      <div className="mt-4 pt-4 border-t border-border-subtle flex gap-2 animate-fade-in">
                        <button className="flex-1 py-2 rounded-lg border border-border-strong text-text-primary text-xs font-medium hover:bg-surface-variant/30 flex items-center justify-center gap-2">
                          <Copy className="w-3 h-3" /> 複製
                        </button>
                        <button className="flex-1 py-2 rounded-lg bg-brand-primary text-white text-xs font-medium hover:bg-opacity-90 flex items-center justify-center gap-2">
                          <Download className="w-3 h-3" /> 下載
                        </button>
                      </div>
                   )}
                </div>
              )}
              
              {phase === 'generating' && (
                <div className="absolute inset-0 bg-bg-primary/90 backdrop-blur-[1px] flex items-center justify-center rounded-b-3xl z-10">
                   <div className="flex flex-col items-center gap-3">
                      <div className="flex gap-1 mb-2">
                        <div className="w-2 h-2 rounded-full bg-brand-primary animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 rounded-full bg-brand-primary animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 rounded-full bg-brand-primary animate-bounce"></div>
                      </div>
                      <p className="text-brand-primary text-sm font-medium animate-pulse">正在生成 {activeTab} 報告...</p>
                   </div>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
