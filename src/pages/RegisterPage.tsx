import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { Film, User, Mail, Lock } from 'lucide-react';
import { authStateAtom, registerAtom } from '../store/auth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const RegisterPage: React.FC = () => {
  const [{ isAuthenticated, isLoading, error }] = useAtom(authStateAtom);
  const [, register] = useAtom(registerAtom);
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  
  const validateForm = () => {
    const errors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    let isValid = true;
    
    if (!name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }
    
    if (!email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await register({ name, email, password });
        navigate('/');
      } catch (error) {
        // Error will be handled by the atom
      }
    }
  };
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-background-dark to-primary-900/50 px-4">
      <div className="max-w-md w-full bg-background-light rounded-lg shadow-xl p-8 animate-fade-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-4">
            <Film className="h-10 w-10 text-primary-500" />
            <span className="ml-2 text-2xl font-bold text-white">StreamAI</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-gray-400 mt-1">Get personalized recommendations for your favorites</p>
        </div>
        
        {error && (
          <div className="bg-error-500/20 border border-error-500 text-white rounded-md p-3 mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="relative">
              <Input
                id="name"
                type="text"
                label="Full Name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={formErrors.name}
                fullWidth
                className="pl-10"
              />
              <User className="absolute left-3 top-9 text-gray-500" size={18} />
            </div>
          </div>
          
          <div className="mb-4">
            <div className="relative">
              <Input
                id="email"
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={formErrors.email}
                fullWidth
                className="pl-10"
              />
              <Mail className="absolute left-3 top-9 text-gray-500" size={18} />
            </div>
          </div>
          
          <div className="mb-4">
            <div className="relative">
              <Input
                id="password"
                type="password"
                label="Password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={formErrors.password}
                fullWidth
                className="pl-10"
              />
              <Lock className="absolute left-3 top-9 text-gray-500" size={18} />
            </div>
          </div>
          
          <div className="mb-6">
            <div className="relative">
              <Input
                id="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={formErrors.confirmPassword}
                fullWidth
                className="pl-10"
              />
              <Lock className="absolute left-3 top-9 text-gray-500" size={18} />
            </div>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            Create Account
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;