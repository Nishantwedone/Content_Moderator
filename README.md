# Content Moderation Platform

An intelligent community platform empowered by AI to ensure safe and engaging user interactions. This application uses Google's Gemini AI to automatically moderate content (text and images) and provides a robust dashboard for human moderators and administrators.

## 🚀 Features

-   **AI-Powered Moderation**: Automatically flags inappropriate content (violence, hate speech, harassment) using Gemini AI.
-   **Role-Based Access Control (RBAC)**: Distinct dashboards and permissions for Users, Moderators, and Administrators.
-   **Community Management**: Create and join communities, post content, and engage with others.
-   **Interactive Dashboards**:
    -   **Admin**: Platform-wide analytics, user management, and system health monitoring.
    -   **Moderator**: Dedicated queue for reviewing flagged content with AI insights.
    -   **User**: Personal feed and post management.
-   **Secure Authentication**: Powered by NextAuth.js supporting Google, GitHub, and Email/Password flows.
-   **Responsive Design**: Built with Tailwind CSS and Shadcn UI for a beautiful mobile-first experience.

## 🛠️ Tech Stack

-   **Framework**: Next.js 15 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS, Shadcn UI, Lucide Icons
-   **Database**: PostgreSQL (via Prisma ORM)
-   **Auth**: NextAuth.js (v4)
-   **AI**: Google Generative AI (Gemini)
-   **Charts**: Recharts

---

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

-   Node.js (v18 or higher)
-   npm, yarn, or pnpm
-   A PostgreSQL database (Local or Remote like Neon/Supabase)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd content-moderation-platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the following:

```env
# Database Connection (PostgreSQL)
DATABASE_URL="postgres://user:password@host:5432/dbname?sslmode=require"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key"

# Semantic Authentication (Optional for Google/GitHub login)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"

# AI Integration (Required for moderation)
GEMINI_API_KEY="your-gemini-api-key"

# Role Claiming Secrets (For development/demo)
ADMIN_SECRET="admin123"
MODERATOR_SECRET="mod123"
```

### 4. Setup Database

Push the database schema to your PostgreSQL instance:

```bash
npx prisma db push
```

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 User Guide

### 1. Registration & Login
-   Click **Register** to create a new account.
-   By default, all new users are assigned the **USER** role.
-   Users can create posts and view communities but cannot access Admin/Moderator dashboards.

### 2. Claiming Roles (Admin/Moderator)
To access elevated privileges, you can "claim" a role using the configured secrets.

1.  Log in to your account.
2.  Click the **Claim Role** button in the top navigation bar (or User Menu on mobile).
3.  Select the desired role (**Admin** or **Moderator**).
4.  Enter the secret key:
    -   **Admin Key**: `admin123` (or as configured in `.env`)
    -   **Moderator Key**: `mod123` (or as configured in `.env`)
5.  Upon success, your dashboard access will be updated immediately.

### 3. Posting Content
-   Navigate to **New Post**.
-   Select a community, enter a title/content, or upload an image.
-   **AI Check**: When you submit, the content is analyzed by Gemini AI.
    -   **Safe**: Published immediately.
    -   **Flagged**: Sent to the Moderation Queue (status: PENDING/FLAGGED).

### 4. Moderation Workflow
-   **Moderators** access the **Mod Queue** via their dashboard.
-   They can view flagged posts, see the AI's reasoning, and choose to **Approve** or **Reject** the content.
-   Actions are logged for transparency.

---

## 🚀 Deployment

The application is optimized for deployment on **Vercel**.

1.  Push your code to a GitHub repository.
2.  Import the project in Vercel.
3.  Add the **Environment Variables** (from your `.env`) in the Vercel Project Settings.
4.  Deploy!

For the database, ensure your database provider (e.g., Neon, Supabase, Render) allows connections from Vercel.
