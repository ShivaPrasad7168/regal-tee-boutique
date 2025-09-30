import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SignupLoginPopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
}

const SignupLoginPopup: React.FC<SignupLoginPopupProps> = ({ open, onClose, onSubmit }) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.match(/^(\+?\d{10,}|[^@\s]+@[^@\s]+\.[^@\s]+)$/)) {
      setError("Please enter a valid mobile number or email.");
      return;
    }
    setError("");
    onSubmit(value);
    setValue("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle>Sign Up / Login</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Mobile number or Email"
            value={value}
            onChange={e => setValue(e.target.value)}
            required
            autoFocus
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <DialogFooter>
            <Button type="submit" variant="luxury" className="w-full">Continue</Button>
            <Button type="button" variant="outline" className="w-full mt-2" onClick={onClose}>Close</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignupLoginPopup;
