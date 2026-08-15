# 🌟 StarTodo — Production-Grade Task Manager & Productivity Dashboard

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, portfolio-quality, fully responsive **To-Do List and Task Management Dashboard** built with Vanilla HTML5, CSS3, and JavaScript. StarTodo delivers a rich desktop and mobile experience with real-time statistics, glassmorphic UI aesthetics, advanced search, multi-criteria sorting/filtering, theme persistence, and zero external framework dependencies.

---

## ✨ Features

### 🚀 Core Task Management (Full CRUD)
- **Create Tasks**: Title, description, due date picker, priority level (`High`, `Medium`, `Low`), and category tag.
- **Read & View**: Modern card layouts displaying status indicators, overdue highlights, category icons, and formatted dates. Supports both **Grid View** and **List View**.
- **Update Tasks**: Full modal editor to tweak any task parameters on the fly or mark tasks finished via a single checkbox click.
- **Delete Tasks**: Individual task deletion with a safety confirmation modal preview and a bulk **"Clear Completed"** action.

### 📊 Real-Time Analytics Dashboard
- Top analytics KPI cards tracking **Total**, **In Progress**, **Completed**, and **Overdue** tasks.
- Animated **Completion Velocity** progress bar and SVG circular ring indicator in the sidebar.

### 🔍 Advanced Filtering, Search & Sorting
- **Status Filters**: All Tasks, Active, Completed, and Overdue (automatically calculated against current date).
- **Category Filter**: Dynamic sidebar list aggregating categories with item counts.
- **Priority Filter**: Quick pill selection (`High`, `Med`, `Low`).
- **Live Search Bar**: Real-time filtering across task title, description, and category as you type.
- **Sorting Modes**: Newest First, Oldest First, Due Date (Earliest / Latest), Priority (High to Low), and Alphabetical (A-Z).

### 🌓 Theme Switching & LocalStorage Persistence
- Seamless **Dark Mode** (default) and **Light Mode** toggle with CSS custom properties (`var(--tokens)`).
- Persistent state saved to `window.localStorage` so tasks and theme preference survive page refreshes.
- Graceful fallback loading pre-populated sample demo tasks when launched for the first time.

### ⌨️ UX Details & Keyboard Shortcuts
- **Global Keyboard Shortcuts**:
  - `Ctrl + N` / `Alt + N` : Open "New Task" form modal.
  - `/` : Jump focus straight into the live search input.
  - `Esc` : Instantly close open modals or mobile navigation sidebars.
- **Toast Notifications**: Interactive toast alert popups for task creation, update, status toggle, and deletion.
- **Form Validation**: Real-time required field checks and inline error feedback.

---

## 🛠️ Tech Stack & Dependencies

- **Structure**: HTML5 (Semantic elements, ARIA accessibility markup).
- **Styling**: Vanilla CSS3 (Custom properties, CSS Grid, Flexbox, Glassmorphism, Keyframe animations).
- **Logic**: Vanilla JavaScript ES6+ (Modular architecture, state manager, LocalStorage API).
- **Typography & Icons**: Google Fonts ([Inter](https://fonts.google.com/specimen/Inter), [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)) and [Font Awesome 6.5](https://fontawesome.com/).

---

## 📁 Project Structure

```
todo-task-manager/
├── index.html          # Main HTML structure & semantic layout
├── style.css           # Design tokens, themes, glassmorphism, responsive rules
├── script.js          # Core JS application logic & state controller
├── README.md           # Project documentation & usage guide
└── assets/
    └── favicon.svg     # StarTodo vector brand logo & favicon
```

---

## 💻 How to Run Locally

Because StarTodo is built cleanly using standard web standards, **no build tools, Node package installs, or compilations are required**.

### Option 1: Direct Browser Launch
Simply double-click `index.html` or drag and drop it into any modern web browser (Chrome, Firefox, Edge, Safari).

### Option 2: Local HTTP Server (Recommended)
If using VS Code or Node:
```bash
# Using VS Code Live Server extension:
Right click index.html -> "Open with Live Server"

# Or using npx http-server:
npx http-server -p 8080
# Open http://localhost:8080 in your browser
```

---

## 🖼️ UI Screenshots & Previews

| Dark Dashboard View | Light Theme View |
|---|---|
| *Sleek dark interface with glassmorphism cards, stat counters & sidebar navigation.* | *Clean, accessible light theme with high contrast elements.* |

| New Task Modal | Delete Confirmation Modal |
|---|---|
| *Form validation with title, category, priority, & due date.* | *Safety preview card preventing accidental deletions.* |

---

## 🔮 Future Improvements & Roadmap

- [ ] **Subtasks & Checklist Items**: Ability to add granular subtasks to each task card.
- [ ] **Data Export / Import**: Download task backup as JSON or export task lists to CSV.
- [ ] **Drag & Drop Reordering**: Re-order task cards dynamically using HTML5 Drag and Drop API.
- [ ] **Sound Effects**: Subtle audio cues for completing tasks and deleting items.
- [ ] **PWA Support**: Service worker offline caching and Web App Manifest for mobile home screen installation.

---

## 👨‍💻 Author

Crafted as a **portfolio-grade web application** showcasing clean vanilla web architecture, responsive UI design, and accessible client-side state management.
