"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { responses } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function submitResponse(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const answer = formData.get("answer") as string;
  if (!answer?.trim()) return;

  const question = "What is your favourite hobby?";
  const existing = await db
    .select()
    .from(responses)
    .where(
      and(eq(responses.userId, session.user.id), eq(responses.question, question))
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(responses)
      .set({ answer: answer.trim() })
      .where(eq(responses.id, existing[0].id));
  } else {
    await db.insert(responses).values({
      userId: session.user.id,
      question,
      answer: answer.trim(),
    });
  }

  revalidatePath("/dashboard");
}
