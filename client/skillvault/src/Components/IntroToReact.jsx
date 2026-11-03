import { useState } from "react";
import { useNavigate } from "react-router-dom";

function IntroToReact() {
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(false);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Intro to React</h1>
      <p className="text-gray-700 mb-4">
        Welcome to Intro to React! Learn the fundamentals of modern React: JSX, functional components, state, props, and hooks.
      </p>
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Module 1: React Fundamentals & Virtual DOM</h2>
        <p className="text-gray-600 mb-4">
          Complete the micro-task on Virtual DOM reconciliation to earn 20 tokens!
        </p>
        <button
          onClick={() => setCompleted(true)}
          className={`px-4 py-2 rounded text-white font-medium transition ${
            completed ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {completed ? "✓ Task Completed (+20 Tokens Earned!)" : "Submit Task & Claim Tokens"}
        </button>
      </div>
      <button
        onClick={() => navigate("/courses")}
        className="text-blue-600 hover:underline"
      >
        &larr; Back to Courses
      </button>
    </div>
  );
}

export default IntroToReact;