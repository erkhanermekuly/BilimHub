const User = require('../models/User');
const bcrypt = require('bcrypt');

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

        await User.update(
            { name, email },
            { where: { id: userId } }
        );

        const updatedUser = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });

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

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Неверный текущий пароль' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Новый пароль должен содержать минимум 6 символов' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

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

exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        await User.destroy({ where: { id: userId } });
        res.clearCookie('token');
        req.session.destroy();
        res.json({ message: 'Аккаунт успешно удален' });
    } catch (error) {
        console.error('Ошибка удаления аккаунта:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Получить всех пользователей (только для админа)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });

        res.json(users);
    } catch (error) {
        console.error('❌ Error getting users:', error);
        res.status(500).json({ error: 'Ошибка при получении пользователей' });
    }
};

// Удалить пользователя (только для админа)
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Запретить удалять самого себя
        if (req.session.user?.id === parseInt(id)) {
            return res.status(400).json({ error: 'Нельзя удалить самого себя' });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        await User.destroy({ where: { id } });

        console.log(`✅ User deleted: ${user.name}`);
        res.json({ message: 'Пользователь успешно удален' });
    } catch (error) {
        console.error('❌ Error deleting user:', error);
        res.status(500).json({ error: 'Ошибка при удалении пользователя' });
    }
};
