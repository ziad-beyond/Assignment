import PropTypes from "prop-types";

// Receives image, title, and year as props to display movie details.
const Card = ({ image, title, year }) => {
  return (
    <div className="card bg-black text-white w-96 shadow-xl">
      <figure>
        <img src={image} alt={title} className="w-full h-[60vh]" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>Year: {year}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary text-white">Show</button>
        </div>
      </div>
    </div>
  );
};
// Prop validation for Card component
Card.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
};

export default Card;
