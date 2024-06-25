import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

function ResourceScheduler() {
    const [slotsPerDay, setSlotsPerDay] = useState('');
    const [weeklyHolidays, setWeeklyHolidays] = useState('');
    const [resourcePrefFile, setResourcePrefFile] = useState(null);
    const [resourceDataFile, setResourceDataFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
        // Fetch CSRF token
        axios.get('http://localhost:8000/csrf/', { withCredentials: true })
            .then(response => {
                setCsrfToken(response.data.csrfToken);
            })
            .catch(error => {
                console.error('There was an error fetching the CSRF token!', error);
            });
    }, []);

    const handleSlotsChange = (e) => {
        setSlotsPerDay(e.target.value);
    };

    const handleHolidaysChange = (e) => {
        setWeeklyHolidays(e.target.value);
    };

    const handlePrefFileChange = (e) => {
        setResourcePrefFile(e.target.files[0]);
    };

    const handleDataFileChange = (e) => {
        setResourceDataFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('slots_per_day', slotsPerDay);
        formData.append('weekly_holidays', weeklyHolidays);
        formData.append('resource_pref_file', resourcePrefFile);
        formData.append('resource_data_file', resourceDataFile);

        try {
            const res = await axios.post('http://localhost:8000/generate_resource/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': csrfToken,
                },
                withCredentials: true,
            });
            console.log("Response from server:", res); // Log the entire response object
            setResponse(res.data);
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleDownloadExcel = () => {
        if (response) {
            // Prepare data for Excel
            const data = response.map(item => ({
                'FACULTY_ID': item.FACULTY_ID,
                'GRADE': item.GRADE,
                'FACULTY_NAME': item.FACULTY_NAME,
                'SLOT_AVAILABILITY': item.SLOT_AVAILABILITY,
                'SLOT_AVAILABLE': item.SLOT_AVAILABLE,
                'PREFERRED_SLOTS': item.PREFERRED_SLOTS,
            }));

            // Create a new workbook
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(data);

            // Add the worksheet to the workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

            // Generate a file name
            const fileName = 'resource_data.xlsx';

            // Generate Excel file and trigger download
            XLSX.writeFile(workbook, fileName);
        }
    };

    return (
        <div>
            <h2>Resource Scheduler</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Number of Slots per Day:</label>
                    <input type="number" value={slotsPerDay} onChange={handleSlotsChange} required />
                </div>
                <div>
                    <label>Weekly Holidays (comma separated):</label>
                    <input type="text" value={weeklyHolidays} onChange={handleHolidaysChange} required />
                </div>
                <div>
                    <label>Resource Preference File:</label>
                    <input type="file" onChange={handlePrefFileChange} required />
                </div>
                <div>
                    <label>Resource Data File:</label>
                    <input type="file" onChange={handleDataFileChange} required />
                </div>
                <button type="submit">Submit</button>
            </form>
            {response && (
                <button onClick={handleDownloadExcel}>Download Excel</button>
            )}
        </div>
    );
}

export default ResourceScheduler;
