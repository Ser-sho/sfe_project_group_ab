import prisma from "@/lib/prisma";

const RoomList = async ({ dateParam }: { dateParam: string | undefined }) => {
  const date = dateParam ? new Date(dateParam) : new Date();

  const data = await prisma.room.findMany({
    where: {
      startTime: { 
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      },
    },
  });

  return data.map((room) => (
    <div
      className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
      key={room.id}
    >
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-gray-600">{room.title}</h1>
        <span className="text-gray-300 text-xs">
          {room.startTime.toLocaleTimeString("en-UK", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </span>
      </div>
      <p className="mt-2 text-gray-400 text-sm">{room.description}</p>
    </div>
  ));
};

export default RoomList;
{/**/}