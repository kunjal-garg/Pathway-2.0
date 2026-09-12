import { prisma } from "./prisma";

export async function logActivity(studentId: string, text: string) {
  return prisma.activityLogEntry.create({
    data: { studentId, text },
  });
}
