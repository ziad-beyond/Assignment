import Link from "next/link";

export default async function Items() {
  const response = await fetch('https://fakestoreapi.com/products');
  const items = await response.json();

  return (
    <>
      <div className="flex justify-center py-7">
        <h1 className="font-bold text-2xl">All Items</h1>
      </div>
      <ul className="flex justify-center flex-wrap gap-4 p-7">
        {items.map((item) => (
          <div key={item.id} className="card card-compact   w-96 shadow-xl">
            <figure>
              <img src={item.image} alt={item.title} className="h-[50vh] w-full" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{item.title}</h2>
              <p className="text-base">{item.price}$</p>
              <div className="card-actions justify-center ">
                <Link href={`/items/${item.id}`}>
                  <button className="btn btn-wide text-white btn-info">Show</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </ul>
    </>
  );
}
