// Загрузка данных
let themesData = [];
let lecturesData = [];

async function loadAdminData() {
    try {
        // Загрузка тем
        const themesResponse = await fetch('/api/themes');
        themesData = await themesResponse.json();
        
        // Подсчет статистики
        let totalLectures = 0;
        let totalTests = 0;
        
        themesData.forEach(theme => {
            if (theme.lectures) {
                totalLectures += theme.lectures.length;
                theme.lectures.forEach(lecture => {
                    if (lecture.tests) {
                        totalTests += lecture.tests.length;
                    }
                });
            }
        });

        // Обновление статистики
        document.getElementById('themes-count').textContent = themesData.length;
        document.getElementById('lectures-count').textContent = totalLectures;
        document.getElementById('tests-count').textContent = totalTests;
        
        // Отображение списков
        renderThemes();
        renderLectures();
        
        document.getElementById('loading').style.display = 'none';
        document.getElementById('admin-content').style.display = 'block';
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        document.getElementById('loading').textContent = 'Ошибка загрузки данных';
    }
}

// Отображение тем
function renderThemes() {
    const container = document.getElementById('themes-list');
    container.innerHTML = '';
    
    if (themesData.length === 0) {
        container.innerHTML = '<div class="empty-state">Темы не добавлены</div>';
        return;
    }
    
    themesData.forEach(theme => {
        const lecturesCount = theme.lectures ? theme.lectures.length : 0;
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-header">
                <div class="item-title">${theme.title}</div>
                <div class="item-actions">
                    <button class="action-button action-edit" onclick="editTheme(${theme.id})">✏️ Редактировать</button>
                    <button class="action-button action-delete" onclick="deleteTheme(${theme.id})">🗑️ Удалить</button>
                </div>
            </div>
            <div class="item-meta">Лекций: ${lecturesCount} | Порядок: ${theme.order}</div>
        `;
        container.appendChild(card);
    });
    
    // Обновление селекта лекций
    updateThemeSelect();
}

// Отображение лекций
function renderLectures() {
    const container = document.getElementById('lectures-list');
    container.innerHTML = '';
    
    lecturesData = [];
    themesData.forEach(theme => {
        if (theme.lectures) {
            lecturesData.push(...theme.lectures.map(l => ({...l, themeName: theme.title})));
        }
    });
    
    if (lecturesData.length === 0) {
        container.innerHTML = '<div class="empty-state">Лекции не добавлены</div>';
        return;
    }
    
    lecturesData.forEach(lecture => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-header">
                <div class="item-title">${lecture.title}</div>
                <div class="item-actions">
                    <button class="action-button action-edit" onclick="editLecture(${lecture.id})">✏️ Редактировать</button>
                    <button class="action-button action-delete" onclick="deleteLecture(${lecture.id})">🗑️ Удалить</button>
                </div>
            </div>
            <div class="item-meta">Тема: ${lecture.themeName} | Длительность: ${lecture.duration || 15} мин</div>
        `;
        container.appendChild(card);
    });
}

// Обновление селекта тем
function updateThemeSelect() {
    const select = document.getElementById('lecture-theme');
    select.innerHTML = '<option value="">-- Выберите тему --</option>';
    
    themesData.forEach(theme => {
        const option = document.createElement('option');
        option.value = theme.id;
        option.textContent = theme.title;
        select.appendChild(option);
    });
}

// Обработка загрузки изображения для темы
document.getElementById('theme-image-file').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Предпросмотр изображения
    const imagePreview = document.getElementById('image-preview');
    const imageImg = document.getElementById('image-preview-img');
    const reader = new FileReader();

    reader.onload = (event) => {
        imageImg.src = event.target.result;
        imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);

    // Загрузка на сервер
    const formData = new FormData();
    formData.append('image', file);

    try {
        const uploadButton = e.target;
        uploadButton.disabled = true;
        uploadButton.style.opacity = '0.5';

        const response = await fetch('/api/upload/image', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('theme-image').value = data.imagePath;
            console.log('Изображение загружено:', data.imagePath);
        } else {
            const error = await response.json();
            alert('Ошибка загрузки изображения: ' + error.error);
        }
    } catch (error) {
        console.error('Ошибка загрузки изображения:', error);
        alert('Произошла ошибка при загрузке изображения');
    } finally {
        e.target.disabled = false;
        e.target.style.opacity = '1';
    }
});

// Модальные окна для темы
function openThemeModal() {
    document.getElementById('theme-modal-title').textContent = 'Добавить тему';
    document.getElementById('theme-form').reset();
    document.getElementById('theme-id').value = '';
    document.getElementById('image-preview').style.display = 'none';
    document.getElementById('theme-modal').classList.add('active');
}

function closeThemeModal() {
    document.getElementById('theme-modal').classList.remove('active');
}

async function editTheme(id) {
    const theme = themesData.find(t => t.id === id);
    if (!theme) return;
    
    document.getElementById('theme-modal-title').textContent = 'Редактировать тему';
    document.getElementById('theme-id').value = theme.id;
    document.getElementById('theme-title').value = theme.title;
    document.getElementById('theme-description').value = theme.description || '';
    document.getElementById('theme-image').value = theme.image || '';
    document.getElementById('theme-order').value = theme.order || 0;
    
    document.getElementById('theme-modal').classList.add('active');
}

async function deleteTheme(id) {
    if (!confirm('Вы уверены, что хотите удалить эту тему? Все связанные лекции также будут удалены.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/themes/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (response.ok) {
            alert('Тема успешно удалена');
            loadAdminData();
        } else {
            const error = await response.json();
            alert('Ошибка: ' + error.error);
        }
    } catch (error) {
        console.error('Ошибка удаления темы:', error);
        alert('Произошла ошибка при удалении темы');
    }
}

// Отправка формы темы
document.getElementById('theme-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('theme-id').value;
    const data = {
        title: document.getElementById('theme-title').value,
        description: document.getElementById('theme-description').value,
        image: document.getElementById('theme-image').value,
        order: parseInt(document.getElementById('theme-order').value)
    };
    
    try {
        const url = id ? `/api/themes/${id}` : '/api/themes';
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert(id ? 'Тема успешно обновлена' : 'Тема успешно создана');
            closeThemeModal();
            loadAdminData();
        } else {
            const error = await response.json();
            alert('Ошибка: ' + error.error);
        }
    } catch (error) {
        console.error('Ошибка сохранения темы:', error);
        alert('Произошла ошибка при сохранении темы');
    }
});

// Модальные окна для лекции
function openLectureModal() {
    document.getElementById('lecture-modal-title').textContent = 'Добавить лекцию';
    document.getElementById('lecture-form').reset();
    document.getElementById('lecture-id').value = '';
    document.getElementById('video-preview').style.display = 'none';
    document.getElementById('lecture-modal').classList.add('active');
}

function closeLectureModal() {
    document.getElementById('lecture-modal').classList.remove('active');
}

async function editLecture(id) {
    const lecture = lecturesData.find(l => l.id === id);
    if (!lecture) return;
    
    document.getElementById('lecture-modal-title').textContent = 'Редактировать лекцию';
    document.getElementById('lecture-id').value = lecture.id;
    document.getElementById('lecture-theme').value = lecture.themeId;
    document.getElementById('lecture-title').value = lecture.title;
    document.getElementById('lecture-content').value = lecture.content || '';
    document.getElementById('lecture-video').value = lecture.videoUrl || '';
    document.getElementById('lecture-duration').value = lecture.duration || 15;
    document.getElementById('lecture-order').value = lecture.order || 0;
    
    document.getElementById('lecture-modal').classList.add('active');
}

async function deleteLecture(id) {
    if (!confirm('Вы уверены, что хотите удалить эту лекцию?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/lectures/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (response.ok) {
            alert('Лекция успешно удалена');
            loadAdminData();
        } else {
            const error = await response.json();
            alert('Ошибка: ' + error.error);
        }
    } catch (error) {
        console.error('Ошибка удаления лекции:', error);
        alert('Произошла ошибка при удалении лекции');
    }
}

// Обработка загрузки видео
document.getElementById('lecture-video-file').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Предпросмотр видео
    const videoPreview = document.getElementById('video-preview');
    const videoPlayer = document.getElementById('video-preview-player');
    const reader = new FileReader();

    reader.onload = (event) => {
        videoPlayer.src = event.target.result;
        videoPreview.style.display = 'block';
    };
    reader.readAsDataURL(file);

    // Загрузка на сервер
    const formData = new FormData();
    formData.append('video', file);

    try {
        const uploadButton = e.target;
        uploadButton.disabled = true;
        uploadButton.style.opacity = '0.5';

        const response = await fetch('/api/upload/video', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('lecture-video').value = data.videoPath;
            console.log('Видео загружено:', data.videoPath);
        } else {
            const error = await response.json();
            alert('Ошибка загрузки видео: ' + error.error);
        }
    } catch (error) {
        console.error('Ошибка загрузки видео:', error);
        alert('Произошла ошибка при загрузке видео');
    } finally {
        e.target.disabled = false;
        e.target.style.opacity = '1';
    }
});

// Отправка формы лекции
document.getElementById('lecture-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('lecture-id').value;
    const themeId = document.getElementById('lecture-theme').value;
    
    if (!themeId) {
        alert('Выберите тему');
        return;
    }
    
    const data = {
        title: document.getElementById('lecture-title').value,
        content: document.getElementById('lecture-content').value,
        videoUrl: document.getElementById('lecture-video').value,
        duration: parseInt(document.getElementById('lecture-duration').value),
        order: parseInt(document.getElementById('lecture-order').value)
    };
    
    try {
        const url = id ? `/api/lectures/${id}` : `/api/themes/${themeId}/lectures`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert(id ? 'Лекция успешно обновлена' : 'Лекция успешно создана');
            closeLectureModal();
            loadAdminData();
        } else {
            const error = await response.json();
            alert('Ошибка: ' + error.error);
        }
    } catch (error) {
        console.error('Ошибка сохранения лекции:', error);
        alert('Произошла ошибка при сохранении лекции');
    }
});

// Закрытие модальных окон по клику вне контента
document.getElementById('theme-modal').addEventListener('click', (e) => {
    if (e.target.id === 'theme-modal') {
        closeThemeModal();
    }
});

document.getElementById('lecture-modal').addEventListener('click', (e) => {
    if (e.target.id === 'lecture-modal') {
        closeLectureModal();
    }
});

// Загрузка данных при открытии страницы
loadAdminData();
