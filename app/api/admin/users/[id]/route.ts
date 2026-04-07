import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserStatus } from "@prisma/client";

// ── PATCH — update status ─────────────────────────────────────────────────────
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body   = await req.json();
  const status = body.status as UserStatus;

  const validStatuses: UserStatus[] = ["APPROVED", "REJECTED", "PENDING"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  if (params.id === session.user.id) {
    return NextResponse.json(
      { error: "You cannot change your own status" },
      { status: 400 }
    );
  }

  const user = await prisma.user.update({
    where: { id: params.id },
    data:  { status },
    select: { id: true, email: true, status: true },
  });

  return NextResponse.json(user);
}

// ── DELETE — remove user ──────────────────────────────────────────────────────
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (params.id === session.user.id) {
    return NextResponse.json(
      { error: "You cannot delete your own account" },
      { status: 400 }
    );
  }

  await prisma.user.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ ok: true });
}
