"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { measurements, clothingSizes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function saveMeasurements(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const height = parseFloat(formData.get("height") as string) || null;
  const waist = parseFloat(formData.get("waist") as string) || null;
  const torso = parseFloat(formData.get("torso") as string) || null;
  const hips = parseFloat(formData.get("hips") as string) || null;

  const existing = await db
    .select()
    .from(measurements)
    .where(eq(measurements.userId, session.user.id))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(measurements)
      .set({ height, waist, torso, hips, updatedAt: new Date() })
      .where(eq(measurements.userId, session.user.id));
  } else {
    await db.insert(measurements).values({
      userId: session.user.id,
      height,
      waist,
      torso,
      hips,
    });
  }

  revalidatePath("/dashboard");
}

export async function saveClothingSizes(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const tops = (formData.get("tops") as string) || null;
  const bottoms = (formData.get("bottoms") as string) || null;
  const coats = (formData.get("coats") as string) || null;
  const shoeLeft = parseFloat(formData.get("shoeLeft") as string) || null;
  const shoeRight = parseFloat(formData.get("shoeRight") as string) || null;

  const existing = await db
    .select()
    .from(clothingSizes)
    .where(eq(clothingSizes.userId, session.user.id))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(clothingSizes)
      .set({ tops, bottoms, coats, shoeLeft, shoeRight, updatedAt: new Date() })
      .where(eq(clothingSizes.userId, session.user.id));
  } else {
    await db.insert(clothingSizes).values({
      userId: session.user.id,
      tops,
      bottoms,
      coats,
      shoeLeft,
      shoeRight,
    });
  }

  revalidatePath("/dashboard");
}
