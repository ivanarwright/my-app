import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserNav } from "@/components/user-nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const user = session.user;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">My App</h1>
          <UserNav />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <Card className="max-w-lg mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
                <AvatarFallback className="text-2xl">
                  {user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">
              Welcome, {user.name ?? "User"}!
            </CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            <p>You&apos;re signed in. This is your dashboard.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
