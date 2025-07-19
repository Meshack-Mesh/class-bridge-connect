import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AssignmentFormData, Class } from "@/types";
import { FileText, Upload, X } from "lucide-react";
import { format } from "date-fns";

interface CreateAssignmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AssignmentFormData) => Promise<void>;
  classes: Class[];
  initialData?: Partial<AssignmentFormData>;
  isEditing?: boolean;
}

export const CreateAssignmentModal = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  classes,
  initialData,
  isEditing = false 
}: CreateAssignmentModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<AssignmentFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    instructions: initialData?.instructions || '',
    classId: initialData?.classId || '',
    dueDate: initialData?.dueDate || format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm"),
    maxGrade: initialData?.maxGrade || 100,
    attachments: []
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSubmit(formData);
      onOpenChange(false);
      // Reset form if creating new assignment
      if (!isEditing) {
        setFormData({
          title: '',
          description: '',
          instructions: '',
          classId: '',
          dueDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm"),
          maxGrade: 100,
          attachments: []
        });
      }
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...files]
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index) || []
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-background max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Assignment' : 'Create New Assignment'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update your assignment details and requirements.'
              : 'Create a new assignment for your students to complete.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Assignment Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Math Problem Set 1"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select 
                value={formData.classId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, classId: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(classItem => (
                    <SelectItem key={classItem._id} value={classItem._id}>
                      {classItem.name} ({classItem.subject})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the assignment..."
              rows={3}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instructions">Detailed Instructions (Optional)</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="Detailed instructions for students on how to complete the assignment..."
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date & Time</Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxGrade">Maximum Grade</Label>
              <Input
                id="maxGrade"
                type="number"
                min="1"
                max="1000"
                value={formData.maxGrade}
                onChange={(e) => setFormData(prev => ({ ...prev, maxGrade: parseInt(e.target.value) }))}
                required
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>Attachments (Optional)</Label>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Add Files
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
            />
            
            {formData.attachments && formData.attachments.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {formData.attachments.length} file(s) selected:
                </p>
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.classId}>
              {isLoading 
                ? (isEditing ? 'Updating...' : 'Creating...') 
                : (isEditing ? 'Update Assignment' : 'Create Assignment')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};