import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './store/store';
import LoginPage from './pages/login/LoginPage';
import MainPage from './pages/main/MainPage';
import { RequireAuth } from './components/RequireAuth';

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/area-checker/login" element={<LoginPage />} />
                    <Route path="/area-checker/" element={
                        <RequireAuth>
                            <MainPage />
                        </RequireAuth>
                    } />
                    <Route path="*" element={<Navigate to="/area-checker/" replace />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}


export default App;
