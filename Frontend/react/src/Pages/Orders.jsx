import { useEffect, useMemo, useState } from "react";
import { PackagePlus, Pencil, Trash2, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

const initialForm = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  productId: "",
  quantity: 1,
  status: "Completed",
};

export default function Orders() {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingOrderId, setEditingOrderId] = useState(location.state?.order?._id || "");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [deletingOrderId, setDeletingOrderId] = useState("");

  const refreshData = async () => {
    const [productData, orderData] = await Promise.all([api.get("/products"), api.get("/orders")]);
    setProducts(productData);
    setOrders(orderData);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await refreshData();
      } catch (apiError) {
        setError(apiError.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const editingOrder = useMemo(
    () => orders.find((order) => order._id === editingOrderId) || location.state?.order || null,
    [editingOrderId, orders, location.state]
  );

  const selectableProducts = useMemo(() => {
    if (!editingOrder) {
      return products.filter((product) => product.quantity > 0);
    }

    return products.filter((product) => product.quantity > 0 || product._id === editingOrder.product);
  }, [editingOrder, products]);

  const selectedProduct = useMemo(
    () => products.find((product) => product._id === form.productId),
    [products, form.productId]
  );

  const availableStock = useMemo(() => {
    if (!selectedProduct) {
      return 0;
    }

    if (editingOrder && selectedProduct._id === editingOrder.product) {
      return selectedProduct.quantity + editingOrder.quantity;
    }

    return selectedProduct.quantity;
  }, [editingOrder, selectedProduct]);

  useEffect(() => {
    if (!editingOrder) {
      return;
    }

    setForm({
      customerName: editingOrder.customerName || "",
      customerEmail: editingOrder.customerEmail || "",
      customerPhone: editingOrder.customerPhone || "",
      productId: editingOrder.product || "",
      quantity: editingOrder.quantity || 1,
      status: editingOrder.status || "Completed",
    });
  }, [editingOrder]);

  useEffect(() => {
    if (editingOrderId || form.productId || !selectableProducts.length) {
      return;
    }

    setForm((current) => ({
      ...current,
      productId: selectableProducts[0]._id,
    }));
  }, [editingOrderId, form.productId, selectableProducts]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const resetForm = () => {
    setEditingOrderId("");
    setForm({
      ...initialForm,
      productId: selectableProducts[0]?._id || "",
    });
    navigate("/orders", { replace: true, state: null });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const savedOrder = editingOrderId
        ? await api.put(`/orders/${editingOrderId}`, form)
        : await api.post("/orders", form);

      await refreshData();
      resetForm();
      setMessage(
        editingOrderId
          ? `Order updated for ${savedOrder.customerName}.`
          : `Order created for ${savedOrder.customerName}. Inventory updated successfully.`
      );
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (order) => {
    setError("");
    setMessage("");
    setEditingOrderId(order._id);
    setForm({
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone || "",
      productId: order.product,
      quantity: order.quantity,
      status: order.status,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (order) => {
    setDeletingOrderId(order._id);
    setError("");
    setMessage("");

    try {
      await api.delete(`/orders/${order._id}`);
      await refreshData();

      if (editingOrderId === order._id) {
        resetForm();
      }

      setMessage(`Order deleted for ${order.customerName}. Stock has been restored.`);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setDeletingOrderId("");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr,1fr]">
      <section className="rounded-3xl bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{editingOrderId ? "Edit Order" : "Create Order"}</h2>
            <p className="text-sm text-slate-500">
              {editingOrderId
                ? "Update customer, product, quantity, or status and keep stock in sync."
                : "Customer details and inventory deduction happen together."}
            </p>
          </div>
          <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
            <PackagePlus size={22} />
          </div>
        </div>

        {message && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Customer Name" name="customerName" value={form.customerName} onChange={handleChange} />
          <Input label="Customer Email" name="customerEmail" type="email" value={form.customerEmail} onChange={handleChange} />
          <Input label="Customer Phone" name="customerPhone" value={form.customerPhone} onChange={handleChange} />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">Product</label>
            <select
              name="productId"
              value={form.productId}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {!selectableProducts.length && <option value="">No stock available</option>}
              {selectableProducts.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name} ({product.sku}) - {product.quantity} in stock
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Quantity"
              name="quantity"
              type="number"
              min="1"
              max={Math.max(availableStock, 1)}
              value={form.quantity}
              onChange={handleChange}
            />

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Completed">Completed</option>
                <option value="Processing">Processing</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            <p>Unit price: <span className="font-semibold">${selectedProduct?.price || 0}</span></p>
            <p>Available stock: <span className="font-semibold">{availableStock}</span></p>
            <p>Order total: <span className="font-semibold">${((selectedProduct?.price || 0) * Number(form.quantity || 0)).toFixed(2)}</span></p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving || !selectableProducts.length}
              className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 py-3 text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (editingOrderId ? "Updating Order..." : "Creating Order...") : editingOrderId ? "Update Order" : "Create Order"}
            </button>

            {editingOrderId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-200 px-4 py-3 text-slate-600 transition hover:bg-slate-50"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Recent Orders</h2>
          <p className="text-sm text-slate-500">Latest customer purchases, now with quick edit and delete actions.</p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-8 text-center text-gray-400">
            Loading orders...
          </div>
        ) : orders.length ? (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order._id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-800">{order.customerName}</p>
                    <p className="text-sm text-slate-500">{order.customerEmail}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs ${statusStyle[order.status] || statusStyle.Completed}`}>
                    {order.status}
                  </span>
                </div>

                <div className="mt-3 text-sm text-slate-600">
                  <p>{order.productName} ({order.productSku})</p>
                  <p>Qty: {order.quantity} | Total: ${order.totalAmount}</p>
                  <p>{formatDate(order.createdAt)}</p>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(order)}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(order)}
                    disabled={deletingOrderId === order._id}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 size={15} />
                    {deletingOrderId === order._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-8 text-center text-gray-400">
            No orders yet.
          </div>
        )}
      </section>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-600">{label}</label>
      <input
        {...props}
        required={props.name !== "customerPhone"}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}

const statusStyle = {
  Completed: "bg-green-100 text-green-700",
  Processing: "bg-blue-100 text-blue-700",
  Pending: "bg-yellow-100 text-yellow-700",
};

function formatDate(value) {
  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
