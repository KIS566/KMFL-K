// ========== PROJECTS SECTION ==========

// Projects Configuration
const projectsConfig = {
    projectsList: [],
    currentFilter: 'all',
    searchTerm: ''
};

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
        },
        {
            id: 4,
            title: "Weather App",
            description: "Real-time weather application",
            icon: "fas fa-cloud-sun",
            file: "https://weatherapp.example.com",
            tags: ["API", "Weather", "Web App"],
            category: "web-app",
            date: "2023-12-20"
        },
        {
            id: 5,
            title: "Drawing Canvas",
            description: "Creative drawing application",
            icon: "fas fa-paint-brush",
            file: "https://drawingapp.example.com",
            tags: ["Creative", "Canvas", "Art"],
            category: "creative",
            date: "2023-12-15"
        },
        {
            id: 6,
            title: "Music Player",
            description: "Modern music player UI",
            icon: "fas fa-music",
            file: "https://musicplayer.example.com",
            tags: ["Media", "Music", "Player"],
            category: "media",
            date: "2023-12-10"
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

// Open internal project (within same site)
function openInternalProject(filePath, projectTitle) {
    const viewer = document.getElementById('projectViewer');
    const frame = document.getElementById('projectFrame');
    const title = document.getElementById('projectTitle');
    
    // Set title
    title.textContent = projectTitle;
    
    // Check if it's a hash navigation
    if (filePath.startsWith('#')) {
        // It's a section within this page
        showPage(filePath.substring(1));
        return;
    }
    
    // Load project in iframe
    frame.src = filePath;
    
    // Show viewer
    viewer.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Open external project
function openExternalProject(url, projectTitle) {
    // Open in new tab
    window.open(url, '_blank');
    
    // Or show confirmation
    // if (confirm(`Open "${projectTitle}" in new tab?`)) {
    //     window.open(url, '_blank');
    // }
}

// Close project viewer
function closeProjectViewer() {
    const viewer = document.getElementById('projectViewer');
    const frame = document.getElementById('projectFrame');
    
    viewer.classList.remove('active');
    frame.src = '';
    document.body.style.overflow = 'auto';
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

// Show project details
function showProjectDetails(projectId) {
    const project = projectsConfig.projectsList.find(p => p.id === projectId);
    if (!project) return;
    
    const detailsHTML = `
        <div class="project-details-modal">
            <h3><i class="${project.icon}"></i> ${project.title}</h3>
            <p><strong>Description:</strong> ${project.description}</p>
            <p><strong>Category:</strong> ${project.category}</p>
            <p><strong>Tags:</strong> ${project.tags.join(', ')}</p>
            <p><strong>File Path:</strong> ${project.file}</p>
            ${project.date ? `<p><strong>Date Added:</strong> ${project.date}</p>` : ''}
            <div class="detail-actions">
                <button onclick="openInternalProject('${project.file}', '${project.title}')">
                    <i class="fas fa-play"></i> Run Project
                </button>
                <button onclick="editProject(${projectId})" class="secondary">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteProject(${projectId})" class="danger">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    
    // Create modal for details
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            ${detailsHTML}
            <button onclick="closeModal()" class="close-btn">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Show add project modal
function showAddProjectModal() {
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
        date: new Date().toISOString().split('T')[0]
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
    alert('Project added successfully!');
}

// Edit project
function editProject(projectId) {
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
    
    title.innerHTML = '<i class="fas fa-edit"></i> Edit Project';
    button.innerHTML = '<i class="fas fa-save"></i> Update Project';
    button.onclick = function() { updateProject(projectId); };
    
    // Show modal
    modal.classList.add('active');
}

// Update project
function updateProject(projectId) {
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
        category: category
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
    alert('Project updated successfully!');
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
    
    alert('Project deleted successfully!');
}

// Save projects to localStorage
function saveProjectsToLocalStorage() {
    try {
        localStorage.setItem('portfolioProjects', JSON.stringify(projectsConfig.projectsList));
    } catch (error) {
        console.error('Error saving projects to localStorage:', error);
    }
}

// Load projects from localStorage
function loadProjectsFromLocalStorage() {
    try {
        const savedProjects = localStorage.getItem('portfolioProjects');
        if (savedProjects) {
            projectsConfig.projectsList = JSON.parse(savedProjects);
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
        
        // Ctrl + F to fullscreen
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            const frame = document.getElementById('projectFrame');
            if (frame.requestFullscreen) {
                frame.requestFullscreen();
            }
        }
    });
}

// Export projects to JSON file
function exportProjects() {
    const dataStr = JSON.stringify(projectsConfig.projectsList, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'projects.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Import projects from JSON file
function importProjects(event) {
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
                alert('Projects imported successfully!');
            } else {
                alert('Invalid projects file format!');
            }
        } catch (error) {
            alert('Error reading projects file!');
            console.error(error);
        }
    };
    reader.readAsText(file);
}

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

// Initialize when projects page is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on projects page
    const hash = window.location.hash.substring(1);
    if (hash === 'projects') {
        setTimeout(initProjectsSection, 500);
    }
});
