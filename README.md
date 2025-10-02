# Univer Frontend

Frontend cho hệ thống quản lý workbook Univer với React + TypeScript.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
# Copy .env file
cp .env.example .env

# Edit .env
VITE_API_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

## 📁 Project Structure

```
src/
├── api/                    # API clients
│   ├── client.ts           # Axios instance + interceptors
│   ├── auth.api.ts         # Authentication endpoints
│   └── workbook.api.ts     # Workbook endpoints
│
├── components/             # React components
│   ├── Auth/
│   │   └── Login.tsx       # Login form
│   ├── Workbook/
│   │   ├── WorkbookList.tsx      # List all workbooks
│   │   └── UniverSheet.tsx       # Univer editor (tích hợp API)
│   └── Layout/
│
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts          # Authentication logic
│   └── useWorkbook.ts      # Workbook CRUD operations
│
├── types/                  # TypeScript types
│   └── index.ts
│
├── utils/                  # Utilities
│   ├── storage.ts          # LocalStorage helper
│   └── constants.ts        # API URLs, constants
│
├── App.tsx                 # Main app component
└── main.tsx               # Entry point
```

## 🔑 Features

### ✅ Đã implement

- **Authentication**
  - Login với JWT token
  - Auto token refresh
  - Persist login state (localStorage)
- **Workbook Management**

  - List workbooks với pagination & search
  - Create new workbook
  - Edit workbook (với auto-save 30s)
  - Delete workbook
  - Import Excel file
  - Export to Excel

- **Univer Integration**
  - Full Univer spreadsheet engine
  - Real-time editing
  - Auto-save to backend
  - Manual save button

## 🔧 API Integration

### Authentication Flow

```typescript
// Login
const { login } = useAuth();
await login("test@example.com", "password123");

// Token được lưu vào localStorage
// Mọi request sau đó tự động có Authorization header
```

### Workbook Operations

```typescript
const { fetchWorkbooks, createWorkbook, updateWorkbook } = useWorkbook();

// List workbooks
await fetchWorkbooks({ page: 1, limit: 20, search: "report" });

// Create workbook
await createWorkbook({
  name: "My Workbook",
  snapshot: univerSnapshot,
});

// Update workbook (auto-save)
await updateWorkbook(workbookId, {
  snapshot: newSnapshot,
});
```

## 🎨 Components Usage

### UniverSheet Component

```tsx
<UniverSheet
  workbookId="uuid-here"  // Load existing workbook
  onBack={() => {}}       // Back button handler
/>

// Or create new
<UniverSheet
  workbookId={undefined}  // No ID = new workbook
  onBack={() => {}}
/>
```

### WorkbookList Component

```tsx
<WorkbookList
  onSelect={(workbook) => {
    // Handle workbook selection
  }}
  onCreateNew={() => {
    // Handle create new
  }}
/>
```

## 🔐 Authentication

### Default Test Account

```
Email: test@example.com
Password: password123
```

### Token Storage

- Token lưu trong `localStorage` với key `auth_token`
- User info lưu trong `localStorage` với key `user`
- Auto logout khi token expired (401 response)

## ⚡ Auto-Save

Workbook tự động lưu mỗi 30 giây (có thể config trong `utils/constants.ts`):

```typescript
export const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
```

## 🛠️ Development

### Proxy Configuration

Vite proxy tự động forward `/api/*` requests tới backend:

```typescript
// vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
}
```

### Environment Variables

```bash
# Development
VITE_API_URL=http://localhost:3000

# Production
VITE_API_URL=https://api.yourdomain.com
```

## 📦 Build for Production

```bash
npm run build
```

Build output sẽ ở folder `dist/`

## 🐛 Troubleshooting

### CORS Issues

Backend cần enable CORS:

```typescript
// Backend: src/index.ts
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true,
  })
);
```

### Token Not Working

Check localStorage:

```javascript
console.log(localStorage.getItem("auth_token"));
```

Clear và login lại:

```javascript
localStorage.clear();
```

### API Not Connecting

1. Check backend đang chạy: `http://localhost:3000`
2. Check `.env` file có đúng `VITE_API_URL`
3. Check browser console for errors

## 📝 Notes

- **Auto-save**: Chỉ hoạt động khi workbook đã được tạo (có ID)
- **Import Excel**: File sẽ tạo workbook mới, cần save manual
- **Logout**: Xóa token và user khỏi localStorage
- **Error Handling**: Tất cả errors được display qua `error` state trong hooks

## 🔮 Future Enhancements

- [ ] Register page
- [ ] Forgot password
- [ ] Workbook sharing
- [ ] Real-time collaboration
- [ ] Version history
- [ ] Dark mode
- [ ] Mobile responsive

---

**Happy Coding! 🚀**
