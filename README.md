
# Say My Brain 🧠

**Welcome to *Say My Brain***, a personal second-brain application designed to help you **save**, **organize**, and **interact** with links from around the web.

Upload content from platforms like **YouTube**, **X (Twitter)**, and **Instagram**, and use the integrated **Gemini AI** to ask questions and gain insights from your saved knowledge.

---

## 🚀 Features

* **Save & Organize**
  Easily save links from various platforms in a clean, card-based UI.

* **Automatic Previews**
  Automatically fetch metadata like titles, descriptions, and thumbnails using oEmbed APIs and fallback scraping.

* **AI-Powered Chat**
  Engage with **Gemini AI** to summarise or ask questions about your saved content.

* **Modern UI/UX**
  Sleek, animated, and fully responsive interface built with **Next.js**, **Tailwind CSS**, and **Framer Motion**.

* **Containerized Development**
  Entire app stack can be run using a single `docker-compose` command.

---

## 🛠️ How It Works

The application follows a **client-server architecture** containerized using Docker.

### 1. **Frontend (Next.js)**

* Built with React and Tailwind CSS.
* Users add links via the UI, which calls backend APIs.

### 2. **Backend (Express)**

* Node.js server fetches metadata (via oEmbed or scraping).
* Stores data in PostgreSQL via Prisma ORM.

### 3. **Database (PostgreSQL)**

* Stores metadata like title, description, thumbnails, platform, etc.

### 4. **AI Interaction (Gemini)**

* When prompted, the backend retrieves saved context and sends it + your prompt to **Gemini Pro API** for a smart response.

---

## 🧱 Tech Stack

| Area     | Technology                                                           |
| -------- | -------------------------------------------------------------------- |
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion |
| Backend  | Node.js, Express, TypeScript, Prisma ORM                             |
| Database | PostgreSQL                                                           |
| AI       | Google Gemini Pro API                                                |
| Infra    | Docker, Docker Compose                                               |

---

## 📁 Project Structure

```
second-brain/
├── docker-compose.yml
├── packages/
│   ├── client/         # Frontend (Next.js)
│   └── server/         # Backend (Express)
└── README.md
```

---

## ⚙️ Local Development Setup

### ✅ Prerequisites

* Node.js (v20+)
* Docker & Docker Compose
* npm or pnpm
* Google Gemini API Key (Get one from Google AI Studio)

---

### 📝 Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd second-brain
```

---

### 🔐 Step 2: Configure Environment Variables

#### Root `.env`

```env
# ./env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

#### Backend `.env`

```env
# ./packages/server/.env
DATABASE_URL="postgresql://user:password@db:5432/secondbrain?schema=public"
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Optional Instagram Previews
# FB_APP_ID="YOUR_FACEBOOK_APP_ID"
# FB_CLIENT_TOKEN="YOUR_FACEBOOK_CLIENT_TOKEN"
```

#### Frontend `.env.local`

```env
# ./packages/client/.env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001/api
```

---

### 📦 Step 3: Install Dependencies

```bash
# Install backend deps
cd packages/server
npm install

# Install frontend deps
cd ../client
npm install
```

---

### 🐳 Step 4: Run the Application

```bash
cd ../.. # Go to project root
docker-compose up --build
```

* Frontend → `http://localhost:3000`
* Backend → `http://localhost:5001`

---

### 🧩 Step 5: Set Up the Database

```bash
# Apply migrations
docker-compose exec server npm run prisma:migrate

# Seed sample data
docker-compose exec server npm run prisma:seed
```

🎉 Your **"Say My Brain"** app is now ready to use!

---

## 📡 API Endpoints

| Method   | Endpoint              | Description                        |
| -------- | --------------------- | ---------------------------------- |
| `GET`    | `/api/links`          | Get all saved links                |
| `POST`   | `/api/links`          | Create a new link                  |
| `DELETE` | `/api/links/:id`      | Delete a link                      |
| `POST`   | `/api/preview`        | Fetch link metadata                |
| `POST`   | `/api/links/:id/chat` | Ask Gemini a question about a link |

---

## 🤝 Contributing

1. **Fork** the project
2. **Create** your feature branch

   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** your changes

   ```bash
   git commit -m "Add AmazingFeature"
   ```
4. **Push** to GitHub

   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a pull request**

---

## 📄 License

This project is licensed under the **MIT License**.
See the [LICENSE](./LICENSE) file for more details.

---


