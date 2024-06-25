def check_conflict(a,p):
    a = int(a, 16)
    p=int(p,16)
    res=a & p
    res=bin(res)[2:]
    return res.count('1')


def conflict_score(rd):
    conflicts = 0
    total_preferences=0
    for record in rd.itertuples():
        flag=False
        allotted=record.SLOT_AVAILABILITY
        allotted=allotted.split('.')
        for i in range(len(allotted)):
            if allotted[i]!='0':
                flag=True
                break
        if not flag:
            continue
        preferred=record.PREFERRED_SLOTS
        preferred=preferred.split('.')
        for i in range(len(preferred)):
            if preferred[i]=='0':
                continue
            else:
                total_preferences+=bin(int(preferred[i],16))[2:].count('1')
                conflicts+=check_conflict(allotted[i],preferred[i])
    if conflicts and total_preferences:
        return (total_preferences-conflicts) / total_preferences
    else:
        return 1

class Evaluator:
    def __init__(self,resources):
        faculty_data=resources.Faculty_data
        room_data=resources.Room_data
        #division_data=resources.Division_data

        self.faculty_conflict=conflict_score(faculty_data)
        self.room_conflict = conflict_score(room_data)
        #division_conflict = conflict_score(division_data)

        #total_conflict=faculty_conflict+room_conflict#+division_conflict

        # self.faculty_fitness=1/(1.0*faculty_conflict+1)
        # self.room_fitness = 1 / (1.0 * room_conflict + 1)
        # self.division_fitness = 1 / (1.0 * division_conflict + 1)
        # self.total_fitness=1 / (1.0 * total_conflict + 1)




