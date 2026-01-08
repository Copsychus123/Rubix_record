# B2B Rubix Deployment Guide

本文檔詳細說明 B2B Rubix 專案的部署流程、環境需求與維運注意事項。

## 1. 部署前準備 (Preparation)

### 1.1 伺服器環境要求
本專案基於 **Next.js 16 (App Router)** 開發，支援 **Vercel** (推薦) 或 **自建 Node.js/Docker** 環境。

*   **Node.js**: v20.0.0 或以上
*   **Package Manager**: npm (v10+)
*   **OS**: Linux (Ubuntu 22.04 LTS 推薦), macOS, 或 Windows Server

### 1.2 外部服務依賴
請確保已申請並設定以下服務：
1.  **Supabase**: 用於資料庫 (PostgreSQL) 與身分驗證。
2.  **AWS S3**: 用於儲存用戶上傳的錄音檔。
3.  **OpenAI API** (選填): 若需在伺服器端執行轉錄功能 (目前 Web 端主要為 Demo 展示，實際處理腳本位於 `scripts/`)。

### 1.3 環境變數配置 (.env)
在部署環境中需設定以下變數。請參考 `.env.example` (若無則建立)：

```bash
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# AWS S3 Configuration (Required for Upload)
AWS_REGION="ap-northeast-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_BUCKET_NAME="your-bucket-name"

# AI Service (Optional, for scripts/process-audio.ts)
OPENAI_API_KEY="sk-..."
OLLAMA_HOST="http://localhost:11434" # 若使用本地 LLM
```

### 1.4 資料庫初始化
在專案首次部署前，請至 Supabase Dashboard 的 **SQL Editor** 執行以下腳本以建立資料表與安全策略 (RLS)：

1.  開啟 `web/supabase/schema.sql`。
2.  複製內容並在 Supabase SQL Editor 中執行。
3.  確認 `leads` 資料表建立成功且 RLS Policy 已啟用。

---

## 2. 分步驟部署指南 (Deployment Steps)

### 方案 A：部署至 Vercel (推薦)
最適合 Next.js 的部署方式，零配置且支援 Server Actions。

1.  **連結儲存庫**：在 Vercel Dashboard 新增專案，選擇 Git Repo。
2.  **設定環境變數**：在 "Environment Variables" 區塊填入上述 1.3 節的變數。
3.  **部署**：點擊 **Deploy**。Vercel 會自動執行 `npm install` 與 `npm run build`。
4.  **驗證**：等待燈號轉綠，訪問分配的 `.vercel.app` 網址。

### 方案 B：自建 Docker / Node.js 伺服器
適用於企業內網或需完全掌控基礎設施的場景。

#### 1. 建置 (Build)
在本地或 CI/CD Pipeline 執行：
```bash
# 安裝依賴
npm install

# 執行建置 (產出 .next 資料夾)
npm run build
```

#### 2. 啟動 (Start)
```bash
# 生產模式啟動
npm start
```
*預設 Port 為 3000。可透過 `PORT=8080 npm start` 修改。*

#### 3. 使用 PM2 管理 (推薦)
若在 VM 上運行，建議使用 PM2 確保服務常駐：
```bash
npm install -g pm2
pm2 start npm --name "b2b-rubix-web" -- start
pm2 save
```

---

## 3. 部署後檢查項 (Post-Deployment Checks)

### 3.1 服務健康狀態
*   **網頁存取**：瀏覽首頁 (Home)，確認 Hero Section 與 Demo 動畫正常載入。
*   **靜態資源**：確認圖片、Icon (Lucide React) 顯示正常，無 404 錯誤。

### 3.2 關鍵功能驗證
1.  **Leads 表單測試**：
    *   滑動至頁面底部的 "加入預約名單"。
    *   輸入測試 Email (e.g., `test+deploy@example.com`)。
    *   點擊提交，確認出現「已加入」成功訊息。
    *   至 Supabase Dashboard > Table Editor > `leads` 確認資料已寫入。
2.  **上傳功能測試 (若已開放)**：
    *   訪問 `/upload` 頁面。
    *   上傳一個小檔案，確認 S3 Bucket 中有新增檔案。

### 3.3 監控指標
*   **Vercel Analytics** (若使用 Vercel)：開啟 Web Vitals 監控。
*   **Log 監控**：檢查 Server Logs 是否有 `500` 錯誤或 API 連線超時。

---

## 4. 回滾方案 (Rollback Strategy)

### 4.1 Vercel 回滾
1.  進入 Vercel Dashboard > **Deployments**。
2.  找到上一個成功的版本 (Ready 狀態)。
3.  點擊三個點選單 > **Promote to Production** (或 Redeploy)。
4.  系統將立即切換流量至該版本。

### 4.2 自建環境回滾
1.  **Git Revert**：
    ```bash
    git revert HEAD
    git push origin main
    ```
2.  **重新建置與重啟**：
    ```bash
    npm run build
    pm2 restart b2b-rubix-web
    ```

### 4.3 資料復原
*   **Supabase**：Supabase Pro 方案提供 Point-in-Time Recovery (PITR)。若為 Free Tier，建議定期匯出 SQL 備份。
*   **S3**：啟用 Bucket Versioning 以防誤刪檔案。

---

## 5. 常見問題解決 (Troubleshooting)

### Q1: Build Failed (Type Error)
*   **原因**：TypeScript 檢查未通過。
*   **解法**：本地執行 `npm run build` 確認錯誤點。若需緊急上線，可暫時在 `next.config.ts` 啟用 `ignoreBuildErrors` (不推薦)。

### Q2: 500 Internal Server Error on Form Submit
*   **原因**：環境變數 `NEXT_PUBLIC_SUPABASE_URL` 或 Key 設定錯誤。
*   **解法**：檢查伺服器環境變數設定，確認與 Supabase Dashboard 一致。

### Q3: S3 Upload Access Denied
*   **原因**：IAM User 權限不足或 Bucket Policy 錯誤。
*   **解法**：確認 AWS Access Key 具有 `PutObject` 權限，且 Bucket CORS 設定允許來源網域。

### Q4: 頁面樣式跑版
*   **原因**：Tailwind CSS 未正確編譯或快取問題。
*   **解法**：清除 `.next` 快取 (`rm -rf .next`) 後重新建置。

---

## 附錄：常用指令速查

| 動作 | 指令 |
|------|------|
| 開發模式 | `npm run dev` |
| 生產建置 | `npm run build` |
| 生產啟動 | `npm start` |
| 執行測試 | `npm test` |
| 資料庫 Lint | `npm run lint` |
