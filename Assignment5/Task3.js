// Asynchronous function to fetch data from a Public API
const fetchData = async (url) => {
  try {
    // Await the response from the fetch call
    const response = await fetch(url);
    // Check if the response is not OK
    if (!response.ok) {
      // Throw error with the response status
      throw new Error(
        ` HTTP error! status: Response status: ${response.status}`
      );
    }
    // Convert the response to JSON format
    const json = await response.json();
    // Handle and display any errors that occur during the fetch or JSON conversion
  } catch (error) {
    console.error("Error fetching data: ", error.message);
  }
};

// The Public API
const Url =
  "https://api.openweathermap.org/data/2.5/weather?q=Riyadh&appid=YOUR_API_KEY";
fetchData(Url);
