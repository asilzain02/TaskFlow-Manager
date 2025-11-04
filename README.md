# WORKLOOP

A comprehensive productivity and finance management platform built with React, TypeScript, and Supabase.

## Features

### 🔐 Authentication
- Secure email/password authentication
- User registration and login
- Protected routes and session management
- Profile management with password updates

### ✅ Task Management
- Create, edit, delete, and complete tasks
- Priority levels (Low, Medium, High)
- Due date tracking with overdue notifications
- Category organization
- Search and filter functionality
- Responsive task cards with status indicators

### 💰 Finance Tracking
- Income and expense tracking
- Category-based transaction organization
- Monthly financial summaries
- Search and filter transactions
- Indian Rupee (₹) currency support
- Visual spending analytics

### 📊 Analytics Dashboard
- Interactive charts and visualizations
- Expense breakdown by category
- Income source analysis
- Monthly trends and patterns
- Time-based filtering (Week/Month/Year)

### 🎯 Dashboard
- Overview of tasks and financial status
- Quick action buttons
- Recent activity feed
- Key performance indicators
- Monthly balance tracking

### ⚙️ Settings & Profile
- User profile management
- Notification preferences
- Appearance settings
- Privacy controls

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite

## Database Schema

### Tasks Table
- `id` - UUID primary key
- `title` - Task title (required)
- `description` - Optional task description
- `completed` - Boolean completion status
- `priority` - Enum: low, medium, high
- `category` - Optional category
- `due_date` - Optional due date
- `created_at` - Timestamp
- `updated_at` - Auto-updated timestamp
- `user_id` - Foreign key to auth.users

### Transactions Table
- `id` - UUID primary key
- `type` - Enum: income, expense
- `amount` - Decimal amount in rupees
- `category` - Transaction category
- `description` - Optional description
- `date` - Transaction date
- `created_at` - Timestamp
- `user_id` - Foreign key to auth.users

## Getting Started

### Prerequisites
- Node.js 18+ 
- Supabase account

### Setup Instructions

1. **Clone and Install**
   ```bash
   git clone <workloop-repository-url>
   cd workloop
   npm install
   ```

2. **Database Setup**
   - Create a new Supabase project
   - Run the migration files in `supabase/migrations/`
   - The schema will create tables with Row Level Security enabled

3. **Environment Variables**
   Create a `.env` file with:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Development**
   ```bash
   npm run dev
   ```

5. **Production Build**
   ```bash
   npm run build
   npm run preview
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication forms
│   ├── Charts/         # Chart components
│   ├── Dashboard/      # Dashboard widgets
│   ├── Finance/        # Finance-related components
│   ├── Layout/         # Layout components
│   └── Tasks/          # Task management components
├── contexts/           # React contexts
├── lib/               # External service configurations
├── pages/             # Main application pages
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── App.tsx            # Main application component
```

## Key Features Implementation

### Security
- Row Level Security (RLS) policies ensure users can only access their own data
- Authenticated routes protect sensitive pages
- Secure password handling through Supabase Auth

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Adaptive layouts for different screen sizes
- Touch-friendly interface elements

### Performance
- Optimized database queries with proper indexing
- Lazy loading and code splitting
- Efficient state management

### User Experience
- Intuitive navigation with sidebar layout
- Real-time updates and notifications
- Smooth animations and transitions
- Comprehensive search and filtering

## Currency Support

The application uses Indian Rupees (₹) as the default currency with proper formatting:
- `formatCurrency()` - Full currency formatting
- `formatCurrencyCompact()` - Compact notation (K, L, Cr)
- Locale-aware number formatting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions about WORKLOOP, please open an issue in the repository.