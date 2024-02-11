import db from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ENTITY_TYPE } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  try {
    const cardId = params.cardId;
    
    const { orgId, userId } = auth();
    if (!orgId || !userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const activity = await db.activityLogs.findMany({
      where: {
        orgId,
        entityId: cardId,
        entityType: ENTITY_TYPE.CARD,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    });

    return NextResponse.json(activity, { status: 200 });
  } catch (error) {
    return new NextResponse("internal server error", { status: 500 });
  }
}
