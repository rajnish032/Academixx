
import React, { useState } from 'react'
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ data }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ? data : '');

  const onSearchHandler = (e) => {
    e.preventDefault();
    navigate('/course-list/' + input);
  };

  return (
  <form
    onSubmit={onSearchHandler}
    className="max-w-xl w-full md:h-14 h-12 flex items-center overflow-hidden"
    style={{ background: "#FFFDF8", border: "1px solid #1D2B3A" }}
  >
    <img
      src={assets.search_icon}
      alt="search_icon"
      className="w-10 px-3"
      style={{ filter: "invert(15%) sepia(20%) hue-rotate(180deg)", opacity: 0.6 }}
    />

    <input
      onChange={(e) => setInput(e.target.value)}
      value={input}
      type="text"
      placeholder="Search for courses"
      className="w-full h-full bg-transparent outline-none px-2"
      style={{
        fontFamily: "'Source Serif 4', Georgia, serif",
        color: "#211F1B",
      }}
    />

    <button
      type="submit"
      className="transition-colors px-7 py-2 mx-1 text-sm"
      style={{
        fontFamily: "'Inter', sans-serif",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        fontSize: "11px",
        background: "#7A2E2E",
        color: "#F8F5EE",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#5F2323")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#7A2E2E")}
    >
      Search
    </button>
  </form>
);
}

export default SearchBar;
