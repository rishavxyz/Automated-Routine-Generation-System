import React, { createContext, useState } from 'react';

export const FormDataContext = createContext();

export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState({});
  const [courseFile, setCourseFile] = useState(null);
  const [slotsPerDay, setSlotsPerDay] = useState(0);
  const [breakAfter, setBreakAfter] = useState(0);
  const [weeklyHoliday, setWeeklyHoliday] = useState([false, false, false, false, false, true, true]);

  return (
    <FormDataContext.Provider
      value={{
        formData,
        setFormData,
        courseFile,
        setCourseFile,
        slotsPerDay,
        setSlotsPerDay,
        breakAfter,
        setBreakAfter,
        weeklyHoliday,
        setWeeklyHoliday,
      }}
    >
      {children}
    </FormDataContext.Provider>
  );
};