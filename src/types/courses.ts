export type Course = {
  id: number;
  title: string;
};

export type CourseQuery = { title?: string };

export type CourseParams = { id: string };

export type CourseBody = { title: string };
