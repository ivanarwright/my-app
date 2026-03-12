import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { responses } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { UserNav } from "@/components/user-nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { submitResponse } from "./actions";

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const user = session.user;

  const hobbyResults = await db
    .select()
    .from(responses)
    .where(
      and(
        eq(responses.userId, user.id!),
        eq(responses.question, "What is your favourite hobby?")
      )
    )
    .orderBy(desc(responses.createdAt))
    .limit(1);

  const hobbyResponse = hobbyResults[0] ?? null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">My App</h1>
          <UserNav />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 space-y-6">
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
        </Card>

        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>What is your favourite hobby?</CardTitle>
            {hobbyResponse && (
              <CardDescription>
                Your answer: {hobbyResponse.answer}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <form action={submitResponse} className="flex gap-2">
              <input
                type="text"
                name="answer"
                placeholder="Enter your answer..."
                defaultValue={hobbyResponse?.answer ?? ""}
                required
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button type="submit">
                {hobbyResponse ? "Update" : "Submit"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
