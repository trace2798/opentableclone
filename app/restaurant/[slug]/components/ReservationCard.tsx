"use client";
import { partySize, times } from "../../../../data";
import DatePicker from "react-datepicker";
import { useState } from "react";

export default function ReservationCard({
  openTime,
  closeTime,
}: {
  openTime: string;
  closeTime: string;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const handleChangeDate = (date: Date | null) => {
    if (date) {
      return setSelectedDate(date);
    }
    return setSelectedDate(null);
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
        <select name="" className="py-3 border-b font-light" id="">
          {partySize.map((size) => (
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
          <select name="" id="" className="py-3 border-b font-light">
           {/* Now it will dynamically show the different time options based on the window of the restaurant.  */}
            {filterTimeByRestaurantOpenWindow().map((time) => (
              <option value={time.time}>{time.displayTime}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <button className="bg-red-600 rounded w-full px-4 text-white font-bold h-16">
          Find a Time
        </button>
      </div>
    </div>
  );
}
