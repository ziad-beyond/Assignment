export const Hero = () => {
  return (
    <div className="hero bg-stone-900 min-h-[90vh]  text-white">
      <div className="hero-content flex-col  lg:flex-row-reverse px-2">
        <img
          src="https://i.pinimg.com/474x/a5/ab/08/a5ab089ac8fa9daac2391cf6be9eddb1.jpg"
          className="w-[30vw] max-sm:mt-0  rounded-lg shadow-2xl mr-10 max-sm:w-full"
        />
        <div>
          <h1 className="text-5xl px-7 font-bold">Z-Movies Website</h1>
          <p className="p-7">
            Z-Movies is an online streaming platform that offers various movies,
            TV shows, and anime. It provides high-quality streaming without
            registering or ads, making it a convenient option for movie
            enthusiasts.{" "}
          </p>
          <button className="btn btn-wide max-sm:ml-16 max-sm:mb-10 btn-primary mx-7 text-white mt-5">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};
