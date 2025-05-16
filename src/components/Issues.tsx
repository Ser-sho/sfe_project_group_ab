import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const Issues = async () => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const roleConditions = {
    lecturer: { lecturerId: userId! },
    student: { studentId: userId! },
  };

  const data = await prisma.issue.findMany({
    take: 3, // Show latest 3 issues
    orderBy: { createdAt: "desc" },
    where: {
      ...(role !== "admin" && {
        OR: [roleConditions[role as keyof typeof roleConditions] || {}],
      }),
    },
  });

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Reported Issues</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {data.map((issue, index) => (
          <div key={issue.id} className={`p-4 rounded-md ${index % 2 === 0 ? "bg-lamaSkyLight" : "bg-lamaPurpleLight"}`}>
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{issue.title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(issue.createdAt)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{issue.description}</p>
            <span className={`text-xs px-2 py-1 rounded-md ${issue.status === "PENDING" ? "bg-red-400 text-white" : "bg-green-400 text-white"}`}>
              {issue.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Issues;