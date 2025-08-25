import { Button } from '@/components/ui/button';
import Gallery3D from '../components/Gallery3D.tsx';
import { useEffect, useState } from 'react';

import { User, DesignPreview } from "../declarations/main/main.did"
import { ArrowLeft } from 'lucide-react';
import { useSession } from "../context/sessionContext"

interface GalleryProps {
  user: User | null;
  onNavigate: (page: string) => void;

}

export const Gallery = ({  onNavigate }: GalleryProps) => {

  const { user, backend } = useSession()
  const [patters, setPatterns] = useState<DesignPreview[]>([])

  useEffect(() => {
    const fetchPatterns = async () => {
      const response = await backend.feed();
      setPatterns(response.filter(x => x.visible3DRendering))
    };
    fetchPatterns()
  }, [backend])

  return (
    <>
    <div className=" bg-gradient-to-br from-background via-accent/20 to-primary-glow/10 p-4 mb-">
      <div className="max-w-7xl mx-auto pt-8">
        {/* Header */}
        <div className="mb-8">
          {user && <Button
            variant="outline"
            onClick={() => onNavigate('dashboard')}
          >
            Dashboard
          </Button>}
        </div>    
      </div>
    </div>
      <Gallery3D patterns={patters}/>
    </>
  );
};