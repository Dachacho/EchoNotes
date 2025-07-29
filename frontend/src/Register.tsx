import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [registerError, setRegisterError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== passwordRepeat) {
      setPasswordError("passwords don't match");
      return;
    }
    setPasswordError("");

    try {
      const response = await fetch("http://localhost:8000/auth/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });
      if (response.ok) {
        console.log("registered");
      } else {
        setRegisterError("Failed to Register");
      }
    } catch (err) {
      setRegisterError("Network error. Please try again.");
      console.log(err);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tl from-gray-950 via-indigo-900 to-indigo-800/20">
        <div className="w-full max-w-md p-10 rounded-xl shadow-2xl bg-gray-800 border border-gray-700 mb-8">
          <h2 className="text-center font-bold tracking text-white text-2xl mb-8">
            Register
          </h2>
          <form
            action="POST"
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <input
              type="email"
              placeholder="input your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-gray-900 text-gray-100"
            />
            <input
              type="text"
              placeholder="input your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-4 py-3 rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-gray-900 text-gray-100"
            />
            <input
              type="password"
              placeholder="input your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-gray-900 text-gray-100"
            />
            <input
              type="password"
              placeholder="repeat your password"
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
              className="px-4 py-3 rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-gray-900 text-gray-100"
            />
            {passwordError && (
              <div className="text-red-400 text-sm"> {passwordError} </div>
            )}
            {registerError && (
              <div className="text-red-400 text-sm"> {registerError} </div>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              Register
            </button>
          </form>
          <p className="text-center text-sm text-gray-300 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
