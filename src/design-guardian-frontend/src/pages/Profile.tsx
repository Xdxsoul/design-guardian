import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User as _User, Mail, Save, Edit } from 'lucide-react';
import { User } from "../declarations/main/main.did"

import { toast } from 'sonner';

interface ProfileProps {
  user: User;
  onUpdateUser: (userData: { name: string; email?: string }) => void;
}

export const Profile = ({ user, onUpdateUser }: ProfileProps) => {
  const [isLoading, setIsLoading] = useState(false);

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
              <_User className="h-5 w-5" />
              <span>Account Information</span>
            </CardTitle>
            
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture Placeholder */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center">
                <_User className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {user.email || 'No email provided'}
                </p>
              </div>
            </div>

            <Separator />

          
            

            
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