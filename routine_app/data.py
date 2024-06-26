import pandas as pd


class Times:
    

    def create_slot_pref(self, slot_durations):
        for i in slot_durations:
            temp = []
            for j in self.working_slots:
                #Recess should not come between a continous class. j denotes slot no. and j+i-1 denotes end slot number.
                #1st part: class should end on or before the period after which recess starts.
                #2nd part: class should start on or after the period after recess.
                recess_condition=True
                if 0<self.recess<=self.slots_per_day:
                    recess_condition = self.recess != 0 and ((j % self.slots_per_day) + i - 1 <= self.recess or self.recess + 1 <= (
                                j % self.slots_per_day))
                #Class start slot and end slot should be in same day.
                same_day_condition = ((j - 1) // self.slots_per_day == (((j - 1) + i) - 1) // self.slots_per_day)
                if recess_condition and same_day_condition:
                    temp.append(j)
            self.slot_pref[i] = temp

    def __init__(self, slots_per_day, break_after, weekly_holiday):
        self.slot_pref = {}
        self.slots_per_day = int(slots_per_day)
        self.recess = int(break_after)
        self.all_slots = [i + 1 for i in range(7 * self.slots_per_day)]
        self.off_slots = [self.slots_per_day * j + i + 1 for i in range(slots_per_day) for j in weekly_holiday]
        self.working_slots = [i for i in self.all_slots if i not in self.off_slots]

    def set_slot_pref(self, slot_pref):
        self.slot_pref = slot_pref

    def get_working_slots(self):
        return self.working_slots


class Resources:
    def resource_files_preprocessing(self):
        '''Replaces whitespace with underscore in column names.
        Changes name of index ID column of each resource to "RESOURCE_ID".'''

        self.Faculty_data.columns = self.Faculty_data.columns.str.replace(' ', '_')
        self.Faculty_data.rename(columns={'FACULTY_ID': 'RESOURCE_ID'}, inplace=True)
        
        self.Room_data.columns = self.Room_data.columns.str.replace(' ', '_')
        self.Room_data.rename(columns={'ROOM_NO': 'RESOURCE_ID'}, inplace=True)

        self.Division_data.columns = self.Division_data.columns.str.replace(' ', '_')
        self.Division_data.rename(columns={'DIVISION_TITLE': 'RESOURCE_ID'}, inplace=True)

    def resource_files_postprocessing(self):
        '''Changes back "RESOURCE_ID" column of each resource dataframe to corresponding names.
        Updates the resource files with updated data (Saving...)'''

        self.Room_data.rename(columns={'RESOURCE_ID': 'ROOM_NO'}, inplace=True)
        self.Faculty_data.rename(columns={'RESOURCE_ID': 'FACULTY_ID'}, inplace=True)
        self.Division_data.rename(columns={'RESOURCE_ID': 'DIVISION_TITLE'}, inplace=True)

        self.Room_data.to_excel(self.room_data_file, index=False)
        self.Faculty_data.to_excel(self.teacher_data_file, index=False)
        self.Division_data.to_excel(self.division_data_file, index=False)

    def reset_resource_availability(self):
        '''Resets resource availability'''

        self.Faculty_data['SLOT_AVAILABILITY'] = '0.0.0.0.0.0.0'
        self.Room_data['SLOT_AVAILABILITY'] = '0.0.0.0.0.0.0'
        self.Division_data['SLOT_AVAILABILITY'] = '0.0.0.0.0.0.0'

    def __init__(self, teacher_data_file, room_data_file, division_data_file):
        # files containing resource data
        self.teacher_data_file = teacher_data_file
        self.room_data_file = room_data_file
        self.division_data_file = division_data_file

        # files converted to dataframe
        self.Faculty_data = pd.read_excel(self.teacher_data_file)
        self.Room_data = pd.read_excel(self.room_data_file)
        self.Division_data = pd.read_excel(self.division_data_file)

        self.resource_files_preprocessing()


class Course:
    '''This file contains all the course data.

    class Lecture creates a single lecture, lectures list contains all the lectures in a particular academic year/semester.
    Eg. In a Even Semester(JAN-JUN) in MAKAUT, all lectures of sem 2,4,6,8

    class Division creates a single division. A division denotes semester and section wise split
    Eg. 2A,2B,4A,4B,6A... each are individual division.
    divisions list contain list of all divisions in a calendar year/semester'''

    

    class Lecture:
        division_title = None
        course_id = None
        instructor = None
        room = None
        duration = None
        preferred_slot = None
        start_slot = None

        def set_division(self, title):
            self.division_title = title

        def set_course(self, course_id):
            self.course_id = course_id

        def set_instructor(self, faculty):
            self.instructor = faculty

        def set_room(self, room_no):
            self.room = room_no

        def set_duration(self, duration):
            self.duration = duration

        def set_preferred_slot(self, feasible_slots):
            self.preferred_slot = feasible_slots

    class Division:
        title = ""
        courses = None

        def get_title(self):
            return self.title

        def get_courses(self):
            return self.courses

        def __init__(self, title, courses_df):

            self.title = title
            self.courses = courses_df
            self.courses.columns = self.courses.columns.str.replace(' ', '_')
            self.courses.set_index(['SUBJECT_CODE'])

    def create_lectures_list(self):

        for division in self.divisions:

            title = division.get_title()
            courses = division.get_courses()
            division_wise_lectures = []

            for course in courses.itertuples():
                for i in list(map(int, str(course.SLOT_BREAK_UP).split(','))):
                    new_lecture = self.Lecture()
                    new_lecture.set_division(title)
                    new_lecture.set_course(course.SUBJECT_CODE)
                    new_lecture.set_instructor(list(map(str.strip,str(course.FACULTY).split(','))))
                    new_lecture.set_room(list(map(str.strip,str(course.ROOM).split(','))))
                    new_lecture.set_duration(i)
                    self.lecture_durations.add(i)
                    division_wise_lectures.append(new_lecture)

            self.lectures.extend(division_wise_lectures)
        self.lectures.sort(key=lambda x: (x.duration, x.division_title), reverse=True)
        #print(self.lecture_durations)

    def create_divisions_list(self):
        with pd.ExcelFile(self.course_data_file) as file:
            divisions_title = file.sheet_names

        for i in divisions_title:
            df = pd.read_excel(self.course_data_file, i)
            new_division = self.Division(i, df)
            self.divisions.append(new_division)

    def __init__(self, course_data_file):
        self.lectures = []
        self.divisions = []
        self.lecture_durations = set()
        self.course_data_file = course_data_file
        self.create_divisions_list()
        self.create_lectures_list()

    def get_divisions(self):
        return self.divisions
