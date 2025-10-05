import { useState } from "react";
import { signUp, signIn, supabase } from '@/lib/supabaseUtils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, User, Chrome } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SignupLoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SignupLoginPopup = ({ isOpen, onClose, onSuccess }: SignupLoginPopupProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [usePhone, setUsePhone] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (!resetEmail) {
      toast({ title: 'Missing email', description: 'Please enter your email.' });
      setIsLoading(false);
      return;
    }
    try {
      // Mock password reset
      toast({ 
        title: 'Password reset', 
        description: 'Password reset requires backend setup. Enable Lovable Cloud for this feature.' 
      });
      setShowReset(false);
    } catch (err: unknown) {
      let message = 'Please try again.';
      if (err && typeof err === 'object' && 'message' in err) {
        message = (err as { message?: string }).message || message;
      }
      toast({ title: 'Reset failed', description: message });
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, isSignup: boolean) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.target as HTMLFormElement;
    if (usePhone) {
      if (!phone) {
        toast({ title: 'Missing phone', description: 'Please enter your phone number.' });
        setIsLoading(false);
        return;
      }
      try {
        if (!otpSent) {
          // Mock OTP send
          toast({ 
            title: 'Phone authentication', 
            description: 'Phone auth requires backend setup. Enable Lovable Cloud for this feature.' 
          });
          setOtpSent(true);
        } else {
          // Mock OTP verify
          if (!otp) {
            toast({ title: 'Missing OTP', description: 'Enter the code sent to your phone.' });
            setIsLoading(false);
            return;
          }
          toast({ title: 'Authenticated!', description: 'You are signed in.' });
          onSuccess();
          onClose();
        }
      } catch (err: unknown) {
        let message = 'Please try again.';
        if (err && typeof err === 'object' && 'message' in err) {
          message = (err as { message?: string }).message || message;
        }
        toast({ title: 'Phone authentication failed', description: message });
      }
      setIsLoading(false);
      return;
    }
    // Email logic
    const email = (form.querySelector('input[type="email"]') as HTMLInputElement)?.value;
    const password = (form.querySelector('input[type="password"]') as HTMLInputElement)?.value;
    if (!email || !password) {
      toast({ title: 'Missing fields', description: 'Please enter both email and password.' });
      setIsLoading(false);
      return;
    }
    try {
      let result;
      if (isSignup) {
        // Mock signup - just simulate success
        toast({ title: 'Account created!', description: 'Your account has been created successfully.' });
        result = { error: null };
      } else {
        // Mock signin - just simulate success
        toast({ title: 'Welcome back!', description: "You've successfully signed in." });
        result = { error: null };
      }
      if (!result.error) {
        onSuccess();
        onClose();
      }
    } catch (err: unknown) {
      let message = 'Please try again.';
      if (err && typeof err === 'object' && 'message' in err) {
        message = (err as { message?: string }).message || message;
      }
      toast({ title: 'Authentication failed', description: message });
    }
    setIsLoading(false);
  };

  const handleSocialSignIn = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    try {
      // Mock social sign-in
      toast({ 
        title: `Sign in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`, 
        description: 'Social authentication requires backend setup. Enable Lovable Cloud for full auth features.' 
      });
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: unknown) {
      let message = 'Please try again.';
      if (err && typeof err === 'object' && 'message' in err) {
        message = (err as { message?: string }).message || message;
      }
      toast({ title: 'Social sign-in failed', description: message });
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-primary/20 bg-card shadow-[0_0_50px_rgba(255,204,0,0.15)] animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-gradient">Welcome to ONYXIA</DialogTitle>
          <DialogDescription className="text-center">
            Sign in to unlock exclusive features and personalized shopping
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            {showReset ? (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      required
                      value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" variant="luxury" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => setShowReset(false)}>
                  Back to Sign In
                </Button>
              </form>
            ) : (
              <>
                <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
                  <div className="flex gap-2 mb-2">
                    <Button type="button" variant={usePhone ? "outline" : "luxury"} onClick={() => setUsePhone(false)} className="flex-1">Email</Button>
                    <Button type="button" variant={usePhone ? "luxury" : "outline"} onClick={() => setUsePhone(true)} className="flex-1">Phone</Button>
                  </div>
                  {usePhone ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="login-phone">Phone Number</Label>
                        <div className="relative">
                          <Input
                            id="login-phone"
                            type="tel"
                            placeholder="+1234567890"
                            className="pl-10"
                            required
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                          />
                        </div>
                      </div>
                      {otpSent && (
                        <div className="space-y-2">
                          <Label htmlFor="login-otp">OTP Code</Label>
                          <div className="relative">
                            <Input
                              id="login-otp"
                              type="text"
                              placeholder="Enter OTP"
                              className="pl-10"
                              required
                              value={otp}
                              onChange={e => setOtp(e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="your@email.com"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="login-password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}
                  <Button type="submit" className="w-full" variant="luxury" disabled={isLoading}>
                    {isLoading ? (usePhone ? (otpSent ? "Verifying..." : "Send OTP") : "Signing in...") : "Sign In"}
                  </Button>
                </form>
                <Button type="button" variant="link" className="w-full text-xs mt-2" onClick={() => setShowReset(true)}>
                  Forgot password?
                </Button>
                <div className="relative mt-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialSignIn('google')}
                    className="hover:border-primary/50"
                  >
                    <Chrome className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialSignIn('facebook')}
                    className="hover:border-primary/50"
                  >
                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" variant="luxury" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialSignIn('google')}
                className="hover:border-primary/50"
              >
                <Chrome className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialSignIn('facebook')}
                className="hover:border-primary/50"
              >
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};