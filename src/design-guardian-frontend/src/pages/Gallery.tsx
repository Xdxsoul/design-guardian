import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, Filter, Eye, Image as ImageIcon } from 'lucide-react';
import { User, Design } from "../declarations/main/main.did"
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

interface GalleryProps {
  user: User | null;
}

export const Gallery = ({ user }: GalleryProps) => {

  const { backend } = useSession();
  const [patterns, setPatterns] = useState<Design[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filteredPatterns, setFilteredPatterns] = useState<Design[]>([]);

  useEffect(() => {
    // Load saved patterns from localStorage (only public ones for gallery)
    const savedPatterns = JSON.parse(localStorage.getItem('savedPatterns') || '[]');
    const publicPatterns = savedPatterns.filter((design: Design) => !design.visible3DRendering);
    setPatterns(publicPatterns);
    setFilteredPatterns(publicPatterns);
  }, []);

  useEffect(() => {
    let filtered = patterns;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(pattern =>
        pattern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pattern.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by design type
    // if (filterType) {
    //   filtered = filtered.filter(design => design.kind === filterType);
    // }

    setFilteredPatterns(filtered);
  }, [patterns, searchTerm, filterType]);

  const whoAmi = async () => {
    const response = await backend.whoAmi();
    console.log(response)
  
  };
  
  whoAmi()

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary-glow/10 p-4">
      <div className="max-w-7xl mx-auto pt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Public Gallery
          </h1>
          <p className="text-muted-foreground">
            Discover amazing textile patterns from the Design Guardian community
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search patterns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Design Type Filter */}
              <div className="sm:w-48">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="footwear">Footwear</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="textile-printing">Textile Printing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gallery Grid */}
        {filteredPatterns.length === 0 ? (
          <Card className="text-center py-12 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardContent>
              {patterns.length === 0 ? (
                <>
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No public patterns yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to share your textile design with the community!
                  </p>
                </>
              ) : (
                <>
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No patterns found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search terms or filters
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setFilterType('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPatterns.map((pattern) => (
              <Card 
                key={pattern.id} 
                className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm hover:scale-105"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {pattern.name}
                    </CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </div>
                  {/* <Badge className={getDesignTypeColor(design.designType)}>
                    {getDesignTypeLabel(pattern.designType)}
                  </Badge> */}
                </CardHeader>
                <CardContent>
                  {/* {pattern.canvasData && (
                    <div className="mb-3 overflow-hidden rounded-lg">
                      <img
                        src={pattern.canvasData}
                        alt={pattern.name}
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )} */}
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {pattern.description || 'No description provided'}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>By {user?.name}</span>
                    <span>{new Date(Number(pattern.dateCreation)).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        {filteredPatterns.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Showing {filteredPatterns.length} of {patterns.length} public patterns
            </p>
          </div>
        )}
      </div>
    </div>
  );
};