// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // Only smooth scroll for internal anchors (#section)
            if (targetId.startsWith('#')) {
                e.preventDefault();
                if (targetId !== '#') {
                    const element = document.querySelector(targetId);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
            // Otherwise, let the browser navigate normally (to index.html, etc.)
        });
    });

    // Button Click Handlers
    const signupBtn = document.getElementById('signup-btn');
    const loginBtn = document.getElementById('login-btn');
    const uploadCard = document.getElementById('upload-card');
    const fileInput = document.getElementById('file-input');
    const glassCards = document.querySelectorAll('.glass-card');

    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            // Placeholder: redirect to signup
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            // Placeholder: redirect to login
        });
    }

    if (uploadCard && fileInput) {
        let currentFileData = null;

        uploadCard.style.cursor = 'pointer';
        uploadCard.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                const reader = new FileReader();

                reader.onload = (event) => {
                    currentFileData = {
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        preview: file.type.startsWith('image/') ? event.target.result : null
                    };

                    // Show Modal
                    const modal = document.getElementById('upload-modal');
                    if (modal) {
                        modal.style.display = 'flex';
                        document.getElementById('tool-name').value = file.name.split('.').slice(0, -1).join('.');
                    }
                };

                if (file.type.startsWith('image/')) {
                    reader.readAsDataURL(file); // Convert to Base64
                } else {
                    currentFileData = {
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        preview: null
                    };
                    const modal = document.getElementById('upload-modal');
                    if (modal) {
                        modal.style.display = 'flex';
                        document.getElementById('tool-name').value = file.name.split('.').slice(0, -1).join('.');
                    }
                }
            }
        });

        // Modal Actions
        const saveBtn = document.getElementById('save-upload');
        const cancelBtn = document.getElementById('cancel-upload');
        const modal = document.getElementById('upload-modal');

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const name = document.getElementById('tool-name').value || currentFileData.name;
                const desc = document.getElementById('tool-desc').value || 'لا يوجد وصف';
                const uploadDate = new Date().toLocaleDateString('ar-EG');

                const uploads = JSON.parse(localStorage.getItem('user_uploads') || '[]');
                uploads.push({
                    name: name,
                    description: desc,
                    date: uploadDate,
                    preview: currentFileData.preview,
                    fileName: currentFileData.name,
                    timestamp: Date.now()
                });

                localStorage.setItem('user_uploads', JSON.stringify(uploads));
                modal.style.display = 'none';

                alert(`تم حفظ "${name}" بنجاح!`);
                window.location.href = 'upload.html';
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                fileInput.value = ''; // Reset
            });
        }
    }

    // Add click effect to other cards
    glassCards.forEach(card => {
        if (card.id === 'upload-card' || card.closest('a')) return; // Skip if it's the upload card or already wrapped in an anchor link

        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            // Optional: You can navigate to a specific page or section based on the card's intent
        });
    });
});
