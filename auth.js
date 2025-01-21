// Make showToast globally available
window.showToast = function(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    // Handle password visibility toggle
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', () => {
            const input = button.parentElement.querySelector('input');
            const icon = button.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Handle signup form submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const fullName = document.getElementById('fullName').value;

            if (password !== confirmPassword) {
                showToast('Passwords do not match', 'error');
                return;
            }

            try {
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                await userCredential.user.updateProfile({
                    displayName: fullName
                });
                
                showToast('Account created successfully!');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } catch (error) {
                showToast(error.message, 'error');
            }
        });
    }

    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;

            try {
                await auth.setPersistence(
                    rememberMe 
                        ? firebase.auth.Auth.Persistence.LOCAL 
                        : firebase.auth.Auth.Persistence.SESSION
                );
                
                await auth.signInWithEmailAndPassword(email, password);
                showToast('Login successful!');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } catch (error) {
                showToast(error.message, 'error');
            }
        });
    }

    // Check auth state
    auth.onAuthStateChanged(user => {
        const authButtons = document.querySelector('.auth-buttons');
        if (authButtons) {
            if (user) {
                authButtons.innerHTML = `
                    <button class="btn-user">
                        <i class="fas fa-user"></i>
                        ${user.displayName || 'User'}
                    </button>
                    <button class="btn-logout" onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i>
                        Logout
                    </button>
                `;
            } else {
                authButtons.innerHTML = `
                    <button class="btn-login" onclick="location.href='login.html'">
                        <i class="fas fa-sign-in-alt"></i> Login
                    </button>
                    <button class="btn-signup" onclick="location.href='signup.html'">
                        <i class="fas fa-user-plus"></i> Sign Up
                    </button>
                `;
            }
        }
    });

    // Handle password recovery form
    const recoveryForm = document.getElementById('recoveryForm');
    if (recoveryForm) {
        recoveryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('recoveryEmail').value;
            const messageDiv = document.getElementById('recoveryMessage');
            
            try {
                await auth.sendPasswordResetEmail(email);
                messageDiv.textContent = 'Password reset link sent! Check your email.';
                messageDiv.className = 'recovery-message success';
                
                // Close the modal after 3 seconds
                setTimeout(() => {
                    closeRecoveryModal();
                }, 3000);
            } catch (error) {
                messageDiv.textContent = error.message;
                messageDiv.className = 'recovery-message error';
            }
        });
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('recoveryModal');
        if (event.target === modal) {
            closeRecoveryModal();
        }
    }
});

// Make logout globally available
window.logout = function() {
    auth.signOut()
        .then(() => {
            showToast('Logged out successfully');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        })
        .catch(error => {
            showToast(error.message, 'error');
        });
}

// Add these functions after the existing code
function openRecoveryModal() {
    const modal = document.getElementById('recoveryModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeRecoveryModal() {
    const modal = document.getElementById('recoveryModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    // Clear the form and message
    document.getElementById('recoveryForm').reset();
    document.getElementById('recoveryMessage').className = 'recovery-message';
    document.getElementById('recoveryMessage').textContent = '';
} 