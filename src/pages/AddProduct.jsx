import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";

export default function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "Electronics",
    quantity: "",
    price: "",
  });

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];

    const nextId = inventory.length
      ? Math.max(...inventory.map((i) => i.id)) + 1
      : 1;

    const quantity = parseInt(form.quantity);

    const status =
      quantity > 0 ? (quantity < 10 ? "low" : "in") : "out";

    const newProduct = {
      id: nextId,
      name: form.name,
      sku: form.sku,
      category: form.category,
      quantity,
      price: parseFloat(form.price),
      status,
    };

    const updated = [...inventory, newProduct];
    localStorage.setItem("inventory", JSON.stringify(updated));

    alert("✅ Product Added Successfully!");
    navigate("/inventory");
  };

  return (
    <div className="w-full flex justify-center mt-10 px-4">

      {/* CENTERED CONTAINER */}
      <div className="w-full max-w-3xl">

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 transition hover:shadow-2xl">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Add Product
              </h2>
              <p className="text-gray-400 text-sm">
                Add new item to inventory
              </p>
            </div>

            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              <ArrowLeft size={16} /> Back
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <Input
              label="Product Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />

            <Input
              label="SKU"
              name="sku"
              value={form.sku}
              onChange={handleChange}
            />

            {/* CATEGORY */}
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option>Electronics</option>
              <option>Furniture</option>
              <option>Stationery</option>
            </select>

            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Quantity"
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
              />
              <Input
                label="Price ($)"
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 
              bg-gradient-to-r from-indigo-600 to-blue-600 
              text-white py-3 rounded-xl
              shadow-lg hover:shadow-xl
              hover:scale-[1.02] active:scale-[0.98]
              transition-all duration-300"
            >
              <Save size={18} /> Save Product
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

// INPUT COMPONENT
function Input({ label, ...props }) {
  return (
    <div className="relative">
      <input
        {...props}
        required
        placeholder=" "
        className="peer w-full px-4 pt-5 pb-2 
        bg-white border border-gray-300 rounded-xl
        focus:ring-2 focus:ring-indigo-500 outline-none"
      />
      <label
        className="absolute left-4 top-2 text-gray-400 text-sm 
        transition-all 
        peer-placeholder-shown:top-3.5 
        peer-placeholder-shown:text-base 
        peer-focus:top-2 
        peer-focus:text-sm 
        peer-focus:text-indigo-600"
      >
        {label}
      </label>
    </div>
  );
}