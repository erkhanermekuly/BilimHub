// Главный JavaScript файл для клиентской части

// Функция для показа сообщений
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Dropdown menu для пользователя
document.addEventListener('DOMContentLoaded', () => {
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownContent = document.querySelector('.dropdown-content');
    
    if (dropdownBtn && dropdownContent) {
        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownContent.classList.toggle('show');
        });
        
        // Закрыть dropdown при клике вне его
        document.addEventListener('click', () => {
            dropdownContent.classList.remove('show');
        });
    }
});

// Функция для получения текущего пользователя через API
async function getCurrentUser() {
    try {
        const response = await fetch('/api/user');
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Ошибка получения пользователя:', error);
        return null;
    }
}

// Функция для выхода
async function logout() {
    try {
        window.location.href = '/logout';
    } catch (error) {
        console.error('Ошибка выхода:', error);
    }
}

// Валидация форм
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Обработка форм с показом ошибок
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const emailInput = form.querySelector('input[type="email"]');
            const passwordInput = form.querySelector('input[name="password"]');
            const confirmPasswordInput = form.querySelector('input[name="confirmPassword"]');
            
            let isValid = true;
            
            // Валидация email
            if (emailInput && !validateEmail(emailInput.value)) {
                showNotification('Введите корректный email', 'error');
                emailInput.focus();
                isValid = false;
            }
            
            // Валидация пароля
            if (passwordInput && !validatePassword(passwordInput.value)) {
                showNotification('Пароль должен содержать минимум 6 символов', 'error');
                passwordInput.focus();
                isValid = false;
            }
            
            // Проверка совпадения паролей
            if (confirmPasswordInput && passwordInput.value !== confirmPasswordInput.value) {
                showNotification('Пароли не совпадают', 'error');
                confirmPasswordInput.focus();
                isValid = false;
            }
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
});

// Анимация для карточек при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.feature-card, .profile-card');
    cards.forEach(card => {
        observer.observe(card);
    });
});

// Показать/скрыть пароль
function togglePasswordVisibility(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙈';
    } else {
        input.type = 'password';
        button.textContent = '👁️';
    }
}

// Debounce функция для оптимизации
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Плавная прокрутка для якорных ссылок
document.addEventListener('DOMContentLoaded', () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

console.log('BilimHub клиентский скрипт загружен');
