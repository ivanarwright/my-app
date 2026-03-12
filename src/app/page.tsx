import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SignInButton } from "@/components/sign-in-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Home() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold">My App</CardTitle>
          <CardDescription className="text-base">
            Your personal web form builder. Sign in to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-8">
          <SignInButton />
        </CardContent>
      </Card>
    </div>
  );
}
