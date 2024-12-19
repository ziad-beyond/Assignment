export default async function ItemDetails({ params }) {
  const { itemID } = params;
  const response = await fetch(`https://fakestoreapi.com/products/${itemID}`);
  const item = await response.json();

  return (
    <>

      <div className="flex justify-center gap-3 w-[100vw] h-screen max-sm:h-screen p-20 shadow-2xl max-sm:flex-wrap  ">
      <figure>
            <img src={item.image} alt={item.title} className="h-[40vh] w-[50vw] max-sm:w-full " />
          </figure>
        <div className="card card-compact  h-fit w-full shadow-xl ">
          <div className="card-body  ">
            <h2 className="card-title font-extrabold ">{item.title}</h2>
            <p className="text-base flex text-red-900 ">{item.price}$</p>
            <p className="text-base flex font-light ">{item.description}</p>
            <div className="card-actions ">
              <button className="btn btn-info">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
