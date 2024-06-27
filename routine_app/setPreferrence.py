import pandas as pd


def resourcePrefUpdate(no_slots_per_day, pref_file=None,data_file=None,key_field=None):

    ''' This function takes a preference file of a predefined format and a data file of a particular format for a
    single resource as an input. Here resource refers to Teacher, Room or Division. In the preference file, the
    less preferred slots are arranged in a human understandable format. This function basically converts the readable
    format to the hexadecimal encoding used in our project.
    Note: The key_field in parameter list defines the key column that can be used to uniquely identify a resource in
    both preference file and data file. For example, for faculty_preference and faculty_data it will be FACULTY_ID,
    for room_data it will be ROOM_NO.

    This function returns an updated dataframe only of the resource data. We can save that in excel later. '''

    pref_df=pd.read_excel(pref_file)
    pref_df.rename(columns={key_field:'RESOURCE_ID'},inplace=True)
    data_df=pd.read_excel(data_file)
    data_df.rename(columns={key_field: 'RESOURCE_ID'},inplace=True)
    one_day_off_encoded = hex(int('0b'+'1'*no_slots_per_day,2))[2:]

    for tuple in pref_df.itertuples():
        #print(str(tuple.FACULTY_NAME))
        pref_str='0.0.0.0.0.0.0'
        pref_str = pref_str.split('.')

        # Sets the less preferred slots for monday
        try:
            off_slots = [int(float(i))-1 for i in list(map(str.strip,tuple.MONDAY_OFF_SLOTS.split(','))) if not int(float(i))-1<0]
            day = list(bin(int(pref_str[0], 16))[2:].rjust(no_slots_per_day,'0'))
            for slot in off_slots:
                day[-int(slot)-1] = '1'
            day = hex(int(''.join(day), 2))[2:]
            pref_str[0] = day
        except:
            pass

        # Sets the less preferred slots for tuesday
        try:
            off_slots = [int(float(i))-1 for i in list(map(str.strip,tuple.TUESDAY_OFF_SLOTS.split(','))) if not int(float(i))-1<0]
            day = list(bin(int(pref_str[1], 16))[2:].rjust(no_slots_per_day,'0'))
            for slot in off_slots:
                day[-int(slot)-1] = '1'
            day = hex(int(''.join(day), 2))[2:]
            pref_str[1] = day
        except:
            pass

        # Sets the less preferred slots for wednesday
        try:
            off_slots = [int(float(i))-1 for i in list(map(str.strip,tuple.WEDNESDAY_OFF_SLOTS.split(','))) if not int(float(i))-1<0]
            day = list(bin(int(pref_str[2], 16))[2:].rjust(no_slots_per_day,'0'))
            for slot in off_slots:
                day[-int(slot)-1] = '1'
            day = hex(int(''.join(day), 2))[2:]
            pref_str[2] = day
        except:
            pass

        # Sets the less preferred slots for thursday
        try:
            off_slots = [int(float(i))-1 for i in list(map(str.strip,tuple.THURSDAY_OFF_SLOTS.split(','))) if not int(float(i))-1<0]
            day = list(bin(int(pref_str[3], 16))[2:].rjust(no_slots_per_day,'0'))
            for slot in off_slots:
                day[-int(slot)-1] = '1'
            day = hex(int(''.join(day), 2))[2:]
            pref_str[3] = day
        except:
            pass

        # Sets the less preferred slots for friday
        try:
            off_slots = [int(float(i))-1 for i in list(map(str.strip,tuple.FRIDAY_OFF_SLOTS.split(','))) if not int(float(i))-1<0]
            day = list(bin(int(pref_str[4], 16))[2:].rjust(no_slots_per_day,'0'))
            for slot in off_slots:
                day[-int(slot)-1] = '1'
            day = hex(int(''.join(day), 2))[2:]
            pref_str[4] = day
        except:
            pass

        # Sets the less preferred slots for saturday
        try:
            off_slots = [int(float(i))-1 for i in list(map(str.strip,tuple.SATURDAY_OFF_SLOTS.split(','))) if not int(float(i))-1<0]
            day = list(bin(int(pref_str[5], 16))[2:].rjust(no_slots_per_day,'0'))
            for slot in off_slots:
                day[-int(slot)-1] = '1'
            day = hex(int(''.join(day), 2))[2:]
            pref_str[5] = day
        except:
            pass

        # Sets the less preferred slots for sunday
        try:
            off_slots = [int(float(i))-1 for i in list(map(str.strip,tuple.SUNDAY_OFF_SLOTS.split(','))) if not int(float(i))-1<0]
            day = list(bin(int(pref_str[6], 16))[2:].rjust(no_slots_per_day,'0'))
            for slot in off_slots:
                day[-int(slot)-1] = '1'
            day = hex(int(''.join(day), 2))[2:]
            pref_str[6] = day
        except:
            pass

        # Sets the general less preferred slots for all days
        try:
            off_slots = [int(float(i)) - 1 for i in list(map(str.strip,tuple.GENERAL_OFF_SLOTS.split(','))) if not int(float(i)) - 1 < 0]
            for i in range(len(pref_str)):
                day=list(bin(int(pref_str[i],16))[2:].rjust(no_slots_per_day,'0'))
                for slot in off_slots:
                    day[-int(slot)-1] = '1'
                day=hex(int(''.join(day),2))[2:]
                pref_str[i]=day
        except:
            pass

        # Sets the less preferred day (entire day) in week
        try:
            off_day_list=list(map(str.strip,tuple.OFF_DAYS.split(',')))
            print(off_day_list)
            for day in off_day_list:
                day_off=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].index(day)
                pref_str[day_off]=one_day_off_encoded
        except:
            pass

        # Updates the resource data
        #try:
        pref_str='.'.join(pref_str)
        print(pref_str)
        data_df.loc[data_df['RESOURCE_ID'] == tuple.RESOURCE_ID, 'PREFERRED_SLOTS'] = pref_str
        #except:
        #    pass

    data_df.rename(columns={'RESOURCE_ID': key_field}, inplace=True)
    return data_df