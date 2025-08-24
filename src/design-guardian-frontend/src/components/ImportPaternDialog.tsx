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
import { useSession  } from '../context/sessionContext';
import FileUploadButton from './FileUploadButton';
import {blobToImageUrl } from '../utils/imageManager'
import { File as FileDesign} from '../declarations/main/main.did'

interface ImportPatternDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getKind = (designType: string) => {
  switch (designType) {
    case 'footwear': return { 'Footwear' : null };
    case 'clothing': return { 'Clothing' : null };
    case 'accessories': return { 'Accessories' : null };
    case 'textile-printing': return {'TextilePrinting' : null };
    default: return { 'Clothing' : null }
  }
};

export const ImportPatternDialog = ({ open, onOpenChange }: ImportPatternDialogProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [designType, setDesignType] = useState('');
  const [visible3DRendering, setVisible3DRendering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null)

  const { backend } = useSession();

  const designTypes = [
    { value: 'footwear', label: 'Footwear' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'textile-printing', label: 'Textile Printing' },
  ];

  async function fileConversion(file: File): Promise<FileDesign> {
    console.log(file)
    console.log(file.name)
    if (!file.name.endsWith(".glb")) {
      throw new Error("The file is not a valid GLB");
    }
    const arrayBuffer = await file.arrayBuffer();
    const name = file.name;
    const mimeType = 'data:image/glb;base64';
    return {data: new Uint8Array(arrayBuffer), name, mimeType};
  }

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
      const fileConverted = await fileConversion(file)
      await new Promise(resolve => setTimeout(resolve, 1000));
      const pattern = {
        name: name.trim(),
        description: description.trim(),
        kind: getKind(designType),
        visible3DRendering,
        sourceFiles: [fileConverted] as FileDesign[],
        coverImage: {data: [] , name: "", mimeType: ''} as FileDesign,
      };
      

      const response = await backend.createDesign(pattern)
      if("Ok" in response) {
        toast.success('Pattern saved successfully! ' + Number(response.Ok)).toString();
      }

      setName('');
      setDescription('');
      setDesignType('');
      setVisible3DRendering(false);
      onOpenChange(false);
    } catch (error) {
      console.log(error)
      toast.error('Failed to save pattern');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className='flex-row items-center items-baseline justify-evenly'>
          <DialogTitle className="flex items-center space-x-2 mb-4">
            <div className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Import Pattern
            </div>
          </DialogTitle>

          <FileUploadButton onFileSelect = {setFile}/>
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
              checked={visible3DRendering}
              onCheckedChange={(checked) => setVisible3DRendering(checked as boolean)}
            />
            <Label htmlFor="privacy" className="text-sm">
              Make 3D rendering private
            </Label>
          </div>

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