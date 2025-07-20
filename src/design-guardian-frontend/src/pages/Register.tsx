import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, User, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface RegisterProps {
  onRegister: (userData: { name: string; email?: string }) => void;
  onNavigate: (page: string) => void;
}

export const Register = ({ onRegister, onNavigate }: RegisterProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate registration delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const userData = {
        name: name.trim(),
        email: email.trim() || undefined,
      };

      onRegister(userData);
      toast.success('Welcome to Design Guardian!');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary-glow/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-primary to-primary-glow p-3 rounded-xl shadow-lg animate-glow">
              <Palette className="h-8 w-8 text-primary-foreground" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Design Guardian
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome to the Future of Textile Design
          </h1>
          <p className="text-muted-foreground">
            Create, protect, and monetize your textile designs with blockchain technology
          </p>
        </div>

        {/* Registration Card */}
        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle>Create Your Account</CardTitle>
            <CardDescription>
              Join the creative community and start protecting your designs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Full Name *</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email (Optional)</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Email is optional but recommended for account recovery
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto text-primary"
                  onClick={() => onNavigate('login')}
                >
                  Sign in here
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Palette className="h-6 w-6 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Design Studio</p>
          </div>
          <div className="p-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <div className="w-6 h-6 bg-primary rounded" />
            </div>
            <p className="text-xs text-muted-foreground">NFT Protection</p>
          </div>
          <div className="p-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <div className="w-6 h-6 border-2 border-primary rounded-full" />
            </div>
            <p className="text-xs text-muted-foreground">Global Gallery</p>
          </div>
        </div>
      </div>
    </div>
  );
};