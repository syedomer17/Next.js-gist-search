---

### ✅ FIXES & ENHANCEMENTS:

1. **Fix the ending of the code block (\`\`\`\`markdown)** at the start.
2. **Consistent formatting** for links and spacing.
3. Added a placeholder for your portfolio and license file if missing.
4. Slight formatting tweaks for better Markdown rendering.

---

### ✅ FINAL VERSION:


# 🔍 GitHub Gist Explorer

A powerful and modern GitHub Gist search and management application built with **Next.js 15**, **TailwindCSS**, **TypeScript**, **MongoDB**, and **Auth.js** for GitHub OAuth.

---

## ✨ Features

- 🔐 GitHub OAuth Authentication (via Auth.js)
- 👤 Display logged-in user's GitHub avatar and username
- 🔎 Search any GitHub user's public gists
- 📁 View gist files with syntax highlighting
- ✏️ Create, Edit, and Delete your own gists
- ❤️ Like and ⭐ favorite gists
- 🔄 Fork public gists
- 🎨 Smooth UI/UX with TailwindCSS and Framer Motion
- ⚡ Instant filtering with a responsive search bar
- ⏳ Skeleton loaders & shimmer effects
- 🍪 Secure token management using HTTP-only cookies
- 📦 MongoDB for user session and token storage

---

## 🛠 Tech Stack

<p align="left">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Auth.js-0F172A?style=for-the-badge&logo=auth0&logoColor=white" alt="Auth.js" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/GitHub%20OAuth-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub OAuth" />
  <img src="https://img.shields.io/badge/Framer%20Motion-EF0184?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/syedomer17/Next.js-gist-search
cd Next.js-gist-search
````

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```env
GITHUB_ID=your_github_oauth_client_id
GITHUB_SECRET=your_github_oauth_client_secret
NEXTAUTH_SECRET=your_strong_secret
NEXTAUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
```

### 4. Run the development server

```bash
npm run dev
```

---

## 🧪 Project Structure

```
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── gist/[gistid]/page.tsx
├── components/
│   ├── Navbar.tsx
│   ├── GistCard.tsx
│   └── AnimatedLoader.tsx
├── hooks/
│   └── useSessionUser.ts
├── lib/
│   └── mongodb.ts
├── pages/
│   └── api/
│       └── auth/[...nextauth].ts
├── public/
├── styles/
│   └── globals.css
└── utils/
```

---

## 🧠 Learnings

* Deep integration with GitHub API and OAuth2 flow
* Handling access and refresh tokens securely with cookies
* Advanced use of dynamic routing and server/client component separation in Next.js 15
* Building responsive, animated UIs using Tailwind and Framer Motion

---

## 🧑‍💻 Author

**Syed Omer Ali**
🌐 [Portfolio](https://next-js-portfolio-gsb1-cs5pebze5-syedomer17s-projects.vercel.app/)
🐱 [GitHub](https://github.com/syedomer17)
📫 [LinkedIn](https://www.linkedin.com/in/syedomerali)

---

## 📝 License

This project is licensed under the [MIT License](./LICENSE).

