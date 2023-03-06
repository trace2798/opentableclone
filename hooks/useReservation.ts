//this code exports a custom React hook called useReservation that can be used to make reservations at a restaurant.
import { Dispatch, SetStateAction, useState } from "react";
import axios from "axios";

export default function useReservation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // createReservation makes an asynchronous POST request to a REST API endpoint using the axios library. The endpoint is defined using the slug parameter passed to the function, and additional parameters are passed in the params object. The response data is returned from the function if the request is successful.
  const createReservation = async ({
    slug,
    partySize,
    day,
    time,
    bookerFirstName,
    bookerLastName,
    bookerPhone,
    bookerEmail,
    bookerOccasion,
    bookerRequest,
    setDidBook,
  }: {
    slug: string;
    partySize: string;
    day: string;
    time: string;
    bookerFirstName: string;
    bookerLastName: string;
    bookerPhone: string;
    bookerEmail: string;
    bookerOccasion: string;
    bookerRequest: string;
    setDidBook: Dispatch<SetStateAction<boolean>>;
  }) => {
    //"loading" state variable is set to "true" to indicate that a request is in progress.
    setLoading(true);

    try {
      // the first parameter will be the body and the second parameter will be query parameters.
      const response = await axios.post(
        `http://localhost:3000/api/restaurant/${slug}/reserve`,
        {
          bookerFirstName,
          bookerLastName,
          bookerPhone,
          bookerEmail,
          bookerOccasion,
          bookerRequest,
        },
        {
          params: {
            day,
            time,
            partySize,
          },
        }
      );
      setLoading(false);
      setDidBook(true);
      return response.data;
    } catch (error: any) {
      //If an error occurs during the request, the catch block sets the error state variable to the error message returned by the API, and sets the loading flag to false.
      setLoading(false);
      setError(error.response.data.errorMessage);
    }
  };
  // useReservation hook returns an object with three properties - loading, error, and createReservation
  return { loading, error, createReservation };
}
