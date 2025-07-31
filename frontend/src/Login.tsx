import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/auth/jwt/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access);

        navigate("/dashboard");
      } else {
        setError("Login Failed");
      }
    } catch (err) {
      setError("Network Error, Please try again.");
      console.log(err);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md p-10 rounded-xl shadow-2xl bg-gray-800 border border-gray-700 mb-8">
          <h2 className="text-center font-bold tracking text-white text-2xl mb-8">
            Login
          </h2>
          <form
            action="POST"
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <input
              type="text"
              placeholder="input your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              className="px-4 py-3 rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-gray-900 text-gray-100"
            />
            <input
              type="password"
              placeholder="input your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="px-4 py-3 rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-gray-900 text-gray-100"
            />
            {error && <div className="text-red-400 text-sm">{error}</div>}
            <button
              type="submit"
              className="w-full py-3 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              Login
            </button>
          </form>
          <p className="text-center text-sm text-gray-300 mt-4">
            Not Registered?{" "}
            <Link
              to="/register"
              className="text-indigo-400 hover:text-indigo-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
