"use client";

import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { useEffect } from 'react';
import { setUserFromStorage } from './userSlice';

function AuthInit({ children }) {
    const dispatch = useDispatch();
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            if (token && user) {
                try {
                    dispatch(setUserFromStorage({ token: JSON.parse(token), user: JSON.parse(user) }));
                } catch { }
            }
        }
    }, [dispatch]);
    return children;
}

const ReduxProvider = ({ children }) => {
    return (
        <Provider store={store}>
            <AuthInit>{children}</AuthInit>
        </Provider>
    );
};

export default ReduxProvider;
