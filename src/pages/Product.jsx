// import React, { useContext } from "react";
// import { FaStar } from "react-icons/fa";
// import { NavLink, useLocation } from "react-router-dom";
import SingleProductInfo from "./SingleProductInfo";
// import { UserContext } from "../context/ContextApi";
// import Loader from "./Loader";

// const Product = () => {
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   const plantName = searchParams.get("plantName");
//   const plantId = searchParams.get("plantId");
//   const { product, isPending, searchLoading, ErrorDataProduct } = useContext(UserContext);

//   return (
//     <>
//       {plantName && plantId ? (
//         <SingleProductInfo plantName={plantName} plantId={plantId} />
//       ) : (
//         <section className="section-product">
//           <div className="container">
//             <div className={`upperSection flex ${ErrorDataProduct ? "hidden" : ""}`}>
//               {!ErrorDataProduct && (
//                 <>
//                   <h2 className="Heading">Explore Our Products</h2>
//                   <p className="subHeading">Discover a variety of handpicked plants perfect for your garden passion.</p>
//                 </>
//               )}
//             </div>

//             {isPending || searchLoading ? (
//               <div className="center"><Loader /></div>
//             ) : (
//               <ul className={`productContainer grid ${ErrorDataProduct ? "" : "grid--col-4"}`}>
//                 {ErrorDataProduct ? (
//                   <h2 className="center errorMessageProduct">{ErrorDataProduct.toUpperCase()}</h2>
//                 ) : (
//                   product?.map((item, index) => (
//                     <li key={index} className="card flex">
//                       <div className="imgSection">
//                         <img src={item.image_src} alt={item.plant_name} />
//                       </div>
//                       <div className="product-info flex">
//                         <h2 className="productName">{item.plant_name}</h2>
//                         <div className="price flex">
//                           <h2>₹{item.total_price}</h2>
//                           <h3 className="selling-price">₹{item.selling_price}</h3>
//                         </div>
//                         <div className="rating">
//                           {Array.from({ length: item.rating }, (_, i) => <FaStar key={i} />)}
//                         </div>
//                         <div className="button">
//                           <NavLink to={`/products?plantName=${item.plant_name}&plantId=${item.id}`} className="btn-common">
//                             View Product
//                           </NavLink>
//                         </div>
//                       </div>
//                     </li>
//                   ))
//                 )}
//               </ul>
//             )}
//           </div>
//         </section>
//       )}
//     </>
//   );
// };

// export default Product;

import React, { useContext } from "react";
import { FaStar } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import { UserContext } from "../context/ContextApi";
import Loader from "./Loader";
// import FooterApi from "../../api/footer.json";

const Product = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const plantName = searchParams.get("plantName");
  const plantId = searchParams.get("plantId");
  const { product, isPending, searchLoading, ErrorDataProduct } =
    useContext(UserContext);

  return (
    <>
      {plantName && plantId ? (
        <SingleProductInfo plantName={plantName} plantId={plantId} />
      ) : (
        <section className="py-16 bg-gray-50 mt-20">
          <div className="container mx-auto px-4">
            <div
              className={ErrorDataProduct ? "" : "flex flex-col items-center"}
            >
              {!ErrorDataProduct && (
                <>
                  <h2 className="text-3xl font-semibold text-gray-800">
                    Explore Our Products
                  </h2>
                  <p className="text-lg text-gray-600 mt-2">
                    Discover a variety of Handpicked Items perfect for your
                    garden passion.
                  </p>
                </>
              )}
            </div>

            {isPending || searchLoading ? (
              <div className="flex justify-center mt-8">
                <Loader />
              </div>
            ) : (
              <ul
                className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8 ${
                  ErrorDataProduct ? "" : "justify-center"
                }`}
              >
                {ErrorDataProduct ? (
                  <h2 className="text-center text-xl font-bold text-red-600">
                    {ErrorDataProduct.toUpperCase()}
                  </h2>
                ) : (
                  product?.map((item, index) => (
                    <li
                      key={index}
                      className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all"
                    >
                      <div className="relative w-full h-64 overflow-hidden rounded-lg">
                        <img
                          src={item.image_src}
                          alt={item.plant_name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="mt-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {item.plant_name}
                        </h3>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-lg font-bold text-green-600">
                            ₹{item.selling_price}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            ₹{item.total_price}
                          </span>
                        </div>
                        <div className="flex items-center mt-2">
                          {Array.from({ length: item.rating }, (_, i) => (
                            <FaStar
                              key={i}
                              className="text-yellow-500 text-xs"
                            />
                          ))}
                        </div>
                        <div className="mt-4">
                          <NavLink
                            to={`/products?plantName=${item.plant_name}&plantId=${item.id}`}
                            className="w-full inline-block py-2 px-4 text-center text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all"
                          >
                            View Product
                          </NavLink>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default Product;
