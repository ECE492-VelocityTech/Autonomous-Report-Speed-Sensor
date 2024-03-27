import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getYear } from "date-fns/getYear";
import { getMonth } from "date-fns/getMonth";
import { useState } from "react";
import moment from "moment";

interface CalendarProps {
    isSingleDay: boolean;
}

const Calendar = ({ isSingleDay }: CalendarProps) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const range = (start: number, end: number) => {
        return new Array(end - start).fill(null).map((d, i) => i + start);
    };
    const years = range(1990, getYear(new Date()) + 1);
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const onChange = (dates: [any, any]) => {
        const [start, end] = dates;
        if (isSingleDay) {
            sessionStorage.setItem(
                "startDate",
                moment(start).format().slice(0, 10)
            );
            sessionStorage.setItem(
                "endDate",
                moment(start).format().slice(0, 10)
            );
            setStartDate(start);
            setEndDate(start);
        } else {
            setStartDate(start);
            setEndDate(end);
            sessionStorage.setItem(
                "startDate",
                moment(start).format().slice(0, 10)
            );
            sessionStorage.setItem(
                "endDate",
                moment(end).format().slice(0, 10)
            );
        }
        const event = new Event("sessionStorageUpdated");
        window.dispatchEvent(event);
    };
    return (
        <>
            <DatePicker
                renderCustomHeader={({
                    date,
                    changeYear,
                    changeMonth,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                }) => (
                    <div
                        style={{
                            margin: 10,
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <button
                            onClick={decreaseMonth}
                            disabled={prevMonthButtonDisabled}
                        >
                            {"<"}
                        </button>
                        <select
                            value={getYear(date)}
                            onChange={({ target: { value } }) =>
                                changeYear(parseInt(value, 10))
                            }
                        >
                            {years.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <select
                            value={months[getMonth(date)]}
                            onChange={({ target: { value } }) =>
                                changeMonth(months.indexOf(value))
                            }
                        >
                            {months.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={increaseMonth}
                            disabled={nextMonthButtonDisabled}
                        >
                            {">"}
                        </button>
                    </div>
                )}
                selected={startDate}
                onChange={onChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                inline
                dateFormat="yyyy-MM-dd"
            />
        </>
    );
};

export default Calendar;
