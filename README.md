# 🏥 EduHealth - Hệ Thống Quản Lý Sức Khỏe Học Sinh

<div align="center">

![EduHealth Logo](./src/assets/images/medical-book.png)

**Nền tảng quản lý sức khỏe toàn diện cho trường học**

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Ant Design](https://img.shields.io/badge/Ant_Design-5.25.4-0170FE?style=for-the-badge&logo=ant-design&logoColor=white)](https://ant.design/)

</div>

---

## 📋 Mục Lục

- [Giới Thiệu](#-giới-thiệu)
- [Tính Năng Chính](#-tính-năng-chính)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Yêu Cầu Hệ Thống](#-yêu-cầu-hệ-thống)
- [Cài Đặt](#-cài-đặt)
- [Sử Dụng](#-sử-dụng)
- [Phân Quyền](#-phân-quyền)
- [API Integration](#-api-integration)
- [Scripts](#-scripts)
- [Đóng Góp](#-đóng-góp)

---

## 🎯 Giới Thiệu

**EduHealth** là một hệ thống quản lý sức khỏe học sinh hiện đại, được xây dựng với mục tiêu số hóa và tối ưu hóa quy trình chăm sóc sức khỏe tại các trường học. Hệ thống cung cấp giải pháp toàn diện cho việc theo dõi, quản lý và báo cáo tình trạng sức khỏe của học sinh.

### 🌟 Điểm Nổi Bật

- ✅ **Giao diện thân thiện**: Thiết kế hiện đại, dễ sử dụng với Ant Design và TailwindCSS
- ✅ **Quản lý đa vai trò**: Hỗ trợ Admin, Y tá, Phụ huynh với quyền hạn riêng biệt
- ✅ **Theo dõi thời gian thực**: Cập nhật thông tin sức khỏe ngay lập tức
- ✅ **Báo cáo chi tiết**: Thống kê và phân tích dữ liệu sức khỏe
- ✅ **Responsive**: Tương thích mọi thiết bị (Desktop, Tablet, Mobile)
- ✅ **Bảo mật cao**: Xác thực JWT, phân quyền chặt chẽ

---

## 🚀 Tính Năng Chính

### 👨‍💼 Dành cho Admin
- 📊 **Dashboard tổng quan**: Thống kê toàn diện về sức khỏe học sinh
- 👥 **Quản lý người dùng**: Thêm, sửa, xóa tài khoản (Y tá, Phụ huynh)
- 📝 **Quản lý nội dung**: Đăng tin tức, thông báo sức khỏe
- 📈 **Báo cáo chi tiết**: 
  - Báo cáo sự kiện y tế
  - Báo cáo tiêm chủng
  - Thống kê theo thời gian

### 👩‍⚕️ Dành cho Y Tá (Nurse)
- 🏥 **Dashboard y tế**: Tổng quan công việc hàng ngày
- 📋 **Quản lý hồ sơ sức khỏe**: Tạo và cập nhật hồ sơ học sinh
- 💊 **Quản lý thuốc**: 
  - Tiếp nhận đơn thuốc từ phụ huynh
  - Theo dõi việc uống thuốc
  - Cập nhật trạng thái (Pending, Received, Given, Rejected)
- 💉 **Quản lý tiêm chủng**:
  - Tạo đợt tiêm chủng
  - Theo dõi trạng thái (Pending, Allowed, Injected, Rejected)
  - Quản lý danh sách học sinh tham gia
- 🩺 **Khám sức khỏe định kỳ**:
  - Tạo đợt khám
  - Ghi nhận kết quả khám
  - Theo dõi trạng thái (Created, InProgress, Pending, Checked)
- 🚨 **Quản lý sự kiện y tế**: Ghi nhận và xử lý các sự kiện bất thường
- 👤 **Quản lý hồ sơ cá nhân**: Cập nhật thông tin, đổi mật khẩu

### 👨‍👩‍👧 Dành cho Phụ Huynh (Guardian)
- 👶 **Quản lý con em**: Xem danh sách và thông tin chi tiết các con
- 💊 **Gửi đơn thuốc**: Yêu cầu nhà trường hỗ trợ cho con uống thuốc
- 💉 **Theo dõi tiêm chủng**: Xem lịch sử và kế hoạch tiêm chủng
- 🩺 **Xem kết quả khám**: Theo dõi kết quả khám sức khỏe định kỳ
- 📅 **Theo dõi sự kiện**: Nhận thông báo về các sự kiện y tế liên quan
- 👤 **Quản lý hồ sơ**: Cập nhật thông tin cá nhân

### 🌐 Trang Công Khai
- 🏠 **Trang chủ**: Giới thiệu về hệ thống
- ℹ️ **Giới thiệu**: Thông tin chi tiết về EduHealth
- 📰 **Tin tức**: Các bài viết về sức khỏe học đường
- 📞 **Liên hệ**: Form liên hệ và thông tin hỗ trợ

---

## 🛠 Công Nghệ Sử Dụng

### Core Technologies
- **React 19.0.0** - Thư viện UI hiện đại
- **TypeScript 5.7.2** - Type-safe JavaScript
- **Vite 6.3.1** - Build tool siêu nhanh
- **React Router DOM 7.6.0** - Routing cho SPA

### UI Framework & Styling
- **Ant Design 5.25.4** - Component library chuyên nghiệp
- **TailwindCSS 4.1.4** - Utility-first CSS framework
- **Lucide React 0.511.0** - Icon library đẹp mắt
- **Lottie React 2.4.1** - Animation library

### State Management & Data Fetching
- **Redux Toolkit 2.8.2** - State management
- **React Redux 9.2.0** - React bindings cho Redux
- **Axios 1.9.0** - HTTP client

### Form & Data Handling
- **React DatePicker 8.4.0** - Date picker component
- **Moment.js 2.30.1** - Date manipulation
- **CKEditor 5** - Rich text editor
- **File Saver 2.0.5** - File download utility

### Charts & Visualization
- **Recharts 2.15.3** - Charting library

### Notifications & UX
- **React Toastify 11.0.5** - Toast notifications

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript ESLint** - TypeScript linting rules

---

## 📁 Cấu Trúc Dự Án

```
SWP391-FE/
├── 📂 public/                    # Static assets
├── 📂 src/
│   ├── 📂 app/                   # Application core
│   │   └── 📂 redux/             # Redux store & slices
│   │       ├── loading.slice.ts  # Loading state management
│   │       └── store.ts          # Redux store configuration
│   │
│   ├── 📂 assets/                # Media files
│   │   ├── 📂 files/             # JSON, documents
│   │   └── 📂 images/            # Images, icons
│   │
│   ├── 📂 components/            # Reusable components
│   │   ├── 📂 Footer/            # Footer component
│   │   ├── 📂 Header/            # Header components
│   │   │   ├── Header.tsx        # Main header
│   │   │   └── ParentHeader.tsx  # Parent-specific header
│   │   ├── 📂 Layout/            # Layout wrappers
│   │   │   ├── AdminLayout.tsx   # Admin layout
│   │   │   ├── Layout.tsx        # Public layout
│   │   │   └── ParentLayout.tsx  # Parent layout
│   │   ├── 📂 News/              # News components
│   │   │   ├── HeroNews.tsx
│   │   │   ├── NewsCard.tsx
│   │   │   ├── NewsCardsContainer.tsx
│   │   │   ├── NewsFilter.tsx
│   │   │   ├── NewsSearch.tsx
│   │   │   └── NewsSearchContainer.tsx
│   │   └── 📂 Sidebar/           # Sidebar components
│   │       ├── AdminSidebar.tsx
│   │       └── Nurse.tsx
│   │
│   ├── 📂 pages/                 # Page components
│   │   ├── 📂 Admin/             # Admin pages
│   │   │   ├── 📂 Dashboard/
│   │   │   │   └── HealthOverview.tsx
│   │   │   ├── 📂 Management/
│   │   │   │   ├── ContentManagement.tsx
│   │   │   │   ├── UserDetail.tsx
│   │   │   │   └── UserManagement.tsx
│   │   │   └── 📂 Reports/
│   │   │       ├── HealthEvents.tsx
│   │   │       └── VaccinationReports.tsx
│   │   │
│   │   ├── 📂 Nurse/             # Nurse pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Detail_medical_event.tsx
│   │   │   ├── HealthCheckStudents.tsx
│   │   │   ├── Manage_health_records.tsx
│   │   │   ├── Manage_healthcheck.tsx
│   │   │   ├── Manage_medical.tsx
│   │   │   ├── Manage_medical_events.tsx
│   │   │   ├── Manage_vaccine.tsx
│   │   │   ├── Profile.tsx
│   │   │   └── VaccineEventStudents.tsx
│   │   │
│   │   ├── 📂 Parent/            # Parent pages
│   │   │   ├── Checkup.tsx
│   │   │   ├── Children.tsx
│   │   │   ├── Event.tsx
│   │   │   ├── Parent.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── SendMedication.tsx
│   │   │   └── Vaccine.tsx
│   │   │
│   │   ├── 📂 Home/              # Public pages
│   │   │   ├── About.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── News.tsx
│   │   │   └── NewsDetail.tsx
│   │   │
│   │   ├── 📂 Login/             # Authentication pages
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   └── Login.tsx
│   │   │
│   │   └── 📂 Noti/              # Notification pages
│   │       └── Noti.tsx
│   │
│   ├── 📂 routers/               # Routing configuration
│   │   └── index.tsx             # Main router
│   │
│   ├── 📂 roles/                 # Authorization
│   │   └── ProtectedRoute.tsx    # Route protection HOC
│   │
│   ├── 📂 services/              # API services
│   │   ├── AccountService.ts
│   │   ├── AuthServices.ts
│   │   ├── BlogService.ts
│   │   ├── CategoryService.ts
│   │   ├── DashboardService.ts
│   │   ├── ExportService.ts
│   │   ├── Healthcheck.ts
│   │   ├── MedicalEventService.ts
│   │   ├── MedicalRecordService.ts
│   │   ├── MedicalSentService.ts
│   │   ├── NotificationService.ts
│   │   └── Vaccineservice.ts
│   │
│   ├── 📂 types/                 # TypeScript definitions
│   │   └── ckeditor__ckeditor5-build-classic.d.ts
│   │
│   ├── App.tsx                   # Root component
│   ├── App.css                   # App styles
│   ├── main.tsx                  # Entry point
│   ├── index.css                 # Global styles
│   └── vite-env.d.ts             # Vite type definitions
│
├── .eslintrc.config.js           # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── .prettierignore               # Prettier ignore rules
├── .gitignore                    # Git ignore rules
├── index.html                    # HTML template
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tsconfig.app.json             # App TypeScript config
├── tsconfig.node.json            # Node TypeScript config
├── vite.config.ts                # Vite configuration
└── README.md                     # Documentation
```

---

## 💻 Yêu Cầu Hệ Thống

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0 hoặc **yarn**: >= 1.22.0
- **Backend API**: SWP391-BE phải được chạy trên `http://localhost:3333`

---

## 📦 Cài Đặt

### 1. Clone Repository

```bash
git clone <repository-url>
cd SWP391-FE
```

### 2. Cài Đặt Dependencies

```bash
npm install
# hoặc
yarn install
```

### 3. Cấu Hình Backend

Đảm bảo backend API đang chạy tại `http://localhost:3333`. Nếu cần thay đổi URL, cập nhật trong các file service tại `src/services/`.

### 4. Khởi Chạy Development Server

```bash
npm run dev
# hoặc
yarn dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173` (hoặc port khác nếu 5173 đã được sử dụng).

---

## 🎮 Sử Dụng

### Development Mode

```bash
npm run dev
```

Chạy ứng dụng ở chế độ development với hot-reload.

### Build Production

```bash
npm run build
```

Build ứng dụng cho production. Output sẽ được tạo trong thư mục `dist/`.

### Preview Production Build

```bash
npm run preview
```

Preview bản build production trước khi deploy.

### Linting

```bash
npm run lint
```

Kiểm tra code với ESLint.

### Format Code

```bash
npm run format
```

Format code với Prettier.

---

## 🔐 Phân Quyền

Hệ thống sử dụng JWT (JSON Web Token) để xác thực và phân quyền người dùng.

### Các Vai Trò (Roles)

| Vai Trò | Mô Tả | Routes |
|---------|-------|--------|
| **Admin** | Quản trị viên hệ thống | `/admin/*` |
| **Nurse** | Y tá trường học | `/nurse/*` |
| **Guardian** | Phụ huynh học sinh | `/guardian/*` |

### Cơ Chế Bảo Vệ Route

```typescript
// Ví dụ: Chỉ Admin mới truy cập được
<ProtectedRoute allowedRoles={["Admin"]}>
  <AdminLayout />
</ProtectedRoute>

// Ví dụ: Chỉ Y tá mới truy cập được
<ProtectedRoute allowedRoles={["Nurse"]}>
  <NurseLayout />
</ProtectedRoute>
```

### Luồng Xác Thực

1. **Đăng nhập**: User nhập email và password
2. **Nhận token**: Server trả về `accessToken` và `refreshToken`
3. **Lưu trữ**: Token được lưu trong `localStorage`
4. **Xác thực**: Mỗi request gửi `accessToken` trong header
5. **Phân quyền**: Route được bảo vệ dựa trên role của user

---

## 🔌 API Integration

### Base URL

```typescript
const API_BASE_URL = 'http://localhost:3333/api/v1';
```

### Các Service Chính

#### 1. Authentication Service (`AuthServices.ts`)

```typescript
// Đăng nhập
login(email: string, password: string): Promise<LoginResponse>

// Đăng xuất
logout(): Promise<void>

// Đổi mật khẩu
changePassword(currentPassword: string, newPassword: string, token: string): Promise<void>

// Quên mật khẩu
forgotPassword(email: string): Promise<any>
```

#### 2. Medical Record Service (`MedicalRecordService.ts`)

```typescript
// Lấy tất cả hồ sơ y tế
getAllMedicalRecords(token: string): Promise<MedicalRecord[]>

// Lấy hồ sơ theo phụ huynh
getMedicalRecordsByGuardian(token: string): Promise<MedicalRecord[]>

// Lấy hồ sơ theo ID
getMedicalRecordById(id: number, token: string): Promise<MedicalRecord>

// Tạo hồ sơ mới
createMedicalRecord(record: Omit<MedicalRecord, 'ID'>, token: string): Promise<MedicalRecord>

// Cập nhật hồ sơ
updateMedicalRecord(id: number, record: CreateStudentMedicalPayload, token: string): Promise<MedicalRecord>

// Xóa hồ sơ
deleteMedicalRecord(id: number, token: string): Promise<void>
```

#### 3. Dashboard Service (`DashboardService.ts`)

```typescript
// Thống kê tổng quan
getTotalEvents(): Promise<{ count: number }>
getTotalHealthCheck(): Promise<{ count: number }>
getTotalMedicalSend(): Promise<{ count: number }>
getTotalVaccine(): Promise<{ count: number }>

// Thống kê chi tiết
getTotalMedicalStatus(): Promise<MedicalStatusCounts>
getTotalVaccineStatus(): Promise<VaccineStatusCounts>
getTotalHealthCheckStatus(): Promise<HealthCheckStatusCounts>
getDashboardCounts(): Promise<AdminCounts>
```

### Request Headers

Tất cả các request cần xác thực phải có header:

```typescript
headers: {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
}
```

---

## 📜 Scripts

| Script | Mô Tả |
|--------|-------|
| `npm run dev` | Chạy development server |
| `npm run build` | Build production |
| `npm run preview` | Preview production build |
| `npm run lint` | Chạy ESLint |
| `npm run format` | Format code với Prettier |

---

## 🎨 Styling Guidelines

### TailwindCSS

Sử dụng utility classes của Tailwind cho styling nhanh:

```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h1 className="text-2xl font-bold text-gray-800">Title</h1>
</div>
```

### Ant Design

Sử dụng components của Ant Design cho UI phức tạp:

```tsx
import { Button, Table, Modal } from 'antd';

<Button type="primary" icon={<PlusOutlined />}>
  Thêm Mới
</Button>
```

### Custom CSS

Đặt custom styles trong file `.css` tương ứng hoặc `index.css` cho global styles.

---

## 🔧 Configuration Files

### `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()]
});
```

### `tsconfig.json`

TypeScript configuration được chia thành:
- `tsconfig.app.json` - Cho application code
- `tsconfig.node.json` - Cho Node.js scripts

---

## 🚀 Deployment

### Build cho Production

```bash
npm run build
```

### Deploy lên Server

1. Upload thư mục `dist/` lên server
2. Cấu hình web server (Nginx, Apache) để serve static files
3. Đảm bảo routing được cấu hình đúng cho SPA

### Ví dụ Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🐛 Troubleshooting

### Lỗi thường gặp

#### 1. Port đã được sử dụng

```bash
Error: Port 5173 is already in use
```

**Giải pháp**: Thay đổi port trong `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    port: 3000
  }
});
```

#### 2. API Connection Error

```bash
Error: Network Error
```

**Giải pháp**: 
- Kiểm tra backend đang chạy tại `http://localhost:3333`
- Kiểm tra CORS configuration trên backend

#### 3. Build Error

```bash
Error: TypeScript compilation failed
```

**Giải pháp**:
```bash
npm run lint
# Fix các lỗi TypeScript
```

---

## 📚 Tài Liệu Tham Khảo

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [Ant Design Documentation](https://ant.design/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Router Documentation](https://reactrouter.com/)

---

## 👥 Đóng Góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng làm theo các bước sau:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

### Coding Standards

- Sử dụng TypeScript cho type safety
- Follow ESLint rules
- Format code với Prettier trước khi commit
- Viết component names với PascalCase
- Viết file names với PascalCase cho components
- Viết meaningful commit messages

---

## 📄 License

Dự án này thuộc về [Tên Tổ Chức/Trường]. Mọi quyền được bảo lưu.

---

## 📞 Liên Hệ & Hỗ Trợ

- **Email**: support@eduhealth.com
- **Website**: https://eduhealth.com
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)

---

<div align="center">

**Được phát triển với ❤️ bởi Team SWP391**

⭐ Nếu dự án hữu ích, hãy cho chúng tôi một star!

</div>
