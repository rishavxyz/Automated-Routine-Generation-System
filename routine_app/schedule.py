import pandas as pd
import re

class Schedule:

    def arrange_schedule(self):
        self.allocated.sort(key=lambda x: (x.division_title, x.start_slot))
        for lecture in self.allocated:
            if lecture.division_title in self.schedule:
                self.schedule[lecture.division_title].append(lecture)
            else:
                self.schedule[lecture.division_title] = [lecture]

    def display(self):
        for division in self.schedule:
            print(division)
            print("time\tsubject\tinstructor\troom\tduration")
            for _cl in self.schedule[division]:
                print(f"{_cl.start_slot}\t{_cl.course_id}\t{_cl.instructor}\t{_cl.room}\t{_cl.duration}")
            print("\n\n")

        print("Unallocated:", self.unallocated)

    def save_schedule(self, path, teacher_data):
        full_schedule = {}
        for division in self.schedule:
            routine = {}
            for cl in self.schedule[division]:
                for sl in range(cl.start_slot, cl.start_slot + cl.duration):
                    i = (sl - 1) // self.slots_per_day
                    j = (sl - 1) % self.slots_per_day
                    pattern = r'[^a-zA-Z0-9\s]'
                    if "Day" + str(i) in routine:
                        clean_text = re.sub(pattern, '', str(cl.instructor))
                        clean_text = clean_text.replace(' ','|')
                        teacher_name = teacher_data.get(clean_text)
                        if(teacher_name != None):
                            routine["Day" + str(i)][j] = str(cl.course_id) + str(cl.instructor).replace("'", "") + '['+ teacher_name  +']'
                        else:
                            routine["Day" + str(i)][j] = str(cl.course_id) + '|' + str(cl.instructor).replace("'", "") 
                    else:
                        clean_text = re.sub(pattern, '', str(cl.instructor))
                        clean_text = clean_text.replace(' ','|')
                        teacher_name = teacher_data.get(clean_text)
                        if(teacher_name != None):
                            routine["Day" + str(i)] = {j:str(cl.course_id) + str(cl.instructor).replace("'", "") + '['+ teacher_name  +']'}
                        else:
                            routine["Day" + str(i)] = {j:str(cl.course_id)  + str(cl.instructor).replace("'", "") }

    # def save_schedule(self, path, teacher_data):
    #     full_schedule = {}
    #     #writer = pd.ExcelWriter(path)
    #     for division in self.schedule:
    #         routine = {}
    #         for cl in self.schedule[division]:
    #             for sl in range(cl.start_slot, cl.start_slot + cl.duration):
    #                 i = (sl - 1) // self.slots_per_day
    #                 j = (sl - 1) % self.slots_per_day
    #                 pattern = r'[^a-zA-Z0-9\s]'
    #                 if "Day" + str(i) in routine:
    #                     clean_text = re.sub(pattern, '', str(cl.instructor))
                        
    #                     clean_text = clean_text.replace(' ','|')
    #                     teacher_name = teacher_data.get(clean_text)
    #                     #print("Code1:" + teacher_name)
    #                     if(teacher_name != None):
    #                         routine["Day" + str(i)][j] = str(cl.course_id) + str(cl.instructor) + "['"+ teacher_name  +"']"
    #                     else:
    #                         routine["Day" + str(i)][j] = str(cl.course_id) + '|' + str(cl.instructor) 
    #                 else:
    #                     clean_text = re.sub(pattern, '', str(cl.instructor))
    #                     clean_text = clean_text.replace(' ','|')
    #                     teacher_name = teacher_data.get(clean_text)
    #                     if(teacher_name != None):
    #                         routine["Day" + str(i)] = {j:str(cl.course_id) + str(cl.instructor) + "['"+ teacher_name  +"']"}
    #                     else:
    #                         routine["Day" + str(i)] = {j:str(cl.course_id)  + str(cl.instructor) }
                        
                        
                    '''
                    i = (sl - 1) // self.times.slots_per_day
                    j = (sl - 1) % self.times.slots_per_day
                    pattern = r'[^a-zA-Z0-9\s]'
                    if "Day" + str(i) in routine:
                        clean_text = re.sub(pattern, '', str(cl.instructor))
                        
                        clean_text = clean_text.replace(' ','|')
                        teacher_name = teacher_data.get(clean_text)
                        #print("Code1:" + teacher_name)
                        if(teacher_name != None):
                            routine["Day" + str(i)][j] = str(cl.course_id) + str(cl.instructor) + '['+ teacher_name  +']'
                        else:
                            routine["Day" + str(i)][j] = str(cl.course_id) + '|' + str(cl.instructor) 
                    else:
                        clean_text = re.sub(pattern, '', str(cl.instructor))
                        clean_text = clean_text.replace(' ','|')
                        teacher_name = teacher_data.get(clean_text)
                        if(teacher_name != None):
                            routine["Day" + str(i)] = {j:str(cl.course_id) + str(cl.instructor) + '['+ teacher_name  +']'}
                        else:
                            routine["Day" + str(i)] = {j:str(cl.course_id)  + str(cl.instructor) }
                        #print("Code2" + teacher_name)
                        
                        if(teacher_name != None):
                            routine["Day" + str(i)][j] = str(cl.course_id) + '|' + clean_text + '|' + teacher_name
                        else:
                            routine["Day" + str(i)][j] = str(cl.course_id) + '|' + clean_text
                        
                    else:
                        clean_text = re.sub(pattern, '', str(cl.instructor))
                        clean_text = clean_text.replace(' ','|')
                        teacher_name = teacher_data.get(clean_text)
                        if(teacher_name != None):
                            routine["Day" + str(i)] = {j:str(cl.course_id) + '|' + clean_text + '|' + teacher_name}
                        else:
                            routine["Day" + str(i)] = {j:str(cl.course_id) + '|' + clean_text}
                        #print("Code2" + teacher_name)
                    '''
            full_schedule[division] = routine
            #routine = pd.DataFrame(routine).T
            #routine.to_excel(excel_writer=writer, sheet_name=division)
        #writer.close()
        return full_schedule

    def __init__(self, course_data, resource_data, slots_per_day, slot_pref):
        self.course_data = course_data
        self.resources = resource_data
        #self.slots_per_day = 8
        self.slots_per_day=slots_per_day
        self.slot_pref = slot_pref
        self.lectures = course_data.lectures
        self.allocated=[]
        self.unallocated = []
        self.schedule = {}