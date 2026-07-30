import { useEffect, useState } from "react";

function App() {
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/services")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        return response.json();
      })
      .then((data) => {
        setServices(data);
      })
      .catch((error) => {
        console.error(error);
        setError("Could not connect to backend.");
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Local Service Monitor</h1>

        <p className="text-slate-400 mb-8">
          Monitoring {services.length} service(s)
        </p>

        {error && <p className="text-red-400 mb-6">{error}</p>}

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
