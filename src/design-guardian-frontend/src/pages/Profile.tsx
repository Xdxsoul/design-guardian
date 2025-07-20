import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Save, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileProps {
  user: {
    name: string;
    email?: string;
  };
  onUpdateUser: (userData: { name: string; email?: string }) => void;
}

export const Profile = ({ user, onUpdateUser }: ProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const userData = {
        name: name.trim(),
        email: email.trim() || undefined,
      };

      onUpdateUser(userData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setName(user.name);
    setEmail(user.email || '');
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary-glow/10 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>

        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Account Information</span>
            </CardTitle>
            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture Placeholder */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {user.email || 'No email provided'}
                </p>
              </div>
            </div>

            <Separator />

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="profile-name" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Full Name</span>
                </Label>
                {isEditing ? (
                  <Input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="p-2 bg-muted rounded-md text-sm">
                    {user.name}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="profile-email" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email Address</span>
                </Label>
                {isEditing ? (
                  <Input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                  />
                ) : (
                  <div className="p-2 bg-muted rounded-md text-sm">
                    {user.email || 'No email provided'}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="mt-6 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Design Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4">
                <div className="text-2xl font-bold text-primary">0</div>
                <p className="text-sm text-muted-foreground">Patterns Created</p>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-primary">0</div>
                <p className="text-sm text-muted-foreground">NFTs Minted</p>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-primary">0</div>
                <p className="text-sm text-muted-foreground">Sales Made</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};