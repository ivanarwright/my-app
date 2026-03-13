import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { measurements, clothingSizes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { UserNav } from "@/components/user-nav";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MeasurementConverter } from "@/components/measurement-converter";
import { ClothingSizes } from "@/components/clothing-sizes";

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const user = session.user;

  const [measurementRows, clothingRows] = await Promise.all([
    db
      .select()
      .from(measurements)
      .where(eq(measurements.userId, user.id!))
      .limit(1),
    db
      .select()
      .from(clothingSizes)
      .where(eq(clothingSizes.userId, user.id!))
      .limit(1),
  ]);

  const m = measurementRows[0];
  const savedMeasurements = {
    height: m?.height ?? null,
    waist: m?.waist ?? null,
    torso: m?.torso ?? null,
    hips: m?.hips ?? null,
  };

  const c = clothingRows[0];
  const savedClothing = {
    tops: c?.tops ?? null,
    bottoms: c?.bottoms ?? null,
    coats: c?.coats ?? null,
    shoeLeft: c?.shoeLeft ?? null,
    shoeRight: c?.shoeRight ?? null,
  };

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

        <MeasurementConverter saved={savedMeasurements} />
        <ClothingSizes saved={savedClothing} />
      </main>
    </div>
  );
}
