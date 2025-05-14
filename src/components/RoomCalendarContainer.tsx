import Image from "next/image";
import RoomCalendar from "./RoomCalendar";
import RoomList from "./RoomList";

const RoomCalendarContainer = async ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  const { date } = searchParams;
  return (
    <div className="bg-white p-4 rounded-md">
      <RoomCalendar />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Rooms</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4">
        <RoomList dateParam={date} />
      </div>
    </div>
  );
};

export default RoomCalendarContainer;
{/**/}