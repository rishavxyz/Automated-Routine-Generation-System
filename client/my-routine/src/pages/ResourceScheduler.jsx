import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { MdOutlineFileDownload } from "react-icons/md";

function ResourceScheduler() {
  const [slotsPerDay, setSlotsPerDay] = useState("");
  const [resourcePrefFile, setResourcePrefFile] = useState(null);
  const [resourceDataFile, setResourceDataFile] = useState(null);
  const [keyField, setKeyField] = useState("");
  const [response, setResponse] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("https://equipped-ostrich-fancy.ngrok-free.app/csrf/", { withCredentials: true })
      .then((response) => {
        setCsrfToken(response.data.csrfToken);
      })
      .catch((error) => {
        console.error("There was an error fetching the CSRF token!", error);
      });
  }, []);

  const handleSlotsChange = (e) => {
    setSlotsPerDay(e.target.value);
  };

  const handlePrefFileChange = (e) => {
    setResourcePrefFile(e.target.files[0]);
  };

  const handleDataFileChange = (e) => {
    setResourceDataFile(e.target.files[0]);
  };

  const handleKeyChange = (e) => {
    setKeyField(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();
    formData.append("slots_per_day", slotsPerDay);
    formData.append("resource_pref_file", resourcePrefFile);
    formData.append("resource_data_file", resourceDataFile);
    formData.append("key_field", keyField);

    try {
      const res = await axios.post(
        "https://equipped-ostrich-fancy.ngrok-free.app/generate_resource/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response from server:", res);
      setResponse(res.data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = () => {
    if (response) {
      if(keyField==='FACULTY_ID'){const data = response.map((item) => ({
        FACULTY_ID: item.FACULTY_ID,
        DESIGNATION: item.DESIGNATION,
        FACULTY_NAME: item.FACULTY_NAME,
        SLOT_AVAILABILITY: item.SLOT_AVAILABILITY,
        PREFERRED_SLOTS: item.PREFERRED_SLOTS,
      }));

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);

      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      const fileName = "resource_data.xlsx";

      XLSX.writeFile(workbook, fileName)}

      else if(keyField==='ROOM_NO'){const data = response.map((item) => ({
        ROOM_NO: item.ROOM_NO,
        ROOM_TYPE: item.ROOM_TYPE,
        ROOM_CAPACITY: item.ROOM_CAPACITY,
        SLOT_AVAILABILITY: item.SLOT_AVAILABILITY,
        PREFERRED_SLOTS: item.PREFERRED_SLOTS,
      }));

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);

      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      const fileName = "resource_data.xlsx";

      XLSX.writeFile(workbook, fileName)}
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center items-center min-h-[90vh] bg-gray-700">
          <div className="py-6 px-7 my-auto w-full rounded-2xl bg-white md:w-2/5">
            <p className="flex text-2xl text-gray-900 font-bold pb-2 mb-4 border-b-2 border-gray-500">
              Update Teacher/Room Preference in Dataset
            </p>
            <div className="text-sm relative flex flex-col mb-2.5 md:text-base xl:text-base">
              <label className="flex text-base mb-0.5 xl:text-lg">
                Number of Class Slots in a Day*
              </label>
              <input
                type="number"
                value={slotsPerDay}
                placeholder="Eg.: 6 or 8"
                className="outline-none border border-gray-300 rounded-md px-2.5 py-1.5"
                onChange={handleSlotsChange}
                required
              />
            </div>

            <div className="md:flex">
              <div className="text-lg relative flex flex-col mb-2.5 md:text-base xl:text-base">
                <label className="flex text-base mb-0.5 xl:text-lg">
                  Resource Preference File:
                </label>
                <input
                  type="file"
                  onChange={handlePrefFileChange}
                  className="
                    file:mr-2.5 file:py-1.5 file:px-4
                    file:rounded-md file:border file:border-gray-300
                    file:text-sm file:text-gray-500
                    file:bg-white hover:file:bg-gray-200"
                  required
                />
              </div>

              <div className="text-lg relative flex flex-col mb-2.5 md:text-base xl:text-base">
                <label className="flex text-base mb-0.5 xl:text-lg">
                  Resource Data File:
                </label>
                <input
                  type="file"
                  onChange={handleDataFileChange}
                  className="
                    file:mr-2.5 file:py-1.5 file:px-4
                    file:rounded-md file:border file:border-gray-300
                    file:text-sm file:text-gray-500
                    file:bg-white hover:file:bg-gray-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="flex text-base mb-0.5 xl:text-lg">
                Select Key Field:
              </label>
              <select
                name="keyField"
                value={keyField}
                onChange={handleKeyChange}
                className="flex outline-none border border-gray-300 rounded-md px-2.5 py-1.5"
                required
              >
                <option value="">--Select--</option>
                <option value="FACULTY_ID">FACULTY_ID</option>
                <option value="ROOM_NO">ROOM_NO</option>
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

            {response && (
              <button
                onClick={handleDownloadExcel}
                className="flex justify-center items-center text-base cursor-pointer font-medium text-center bg-gray-700 text-white mt-4 px-4 py-2.5 border-none outline-none rounded-md hover:bg-gray-600"
              >
                Download Excel <MdOutlineFileDownload className="text-2xl ml-2" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default ResourceScheduler;
