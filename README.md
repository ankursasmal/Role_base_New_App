# Role-Based Access Control Dashboard

A full-stack Next.js 15 application implementing comprehensive role-based access control with MongoDB.

## Features

### Authentication & Authorization
- JWT-based session management using Next.js 15 patterns
- Role-based access control (Admin, Editor, Viewer)
- Secure route protection with middleware
- Server-side session verification

### Dashboard Features

#### Admin View
- User management (list, edit roles, delete accounts)
- System activity logs
- Full access to all features

#### Editor View
- Content management capabilities
- User listing (read-only)
- Limited administrative functions

#### Viewer View
- Read-only access to content
- Restricted UI with minimal permissions

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Backend**: Next.js API Routes, Server Actions
- **Database**: MongoDB
- **Authentication**: JWT with jose library
- **Styling**: Tailwind CSS

## Getting Started

1. **Clone the repository**
```bash
git clone <repository-url>
cd rbac-dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017
DB_NAME=rbac_dashboard
SESSION_SECRET=your-super-secret-key-here
```

4. **Run the development server**
```bash
npm run dev
```

5. **Create initial admin user**
Use the seed script or create manually in MongoDB:
```javascript
// In MongoDB shell
use rbac_dashboard
db.users.insertOne({
  email: "admin@example.com",
  password: "$2a$12$...", // bcrypt hash of "admin123"
  role: "admin",
  name: "Admin User",
  createdAt: new Date()
})
```

## Project Structure

```
app/
├── actions/          # Server Actions
├── api/             # API Routes
├── components/      # React Components
├── dashboard/       # Dashboard pages
├── lib/            # Utilities (auth, db, session)
├── login/          # Authentication pages
└── middleware.ts   # Route protection
```

## Security Features

- **Route Protection**: Middleware-based authentication
- **API Security**: Role-based endpoint protection
- **Session Management**: Secure JWT with httpOnly cookies
- **Authorization Checks**: Server-side role verification
- **Input Validation**: Form data sanitization

## API Endpoints

- `GET /api/users` - List users (Admin/Editor only)
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/[id]` - Update user (Admin only)
- `DELETE /api/users/[id]` - Delete user (Admin only)

## Role Permissions

| Feature | Admin | Editor | Viewer |
|---------|-------|--------|--------|
| User Management | ✅ | ❌ | ❌ |
| System Logs | ✅ | ❌ | ❌ |
| Content Management | ✅ | ✅ | ❌ |
| View Content | ✅ | ✅ | ✅ |

## Development
-**install**: `npm install`
- **Linting**: `npm run dev`
- **Build**: `npm run build`
- **Production**: `npm start`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request