import schedule
import random as rnd


class Scheduler(schedule.Schedule):
    ''' This is the scheduler class that creates the schedule.
    The methods here are responsible for generating the schedule.'''

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
                req_day = [*str(bin(int(_schedule[sl // 6], 16)))[2:].rjust(6, '0')]
                return req_day[int(sl % 6)] == '0'

            for t in range(slt, slt + cl.duration):
                is_division_free.append(is_free(cl.division_title, self.resources.Division_data, t))
                is_faculty_free.append(all(is_free(inst, self.resources.Faculty_data, t) for inst in cl.instructor))
                is_room_free.append(all(is_free(rm, self.resources.Room_data, t) for rm in cl.room))

            return all(is_division_free) and all(is_faculty_free) and all(is_room_free)

        def engage_all_resources(cl, slt):
            ''' This method engages all the resources required to conduct a lecture in a given slot. '''

            def engage_resource(key, df, sl):
                ''' This method engages a single resource in a given slot.
                This method is called for every resource required to conduct a lecture.'''
                sl = sl - 1
                _schedule = df.loc[df['RESOURCE_ID'] == key]["SLOT_AVAILABILITY"]
                _schedule = str(_schedule.max()).split('.')
                req_day = [*str(bin(int(_schedule[sl // 6], 16)))[2:].rjust(6, '0')]
                req_day[int(sl % 6)] = '1'
                _schedule[sl // 6] = str(hex(int('0b' + ''.join(req_day), 2)))[2:]
                _schedule = '.'.join(_schedule)
                df.loc[df['RESOURCE_ID'] == key, "SLOT_AVAILABILITY"] = _schedule

            for t in range(slt, slt + cl.duration):
                engage_resource(cl.division_title, self.resources.Division_data, t)
                [engage_resource(inst, self.resources.Faculty_data, t) for inst in cl.instructor]
                [engage_resource(rm, self.resources.Room_data, t) for rm in cl.room]

        for i in range(len(self.lectures)):
            flag = False
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

    def __init__(self, lectures, slot_pref_list, course_data, resource_data):
        super().__init__(course_data, resource_data)
        self.lectures=lectures
        self.slot_pref_list=slot_pref_list

        for lecture in lectures:
            lecture.set_preferred_slot(slot_pref_list[lecture.duration])

        self.generate()