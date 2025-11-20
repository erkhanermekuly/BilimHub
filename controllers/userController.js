const User = require('../models/User');
const bcrypt = require('bcrypt');

// Получить профиль пользователя
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        res.json(user);
    } catch (error) {
        console.error('Ошибка получения профиля:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Обновить профиль
exports.updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const userId = req.user.id;

        // Проверка существования email у другого пользователя
        if (email !== req.user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser && existingUser.id !== userId) {
                return res.status(400).json({ message: 'Email уже используется другим пользователем' });
            }
        }

        // Обновление пользователя
        await User.update(
            { name, email },
            { where: { id: userId } }
        );

        // Получение обновленного пользователя
        const updatedUser = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });

        // Обновление сессии
        req.session.user = {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email
        };

        res.json({
            message: 'Профиль успешно обновлен',
            user: updatedUser
        });
    } catch (error) {
        console.error('Ошибка обновления профиля:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Изменить пароль
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Получение пользователя с паролем
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Проверка текущего пароля
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Неверный текущий пароль' });
        }

        // Проверка длины нового пароля
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Новый пароль должен содержать минимум 6 символов' });
        }

        // Хеширование нового пароля
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Обновление пароля
        await User.update(
            { password: hashedPassword },
            { where: { id: userId } }
        );

        res.json({ message: 'Пароль успешно изменен' });
    } catch (error) {
        console.error('Ошибка изменения пароля:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Удалить аккаунт
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        await User.destroy({ where: { id: userId } });

        // Удаление токена и сессии
        res.clearCookie('token');
        req.session.destroy();

        res.json({ message: 'Аккаунт успешно удален' });
    } catch (error) {
        console.error('Ошибка удаления аккаунта:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};
