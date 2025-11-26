"use client";
import useScreenDimensions from "@/hook/useScreenDimensions";
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import SearchResults from "./SearchResults";
import { useRouter } from "next/navigation";

const Search = () => {
  const router = useRouter()

  const { width } = useScreenDimensions();
  const [isSearchBoxOpen, setIsSearchBoxOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [searchValue, setSearchValue] = useState("")

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleSearchSubmit = () => {
    if (searchValue.trim()) {
      // Use '/catalog' (without movies prefix) to match your route structure
      router.push(`/catalog?q=${encodeURIComponent(searchValue.trim())}`);
      setIsSearchBoxOpen(false);
      setSearchValue("");
    }
  };

  if (!hasMounted) {
    return null; // or a loader/spinner
  }

  if (width <= 590) {
    return (
      isSearchBoxOpen ? (
        <div className="absolute w-[80%] top-1/2 left-4 -translate-y-1/2">
          <div className="relative w-full">

            <div className="h-10 flex items-center justify-between bg-[#231f2c] rounded-md">
              <div className="flex items-center text-white px-3 py-1 gap-2 rounded-md h-10 w-full">
                <div className="text-lg">
                  <IoIosSearch />
                </div>

                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent outline-none w-full text-sm"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  onKeyUp={e => {
                    if (e.key === "Enter") {
                      handleSearchSubmit();
                    }
                  }}
                />
              </div>

              <div className="text-2xl text-white cursor-pointer mr-2" onClick={() => {
                setIsSearchBoxOpen(false)
                setSearchValue("")
              }}>
                <IoCloseOutline />
              </div>
            </div>

            {searchValue !== "" && <SearchResults
              searchValue={searchValue}
              setIsSearchBoxOpen={setIsSearchBoxOpen}
              setSearchValue={setSearchValue}
            />}
          </div>
        </div>
      ) : (
        <div className="text-xl text-white cursor-pointer" onClick={() => setIsSearchBoxOpen(true)}>
          <IoIosSearch />
        </div>
      )
    );
  }

  return (
    <div className="relative w-full">
      <div className="flex items-center text-white bg-[#231f2c] px-4 py-1 gap-2 rounded-md h-10">
        <div className="text-xl">
          <IoIosSearch />
        </div>

        <input
          type="text"
          placeholder="Search"
          className="bg-[#231f2c] outline-none w-full"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          onKeyUp={e => {
            if (e.key === "Enter") {
              handleSearchSubmit();
            }
          }}
        />
      </div>

      {searchValue !== "" && <SearchResults 
        searchValue={searchValue} 
        setIsSearchBoxOpen={setIsSearchBoxOpen}
        setSearchValue={setSearchValue}
      />}
    </div>
  );
}

export default Search;
