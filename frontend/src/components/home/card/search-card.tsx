import SearchInputCard from "./search-input-card";
export default function SearchCard() {
  return (
    <div className="flex flex-row gap-4 w-full bg-[rgb(237,238,255)] rounded-[10px] justify-between items-center p-4">
      <div className="flex w-full">
        <SearchInputCard />
      </div>
    </div>
  );
}
