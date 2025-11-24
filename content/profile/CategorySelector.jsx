"use client"
import { LuEye } from "react-icons/lu"
import { FaRegBookmark } from "react-icons/fa6";
import { IoMdCheckmark } from "react-icons/io";
import { MdOutlineFrontHand } from "react-icons/md";
import { BiBullseye } from "react-icons/bi";
import { IoPersonOutline } from "react-icons/io5";
import clsx from "clsx";
import { useMemo, useState, useEffect } from "react";

const CategorySelector = ({ active, setActive, totalMovies }) => {
  const [watchlist, setWatchlist] = useState([]);

  // Fetch watchlist from MongoDB
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await fetch('/api/watchlist?userId=default');
        if (response.ok) {
          const data = await response.json();
          setWatchlist(data);
        }
      } catch (error) {
        console.error('Error fetching watchlist:', error);
      }
    };

    fetchWatchlist();

    // Listen for updates
    const handleBookmarksUpdated = () => {
      fetchWatchlist();
    };

    window.addEventListener('bookmarksUpdated', handleBookmarksUpdated);
    return () => {
      window.removeEventListener('bookmarksUpdated', handleBookmarksUpdated);
    };
  }, []);

  // Get real counts from MongoDB watchlist
  const getCountNumber = (status) => {
    return watchlist.filter(item => item.status === status).length;
  };

  // Memoize the categorys array
  const categorys = useMemo(() => [
    {
      title: "Watching",
      id: "CURRENT",
      icon: <LuEye />,
      number: getCountNumber("CURRENT"),
    },
    {
      title: "To Watch",
      id: "PLANNING",
      icon: <FaRegBookmark />,
      number: getCountNumber("PLANNING"),
    },
    {
      title: "Watched",
      id: "COMPLETED",
      icon: <IoMdCheckmark />,
      number: getCountNumber("COMPLETED"),
    },
    {
      title: "On Hold",
      id: "PAUSED",
      icon: <MdOutlineFrontHand />,
      number: getCountNumber("PAUSED"),
    },
    {
      title: "Dropped",
      id: "DROPPED",
      icon: <BiBullseye />,
      number: getCountNumber("DROPPED"),
    },
    {
      title: "Statistics",
      id: "STATISTICS",
      icon: <IoPersonOutline />
    }
  ], [watchlist]);

  return (
    <div className="relative w-full min-[762px]:h-14 border-b border-[#23253274] text-white z-10">
      <div className="flex items-center justify-center h-full gap-1 max-[762px]:flex-wrap">
        {categorys.map((item, index) => (
          <div
            key={index}
            className={clsx(
              "relative flex gap-2 items-center cursor-pointer px-2 py-4 justify-center after:bg-[#ffffff9d] after:hover:w-full after:h-[3px] after:rounded-lg after:absolute after:bottom-0 after:w-0 after:transition-all",
              { 
                "after:bg-[#ffffff9d] after:w-full after:h-[3px] after:rounded-lg after:absolute after:bottom-0": 
                active === item.id 
              }
            )}
            onClick={() => setActive(item.id)}
          >
            <div className="text-xl">{item.icon}</div>
            <div>{item.title}</div>
            {item.number > 0 && (
              <span className="text-[#edededd6]">{item.number}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;