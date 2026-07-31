import { useEffect, useState } from "react";

const BACKEND_URL = "http://localhost:5000";

function App() {
  const [services, setServices] = useState([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [lastChecked, setLastChecked] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

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
    fetchServices();

    const intervalId = setInterval(() => {
      fetchServices();
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

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
        throw new Error(data.error || "Failed to add service");
      }

      // Clear the form.
      setName("");
      setUrl("");

      // Reload services from the backend.
      await fetchServices();
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteService = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you wanna delete this service?",
    );
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/services/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete service");
      }
      await fetchServices();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
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

        {/* Add Service Form */}
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

        {/* Check Now */}
        <div className="flex justify-end mb-6">
          <button
            onClick={fetchServices}
            disabled={isChecking}
            className="px-5 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:cursor-not-allowed font-medium transition"
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

        {/* Services */}
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
              <button
                onClick={() => handleDeleteService(service.id)}
                className="mt-5 w-full rounded-lg bg-red-500/10 px-4 py-2 text-red-400 hover:bg-red-500/20 transition"
              >Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
