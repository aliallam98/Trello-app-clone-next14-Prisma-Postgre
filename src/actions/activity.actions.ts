import db from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs";
import { ACTIONS_TYPE, ENTITY_TYPE } from "@prisma/client";
import { redirect } from "next/navigation";



interface IProps {
  entityId: string;
  entityType: ENTITY_TYPE,
  entityTitle: string;
  actionType: ACTIONS_TYPE;
};
export const createActivityLogs = async ({
  actionType,
  entityId,
  entityTitle,
  entityType,
}: IProps) => {
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


export const getAllOrgActivities = async()=>{
  const {orgId} = auth()
  if(!orgId){
    return redirect("select-org")
  }

  const activities = await db.activityLogs.findMany({
    where:{
      orgId
    },
    orderBy:{
      createdAt:"desc"
    }
  })

  return activities
}