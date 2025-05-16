import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import RoomCalendar from "@/components/RoomCalendar";
import { auth } from "@clerk/nextjs/server";
export const dynamic = "force-dynamic";
const LecturerPage = () => {
  const { userId } = auth();
  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Time Table</h1>
          <BigCalendarContainer type="lecturerId" id={userId!} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <RoomCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default LecturerPage;
{/**/}
