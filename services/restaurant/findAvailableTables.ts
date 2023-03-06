import { PrismaClient, Table } from "@prisma/client";
import { NextApiResponse } from "next";
import { times } from "../../data";

const prisma = new PrismaClient();

export const findAvailabileTables = async ({
  time,
  day,
  res,
  restaurant,
}: 
{
  time: string;
  day: string;
  res: NextApiResponse;
  restaurant: {
    tables: Table[];
    open_time: string;
    close_time: string;
  };
}) => {
  const searchTimes = times.find((t) => {
    return t.time === time;
  })?.searchTimes;
  if (!searchTimes) {
    return res.status(400).json({
      errorMessage: "Invalid data provided",
    });
  }

  //Step2: Fetching the booking
  const bookings = await prisma.booking.findMany({
    where: {
      booking_time: {
        gte: new Date(`${day}T${searchTimes[0]}`),
        lte: new Date(`${day}T${searchTimes[searchTimes.length - 1]}`),
      },
    },
    select: {
      number_of_people: true,
      booking_time: true,
      tables: true,
    },
  });

  // step3:
  const bookingTablesObj: { [key: string]: { [key: number]: true } } = {};

  bookings.forEach((booking) => {
    bookingTablesObj[booking.booking_time.toISOString()] =
      booking.tables.reduce((obj, table) => {
        return {
          ...obj,
          [table.table_id]: true,
        };
      }, {});
  });
  //Step4: Fetch all tables at restaurant we are quering for
//   const restaurant = await prisma.restaurant.findUnique({
//     where: {
//       slug,
//     },
//     select: {
//       tables: true,
//       open_time: true,
//       close_time: true,
//     },
//   });
//   if (!restaurant) {
//     return res.status(400).json({
//       errorMessage: "Invalid data provided",
//     });
//   }

  const tables = restaurant.tables;

  // step5:Reformatting the searchTimes to include date, time and tables.
  const searchTimesWithTables = searchTimes.map((searchTime) => {
    return {
      date: new Date(`${day}T${searchTime}`),
      time: searchTime,
      tables,
    };
  });

  //Step 6:Filtering out tables if they are already booked.
  searchTimesWithTables.forEach((t) => {
    t.tables = t.tables.filter((table) => {
      if (bookingTablesObj[t.date.toISOString()]) {
        if (bookingTablesObj[t.date.toISOString()][table.id]) return false;
      }
      return true;
    });
  });

  return searchTimesWithTables;
};
