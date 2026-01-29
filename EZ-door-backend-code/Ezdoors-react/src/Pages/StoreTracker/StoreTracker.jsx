import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllStores } from "../../Thunks/Thunks";

// 🔶 Utility to highlight matching keyword
const HighlightMatch = ({ text, keyword }) => {
  if (!keyword) return <>{text}</>;

  const regex = new RegExp(`(${keyword})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <mark key={index} className="bg-yellow-300 text-black px-1 rounded">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
};

export default function StoreTracker() {
  const dispatch = useDispatch();
  const stores = useSelector((state) => state.auth?.all_stores);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getAllStores());
  }, [dispatch]);

  // Filter stores based on city or pincode
  const filteredStores = stores?.data?.filter(
    (store) =>
      store.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.pincode.includes(searchTerm)
  );

  return (
    <section>
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Find Nearby EZ-Doors Shops
        </h1>

        {/* Input: Location Search */}
        <div className="max-w-xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Enter your city or pincode..."
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-red-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
            onClick={() => setSearchTerm("")}
          >
            Clear
          </button>
        </div>

        {/* Store List */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredStores?.length > 0 ? (
            filteredStores.map((store) => (
              <div
                key={store._id}
                className="bg-white p-6 rounded-lg shadow border border-gray-200"
              >
                <h2 className="text-lg font-semibold">
                  EZ-Doors Store -{" "}
                  <HighlightMatch text={store.city} keyword={searchTerm} />
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  <HighlightMatch text={store.address} keyword={searchTerm} />
                  <br />
                  <HighlightMatch
                    text={store.city}
                    keyword={searchTerm}
                  />, {store.state}{" "}
                  <HighlightMatch text={store.pincode} keyword={searchTerm} />
                  <br />
                  Phone: +91 {store.phone}
                </p>
              </div>
            ))
          ) : (
            <p className="col-span-2 text-center text-gray-500">
              No stores found for "{searchTerm}"
            </p>
          )}
        </div>
      </main>
    </section>
  );
}
