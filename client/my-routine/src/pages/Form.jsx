import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FormDataContext } from "../context/FormDataContext";

const Form = () => {
  const {
    formData,
    setFormData,
    courseFile,
    slotsPerDay,
    breakAfter,
    weeklyHoliday,
  } = useContext(FormDataContext);

  const [form, setForm] = useState({
    classStartTime: "",
    classDuration: "",
    breakDuration: "",
  });

  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [slotPref, setSlotPref] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const storedSlotPref = localStorage.getItem("slot_pref");
    if (storedSlotPref) {
      setSlotPref(JSON.parse(storedSlotPref));
    }
  }, [formData, courseFile, slotsPerDay, breakAfter, weeklyHoliday]);

  const handleFileChange = (event, fileType) => {
    setFormData({
      ...formData,
      [fileType]: event.target.files[0],
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (!formData.facultyFile || !formData.sectionFile || !formData.roomFile) {
      setError("All Files must be Uploaded");
      return false;
    }
    if (!form.classStartTime || !/^\d{2}:\d{2}$/.test(form.classStartTime)) {
      setError("Enter Valid Class Start Time in HH:MM format");
      return false;
    }
    if (!form.classDuration || isNaN(form.classDuration)) {
      setError("Enter Valid Class Duration in Minutes");
      return false;
    }
    if (!form.breakDuration || isNaN(form.breakDuration)) {
      setError("Enter Valid Break Duration in Minutes");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("facultyFile", formData.facultyFile);
    formDataToSend.append("courseFile", courseFile);
    formDataToSend.append("sectionFile", formData.sectionFile);
    formDataToSend.append("roomFile", formData.roomFile);
    formDataToSend.append("slotsPerDay", slotsPerDay);
    formDataToSend.append("breakAfter", breakAfter);
    formDataToSend.append("weeklyHoliday", JSON.stringify(weeklyHoliday));
    formDataToSend.append("slot_pref", JSON.stringify(slotPref));

    localStorage.setItem("classStartTime", form.classStartTime);
    localStorage.setItem("classDuration", form.classDuration);
    localStorage.setItem("breakSlot", breakAfter);
    localStorage.setItem("breakDuration", form.breakDuration);

    try {
      const response = await axios.post(
        "https://equipped-ostrich-fancy.ngrok-free.app/generate_routine/",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResponse(response.data);
      setError("");
      localStorage.setItem("routineData", JSON.stringify(response.data));
      // window.location.href = "/routines";
      navigate("/routines");
    } catch (error) {
      setError(error.message);
      setResponse(null);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center items-center min-h-screen bg-gray-700">
          <div className="py-6 px-7 w-full rounded-2xl bg-white md:w-2/5">
            <p className="flex text-2xl text-gray-900 font-bold pb-2 mb-4 border-b-2 border-gray-500">
              Routine Generation Form
            </p>

            {error && (
              <div className="bg-red-400 text-white p-4 mb-4 rounded-lg">
                {error}
              </div>
            )}

            <div className="md:flex">
              <div className="text-lg relative flex flex-col mb-2.5 md:text-base xl:text-base">
                <label className="flex text-base mb-0.5 xl:text-lg">
                  Faculty Details*
                </label>
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={(e) => handleFileChange(e, "facultyFile")}
                  className="
                    file:mr-2.5 file:py-1.5 file:px-4
                    file:rounded-md file:border file:border-gray-300
                    file:text-sm file:text-gray-500
                    file:bg-white hover:file:bg-gray-200"
                />
              </div>

              <div className="text-sm relative flex flex-col mb-2.5 md:text-base xl:text-base">
                <label className="flex text-base mb-0.5 xl:text-lg">
                  Room Details*
                </label>
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={(e) => handleFileChange(e, "sectionFile")}
                  className="
                    file:mr-2.5 file:py-1.5 file:px-4
                    file:rounded-md file:border file:border-gray-300
                    file:text-sm file:text-gray-500
                    file:bg-white hover:file:bg-gray-200"
                />
              </div>
            </div>

            <div className="md:flex">
              <div className="text-sm relative flex flex-col mb-2.5 md:text-base xl:text-base">
                <label className="flex text-base mb-0.5 xl:text-lg">
                  Section Details*
                </label>
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={(e) => handleFileChange(e, "roomFile")}
                  className="
                    file:mr-2.5 file:py-1.5 file:px-4
                    file:rounded-md file:border file:border-gray-300
                    file:text-sm file:text-gray-500
                    file:bg-white hover:file:bg-gray-200"
                />
              </div>
            </div>

            <div className="text-sm relative flex flex-col my-2.5 md:text-base xl:text-base">
              <label className="flex text-base mb-0.5 xl:text-lg">
                Class Start Time (HH:MM)*
              </label>
              <input
                type="text"
                id="classStartTime"
                name="classStartTime"
                placeholder="Eg.: 09:30 or 10:00"
                value={formData.classStartTime}
                onChange={handleInputChange}
                className="outline-none border border-gray-300 rounded-md px-2.5 py-1.5"
              />
            </div>

            <div className="text-sm relative flex flex-col mb-2.5 md:text-base xl:text-base">
              <label className="flex text-base mb-0.5 xl:text-lg">
                Class Duration in Minutes*
              </label>
              <input
                type="number"
                id="classDuration"
                name="classDuration"
                placeholder="Eg.: 45 or 60"
                value={formData.classDuration}
                onChange={handleInputChange}
                className="outline-none border border-gray-300 rounded-md px-2.5 py-1.5"
              />
            </div>

            <div className="text-sm relative flex flex-col mb-2.5 md:text-base xl:text-base">
              <label className="flex text-base mb-0.5 xl:text-lg">
                Break Duration in Minutes*
              </label>
              <input
                type="number"
                id="breakDuration"
                name="breakDuration"
                placeholder="Eg.: 30 or 45"
                value={formData.breakDuration}
                onChange={handleInputChange}
                className="outline-none border border-gray-300 rounded-md px-2.5 py-1.5"
              />
            </div>

            <div>
              {loading ? (
                <div className="flex justify-center items-center text-base cursor-pointer font-medium text-center bg-gray-700 text-white mt-4 py-2.5 border-none outline-none rounded-md hover:bg-gray-600">
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
                  Generating Routines...
                </div>
              ) : (
                <input
                  type="submit"
                  value="Submit"
                  className="text-base cursor-pointer font-medium text-center bg-gray-700 text-white mt-4 py-2.5 border-none outline-none rounded-md hover:bg-gray-600"
                />
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;
