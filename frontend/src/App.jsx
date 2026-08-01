import { useEffect, useState } from "react";
import {
  Activity,
  Server,
  Clock,
  RefreshCw,
  Wifi,
  Plus,
  Trash2,
  AlertTriangle,
  Globe,
  Zap,
  Shield,
  BarChart3,
  X,
  CheckCircle2,
  XCircle,
  Loader2,
  Radio,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Monitor,
  Trash,
} from "lucide-react";

import socket from "./socket";

const BACKEND_URL = "http://localhost:5000";

/* ─── helpers ───────────────────────────────────── */

const getResponseTimeColor = (ms) => {
  if (ms === null || ms === undefined) return "text-slate-400";
  if (ms < 200) return "text-emerald-400";
  if (ms < 500) return "text-amber-400";
  return "text-rose-400";
};

const getUptimeBarColor = (uptime) => {
  if (uptime >= 99) return "bg-emerald-500";
  if (uptime >= 95) return "bg-amber-500";
  return "bg-rose-500";
};

const getStatusConfig = (status) => {
  switch (status) {
    case "UP":
      return {
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        border: "border-emerald-500/20",
        dot: "bg-emerald-500",
        ping: "bg-emerald-400",
        icon: CheckCircle2,
        cardBorder: "border-emerald-500/[0.08]",
        glow: "shadow-emerald-500/10",
      };
    case "DOWN":
      return {
        bg: "bg-rose-500/10",
        text: "text-rose-400",
        border: "border-rose-500/20",
        dot: "bg-rose-500",
        ping: "bg-rose-400",
        icon: XCircle,
        cardBorder: "border-rose-500/[0.08]",
        glow: "shadow-rose-500/10",
      };
    default:
      return {
        bg: "bg-slate-500/10",
        text: "text-slate-400",
        border: "border-slate-500/20",
        dot: "bg-slate-500",
        ping: "bg-slate-400",
        icon: Loader2,
        cardBorder: "border-white/[0.08]",
        glow: "shadow-slate-500/5",
      };
  }
};

/* ─── skeleton card ─────────────────────────────── */

const SkeletonCard = () => (
  <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-6 w-32 bg-white/10 rounded-lg" />
      <div className="h-6 w-16 bg-white/10 rounded-full" />
    </div>
    <div className="h-4 w-full bg-white/5 rounded mb-4" />
    <div className="space-y-2 mb-5">
      <div className="h-4 w-3/4 bg-white/5 rounded" />
      <div className="h-4 w-1/2 bg-white/5 rounded" />
    </div>
    <div className="border-t border-white/5 pt-5">
      <div className="grid grid-cols-3 gap-3">
        <div className="h-10 bg-white/5 rounded-lg" />
        <div className="h-10 bg-white/5 rounded-lg" />
        <div className="h-10 bg-white/5 rounded-lg" />
      </div>
    </div>
    <div className="mt-5 h-9 bg-white/5 rounded-lg" />
  </div>
);

/* ─── main component ────────────────────────────── */

function App() {
  /* ── state ──────────────────────────────────── */
  const [services, setServices] = useState([]);
  const [serviceStats, setServiceStats] = useState({});
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    service: null,
  });

  /* ── load dashboard ─────────────────────────── */
  const loadDashboard = async () => {
    const servicesResponse = await fetch(`${BACKEND_URL}/api/services`);
    if (!servicesResponse.ok) throw new Error("Failed to fetch services");
    const servicesData = await servicesResponse.json();

    const statsEntries = await Promise.all(
      servicesData.map(async (service) => {
        const response = await fetch(
          `${BACKEND_URL}/api/services/${service.id}/stats`,
        );
        if (!response.ok)
          throw new Error(`Failed to fetch stats for ${service.name}`);
        const stats = await response.json();
        return [service.id, stats];
      }),
    );

    setServices(servicesData);
    setServiceStats(Object.fromEntries(statsEntries));
  };

  /* ── refresh ──────────────────────────────────── */
  const refreshDashboard = async () => {
    setIsRefreshing(true);
    setError("");
    try {
      await loadDashboard();
    } catch (error) {
      console.error(error);
      setError("Could not load dashboard data.");
    } finally {
      setIsRefreshing(false);
    }
  };

  /* ── initial load + socket ───────────────────── */
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const servicesResponse = await fetch(`${BACKEND_URL}/api/services`);
        if (!servicesResponse.ok) throw new Error("Failed to fetch services");
        const servicesData = await servicesResponse.json();

        const statsEntries = await Promise.all(
          servicesData.map(async (service) => {
            const response = await fetch(
              `${BACKEND_URL}/api/services/${service.id}/stats`,
            );
            if (!response.ok)
              throw new Error(`Failed to fetch stats for ${service.name}`);
            const stats = await response.json();
            return [service.id, stats];
          }),
        );

        if (!cancelled) {
          setServices(servicesData);
          setServiceStats(Object.fromEntries(statsEntries));
          setError("");
        }
      } catch (error) {
        if (!cancelled) {
          console.error(error);
          setError("Could not load dashboard data.");
        }
      }
    };

    load();

    socket.on("connect", () => console.log("Connection Successful"));
    socket.on("connected", (data) => console.log(data.message));
    socket.on("disconnect", () => console.log("Socket disconnected"));
    socket.on("serviceUpdated", ({ service, stats }) => {
      console.log("Live update:", service);
      console.log("Updated stats:", stats);
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, ...service } : s)),
      );
      setServiceStats((prev) => ({ ...prev, [service.id]: stats }));
    });

    return () => {
      cancelled = true;
      socket.off("connect");
      socket.off("connected");
      socket.off("disconnect");
      socket.off("serviceUpdated");
    };
  }, []);

  /* ── add service ─────────────────────────────── */
  const handleAddService = async (event) => {
    event.preventDefault();
    if (!name.trim() || !url.trim()) {
      setError("Name and URL are required.");
      return;
    }
    setIsAdding(true);
    setError("");
    try {
      const response = await fetch(`${BACKEND_URL}/api/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), url: url.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to add service.");
      setName("");
      setUrl("");
      await loadDashboard();
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  /* ── delete service ───────────────────────────── */
  const openDeleteModal = (service) => setDeleteModal({ open: true, service });
  const closeDeleteModal = () => setDeleteModal({ open: false, service: null });

  const confirmDelete = async () => {
    if (!deleteModal.service) return;
    const id = deleteModal.service.id;
    closeDeleteModal();
    setError("");
    try {
      const response = await fetch(`${BACKEND_URL}/api/services/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete service.");
      }
      await loadDashboard();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  /* ── summary stats ────────────────────────────── */
  const totalServices = services.length;
  const healthyServices = services.filter((s) => s.status === "UP").length;
  const downServices = services.filter((s) => s.status === "DOWN").length;
  const servicesWithResponseTime = services.filter(
    (s) =>
      s.status === "UP" &&
      s.responseTime !== null &&
      s.responseTime !== undefined,
  );
  const averageResponseTime =
    servicesWithResponseTime.length === 0
      ? null
      : servicesWithResponseTime.reduce((t, s) => t + s.responseTime, 0) /
        servicesWithResponseTime.length;

  /* ── render ───────────────────────────────────── */
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-x-hidden selection:bg-blue-500/30">
      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-10">
        {/* ═══════════════════════════════════════
            HEADER
        ═══════════════════════════════════════ */}
        <header className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                  <Activity size={32} className="text-blue-400" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
                </span>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Local Service Monitor
                </h1>
                <p className="text-slate-500 mt-1 text-sm sm:text-base font-medium">
                  Real-time monitoring dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 text-emerald-400 backdrop-blur-sm">
                <Radio size={16} className="animate-pulse" />
                <span className="text-sm font-semibold tracking-wide">
                  Live Updates
                </span>
              </div>
              <button
                onClick={refreshDashboard}
                disabled={isRefreshing}
                className="flex items-center gap-2 rounded-xl bg-white/[0.05] border border-white/[0.08] px-5 py-2.5 hover:bg-white/[0.08] hover:border-white/[0.15] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group"
              >
                <RefreshCw
                  size={16}
                  className={
                    isRefreshing
                      ? "animate-spin"
                      : "group-hover:rotate-180 transition-transform duration-500"
                  }
                />
                <span className="text-sm font-medium">
                  {isRefreshing ? "Syncing..." : "Refresh"}
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* ═══════════════════════════════════════
            SUMMARY CARDS
        ═══════════════════════════════════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Layers size={18} className="text-blue-400" />
              </div>
              <span className="text-xs font-medium text-slate-500 bg-white/5 px-2 py-1 rounded-full">
                Total
              </span>
            </div>
            <p className="text-3xl font-bold text-white">{totalServices}</p>
            <p className="text-xs text-slate-500 mt-1">Monitored services</p>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 hover:bg-white/[0.05] hover:border-emerald-500/20 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <ArrowUpRight size={18} className="text-emerald-400" />
              </div>
              <span className="text-xs font-medium text-emerald-400/80 bg-emerald-500/10 px-2 py-1 rounded-full">
                Healthy
              </span>
            </div>
            <p className="text-3xl font-bold text-emerald-400">
              {healthyServices}
            </p>
            <p className="text-xs text-slate-500 mt-1">Services operational</p>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 hover:bg-white/[0.05] hover:border-rose-500/20 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-rose-500/10 rounded-lg">
                <ArrowDownRight size={18} className="text-rose-400" />
              </div>
              <span className="text-xs font-medium text-rose-400/80 bg-rose-500/10 px-2 py-1 rounded-full">
                Down
              </span>
            </div>
            <p className="text-3xl font-bold text-rose-400">{downServices}</p>
            <p className="text-xs text-slate-500 mt-1">Services offline</p>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-violet-500/10 rounded-lg">
                <Zap size={18} className="text-violet-400" />
              </div>
              <span className="text-xs font-medium text-slate-500 bg-white/5 px-2 py-1 rounded-full">
                Latency
              </span>
            </div>
            <p className="text-3xl font-bold text-white">
              {averageResponseTime === null
                ? "—"
                : Math.round(averageResponseTime)}
              <span className="text-lg text-slate-500 font-medium ml-1">
                ms
              </span>
            </p>
            <p className="text-xs text-slate-500 mt-1">Average response</p>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            ADD SERVICE
        ═══════════════════════════════════════ */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 mb-8 hover:border-white/[0.12] transition-all duration-300">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Plus size={18} className="text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              Add New Service
            </h2>
          </div>

          <form
            onSubmit={handleAddService}
            className="grid gap-4 md:grid-cols-[1fr_2fr_auto] items-end"
          >
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 mb-1.5 ml-1">
                Service Name
              </label>
              <div className="relative">
                <Server
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="text"
                  placeholder="e.g. API Gateway"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all"
                />
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-medium text-slate-500 mb-1.5 ml-1">
                Endpoint URL
              </label>
              <div className="relative">
                <Globe
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isAdding}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-slate-600 disabled:cursor-not-allowed text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5"
            >
              {isAdding ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Adding...
                </>
              ) : (
                <>
                  <Plus size={16} /> Add Service
                </>
              )}
            </button>
          </form>
        </div>

        {/* ═══════════════════════════════════════
            ERROR BANNER
        ═══════════════════════════════════════ */}
        {error && (
          <div className="mb-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 backdrop-blur-xl p-4 flex items-start gap-3">
            <AlertTriangle
              size={18}
              className="text-rose-400 mt-0.5 shrink-0"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-rose-300">{error}</p>
            </div>
            <button
              onClick={() => setError("")}
              className="text-rose-400/60 hover:text-rose-400 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════
            LOADING SKELETONS
        ═══════════════════════════════════════ */}
        {isRefreshing && services.length === 0 && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════════
            EMPTY STATE
        ═══════════════════════════════════════ */}
        {!isRefreshing && services.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="relative mb-6">
              <div className="p-6 bg-white/[0.03] border border-white/[0.08] rounded-3xl">
                <Monitor size={48} className="text-slate-600" />
              </div>
              <div className="absolute -bottom-2 -right-2 p-2 bg-slate-900 border border-white/[0.08] rounded-xl">
                <Plus size={16} className="text-slate-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No services yet
            </h3>
            <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
              Start monitoring your infrastructure by adding your first service
              above. You'll see live status, response times, and uptime
              statistics here.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-600 bg-white/[0.03] border border-white/[0.06] px-4 py-2 rounded-full">
              <Wifi size={12} />
              <span>Socket.IO live updates ready</span>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            SERVICE CARDS
        ═══════════════════════════════════════ */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const stats = serviceStats[service.id];
            const statusConfig = getStatusConfig(service.status);
            const StatusIcon = statusConfig.icon;
            const responseTimeColor = getResponseTimeColor(
              service.responseTime,
            );

            return (
              <div
                key={service.id}
                className={`group bg-white/[0.03] backdrop-blur-xl border ${statusConfig.cardBorder} rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/[0.15] hover:-translate-y-1 hover:shadow-2xl ${statusConfig.glow} transition-all duration-300 relative overflow-hidden`}
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Card header */}
                <div className="relative flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2.5 rounded-xl ${statusConfig.bg} ${statusConfig.border} border shrink-0`}
                    >
                      <StatusIcon size={20} className={statusConfig.text} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white truncate text-lg leading-tight">
                        {service.name}
                      </h3>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {service.url}
                      </p>
                    </div>
                  </div>

                  {/* Status badge with pulse */}
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusConfig.bg} ${statusConfig.border} border shrink-0`}
                  >
                    <span className="relative flex h-2 w-2">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full ${statusConfig.ping} opacity-75`}
                      />
                      <span
                        className={`relative inline-flex rounded-full h-2 w-2 ${statusConfig.dot}`}
                      />
                    </span>
                    <span className={`text-xs font-bold ${statusConfig.text}`}>
                      {service.status}
                    </span>
                  </div>
                </div>

                {/* Current metrics */}
                <div className="relative space-y-3 mb-5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Zap size={14} />
                      <span>Response</span>
                    </div>
                    <span className={`font-semibold ${responseTimeColor}`}>
                      {service.responseTime === null ||
                      service.responseTime === undefined
                        ? "N/A"
                        : `${service.responseTime} ms`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Shield size={14} />
                      <span>HTTP Status</span>
                    </div>
                    <span className="font-mono font-semibold text-slate-300">
                      {service.httpStatus ?? "N/A"}
                    </span>
                  </div>
                  {service.lastChecked && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock size={14} />
                        <span>Last checked</span>
                      </div>
                      <span className="text-slate-400 text-xs">
                        {new Date(service.lastChecked).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Statistics section */}
                {stats && (
                  <div className="relative border-t border-white/[0.06] pt-5 mb-5">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3 size={14} className="text-slate-500" />
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Statistics
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {/* Uptime */}
                      <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
                        <p className="text-[10px] font-medium text-slate-500 mb-1.5">
                          Uptime
                        </p>
                        <p className="text-lg font-bold text-white leading-none">
                          {stats.uptime.toFixed(1)}%
                        </p>
                        {/* Tiny progress bar */}
                        <div className="mt-2 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getUptimeBarColor(stats.uptime)} transition-all duration-700`}
                            style={{ width: `${Math.min(stats.uptime, 100)}%` }}
                          />
                        </div>
                      </div>
                      {/* Average */}
                      <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
                        <p className="text-[10px] font-medium text-slate-500 mb-1.5">
                          Avg
                        </p>
                        <p className="text-lg font-bold text-white leading-none">
                          {stats.averageResponseTime === null
                            ? "—"
                            : `${Math.round(stats.averageResponseTime)}`}
                          {stats.averageResponseTime !== null && (
                            <span className="text-[10px] text-slate-500 font-medium ml-0.5">
                              ms
                            </span>
                          )}
                        </p>
                      </div>
                      {/* Checks */}
                      <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
                        <p className="text-[10px] font-medium text-slate-500 mb-1.5">
                          Checks
                        </p>
                        <p className="text-lg font-bold text-white leading-none">
                          {stats.totalChecks}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delete button */}
                <button
                  onClick={() => openDeleteModal(service)}
                  className="relative w-full flex items-center justify-center gap-2 rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-2.5 text-sm text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all duration-200 group/delete"
                >
                  <Trash2
                    size={14}
                    className="group-hover/delete:scale-110 transition-transform"
                  />
                  Remove Service
                </button>
              </div>
            );
          })}
        </div>

        {/* ═══════════════════════════════════════
            FOOTER
        ═══════════════════════════════════════ */}
        {services.length > 0 && (
          <footer className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-slate-700" />
              <span>Local Service Monitor</span>
            </div>
            <div className="flex items-center gap-4">
              <span>
                {totalServices} service{totalServices !== 1 ? "s" : ""}{" "}
                monitored
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                Socket.IO connected
              </span>
            </div>
          </footer>
        )}
      </div>

      {/* ═══════════════════════════════════════
          DELETE CONFIRMATION MODAL
      ═══════════════════════════════════════ */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeDeleteModal}
          />
          <div className="relative bg-slate-900 border border-white/[0.1] rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20">
                <Trash size={20} className="text-rose-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Delete Service</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              Are you sure you want to remove{" "}
              <span className="text-white font-medium">
                {deleteModal.service?.name}
              </span>
              ? All monitoring history will be lost.
            </p>
            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm font-medium text-slate-300 hover:bg-white/[0.08] hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-rose-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
