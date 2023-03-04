"use client";
import { partySize as partySizes, times } from "../../../../data";
import DatePicker from "react-datepicker";
import { useState } from "react";
import useAvailabilities from "../../../../hooks/useAvailabilities";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import {
  convertToDisplayTime,
  Time,
} from "../../../../utils/convertToDisplayTime";
export default function ReservationCard({
  openTime,
  closeTime,
  slug,
}: {
  openTime: string;
  closeTime: string;
  slug: string;
}) {
  const { data, loading, error, fetchAvailabilities } = useAvailabilities();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState(openTime);
  const [partySize, setPartySize] = useState("2");
  const [day, setDay] = useState(new Date().toISOString().split("T")[0]);

  const handleChangeDate = (date: Date | null) => {
    if (date) {
      setDay(date.toISOString().split("T")[0]);
      return setSelectedDate(date);
    }
    return setSelectedDate(null);
  };
  //Every-time we click on the button we want to call fetchAvailabilities
  const handleClick = () => {
    fetchAvailabilities({
      slug,
      day,
      time,
      partySize,
    });
  };

  //this function filters a given array of time objects to return only the ones that fall within a specified open window of a restaurant.
  const filterTimeByRestaurantOpenWindow = () => {
    //window is the time from when they are open till they close.
    //initializes  to an empty array.
    const timesWithinWindow: typeof times = [];
    // variable called isWithinWindow is defined and initialized to false.
    let isWithinWindow = false;
    //forEach method is called on the times array.
    times.forEach((time) => {
      //If the time object's time property matches the openTime value, the isWithinWindow variable is set to true.
      if (time.time === openTime) {
        isWithinWindow = true;
      }
      // If isWithinWindow is true, the current time object is pushed onto the timesWithinWindow array.
      if (isWithinWindow) {
        timesWithinWindow.push(time);
      }
      //If the time object's time property matches the closeTime value, the isWithinWindow variable is set back to false.
      if (time.time === closeTime) {
        isWithinWindow = false;
      }
    });
    //timesWithinWindow array is returned from the function.
    return timesWithinWindow;
  };

  return (
    <div className="fixed w-[15%] bg-white rounded p-3 shadow">
      <div className="text-center border-b pb-2 font-bold">
        <h4 className="mr-7 text-lg">Make a Reservation</h4>
      </div>
      <div className="my-3 flex flex-col">
        <label htmlFor="">Party size</label>
        <select
          name=""
          className="py-3 border-b font-light"
          id=""
          value={partySize}
          onChange={(e) => setPartySize(e.target.value)}
        >
          {partySizes.map((size) => (
            <option value={size.value}>{size.label}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleChangeDate}
            className="py-3 border-b font-light text-reg w-24"
            dateFormat="MMMM d"
            wrapperClassName="w-[48%]"
          />
        </div>

        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Time</label>
          <select
            name=""
            id=""
            className="py-3 border-b font-light"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            {/* Now it will dynamically show the different time options based on the window of the restaurant.  */}
            {filterTimeByRestaurantOpenWindow().map((time) => (
              <option value={time.time}>{time.displayTime}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <button
          className="bg-red-600 rounded w-full px-4 text-white font-bold h-16"
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? <CircularProgress color="inherit" /> : "Find a Time"}
        </button>
      </div>
      {data && data.length ? (
        <div className="mt-4">
          <p className="text-reg">Select a Time</p>
          <div className="flex flex-wrap mt-2">
            {data.map((time) => {
              return time.available ? (
                <Link
                  href={`/reserve/${slug}?date=${day}T${time.time}&partySize=${partySize}`}
                  className="bg-red-600 cursor-pointer p-2 w-24 text-center text-white mb-3 rounded mr-3"
                >
                  <p className="text-sm font-bold">
                    {convertToDisplayTime(time.time as Time)}
                  </p>
                </Link>
              ) : (
                <p className="bg-gray-300 p-2 w-24 mb-3 rounded mr-3"></p>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
