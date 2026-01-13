import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUserQuery, useLoginMutation, useRegisterMutation } from '../../store/authApi';

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [group, setGroup] = useState('');
    const [variant, setVariant] = useState('');
    const [error, setError] = useState('');

    const { data: user, isLoading: userLoading } = useGetUserQuery();
    const [loginMutation, { isLoading: loginLoading }] = useLoginMutation();
    const [registerMutation, { isLoading: registerLoading }] = useRegisterMutation();
    const navigate = useNavigate();

    const isSubmitting = loginLoading || registerLoading;

    // редирект если уже авторизован
    useEffect(() => {
        if (user && !userLoading) {
            navigate('/area-checker/', { replace: true });
        }
    }, [user, userLoading, navigate]);

    if (userLoading) {
        return (
            <div className="login-page">
                <div className="login-container">
                    <div className="login-form-container" style={{ textAlign: 'center', padding: '60px' }}>
                        Проверка авторизации...
                    </div>
                </div>
            </div>
        );
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!login || !password) {
            setError('Заполните все поля');
            return;
        }

        try {
            await loginMutation({ login, password }).unwrap();
            navigate('/area-checker/', { replace: true });
        } catch (err) {
            console.log(err)
            setError(err.data?.message || 'Ошибка авторизации');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!login || !password || !fullName || !group || !variant) {
            setError('Заполните все поля');
            return;
        }

        try {
            await registerMutation({
                login, password,
                fullName, group,
                variant: parseInt(variant)
            }).unwrap();
            navigate('/area-checker/login', { replace: true });
        } catch (err) {
            setError(err.data?.message || 'Ошибка регистрации');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1>Лабораторная работа</h1>
                    <div className="student-info">
                        <p><strong>Студент:</strong> Сенькина Мария Дмитриевна</p>
                        <p><strong>Группа:</strong> P3222</p>
                        <p><strong>Вариант:</strong> 74949</p>
                    </div>
                </div>

                <div className="login-form-container">
                    <h2>{isLogin ? 'Вход в систему' : 'Регистрация'}</h2>

                    <form onSubmit={isLogin ? handleLogin : handleRegister}>
                        <div className="form-group">
                            <label htmlFor="login">Логин:</label>
                            <input
                                id="login"
                                type="text"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                placeholder="ivanov"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Пароль:</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="12345"
                                disabled={isSubmitting}
                            />
                        </div>

                        {!isLogin && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="fullName">ФИО:</label>
                                    <input
                                        id="fullName"
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Иванов Иван Иванович"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="group">Группа:</label>
                                    <input
                                        id="group"
                                        type="text"
                                        value={group}
                                        onChange={(e) => setGroup(e.target.value)}
                                        placeholder="P3222"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="variant">Вариант:</label>
                                    <input
                                        id="variant"
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={variant}
                                        onChange={(e) => setVariant(e.target.value)}
                                        placeholder="5"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </>
                        )}

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
                        </button>
                    </form>

                    <div className="login-hint" style={{ textAlign: 'center', marginTop: '20px' }}>
                        <p>
                            {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError('');
                                    if (isLogin) {
                                        setFullName(''); setGroup(''); setVariant('');
                                    } else {
                                        setLogin(''); setPassword('');
                                    }
                                }}
                                disabled={isSubmitting}
                                style={{
                                    background: 'transparent',
                                    color: '#667eea',
                                    padding: '8px 16px',
                                    fontSize: '14px',
                                    border: '2px solid #667eea',
                                    borderRadius: '6px',
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                    marginTop: '10px',
                                    width: 'auto',
                                    display: 'inline-block'
                                }}
                            >
                                {isLogin ? 'Зарегистрироваться' : 'Войти'}
                            </button>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LoginPage;
