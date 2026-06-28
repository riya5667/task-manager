import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Signup = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const success = await signup(data.email, data.password);
    setIsSubmitting(false);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="glass p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className={`w-full p-3 rounded bg-white/10 border ${errors.email ? 'border-red-500' : 'border-white/20'} focus:outline-none focus:border-primary transition`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              className={`w-full p-3 rounded bg-white/10 border ${errors.password ? 'border-red-500' : 'border-white/20'} focus:outline-none focus:border-primary transition`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword', { 
                required: 'Please confirm password',
                validate: value => value === password || 'Passwords do not match'
              })}
              className={`w-full p-3 rounded bg-white/10 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/20'} focus:outline-none focus:border-primary transition`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/80 text-white p-3 rounded font-semibold transition flex justify-center items-center"
          >
            {isSubmitting ? <span className="animate-spin mr-2 border-2 border-white border-t-transparent rounded-full w-5 h-5"></span> : null}
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
