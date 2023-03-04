import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { times } from "../../../../data";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //extract everything that we need from the query parameter
  //for that we will destructure everything from req query
  const { slug, day, time, partySize } = req.query as {
    slug: string;
    day: string;
    time: string;
    partySize: string;
  };

  if (!day || !time || !partySize) {
    return res.status(400).json({
      errorMessage: "Invalid data provided",
    });
  }

  //Step1: Determine the Search Times
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
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      tables: true,
      open_time: true,
      close_time: true,
    },
  });
  if (!restaurant) {
    return res.status(400).json({
      errorMessage: "Invalid data provided",
    });
  }

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
  // step7: Determining if a time slot is available based on the tables and party size.
  const availabilities = searchTimesWithTables
    .map((t) => {
      const sumSeats = t.tables.reduce((sum, table) => {
        return sum + table.seats;
      }, 0);

      return {
        time: t.time,
        available: sumSeats >= parseInt(partySize),
      };
    }) //Step 8: Filter out that are outside of opening window.
    .filter((availability) => {
      const timeIsAfterOpeningHour =
        new Date(`${day}T${availability.time}`) >=
        new Date(`${day}T${restaurant.open_time}`);
      const timeIsBeforeClosingHour =
        new Date(`${day}T${availability.time}`) <=
        new Date(`${day}T${restaurant.close_time}`);

      return timeIsAfterOpeningHour && timeIsBeforeClosingHour;
    });

  

  // return res.json({
  //   searchTimes,
  //   bookings,
  //   bookingTablesObj,
  //   tables,
  //   searchTimesWithTables,
  // });
  return res.json(
    availabilities,
  );
}

// http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/availability?day=2023-05-27&time=15:00:00.000Z&partySize=8
// http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/availability?day=2023-05-27&time=15:00:00.000Z&partySize=8
