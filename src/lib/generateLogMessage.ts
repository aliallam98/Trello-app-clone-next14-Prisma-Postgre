import { ActivityLogs, ACTIONS_TYPE } from "@prisma/client";

export const generateLogMessage = (log: ActivityLogs) => {
  const { actionType, entityTitle, entityType } = log;

  switch (actionType) {
    case ACTIONS_TYPE.CREATE:
      return `created ${entityType.toLowerCase()} "${entityTitle}"`;
    case ACTIONS_TYPE.UPDATE:
      return `updated ${entityType.toLowerCase()} "${entityTitle}"`;
    case ACTIONS_TYPE.DELETE:
      return `deleted ${entityType.toLowerCase()} "${entityTitle}"`;
    default:
      return `unknown action ${entityType.toLowerCase()} "${entityTitle}"`;
  };
};
