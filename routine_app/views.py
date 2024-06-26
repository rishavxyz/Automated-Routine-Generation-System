# backend_app/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .data import Course, Resources, Times
from .serializers import FileSerializer
from .scheduler1o1 import Scheduler
import json
from .fitness import *
import pandas as pd
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from .setPreferrence import resourcePrefUpdate
#from django.http import JsonResponse


class SlotAPIView(APIView):
    def post(self, request):
        #data = json.loads(request.body)
        #print(request.body)
        #print(data)
        course_data = request.FILES['courseFile']
        slots_per_day = int(request.data.get('slotsPerDay'))
        print(slots_per_day)
        break_after = int(request.data.get('breakAfter'))
        print(break_after)
        weeklyholiday = request.POST.getlist('weeklyHoliday')
        #weekly_holiday = weeklyholiday.strip('][').split(', ')
        weeklyholiday = weeklyholiday[0].split(',')
        #print(weeklyholiday[0:3])
        weekly_holiday = []
        for i in range(7):
            if weeklyholiday[i] == "true" or weeklyholiday[i] == "[true" or weeklyholiday[i] == "true]":
                weekly_holiday.append(i)

        print(weekly_holiday)
        '''
        slots_per_day = request.POST.get('slotsPerDay')
        if slots_per_day is None:
            return JsonResponse({"error": "slotsPerDay is missing in the form data"}, status=400)
        '''
        #break_after = request.POST.get('breakAfter')
        #weekly_holiday = request.POST.get('weeklyHoliday')

        course_details = Course(course_data)

        times= Times(slots_per_day,break_after,weekly_holiday)
        times.create_slot_pref(slot_durations=course_details.lecture_durations)
        #print(slot_pref)
        print(times.slot_pref)
        return Response(times.slot_pref)

class CsrfView(APIView):
    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        csrf_token = get_token(request)
        return Response({'csrfToken': csrf_token})

class RoutineGenerationAPIView(APIView):
    def post(self, request):
        # print("input:" , request.data)
        serializer = FileSerializer(data=request.data)
        if serializer.is_valid():
            input_data = serializer.validated_data
            routine_path = "C:/Users/Shirso/OneDrive/Desktop/Final YR Proj/RoutineGeneration/routine_app/routines.xlsx"
            # Call your algorithm function
            '''
            courses_details="routine_app/Databases/course_data.xlsx"
            faculty_details="routine_app//Databases/teacher_data.xlsx"
            room_details="routine_app//Databases/room_data.xlsx"
            division_data="routine_app//Databases/section_data.xlsx"
            '''
            routine_path="routine_app//Databases/routine.xlsx"
            
            courses_details = input_data['courseFile']
            faculty_details = input_data['facultyFile']
            room_details = input_data['sectionFile']
            division_data = input_data['roomFile']
            slots_per_day = int(request.data.get('slotsPerDay'))
            slot_pref = json.loads(request.data.get('slot_pref'))
            slot_pref = {int(k): v for k, v in slot_pref.items()}
            print(slot_pref)
            #slot_preference = json.loads(request.POST.get('slot_pref'))
            #print(slot_preference)
            breakAfter= int(request.data.get('breakAfter'))
            weeklyholiday = request.POST.getlist('weeklyHoliday')

           # slot_pref1 = int(request.data.get('1'))
           # print(slot_pref1)
            weeklyholiday = weeklyholiday[0].split(',')
            print(weeklyholiday)
            weekly_holiday = []
            for i in range(7):
                if weeklyholiday[i] == "true":
                    weekly_holiday.append(i)
            #print(slots_per_day)
            #print(str(input_data))
            #no_of_days = input_data['no_of_days']
            #no_of_slots = input_data['no_of_slots']
            
            #faculty_data = pd.read_excel(faculty_details)
            #print(faculty_data)

            all_routines = {}
            teacher_data = {}
            course= Course(courses_details)
            faculty_df = pd.read_excel(faculty_details)
            #print(faculty_df['FACULTY_NAME'])
            extracted_faculty_df = faculty_df[['FACULTY_ID', 'FACULTY_NAME']]
            #print(extracted_faculty_df)
            for i, row in extracted_faculty_df.iterrows():
                #print(row['FACULTY_ID'])
                teacher_data[row['FACULTY_ID']] = row['FACULTY_NAME']
            
            #times= Times(slots_per_day,breakAfter,weekly_holiday)
            #times.create_slot_pref(slot_durations=course.lecture_durations)
            #print(times)
            for i in range(3):
                resources= Resources(teacher_data_file=faculty_details,
                                    room_data_file=room_details,
                                    division_data_file=division_data)
                #print(resources.Faculty_data)
                #resources.reset_resource_availability()
                
            
            
                schedule= Scheduler(lectures=course.lectures,
                                   course_data=course,
                                   resource_data=resources,
                                   slots_per_day=slots_per_day,slot_pref =  slot_pref)
                '''
                for row in resources.Faculty_data.itertuples():
                    s = str(row.SLOT_AVAILABILITY)
                    s = s.split('.')
                    for i in range(len(s)):
                        s[i] = bin(int(s[i], 16))[2:]
                    s = ''.join(s)
                    print(s.count('1'))'''
                #print(pd.read_excel(course.Lecture))
                #times.create_slot_pref(slot_durations=course.lecture_durations)
                
                fn= Evaluator(resources)
                print("Faculty's preference retained:",fn.faculty_conflict*100,"%")
                print("Room's preference retained:",fn.room_conflict*100,"%")
#print("Division's preference retained:",fitness.division_fitness*100,"%")

                #schedule.display()
#print(schedule.schedule)
                routines = schedule.save_schedule(routine_path, teacher_data)
                room_data, faculty_data,  section_data = schedule.getResources()
                room_slot = {}
                faculty_slot = {}
                section_slot = {}
                for _, row in room_data.iterrows():
                    room_slot.update({row['RESOURCE_ID']: row.drop('RESOURCE_ID').to_dict()})

                for _, row in faculty_data.iterrows():
                    faculty_slot.update({row['RESOURCE_ID']: row.drop('RESOURCE_ID').to_dict()})
                
                for _, row in section_data.iterrows():
                    section_slot.update({row['RESOURCE_ID']: row.drop('RESOURCE_ID').to_dict()})
                # room_slot = room_slot.to_dict(orient='records')
                # faculty_slot = faculty_slot.to_dict(orient='records')
                # section_slot = section_slot.to_dict(orient='records')
                routines['Faculty Fitness'] = str(fn.faculty_conflict*100) + "%"
                routines['Room Fitness'] = str(fn.room_conflict*100) + "%"
                routines["Total Slots"] = slots_per_day
                routines['RoomSLot'] = room_slot
                routines['FacultySLot'] = faculty_slot
                routines['SectionSLot'] = section_slot
                all_routines["Routine" + str(i)] = routines
                
                #print(resources.Faculty_data)
                #print(routines)
                
            
       
            #print(teacher_data)
        # Display the merged dataframe
            
            all_routines["Teacher Data"] = teacher_data
            print(routines)
            #json_str = json.dumps(all_routines, indent=None, separators=(", ", ": "))
            #print(json_str)
            # print(slots_per_day)
            return Response(all_routines, status=200)
            '''
            routine_path = "C:/Users/Shirso/OneDrive/Desktop/Final YR Proj/RoutineGeneration/routine_app/routines.xlsx"
            new_semester = Courses(course_details)
            
            resource_data = Resources(teacher_data_file=faculty_details,
                              room_data_file=room_details,
                              section_data_file=section_data)
            resource_data.reset_resources()
            s = Schedule(new_semester, resource_data)
            s.create_classes()
            s.generate()
            routine = s.save_schedule(routine_path)
            print(routine)
            #s.display()
            #s.save_schedule(routine_path)
            return Response(routine, status=200)
        '''
            
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=400)
        
class ScheduleView(APIView):

    def post(self, request, *args, **kwargs):
        key_field = request.data.get('key_field')
        slots_per_day = int(request.data.get('slots_per_day'))
        weekly_holidays = request.data.get('weekly_holidays')
        resource_pref_file = request.FILES['resource_pref_file']
        resource_data_file = request.FILES['resource_data_file']

        # Process the files and data
        data_df = resourcePrefUpdate(slots_per_day, weekly_holidays, pref_file=resource_pref_file, data_file=resource_data_file, key_field=key_field)
        
        data_dict = data_df.to_dict(orient='records')
        print(data_df)
        # Example of how to use data_df - print to console for debugging
        #print("DataFrame head: ", data_df.head())

        # Return a response to the client
        return Response(data_dict)




        