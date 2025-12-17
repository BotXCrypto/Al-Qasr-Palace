import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'forgot' | 'reset';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for password reset token in URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');
    if (type === 'recovery') {
      setMode('reset');
    }
  }, []);

  useEffect(() => {
    if (user && mode !== 'reset') {
      navigate('/');
    }
  }, [user, mode, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message.includes('Invalid login credentials') 
            ? 'Invalid email or password' 
            : error.message);
        } else {
          toast.success('Welcome back!');
          navigate('/');
        }
      } else if (mode === 'signup') {
        if (password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setIsSubmitting(false);
          return;
        }
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast.error(error.message.includes('already registered') 
            ? 'This email is already registered' 
            : error.message);
        } else {
          toast.success('Account created successfully!');
          navigate('/');
        }
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Password reset link sent to your email!');
          setMode('login');
        }
      } else if (mode === 'reset') {
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          setIsSubmitting(false);
          return;
        }
        if (password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setIsSubmitting(false);
          return;
        }
        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Password updated successfully!');
          navigate('/');
        }
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Welcome Back';
      case 'signup': return 'Create Account';
      case 'forgot': return 'Reset Password';
      case 'reset': return 'Set New Password';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'login': return 'Sign in to manage your reservations';
      case 'signup': return 'Join us for an exceptional experience';
      case 'forgot': return 'Enter your email to receive a reset link';
      case 'reset': return 'Enter your new password';
    }
  };

  const getButtonText = () => {
    switch (mode) {
      case 'login': return 'Sign In';
      case 'signup': return 'Create Account';
      case 'forgot': return 'Send Reset Link';
      case 'reset': return 'Update Password';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-6">
        <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
          <ArrowLeft size={18} />
          Back to Home
        </Button>
      </header>
      
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg p-8 shadow-card">
            <div className="text-center mb-8">
              <h1 className="font-serif text-3xl text-gradient-gold mb-2">
                {getTitle()}
              </h1>
              <p className="text-muted-foreground">{getSubtitle()}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                </div>
              )}
              
              {mode !== 'reset' && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              )}

              {(mode === 'login' || mode === 'signup' || mode === 'reset') && (
                <div className="space-y-2">
                  <Label htmlFor="password">{mode === 'reset' ? 'New Password' : 'Password'}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              )}

              {mode === 'reset' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              )}

              <Button 
                type="submit" 
                variant="hero" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  getButtonText()
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              {mode === 'login' && (
                <>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-sm text-muted-foreground hover:text-primary hover:underline block w-full"
                  >
                    Forgot your password?
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-sm text-primary hover:underline block w-full"
                  >
                    Don't have an account? Sign up
                  </button>
                </>
              )}
              {mode === 'signup' && (
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-sm text-primary hover:underline"
                >
                  Already have an account? Sign in
                </button>
              )}
              {mode === 'forgot' && (
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-sm text-primary hover:underline"
                >
                  Back to sign in
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
