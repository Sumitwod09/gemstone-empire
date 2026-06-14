"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileFormData } from "@/lib/validators";
import { Input, Button } from "@/components/ui";
import { toast } from "sonner";
import { useState } from "react";
import type { Profile } from "@/types";

interface AccountProfileFormProps {
  profile: Profile;
  email: string;
}

export function AccountProfileForm({ profile, email }: AccountProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile.full_name ?? "",
      phone: profile.phone ?? "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-md">
      <Input label="Full Name" {...register("full_name")} error={errors.full_name?.message} />
      <Input label="Email" value={email} readOnly disabled className="opacity-60" />
      <Input label="Phone (optional)" type="tel" {...register("phone")} />
      <Button type="submit" loading={loading} className="self-start">
        Save Changes
      </Button>
    </form>
  );
}
