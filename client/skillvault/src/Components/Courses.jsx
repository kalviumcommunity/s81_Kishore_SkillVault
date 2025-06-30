function Courses() {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Full Stack Courses</h1>
        <ul className="space-y-4">
          <li className="border p-4 rounded shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">Intro to React</h2>
            <p className="text-gray-600">Learn the basics of React.js – components, state, props, and more.</p>
            <a href="/courses/introtoreact" className="text-blue-600 hover:underline">Go to course</a>
          </li>
          <li className="border p-4 rounded shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">Node.js and Express</h2>
            <p className="text-gray-600">Build fast, scalable backends using Node.js and Express.js.</p>
          </li>
          <li className="border p-4 rounded shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">MongoDB for Beginners</h2>
            <p className="text-gray-600">Understand the NoSQL database, MongoDB, and how to integrate it with Node.</p>
          </li>
        </ul>
      </div>
    );
  }
  
  export default Courses;