export type CourseType = {
  id: number;
  title: string;
  studentsCount: number;
};

export type UserType = {
  id: number;
  userName: string;
};

export type UserCourseBindingType = {
  userId: number;
  courseId: number;
  date: Date;
};

