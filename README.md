# Zooptick Monorepo

Unified monorepo housing both the frontend (React + Vite) and backend (Node.js + Express API) for Zooptick.

---

## 📁 Repository Structure

```text
zooptick/
├── web/                  # Frontend Application (React + Vite)
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
├── server/               # Backend API (Node.js + Express + MongoDB)
│   ├── db/
│   ├── middleware/
│   ├── models/
│   ├── index.js
│   ├── package.json
│   └── vercel.json
│
├── .gitignore            # Workspace-wide ignore rules
└── README.md
```

---

## 🚀 Local Development

### 1. Backend Setup (`server/`)
```bash
cd server
npm install
# Create a .env file with your backend environment variables (e.g. PORT, MONGO_URI, CLOUDINARY credentials)
npm start # or npm run dev (nodemon)
```

### 2. Frontend Setup (`web/`)
```bash
cd web
npm install
# Create a .env file with your frontend environment variables (e.g. VITE_API_URL)
npm run dev
```

---

## 🌐 Deploying to Vercel Independently

You can host both the frontend and backend as two independent projects on Vercel linked to this same repository:

### 1. Frontend Project (`zooptick-web`)
1. In Vercel Dashboard, click **Add New... &rarr; Project**.
2. Select your `zooptick` repository.
3. In **Project Settings**:
   - **Root Directory**: Click *Edit* and select **`web`**.
   - **Framework Preset**: *Vite* (or automatically detected).
   - **Environment Variables**: Add your frontend environment variables (e.g., `VITE_API_URL`).
4. Click **Deploy**.

### 2. Backend Project (`zooptick-server`)
1. In Vercel Dashboard, click **Add New... &rarr; Project**.
2. Select the same `zooptick` repository again.
3. In **Project Settings**:
   - **Root Directory**: Click *Edit* and select **`server`**.
   - **Framework Preset**: *Other* (Node.js).
   - **Environment Variables**: Add your backend environment variables (e.g., `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_*`, etc.).
4. Click **Deploy**.

> **Note**: Vercel automatically isolates builds. Commits touching only `web/` will only trigger a rebuild for the frontend project, and commits touching only `server/` will only trigger a rebuild for the backend project.

---

## 📤 Pushing to Your New GitHub Repository

When you create the empty repository `zooptick` on GitHub:

```bash
# Add your new GitHub repository remote
git remote add origin https://github.com/<your-username>/zooptick.git

# Ensure branch is main
git branch -M main

# Push all commits and branches
git push -u origin main
```
