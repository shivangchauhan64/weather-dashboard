import React from 'react';

const Sidebar = ({ city, setCity, suggestions, addCity, favorites, removeCity, darkMode, setDarkMode, errorMsg, selectCity, selectSuggestion }) => {
  return (
    <div className="w-full md:w-64 bg-gray-200 dark:bg-gray-800 p-4 flex flex-col gap-4 md:min-h-screen">
      <h1 className="text-2xl font-bold">🌤 Dashboard</h1>
      <div className="relative flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-2 py-1 rounded bg-white dark:bg-gray-700 text-black dark:text-white flex-1 w-full"
          />
          <button 
            onClick={() => addCity()} 
            className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-white text-sm whitespace-nowrap min-w-[60px]"
          >
            Add
          </button>
        </div>
        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded mt-1 z-10">
            {suggestions.map((sugg) => (
              <li
                key={`${sugg.lat}-${sugg.lon}`}
                onClick={() => selectSuggestion(sugg)}
                className="px-2 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                {sugg.name}, {sugg.country}
              </li>
            ))}
          </ul>
        )}
      </div>
      {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
      <ul className="flex flex-col gap-2">
        {favorites.map((fav) => (
          <li key={fav} className="flex justify-between items-center">
            <button 
              onClick={() => selectCity(fav)} 
              className="text-left flex-1 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {fav}
            </button>
            <button 
              onClick={() => removeCity(fav)} 
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 px-3 py-1 rounded flex items-center justify-center gap-2 transition-colors mt-auto"
      >
        {darkMode ? (
          <>
            <span>☀️</span> Light Mode
          </>
        ) : (
          <>
            <span>🌙</span> Dark Mode
          </>
        )}
      </button>
    </div>
  );
};

export default Sidebar;