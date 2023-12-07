

export const SearchBar = () => {

    return (
      <div
      className="flex items-center gap-4 rounded-full px-4 py-3 bg-darkAccent w-full mb-3"
      >
        <i className="fas fa-magnifying-glass text-placeolder"></i>
        <input type="text" 
        placeholder="Search"
        className="outline-none bg-transparent text-placeolder"
        />
      </div>
    )
  }
  