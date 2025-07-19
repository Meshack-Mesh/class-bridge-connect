import { useState } from "react";
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
import { ClassFormData } from "@/types";
import { Plus, Trash2 } from "lucide-react";

interface CreateClassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ClassFormData) => Promise<void>;
  initialData?: Partial<ClassFormData>;
  isEditing?: boolean;
}

const classColors = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
];

const dayOptions = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export const CreateClassModal = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData,
  isEditing = false 
}: CreateClassModalProps) => {
  const [formData, setFormData] = useState<ClassFormData>({
    name: initialData?.name || '',
    subject: initialData?.subject || '',
    description: initialData?.description || '',
    color: initialData?.color || classColors[0],
    schedule: initialData?.schedule || []
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSubmit(formData);
      onOpenChange(false);
      // Reset form if creating new class
      if (!isEditing) {
        setFormData({
          name: '',
          subject: '',
          description: '',
          color: classColors[0],
          schedule: []
        });
      }
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsLoading(false);
    }
  };

  const addScheduleSlot = () => {
    setFormData(prev => ({
      ...prev,
      schedule: [...(prev.schedule || []), { day: 'Monday', time: '09:00' }]
    }));
  };

  const removeScheduleSlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule?.filter((_, i) => i !== index) || []
    }));
  };

  const updateScheduleSlot = (index: number, field: 'day' | 'time', value: string) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule?.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      ) || []
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-background">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Class' : 'Create New Class'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update your class information and settings.'
              : 'Set up a new class for your students to join.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Class Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Mathematics 101"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Mathematics"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of what this class covers..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Class Color</Label>
            <div className="flex flex-wrap gap-2">
              {classColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    formData.color === color 
                      ? 'border-foreground scale-110' 
                      : 'border-muted hover:border-foreground/50'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Schedule (Optional)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addScheduleSlot}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Time Slot
              </Button>
            </div>
            
            {formData.schedule?.map((slot, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Select 
                  value={slot.day} 
                  onValueChange={(value) => updateScheduleSlot(index, 'day', value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dayOptions.map(day => (
                      <SelectItem key={day} value={day}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  type="time"
                  value={slot.time}
                  onChange={(e) => updateScheduleSlot(index, 'time', e.target.value)}
                  className="w-[120px]"
                />
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeScheduleSlot(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
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
            <Button type="submit" disabled={isLoading}>
              {isLoading 
                ? (isEditing ? 'Updating...' : 'Creating...') 
                : (isEditing ? 'Update Class' : 'Create Class')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};