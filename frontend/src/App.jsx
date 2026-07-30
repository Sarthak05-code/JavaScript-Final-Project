import { useEffect, useState } from "react";

const BACKEND_URL = "http://localhost:5000";

function App() {
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [lastChecked, setLastChecked] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const fetchServices = async () => {
    setIsChecking(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/services`);

      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }

      const data = await response.json();

      setServices(data);
      setError("");
      setLastChecked(new Date());
    } catch (error) {
      console.error(error);
      setError("Could not connect to backend.");
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Initial check when the page loads.
    fetchServices();

    // Automatically check every 10 seconds.
    const intervalId = setInterval(() => {
      fetchServices();
    }, 10000);

    // Clean up the interval when the component unmounts.
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Local Service Monitor</h1>

            <p className="text-slate-400 mt-2">
              Monitoring {services.length} service(s)
            </p>

            {lastChecked && (
              <p className="text-sm text-slate-500 mt-1">
                Last checked: {lastChecked.toLocaleTimeString()}
              </p>
            )}
          </div>

          <button
            onClick={fetchServices}
            disabled={isChecking}
            className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed font-medium transition"
          >
            {isChecking ? "Checking..." : "Check Now"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* Loading */}
        {isChecking && services.length === 0 && (
          <div className="text-center text-slate-400 py-12">
            Checking services...
          </div>
        )}

        {/* Service cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{service.name}</h2>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    service.status === "UP"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {service.status}
                </span>
              </div>

              <p className="text-sm text-slate-400 break-all">{service.url}</p>

              <div className="mt-5 space-y-2 text-sm">
                <p>
                  Response time:{" "}
                  <span className="text-slate-300">
                    {service.responseTime} ms
                  </span>
                </p>

                <p>
                  HTTP status:{" "}
                  <span className="text-slate-300">
                    {service.httpStatus ?? "N/A"}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
