
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
      className='max-w-xl w-full md:h-14 h-12 flex items-center 
      bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg overflow-hidden shadow-lg'
    >
      <img
        src={assets.search_icon}
        alt='search_icon'
        className='w-10 px-3 opacity-80'
      />

      <input
        onChange={e => setInput(e.target.value)}
        value={input}
        type='text'
        placeholder='Search for courses'
        className='w-full h-full bg-transparent outline-none text-white placeholder-gray-400 px-2'
      />

      <button
        type='submit'
        className='bg-cyan-500 hover:bg-cyan-600 transition rounded-md text-white px-7 py-2 mx-1'
      >
        Search
      </button>
    </form>
  )
}

export default SearchBar;
