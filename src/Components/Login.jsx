"use client";

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { HashLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/userSlice';
import { useEffect } from 'react';

const schema = yup.object().shape({
    email: yup.string().email('Please enter a valid email').required('Email is required'),
    password: yup.string().min(8, 'Password must be at least 8 characters').max(8, 'Password must be less than 8 characters').required('Password is required'),
}).required();

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const router = useRouter();
    const dispatch = useDispatch();
    const { loading, error, isAuthenticated, token, user } = useSelector((state) => state.user);

    useEffect(() => {
        if (isAuthenticated && token && user) {
            localStorage.setItem('token', JSON.stringify(token));
            localStorage.setItem('user', JSON.stringify(user));
            // Redirect to dashboard after login
            router.push('/dashboard');
        }
    }, [isAuthenticated, token, user, router]);

    useEffect(() => {
        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error,
            });
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleLogin = async (data) => {
        dispatch(loginUser(data));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md mx-auto">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="bg-blue-600 text-white text-center py-6">
                        <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
                            <FontAwesomeIcon icon={faSignInAlt} className="h-6 w-6" />
                            Welcome Back
                        </h3>
                        <p className="mt-2 text-blue-100">Sign in to your account</p>
                    </div>
                    <div className="p-6">
                        <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                    <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4" />
                                    Email Address
                                </label>
                                <input
                                    {...register('email')}
                                    type="email"
                                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                    id="email"
                                    placeholder="Enter your email"
                                    disabled={loading}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                    <FontAwesomeIcon icon={faLock} className="h-4 w-4" />
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                    {...register('password')}
                                    id="password"
                                    placeholder="Enter your password"
                                    disabled={loading}
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                                )}
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors flex items-center justify-center gap-2" disabled={loading}>
                                {loading ? (
                                    <>
                                        <HashLoader color="#fff" size={20} />
                                        <span className="ml-2">Loading...</span>
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faSignInAlt} className="h-5 w-5" />
                                        Sign In
                                    </>
                                )}
                            </button>
                            <div className="text-center mt-4">
                                <p className="text-gray-500 text-sm">
                                    Don't have an account?{' '}
                                    <Link href="/register" className="text-blue-600 hover:underline font-medium">
                                        Register Here
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
