import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";

interface JoinClassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (inviteCode: string) => Promise<void>;
}

export const JoinClassModal = ({ open, onOpenChange, onSubmit }: JoinClassModalProps) => {
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    
    setIsLoading(true);
    try {
      await onSubmit(inviteCode.trim());
      onOpenChange(false);
      setInviteCode('');
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Join a Class</span>
          </DialogTitle>
          <DialogDescription>
            Enter the invite code provided by your teacher to join their class.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inviteCode">Invite Code</Label>
            <Input
              id="inviteCode"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-digit code (e.g., ABC123)"
              className="text-center text-lg tracking-wider font-mono"
              maxLength={6}
              required
            />
            <p className="text-xs text-muted-foreground">
              Ask your teacher for the 6-digit class invite code.
            </p>
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
            <Button type="submit" disabled={isLoading || !inviteCode.trim()}>
              {isLoading ? 'Joining...' : 'Join Class'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};