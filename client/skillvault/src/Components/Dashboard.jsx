function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Your Learning Dashboard</h1>
      <p className="text-lg">Learning Scores:</p>
      <ul className="mt-4 space-y-2">
        <li className="bg-green-100 p-3 rounded">Intro to React: 85%</li>
        <li className="bg-green-100 p-3 rounded">Node.js and Express: 60%</li>
        <li className="bg-green-100 p-3 rounded">MongoDB Basics: 40%</li>
      </ul>
    </div>
  );
}
