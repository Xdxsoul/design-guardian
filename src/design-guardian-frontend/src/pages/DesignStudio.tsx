import { useState } from 'react';
import { PatternCanvas } from '@/components/PatternCanvas';
import { SavePatternDialog } from '@/components/SavePatternDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Palette } from 'lucide-react';
import { useSession  } from '../context/sessionContext';

interface DesignStudioProps {
  onNavigate: (page: string) => void;
}

export const DesignStudio = ({ onNavigate }: DesignStudioProps) => {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [currentCanvasData, setCurrentCanvasData] = useState('');

  const { backend } = useSession();

  const handleSavePattern = (canvasData: string) => {
    setCurrentCanvasData(canvasData);
    setSaveDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary-glow/10">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => onNavigate('dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-primary to-primary-glow p-2 rounded-lg">
                  <Palette className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Design Studio</h1>
                  <p className="text-sm text-muted-foreground">Create your textile patterns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          {/* Canvas Area */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>Pattern Canvas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PatternCanvas onSave={handleSavePattern} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Instructions */}
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">How to Use</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <p>Select tools from the toolbar to draw or add shapes</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <p>Choose colors and adjust brush size</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <p>Click "Save Pattern" when finished</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <p>Add metadata and save to your collection</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Design Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <p className="font-medium text-primary mb-1">Pattern Repetition</p>
                    <p className="text-xs">Create seamless patterns by considering how your design will tile</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <p className="font-medium text-primary mb-1">Color Harmony</p>
                    <p className="text-xs">Use complementary colors for striking designs or analogous colors for harmony</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <p className="font-medium text-primary mb-1">Scale Matters</p>
                    <p className="text-xs">Consider how your pattern will look at different sizes on various textiles</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onNavigate('gallery')}
                >
                  View Gallery
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onNavigate('dashboard')}
                >
                  My Patterns
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Save Pattern Dialog */}
      <SavePatternDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        canvasData={currentCanvasData}
      />
    </div>
  );
};