import React, { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { MdOutlineFileDownload } from "react-icons/md";

const Display = () => {
  const [routine, setRoutine] = useState(null);
  const [classStartTime, setClassStartTime] = useState("");
  const [classDuration, setClassDuration] = useState("");
  const [breakSlot, setBreakSlot] = useState("");
  const [breakDuration, setBreakDuration] = useState("");
  const [teacherData, setTeacherData] = useState(null);
  const [roomSlot, setRoomSlot] = useState(null);
  const [facultySlot, setFacultySlot] = useState(null);
  const [sectionSlot, setSectionSlot] = useState(null);

  useEffect(() => {
    const storedRoutine = localStorage.getItem("selectedRoutine");
    if (storedRoutine) {
      const parsedRoutine = JSON.parse(storedRoutine);
      setRoutine(parsedRoutine);

      setRoomSlot(parsedRoutine.RoomSLot);
      setFacultySlot(parsedRoutine.FacultySLot);
      setSectionSlot(parsedRoutine.SectionSLot);
    }

    const storedTeacherData = localStorage.getItem("teacherData");
    if (storedTeacherData) {
      setTeacherData(JSON.parse(storedTeacherData));
    }

    const storedClassStartTime = localStorage.getItem("classStartTime");
    const storedClassDuration = localStorage.getItem("classDuration");
    const storedBreakSlot = localStorage.getItem("breakSlot");
    const storedBreakDuration = localStorage.getItem("breakDuration");
    setClassStartTime(storedClassStartTime || "");
    setClassDuration(storedClassDuration || "");
    setBreakSlot(storedBreakSlot || "");
    setBreakDuration(storedBreakDuration || "");
  }, []);

  const downloadRoomExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const headerRow = worksheet.addRow([
      "ROOM_NO",
      "SLOT_AVAILABILITY",
      "ROOM_TYPE",
      "ROOM_CAPACITY",
      "PREFERRED_SLOTS",
    ]);

    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
    });

    Object.entries(roomSlot).forEach(([roomNo, roomData]) => {
      worksheet.addRow([
        roomNo,
        roomData.SLOT_AVAILABILITY,
        roomData.ROOM_TYPE,
        roomData.ROOM_CAPACITY,
        roomData.PREFERRED_SLOTS,
      ]);
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "room_data_updated.xlsx");
    });
  };

  const downloadSectionExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const headerRow = worksheet.addRow([
      "DIVISION_TITLE",
      "SLOT_AVAILABILITY",
      "STUDENT_STRENGTH",
      "ALLOCATED_ROOM",
      "PREFERRED_SLOTS",
    ]);

    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
    });

    Object.entries(sectionSlot).forEach(([sectionName, sectionData]) => {
      worksheet.addRow([
        sectionName,
        sectionData.SLOT_AVAILABILITY,
        sectionData.STUDENT_STRENGTH,
        sectionData.ALLOCATED_ROOM,
        sectionData.PREFERRED_SLOTS,
      ]);
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "section_data_updated.xlsx");
    });
  };

  const downloadFacultyExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const headerRow = worksheet.addRow([
      "FACULTY_ID",
      "GRADE",
      "FACULTY_NAME",
      "SLOT_AVAILABILITY",
      "SLOT_AVAILABLE",
      "PREFERRED_SLOTS",
    ]);

    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
    });

    Object.entries(facultySlot).forEach(([facultyId, facultyData]) => {
      worksheet.addRow([
        facultyId,
        facultyData.GRADE,
        facultyData.FACULTY_NAME,
        facultyData.SLOT_AVAILABILITY,
        facultyData.SLOT_AVAILABLE,
        facultyData.PREFERRED_SLOTS,
      ]);
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "faculty_data_updated.xlsx");
    });
  };

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();

    groupKeys.forEach((groupKey) => {
      const worksheet = workbook.addWorksheet(`${groupKey}`);

      const headerRow = [
        "Day / Time",
        ...slotNumbers.map((slot, index) => {
          return generateSlotTime(
            classStartTime,
            index,
            parseInt(classDuration),
            parseInt(breakDuration),
            parseInt(breakSlot)
          );
        }),
      ];

      headerRow.splice(
        parseInt(breakSlot) + 1,
        0,
        generateBreakTime(
          classStartTime,
          parseInt(breakSlot),
          parseInt(classDuration)
        )
      );

      worksheet.addRow(headerRow);

      Object.keys(routine[groupKey]).forEach((dayKey, dayIndex) => {
        const row = [
          daysOfWeek[parseInt(dayKey.slice(-1))],
          ...slotNumbers.map((slot, slotIndex) => {
            const slotData = routine[groupKey][dayKey][slot];
            if (slotData) {
              const subject = slotData.split("[")[0];
              const teacherCode = slotData.match(/\[(.*?)\]/)?.[1];
              return `${subject} - ${teacherCode}`;
            } else {
              return "-";
            }
          }),
        ];

        row.splice(parseInt(breakSlot) + 1, 0, "Break");

        worksheet.addRow(row);
      });

      for (let i = 0; i < 4; i++) {
        worksheet.addRow([]);
      }

      const facultyHeader = ["Faculty", "Allocated Subject"];
      worksheet.addRow(facultyHeader);

      const teacherSubjectSet = new Set();

      Object.keys(teacherSchedule).forEach((teacher) => {
        teacherSchedule[teacher].forEach((schedule) => {
          if (schedule.section === groupKey) {
            const teacherCode = schedule.teacherCode;
            const teacherName = teacherData[teacherCode] || teacherCode;
            const teacherSubjectPair = `${teacherName} [${teacherCode}]`;

            if (!teacherSubjectSet.has(teacherSubjectPair)) {
              teacherSubjectSet.add(teacherSubjectPair);
              worksheet.addRow([teacherSubjectPair, schedule.subject]);
            }
          }
        });
      });

      headerRow.forEach((_, colIndex) => {
        if (colIndex + 1 <= worksheet.columnCount) {
          const cell = worksheet.getRow(1).getCell(colIndex + 1);
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "2873fe" },
          };
          cell.font = {
            color: { argb: "FFFFFFFF" },
            bold: true,
          };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        }
      });

      facultyHeader.forEach((_, colIndex) => {
        const cell = worksheet
          .getRow(worksheet.rowCount - teacherSubjectSet.size)
          .getCell(colIndex + 1);
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "2873fe" },
        };
        cell.font = {
          color: { argb: "FFFFFFFF" },
          bold: true,
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      worksheet.eachRow((row, rowIndex) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });

        if (rowIndex > 1 && rowIndex <= daysOfWeek.length + 1) {
          const dayCell = row.getCell(1);
          dayCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "fdc548" },
          };
          dayCell.font = {
            color: { argb: "FF000000" },
            bold: true,
          };
          dayCell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };

          if (parseInt(breakSlot) + 2 <= row.cellCount) {
            const breakCell = row.getCell(parseInt(breakSlot) + 2);
            breakCell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "bbff5b" },
            };
            breakCell.font = {
              color: { argb: "FF000000" },
              bold: true,
            };
            breakCell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          }
        }
      });
    });

    const teacherWorksheet = workbook.addWorksheet("Faculty Schedule");

    const teacherWsData = [["Faculty", "Day", "Time", "Section", "Subject"]];

    Object.keys(teacherSchedule).forEach((teacher) => {
      teacherSchedule[teacher].forEach((schedule) => {
        const teacherCode = schedule.teacherCode;
        const teacherName = teacherData[teacherCode] || teacherCode;
        teacherWsData.push([
          `${teacherName} [${teacherCode}]`,
          schedule.day,
          `${generateSlotTime(
            classStartTime,
            schedule.slot - 1,
            parseInt(classDuration),
            parseInt(breakDuration),
            parseInt(breakSlot)
          )}`,
          schedule.section,
          schedule.subject,
        ]);
      });
      teacherWsData.push(["", "", "", "", ""]);
    });

    teacherWorksheet.addRows(teacherWsData);

    teacherWsData[0].forEach((_, colIndex) => {
      if (colIndex + 1 <= teacherWorksheet.columnCount) {
        const cell = teacherWorksheet.getRow(1).getCell(colIndex + 1);
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "2873fe" },
        };
        cell.font = {
          color: { argb: "FFFFFFFF" },
          bold: true,
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
    });

    teacherWorksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Routine.xlsx";
      link.click();
    });
  };

  if (!routine) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-700">
        <div className="py-6 px-7 w-full rounded-2xl bg-white md:w-2/5">
          <p className="flex text-2xl text-gray-900 font-bold pb-2 mb-4 border-b-2 border-gray-700">
            Display Routine
          </p>
          <div>No Routine Data Available.</div>
        </div>
      </div>
    );
  }

  const totalSlots = routine["Total Slots"];
  const slotNumbers = Array.from({ length: totalSlots }, (_, i) => i);
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const generateSlotTime = (
    startTime,
    slotIndex,
    classDuration,
    breakDuration,
    breakSlot
  ) => {
    const [startHour, startMinute] = startTime.split(":").map(Number);

    const totalMinutes = startHour * 60 + startMinute;

    let additionalBreak = 0;
    if (slotIndex >= breakSlot) {
      additionalBreak = parseInt(breakDuration);
    }

    const newTimeMinutes =
      totalMinutes + slotIndex * classDuration + additionalBreak;

    const newHour = Math.floor(newTimeMinutes / 60);
    const newMinute = newTimeMinutes % 60;

    const formattedHour = String(newHour).padStart(2, "0");
    const formattedMinute = String(newMinute).padStart(2, "0");

    return `${formattedHour}:${formattedMinute}`;
  };

  const generateBreakTime = (startTime, slotIndex, classDuration) => {
    const [startHour, startMinute] = startTime.split(":").map(Number);

    const totalMinutes = startHour * 60 + startMinute;

    const newTimeMinutes = totalMinutes + slotIndex * classDuration;

    const newHour = Math.floor(newTimeMinutes / 60);
    const newMinute = newTimeMinutes % 60;

    const formattedHour = String(newHour).padStart(2, "0");
    const formattedMinute = String(newMinute).padStart(2, "0");

    return `${formattedHour}:${formattedMinute}`;
  };

  const groupKeys = Object.keys(routine).filter(
    (key) =>
      key !== "Total Slots" &&
      key !== "Faculty Fitness" &&
      key !== "Room Fitness" &&
      key !== "RoomSLot" &&
      key !== "FacultySLot" &&
      key !== "SectionSLot"
  );

  const teacherSchedule = {};

  groupKeys.forEach((groupKey) => {
    Object.keys(routine[groupKey]).forEach((dayKey, dayIndex) => {
      slotNumbers.forEach((slot) => {
        const slotData = routine[groupKey][dayKey][slot];
        if (slotData) {
          const teacherCodeMatch = slotData.match(/\[(.*?)\]/);
          if (teacherCodeMatch) {
            const teacherCode = teacherCodeMatch[1];
            const teacherName = teacherData[teacherCode];
            if (teacherName) {
              if (!teacherSchedule[teacherName]) {
                teacherSchedule[teacherName] = [];
              }
              teacherSchedule[teacherName].push({
                day: daysOfWeek[parseInt(dayKey.slice(-1))],
                slot: slot + 1,
                subject: slotData.split("[")[0],
                section: groupKey,
                teacherCode: teacherCode,
              });
            }
          }
        }
      });
    });
  });

  return (
    <div className="overflow-x-hidden">
      <div className="flex flex-wrap justify-between items-center m-4 mb-8">
        <h1 className="text-gray-900 bg-white font-bold text-3xl">
          Preference Retained: {parseFloat(routine["Faculty Fitness"]).toFixed(2)}%
        </h1>
        <div className="flex flex-wrap justify-between items-center">
          <button
            onClick={downloadRoomExcel}
            className="flex items-center mr-2 text-base cursor-pointer font-medium text-center bg-gray-700 text-white mt-4 px-6 py-2.5 border-none outline-none rounded-md hover:bg-gray-600"
          >
            Room Data <MdOutlineFileDownload className="text-2xl ml-2" />
          </button>
          <button
            onClick={downloadSectionExcel}
            className="flex items-center mr-2 text-base cursor-pointer font-medium text-center bg-gray-700 text-white mt-4 px-6 py-2.5 border-none outline-none rounded-md hover:bg-gray-600"
          >
            Section Data <MdOutlineFileDownload className="text-2xl ml-2" />
          </button>
          <button
            onClick={downloadFacultyExcel}
            className="flex items-center mr-2 text-base cursor-pointer font-medium text-center bg-gray-700 text-white mt-4 px-6 py-2.5 border-none outline-none rounded-md hover:bg-gray-600"
          >
            Faculty Data <MdOutlineFileDownload className="text-2xl ml-2" />
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center mr-2 text-base cursor-pointer font-medium text-center bg-gray-700 text-white mt-4 px-6 py-2.5 border-none outline-none rounded-md hover:bg-gray-600"
          >
            Routine Data <MdOutlineFileDownload className="text-2xl ml-2" />
          </button>
        </div>
      </div>

      {groupKeys.map((groupKey) => (
        <div key={groupKey} className="m-4 overflow-x-scroll">
          <h2 className="text-xl font-semibold mb-2">{groupKey}</h2>
          <table className="table-auto w-full mb-10 border-collapse border border-gray-900 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="border border-gray-100 p-2">Day / Time</th>
                {slotNumbers.map((slot, index) => (
                  <React.Fragment key={slot}>
                    <th className="border border-gray-100 p-2">
                      {generateSlotTime(
                        classStartTime,
                        index,
                        parseInt(classDuration),
                        parseInt(breakDuration),
                        parseInt(breakSlot)
                      )}
                    </th>
                    {index + 1 === parseInt(breakSlot) && (
                      <th className="border border-gray-100 p-2">
                        {generateBreakTime(
                          classStartTime,
                          index + 1,
                          parseInt(classDuration)
                        )}
                      </th>
                    )}
                  </React.Fragment>
                ))}
              </tr>
            </thead>

            <tbody>
              {Object.keys(routine[groupKey]).map((dayKey, dayIndex) => (
                <tr
                  key={dayKey}
                  className={dayIndex % 2 === 0 ? "bg-gray-100" : "bg-gray-300"}
                >
                  <td className="bg-gray-900 text-white font-semibold border border-gray-100 p-2">
                    {daysOfWeek[parseInt(dayKey.slice(-1))]}
                  </td>
                  {slotNumbers.map((slot, slotIndex) => (
                    <React.Fragment key={slot}>
                      <td className="border border-black p-2 min-w-40">
                        {routine[groupKey][dayKey][slot] ? (
                          <>
                            <div>
                              {routine[groupKey][dayKey][slot].split("[")[0]}
                            </div>
                            <div>
                              {
                                teacherData[
                                  routine[groupKey][dayKey][slot]
                                    .split("[")[1]
                                    ?.replace(/[\[\]']/g, "")
                                ]
                              }
                            </div>
                            <div>
                              [
                              {routine[groupKey][dayKey][slot]
                                .split("[")[1]
                                ?.replace(/[\[\]']/g, "")}
                              ]
                            </div>
                          </>
                        ) : (
                          "-"
                        )}
                      </td>

                      {slotIndex + 1 === parseInt(breakSlot) && (
                        <td className="font-semibold bg-gray-700 text-white border border-gray-100 p-2">
                          Break
                        </td>
                      )}
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="m-4 overflow-x-scroll">
        <h2 className="text-lg font-semibold mb-2">Faculty Schedule</h2>
        <table className="table-auto w-full mb-10 border-collapse border border-black rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="border border-gray-100 p-2">Faculty</th>
              <th className="border border-gray-100 p-2">Day</th>
              <th className="border border-gray-100 p-2">Time</th>
              <th className="border border-gray-100 p-2">Section</th>
              <th className="border border-gray-100 p-2">Subject</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(teacherSchedule).map((teacher, index) => (
              <React.Fragment key={teacher}>
                {teacherSchedule[teacher].map((schedule, scheduleIndex) => (
                  <tr
                    key={`${teacher}-${scheduleIndex}`}
                    className={index % 2 === 0 ? "bg-gray-100" : "bg-gray-300"}
                  >
                    {scheduleIndex === 0 && (
                      <td
                        className="text-xl font-bold border border-black p-2"
                        rowSpan={teacherSchedule[teacher].length}
                      >
                        {teacher} - {schedule.teacherCode}
                      </td>
                    )}
                    <td className="border border-black p-2">{schedule.day}</td>
                    <td className="border border-black p-2">
                      {generateSlotTime(
                        classStartTime,
                        schedule.slot - 1,
                        parseInt(classDuration),
                        parseInt(breakDuration),
                        breakSlot
                      )}
                    </td>
                    <td className="border border-black p-2">
                      {schedule.section}
                    </td>
                    <td className="border border-black p-2">
                      {schedule.subject}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Display;
