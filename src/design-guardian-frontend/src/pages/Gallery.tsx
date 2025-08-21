import Gallery3D from '../components/Gallery3D.tsx';

import { User, DesignPreview } from "../declarations/main/main.did"
// import { useSession } from "../context/sessionContext"

interface GalleryProps {
  user: User | null;
}

export const Gallery = ({ user }: GalleryProps) => {
  
  //TODO Traerse del backend los archivos glb hacia este componente o hacia Galery3d
  return (
    <>
    <div className=" bg-gradient-to-br from-background via-accent/20 to-primary-glow/10 p-4 mb-">
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
      </div>
    </div>
      <Gallery3D patterns={[]}/>
    </>
  );
};