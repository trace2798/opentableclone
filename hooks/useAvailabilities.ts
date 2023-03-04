import axios from "axios";
import { useState } from "react";

// declares a function called useAvailabilities. This function returns an object that contains the state variables and a function for
//fetching availability data.
export default function useAvailabilities() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState<{time: string; available: boolean}[] | null>(null);
  // function to make the axios request.
  //The "fetchAvailabilities" function is asynchronous function that takes an object containing four parameters: 
  //"slug", "partySize", "day", and "time". These parameters are used to construct the API URL and request parameters for fetching availability data from the restaurant API.
  const fetchAvailabilities = async ({
    slug,
    partySize,
    day,
    time,
  }: {
    slug: string;
    partySize: string;
    day: string;
    time: string;
  }) => {
    //"loading" state variable is set to "true" to indicate that a request is in progress.
    setLoading(true);

    try {
      // request is made using the "axios" library to the restaurant API URL with the specified parameters.
      //If the request is successful, the "loading" state variable is set to "false", and the "data" state variable is set to the response data.
      //If the request fails, the "loading" state variable is set to "false", and the "error" state variable is set to the error message returned from the API response.
      const response = await axios.get(
        `http://localhost:3000/api/restaurant/${slug}/availability`,
        {
          params: {
            day,
            time,
            partySize,
          },
        }
      );
      console.log(response);
      setLoading(false);
      setData(response.data);
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.errorMessage);
    }
  };
  //returns an object that contains the "loading", "data", "error" state variables, and the "fetchAvailabilities" function for fetching availability data.

  return { loading, data, error, fetchAvailabilities };
}


//this code defines a custom React Hook that provides an easy way to fetch availability data from a restaurant API and manage the loading and error states in a React component.