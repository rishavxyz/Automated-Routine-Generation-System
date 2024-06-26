import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FormDataContext } from "../context/FormDataContext";
import * as XLSX from "xlsx";

function ResourceScheduler() {
  const [formData, setFormData] = useState({
    slotsPerDay: "",
    resourcePrefFile: null,
    resourceDataFile: null,
    keyField: "", // Corrected to match dropdown field name
  });
  const [response, setResponse] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { weeklyHoliday, setWeeklyHoliday } = useContext(FormDataContext);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    // Fetch CSRF token
    axios
      .get("http://localhost:8000/csrf/", { withCredentials: true })
      .then((response) => {
        setCsrfToken(response.data.csrfToken);
      })
      .catch((error) => {
        console.error("There was an error fetching the CSRF token!", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  const handleCheckboxChange = (index) => {
    const newHolidays = [...weeklyHoliday];
    newHolidays[index] = !newHolidays[index];
    setWeeklyHoliday(newHolidays);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const submissionData = new FormData();
    submissionData.append("slots_per_day", formData.slotsPerDay);
    submissionData.append("weekly_holidays", JSON.stringify(weeklyHoliday));
    weeklyHoliday.forEach((isHoliday, index) => {
      submissionData.append(
        `weeklyHoliday[${index}]`,
        isHoliday ? "true" : "false"
      );
    });
    submissionData.append("resource_pref_file", formData.resourcePrefFile);
    submissionData.append("resource_data_file", formData.resourceDataFile);
    submissionData.append("key_field", formData.keyField);

    try {
      const res = await axios.post(
        "http://localhost:8000/generate_resource/",
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      );
      setResponse(res.data);
    } catch (err) {
      console.error("Error:", err);
      setError("There was an error submitting the form. Please try again."); // Set error message
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = () => {
    if (response) {
      const data = response.map((item) => ({
        FACULTY_ID: item.FACULTY_ID,
        GRADE: item.GRADE,
        FACULTY_NAME: item.FACULTY_NAME,
        SLOT_AVAILABILITY: item.SLOT_AVAILABILITY,
        SLOT_AVAILABLE: item.SLOT_AVAILABLE,
        PREFERRED_SLOTS: item.PREFERRED_SLOTS,
      }));

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);

      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      const fileName = "resource_data.xlsx";

      XLSX.writeFile(workbook, fileName);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center items-center min-h-[90vh] bg-gray-700">
          <div className="py-6 px-7 my-auto w-full rounded-2xl bg-white md:w-2/5">
            <p className="flex text-2xl text-gray-900 font-bold pb-2 mb-4 border-b-2 border-gray-500">
              Resource Scheduler
            </p>

            {error && (
              <div className="bg-red-400 text-white p-4 mb-4 rounded-lg">
                {error}
              </div>
            )}

            <div className="text-sm relative flex flex-col mb-2.5 md:text-base xl:text-base">
              <label className="flex text-base mb-0.5 xl:text-lg">
                Number of Class Slots in a Day*
              </label>
              <input
                type="number"
                id="slotsPerDay"
                name="slotsPerDay"
                placeholder="Eg.: 6 or 8"
                value={formData.slotsPerDay}
                onChange={handleChange}
                className="outline-none border border-gray-300 rounded-md px-2.5 py-1.5"
                required
              />
            </div>

            <div className="text-sm relative flex flex-col md:text-base xl:text-base">
              <label className="flex text-base mb-0.5 xl:text-lg">
                Weekly Holidays:
              </label>
              <div className="grid grid-cols-4 gap-4">
                {daysOfWeek.map((day, index) => (
                  <div key={index} className="flex items-center mr-4">
                    <input
                      type="checkbox"
                      id={`holiday${index}`}
                      name={`holiday${index}`}
                      checked={weeklyHoliday[index]}
                      onChange={() => handleCheckboxChange(index)}
                    />
                    <label htmlFor={`holiday${index}`} className="ml-1">
                      {day}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 md:flex">
              <div className="text-lg relative flex flex-col mb-2.5 md:text-base xl:text-base">
                <label className="flex text-base mb-0.5 xl:text-lg">
                  Resource Preference File*
                </label>
                <input
                  type="file"
                  accept=".xlsx"
                  name="resourcePrefFile"
                  onChange={handleFileChange}
                  required
                  className="
                    file:mr-2.5 file:py-1.5 file:px-4
                    file:rounded-md file:border file:border-gray-300
                    file:text-sm file:text-gray-500
                    file:bg-white hover:file:bg-gray-200"
                />
              </div>

              <div className="text-sm relative flex flex-col mb-2.5 md:text-base xl:text-base">
                <label className="flex text-base mb-0.5 xl:text-lg">
                  Resource Data File*
                </label>
                <input
                  type="file"
                  accept=".xlsx"
                  name="resourceDataFile"
                  onChange={handleFileChange}
                  required
                  className="
                    file:mr-2.5 file:py-1.5 file:px-4
                    file:rounded-md file:border file:border-gray-300
                    file:text-sm file:text-gray-500
                    file:bg-white hover:file:bg-gray-200"
                />
              </div>
            </div>

            <div>
              <label className="flex text-base mb-0.5 xl:text-lg">
                Select Option:
              </label>
              <select
                name="keyField"
                value={formData.keyField}
                onChange={handleChange}
                className="flex outline-none border border-gray-300 rounded-md px-2.5 py-1.5"
                required
              >
                <option value="">Select Key Field</option>
                <option value="FACULTY_ID">FACULTY_ID</option>
                <option value="ROOM_NO">ROOM_NO</option>
                <option value="DIVISION_TITLE">DIVISION_TITLE</option>
              </select>
            </div>

            <div>
              {loading ? (
                <div className="flex justify-center items-center text-base cursor-pointer w-full font-medium text-center bg-gray-700 text-white mt-4 py-2.5 border-none outline-none rounded-md hover:bg-gray-600">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </div>
              ) : (
                <input
                  type="submit"
                  value="Submit"
                  className="text-base cursor-pointer w-full font-medium text-center bg-gray-700 text-white mt-4 py-2.5 border-none outline-none rounded-md hover:bg-gray-600"
                />
              )}
            </div>
          </div>
        </div>
      </form>
      {response && (
        <button onClick={handleDownloadExcel} className="text-base cursor-pointer font-medium text-center bg-gray-700 text-white mt-4 px-4 py-2.5 border-none outline-none rounded-md hover:bg-gray-600">Download Excel</button>
      )}
    </div>
  );
}

export default ResourceScheduler;
