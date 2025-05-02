import React, { useEffect, useState } from "react";
import "./Store.css";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { Link } from "react-router-dom";
import { storeData } from "../../data/Home";

const StorePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const templateIds = [
    "c1d4ef56-8b38-475b-a17c-a4106848f838",
    "1f1fb597-632b-4569-a0db-c9eed58626ad",
    "6c26d045-7567-49f6-90c9-73fe65d9bd07",
    "de0e7b9c-eae1-4c07-b66a-1342d1cf8901",
    "d435e328-424b-4435-af42-3777dd7286a3",
    "b31ecb00-f883-4f36-b03a-0901f70bd68d",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProducts = await Promise.all(
          templateIds.map(async (id) => {
            try {
              const response = await fetch(
                `${import.meta.env.VITE_BASE_URL}/products/getOne/${id}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              if (!response.ok) {
                console.error(
                  "API response not OK for ID:",
                  id,
                  response.status
                );
                return null;
              }

              const data = await response.json();
              return { ...data, templateId: id };
            } catch (error) {
              console.error("Error fetching template ID:", id, error);
              return null;
            }
          })
        );

        const validProducts = fetchedProducts.filter(
          (product) => product !== null
        );

        // Combine API-fetched products with static storeData
        const combinedProducts = [
          ...validProducts,
          ...storeData.map((item, index) => ({
            id: `static-${index}`,
            previewUrl: item.image,
            link: item.link,
            title: item.title,
          })),
        ];

        setProducts(combinedProducts);
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <ClipLoader color="#fd86c8" />
        </div>
      ) : products.length > 0 ? (
        <div className="flex flex-col items-center relative my-[2rem]">
          <div className="relative flex items-center justify-center mt-8">
            <h1 className="uppercase text-2xl md:text-[40px] font-semibold mb-8">
              Product Collection
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-[90%] lg:w-[80%]">
            {products.map((product) => (
              <div
                key={product.id}
                className="relative group p-6 shadow-2xl hover:shadow-3xl hover:cursor-pointer bg-white border pt-2"
              >
                <img
                  src={product.previewUrl}
                  alt={product.title}
                  className="mb-2 m-auto object-cover h-[80%]"
                  height={230}
                  width={230}
                />
                <h3 className="text-[18px] font-bold text-blue-gray-800">
                  {product.title}
                </h3>
                <div className="absolute inset-0 bg-black bg-opacity-10 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="absolute top-0 right-0 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4">
                      Visit Store
                    </button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center my-4">No product data available.</div>
      )}
    </div>
  );
};

export default StorePage;
