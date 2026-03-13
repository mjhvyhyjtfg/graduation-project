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
    const signupCard = document.getElementById('signup-card');
    const glassCards = document.querySelectorAll('.glass-card');

    // Auth State Management
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const authButtons = document.querySelector('.auth-buttons');

    function updateAuthUI() {
        if (currentUser && authButtons) {
            authButtons.innerHTML = `
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span style="font-weight: 700; color: var(--primary-blue);">أهلاً، ${currentUser.username} ${currentUser.role === 'admin' ? '<span style="background: #7c3aed; color: white; padding: 2px 8px; border-radius: 6px; font-size: 0.7rem;">مسؤول</span>' : ''}</span>
                    <button class="btn btn-secondary" id="logout-btn" style="padding: 5px 15px;">خروج</button>
                </div>
            `;
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    localStorage.removeItem('currentUser');
                    window.location.href = 'index.html';
                });
            }
        }
    }

    updateAuthUI();

    if (signupCard) {
        signupCard.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }

    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }

    // Handle Login and Signup Forms
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const pass = document.getElementById('login-password').value;

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.username === username && u.password === pass);

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                alert('تم تسجيل الدخول بنجاح!');
                window.location.href = 'index.html';
            } else {
                alert('اسم المستخدم أو كلمة المرور غير صحيحة.');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('signup-username').value;
            const pass = document.getElementById('signup-password').value;
            const adminKey = document.getElementById('admin-key').value;

            const users = JSON.parse(localStorage.getItem('users') || '[]');

            if (users.find(u => u.username === username)) {
                alert('اسم المستخدم موجود بالفعل.');
                return;
            }

            const role = (adminKey === 'ADMIN2025') ? 'admin' : 'student';

            const newUser = { username, password: pass, role };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(newUser));

            alert(`تم إنشاء الحساب بنجاح! أنت الآن ${role === 'admin' ? 'مسؤول' : 'طالب'}.`);
            window.location.href = 'index.html';
        });
    }

    if (uploadCard && fileInput) {
        let currentFileData = null;

        uploadCard.style.cursor = 'pointer';
        uploadCard.addEventListener('click', () => {
            if (!currentUser) {
                alert('يجب تسجيل الدخول أولاً لرفع وسيلة تعليمية.');
                window.location.href = 'login.html';
                return;
            }
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
                    timestamp: Date.now(),
                    owner: currentUser ? currentUser.username : 'guest'
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
