import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, RefreshCw, Pencil, Trash2 } from "lucide-react";
import { api } from "../lib/api";

export default function Inventory() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const data = await api.get("/products");
        setInventory(data);
      } catch (apiError) {
        setError(apiError.message);
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, []);

  const filtered = inventory.filter((item) => {
    return (
      (item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())) &&
      (category === "All" || item.category === category)
    );
  });

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setInventory((current) => current.filter((item) => item._id !== id));
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const categories = ["All", ...new Set(inventory.map((item) => item.category))];

  return (
    <div className="w-full flex justify-center px-4 mt-6">
      <div className="w-full max-w-6xl">
        <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-full text-sm ${
                  category === cat ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {cat}
              </button>
            ))}

            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="flex items-center gap-1 bg-indigo-100 text-indigo-600 px-3 py-1 rounded-lg"
            >
              <RefreshCw size={14} /> Reset
            </button>

            <button
              onClick={() => navigate("/add-product")}
              className="bg-indigo-600 text-white px-3 py-1 rounded-lg"
            >
              Add Product
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-gray-700">Product Inventory</h2>
            <span className="text-sm text-gray-400">{filtered.length} items</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-500 uppercase text-xs bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Product</th>
                  <th className="px-6 py-3 text-left">SKU</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Qty</th>
                  <th className="px-6 py-3 text-left">Price</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {loading && (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-gray-400">
                      Loading products...
                    </td>
                  </tr>
                )}

                {!loading && error && (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-red-500">
                      {error}
                    </td>
                  </tr>
                )}

                {!loading && !error && filtered.map((item) => (
                  <tr key={item._id} className="hover:bg-indigo-50/40 transition">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-400">ID: {item._id.slice(-6)}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-500">{item.sku}</td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                        {item.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-700">{item.quantity}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">${item.price}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          item.status === "in"
                            ? "bg-green-100 text-green-600"
                            : item.status === "low"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.status === "in"
                          ? "In Stock"
                          : item.status === "low"
                          ? "Low Stock"
                          : "Out of Stock"}
                      </span>
                    </td>

                    <td className="px-6 py-4 flex justify-end gap-2">
                      <button
                        onClick={() => navigate("/add-product", { state: { product: item } })}
                        className="p-2 rounded-lg hover:bg-blue-100 text-blue-500"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 rounded-lg hover:bg-red-100 text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}

                {!loading && !error && filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-gray-400">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
