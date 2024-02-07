import db from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs";
import { ActivityLogs } from "@prisma/client";

export const createActivityLogs = async ({
  actionType,
  entityId,
  entityTitle,
  entityType,
}: ActivityLogs) => {
  const { orgId } = auth();
  const user = await currentUser();
  if (!orgId || !user) {
    throw new Error("unauthorized");
  }

  try {
    const activityLogs = await db.activityLogs.create({
      data: {
        userId: user.id,
        userName: `${user.firstName} - ${user.lastName}`,
        userImage: user.imageUrl,
        orgId,
        entityId,
        entityTitle,
        entityType,
        actionType,
      },
    });
    return { success: true, message: "Activity Done", results: activityLogs }
  } catch (error) {
    return { success: false, message: "Failed to create activity", }

  }
};
