# NODE.JS + TypeScript 初始化版本

## 技術說明

- **Node.js / Express** - 高效後端框架
- **TypeScript** - 靜態型別檢查
- **Prisma** - 資料庫 ORM 工具
- **PostgreSQL** - 穩定資料庫系統
- **Passport 與 JWT** - 安全認證機制
- **Swagger** - 自動生成 API 文件
- **ESLint 與 Prettier** - 程式碼風格檢查
- **Husky** - Git hook 工具
- **Winston** - Log 日誌記錄工具
- **Jest** - 單元測試框架

## 啟動方式

安裝相依套件

```
npm i
```

## 使用套件說明

- `cross-env` - 跨作業系統設定環境變數的工具。
- `eslint` - 靜態程式碼檢查工具，用於提升程式碼品質。
- `eslint-config-prettier` - 關閉與 Prettier 衝突的 ESLint 規則。
- `eslint-plugin-prettier` - 讓 ESLint 可以執行 Prettier 格式化檢查。
- `husky` - Git hooks 管理工具，用來在提交程式碼前執行檢查或格式化。
- `jest` - JavaScript 測試框架，用於撰寫與執行單元測試。
- `lint-staged` - 只對暫存區的檔案執行 lint 或格式化檢查，提升效能。
- `nodemon` - 開發時自動重啟 Node.js 應用的工具。
- `prettier` - 程式碼格式化工具，確保程式碼風格一致。
- `prisma` - Prisma ORM 的 CLI 工具，用於資料庫遷移與管理。
- `ts-jest` - 讓 Jest 能夠執行 TypeScript 測試的預處理器。
- `ts-node` - 讓 Node.js 能夠直接執行 TypeScript 程式碼。
- `typescript` - TypeScript 語言本身，提供靜態型別檢查與編譯功能。
- `bcryptjs` - 用於密碼雜湊與驗證的加密工具。
- `body-parser` - 解析 HTTP request body 的中介軟體，常與 Express 搭配使用。
- `compression` - 壓縮 HTTP 回應內容的中介軟體，提升傳輸效率。
- `cors` - 啟用跨來源資源共享（CORS）的中介軟體，控制跨網域請求。
- `dotenv` - 讀取 `.env` 檔案中的環境變數，方便在不同環境下管理配置。
- `express` - 快速且簡單的 Node.js Web 應用框架。
- `express-rate-limit` - 用於限制重複請求，防止暴力攻擊的中介軟體。
- `fs` - Node.js 原生檔案系統模組（此處版本號特殊）。
- `helmet` - 提供安全性增強，透過設定 HTTP 標頭保護應用。
- `moment` - 處理與格式化日期時間的工具庫。
- `passport` - 驗證中介軟體，用於處理用戶認證。
- `passport-jwt` - Passport 的 JWT 驗證策略，基於 JSON Web Token 處理認證。
- `path` - Node.js 的路徑工具模組，方便處理檔案與目錄路徑（此處版本號特殊）。
- `pg` - PostgreSQL 資料庫的 Node.js 客戶端。
- `supertest` - 用於測試 HTTP API 的工具，常與 Jest 搭配使用。
- `swagger-jsdoc` - 根據 JSDoc 註解生成 Swagger 文件，方便自動產生 API 文件。
- `swagger-ui-express` - 將 Swagger UI 整合進 Express 應用，提供互動式 API 文件頁面。
- `winston` - 強大的日誌記錄工具，用於記錄應用程序的運行狀態與錯誤。
- `zod` - TypeScript-first 的 schema 驗證庫，用於宣告與驗證資料結構。

## 設定環境變數

使用 Docker 開發：

```
POSTGRES_USER=lobinda
POSTGRES_PASSWORD=lobinda
POSTGRES_DB=GYMTest
DB_HOST=postgres
DB_PORT=9924
DB_USERNAME=lobinda
DB_PASSWORD=lobinda
DB_DATABASE=GYMTest

DB_SYNCHRONIZE=true
DB_ENABLE_SSL=false
PORT=2343
LOG_LEVEL=debug
JWT_EXPIRES_DAY=30d
JWT_SECRET=hexschool666
```

使用 localhost 開發伺服器（資料庫仍使用 Docker）：

```
POSTGRES_USER=lobinda
POSTGRES_PASSWORD=lobinda
POSTGRES_DB=GYMTest
DB_HOST=localhost
DB_PORT=9924
DB_USERNAME=lobinda
DB_PASSWORD=lobinda
DB_DATABASE=GYMTest
DB_SYNCHRONIZE=true
DB_ENABLE_SSL=false
PORT=2343
LOG_LEVEL=debug
JWT_EXPIRES_DAY=30d
JWT_SECRET=hexschool666
```

## 開發指令

### Server

- `npm run dev` - 啟動開發伺服器
- `npm run lint` - 啟動 eslint 檢查
- `npm run test` - 啟動 Jest 環境測試

### Docker

- `npm run dbStart` - 啟動資料庫
- `npm run dbRestart` - 重新啟動資料庫
- `npm run dbStop` - 關閉啟動資料庫
- `npm run dbClean` - 關閉資料庫並清除所有資料

### Prisma 匯入資料庫

- `npm run db:generate` - 根據 schema.prisma 的變更自動產生一個新的 migration，並應用到開發資料庫，同時也會更新 Prisma Client。
- `npm run db:migrate` - 將已存在的 migration 部署到目標資料庫。
- `npm run db:push` -    將資料部署到目標資料庫。
- `npm run db:studio` - 打開一個 Web GUI 介面，可以瀏覽和編輯資料庫中的資料。
- `npm run postinstall` - 生成 Prisma Client。
