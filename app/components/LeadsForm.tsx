'use client';

import { useState } from 'react';
import { getSupabaseClient } from '../database/supabase';
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { z } from 'zod';

const leadSchema = z.object({
  email: z.string().email({ message: "請輸入有效的 Email 地址" }),
  name: z.string().optional(),
});

interface LeadsFormProps {
  source?: string;
}

export default function LeadsForm({ source = 'web' }: LeadsFormProps) {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    // Validate
    const result = leadSchema.safeParse(formData);
    if (!result.success) {
      setStatus('error');
      const formatted = result.error.format();
      setMessage(formatted.email?._errors[0] || "格式錯誤");
      return;
    }

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error('Supabase 未設定，請檢查環境變數');
      }

      const { error } = await supabase
        .from('leads')
        .insert([{ 
          email: formData.email,
          name: formData.name || null,
          source: source
        }]);

      if (error) {
        if (error.code === '23505') { // Unique violation
           throw new Error('這個 Email 已經在名單中了！');
        }
        throw error;
      }

      setStatus('success');
      setMessage('成功加入！我們將盡快與您聯繫。');
      setFormData({ name: '', email: '' });
    } catch (err: unknown) {
      setStatus('error');
      const message = err instanceof Error ? err.message : '發生錯誤，請稍後再試。';
      setMessage(message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name Input */}
        <div>
          <input
            type="text"
            placeholder="您的稱呼 (選填)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={status === 'loading' || status === 'success'}
            className="w-full px-4 py-3 rounded-[8px] border border-border-strong bg-bg-primary text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all disabled:opacity-50"
          />
        </div>

        {/* Email Input */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="電子信箱 (必填)"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={status === 'loading' || status === 'success'}
            className="flex-1 px-4 py-3 rounded-[8px] border border-border-strong bg-bg-primary text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all disabled:opacity-50"
          />
          
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="px-6 py-3 rounded-[8px] bg-brand-accent text-white font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 min-w-[140px] whitespace-nowrap"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                處理中
              </>
            ) : status === 'success' ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                已加入
              </>
            ) : (
              <>
                免費體驗
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`flex items-center gap-2 text-sm ${
            status === 'error' ? 'text-red-600' : 'text-green-600'
          } animate-fade-in`}>
            {status === 'error' ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
