import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
// Importamos los íconos adicionales necesarios
import { User as _User, Mail, Save, Edit, Calendar, Info, Users, Image } from 'lucide-react';
import { User } from "../declarations/main/main.did"
import { useSession } from "../context/sessionContext";
import { toast } from 'sonner';

interface ProfileProps {
  profile: User;
}

const Profile = ({ profile }: ProfileProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useSession();
  console.log(profile.name)

  // Helper para formatear la fecha de registro
  const formatRegisterDate = (timestamp: bigint | number): string => {
    // Convierte el BigInt (Int en tu did) a Number para el constructor de Date
    // Asumimos que `registerDate` es un timestamp en segundos (Unix timestamp).
    // Si fuera en milisegundos, no necesitarías el * 1000.
    const date = new Date(Number(timestamp) * 1000); 
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
              <_User className="h-5 w-5" />
              <span>Account Information</span>
            </CardTitle>
            
            { user.id === profile.id && <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4 mr-2" /> Editar
            </Button>}
          </CardHeader>
          <CardContent className="space-y-6">
  
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center">
                <_User className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">{profile.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {profile.email?.[0] || 'No email provided'} 
                </p>
              </div>
            </div>

            <Separator />

            
            <div>
              <h4 className="font-semibold flex items-center space-x-2 mb-1">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span>About me</span>
              </h4>
              <p className="text-sm text-muted-foreground">
                {profile.bio.length ? profile.bio[0] : 'No biography available.'} 
              </p>
            </div>

            <Separator />

      
            <div>
              <h4 className="font-semibold flex items-center space-x-2 mb-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Registration date</span>
              </h4>
              <p className="text-sm text-muted-foreground">
                {formatRegisterDate(Number(profile.registerDate)/1000000000)}
              </p>
            </div>

            <Separator />

            {/* Estadísticas de Seguidores, Seguidos y Diseños */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-2 flex flex-col items-center">
                <Users className="h-5 w-5 text-primary mb-1" />
                <div className="text-xl font-bold text-foreground">{profile.followers.length}</div>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div className="p-2 flex flex-col items-center">
                <Users className="h-5 w-5 text-primary mb-1" />
                <div className="text-xl font-bold text-foreground">{profile.followeds.length}</div>
                <p className="text-sm text-muted-foreground">Followeds</p>
              </div>
              <div className="p-2 flex flex-col items-center">
                <Image className="h-5 w-5 text-primary mb-1" />
                <div className="text-xl font-bold text-foreground">{profile.designs.length}</div>
                <p className="text-sm text-muted-foreground">Designs</p>
              </div>
            </div>
            
          </CardContent>
        </Card>

        {/* Stats Card (se mantiene, aunque algunos datos se han movido arriba) */}
        <Card className="mt-6 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Design Statistics (Placeholder)</CardTitle>
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

export default Profile;