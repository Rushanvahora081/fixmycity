# FixMyCity - Civic Issue Tracking System

A full-stack demo project built with Next.js and MongoDB for tracking civic issues with role-based dashboards.

## 🚀 Features

- **Citizen Dashboard**: Submit and track civic issues
- **Municipal Dashboard**: Manage and update issue status
- **Admin Dashboard**: Manage officers and view city-wide analytics
- **Role-based Access**: Three user roles (Citizen, Municipal Officer, Admin)
- **Real-time Updates**: Issue status tracking and management
- **Photo Support**: Placeholder for issue photos
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with native driver
- **Styling**: Tailwind CSS with custom components

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## 🚀 Getting Started

1. **Clone and Install Dependencies**
   ```bash
   cd FixMyCity
   npm install
   ```

2. **Set up Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/fixmycity
   MONGODB_DB=fixmycity
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   # For local MongoDB
   mongod
   
   # Or use MongoDB Atlas connection string in .env.local
   ```

4. **Seed the Database**
   Start the development server and seed with dummy data:
   ```bash
   npm run dev
   # In another terminal
   npm run seed
   ```

5. **Access the Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 User Roles & Dashboards

### 👤 Citizen Dashboard (`/citizen`)
- Submit new civic issues with photos
- View all your reported issues
- Track issue status and progress
- **Demo User**: john.doe@example.com

### 🏛️ Municipal Dashboard (`/municipal`)
- View all reported issues from citizens
- Update issue status: Pending → In Progress → Solved
- Filter issues by status
- **Demo User**: jane.smith@municipal.gov

### ⚙️ Admin Dashboard (`/admin`)
- Manage municipal officers (create/delete)
- View city-wide issue analytics
- Comprehensive issue overview table
- **Demo User**: admin@fixmycity.gov

## 📊 Database Schema

### Users Collection
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  role: 'citizen' | 'municipal' | 'admin',
  createdAt: Date,
  updatedAt: Date
}
```

### Issues Collection
```typescript
{
  _id: ObjectId,
  title: string,
  description: string,
  location: string,
  status: 'pending' | 'in_progress' | 'solved',
  createdBy: ObjectId (reference to users),
  createdAt: Date,
  updatedAt: Date,
  photoUrl?: string
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login (simulated)

### Issues
- `GET /api/issues` - Get all issues (with optional filters)
- `POST /api/issues` - Create new issue
- `PUT /api/issues/[id]` - Update issue
- `DELETE /api/issues/[id]` - Delete issue

### Users
- `GET /api/users` - Get all users (with optional role filter)
- `POST /api/users` - Create new user
- `DELETE /api/users/[id]` - Delete user

### Database
- `POST /api/seed` - Seed database with dummy data

## 🎨 Styling

The application uses Tailwind CSS with custom component classes:
- `.btn` - Button base styles
- `.btn-primary`, `.btn-secondary`, etc. - Button variants
- `.card` - Card container
- `.form-input`, `.form-label` - Form elements
- `.status-badge` - Status indicators

## 🧪 Demo Data

The seed script creates:
- 5 users (2 citizens, 2 municipal officers, 1 admin)
- 6 sample issues with different statuses
- Realistic timestamps and locations

## 🔧 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Seed database
npm run seed
```

## 📝 Notes

- This is a demo application with simulated authentication
- In production, implement proper JWT authentication
- Photo uploads are placeholder - integrate with cloud storage
- Add proper error handling and validation
- Implement real-time updates with WebSockets
- Add email notifications for status changes

## 🤝 Contributing

This is a demo project. Feel free to fork and extend with additional features!

## 📄 License

MIT License - feel free to use this project for learning and demonstration purposes.
