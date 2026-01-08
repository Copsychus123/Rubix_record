'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "錄音檔上傳後安全嗎？會不會外流？",
    answer: "資安是我們的首要考量。所有傳輸過程均採用醫療等級的 TLS 加密，符合 HIPAA 規範，且原始錄音在報告生成後會立即銷毀，絕不儲存或用於其他用途。"
  },
  {
    question: "真的聽得懂阿公阿嬤的台語嗎？",
    answer: "是的！我們採用針對台灣在地腔調，包含台語、客語四縣/海陸腔 特別訓練的 AI 模型。即便對話中混雜國台語，系統也能自動辨識並準確轉寫。"
  },
  {
    question: "生成的報告可以直接用嗎？需要修改嗎？",
    answer: "我們的 AI 會生成逐字稿、家訪摘要、SOAP 格式的報告，準確率通常在 90% 以上。但仍建議您在提交前進行人工校對，這是人機協作中確保照護專業判斷準確的重要環節。"
  },
  {
    question: "免費試用結束後如何收費？",
    answer: "預約期間加入的用戶，除了享有首 100 分鐘免費額度外，未來訂閱還將享有「早鳥終身優惠價」。具體方案將在產品正式上線時公佈，保證比請行政助理划算！"
  },
  {
    question: "可以多人共用一個帳號嗎？",
    answer: "基礎方案為單人使用。若您是機構單位，我們提供更深入工作標準化流程，歡迎聯絡我們洽談企業方案。"
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="px-4 py-20 bg-bg-secondary/30">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-normal mb-4 text-text-primary">常見問題</h2>
          <p className="text-text-secondary">
            關於 Rubix AI 的一些疑問解答。
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-bg-primary border border-border-subtle rounded-2xl overflow-hidden transition-all hover:border-brand-primary/20"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-medium text-text-primary text-lg">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-brand-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-text-muted flex-shrink-0" />
                )}
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-text-secondary leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
