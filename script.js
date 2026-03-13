document.addEventListener('DOMContentLoaded', () => {
    // Mobile Diagnostic Check
    if (typeof firebase === 'undefined') {
        alert("تنبيه: ملفات Firebase لم تحمل على الموبايل. تأكد من جودة الإنترنت أو إيقاف وضع التوفير/Lockdown.");
    }

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
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const pass = document.getElementById('login-password').value;

            try {
                const userDoc = await db.collection('users').doc(username).get();

                if (userDoc.exists && userDoc.data().password === pass) {
                    const user = userDoc.data();
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    alert('تم تسجيل الدخول بنجاح!');
                    window.location.href = 'index.html';
                } else {
                    alert('اسم المستخدم أو كلمة المرور غير صحيحة.');
                }
            } catch (error) {
                console.error("Login error:", error);
                alert("حدث خطأ أثناء تسجيل الدخول: " + error.message);
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('signup-username').value;
            const pass = document.getElementById('signup-password').value;
            const adminKey = document.getElementById('admin-key').value;

            try {
                if (typeof db === 'undefined') {
                    return;
                }

                const userDoc = await db.collection('users').doc(username).get();
                if (userDoc.exists) {
                    alert('اسم المستخدم موجود بالفعل.');
                    return;
                }

                const role = (adminKey === 'ADMIN2025') ? 'admin' : 'student';
                const newUser = { username, password: pass, role };

                await db.collection('users').doc(username).set(newUser);
                localStorage.setItem('currentUser', JSON.stringify(newUser));

                alert(`تم إنشاء الحساب بنجاح! أنت الآن ${role === 'admin' ? 'مسؤول' : 'طالب'}.`);
                window.location.href = 'index.html';
            } catch (error) {
                console.error("Signup error:", error);
                alert("حدث خطأ (ربما في قواعد البيانات): " + error.message);
            }
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
            saveBtn.addEventListener('click', async () => {
                if (!currentUser) {
                    alert('خطأ: يجب تسجيل الدخول لرفع ونشر الوسيلة.');
                    window.location.href = 'login.html';
                    return;
                }

                if (typeof db === 'undefined' || !db) {
                    alert("خطأ: قاعدة البيانات غير متصلة. تأكد من جودة الإنترنت.");
                    return;
                }

                if (firebaseConfig.apiKey === "YOUR_API_KEY") {
                    alert("تنبيه: لم يتم ربط الموقع بـ Firebase الخاص بك بعد.");
                    return;
                }

                const name = document.getElementById('tool-name').value || (currentFileData ? currentFileData.name : "وسيلة");
                const desc = document.getElementById('tool-desc').value || 'لا يوجد وصف';
                const uploadDate = new Date().toLocaleDateString('ar-EG');

                try {
                    // Check if preview data is too large for Firestore (1MB limit)
                    if (currentFileData && currentFileData.preview && currentFileData.preview.length > 1000000) {
                        alert("خطأ: الصورة حجمها كبير جداً على قاعدة البيانات (أكثر من 1 ميجا). حاول تصغير الصورة أو اختيار صورة أخرى.");
                        return;
                    }

                    const docRef = await db.collection('uploads').add({
                        name: name,
                        description: desc,
                        date: uploadDate,
                        preview: currentFileData ? currentFileData.preview : null,
                        fileName: currentFileData ? currentFileData.name : 'file',
                        timestamp: Date.now(),
                        owner: currentUser.username
                    });

                    modal.style.display = 'none';
                    alert(`تم الحفظ بنجاح!`);
                    window.location.href = 'upload.html';
                } catch (error) {
                    console.error("Save error detailed:", error);
                    alert("فشل الرفع: " + error.message);
                }
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
