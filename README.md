# ⚠️ LICENSE NOTICE

This codebase is proprietary and confidential.

**Copyright (c) 2024 Pinaki Chakraborty. All Rights Reserved.**

This code is licensed exclusively to:
- **Aryabhatta National Skill Development Board (ANSDB)**
- A unit of Jibankushal Foundation
- Registered under Section 8 and MCA, India

**Educational use only. Redistribution is strictly prohibited.**

For license inquiries, please refer to the LICENSE file.

---

# ANSDB Frontend

Aryabhatta National Skill Development Board (ANSDB) - Official Website Frontend

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Zustand (State Management)
- Lucide React (Icons)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/ansdbinstitute/aryabhatta-frontend.git

# Navigate to project directory
cd aryabhatta-frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   ├── pages/            # Page components
│   ├── erp/              # ERP system (admin panel)
│   ├── student/          # Student portal
│   ├── hooks/           # Custom React hooks
│   ├── stores/          # Zustand stores
│   ├── utils/           # Utility functions
│   └── styles/          # Global styles
├── public/               # Static assets
└── index.html           # Entry point
```

## Features

- Public website with course information
- ERP admin panel for institute management
- Student portal for enrolled students
- Contact and inquiry forms
- Responsive design

## License

See [LICENSE](LICENSE) file for full license terms.
