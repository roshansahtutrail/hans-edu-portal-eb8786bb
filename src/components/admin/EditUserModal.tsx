import { useState } from "react";
import { X, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserWithRole } from "@/hooks/useSupabaseData";

interface EditUserModalProps {
  user: UserWithRole;
  onClose: () => void;
  onUpdate: () => void;
}

export const EditUserModal = ({ user, onClose, onUpdate }: EditUserModalProps) => {
  const [formData, setFormData] = useState({
    fullName: user.full_name,
    email: user.email,
    newPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Update profile (name and email in profiles table)
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
          email: formData.email,
        })
        .eq("user_id", user.user_id);

      if (profileError) throw profileError;

      // If password is provided, update via edge function
      if (formData.newPassword.trim()) {
        if (formData.newPassword.length < 6) {
          toast({ 
            title: "Error", 
            description: "Password must be at least 6 characters.", 
            variant: "destructive" 
          });
          setIsSubmitting(false);
          return;
        }

        const session = await supabase.auth.getSession();
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-user`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${session.data.session?.access_token}`,
            },
            body: JSON.stringify({
              userId: user.user_id,
              email: formData.email,
              password: formData.newPassword,
            }),
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to update password");
        }
      }

      toast({ title: "User Updated", description: `User ${formData.fullName} has been updated.` });
      onUpdate();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update user";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl p-6 w-full max-w-md animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-heading font-bold text-foreground">Edit User</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-foreground mb-2 block">Full Name *</label>
            <Input
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="text-sm text-foreground mb-2 block">Email *</label>
            <Input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="text-sm text-foreground mb-2 block">
              New Password <span className="text-muted-foreground">(leave empty to keep current)</span>
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update User"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
