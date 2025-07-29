import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center px-4 py-2 bg-gray-900 border-b border-gray-800">
      <h1 className="text-indigo-400 font-bold text-2xl tracking-tighter">
        EchoNotes
      </h1>

      <Link
        to="/login"
        className="text-gray-200 hover:text-indigo-400 transition font-semibold px-4 py-2 rounded"
      >
        {" "}
        Login{" "}
      </Link>
    </div>
  );
}
