import pandas as pd

def resourcePrefUpdate(no_slots_per_day, weekly_holidays=[5,6], pref_file=None,data_file=None,key_field=None):
    pref_df=pd.read_excel(pref_file)
    pref_df.rename(columns={key_field:'RESOURCE_ID'})
    data_df=pd.read_excel(data_file)
    data_df.rename(columns={key_field: 'RESOURCE_ID'})
    one_day_off_encoded = hex(int('0b'+'1'*no_slots_per_day,2))[2:]

    for tuple in pref_df.itertuples():
        pref_str='0.0.0.0.0.0.0'

        try:
            off_slots = str(tuple.MONDAY_OFF_SLOTS).split(',')
            day = list(bin(int(pref_str[0], 16))[2:])
            for slot in off_slots:
                day[slot - 1] = '1'
            day = hex(int(''.join(day), 2))[2:]
            pref_str[0] = day
        except:
            pass

        try:
            off_slots = str(tuple.TUESDAY_OFF_SLOTS).split(',')
            day = list(bin(int(pref_str[1], 16))[2:])
            for slot in off_slots:
                day[slot - 1] = '1'
            day = hex(int(''.join(day), 2))[2:]
            pref_str[1] = day
        except:
            pass

        try:
            off_slots = str(tuple.WEDNESDAY_OFF_SLOTS).split(',')
            day = list(bin(int(pref_str[2], 16))[2:])
            for slot in off_slots:
                day[slot - 1] = '1'
            day = hex(int(''.join(day), 2))[2:]
            pref_str[2] = day
        except:
            pass

        try:
            off_slots = str(tuple.THURSDAY_OFF_SLOTS).split(',')
            day = list(bin(int(pref_str[3], 16))[2:])
            for slot in off_slots:
                day[slot - 1] = '1'
            day = hex(int(''.join(day), 2))[2:]
            pref_str[3] = day
        except:
            pass

        try:
            off_slots = str(tuple.FRIDAY_OFF_SLOTS).split(',')
            day = list(bin(int(pref_str[4], 16))[2:])
            for slot in off_slots:
                day[slot - 1] = '1'
            day = hex(int(''.join(day), 2))[2:]
            pref_str[4] = day
        except:
            pass

        try:
            off_slots = str(tuple.SATURDAY_OFF_SLOTS).split(',')
            day = list(bin(int(pref_str[5], 16))[2:])
            for slot in off_slots:
                day[slot - 1] = '1'
            day = hex(int(''.join(day), 2))[2:]
            pref_str[5] = day
        except:
            pass

        try:
            off_slots = str(tuple.SUNDAY_OFF_SLOTS).split(',')
            day = list(bin(int(pref_str[6], 16))[2:])
            for slot in off_slots:
                day[slot - 1] = '1'
            day = hex(int(''.join(day), 2))[2:]
            pref_str[6] = day
        except:
            pass

        try:
            pref_str=pref_str.split('.')
            for i in range(len(pref_str)):
                off_slots=str(tuple.GENERAL_OFF_SLOTS).split(',')
                day=list(bin(int(pref_str[i],16))[2:])
                for slot in off_slots:
                    day[slot-1]='1'
                day=hex(int(''.join(day),2))[2:]
                pref_str[i]=day
        except:
            pass

        try:
            day_off=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].index(str(tuple.OFF_DAY))
            pref_str=pref_str.split('.')
            pref_str[day_off]=one_day_off_encoded
        except:
            pass

        try:
            data_df.loc[data_df['RESOURCE_ID'] == tuple.RESOURCE_ID, 'PREFERRED_SLOT'] = pref_str
        except:
            pass

    return data_df
