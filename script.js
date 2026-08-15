/**
 * StarTodo - Portfolio-Grade Task Manager & Auth Web Application
 * Modular Vanilla JavaScript Implementation
 */

// ==========================================================================
// 1. Application State & Constants
// ==========================================================================
const STORAGE_KEY_TASKS = 'startodo_tasks';
const STORAGE_KEY_THEME = 'startodo_theme';
const STORAGE_KEY_USER = 'startodo_current_user';
const STORAGE_KEY_USERS_DB = 'startodo_users_db';
const STORAGE_KEY_NOTIFICATIONS = 'startodo_notifications';

const state = {
  currentUser: null, // { name, email, avatar, loggedIn }
  usersDB: [],
  tasks: [],
  notifications: [],
  filters: {
    status: 'all',       // 'all' | 'active' | 'completed' | 'overdue'
    category: 'all',     // 'all' | category name
    priority: 'all',     // 'all' | 'High' | 'Medium' | 'Low'
    searchQuery: '',
  },
  sortCriteria: 'newest', // 'newest' | 'oldest' | 'dueDate' | 'dueDateDesc' | 'priority' | 'alphabetical'
  viewMode: 'grid',       // 'grid' | 'list'
  deletingTaskId: null,
};

// Default Demo User Account
const DEMO_USER = {
  name: 'Alex Morgan',
  email: 'demo@startodo.com',
  password: 'password123',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  loggedIn: true,
};

// Initial Sample Demo Tasks
const SAMPLE_TASKS = [
  {
    id: 'task_demo_1',
    title: 'Design StarTodo Web App Prototype',
    description: 'Craft a modern, glassmorphic dashboard interface with smooth animations and light/dark theme persistence.',
    category: 'Design',
    priority: 'High',
    dueDate: getFormattedDateOffset(1),
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: 'task_demo_2',
    title: 'Implement Glassmorphic User Login System',
    description: 'Ensure user authentication state, registration, and theme preferences safely persist across page reloads.',
    category: 'Coding',
    priority: 'High',
    dueDate: getFormattedDateOffset(0),
    completed: true,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'task_demo_3',
    title: 'Quarterly Financial & Expense Review',
    description: 'Gather invoice summaries and compile budget forecasts for upcoming software subscriptions.',
    category: 'Finance',
    priority: 'Medium',
    dueDate: getFormattedDateOffset(4),
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'task_demo_4',
    title: 'Prepare Weekly Progress Presentation',
    description: 'Summarize key engineering metrics, sprint velocity, and open backlog tickets.',
    category: 'Work',
    priority: 'Low',
    dueDate: getFormattedDateOffset(-2),
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  }
];

function getFormattedDateOffset(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

// ==========================================================================
// 2. DOM Elements Selection
// ==========================================================================
const elements = {
  html: document.documentElement,
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  mobileSidebarToggle: document.getElementById('mobileSidebarToggle'),
  appSidebar: document.getElementById('appSidebar'),
  sidebarOverlay: document.getElementById('sidebarOverlay'),
  
  // Auth Overlay & Cards
  authOverlay: document.getElementById('authOverlay'),
  closeAuthOverlayBtn: document.getElementById('closeAuthOverlayBtn'),
  loginView: document.getElementById('loginView'),
  registerView: document.getElementById('registerView'),
  forgotView: document.getElementById('forgotView'),
  loginForm: document.getElementById('loginForm'),
  registerForm: document.getElementById('registerForm'),
  forgotForm: document.getElementById('forgotForm'),
  loginEmail: document.getElementById('loginEmail'),
  loginPassword: document.getElementById('loginPassword'),
  demoLoginBtn: document.getElementById('demoLoginBtn'),
  switchToRegisterBtn: document.getElementById('switchToRegisterBtn'),
  switchToLoginBtn: document.getElementById('switchToLoginBtn'),
  showForgotPasswordBtn: document.getElementById('showForgotPasswordBtn'),
  backToLoginFromForgotBtn: document.getElementById('backToLoginFromForgotBtn'),
  navLoginBtn: document.getElementById('navLoginBtn'),
  
  // User Profile Header
  userProfileMenu: document.getElementById('userProfileMenu'),
  userProfileTrigger: document.getElementById('userProfileTrigger'),
  headerUserAvatar: document.getElementById('headerUserAvatar'),
  headerUserName: document.getElementById('headerUserName'),
  dropdownUserAvatar: document.getElementById('dropdownUserAvatar'),
  dropdownUserName: document.getElementById('dropdownUserName'),
  dropdownUserEmail: document.getElementById('dropdownUserEmail'),
  openAuthModalHeaderBtn: document.getElementById('openAuthModalHeaderBtn'),
  logoutBtn: document.getElementById('logoutBtn'),
  authActionText: document.getElementById('authActionText'),

  // Notification Center Elements
  notificationCenterMenu: document.getElementById('notificationCenterMenu'),
  notificationBellBtn: document.getElementById('notificationBellBtn'),
  notificationBadgeCount: document.getElementById('notificationBadgeCount'),
  notificationDropdownCard: document.getElementById('notificationDropdownCard'),
  enableDesktopNotifBtn: document.getElementById('enableDesktopNotifBtn'),
  markAllReadBtn: document.getElementById('markAllReadBtn'),
  notificationList: document.getElementById('notificationList'),
  clearNotifHistoryBtn: document.getElementById('clearNotifHistoryBtn'),
  
  // Search & Filters
  searchInput: document.getElementById('searchInput'),
  searchClearBtn: document.getElementById('searchClearBtn'),
  categoryNav: document.getElementById('categoryNav'),
  statusNavButtons: document.querySelectorAll('[data-status-filter]'),
  priorityPills: document.querySelectorAll('[data-priority-filter]'),
  sortSelect: document.getElementById('sortSelect'),
  
  // View Modes & Actions
  viewGridBtn: document.getElementById('viewGridBtn'),
  viewListBtn: document.getElementById('viewListBtn'),
  viewTitle: document.getElementById('viewTitle'),
  taskCountPill: document.getElementById('taskCountPill'),
  activeFiltersBar: document.getElementById('activeFiltersBar'),
  filterTagsContainer: document.getElementById('filterTagsContainer'),
  resetFiltersBtn: document.getElementById('resetFiltersBtn'),
  clearCompletedBtn: document.getElementById('clearCompletedBtn'),
  
  // Task Display Grid & Empty State
  taskGridContainer: document.getElementById('taskGridContainer'),
  emptyState: document.getElementById('emptyState'),
  emptyTitle: document.getElementById('emptyTitle'),
  emptyDescription: document.getElementById('emptyDescription'),
  emptyActionBtn: document.getElementById('emptyActionBtn'),
  
  // Stats Counters
  statTotal: document.getElementById('statTotal'),
  statActive: document.getElementById('statActive'),
  statCompleted: document.getElementById('statCompleted'),
  statOverdue: document.getElementById('statOverdue'),
  badgeAll: document.getElementById('badgeAll'),
  badgeActive: document.getElementById('badgeActive'),
  badgeCompleted: document.getElementById('badgeCompleted'),
  badgeOverdue: document.getElementById('badgeOverdue'),
  
  // Progress Elements
  progressBarFill: document.getElementById('progressBarFill'),
  progressPercentageText: document.getElementById('progressPercentageText'),
  sidebarProgressCircle: document.getElementById('sidebarProgressCircle'),
  sidebarProgressText: document.getElementById('sidebarProgressText'),
  sidebarProgressSub: document.getElementById('sidebarProgressSub'),
  
  // Modals & Forms
  openAddTaskBtn: document.getElementById('openAddTaskBtn'),
  taskModalBackdrop: document.getElementById('taskModalBackdrop'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  cancelModalBtn: document.getElementById('cancelModalBtn'),
  taskForm: document.getElementById('taskForm'),
  taskIdInput: document.getElementById('taskIdInput'),
  taskTitleInput: document.getElementById('taskTitleInput'),
  taskDescInput: document.getElementById('taskDescInput'),
  taskCategoryInput: document.getElementById('taskCategoryInput'),
  taskPriorityInput: document.getElementById('taskPriorityInput'),
  taskDueDateInput: document.getElementById('taskDueDateInput'),
  modalTitle: document.getElementById('modalTitle'),
  saveBtnText: document.getElementById('saveBtnText'),
  
  // Delete Modal
  deleteModalBackdrop: document.getElementById('deleteModalBackdrop'),
  closeDeleteModalBtn: document.getElementById('closeDeleteModalBtn'),
  cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
  confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
  deletePreviewTitle: document.getElementById('deletePreviewTitle'),
  deletePreviewCategory: document.getElementById('deletePreviewCategory'),
  
  // Toast Host
  toastContainer: document.getElementById('toastContainer'),
};

// ==========================================================================
// 3. User Authentication Engine
// ==========================================================================

function initAuth() {
  try {
    const savedUsers = localStorage.getItem(STORAGE_KEY_USERS_DB);
    state.usersDB = savedUsers ? JSON.parse(savedUsers) : [DEMO_USER];
  } catch (e) {
    state.usersDB = [DEMO_USER];
  }

  try {
    const savedUser = localStorage.getItem(STORAGE_KEY_USER);
    if (savedUser) {
      state.currentUser = JSON.parse(savedUser);
    }
  } catch (e) {
    state.currentUser = null;
  }

  updateAuthUI();
}

function updateAuthUI() {
  if (state.currentUser && state.currentUser.loggedIn) {
    elements.authOverlay.classList.remove('active');
    elements.headerUserName.textContent = state.currentUser.name;
    elements.headerUserAvatar.src = state.currentUser.avatar;
    elements.dropdownUserName.textContent = state.currentUser.name;
    elements.dropdownUserEmail.textContent = state.currentUser.email;
    elements.dropdownUserAvatar.src = state.currentUser.avatar;
    elements.authActionText.textContent = 'Switch Account';
  } else {
    elements.authOverlay.classList.add('active');
    elements.headerUserName.textContent = 'Sign In';
    elements.headerUserAvatar.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest';
    elements.dropdownUserName.textContent = 'Guest User';
    elements.dropdownUserEmail.textContent = 'Not logged in';
    elements.dropdownUserAvatar.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest';
    elements.authActionText.textContent = 'Log In / Register';
  }
}

function loginUser(email, password) {
  const user = state.usersDB.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (user && user.password === password) {
    state.currentUser = {
      name: user.name,
      email: user.email,
      avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`,
      loggedIn: true
    };
    
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(state.currentUser));
    updateAuthUI();
    pushNotification(`Welcome back, ${state.currentUser.name}!`, 'Signed into StarTodo workspace.', 'info');
    return true;
  } else {
    showToast('Invalid email or password', 'error');
    return false;
  }
}

function registerUser(name, email, password) {
  const existing = state.usersDB.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    showToast('An account with this email already exists', 'warning');
    return false;
  }

  const newUser = {
    name: name.trim(),
    email: email.trim(),
    password: password,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`,
  };

  state.usersDB.push(newUser);
  localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(state.usersDB));

  return loginUser(email, password);
}

function logoutUser() {
  state.currentUser = null;
  localStorage.removeItem(STORAGE_KEY_USER);
  updateAuthUI();
  elements.userProfileMenu.classList.remove('active');
  showToast('Logged out successfully', 'info');
}

function togglePasswordVisibility(inputId, btnEl) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  btnEl.innerHTML = `<i class="fa-solid fa-${isPassword ? 'eye-slash' : 'eye'}"></i>`;
}

function switchAuthView(viewName) {
  elements.loginView.classList.remove('active');
  elements.registerView.classList.remove('active');
  elements.forgotView.classList.remove('active');

  if (viewName === 'register') elements.registerView.classList.add('active');
  else if (viewName === 'forgot') elements.forgotView.classList.add('active');
  else elements.loginView.classList.add('active');
}

// ==========================================================================
// 4. User Notification Engine (In-App Notification Center & Desktop Alerts)
// ==========================================================================

function initNotifications() {
  try {
    const savedNotifs = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
    if (savedNotifs) {
      state.notifications = JSON.parse(savedNotifs);
    } else {
      // Default welcome notification
      state.notifications = [
        {
          id: 'notif_welcome',
          title: 'Welcome to StarTodo!',
          message: 'Explore categories, search tasks, toggle dark/light theme, and enable desktop alerts.',
          type: 'info',
          unread: true,
          timestamp: new Date().toISOString(),
        }
      ];
      saveNotifications();
    }
  } catch (e) {
    state.notifications = [];
  }

  renderNotificationsUI();
  checkOverdueTaskNotifications();

  // Run periodic check for due/overdue tasks every 60 seconds
  setInterval(checkOverdueTaskNotifications, 60000);
}

function saveNotifications() {
  try {
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(state.notifications));
  } catch (e) {
    console.error('Failed to save notifications:', e);
  }
}

function pushNotification(title, message, type = 'info') {
  const newNotif = {
    id: 'notif_' + Date.now(),
    title: title,
    message: message,
    type: type, // 'overdue' | 'success' | 'info'
    unread: true,
    timestamp: new Date().toISOString(),
  };

  state.notifications.unshift(newNotif);
  // Keep max 30 recent notifications
  if (state.notifications.length > 30) {
    state.notifications = state.notifications.slice(0, 30);
  }

  saveNotifications();
  renderNotificationsUI();
  showToast(`${title}: ${message}`, type === 'overdue' ? 'error' : type);
  sendDesktopNotification(title, message);
}

function renderNotificationsUI() {
  const unreadCount = state.notifications.filter(n => n.unread).length;

  if (unreadCount > 0) {
    elements.notificationBadgeCount.hidden = false;
    elements.notificationBadgeCount.textContent = unreadCount;
  } else {
    elements.notificationBadgeCount.hidden = true;
  }

  if (state.notifications.length === 0) {
    elements.notificationList.innerHTML = `
      <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
        No notifications yet
      </div>
    `;
    return;
  }

  elements.notificationList.innerHTML = state.notifications.map(n => {
    let iconClass = 'fa-circle-info';
    if (n.type === 'overdue') iconClass = 'fa-triangle-exclamation';
    if (n.type === 'success') iconClass = 'fa-circle-check';

    const timeAgo = formatTimeAgo(n.timestamp);

    return `
      <div class="notif-item ${n.unread ? 'unread' : ''}" data-id="${n.id}">
        <div class="notif-item-icon type-${n.type}">
          <i class="fa-solid ${iconClass}"></i>
        </div>
        <div class="notif-item-content">
          <span class="notif-item-title">${escapeHTML(n.title)}</span>
          <span class="notif-item-desc">${escapeHTML(n.message)}</span>
          <span class="notif-item-time">${timeAgo}</span>
        </div>
      </div>
    `;
  }).join('');
}

function markAllNotificationsAsRead() {
  state.notifications.forEach(n => n.unread = false);
  saveNotifications();
  renderNotificationsUI();
  showToast('All notifications marked as read', 'info');
}

function clearAllNotifications() {
  state.notifications = [];
  saveNotifications();
  renderNotificationsUI();
  showToast('Notification history cleared', 'info');
}

function requestDesktopNotificationPermission() {
  if (!('Notification' in window)) {
    showToast('Browser Desktop Notifications not supported in this browser', 'warning');
    return;
  }

  if (Notification.permission === 'granted') {
    showToast('Desktop notifications are already enabled!', 'success');
    sendDesktopNotification('StarTodo Notifications Enabled', 'You will receive desktop alerts for overdue tasks!');
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        showToast('Desktop Notifications Enabled!', 'success');
        sendDesktopNotification('StarTodo Notifications Enabled', 'You will receive desktop alerts for overdue tasks!');
      } else {
        showToast('Desktop notification permission was denied', 'warning');
      }
    });
  } else {
    showToast('Notifications are blocked in your browser settings', 'warning');
  }
}

function sendDesktopNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body: body,
        icon: 'assets/favicon.svg',
      });
    } catch (e) {
      console.warn('Native notification trigger failed:', e);
    }
  }
}

function checkOverdueTaskNotifications() {
  const today = getFormattedDateOffset(0);
  const overdueTasks = state.tasks.filter(t => t.dueDate < today && !t.completed);

  overdueTasks.forEach(task => {
    // Check if we already logged an overdue notification for this task today
    const existing = state.notifications.find(n => n.title.includes(task.title) && n.type === 'overdue');
    if (!existing) {
      pushNotification(`Task Overdue: ${task.title}`, `Due date (${task.dueDate}) has passed!`, 'overdue');
    }
  });
}

function formatTimeAgo(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ==========================================================================
// 5. Core Functions Required by Brief
// ==========================================================================

function loadTasks() {
  try {
    const data = localStorage.getItem(STORAGE_KEY_TASKS);
    if (data) {
      state.tasks = JSON.parse(data);
    } else {
      state.tasks = [...SAMPLE_TASKS];
      saveTasks();
    }
  } catch (err) {
    console.error('Failed to parse LocalStorage tasks:', err);
    state.tasks = [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(state.tasks));
  } catch (err) {
    console.error('Failed to save to LocalStorage:', err);
    showToast('Failed to save data to storage', 'error');
  }
}

function addTask(taskData) {
  const newTask = {
    id: 'task_' + Date.now(),
    title: taskData.title.trim(),
    description: taskData.description.trim(),
    category: taskData.category.trim() || 'General',
    priority: taskData.priority,
    dueDate: taskData.dueDate,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  state.tasks.unshift(newTask);
  saveTasks();
  updateStatistics();
  renderTasks();
  renderCategoriesNav();
  
  pushNotification('Task Created', `"${newTask.title}" added to your workspace.`, 'success');
}

function updateTask(taskId, updatedData) {
  const index = state.tasks.findIndex(t => t.id === taskId);
  if (index !== -1) {
    state.tasks[index] = {
      ...state.tasks[index],
      title: updatedData.title.trim(),
      description: updatedData.description.trim(),
      category: updatedData.category.trim() || 'General',
      priority: updatedData.priority,
      dueDate: updatedData.dueDate,
    };
    saveTasks();
    updateStatistics();
    renderTasks();
    renderCategoriesNav();
    
    pushNotification('Task Updated', `"${updatedData.title}" details updated.`, 'info');
  }
}

function deleteTask(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  state.tasks = state.tasks.filter(t => t.id !== taskId);
  saveTasks();
  updateStatistics();
  renderTasks();
  renderCategoriesNav();
  
  if (task) {
    pushNotification('Task Removed', `"${task.title}" deleted from list.`, 'info');
  }
}

function toggleTaskStatus(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    updateStatistics();
    renderTasks();
    
    const message = task.completed ? `🎉 Task "${task.title}" completed!` : `Task "${task.title}" marked as active.`;
    pushNotification(task.completed ? 'Task Completed!' : 'Task Re-opened', message, task.completed ? 'success' : 'info');
  }
}

function filterTasks(tasks) {
  const today = getFormattedDateOffset(0);

  return tasks.filter(task => {
    if (state.filters.status === 'active' && task.completed) return false;
    if (state.filters.status === 'completed' && !task.completed) return false;
    if (state.filters.status === 'overdue') {
      const isOverdue = task.dueDate < today && !task.completed;
      if (!isOverdue) return false;
    }

    if (state.filters.category !== 'all') {
      if (task.category.toLowerCase() !== state.filters.category.toLowerCase()) return false;
    }

    if (state.filters.priority !== 'all') {
      if (task.priority !== state.filters.priority) return false;
    }

    return true;
  });
}

function searchTasks(tasks, query) {
  if (!query || query.trim() === '') return tasks;
  const q = query.toLowerCase().trim();
  
  return tasks.filter(task => 
    task.title.toLowerCase().includes(q) ||
    task.description.toLowerCase().includes(q) ||
    task.category.toLowerCase().includes(q)
  );
}

function sortTasks(tasks, criteria) {
  const sorted = [...tasks];
  const priorityWeights = { High: 3, Medium: 2, Low: 1 };

  switch (criteria) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case 'dueDate':
      return sorted.sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));
    case 'dueDateDesc':
      return sorted.sort((a, b) => (b.dueDate || '').localeCompare(a.dueDate || ''));
    case 'priority':
      return sorted.sort((a, b) => (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0));
    case 'alphabetical':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sorted;
  }
}

function updateStatistics() {
  const today = getFormattedDateOffset(0);
  const total = state.tasks.length;
  const completed = state.tasks.filter(t => t.completed).length;
  const active = total - completed;
  const overdue = state.tasks.filter(t => t.dueDate < today && !t.completed).length;
  
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  elements.statTotal.textContent = total;
  elements.statActive.textContent = active;
  elements.statCompleted.textContent = completed;
  elements.statOverdue.textContent = overdue;

  elements.badgeAll.textContent = total;
  elements.badgeActive.textContent = active;
  elements.badgeCompleted.textContent = completed;
  elements.badgeOverdue.textContent = overdue;

  elements.progressBarFill.style.width = `${completionPercentage}%`;
  elements.progressPercentageText.textContent = `${completionPercentage}% Completed`;

  const offset = 113 - (113 * completionPercentage) / 100;
  elements.sidebarProgressCircle.style.strokeDashoffset = offset;
  elements.sidebarProgressText.textContent = `${completionPercentage}%`;
  elements.sidebarProgressSub.textContent = `${completed} of ${total} tasks completed`;
}

function renderTasks() {
  let result = searchTasks(state.tasks, state.filters.searchQuery);
  result = filterTasks(result);
  result = sortTasks(result, state.sortCriteria);

  elements.taskGridContainer.className = `task-grid view-${state.viewMode}`;

  if (result.length === 0) {
    elements.taskGridContainer.innerHTML = '';
    elements.taskGridContainer.hidden = true;
    elements.emptyState.hidden = false;
    updateEmptyStateMessage();
  } else {
    elements.emptyState.hidden = true;
    elements.taskGridContainer.hidden = false;
    elements.taskGridContainer.innerHTML = result.map(createTaskCardHTML).join('');
  }

  elements.taskCountPill.textContent = `${result.length} ${result.length === 1 ? 'item' : 'items'}`;
  renderActiveFiltersBar();
}

// ==========================================================================
// 6. HTML Template Generators & Dynamic UI Renderers
// ==========================================================================

function createTaskCardHTML(task) {
  const today = getFormattedDateOffset(0);
  const isOverdue = task.dueDate < today && !task.completed;
  const isCompleted = task.completed;

  let priorityClass = 'badge-priority-medium';
  if (task.priority === 'High') priorityClass = 'badge-priority-high';
  if (task.priority === 'Low') priorityClass = 'badge-priority-low';

  const formattedDueDate = formatDateDisplay(task.dueDate);

  return `
    <article class="task-card ${isCompleted ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}" data-id="${task.id}">
      <div class="task-card-header">
        <div class="task-checkbox-wrapper">
          <input 
            type="checkbox" 
            class="task-checkbox" 
            ${isCompleted ? 'checked' : ''} 
            onchange="toggleTaskStatus('${task.id}')"
            aria-label="Mark task '${escapeHTML(task.title)}' as completed"
          />
          <h3 class="task-card-title">${escapeHTML(task.title)}</h3>
        </div>
      </div>

      <div class="card-badges-row">
        <span class="badge badge-category">
          <i class="fa-solid fa-folder"></i> ${escapeHTML(task.category)}
        </span>
        <span class="badge ${priorityClass}">
          <i class="fa-solid fa-flag"></i> ${task.priority}
        </span>
        ${isOverdue ? `
          <span class="badge badge-overdue-tag">
            <i class="fa-solid fa-triangle-exclamation"></i> Overdue
          </span>
        ` : ''}
      </div>

      ${task.description ? `
        <p class="task-card-desc">${escapeHTML(task.description)}</p>
      ` : ''}

      <div class="task-card-footer">
        <div class="task-date-info ${isOverdue ? 'color-danger' : ''}">
          <i class="fa-solid fa-calendar-day"></i>
          <span>${isCompleted ? 'Completed' : `Due ${formattedDueDate}`}</span>
        </div>

        <div class="task-card-actions">
          <button 
            class="card-action-btn edit-btn" 
            onclick="openEditTaskModal('${task.id}')" 
            title="Edit Task"
            aria-label="Edit task"
          >
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button 
            class="card-action-btn delete-btn" 
            onclick="openDeleteModal('${task.id}')" 
            title="Delete Task"
            aria-label="Delete task"
          >
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderCategoriesNav() {
  const categoriesMap = new Map();
  const defaultCats = ['Work', 'Personal', 'Coding', 'Design', 'Finance', 'Health'];
  
  defaultCats.forEach(c => categoriesMap.set(c, 0));
  
  state.tasks.forEach(task => {
    const cat = task.category.trim();
    if (cat) {
      categoriesMap.set(cat, (categoriesMap.get(cat) || 0) + 1);
    }
  });

  let html = `
    <button class="nav-item ${state.filters.category === 'all' ? 'active' : ''}" onclick="setCategoryFilter('all')">
      <span class="nav-icon"><i class="fa-solid fa-folder-open"></i></span>
      <span class="nav-label">All Categories</span>
    </button>
  `;

  categoriesMap.forEach((count, catName) => {
    const isActive = state.filters.category.toLowerCase() === catName.toLowerCase();
    html += `
      <button class="nav-item ${isActive ? 'active' : ''}" onclick="setCategoryFilter('${escapeHTML(catName)}')">
        <span class="nav-icon"><i class="fa-solid fa-folder"></i></span>
        <span class="nav-label">${escapeHTML(catName)}</span>
        <span class="nav-badge">${count}</span>
      </button>
    `;
  });

  elements.categoryNav.innerHTML = html;
}

function renderActiveFiltersBar() {
  const tags = [];

  if (state.filters.status !== 'all') {
    tags.push({ label: `Status: ${capitalize(state.filters.status)}`, type: 'status' });
  }
  if (state.filters.category !== 'all') {
    tags.push({ label: `Category: ${state.filters.category}`, type: 'category' });
  }
  if (state.filters.priority !== 'all') {
    tags.push({ label: `Priority: ${state.filters.priority}`, type: 'priority' });
  }
  if (state.filters.searchQuery.trim() !== '') {
    tags.push({ label: `Search: "${state.filters.searchQuery}"`, type: 'search' });
  }

  if (tags.length > 0) {
    elements.activeFiltersBar.hidden = false;
    elements.filterTagsContainer.innerHTML = tags.map(tag => `
      <span class="filter-tag">
        ${escapeHTML(tag.label)}
        <span class="filter-tag-remove" onclick="removeFilterTag('${tag.type}')" title="Remove filter">
          <i class="fa-solid fa-xmark"></i>
        </span>
      </span>
    `).join('');
  } else {
    elements.activeFiltersBar.hidden = true;
  }
}

function updateEmptyStateMessage() {
  if (state.tasks.length === 0) {
    elements.emptyTitle.textContent = 'No Tasks Yet';
    elements.emptyDescription.textContent = 'Get started by creating your first task to boost your productivity.';
  } else {
    elements.emptyTitle.textContent = 'No Matching Tasks';
    elements.emptyDescription.textContent = 'No tasks matched your current filter or search query. Try clearing your filters.';
  }
}

// ==========================================================================
// 7. User Interaction & Event Handlers
// ==========================================================================

function setCategoryFilter(category) {
  state.filters.category = category;
  renderCategoriesNav();
  renderTasks();
}

function removeFilterTag(type) {
  if (type === 'status') state.filters.status = 'all';
  if (type === 'category') state.filters.category = 'all';
  if (type === 'priority') state.filters.priority = 'all';
  if (type === 'search') {
    state.filters.searchQuery = '';
    elements.searchInput.value = '';
    elements.searchClearBtn.hidden = true;
  }

  elements.statusNavButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.statusFilter === state.filters.status);
  });
  elements.priorityPills.forEach(pill => {
    pill.classList.toggle('active', pill.dataset.priorityFilter === state.filters.priority);
  });

  renderCategoriesNav();
  renderTasks();
}

function resetAllFilters() {
  state.filters.status = 'all';
  state.filters.category = 'all';
  state.filters.priority = 'all';
  state.filters.searchQuery = '';
  
  elements.searchInput.value = '';
  elements.searchClearBtn.hidden = true;

  elements.statusNavButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.statusFilter === 'all');
  });
  elements.priorityPills.forEach(pill => {
    pill.classList.toggle('active', pill.dataset.priorityFilter === 'all');
  });

  renderCategoriesNav();
  renderTasks();
  showToast('Filters reset', 'info');
}

// ==========================================================================
// 8. Modals Logic (Create, Edit, Delete)
// ==========================================================================

function openAddTaskModal() {
  elements.taskIdInput.value = '';
  elements.taskForm.reset();
  elements.modalTitle.textContent = 'Create New Task';
  elements.saveBtnText.textContent = 'Save Task';
  elements.taskDueDateInput.value = getFormattedDateOffset(0);
  
  clearFormErrors();
  elements.taskModalBackdrop.classList.add('active');
  setTimeout(() => elements.taskTitleInput.focus(), 100);
}

function openEditTaskModal(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;

  elements.taskIdInput.value = task.id;
  elements.taskTitleInput.value = task.title;
  elements.taskDescInput.value = task.description || '';
  elements.taskCategoryInput.value = task.category;
  elements.taskPriorityInput.value = task.priority;
  elements.taskDueDateInput.value = task.dueDate;

  elements.modalTitle.textContent = 'Edit Task';
  elements.saveBtnText.textContent = 'Update Task';
  
  clearFormErrors();
  elements.taskModalBackdrop.classList.add('active');
  setTimeout(() => elements.taskTitleInput.focus(), 100);
}

function closeTaskModal() {
  elements.taskModalBackdrop.classList.remove('active');
}

function openDeleteModal(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;

  state.deletingTaskId = taskId;
  elements.deletePreviewTitle.textContent = task.title;
  elements.deletePreviewCategory.textContent = `Category: ${task.category} | Priority: ${task.priority}`;
  elements.deleteModalBackdrop.classList.add('active');
}

function closeDeleteModal() {
  state.deletingTaskId = null;
  elements.deleteModalBackdrop.classList.remove('active');
}

function clearFormErrors() {
  document.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
}

elements.taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  clearFormErrors();

  const taskId = elements.taskIdInput.value;
  const title = elements.taskTitleInput.value.trim();
  const description = elements.taskDescInput.value.trim();
  const category = elements.taskCategoryInput.value.trim();
  const priority = elements.taskPriorityInput.value;
  const dueDate = elements.taskDueDateInput.value;

  let isValid = true;

  if (!title || title.length < 3) {
    elements.taskTitleInput.closest('.form-group').classList.add('has-error');
    isValid = false;
  }
  if (!category) {
    elements.taskCategoryInput.closest('.form-group').classList.add('has-error');
    isValid = false;
  }
  if (!dueDate) {
    elements.taskDueDateInput.closest('.form-group').classList.add('has-error');
    isValid = false;
  }

  if (!isValid) return;

  const taskData = { title, description, category, priority, dueDate };

  if (taskId) {
    updateTask(taskId, taskData);
  } else {
    addTask(taskData);
  }

  closeTaskModal();
});

elements.confirmDeleteBtn.addEventListener('click', () => {
  if (state.deletingTaskId) {
    deleteTask(state.deletingTaskId);
    closeDeleteModal();
  }
});

elements.clearCompletedBtn.addEventListener('click', () => {
  const completedCount = state.tasks.filter(t => t.completed).length;
  if (completedCount === 0) {
    showToast('No completed tasks to clear', 'info');
    return;
  }

  state.tasks = state.tasks.filter(t => !t.completed);
  saveTasks();
  updateStatistics();
  renderTasks();
  renderCategoriesNav();
  pushNotification('Cleared Completed Tasks', `Removed ${completedCount} finished item(s).`, 'info');
});

// ==========================================================================
// 9. Toast Notification Engine
// ==========================================================================

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: 'fa-circle-check',
    error: 'fa-triangle-exclamation',
    warning: 'fa-circle-exclamation',
    info: 'fa-circle-info',
  };

  toast.innerHTML = `
    <i class="fa-solid ${iconMap[type] || iconMap.info} toast-icon"></i>
    <span class="toast-message">${escapeHTML(message)}</span>
    <span class="toast-close-btn" onclick="this.parentElement.remove()">
      <i class="fa-solid fa-xmark"></i>
    </span>
  `;

  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================================================
// 10. Theme Switching
// ==========================================================================

function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) || 'dark';
  setTheme(savedTheme);
}

function setTheme(theme) {
  elements.html.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY_THEME, theme);
}

function toggleTheme() {
  const currentTheme = elements.html.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  showToast(`Switched to ${newTheme} theme`, 'info');
}

// ==========================================================================
// 11. Utility Functions & Event Listeners
// ==========================================================================

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, match => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return map[match];
  });
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return 'No Date';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function setupEventListeners() {
  // Theme Toggle
  elements.themeToggleBtn.addEventListener('click', toggleTheme);

  // Authentication Events
  elements.loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = elements.loginEmail.value.trim();
    const password = elements.loginPassword.value;
    if (!email || !password) {
      showToast('Please fill in both email and password', 'warning');
      return;
    }
    loginUser(email, password);
  });

  elements.registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    if (!name || !email || !password) {
      showToast('Please fill in all registration fields', 'warning');
      return;
    }
    registerUser(name, email, password);
  });

  elements.forgotForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('forgotEmail').value.trim();
    if (!email) {
      showToast('Please enter your email', 'warning');
      return;
    }
    showToast(`Password reset instructions sent to ${email}`, 'success');
    switchAuthView('login');
  });

  // Demo Login Shortcut
  elements.demoLoginBtn.addEventListener('click', () => {
    loginUser(DEMO_USER.email, DEMO_USER.password);
  });

  // Auth View Switchers
  elements.switchToRegisterBtn.addEventListener('click', () => switchAuthView('register'));
  elements.switchToLoginBtn.addEventListener('click', () => switchAuthView('login'));
  elements.showForgotPasswordBtn.addEventListener('click', () => switchAuthView('forgot'));
  elements.backToLoginFromForgotBtn.addEventListener('click', () => switchAuthView('login'));
  
  elements.closeAuthOverlayBtn.addEventListener('click', () => {
    elements.authOverlay.classList.remove('active');
    showToast('Continuing as Guest', 'info');
  });
  elements.navLoginBtn.addEventListener('click', () => switchAuthView('login'));

  // User Profile Header Dropdown
  elements.userProfileTrigger.addEventListener('click', () => {
    elements.userProfileMenu.classList.toggle('active');
    elements.notificationCenterMenu.classList.remove('active');
  });

  // Notification Center Dropdown & Actions
  elements.notificationBellBtn.addEventListener('click', () => {
    elements.notificationCenterMenu.classList.toggle('active');
    elements.userProfileMenu.classList.remove('active');
    // Clear unread flag on open
    state.notifications.forEach(n => n.unread = false);
    saveNotifications();
    renderNotificationsUI();
  });

  elements.enableDesktopNotifBtn.addEventListener('click', requestDesktopNotificationPermission);
  elements.markAllReadBtn.addEventListener('click', markAllNotificationsAsRead);
  elements.clearNotifHistoryBtn.addEventListener('click', clearAllNotifications);

  document.addEventListener('click', (e) => {
    if (!elements.userProfileMenu.contains(e.target)) {
      elements.userProfileMenu.classList.remove('active');
    }
    if (!elements.notificationCenterMenu.contains(e.target)) {
      elements.notificationCenterMenu.classList.remove('active');
    }
  });

  elements.openAuthModalHeaderBtn.addEventListener('click', () => {
    elements.userProfileMenu.classList.remove('active');
    elements.authOverlay.classList.add('active');
    switchAuthView('login');
  });

  elements.logoutBtn.addEventListener('click', logoutUser);

  // Open Add Task Modal Trigger
  elements.openAddTaskBtn.addEventListener('click', openAddTaskModal);
  elements.emptyActionBtn.addEventListener('click', openAddTaskModal);
  
  // Close Modals
  elements.closeModalBtn.addEventListener('click', closeTaskModal);
  elements.cancelModalBtn.addEventListener('click', closeTaskModal);
  elements.closeDeleteModalBtn.addEventListener('click', closeDeleteModal);
  elements.cancelDeleteBtn.addEventListener('click', closeDeleteModal);

  elements.taskModalBackdrop.addEventListener('click', (e) => {
    if (e.target === elements.taskModalBackdrop) closeTaskModal();
  });
  elements.deleteModalBackdrop.addEventListener('click', (e) => {
    if (e.target === elements.deleteModalBackdrop) closeDeleteModal();
  });

  // Mobile Sidebar
  elements.mobileSidebarToggle.addEventListener('click', () => {
    elements.appSidebar.classList.toggle('active');
    elements.sidebarOverlay.classList.toggle('active');
  });
  elements.sidebarOverlay.addEventListener('click', () => {
    elements.appSidebar.classList.remove('active');
    elements.sidebarOverlay.classList.remove('active');
  });

  // Search Live Input
  elements.searchInput.addEventListener('input', (e) => {
    state.filters.searchQuery = e.target.value;
    elements.searchClearBtn.hidden = e.target.value.length === 0;
    renderTasks();
  });

  elements.searchClearBtn.addEventListener('click', () => {
    elements.searchInput.value = '';
    state.filters.searchQuery = '';
    elements.searchClearBtn.hidden = true;
    renderTasks();
  });

  // Status Navigation Filter Buttons
  elements.statusNavButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.statusNavButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.filters.status = btn.dataset.statusFilter;
      
      const titles = {
        all: 'All Tasks',
        active: 'Active Tasks',
        completed: 'Completed Tasks',
        overdue: 'Overdue Tasks'
      };
      elements.viewTitle.textContent = titles[state.filters.status] || 'Tasks';
      
      renderTasks();
      elements.appSidebar.classList.remove('active');
      elements.sidebarOverlay.classList.remove('active');
    });
  });

  // Priority Filter Pills
  elements.priorityPills.forEach(pill => {
    pill.addEventListener('click', () => {
      elements.priorityPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.filters.priority = pill.dataset.priorityFilter;
      renderTasks();
    });
  });

  // Sort Selector
  elements.sortSelect.addEventListener('change', (e) => {
    state.sortCriteria = e.target.value;
    renderTasks();
  });

  // View Mode Grid/List Toggle Buttons
  elements.viewGridBtn.addEventListener('click', () => {
    state.viewMode = 'grid';
    elements.viewGridBtn.classList.add('active');
    elements.viewListBtn.classList.remove('active');
    renderTasks();
  });

  elements.viewListBtn.addEventListener('click', () => {
    state.viewMode = 'list';
    elements.viewListBtn.classList.add('active');
    elements.viewGridBtn.classList.remove('active');
    renderTasks();
  });

  // Reset Filters Button
  elements.resetFiltersBtn.addEventListener('click', resetAllFilters);

  // Global Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.altKey) && (e.key === 'n' || e.key === 'N')) {
      e.preventDefault();
      openAddTaskModal();
    }
    if (e.key === 'Escape') {
      closeTaskModal();
      closeDeleteModal();
      elements.appSidebar.classList.remove('active');
      elements.sidebarOverlay.classList.remove('active');
      elements.userProfileMenu.classList.remove('active');
      elements.notificationCenterMenu.classList.remove('active');
    }
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      elements.searchInput.focus();
    }
  });
}

// ==========================================================================
// 12. Application Initializer
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initAuth();
  loadTasks();
  initNotifications();
  setupEventListeners();
  updateStatistics();
  renderCategoriesNav();
  renderTasks();
  
  console.log('✨ StarTodo App, Auth & Notification System Initialized Successfully!');
});
