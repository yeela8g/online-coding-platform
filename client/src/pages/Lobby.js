import React from "react";
import {subjectsList} from '../utils/subjectList'


export const Lobby = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-green-200 flex flex-col items-center justify-center">
      <div className=" bg-white rounded-lg p-5">
      <h1 className="text-4xl text-center font-bold mb-6 text-gray-800">Lobby Page</h1>
      <div className="text-lg text-center font-semibold mb-4 text-gray-600">Choose Code Block:</div>
      <ul className="space-y-4">
         {subjectsList.map((item, index) => (
          <li key={index}>
            <button
              onClick={() => (window.location.href = `/blockcode/${item.id}`)}
              className="px-6 py-3 w-full bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition duration-300"
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
};
