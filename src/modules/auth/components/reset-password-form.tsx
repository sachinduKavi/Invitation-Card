"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { resetPasswordAction } from "@/modules/auth/actions";

const formSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

type FormInput = z.infer<typeof formSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "" },
  });

  async function onSubmit(data: FormInput) {
    const result = await resetPasswordAction({ token, password: data.password });
    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Password updated. Please sign in.");
    router.push("/login");
  }

  if (!token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invalid link</CardTitle>
          <CardDescription>This password reset link is missing or malformed.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set a new password</CardTitle>
        <CardDescription>Choose a strong password for your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">New password</FieldLabel>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register("password")}
              />
              <FieldError errors={[errors.password]} />
            </Field>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Updating..." : "Update password"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
