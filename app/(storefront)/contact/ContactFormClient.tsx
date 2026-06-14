"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/lib/validators";
import { Input, Textarea, Button } from "@/components/ui";
import { toast } from "sonner";
import { useState } from "react";

export function ContactFormClient() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setSent(true);
      reset();
      toast.success("Message sent! We'll be in touch soon.");
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
          Message received!
        </p>
        <p className="text-sm text-[var(--color-text-secondary)] mb-4">
          Thank you for reaching out. We'll respond within 24 hours.
        </p>
        <Button variant="secondary" onClick={() => setSent(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Full Name"
        {...register("full_name")}
        error={errors.full_name?.message}
      />
      <Input
        label="Email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <Input
        label="Phone (optional)"
        type="tel"
        {...register("phone")}
      />
      <Textarea
        label="Message"
        rows={5}
        {...register("message")}
        error={errors.message?.message}
        placeholder="How can we help you?"
      />
      <Button type="submit" loading={loading}>
        Send Message
      </Button>
    </form>
  );
}
