import data
import scheduler1o0
import scheduler1o1
from .fitness import *
slot_pref = {
        1: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 1, 2, 4, 5, 7, 8, 10, 11, 13, 14, 16, 17, 19, 20, 22, 23, 25, 26, 28, 29],
        2: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 2, 5, 8, 11, 14, 17, 20, 23, 26, 29],
        3: [4, 10, 16, 22, 28, 1, 7, 13, 19, 25]
    }

courses_file="..\\Databases\\course_data1.xlsx"
faculty_data="..\\Databases\\teacher_data.xlsx"
room_data="..\\Databases\\room_data.xlsx"
division_data="..\\Databases\\section_data.xlsx"
routine_path="..\\Databases\\routine.xlsx"

course=data.Course(courses_file)

l1=[]
l2=[]
for i in range(50):
    resources=data.Resources(teacher_data_file=faculty_data,
                             room_data_file=room_data,
                             division_data_file=division_data)



    schedule=scheduler1o0.Scheduler(lectures=course.lectures,
                                 slot_pref_list=slot_pref,
                                 course_data=course,
                                 resource_data=resources)

    fn= Evaluator(resources)
    l1.append(fn.faculty_conflict*100)

    resources = data.Resources(teacher_data_file=faculty_data,
                               room_data_file=room_data,
                               division_data_file=division_data)

    schedule = scheduler1o1.Scheduler(lectures=course.lectures,
                                      slot_pref_list=slot_pref,
                                      course_data=course,
                                      resource_data=resources)

    fn = Evaluator(resources)
    l2.append(fn.faculty_conflict * 100)

print("1o0: ",sum(l1)/len(l1))
print("1o1: ",sum(l2)/len(l2))
