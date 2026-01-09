
import LeadsForm from "../LeadsForm";

export default function CTASection() {
  return (
    <section id="waitlist" className="px-4 py-20 bg-bg-secondary/40">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="mb-12">
          <p className="italic text-text-secondary max-w-3xl mx-auto text-lg">
            「最大的改變是心態。以前錄音是為了怕忘記，現在錄音就是為了完成工作。Rubix AI 讓我可以把專注力完全放在長者身上。」
          </p>
          <p className="text-right text-sm text-text-muted mt-2 font-medium">—— 某居家長照機構督導，台中</p>
          <div className="mt-4 flex justify-center gap-2">
            <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-xs rounded-full">已協助 50+ 機構</span>
            <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-xs rounded-full">節省 3000+ 小時</span>
          </div>
        </div>
        <h2 className="text-[24px] font-normal mb-6">加入預約名單，免費體驗 3 份報告</h2>
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#waitlist"
            className="w-full sm:w-auto inline-block px-6 py-3 rounded-[8px] bg-brand-accent text-white font-medium hover:bg-opacity-90 transition-colors"
          >
            立即加入體驗
          </a>
          <a
            href="mailto:hello@b2brubix.com"
            className="w-full sm:w-auto inline-block px-6 py-3 rounded-[8px] border border-border-strong text-text-primary hover:bg-surface-variant/40 transition-colors"
          >
            機構合作諮詢
          </a>
        </div>
        <LeadsForm source="landing_bottom" />
      </div>
    </section>
  );
}
