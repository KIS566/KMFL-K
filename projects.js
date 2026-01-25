// ========== PROJECTS SECTION ==========

// Projects Configuration
const projectsConfig = {
    projectsList: [],
    currentFilter: 'all',
    searchTerm: ''
};

// Clear localStorage and reload sample projects
function clearAndResetProjects() {
    if (confirm('Are you sure you want to reset all projects? This will remove all your projects and load sample projects.')) {
        localStorage.removeItem('portfolioProjects');
        projectsConfig.projectsList = [];
        loadSampleProjects();
        filterProjects('all');
        alert('Projects reset successfully!');
    }
}

// Initialize Projects Section
function initProjectsSection() {
    console.log('Initializing Projects Section...');
    
    // Load projects from localStorage
    loadProjectsFromLocalStorage();
    
    // Setup event listeners
    setupProjectsFilter();
    setupProjectsSearch();
    
    // If no projects in localStorage, load sample projects
    if (projectsConfig.projectsList.length === 0) {
        loadSampleProjects();
    }
    
    // Display projects
    displayProjects(projectsConfig.projectsList);
    
    // Add keyboard shortcuts for viewer
    setupViewerShortcuts();
}

// Load sample projects
function loadSampleProjects() {
    const sampleProjects = [
        {
            id: 1,
            title: "Tic Tac Toe",
            description: "Advanced Tic Tac Toe game with AI opponent",
            icon: "fas fa-gamepad",
            file: "#tictactoe",
            tags: ["Game", "AI", "Interactive"],
            category: "game",
            date: "2024-01-15"
        },
        {
            id: 2,
            title: "Scientific Calculator",
            description: "Advanced calculator with scientific functions",
            icon: "fas fa-calculator",
            file: "#calculator",
            tags: ["Utility", "Math", "Scientific"],
            category: "utility",
            date: "2024-01-10"
        },
        {
            id: 3,
            title: "QR Code Generator",
            description: "Generate custom QR codes with styling options",
            icon: "fas fa-qrcode",
            file: "#qr-generator",
            tags: ["Generator", "Utility", "QR"],
            category: "tool",
            date: "2024-01-05"
        }
    ];
    
    projectsConfig.projectsList = sampleProjects;
    saveProjectsToLocalStorage();
}

// Display projects in grid
function displayProjects(projects) {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    
    // Clear loading message
    grid.innerHTML = '';
    
    // If no projects
    if (projects.length === 0) {
        grid.innerHTML = `
            <div class="no-projects">
                <i class="fas fa-folder-open"></i>
                <h3>No Projects Found</h3>
                <p>Add your first project using the "Add New Project" button!</p>
                <button onclick="clearAndResetProjects()" style="margin-top: 20px; padding: 10px 20px; background: var(--accent); color: var(--bg-dark); border: none; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-sync-alt"></i> Reset to Default
                </button>
            </div>
        `;
        return;
    }
    
    // Create project cards
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.setAttribute('data-category', project.category);
        projectCard.setAttribute('data-id', project.id);
        
        // Determine if it's an internal or external project
        const isInternal = project.file.startsWith('#') || project.file.startsWith('/');
        const openMethod = isInternal ? 'openInternalProject' : 'openExternalProject';
        
        projectCard.innerHTML = `
            <div class="project-icon">
                <i class="${project.icon || 'fas fa-folder'}"></i>
            </div>
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-tags">
                ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
            </div>
            <div class="project-actions">
                <button class="project-btn" onclick="${openMethod}('${project.file}', '${project.title}')">
                    <i class="fas fa-play"></i> Run
                </button>
                <button class="project-btn secondary" onclick="showProjectDetails(${project.id})">
                    <i class="fas fa-info-circle"></i> Details
                </button>
            </div>
        `;
        
        grid.appendChild(projectCard);
    });
}

// ... बाकी सभी functions वही रहेंगे ...

// Make functions globally available
window.initProjectsSection = initProjectsSection;
window.openInternalProject = openInternalProject;
window.openExternalProject = openExternalProject;
window.closeProjectViewer = closeProjectViewer;
window.showAddProjectModal = showAddProjectModal;
window.closeAddProjectModal = closeAddProjectModal;
window.addProject = addProject;
window.editProject = editProject;
window.deleteProject = deleteProject;
window.exportProjects = exportProjects;
window.importProjects = importProjects;
window.clearAndResetProjects = clearAndResetProjects;

// Initialize when projects page is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on projects page
    const hash = window.location.hash.substring(1);
    if (hash === 'projects') {
        setTimeout(initProjectsSection, 500);
    }
});
