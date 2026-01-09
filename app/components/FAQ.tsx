'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { faqs } from '../content/faqs';

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
