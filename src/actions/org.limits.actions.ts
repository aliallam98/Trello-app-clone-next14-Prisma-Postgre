"use server";

import { MAX_FREE_BOARDS } from "@/constants/boardCount";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs";

export const getAvailableCount = async () => {
  try {
    const { orgId } = auth();

    if (!orgId) {
      throw new Error("unauthorized");
    }

    const orgLimit = await db.orgLimits.findUnique({
      where: { orgId },
    });

    if (!orgLimit) {
      return 0;
    }

    return orgLimit.count
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const hasAvailableCount = async () => {
  const { orgId } = auth();
  if (!orgId) {
    throw new Error("unauthorized");
  }

  const orgLimit = await db.orgLimits.findUnique({
    where: { orgId },
  });

  if (!orgLimit || orgLimit.count < MAX_FREE_BOARDS) {
    return true;
  } else {
    return false;
  }
};

export const incrementAvailableCount = async () => {
  const { orgId } = auth();
  if (!orgId) {
    throw new Error("unauthorized");
  }

  const orgLimit = await db.orgLimits.findUnique({
    where: { orgId },
  });

  if (orgLimit) {
    await db.orgLimits.update({
      where: { orgId },
      data: {
        count: orgLimit.count + 1,
      },
    });
  } else {
    await db.orgLimits.create({
      data: {
        orgId,
        count: 1,
      },
    });
  }
};

export const decrementAvailableCount = async () => {
  const { orgId } = auth();
  if (!orgId) {
    throw new Error("unauthorized");
  }

  const orgLimit = await db.orgLimits.findUnique({
    where: { orgId },
  });

  if (orgLimit && orgLimit.count > 0) {
    await db.orgLimits.update({
      where: { orgId },
      data: {
        count: orgLimit.count - 1,
      },
    });
  } else {
    await db.orgLimits.create({
      data: {
        orgId,
        count: 1,
      },
    });
  }
};
