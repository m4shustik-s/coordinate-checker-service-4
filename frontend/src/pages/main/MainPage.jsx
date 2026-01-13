import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {
    useGetPointsQuery,
    useCheckPointMutation,
    useClearPointsMutation
} from '../../store/areaApi';
import {
    useGetUserQuery,
    useLogoutMutation
} from '../../store/authApi';
import Graph from '../../components/Graph';
import '../../styles/common.css';
import './MainPage.css';

function MainPage() {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [r, setR] = useState(1);

    const [error, setError] = useState('');
    const { data: user } = useGetUserQuery();
    const [logout] = useLogoutMutation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout().unwrap();
        navigate('/area-checker/login', { replace: true });
    };

    const {
        data: points = [],
        isLoading: pointsLoading,
        isError: pointsError,
        refetch: refetchPoints
    } = useGetPointsQuery();

    const [checkPoint, { isLoading: checking }] = useCheckPointMutation();
    const [clearPoints, { isLoading: clearing }] = useClearPointsMutation();

    const xValues = [-3, -2, -1, 0, 1, 2, 3, 4, 5];
    const rValues = [-3, -2, -1, 0, 1, 2, 3, 4, 5];


    const handleCheckPoint = async (e) => {
        e.preventDefault();
        setError('');

        const yNum = parseFloat(y);
        if (isNaN(yNum) || yNum <= -5 || yNum >= 5) {
            setError('Y должен быть числом от -5 до 5 не включительно');
            return;
        }

        if (r <= 0 ) {
            setError("Радиус должен быть положительным")
        }

        try {
            await checkPoint({ x, y: yNum, r }).unwrap();
            setY('');
        } catch (err) {
            setError('Ошибка при проверке точки');
        }
    };

    const handleGraphClick = async (clickX, clickY) => {
        try {
            await checkPoint({ x: clickX, y: clickY, r }).unwrap();
        } catch (err) {
            setError('Ошибка при проверке точки');
        }
    };

    const handleClearPoints = async () => {
        try {
            await clearPoints().unwrap();
        } catch (err) {
            setError('Ошибка при очистке точек');
        }
    };

    const checkY = () => {
        const yNum = parseFloat(y);
        return (!isNaN(yNum) && yNum > -5 && yNum < 5)
    }

    const checkR = r > 0

    return (
        <div className="main-container">
            <header className="main-header">
                <h1>Проверка попадания точек в область</h1>
                <div className="user-info">
                    <button
                        onClick={handleClearPoints}
                        className="clear-btn"
                        disabled={clearing || points.length === 0}
                    >
                        {clearing ? 'Очистка...' : `Очистить (${points.length})`}
                    </button>
                </div>
            </header>

            <div className="main-header">
                <h1>{user.fullName} | {user.group} | Вариант {user.variant}</h1>
                <button className="logout-btn" onClick={handleLogout}>Выйти</button>
            </div>

            <div className="main-content">
                <div className="left-column">
                    <div className="input-section">
                        <h3>Введите параметры точки</h3>
                        {error && <div className="error-message">{error}</div>}
                        <form onSubmit={handleCheckPoint}>
                            <div className="input-group">
                                <label>Координата X:</label>
                                <div className="button-group">
                                    {xValues.map(value => (
                                        <button
                                            key={value}
                                            type="button"
                                            className={`value-btn ${x === value ? 'valid' : ''}`}
                                            onClick={() => setX(value)}
                                        >
                                            {value}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className={`input-group`}>
                                <label>Координата Y:</label>
                                <input
                                    type="text"
                                    value={y}
                                    onChange={(e) => setY(e.target.value)}
                                    placeholder="Введите число от -5 до 5"
                                    className={checkY() ? 'valid' : 'invalid'}
                                />
                            </div>
                            <div className="input-group">
                                <label>Радиус R:</label>
                                <div className="button-group">
                                    {rValues.map(value => (
                                        <button
                                            key={value}
                                            type="button"
                                            className={`value-btn ${r === value 
                                                ? checkR 
                                                    ? 'valid'
                                                    : 'invalid' 
                                                : ''
                                            }`}
                                            onClick={() => setR(value)}
                                            disabled={checking}
                                        >
                                            {value}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button type="submit" className="check-btn" disabled={checking}>
                                {checking ? 'Проверка...' : 'Проверить точку'}
                            </button>
                        </form>
                    </div>

                    <div className="results-section">
                        <h3>История проверок</h3>
                        {pointsLoading && <div>Загрузка истории...</div>}
                        {pointsError && (
                            <div className="error-message">
                                Ошибка загрузки истории
                                <button onClick={refetchPoints}>Повторить</button>
                            </div>
                        )}
                        <table className="results-table">
                            <thead>
                            <tr>
                                <th>X</th>
                                <th>Y</th>
                                <th>R</th>
                                <th>Результат</th>
                                <th>Время запроса</th>
                                <th>Время вычисления</th>
                            </tr>
                            </thead>
                            <tbody>
                            {points.map((point) => (
                                <tr key={point.id}>
                                    <td>{point.x.toFixed(2)}</td>
                                    <td>{point.y.toFixed(2)}</td>
                                    <td>{point.r.toFixed(2)}</td>
                                    <td className={point.hit ? 'hit' : 'miss'}>
                                        {point.hit ? 'Попала' : 'Не попала'}
                                    </td>
                                    <td>{point.checkTime ? new Date(point.checkTime).toLocaleString('ru-RU') : '-'}</td>
                                    <td style={{fontFamily: 'monospace', textAlign: 'right'}}>
                                        {point.executionTime ? (point.executionTime / 1_000_000).toFixed(3) + ' мс' : '-'}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="right-column">
                    <Graph points={points} r={r} onPointClick={handleGraphClick} />
                </div>
            </div>
        </div>
    );
}

export default MainPage;