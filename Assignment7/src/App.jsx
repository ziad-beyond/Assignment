import { useState, useEffect } from "react";
import Navbar from "./Components/Navbar";
import Card from "./Components/Card";
import Footer from "./Components/Footer";
import { Hero } from "./Components/Hero";

function App() {
  // Initial movie data
  const initialMovies = [
    {
      title: "Inception",
      year: 2010,
      image:
        "https://i.pinimg.com/736x/7c/22/18/7c221896796b9c3bc1f462f68957402d.jpg",
    },
    {
      title: "The Dark Knight",
      year: 2008,
      image:
        "https://i.pinimg.com/474x/ea/a2/6e/eaa26e2c3bfa234c3cdd3c4d9fabad35.jpg",
    },
    {
      title: "Interstellar",
      year: 2014,
      image:
        "https://i.pinimg.com/474x/0b/34/ce/0b34ce2145b475247577a5d438a199b0.jpg",
    },
  ];
  // useState hooks to manage application state
  // List of movies
  const [movies, setMovies] = useState(initialMovies);
  // New movie being added
  const [newMovie, setNewMovie] = useState({ title: "", year: "", image: "" });
  // Validation error message
  const [error, setError] = useState("");
  // Search query
  const [search, setSearch] = useState("");
  // Filtered list of movies
  const [filteredMovies, setFilteredMovies] = useState(initialMovies);

  const handleAddMovie = () => {
    // Validate input fields
    if (!newMovie.title || !newMovie.year || !newMovie.image) {
      setError("All fields are required.");
      return;
    }

    const updatedMovies = [...movies, newMovie];
    setMovies(updatedMovies);
    setFilteredMovies(updatedMovies);
    // Reset input fields
    setNewMovie({ title: "", year: "", image: "" });
    // Clear error
    setError("");
    document.getElementById("my_modal_2").close();
  };

  // useEffect to filter movies based on search query
  useEffect(() => {
    const filtered = movies.filter((movie) =>
      movie.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredMovies(filtered);
  }, [search, movies]);

  return (
    <>
      <Navbar />
      <Hero />
      <div className="flex justify-between  px-10 bg-stone-900 max-sm:px-2">
        <h1 className="text-center font-bold text-lg mt-4 max-sm:text-xs">
          All Movies
        </h1>
        <div className="flex w-[40vw] gap-4 justify-center items-center">
          <input
            type="text"
            className="border border-gray-300 rounded px-3 py-2 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search By Movie Title"
          />
        </div>
        <button
          className="btn btn-primary text-white"
          onClick={() => document.getElementById("my_modal_2").showModal()}
        >
          Add Movie
        </button>

        <dialog id="my_modal_2" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add New Movie</h3>

            {error && <p className="text-red-500">{error}</p>}

            <input
              type="text"
              placeholder="Image URL"
              className="input input-bordered w-full mt-2"
              value={newMovie.image}
              onChange={(e) =>
                setNewMovie({ ...newMovie, image: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Title"
              className="input input-bordered w-full mt-2"
              value={newMovie.title}
              onChange={(e) =>
                setNewMovie({ ...newMovie, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Year"
              className="input input-bordered w-full mt-2"
              value={newMovie.year}
              onChange={(e) =>
                setNewMovie({ ...newMovie, year: e.target.value })
              }
            />
            <button
              className="btn btn-primary text-white mt-2"
              onClick={handleAddMovie}
            >
              Add
            </button>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>Close</button>
          </form>
        </dialog>
      </div>

      <div className="flex justify-center bg-stone-900">
        <hr className="bg-black mt-3 h-[1px] w-[99%]" />
      </div>

      <div className="flex justify-center bg-stone-900 flex-wrap gap-4 py-5">
        {filteredMovies.map((movie, index) => (
          <Card
            key={index}
            title={movie.title}
            year={movie.year}
            image={movie.image}
          />
        ))}
      </div>

      <Footer />
    </>
  );
}

export default App;
