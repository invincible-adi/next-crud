"use client"
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/userSlice';

const schema = yup
    .object()
    .shape({
        name: yup.string().required('Name is required'),
        email: yup.string().email('Please enter a valid email').required('Email is required'),
        password: yup.string().min(8, 'Password must be at least 8 characters').max(8, 'Password must be less than 8 characters').required('Password is required')
    })
    .required();

const Register = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });
    const router = useRouter()
    const dispatch = useDispatch();
    const { loading, error, isAuthenticated, token } = useSelector((state) => state.user);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    useEffect(() => {
        if (registrationSuccess) {
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful',
                text: 'You can now log in with your new account.',
                timer: 2000,
                showConfirmButton: false,
            });
            reset();
            router.push('/login');
        }
    }, [registrationSuccess, router, reset]);

    const handleRegister = async (data) => {
        const resultAction = await dispatch(registerUser(data));
        if (registerUser.fulfilled.match(resultAction)) {
            setRegistrationSuccess(true);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md mx-auto">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="bg-blue-600 text-white text-center py-6">
                        <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
                            <FontAwesomeIcon icon={faUserPlus} className="h-6 w-6" />
                            Create Account
                        </h3>
                        <p className="mt-2 text-blue-100">Join us today</p>
                    </div>
                    <div className="p-6">
                        <form onSubmit={handleSubmit(handleRegister)} className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                    <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                                    Full Name
                                </label>
                                <input
                                    {...register('name')}
                                    type="text"
                                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                    id="name"
                                    placeholder="Enter your full name"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                                )}
                            </div>
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
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                                )}
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors flex items-center justify-center gap-2">
                                <FontAwesomeIcon icon={faUserPlus} className="h-5 w-5" />
                                Create Account
                            </button>
                            <div className="text-center mt-4">
                                <p className="text-gray-500 text-sm">
                                    Already have an account?{' '}
                                    <Link href="/" className="text-blue-600 hover:underline font-medium">
                                        Login Here
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

export default Register

