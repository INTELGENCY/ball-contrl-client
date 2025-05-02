import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

function PostalCode({ setSelectedPostalCode }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const [postalCodes, setPostalCodes] = useState([]);
  const [selectedPostalCode, setPostalCode] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchPostcodes = async () => {
      if (searchTerm.trim()) {
        try {
          setLoading(true);
          const response = await axios.get(
            `https://api.postcodes.io/postcodes/${searchTerm}/autocomplete`
          );
          const postcodes = response.data.result || [];
          setPostalCodes(postcodes);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error("Error fetching matching postcodes:", error);
          setPostalCodes([]);
        }
      } else {
        setPostalCodes([]);
      }
    };

    fetchPostcodes();
  }, [searchTerm, setSearchParams]);

  const handleSelect = (postcode) => {
    setSelectedPostalCode(postcode);
    setPostalCode(postcode);
    setSearchTerm("");
    setPostalCodes([]);
  };

  return (
    <>
      <h3 className="font-semibold mt-5 text-gray-800 border-b-2 max-w-[40%]">
        Enter Postal Code
      </h3>
      <div className="flex items-center justify-center">
        <div className="relative w-full">
          <input
            id="search-input"
            className="block w-full px-4 py-2 text-gray-800 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Search postal codes"
            autoComplete="off"
            value={selectedPostalCode || searchTerm}
            onChange={(e) => {
              setSelectedPostalCode(""); // Clear selected postal code when typing
              setSearchTerm(e.target.value);
            }}
          />
          {loading ? (
            <>
              <ul className="absolute z-10 mt-2 bg-white rounded-md shadow-lg w-full border border-gray-300">
                <li className="px-4 py-2 text-gray-500">Loading...</li>
              </ul>
            </>
          ) : (
            <>
              {searchTerm && postalCodes.length > 0 && (
                <ul className="absolute z-10 mt-2 bg-white rounded-md shadow-lg w-full border border-gray-300">
                  {postalCodes.map((postcode, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelect(postcode)}
                    >
                      {postcode}
                    </li>
                  ))}
                </ul>
              )}
              {searchTerm && postalCodes.length === 0 && (
                <ul className="absolute z-10 mt-2 bg-white rounded-md shadow-lg w-full border border-gray-300">
                  <li className="px-4 py-2 text-gray-500">No matches found</li>
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default PostalCode;
