import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Plus, Eye, Edit, Trash2, Image } from 'lucide-react';
import { User, DesignPreview } from "../declarations/main/main.did"
import { useSession } from "../context/sessionContext"

// interface Pattern {
//   id: string;
//   name: string;
//   description: string;
//   designType: string;
//   isPrivate3D: boolean;
//   canvasData: string;
//   createdAt: string;
// }

interface DashboardProps {
  user: User | null;
  onNavigate: (page: string) => void;
}

export const Dashboard = ({ user, onNavigate }: DashboardProps) => {
  const [patterns, setPatterns] = useState<DesignPreview[]>([]);
  const { backend } = useSession()

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const designs = await backend.getMyGalery();
        setPatterns(designs);
      } catch (error) {
        console.error("Error fetching feed:", error);
      }
    };
    fetchFeed();
  }, [backend]);

  const getDesignTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'footwear': 'Footwear',
      'clothing': 'Clothing',
      'accessories': 'Accessories',
      'textile-printing': 'Textile Printing',
    };
    return labels[type] || type;
  };

  const getDesignTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'footwear': 'bg-blue-100 text-blue-800',
      'clothing': 'bg-green-100 text-green-800',
      'accessories': 'bg-purple-100 text-purple-800',
      'textile-printing': 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const deletePattern = (id: number) => {
    console.log("Delete is not implemented yet")
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary-glow/10 p-4">
      <div className="max-w-7xl mx-auto pt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome {user && "back, " + user.name } !!! 👋
          </h1>
          <p className="text-muted-foreground">
            Manage your textile designs and track your creative journey
          </p>
        </div>

        {/* Stats Cards */}
        { user && <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80">Total Patterns</p>
                  <p className="text-2xl font-bold">{user.designs.length}</p>
                </div>
                <Palette className="h-8 w-8 text-primary-foreground/80" />
              </div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Public Designs</p>
                  <p className="text-2xl font-bold">{patterns.filter(p => !p.isPrivate3D).length}</p>
                </div>
                <Eye className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card> */}

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">NFTs Minted</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Image className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">$0</p>
                </div>
                <div className="h-8 w-8 bg-muted-foreground/20 rounded" />
              </div>
            </CardContent>
          </Card>
        </div>}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => onNavigate('design')}
              className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Pattern
            </Button>
            <Button variant="outline" onClick={() => onNavigate('gallery')}>
              <Eye className="h-4 w-4 mr-2" />
              Browse Gallery
            </Button>
            <Button variant="outline" onClick={() => onNavigate('profile')}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Recent Patterns */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Patterns</h2>
          
          {user?.designs.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No patterns yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start creating your first textile pattern design
                </p>
                <Button onClick={() => onNavigate('design')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Pattern
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {patterns.reverse().map((pattern) => (
                <Card key={pattern.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{pattern.name}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePattern(Number(pattern.id))}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* <Badge className={getDesignTypeColor(pattern.kind)}>
                        {getDesignTypeLabel(pattern.kind)}
                      </Badge> */}
                      {/* {pattern.isPrivate3D && (
                        <Badge variant="outline">Private 3D</Badge>
                      )} */}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {pattern.coverImage && (
                      <div className="mb-3">
                        <img
                          src={String.fromCharCode(... pattern.coverImage.data)}
                          alt={pattern.name}
                          className="w-full h-32 object-cover rounded border"
                        />
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {pattern.description || 'No description provided'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date((Number(pattern.dateCreation)/1000000)).toLocaleDateString() }
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};