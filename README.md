# 🥣 ZIVA G — Artisanal Broths & Culinary Rituals

Welcome to the **Ziva G Soup** experience. We elevate comfort food into a luxury culinary ritual, delivering 18-hour copper-kettle simmered organic broths in eco-insulated glass jars.

---

## ✨ Key Features

- **🎨 World-Class UI:** Glassmorphic & Neomorphic aesthetics with high-fidelity animations.
- **🍵 Smart Catalog:** Multi-category navigation for Signature Soups, Broths, Sides, and Elixirs.
- **⚙️ Deep Customization:** Choose your portion size (8oz, 16oz, 32oz) and spice level.
- **🛒 Smart Cart Drawer:** Real-time customization editing and a "Free Delivery" progress tracker.
- **🍪 Session Persistence:** Your cart and browsing history are preserved across sessions.
- **🔐 Secure Auth:** Integrated with Clerk for a premium member experience.
- **📊 Order Engine:** Full database pipeline for tracking your culinary curations.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **Auth:** [Clerk](https://clerk.com/)
- **Database:** [Prisma](https://www.prisma.io/) with SQLite/PostgreSQL
- **State Management:** React Context API (Cart & User Activity)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+
- npm or yarn

### 2. Installation
```bash
git clone https://github.com/usama7871/Ultinum_Zeva_g.git
cd Ultinum_Zeva_g
npm install
```

### 3. Environment Setup 🔑
Create a `.env.local` file in the root directory and add the following:

```env
# Database
DATABASE_URL="file:./dev.db"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### 4. Database Initialization
```bash
npx prisma generate
npx prisma db push
```

### 5. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the results.

---

## 🌍 Deployment on Vercel

1. **Push your changes** to GitHub.
2. **Connect your repository** to Vercel.
3. **Configure Environment Variables** in the Vercel Dashboard (copy from your `.env.local`).
4. **Build Settings:**
   - Framework Preset: `Next.js`
   - Build Command: `prisma generate && next build`
   - Install Command: `npm install`
5. **Deploy!** 🚀

---

## 📜 Project Structure

- `/app`: Next.js App Router pages and API routes.
- `/components`: Reusable UI components (Cart, Navbar, Hero, etc.).
- `/context`: Global state management (Cart & Activity).
- `/lib`: Core logic, catalog engine, and database client.
- `/types`: Unified TypeScript definitions.
- `/prisma`: Database schema and migrations.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements.

---

## 📄 License

This project is licensed under the MIT License.

---

**Made with ❤️ by the Ziva G Engineering Team.**
