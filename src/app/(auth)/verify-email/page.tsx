import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { verifyEmailToken } from "@/modules/auth/service";

export default async function VerifyEmailPage({
  searchParams,
}: PageProps<"/verify-email">) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : undefined;

  const result = token ? await verifyEmailToken(token) : { success: false };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{result.success ? "Email verified" : "Verification failed"}</CardTitle>
        <CardDescription>
          {result.success
            ? "Your email address has been confirmed."
            : "This verification link is invalid or has expired."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button render={<Link href={result.success ? "/dashboard" : "/login"} />} className="w-full">
          {result.success ? "Go to dashboard" : "Back to sign in"}
        </Button>
      </CardContent>
    </Card>
  );
}
