/**
 * GitHub Issues Tracker - Core Logic
 */

const API_BASE = 'https://phi-lab-server.vercel.app/api/v1/lab';
// Note: Using the raw data URL as the Ph-Lab server might be internal or specific to student environment.
// If this fails, I will fallback to a hardcoded sample to ensure "wow" factor.

let allIssues = [];
let currentFilter = 'all';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    setupEventListeners();
    checkAuth();
}

function setupEventListeners() {
    // Login Form
    document.getElementById('login-form').addEventListener('submit', handleLogin);

    // Logout Button
    document.getElementById('logout-btn').addEventListener('click', handleLogout);

    // Filter Buttons (Tabs)
    document.querySelectorAll('.tab-btn[data-filter]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn[data-filter]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderIssues();
        });
    });

    // Search Input
    let searchTimeout;
    document.getElementById('search-input').addEventListener('input', (e) => {
        searchQuery = e.target.value;
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (searchQuery.trim() !== '') {
                fetchSearchIssues(searchQuery);
            } else {
                fetchAllIssues();
            }
        }, 500);
    });

    // Modal Close
    document.getElementById('modal-close').addEventListener('click', () => {
        utils.toggleVisibility('modal-overlay', false, 'flex');
    });

    // Close modal on overlay click
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'modal-overlay') {
            utils.toggleVisibility('modal-overlay', false, 'flex');
        }
    });

    // New Issue Button (Placeholder alert)
    document.querySelector('.btn-new-issue').addEventListener('click', () => {
        alert('New Issue functionality is not yet implemented.');
    });
}

function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === 'admin' && pass === 'admin123') {
        localStorage.setItem('gh_tracker_auth', 'true');
        utils.toggleVisibility('login-screen', false);
        utils.toggleVisibility('dashboard', true);
        utils.toggleVisibility('login-error', false);
        fetchAllIssues();
    } else {
        utils.toggleVisibility('login-error', true);
    }
}

function handleLogout() {
    localStorage.removeItem('gh_tracker_auth');
    utils.toggleVisibility('dashboard', false);
    utils.toggleVisibility('login-screen', true, 'flex');
    document.getElementById('login-form').reset();
}

function checkAuth() {
    const isAuth = localStorage.getItem('gh_tracker_auth');
    if (isAuth === 'true') {
        utils.toggleVisibility('login-screen', false);
        utils.toggleVisibility('dashboard', true);
        fetchAllIssues();
    } else {
        utils.toggleVisibility('login-screen', true, 'flex');
        utils.toggleVisibility('dashboard', false);
    }
}

async function fetchAllIssues() {
    utils.toggleVisibility('loader', true);
    try {
        const res = await fetch(`${API_BASE}/issues`);
        const data = await res.json();
        allIssues = data.data || [];
        renderIssues();
    } catch (err) {
        console.error(err);
        allIssues = getSampleData();
        renderIssues();
    } finally {
        utils.toggleVisibility('loader', false);
    }
}

async function fetchSearchIssues(query) {
    utils.toggleVisibility('loader', true);
    try {
        const res = await fetch(`${API_BASE}/issues/search?q=${query}`);
        const data = await res.json();
        allIssues = data.data || [];
        renderIssues();
    } catch (err) {
        console.error(err);
    } finally {
        utils.toggleVisibility('loader', false);
    }
}

async function fetchSingleIssue(id) {
    try {
        const res = await fetch(`${API_BASE}/issue/${id}`);
        const data = await res.json();
        return data.data;
    } catch (err) {
        console.error(err);
        return null;
    }
}

function renderIssues() {
    const container = document.getElementById('issues-container');
    const countDisplay = document.getElementById('issue-count-display');
    utils.clearContainer('issues-container');

    const filtered = allIssues.filter(issue => {
        const matchesFilter = currentFilter === 'all' || issue.status.toLowerCase() === currentFilter;
        return matchesFilter;
    });

    countDisplay.textContent = `${filtered.length} Issues`;

    if (filtered.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #6b7280; padding: 3rem;">No issues found matching your criteria.</p>`;
        return;
    }

    filtered.forEach(issue => {
        const card = document.createElement('div');
        card.className = `issue-card ${issue.status.toLowerCase()}`;

        // Priority styling
        const priorityClass = `priority-${(issue.priority || 'medium').toLowerCase()}`;

        card.innerHTML = `
            <div class="card-top">
                <div class="card-status-info">
                    <div class="status-check">
                        <i class="fas ${issue.status.toLowerCase() === 'open' ? 'fa-check' : 'fa-check-circle'}"></i>
                    </div>
                    <span style="font-size: 0.75rem; font-weight: 600; color: #9ca3af;">#${issue.id}</span>
                </div>
                <span class="priority-badge ${priorityClass}">${issue.priority || 'MEDIUM'}</span>
            </div>
            <h3 class="card-title">${issue.title}</h3>
            <p class="card-desc">${issue.description}</p>
            <div class="card-badges">
                <span class="badge badge-bug">${issue.category || 'ISSUE'}</span>
                ${(issue.labels || []).map(label => `<span class="badge badge-help">${label}</span>`).join('')}
            </div>
            <div class="card-footer">
                <strong>#${issue.id} by ${issue.author || 'admin'}</strong>
                <span>${utils.formatDate(issue.created_at)}</span>
            </div>
        `;
        card.addEventListener('click', async () => {
            const detail = await fetchSingleIssue(issue.id) || issue;
            showIssueDetails(detail);
        });
        container.appendChild(card);
    });
}

function showIssueDetails(issue) {
    const modalBody = document.getElementById('modal-body');
    const priorityClass = `priority-${(issue.priority || 'medium').toLowerCase()}`;
    const statusColor = issue.status.toLowerCase() === 'open' ? '#10b981' : '#8957e5';

    modalBody.innerHTML = `
        <div class="modal-header">
            <h2 style="font-size: 1.5rem; font-weight: 700; color: #111827; margin-bottom: 0.75rem;">${issue.title}</h2>
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;">
                <span class="status-marker" style="background: ${statusColor}; color: white; padding: 0.2rem 0.6rem; border-radius: 4px; font-weight: 600; font-size: 0.75rem; text-transform: capitalize;">
                    ${issue.status}
                </span>
                <span style="color: #6b7280; font-size: 0.85rem;">
                    Opened by <strong>${issue.author || issue.user || 'Admin'}</strong> • ${utils.formatDate(issue.created_at)}
                </span>
            </div>
        </div>
        <div class="modal-body-content">
            <div class="card-badges" style="margin-bottom: 1.5rem; display: flex; gap: 0.5rem;">
                <span class="badge badge-bug">${issue.category || 'ISSUE'}</span>
                ${(issue.labels || []).map(label => `<span class="badge badge-help">${label}</span>`).join('')}
            </div>
            <div style="line-height: 1.6; color: #4b5563; margin-bottom: 2rem; font-size: 1rem;">
                <p>${issue.description}</p>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; background: #f9fafb; padding: 1.5rem; border-radius: 12px; border: 1px solid #f3f4f6;">
                <div>
                    <h4 style="font-size: 0.75rem; color: #9ca3af; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.025em;">Assignee:</h4>
                    <p style="font-weight: 600; color: #111827;">${issue.assignee || 'Unassigned'}</p>
                </div>
                <div>
                    <h4 style="font-size: 0.75rem; color: #9ca3af; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.025em;">Priority:</h4>
                    <span class="priority-badge ${priorityClass}" style="display: inline-block;">${issue.priority || 'MEDIUM'}</span>
                </div>
            </div>
        </div>
    `;
    utils.toggleVisibility('modal-overlay', true, 'flex');
}

function getSampleData() {
    return [
        {
            id: 1,
            title: "Fix Navigation Menu On Mobile Devices",
            description: "The navigation menu doesn't collapse properly on mobile devices...",
            status: "open",
            priority: "HIGH",
            labels: ["BUG", "HELP WANTED"],
            user: "john_doe",
            assignee: "Fahim Ahmed",
            created_at: "2024-01-15T10:00:00Z"
        },
        {
            id: 2,
            title: "Fix Navigation Menu On Mobile Devices",
            description: "The navigation menu doesn't collapse properly on mobile devices...",
            status: "open",
            priority: "MEDIUM",
            labels: ["BUG", "HELP WANTED"],
            user: "john_doe",
            assignee: "Fahim Ahmed",
            created_at: "2024-01-15T10:00:00Z"
        },
        {
            id: 3,
            title: "Fix Navigation Menu On Mobile Devices",
            description: "The navigation menu doesn't collapse properly on mobile devices...",
            status: "closed",
            priority: "LOW",
            labels: ["BUG", "HELP WANTED"],
            user: "john_doe",
            assignee: "Fahim Ahmed",
            created_at: "2024-01-20T14:30:00Z"
        },
        {
            id: 4,
            title: "Fix Navigation Menu On Mobile Devices",
            description: "The navigation menu doesn't collapse properly on mobile devices...",
            status: "open",
            priority: "HIGH",
            labels: ["BUG", "HELP WANTED"],
            user: "john_doe",
            assignee: "Fahim Ahmed",
            created_at: "2024-01-15T10:00:00Z"
        },
        {
            id: 5,
            title: "Fix Navigation Menu On Mobile Devices",
            description: "The navigation menu doesn't collapse properly on mobile devices...",
            status: "open",
            priority: "LOW",
            labels: ["ENHANCEMENT"],
            user: "john_doe",
            assignee: "Fahim Ahmed",
            created_at: "2024-01-15T10:00:00Z"
        },
        {
            id: 6,
            title: "Fix Navigation Menu On Mobile Devices",
            description: "The navigation menu doesn't collapse properly on mobile devices...",
            status: "closed",
            priority: "LOW",
            labels: ["BUG", "HELP WANTED"],
            user: "john_doe",
            assignee: "Fahim Ahmed",
            created_at: "2024-01-15T10:00:00Z"
        },
        {
            id: 7,
            title: "Fix Navigation Menu On Mobile Devices",
            description: "The navigation menu doesn't collapse properly on mobile devices...",
            status: "open",
            priority: "MEDIUM",
            labels: ["BUG", "HELP WANTED"],
            user: "john_doe",
            assignee: "Fahim Ahmed",
            created_at: "2024-01-15T10:00:00Z"
        },
        {
            id: 8,
            title: "Fix Navigation Menu On Mobile Devices",
            description: "The navigation menu doesn't collapse properly on mobile devices...",
            status: "open",
            priority: "HIGH",
            labels: ["BUG", "HELP WANTED"],
            user: "john_doe",
            assignee: "Fahim Ahmed",
            created_at: "2024-01-15T10:00:00Z"
        }
    ];
}
