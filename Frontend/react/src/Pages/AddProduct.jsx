import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import { api } from "../lib/api";

const DEFAULT_CATEGORIES = ["Electronics", "Furniture", "Stationery"];
const OTHER_CATEGORY_OPTION = "Other";

export default function AddProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const editingProduct = location.state?.product || null;
  const isEditMode = Boolean(editingProduct?._id);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "Electronics",
    otherCategory: "",
    quantity: "",
    price: "",
  });

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    setForm({
      name: editingProduct.name || "",
      sku: editingProduct.sku || "",
      category: DEFAULT_CATEGORIES.includes(editingProduct.category) ? editingProduct.category : OTHER_CATEGORY_OPTION,
      otherCategory: DEFAULT_CATEGORIES.includes(editingProduct.category) ? "" : editingProduct.category || "",
      quantity: editingProduct.quantity?.toString() || "",
      price: editingProduct.price?.toString() || "",
    });
  }, [editingProduct, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "category" && value !== OTHER_CATEGORY_OPTION ? { otherCategory: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const resolvedCategory =
        form.category === OTHER_CATEGORY_OPTION ? form.otherCategory.trim() : form.category.trim();

      if (!resolvedCategory) {
        setError("Please enter a custom category.");
        setLoading(false);
        return;
      }

      const payload = {
        ...form,
        category: resolvedCategory,
        quantity: Number(form.quantity),
        price: Number(form.price),
      };

      delete payload.otherCategory;

      if (isEditMode) {
        await api.put(`/products/${editingProduct._id}`, payload);
      } else {
        await api.post("/products", payload);
      }

      navigate("/inventory");
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center mt-10 px-4">
      <div className="w-full max-w-3xl">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 transition hover:shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {isEditMode ? "Edit Product" : "Add Product"}
              </h2>
              <p className="text-gray-400 text-sm">
                {isEditMode ? "Update the selected inventory item" : "Add new item to inventory"}
              </p>
            </div>

            <button
              onClick={() => navigate("/inventory")}
              className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              <ArrowLeft size={16} /> Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Input label="Product Name" name="name" value={form.name} onChange={handleChange} />
            <Input label="SKU" name="sku" value={form.sku} onChange={handleChange} />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {DEFAULT_CATEGORIES.map((category) => (
                <option key={category}>{category}</option>
              ))}
              <option>{OTHER_CATEGORY_OPTION}</option>
            </select>

            {form.category === OTHER_CATEGORY_OPTION && (
              <Input
                label="Other Category"
                name="otherCategory"
                value={form.otherCategory}
                onChange={handleChange}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} />
              <Input label="Price ($)" name="price" type="number" value={form.price} onChange={handleChange} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={18} /> {loading ? "Saving..." : "Save Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="relative">
      <input
        {...props}
        required
        placeholder=" "
        className="peer w-full px-4 pt-5 pb-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
      />
      <label
        className="absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600"
      >
        {label}
      </label>
    </div>
  );
}
