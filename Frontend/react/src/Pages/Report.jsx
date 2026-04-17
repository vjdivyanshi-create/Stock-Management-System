import { useEffect, useMemo, useState } from "react";
import { DollarSign, Package, Layers, AlertTriangle, TrendingUp, Boxes } from "lucide-react";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { api } from "../lib/api";

ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function Report() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const data = await api.get("/reports/summary");
        setSummary(data);
        setError("");
      } catch (apiError) {
        setError(apiError.message);
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, []);

  const metrics = summary || {
    totalValue: 0,
    totalProducts: 0,
    averageProductValue: 0,
    categoryValueSeries: [],
    inventoryValueSeries: { labels: [], values: [], quantities: [], items: [] },
    stockStatusCounts: { in: 0, low: 0, out: 0 },
    lowStockProducts: [],
    averageOrderValue: 0,
    sellThroughRatio: 0,
    highestValueCategory: "No categories yet",
    topValueProduct: null,
  };

  const stockValueChart = useMemo(() => ({
    labels: metrics.inventoryValueSeries.labels.length ? metrics.inventoryValueSeries.labels : ["No inventory yet"],
    datasets: [
      {
        type: "bar",
        label: "Stock value ($)",
        data: metrics.inventoryValueSeries.values.length ? metrics.inventoryValueSeries.values : [0],
        backgroundColor: "#6366f1",
        borderRadius: 10,
        yAxisID: "value",
      },
      {
        type: "line",
        label: "Units on hand",
        data: metrics.inventoryValueSeries.quantities.length ? metrics.inventoryValueSeries.quantities : [0],
        borderColor: "#0f766e",
        backgroundColor: "rgba(15, 118, 110, 0.15)",
        tension: 0.35,
        yAxisID: "units",
      },
    ],
  }), [metrics.inventoryValueSeries.labels, metrics.inventoryValueSeries.quantities, metrics.inventoryValueSeries.values]);

  const stockValueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      value: {
        beginAtZero: true,
        position: "left",
        ticks: {
          callback: (value) => `$${Number(value).toLocaleString()}`,
        },
      },
      units: {
        beginAtZero: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const categoryChart = {
    labels: metrics.categoryValueSeries.length ? metrics.categoryValueSeries.map((item) => item.category) : ["No Data"],
    datasets: [
      {
        data: metrics.categoryValueSeries.length ? metrics.categoryValueSeries.map((item) => item.value) : [1],
        backgroundColor: ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#0ea5e9", "#8b5cf6"],
        borderWidth: 0,
      },
    ],
  };

  const lowStockCount = (metrics.stockStatusCounts.low || 0) + (metrics.stockStatusCounts.out || 0);

  return (
    <div className="relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-indigo-300 opacity-30 blur-3xl rounded-full"></div>

      <div className="flex justify-between items-center mb-8 relative">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reports Dashboard</h1>
          <p className="text-gray-500">Per-user inventory analytics with stock value, category mix, and risk highlights.</p>
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-white/80 px-4 py-3 text-right shadow-sm backdrop-blur">
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-500">Report focus</p>
          <p className="text-sm font-semibold text-slate-700">{metrics.highestValueCategory}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card icon={DollarSign} title="Total Stock Value" value={formatCurrency(metrics.totalValue)} sub={`Avg per item ${formatCurrency(metrics.averageProductValue || 0)}`} />
        <Card icon={Package} title="Total Products" value={metrics.totalProducts || 0} sub={`${metrics.categoryValueSeries.length} categories tracked`} />
        <Card icon={Layers} title="Avg Order Value" value={formatCurrency(metrics.averageOrderValue || 0)} sub={`Sell-through ${(metrics.sellThroughRatio || 0).toFixed(2)}x`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <InsightCard
          icon={TrendingUp}
          title="Highest Value Product"
          value={metrics.topValueProduct?.name || "No inventory yet"}
          detail={metrics.topValueProduct ? `${formatCurrency(metrics.topValueProduct.stockValue)} in stock value` : "Add products to unlock ranking"}
        />
        <InsightCard
          icon={AlertTriangle}
          title="Low Stock Attention"
          value={lowStockCount}
          detail={lowStockCount ? "Products need restock follow-up" : "All tracked products look healthy"}
        />
        <InsightCard
          icon={Boxes}
          title="Ready To Sell"
          value={metrics.stockStatusCounts.in || 0}
          detail={`${metrics.stockStatusCounts.out || 0} out of stock right now`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {error && (
          <div className="lg:col-span-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        <div className="bg-white/70 backdrop-blur-2xl p-6 rounded-3xl shadow-xl border border-white/30 hover:shadow-2xl transition">
          <div className="mb-4">
            <h2 className="font-semibold text-gray-700">Stock Value Trend</h2>
            <p className="text-sm text-slate-500">Compare your top-value products by stock value and units available.</p>
          </div>
          <div className="h-[360px]">
            <Bar data={stockValueChart} options={stockValueOptions} />
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-2xl p-6 rounded-3xl shadow-xl border border-white/30 hover:shadow-2xl transition">
          <div className="mb-4">
            <h2 className="font-semibold text-gray-700">Category Distribution</h2>
            <p className="text-sm text-slate-500">See which categories hold the most inventory value for this account.</p>
          </div>
          <div className="h-[360px]">
            <Doughnut data={categoryChart} options={{ maintainAspectRatio: false, cutout: "62%" }} />
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-6">
        <div className="bg-white/70 backdrop-blur-2xl p-6 rounded-3xl shadow-xl border border-white/30">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-700">Top Inventory Value Items</h2>
              <p className="text-sm text-slate-500">Prioritize audits, pricing checks, and replenishment around your most valuable stock.</p>
            </div>
            {loading && <span className="text-sm text-slate-400">Loading...</span>}
          </div>

          <div className="space-y-3">
            {metrics.inventoryValueSeries.items?.length ? (
              metrics.inventoryValueSeries.items.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white/70 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{index + 1}. {item.name}</p>
                    <p className="text-xs text-slate-500">{item.category} - {item.quantity} units - SKU {item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">{formatCurrency(item.stockValue)}</p>
                    <p className={`text-xs ${item.status === "out" ? "text-red-500" : item.status === "low" ? "text-amber-500" : "text-emerald-600"}`}>
                      {item.status === "in" ? "Healthy stock" : item.status === "low" ? "Low stock" : "Out of stock"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-400">
                Add products to generate your stock value analysis.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-2xl p-6 rounded-3xl shadow-xl border border-white/30">
          <div className="mb-4">
            <h2 className="font-semibold text-gray-700">Restock Watchlist</h2>
            <p className="text-sm text-slate-500">These items need attention first to avoid missed orders.</p>
          </div>

          <div className="space-y-3">
            {metrics.lowStockProducts?.length ? (
              metrics.lowStockProducts.map((product) => (
                <div key={product._id} className="rounded-2xl border border-slate-100 bg-white/70 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-800">{product.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{product.category} - SKU {product.sku}</p>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-slate-600">{product.quantity} units left</span>
                    <span className={product.status === "out" ? "text-red-500" : "text-amber-500"}>
                      {product.status === "out" ? "Out of stock" : "Low stock"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-400">
                No low stock items. Your inventory coverage looks stable.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, value, sub }) {
  return (
    <div className="relative bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="absolute top-4 right-4 text-indigo-100">
        <Icon size={40} />
      </div>

      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold text-gray-800 mt-2">{value}</h2>
      <p className="text-xs text-green-500 mt-2">{sub}</p>
    </div>
  );
}

function InsightCard({ icon: Icon, title, value, detail }) {
  return (
    <div className="rounded-3xl border border-white/40 bg-white/70 p-6 shadow-lg backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className="rounded-2xl bg-slate-100 p-2 text-slate-600">
          <Icon size={18} />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </div>
  );
}

function formatCurrency(value) {
  return `$${Math.round(Number(value || 0)).toLocaleString()}`;
}
