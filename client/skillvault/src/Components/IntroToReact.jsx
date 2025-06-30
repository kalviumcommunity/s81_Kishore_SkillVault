import React from 'react'

function IntroToReact() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Intro to React</h1>
      <p className="text-lg mb-4">React is a JavaScript library for building user interfaces.</p>
      <ul className="list-disc list-inside space-y-2">
        <li>JSX – JavaScript XML syntax</li>
        <li>Components – Reusable UI pieces</li>
        <li>Props – Passing data to components</li>
        <li>State – Managing data within a component</li>
        <li>Hooks – Special functions like useState and useEffect</li>
      </ul>
    </div>
  );
}

export default IntroToReact;