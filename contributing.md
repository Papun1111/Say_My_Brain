# Contributing to Say My Brain

First off, thank you for considering contributing to **Say My Brain**! We're excited to have you on board. This document will guide you through setting up the project locally so you can start making your contributions.

## Getting Started

### Prerequisites
Please make sure you have the following installed on your machine:
- Node.js (v18 or later recommended)
- npm (usually comes with Node.js)
- Git
- Docker and Docker Compose
- A code editor like Visual Studio Code

## Local Development Setup
Follow these steps to get the backend and frontend servers running locally.

### 1) Clone the repository
First, clone the project repository to your local machine and open it in your code editor.
```bash
git clone <repository-url>
cd say-my-brain
code .
```

### 2) Backend setup (Express + Prisma)
The backend is a Node.js server powered by Express and Prisma.

**Navigate to the server directory:**
```bash
cd packages/server
```

**Install dependencies:**
```bash
npm install
```

**Set up environment variables:**
Create a `.env` file in the `packages/server` directory. Copy the contents from `.env.example` and paste them into your new `.env` file. Fill in the required values for the database, `JWT_SECRET`, and your API keys.

**Start the database (from the project root):**
```bash
docker-compose up -d db
```

**Run database migrations:**
```bash
npx prisma migrate dev
```

**Generate Prisma Client:**
```bash
npx prisma generate
```

**Install TypeScript (if needed):**
```bash
npm i -D typescript
```

**Build and start the server:**
```bash
npm run build
npm run start
```
Your backend should now be running on `http://localhost:5001`.

### 3) Frontend setup (Next.js)
The frontend is a Next.js application.

**Navigate to the client directory (from the project root):**
```bash
cd packages/client
```

**Install dependencies:**
```bash
npm install
```

**Set up environment variables:**
Create a `.env.local` file in the `packages/client` directory. Add the following line to connect it to your local backend server:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001/api
```

**Run the development server:**
```bash
npm run dev
```
Your frontend should now be running on `http://localhost:3000`.

## Making Contributions
You are now ready to start contributing!

1. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/my-new-feature
   ```
2. Make your changes.
3. Commit your changes and push them to your forked repository.
4. Open a Pull Request against the main project repository.

We look forward to seeing your contributions!

