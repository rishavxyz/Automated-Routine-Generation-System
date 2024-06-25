from .schedule import *
import random as rnd


class Scheduler(Schedule):
    ''' This is the scheduler class that creates the schedule.
    The methods here are responsible for generating the schedule.'''
    def update_slot_pref(self,lec):
        ''' This method updates the slot preference list of a lecture
        according to preference of the resources required for that lecture.'''

        def adjust_pref(key,df):
            '''This method is to update the slot preference list for one resource.
            This is called for all the resources'''
            
            pref_sch_str=df.loc[df["RESOURCE_ID"]==key]["PREFERRED_SLOTS"]
            pref_sch_list=str(pref_sch_str.max()).split('.')
            less_pref_slots=[]
            for i in range(len(pref_sch_list)):
                day=[*str(bin(int(pref_sch_list[i],16)))[2:].rjust(self.slots_per_day,'0')]
                for slot in range(len(day)):
                    if day[-slot-1]=="1":
                        less_pref_slots.append(i*self.slots_per_day+(self.slots_per_day-slot))
            for slot in range(len(lec.preferred_slot)):
                if lec.preferred_slot[slot] in less_pref_slots:
                    temp=lec.preferred_slot.pop(slot)
                    lec.preferred_slot.append(temp)

        #Adjusting slot preferrence for faculty
        for faculty in lec.instructor:
            if not faculty == 'nan':
                adjust_pref(faculty,self.resources.Faculty_data)

        #Adjusting slot preferrence list for room
        for room in lec.room:
            if not room == 'nan':
                adjust_pref(room, self.resources.Room_data)


    def shuffle_n_sort(self):
        '''This method sorts the lecture list based on their duration.
        Similar duration classes are shuffled among them.'''
        temp1 = {}
        temp2 = []

        for lecture in self.lectures:
            if lecture.duration in temp1:
                temp1[lecture.duration].append(lecture)
            else:
                temp1[lecture.duration] = [lecture]

        for k in temp1:
            rnd.shuffle(temp1[k])

        temp1 = dict(sorted(temp1.items(), key=lambda x: x[0], reverse=True))

        for k in temp1:
            temp2.extend(temp1[k])

        self.lectures = temp2

    def generate(self):
        ''' This method generates a routine. '''
        self.shuffle_n_sort()

        def is_all_resources_free(cl, slt):
            ''' This method checks if all the resources required to conduct a lecture are available in given slot. '''
            is_division_free = []
            is_faculty_free = []
            is_room_free = []

            def is_free(key, df, sl):
                ''' This method checks availability for a single resource in a given slot.
                This method is called for every resource required to conduct a lecture.'''
                sl = sl - 1
                _schedule = df.loc[df['RESOURCE_ID'] == key]["SLOT_AVAILABILITY"]
                _schedule = str(_schedule.max()).split('.')
                req_day = [*str(bin(int(_schedule[sl // self.slots_per_day], 16)))[2:].rjust(self.slots_per_day, '0')]
                return req_day[-int(sl % self.slots_per_day)-1] == '0'

            for t in range(slt, slt + cl.duration):
                is_division_free.append(is_free(cl.division_title, self.resources.Division_data, t))
                if not cl.instructor==['nan']:
                    is_faculty_free.append(all(is_free(inst, self.resources.Faculty_data, t) for inst in cl.instructor))
                else:
                    is_faculty_free.append(True)
                if not cl.room==['nan']:
                    is_room_free.append(all(is_free(rm, self.resources.Room_data, t) for rm in cl.room))
                else:
                    is_room_free.append(True)

            return all(is_division_free) and all(is_faculty_free) and all(is_room_free)

        def engage_all_resources(cl, slt):
            ''' This method engages all the resources required to conduct a lecture in a given slot. '''

            def engage_resource(key, df, sl):
                ''' This method engages a single resource in a given slot.
                This method is called for every resource required to conduct a lecture.'''
                sl = sl - 1
                _schedule = df.loc[df['RESOURCE_ID'] == key]["SLOT_AVAILABILITY"]
                _schedule = str(_schedule.max()).split('.')
                #print(_schedule)
                #print(sl)
                #print(self.slots_per_day)
                req_day = [*str(bin(int(_schedule[sl // self.slots_per_day], 16)))[2:].rjust(self.slots_per_day, '0')]
                req_day[-int(sl % self.slots_per_day)-1] = '1'
                _schedule[sl // self.slots_per_day] = str(hex(int('0b' + ''.join(req_day), 2)))[2:]
                #print(req_day)
                _schedule = '.'.join(_schedule)
                df.loc[df['RESOURCE_ID'] == key, "SLOT_AVAILABILITY"] = _schedule

            for t in range(slt, slt + cl.duration):
                engage_resource(cl.division_title, self.resources.Division_data, t)
                if not cl.room == ['nan']:
                    [engage_resource(inst, self.resources.Faculty_data, t) for inst in cl.instructor]
                if not cl.room == ['nan']:
                    [engage_resource(rm, self.resources.Room_data, t) for rm in cl.room]

        for i in range(len(self.lectures)):
            flag = False
            self.update_slot_pref(self.lectures[i])
            for slot in self.lectures[i].preferred_slot:
                if is_all_resources_free(self.lectures[i], slot):
                    self.lectures[i].start_slot = slot
                    engage_all_resources(self.lectures[i], slot)
                    flag = True
                    break
            if flag:
                self.allocated.append(self.lectures[i])
            if not flag:
                self.unallocated.append(self.lectures[i])

        self.arrange_schedule()

    def getResources(self):
        return self.resources.Room_data, self.resources.Faculty_data, self.resources.Division_data


    def __init__(self, lectures, course_data, resource_data, slots_per_day, slot_pref):
        super().__init__(course_data, resource_data, slots_per_day, slot_pref)
        self.lectures=lectures
        self.slots_per_day = slots_per_day
        self.slot_pref = slot_pref
        
        for lecture in lectures:
            lecture.set_preferred_slot(self.slot_pref[lecture.duration])

        self.generate()
        self.resources=resource_data