import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
  {
    title: "MENU",
    items: [
      // Removed static Home entry here
      {
        icon: "/teacher.png",
        label: "Lectures",
        href: "/list/lecturers",
        visible: ["admin", "lecturer"],
      },
      {
        icon: "/student.png",
        label: "Students",
        href: "/list/students",
        visible: ["admin", "lecturer"],
      },
      {
        icon: "/subject.png",
        label: "Subjects",
        href: "/list/subjects",
        visible: ["admin"],
      },
      {
        icon: "/subject.png",
        label: "Issues",
        href: "/list/issues",
        visible: ["admin", "lecturer", "student", "parent"],
      },
      {
        icon: "/class.png",
        label: "Classes",
        href: "/list/classes",
        visible: ["admin", "lecturer"],
      },
      {
        icon: "/lesson.png",
        label: "Lessons",
        href: "/list/lessons",
        visible: ["admin", "lecturer"],
      },
      {
        icon: "/exam.png",
        label: "Exams",
        href: "/list/exams",
        visible: ["admin", "lecturer", "student", "parent"],
      },
      {
        icon: "/assignment.png",
        label: "Assignments",
        href: "/list/assignments",
        visible: ["admin", "lecturer", "student", "parent"],
      },
      {
        icon: "/result.png",
        label: "Results",
        href: "/list/results",
        visible: ["admin", "lecturer", "student", "parent"],
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
        href: "/list/attendance",
        visible: ["admin", "lecturer", "student", "parent"],
      },
      {
        icon: "/calendar.png",
        label: "Room Booking",
        href: "/list/rooms",
        visible: ["admin", "lecturer", "student", "parent"],
      },
      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "/list/announcements",
        visible: ["admin", "lecturer", "student", "parent"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "lecturer", "student", "parent"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "lecturer", "student", "parent"],
      },
    ],
  },
];

const Menu = async () => {
  let role = "";
  try {
    const user = await currentUser();
    role = (user?.publicMetadata?.role as string) || "";
  } catch (error) {
    console.error("Error loading user in menu:", error);
  }

  const homeHref = role ? `/${role}` : "/";
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {section.title}
          </span>

          {/* Dynamically inject "Home" link in MENU section */}
          {section.title === "MENU" && (
            <Link
              href={homeHref}
              className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
            >
              <Image src="/home.png" alt="" width={20} height={20} />
              <span className="hidden lg:block">Home</span>
            </Link>
          )}

          {section.items.map((item) => {
            if (!item.visible.includes(role)) return null;

            return (
              <Link
                href={item.href}
                key={item.label}
                className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
              >
                <Image src={item.icon} alt="" width={20} height={20} />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
