import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface SavePatternDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canvasData: string;
}

export const SavePatternDialog = ({ open, onOpenChange, canvasData }: SavePatternDialogProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [designType, setDesignType] = useState('');
  const [isPrivate3D, setIsPrivate3D] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const designTypes = [
    { value: 'footwear', label: 'Footwear' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'textile-printing', label: 'Textile Printing' },
  ];

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Please enter a pattern name');
      return;
    }

    if (!designType) {
      toast.error('Please select a design type');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate saving the pattern
      await new Promise(resolve => setTimeout(resolve, 1000));

      const pattern = {
        id: Date.now().toString(),
        name: name.trim(),
        description: description.trim(),
        designType,
        isPrivate3D,
        canvasData,
        createdAt: new Date().toISOString(),
      };

      // Store in localStorage for now (in real app, this would be saved to backend)
      const savedPatterns = JSON.parse(localStorage.getItem('savedPatterns') || '[]');
      savedPatterns.push(pattern);
      localStorage.setItem('savedPatterns', JSON.stringify(savedPatterns));

      toast.success('Pattern saved successfully!');
      
      // Reset form
      setName('');
      setDescription('');
      setDesignType('');
      setIsPrivate3D(false);
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save pattern');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Save Pattern
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Pattern Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Pattern Name *</Label>
            <Input
              id="name"
              placeholder="Enter pattern name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your pattern..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Design Type */}
          <div className="space-y-2">
            <Label htmlFor="design-type">Design Type *</Label>
            <Select value={designType} onValueChange={setDesignType}>
              <SelectTrigger>
                <SelectValue placeholder="Select design type" />
              </SelectTrigger>
              <SelectContent>
                {designTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Privacy Setting */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="privacy"
              checked={isPrivate3D}
              onCheckedChange={(checked) => setIsPrivate3D(checked as boolean)}
            />
            <Label htmlFor="privacy" className="text-sm">
              Make 3D rendering private
            </Label>
          </div>

          {/* Preview */}
          {canvasData && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="border rounded-lg p-2 bg-muted">
                <img
                  src={canvasData}
                  alt="Pattern preview"
                  className="w-full h-32 object-cover rounded"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Pattern'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};