import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState<
    { id: number; name: string; parent: number | null }[]
  >([]);
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    async function fetchWorkspaces() {
      try {
        console.log(token);
        const res = await axios.get(
          "http://localhost:8000/api/folders/",
          config
        );
        setWorkspaces(
          res.data.results.filter((f: { parent: number | null }) => !f.parent)
        );
      } catch (err) {
        console.error("Error fetching workspaces", err);
      }
    }
    fetchWorkspaces();
  }, []);

  const handleAddWorkspace = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const name = prompt("Enter workspace name: ");

    if (!name) {
      return;
    }
    try {
      const postRes = await axios.post(
        "http://localhost:8000/api/folders/",
        {
          name,
          parent: null,
        },
        config
      );
      console.log("Created workspace:", postRes.data);
      // Refetch workspaces after adding
      const res = await axios.get("http://localhost:8000/api/folders/", config);
      console.log("Fetched folders after add:", res.data);
      setWorkspaces(
        res.data.results.filter((f: { parent: number | null }) => !f.parent)
      );
    } catch (err) {
      console.log(err);
    }
    //SetWorkspaces([...workspaces, { id: Date.now(), name: name }]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-16">
      <h1 className="text-3xl font-bold text-white mb-12 tracking-wide drop-shadow-lg">
        Select a Workspace
      </h1>
      <div className="flex flex-col items-center gap-10 w-full max-w-lg">
        <div className="flex flex-col items-center gap-10 w-full max-w-lg p-10 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl">
          <div className="flex flex-col gap-6 w-full mt-4">
            {workspaces.length !== 0 ? (
              workspaces.map((ws) => (
                <div
                  key={ws.id}
                  className="w-full px-4 py-4 bg-gray-800 border-2 border-gray-700 backdrop-blur-md bg-opacity-60 text-gray-100 shadow-xl rounded-xl hover:bg-indigo-800/60 hover:scale-[1.03] hover:shadow-2xl hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all text-sm font-semibold tracking-wide flex flex-col items-center justify-center"
                  onClick={() => navigate(`/workspace/${ws.id}`)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mb-2 text-indigo-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7a2 2 0 012-2h3.172a2 2 0 011.414.586l1.828 1.828A2 2 0 0012.828 8H19a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                    />
                  </svg>
                  <span>{ws.name}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-400">No workspaces found.</div>
            )}
          </div>
          <button
            onClick={handleAddWorkspace}
            className="mt-6 w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 hover:shadow-lg transition flex items-center justify-center gap-2 text-base shadow"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
