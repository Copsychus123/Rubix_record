
export default function HeroSection() {
  return (
    <section className="relative px-4 pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div
        className="absolute inset-0 -z-10 opacity-80"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1731440488849-82a3b0b9f1f7?q=80&w=1920&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(2px)",
        }}
      />
      <div className="container mx-auto max-w-5xl text-center relative z-10">
        <h1 className="text-[32px] md:text-[40px] font-normal tracking-tight mb-6 animate-slide-up text-brand-primary">
          讓照護專業回歸服務，<br className="md:hidden" />而非淹沒在文書裡
        </h1>
        <p className="text-[18px] text-text-secondary max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
          Rubix AI 語音助理，讓您的「錄音」直接變成「工作成果」<br />
          家訪結束的同時，家訪摘要 與 逐字稿 紀錄也自動完成了
        </p>
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <a
            href="#waitlist"
            className="inline-block px-6 py-3 rounded-[8px] bg-brand-accent text-white font-medium hover:bg-opacity-90 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            免費體驗 3 份報告
          </a>
        </div>
      </div>
    </section>
  );
}
