import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import authService from '../api/authApi';
import profileService from '@/api/profileApi';
import { login as authLogin } from '../store/authSlice';
import { closeAuthModal, setAuthModalTab } from '../store/uiSlice';
import { Logo } from './index';

/* ─── Reusable field ─────────────────────────────────────────── */
function Field({ label, error, ...props }) {
    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
                    {label}
                </label>
            )}
            <input
                className={`w-full rounded-lg border bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition-all duration-200 placeholder:text-stone-400 focus:border-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-900/10 ${
                    error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-stone-200'
                }`}
                {...props}
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
}

/* ─── Login Form ─────────────────────────────────────────────── */
function LoginForm({ onSuccess }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const [apiError, setApiError] = useState('');

    const onSubmit = async (data) => {
        setApiError('');
        try {
            const session = await authService.login(data);
            if (session) {
                const userData = await authService.getCurrentUser();
                if (userData) dispatch(authLogin(userData));
                onSuccess();
                navigate('/');
            }
        } catch (err) {
            setApiError(err.message || 'Login failed. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {apiError && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
                    {apiError}
                </div>
            )}
            <Field
                label="Email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email', {
                    required: 'Email is required',
                    validate: (v) =>
                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                        'Enter a valid email address',
                })}
            />
            <Field
                label="Password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register('password', { required: 'Password is required' })}
            />
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-stone-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Signing in…
                    </span>
                ) : 'Sign in'}
            </button>
        </form>
    );
}

/* ─── Signup Form ────────────────────────────────────────────── */
function SignupForm({ onSuccess }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const [apiError, setApiError] = useState('');
    const [accountExists, setAccountExists] = useState(false);
    const { setAuthModalTab: _ } = {};   // unused placeholder

    const onSubmit = async (data) => {
        setApiError('');
        setAccountExists(false);
        try {
            const result = await authService.createAccount(data);
            if (result) {
                const userData = await authService.getCurrentUser();
                if (userData) {
                    await profileService.upsertProfile({
                        userID: userData.$id,
                        name: userData.name,
                        bio: '',
                        website: '',
                        github: '',
                        linkedin: '',
                    });
                    dispatch(authLogin(userData));
                }
                onSuccess();
                navigate('/');
            }
        } catch (err) {
            const isDupe = err?.code === 409 || err?.type === 'user_already_exists';
            setAccountExists(isDupe);
            setApiError(isDupe ? 'An account with this email already exists.' : err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {apiError && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
                    <p>{apiError}</p>
                    {accountExists && (
                        <p className="mt-1 text-xs">
                            Already have an account?{' '}
                            <button
                                type="button"
                                className="font-semibold underline underline-offset-2 hover:text-red-900"
                                onClick={() => dispatch(setAuthModalTab('login'))}
                            >
                                Sign in instead
                            </button>
                        </p>
                    )}
                </div>
            )}
            <Field
                label="Full Name"
                placeholder="Jane Doe"
                autoComplete="name"
                error={errors.name?.message}
                {...register('name', { required: 'Full name is required' })}
            />
            <Field
                label="Email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email', {
                    required: 'Email is required',
                    validate: (v) =>
                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                        'Enter a valid email address',
                })}
            />
            <Field
                label="Password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                error={errors.password?.message}
                {...register('password', { required: 'Password is required' })}
            />
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-stone-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Creating account…
                    </span>
                ) : 'Create Account'}
            </button>
        </form>
    );
}

/* ─── Modal Shell ────────────────────────────────────────────── */
export default function AuthModal() {
    const dispatch = useDispatch();
    const { authModalOpen, authModalTab } = useSelector((s) => s.ui);
    const overlayRef = useRef(null);

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') dispatch(closeAuthModal()); };
        if (authModalOpen) document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [authModalOpen, dispatch]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = authModalOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [authModalOpen]);

    if (!authModalOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) dispatch(closeAuthModal());
    };

    const handleSuccess = () => dispatch(closeAuthModal());

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
        >
            <div
                className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
                style={{ animation: 'modalPop 0.25s cubic-bezier(0.34,1.56,0.64,1) both' }}
            >
                {/* Close button */}
                <button
                    onClick={() => dispatch(closeAuthModal())}
                    className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
                    aria-label="Close"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header */}
                <div className="flex flex-col items-center pt-8 pb-6 px-8 border-b border-stone-100">
                    <span className="mb-3 inline-block w-20">
                        <Logo width="100%" />
                    </span>
                    <h2 className="font-serif text-2xl font-semibold text-stone-950">
                        {authModalTab === 'login' ? 'Welcome back' : 'Create account'}
                    </h2>
                    <p className="mt-1 text-sm text-stone-500">
                        {authModalTab === 'login'
                            ? 'Sign in to continue reading & writing'
                            : 'Join the community of writers'}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-stone-100 bg-stone-50">
                    {['login', 'signup'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => dispatch(setAuthModalTab(tab))}
                            className={`flex-1 py-3 text-sm font-semibold uppercase tracking-wider transition-all duration-200 ${
                                authModalTab === tab
                                    ? 'border-b-2 border-stone-900 bg-white text-stone-900'
                                    : 'text-stone-400 hover:text-stone-600'
                            }`}
                        >
                            {tab === 'login' ? 'Sign In' : 'Sign Up'}
                        </button>
                    ))}
                </div>

                {/* Form */}
                <div className="px-8 py-7">
                    {authModalTab === 'login' ? (
                        <LoginForm onSuccess={handleSuccess} />
                    ) : (
                        <SignupForm onSuccess={handleSuccess} />
                    )}

                    {/* Footer switcher */}
                    <p className="mt-6 text-center text-xs text-stone-500">
                        {authModalTab === 'login' ? (
                            <>
                                Don&apos;t have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => dispatch(setAuthModalTab('signup'))}
                                    className="font-semibold text-stone-800 underline underline-offset-2 hover:text-stone-950"
                                >
                                    Sign Up
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => dispatch(setAuthModalTab('login'))}
                                    className="font-semibold text-stone-800 underline underline-offset-2 hover:text-stone-950"
                                >
                                    Sign In
                                </button>
                            </>
                        )}
                    </p>
                </div>
            </div>

            {/* Pop animation keyframe injected inline */}
            <style>{`
                @keyframes modalPop {
                    from { opacity: 0; transform: scale(0.9) translateY(12px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    );
}
