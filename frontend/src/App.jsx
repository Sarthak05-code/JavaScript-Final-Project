import { useEffect, useState } from "react";
import socket from "./socket";

// the default url we will use. we can probably change it
const BACKEND_URL = "http://localhost:5000";

function App() {
  // --------------------------------------------------
  // STATE
  // --------------------------------------------------

  const [services, setServices] = useState([]);
  const [serviceStats, setServiceStats] = useState({});

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const [error, setError] = useState("");

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // --------------------------------------------------
  // LOAD DASHBOARD DATA
  // --------------------------------------------------

  const loadDashboard = async () => {
    // ----------------------------------------------
    // 1. Get current service status
    // ----------------------------------------------

    const servicesResponse = await fetch(`${BACKEND_URL}/api/services`);

    if (!servicesResponse.ok) {
      throw new Error("Failed to fetch services");
    }

    const servicesData = await servicesResponse.json();

    // ----------------------------------------------
    // 2. Get statistics for every service
    // ----------------------------------------------

    const statsEntries = await Promise.all(
      servicesData.map(async (service) => {
        const response = await fetch(
          `${BACKEND_URL}/api/services/${service.id}/stats`,
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch stats for ${service.name}`);
        }

        const stats = await response.json();

        return [service.id, stats];
      }),
    );

    // ----------------------------------------------
    // 3. Store everything in React state
    // ----------------------------------------------

    setServices(servicesData);
    setServiceStats(Object.fromEntries(statsEntries));
  };

  // --------------------------------------------------
  // REFRESH DASHBOARD
  // --------------------------------------------------

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

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const servicesResponse = await fetch(`${BACKEND_URL}/api/services`);

        if (!servicesResponse.ok) {
          throw new Error("Failed to fetch services");
        }

        const servicesData = await servicesResponse.json();

        const statsEntries = await Promise.all(
          servicesData.map(async (service) => {
            const response = await fetch(
              `${BACKEND_URL}/api/services/${service.id}/stats`,
            );

            if (!response.ok) {
              throw new Error(`Failed to fetch stats for ${service.name}`);
            }

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

    // Adding socket here.
    socket.on("connect", () => {
      console.log("Connection Sucessfull");
    });

    socket.on("connected", (data) => {
      console.log(data.message);
    });
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
    socket.on("serviceUpdated", ({ service, stats }) => {
      console.log("Live update:", service);
      console.log("Updated stats:", stats);

      setServices((previousServices) =>
        previousServices.map((currentService) =>
          currentService.id === service.id
            ? {
                ...currentService,
                ...service,
              }
            : currentService,
        ),
      );

      setServiceStats((previousStats) => ({
        ...previousStats,
        [service.id]: stats,
      }));
    });

    return () => {
      cancelled = true;
      socket.off("connect");
      socket.off("connected");
      socket.off("disconnect");
      socket.off("serviceUpdated");
    };
  }, []);

  // --------------------------------------------------
  // ADD SERVICE
  // --------------------------------------------------

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          url: url.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add service.");
      }

      // Clear form
      setName("");
      setUrl("");

      // Reload dashboard
      await loadDashboard();
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  // --------------------------------------------------
  // DELETE SERVICE
  // --------------------------------------------------

  const handleDeleteService = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?",
    );

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      const response = await fetch(`${BACKEND_URL}/api/services/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();

        throw new Error(data.error || "Failed to delete service.");
      }

      // Reload dashboard
      await loadDashboard();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  // --------------------------------------------------
  // DASHBOARD SUMMARY
  // --------------------------------------------------

  const totalServices = services.length;

  const healthyServices = services.filter(
    (service) => service.status === "UP",
  ).length;

  const downServices = services.filter(
    (service) => service.status === "DOWN",
  ).length;

  const servicesWithResponseTime = services.filter(
    (service) =>
      service.status === "UP" &&
      service.responseTime !== null &&
      service.responseTime !== undefined,
  );

  const averageResponseTime =
    servicesWithResponseTime.length === 0
      ? null
      : servicesWithResponseTime.reduce(
          (total, service) => total + service.responseTime,
          0,
        ) / servicesWithResponseTime.length;

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* ---------------------------------------- */}
        {/* HEADER */}
        {/* ---------------------------------------- */}

        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold">Local Service Monitor</h1>

              <p className="text-slate-400 mt-2">
                Real-time service health overview
              </p>
            </div>

            <button
              onClick={refreshDashboard}
              disabled={isRefreshing}
              className="px-5 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:cursor-not-allowed font-medium transition"
            >
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* -------------------------------------- */}
          {/* SUMMARY CARDS */}
          {/* -------------------------------------- */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-8">
            {/* Total */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-sm text-slate-400">Total Services</p>

              <p className="text-3xl font-bold mt-2">{totalServices}</p>
            </div>

            {/* Healthy */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-sm text-slate-400">Healthy</p>

              <p className="text-3xl font-bold text-green-400 mt-2">
                {healthyServices}
              </p>
            </div>

            {/* Down */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-sm text-slate-400">Down</p>

              <p className="text-3xl font-bold text-red-400 mt-2">
                {downServices}
              </p>
            </div>

            {/* Average response */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-sm text-slate-400">Avg. Response</p>

              <p className="text-3xl font-bold mt-2">
                {averageResponseTime === null
                  ? "N/A"
                  : `${Math.round(averageResponseTime)} ms`}
              </p>
            </div>
          </div>
        </div>

        {/* ---------------------------------------- */}
        {/* ADD SERVICE */}
        {/* ---------------------------------------- */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add Service</h2>

          <form
            onSubmit={handleAddService}
            className="grid gap-4 md:grid-cols-[1fr_2fr_auto]"
          >
            <input
              type="text"
              placeholder="Service name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />

            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={isAdding}
              className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed font-medium transition"
            >
              {isAdding ? "Adding..." : "Add Service"}
            </button>
          </form>
        </div>

        {/* ---------------------------------------- */}
        {/* ERROR */}
        {/* ---------------------------------------- */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* ---------------------------------------- */}
        {/* LOADING */}
        {/* ---------------------------------------- */}

        {isRefreshing && services.length === 0 && (
          <div className="text-center text-slate-400 py-12">
            Loading dashboard...
          </div>
        )}

        {/* ---------------------------------------- */}
        {/* SERVICE CARDS */}
        {/* ---------------------------------------- */}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const stats = serviceStats[service.id];

            return (
              <div
                key={service.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5"
              >
                {/* Service name + status */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">{service.name}</h2>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      service.status === "UP"
                        ? "bg-green-500/10 text-green-400"
                        : service.status === "DOWN"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-slate-500/10 text-slate-400"
                    }`}
                  >
                    {service.status}
                  </span>
                </div>

                {/* URL */}
                <p className="text-sm text-slate-400 break-all">
                  {service.url}
                </p>

                {/* Current status */}
                <div className="mt-5 space-y-2 text-sm">
                  <p>
                    Response time:{" "}
                    <span className="text-slate-300">
                      {service.responseTime === null ||
                      service.responseTime === undefined
                        ? "N/A"
                        : `${service.responseTime} ms`}
                    </span>
                  </p>

                  <p>
                    HTTP status:{" "}
                    <span className="text-slate-300">
                      {service.httpStatus ?? "N/A"}
                    </span>
                  </p>
                </div>

                {/* Statistics */}
                {stats && (
                  <div className="mt-5 border-t border-slate-800 pt-5">
                    <p className="text-sm text-slate-400 mb-4">
                      Monitoring statistics
                    </p>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-slate-500">Uptime</p>

                        <p className="text-lg font-semibold">
                          {stats.uptime.toFixed(2)}%
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Avg.</p>

                        <p className="text-lg font-semibold">
                          {stats.averageResponseTime === null
                            ? "N/A"
                            : `${Math.round(stats.averageResponseTime)} ms`}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Checks</p>

                        <p className="text-lg font-semibold">
                          {stats.totalChecks}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Last checked */}
                {service.lastChecked && (
                  <p className="mt-4 text-xs text-slate-500">
                    Last checked:{" "}
                    {new Date(service.lastChecked).toLocaleTimeString()}
                  </p>
                )}

                {/* Delete */}
                <button
                  onClick={() => handleDeleteService(service.id)}
                  className="mt-5 w-full rounded-lg bg-red-500/10 px-4 py-2 text-red-400 hover:bg-red-500/20 transition"
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
