// ========== PROJECTS SECTION ==========

// Projects Configuration
const projectsConfig = {
    projectsList: [],
    currentFilter: 'all',
    searchTerm: '',
    isAdmin: false,
    ADMIN_PASSWORD: "IMUKMFL"
};

// Password protection for admin features
function checkAdminAccess() {
    const password = prompt("Enter Admin Password:");
    if (password === projectsConfig.ADMIN_PASSWORD) {
        projectsConfig.isAdmin = true;
        alert("✅ Admin access granted!");
        return true;
    } else {
        alert("❌ Incorrect password!");
        return false;
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
    
    // Update admin button visibility
    updateAdminUI();
}

// Update admin UI based on login status
function updateAdminUI() {
    const addBtn = document.querySelector('button[onclick="showAddProjectModal()"]');
    if (addBtn) {
        if (projectsConfig.isAdmin) {
            addBtn.innerHTML = '<i class="fas fa-plus"></i> Add New Project (Admin)';
            addBtn.style.background = 'linear-gradient(45deg, #00e676, #00c853)';
        } else {
            addBtn.innerHTML = '<i class="fas fa-plus"></i> Add New Project (Locked)';
            addBtn.style.background = 'linear-gradient(45deg, #ff9800, #ff5722)';
        }
    }
}

// Load sample projects
function loadSampleProjects() {
    const sampleProjects = [
        {
            id: Date.now() + 1,
            title: "Tic Tac Toe",
            description: "Advanced Tic Tac Toe game with AI opponent",
            icon: "fas fa-gamepad",
            file: "#tictactoe",
            tags: ["Game", "AI", "Interactive"],
            category: "game",
            date: new Date().toISOString().split('T')[0],
            addedBy: "System"
        },
        {
            id: Date.now() + 2,
            title: "Scientific Calculator",
            description: "Advanced calculator with scientific functions",
            icon: "fas fa-calculator",
            file: "#calculator",
            tags: ["Utility", "Math", "Scientific"],
            category: "utility",
            date: new Date().toISOString().split('T')[0],
            addedBy: "System"
        },
        {
            id: Date.now() + 3,
            title: "QR Code Generator",
            description: "Generate custom QR codes with styling options",
            icon: "fas fa-qrcode",
            file: "#qr-generator",
            tags: ["Generator", "Utility", "QR"],
            category: "tool",
            date: new Date().toISOString().split('T')[0],
            addedBy: "System"
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
                <p>Click "Add New Project" button to add your first project!</p>
                <div style="margin-top: 20px;">
                    <button onclick="requestAdminAccess()" style="padding: 10px 20px; background: var(--accent); color: var(--bg-dark); border: none; border-radius: 5px; cursor: pointer; margin: 5px;">
                        <i class="fas fa-lock-open"></i> Unlock Admin Mode
                    </button>
                    <button onclick="clearAndResetProjects()" style="padding: 10px 20px; background: #ff9800; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">
                        <i class="fas fa-sync-alt"></i> Reset Projects
                    </button>
                </div>
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
        
        // Admin actions
        const adminActions = projectsConfig.isAdmin ? `
            <button class="project-btn secondary" onclick="editProject(${project.id})">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="project-btn danger" onclick="deleteProject(${project.id})" style="background: rgba(244, 67, 54, 0.1); color: #ef5350;">
                <i class="fas fa-trash"></i> Delete
            </button>
        ` : '';
        
        projectCard.innerHTML = `
            <div class="project-icon">
                <i class="${project.icon || 'fas fa-folder'}"></i>
            </div>
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-tags">
                ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
            </div>
            ${project.addedBy ? `<small style="color: var(--text-secondary); margin-top: 5px;">Added by: ${project.addedBy}</small>` : ''}
            <div class="project-actions">
                <button class="project-btn" onclick="${openMethod}('${project.file}', '${project.title}')">
                    <i class="fas fa-play"></i> Run
                </button>
                ${adminActions}
            </div>
        `;
        
        grid.appendChild(projectCard);
    });
}

// Request admin access
function requestAdminAccess() {
    if (checkAdminAccess()) {
        updateAdminUI();
        displayProjects(projectsConfig.projectsList);
    }
}

// Open internal project (within same site)
function openInternalProject(filePath, projectTitle) {
    // Check if it's a hash navigation
    if (filePath.startsWith('#')) {
        // It's a section within this page
        showPage(filePath.substring(1));
        return;
    }
    
    // For local files, open in viewer
    const viewer = document.getElementById('projectViewer');
    const frame = document.getElementById('projectFrame');
    const title = document.getElementById('projectTitle');
    
    // Set title
    title.textContent = projectTitle;
    
    // Load project in iframe
    frame.src = filePath;
    
    // Show viewer
    viewer.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Open external project
function openExternalProject(url, projectTitle) {
    if (confirm(`Open "${projectTitle}" in new tab?`)) {
        window.open(url, '_blank');
    }
}

// Close project viewer
function closeProjectViewer() {
    const viewer = document.getElementById('projectViewer');
    const frame = document.getElementById('projectFrame');
    
    viewer.classList.remove('active');
    frame.src = '';
    document.body.style.overflow = 'auto';
}

// Show add project modal (with password check)
function showAddProjectModal() {
    if (!projectsConfig.isAdmin) {
        if (checkAdminAccess()) {
            updateAdminUI();
            // Now show the modal
            const modal = document.getElementById('addProjectModal');
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
        return;
    }
    
    // If already admin, show modal directly
    const modal = document.getElementById('addProjectModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close add project modal
function closeAddProjectModal() {
    const modal = document.getElementById('addProjectModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        clearAddProjectForm();
    }
}

// Clear add project form
function clearAddProjectForm() {
    document.getElementById('projectName').value = '';
    document.getElementById('projectDesc').value = '';
    document.getElementById('projectFile').value = '';
    document.getElementById('projectIcon').value = 'fas fa-folder';
    document.getElementById('projectTags').value = '';
    document.getElementById('projectCategory').value = '';
}

// Add new project
function addProject() {
    if (!projectsConfig.isAdmin) {
        alert("❌ Admin access required!");
        return;
    }
    
    // Get form values
    const name = document.getElementById('projectName').value.trim();
    const desc = document.getElementById('projectDesc').value.trim();
    const file = document.getElementById('projectFile').value.trim();
    const icon = document.getElementById('projectIcon').value.trim() || 'fas fa-folder';
    const tags = document.getElementById('projectTags').value.split(',').map(tag => tag.trim());
    const category = document.getElementById('projectCategory').value;
    
    // Validation
    if (!name || !desc || !file || tags.length === 0 || !category) {
        alert('Please fill all required fields!');
        return;
    }
    
    // Create new project
    const newProject = {
        id: Date.now(), // Unique ID based on timestamp
        title: name,
        description: desc,
        icon: icon,
        file: file,
        tags: tags,
        category: category,
        date: new Date().toISOString().split('T')[0],
        addedBy: "Admin"
    };
    
    // Add to projects list
    projectsConfig.projectsList.push(newProject);
    
    // Save to localStorage
    saveProjectsToLocalStorage();
    
    // Update display
    filterProjects(projectsConfig.currentFilter);
    
    // Close modal
    closeAddProjectModal();
    
    // Show success message
    alert('✅ Project added successfully!');
}

// Edit project
function editProject(projectId) {
    if (!projectsConfig.isAdmin) {
        alert("❌ Admin access required!");
        return;
    }
    
    const project = projectsConfig.projectsList.find(p => p.id === projectId);
    if (!project) return;
    
    // Close any open modal
    closeModal();
    
    // Populate form with project data
    document.getElementById('projectName').value = project.title;
    document.getElementById('projectDesc').value = project.description;
    document.getElementById('projectFile').value = project.file;
    document.getElementById('projectIcon').value = project.icon;
    document.getElementById('projectTags').value = project.tags.join(', ');
    document.getElementById('projectCategory').value = project.category;
    
    // Change button text and action
    const modal = document.getElementById('addProjectModal');
    const title = modal.querySelector('h3');
    const button = modal.querySelector('.btn-primary');
    
    title.innerHTML = '<i class="fas fa-edit"></i> Edit Project (Admin)';
    button.innerHTML = '<i class="fas fa-save"></i> Update Project';
    button.onclick = function() { updateProject(projectId); };
    
    // Show modal
    modal.classList.add('active');
}

// Update project
function updateProject(projectId) {
    if (!projectsConfig.isAdmin) {
        alert("❌ Admin access required!");
        return;
    }
    
    const projectIndex = projectsConfig.projectsList.findIndex(p => p.id === projectId);
    if (projectIndex === -1) return;
    
    // Get form values
    const name = document.getElementById('projectName').value.trim();
    const desc = document.getElementById('projectDesc').value.trim();
    const file = document.getElementById('projectFile').value.trim();
    const icon = document.getElementById('projectIcon').value.trim() || 'fas fa-folder';
    const tags = document.getElementById('projectTags').value.split(',').map(tag => tag.trim());
    const category = document.getElementById('projectCategory').value;
    
    // Validation
    if (!name || !desc || !file || tags.length === 0 || !category) {
        alert('Please fill all required fields!');
        return;
    }
    
    // Update project
    projectsConfig.projectsList[projectIndex] = {
        ...projectsConfig.projectsList[projectIndex],
        title: name,
        description: desc,
        icon: icon,
        file: file,
        tags: tags,
        category: category,
        addedBy: "Admin (Edited)"
    };
    
    // Save to localStorage
    saveProjectsToLocalStorage();
    
    // Update display
    filterProjects(projectsConfig.currentFilter);
    
    // Close modal
    closeAddProjectModal();
    
    // Reset form and button
    resetAddProjectForm();
    
    // Show success message
    alert('✅ Project updated successfully!');
}

// Reset add project form
function resetAddProjectForm() {
    const modal = document.getElementById('addProjectModal');
    const title = modal.querySelector('h3');
    const button = modal.querySelector('.btn-primary');
    
    title.innerHTML = '<i class="fas fa-plus-circle"></i> Add New Project';
    button.innerHTML = '<i class="fas fa-save"></i> Save Project';
    button.onclick = addProject;
    
    clearAddProjectForm();
}

// Delete project
function deleteProject(projectId) {
    if (!projectsConfig.isAdmin) {
        alert("❌ Admin access required!");
        return;
    }
    
    if (!confirm('Are you sure you want to delete this project?')) {
        return;
    }
    
    projectsConfig.projectsList = projectsConfig.projectsList.filter(p => p.id !== projectId);
    
    // Save to localStorage
    saveProjectsToLocalStorage();
    
    // Update display
    filterProjects(projectsConfig.currentFilter);
    
    // Close modal if open
    closeModal();
    
    alert('✅ Project deleted successfully!');
}

// Setup projects filter
function setupProjectsFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter projects
            const filter = this.getAttribute('data-filter');
            projectsConfig.currentFilter = filter;
            filterProjects(filter);
        });
    });
}

// Filter projects by category
function filterProjects(category) {
    let filteredProjects;
    
    if (category === 'all') {
        filteredProjects = projectsConfig.projectsList;
    } else {
        filteredProjects = projectsConfig.projectsList.filter(
            project => project.category === category
        );
    }
    
    // Apply search filter if exists
    if (projectsConfig.searchTerm) {
        filteredProjects = filteredProjects.filter(project =>
            project.title.toLowerCase().includes(projectsConfig.searchTerm) ||
            project.description.toLowerCase().includes(projectsConfig.searchTerm) ||
            project.tags.some(tag => tag.toLowerCase().includes(projectsConfig.searchTerm))
        );
    }
    
    displayProjects(filteredProjects);
}

// Setup projects search
function setupProjectsSearch() {
    const searchInput = document.getElementById('projectsSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        projectsConfig.searchTerm = this.value.toLowerCase().trim();
        
        // Get current filter
        const activeFilter = document.querySelector('.filter-btn.active');
        const filter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
        
        filterProjects(filter);
    });
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Clear and reset projects
function clearAndResetProjects() {
    if (confirm('Are you sure you want to reset all projects? This will remove all custom projects and reload sample projects.')) {
        localStorage.removeItem('portfolioProjects');
        projectsConfig.projectsList = [];
        projectsConfig.isAdmin = false;
        loadSampleProjects();
        updateAdminUI();
        filterProjects('all');
        alert('✅ Projects reset successfully!');
    }
}

// Save projects to localStorage
function saveProjectsToLocalStorage() {
    try {
        localStorage.setItem('portfolioProjects', JSON.stringify(projectsConfig.projectsList));
        localStorage.setItem('portfolioProjectsAdmin', projectsConfig.isAdmin.toString());
    } catch (error) {
        console.error('Error saving projects to localStorage:', error);
    }
}

// Load projects from localStorage
function loadProjectsFromLocalStorage() {
    try {
        const savedProjects = localStorage.getItem('portfolioProjects');
        const savedAdmin = localStorage.getItem('portfolioProjectsAdmin');
        
        if (savedProjects) {
            projectsConfig.projectsList = JSON.parse(savedProjects);
        }
        
        if (savedAdmin) {
            projectsConfig.isAdmin = (savedAdmin === 'true');
        }
    } catch (error) {
        console.error('Error loading projects from localStorage:', error);
    }
}

// Setup viewer keyboard shortcuts
function setupViewerShortcuts() {
    document.addEventListener('keydown', function(e) {
        const viewer = document.getElementById('projectViewer');
        if (!viewer.classList.contains('active')) return;
        
        // Escape key to close viewer
        if (e.key === 'Escape') {
            closeProjectViewer();
        }
    });
}

// Export projects to JSON file
function exportProjects() {
    if (!projectsConfig.isAdmin) {
        alert("❌ Admin access required!");
        return;
    }
    
    const dataStr = JSON.stringify(projectsConfig.projectsList, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'projects_backup.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    alert('✅ Projects exported successfully!');
}

// Import projects from JSON file
function importProjects(event) {
    if (!projectsConfig.isAdmin) {
        alert("❌ Admin access required!");
        return;
    }
    
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedProjects = JSON.parse(e.target.result);
            if (Array.isArray(importedProjects)) {
                projectsConfig.projectsList = importedProjects;
                saveProjectsToLocalStorage();
                filterProjects(projectsConfig.currentFilter);
                alert('✅ Projects imported successfully!');
            } else {
                alert('❌ Invalid projects file format!');
            }
        } catch (error) {
            alert('❌ Error reading projects file!');
            console.error(error);
        }
    };
    reader.readAsText(file);
}

// Admin logout
function adminLogout() {
    projectsConfig.isAdmin = false;
    saveProjectsToLocalStorage();
    updateAdminUI();
    displayProjects(projectsConfig.projectsList);
    alert('🔒 Admin logged out!');
}

// Add admin panel button
function addAdminPanel() {
    const projectsContainer = document.querySelector('.projects-container');
    if (!projectsContainer) return;
    
    const adminPanel = document.createElement('div');
    adminPanel.style.cssText = `
        text-align: center;
        margin: 20px 0;
        padding: 15px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        border: 1px solid rgba(0, 230, 118, 0.3);
    `;
    
    adminPanel.innerHTML = `
        <h4 style="color: var(--accent); margin-bottom: 10px;">
            <i class="fas fa-user-shield"></i> Admin Panel
        </h4>
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <button onclick="requestAdminAccess()" style="padding: 8px 15px; background: var(--accent); color: var(--bg-dark); border: none; border-radius: 5px; cursor: pointer;">
                <i class="fas fa-lock-open"></i> ${projectsConfig.isAdmin ? 'Re-enter Password' : 'Unlock Admin'}
            </button>
            ${projectsConfig.isAdmin ? `
                <button onclick="exportProjects()" style="padding: 8px 15px; background: #2196F3; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-download"></i> Export
                </button>
                <label style="padding: 8px 15px; background: #FF9800; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-upload"></i> Import
                    <input type="file" accept=".json" onchange="importProjects(event)" style="display: none;">
                </label>
                <button onclick="adminLogout()" style="padding: 8px 15px; background: #F44336; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-lock"></i> Logout
                </button>
            ` : ''}
            <button onclick="clearAndResetProjects()" style="padding: 8px 15px; background: #9C27B0; color: white; border: none; border-radius: 5px; cursor: pointer;">
                <i class="fas fa-sync-alt"></i> Reset
            </button>
        </div>
        ${projectsConfig.isAdmin ? `
            <div style="margin-top: 10px; color: #00e676; font-size: 0.9em;">
                <i class="fas fa-check-circle"></i> Admin Mode Active
            </div>
        ` : ''}
    `;
    
    projectsContainer.insertBefore(adminPanel, projectsContainer.firstChild);
}

// Initialize when projects page is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on projects page
    const hash = window.location.hash.substring(1);
    if (hash === 'projects') {
        setTimeout(function() {
            initProjectsSection();
            addAdminPanel();
        }, 500);
    }
});

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
window.requestAdminAccess = requestAdminAccess;
window.adminLogout = adminLogout;
