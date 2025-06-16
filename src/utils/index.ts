import { CourseType, UserCourseBindingType, UserType } from '../types/courses';
import { ViewUserModel } from '../features/users/models/ViewUserModel';
import { ViewCourseModel } from '../features/courses/models/ViewCourseModel';
import { ViewUserCourseBindingModel } from '../features/users-courses-bindings/models/ViewUserCourseBindingModel';

export const getViewCourseModel = (dbCourse: CourseType): ViewCourseModel =>  {
  return {
    id: dbCourse.id,
    title: dbCourse.title,
  }
}

export const getViewUserModel = (dbCourse: UserType): ViewUserModel =>  {
  return {
    id: dbCourse.id,
    userName: dbCourse.userName,
  }
}

export const getViewUserCourseBindingModel = (dbBinding: UserCourseBindingType, user: UserType, course: CourseType): ViewUserCourseBindingModel =>  {
  return {
    userId: dbBinding.userId,
    courseId: dbBinding.courseId,
    courseTitle: course.title,
    userName: user.userName,
  }
}
