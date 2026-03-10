# DevSpark - AI GitHub Project Idea Generator

**DevSpark** is a modern web application designed to help developers overcome "coder's block." It leverages the power of Google Gemini AI to generate rich, buildable project ideas complete with detailed plans, folder structures, and polished `README.md` files ready for your next repository.

## ✨ Features

- **🚀 AI-Powered Generation**: Uses Google's Gemini Flash models to generate creative and technically sound project blueprints.
- **🛠️ Tailored Parameters**: Customize ideas based on your skill level (Beginner to Expert), tech stack (Frontend, Backend, Fullstack, Mobile), and project type.
- **📋 Complete Blueprints**: Every generated idea includes:
  - Project Title & Detailed Description.
  - Problem statement and proposed solution.
  - Recommended Folder Structure.
  - A production-ready `README.md` snippet.
- **💾 Local Persistence**: Save your favorite brainstormed ideas to your browser's local storage for later reference.
- **🌓 Dark Mode Support**: A premium design that looks great in both light and dark themes.
- **🔗 Quick Export**: Copy or download the generated README instantly to kickstart your project.

## 🚀 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **AI Engine**: [Google Gemini Pro/Flash](https://ai.google.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Formatting**: [Biome](https://biomejs.dev/)
- **Components**: [Shadcn/UI](https://ui.shadcn.com/) (Customized)

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- A Google AI (Gemini) API Key

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/pratham-prog861/devspark.git
   cd devspark
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add your Gemini API key:

   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```bash
src/
├── app/            # Next.js App Router pages and layouts
├── components/     # Reusable UI components
│   ├── ui/         # Base UI components (buttons, cards, etc.)
│   └── ...         # Feature-specific components
├── lib/            # Utility libraries (AI integration, etc.)
├── types/          # TypeScript definitions
└── utils/          # Helper functions and constants
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙌 Acknowledgements

- Built with ❤️ for the developer community.
- Inspired by the need for better brainstorming tools.
- Powered by Vercel and Google AI.
