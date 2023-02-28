import Header from "./components/Header";
import RestaurantCard from "./components/RestaurantCard";
import { Cuisine, Location, PRICE, PrismaClient } from "@prisma/client";

//defining an interface named RestaurantCardType
export interface RestaurantCardType {
  id: number;
  name: string;
  main_image: string;
  cuisine: Cuisine;
  location: Location;
  price: PRICE;
  slug: string;
}

const prisma = new PrismaClient();

//(): Promise<RestaurantCardType[]>: This part defines the function's input parameters. In this case, the function takes no parameters, so the parentheses are empty. The function returns a Promise object that resolves to an array of RestaurantCardType objects.
//It is common to use the prefix "fetch" for functions that retrieve data from an external source.
const fetchRestaurants = async (): Promise<RestaurantCardType[]> => {
  //uses the Prisma ORM (Object-Relational Mapping) library to retrieve a list of restaurants from a database.  The select field determines which columns are included in the result.
  const restaurants = await prisma.restaurant.findMany({
    select: {
      id: true,
      name: true,
      main_image: true,
      cuisine: true,
      slug: true,
      location: true,
      price: true,
    },
  });
  // returns the array of restaurant objects obtained from the database query.
  return restaurants;
};

export default async function Home() {
  // this line of code retrieves a list of restaurants from a database using the fetchRestaurants function, 
  //and assigns the resulting array of restaurant objects to a constant variable named restaurants. 
  //The code waits for the fetchRestaurants function to complete before continuing with the rest of the code, 
  //to ensure that the restaurants variable is assigned the correct value.
  const restaurants = await fetchRestaurants();
  return (
    <main>
      <Header />
      <div className="py-3 px-36 mt-10 flex flex-wrap justify-center">
        {/* iterate over the restaurants and then pass it to the restaurant card */}
        {restaurants.map((restaurant) => (
          <RestaurantCard restaurant={restaurant} />
        ))}
      </div>
    </main>
  );
}
