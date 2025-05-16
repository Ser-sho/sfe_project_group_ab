export const ITEM_PER_PAGE = 10

type RouteAccessMap = {
  [key: string]: string[];
};
// we need to add Room bookings ...

export const routeAccessMap: RouteAccessMap = {
  "/admin(.*)": ["admin"],
  "/student(.*)": ["student"],
  "/lecturer(.*)": ["lecturer"],
  "/parent(.*)": ["parent"],
  "/list/lecturers": ["admin", "lecturer"],
  "/list/students": ["admin", "lecturer"],
  "/list/parents": ["admin", "lecturer"],
  "/list/subjects": ["admin"],
  "/list/classes": ["admin", "lecturer"],
  "/list/issues": ["admin", "lecturer", "student", "parent"],
  "/list/exams": ["admin", "lecturer", "student", "parent"],
  "/list/assignments": ["admin", "lecturer", "student", "parent"],
  "/list/results": ["admin", "lecturer", "student", "parent"],
  "/list/attendance": ["admin", "lecturer", "student", "parent"],
  "/list/rooms": ["admin", "lecturer", "student", "parent"],
  "/list/announcements": ["admin", "lecturer", "student", "parent"],
};