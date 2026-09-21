import React from 'react';
import { Search, Filter, X, ArrowUpDown, Building2, User, Heart, Sparkles, RefreshCw } from 'lucide-react';
import { FilterState, ConvictionCategory } from '../types';

interface SearchFiltersBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalActiveCount: number;
  filteredCount: number;
}

export const SearchFiltersBar: React.FC<SearchFiltersBarProps> = ({
  filters,
  setFilters,
  totalActiveCount,
  filteredCount,
}) => {
  const isFiltered = 
    filters.searchQuery !== '' ||
    filters.facility !== '' ||
    filters.gender !== '' ||
    filters.ageRange !== '' ||
    filters.convictionCategory !== '' ||
    filters.seeking !== '' ||
    filters.sortBy !== 'newest';

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      facility: '',
      gender: '',
      ageRange: '',
      convictionCategory: '',
      seeking: '',
      sortBy: 'newest',
    });
  };

  const setQuickFilter = (key: keyof FilterState, val: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === val ? '' : val
    }));
  };

  return (
    <div id="search-filter-section" className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5 mb-6">
      {/* Top Search Input & Sort */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-4">
        {/* Search bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="search-inmates-input"
            type="text"
            value={filters.searchQuery}
            onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Search by Inmate Name, Moniker (e.g. D-Loc, Vixen), Booking #, Hometown, or Charges..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-2 min-w-[200px]">
          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            id="filter-sort-by-select"
            value={filters.sortBy}
            onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
            className="w-full py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          >
            <option value="newest">Sort: Recently Posted</option>
            <option value="paroleSoon">Sort: Earliest Release Date</option>
            <option value="ageAsc">Sort: Age (Youngest First)</option>
            <option value="ageDesc">Sort: Age (Oldest First)</option>
            <option value="name">Sort: Name (A to Z)</option>
          </select>
        </div>
      </div>

      {/* Main Filter Dropdowns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-100 text-xs">
        {/* Facility */}
        <div>
          <label className="block font-semibold text-slate-600 mb-1">
            Facility / Institution
          </label>
          <select
            id="filter-facility-select"
            value={filters.facility}
            onChange={e => setFilters(prev => ({ ...prev, facility: e.target.value }))}
            className="w-full py-2 px-2.5 bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:bg-white focus:outline-none focus:border-amber-500"
          >
            <option value="">All San Andreas Facilities</option>
            <option value="Bolingbroke State Penitentiary - Maximum">Bolingbroke State Pen (Max)</option>
            <option value="Bolingbroke State Penitentiary - Medium">Bolingbroke State Pen (Med)</option>
            <option value="LSCJ Twin Towers Correctional">LSCJ Twin Towers</option>
            <option value="Sandy Shores Correctional Camp">Sandy Shores Fire Camp</option>
            <option value="Paleto Bay Detention Center">Paleto Bay Detention</option>
          </select>
        </div>

        {/* Gender */}
        <div>
          <label className="block font-semibold text-slate-600 mb-1">
            Gender
          </label>
          <select
            id="filter-gender-select"
            value={filters.gender}
            onChange={e => setFilters(prev => ({ ...prev, gender: e.target.value }))}
            className="w-full py-2 px-2.5 bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:bg-white focus:outline-none focus:border-amber-500"
          >
            <option value="">All Genders</option>
            <option value="Male">Male Inmates</option>
            <option value="Female">Female Inmates</option>
            <option value="Non-Binary">Non-Binary</option>
          </select>
        </div>

        {/* Age Range */}
        <div>
          <label className="block font-semibold text-slate-600 mb-1">
            Age Bracket
          </label>
          <select
            id="filter-age-range-select"
            value={filters.ageRange}
            onChange={e => setFilters(prev => ({ ...prev, ageRange: e.target.value }))}
            className="w-full py-2 px-2.5 bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:bg-white focus:outline-none focus:border-amber-500"
          >
            <option value="">Any Age</option>
            <option value="18-25">18 - 25 years old</option>
            <option value="26-35">26 - 35 years old</option>
            <option value="36-45">36 - 45 years old</option>
            <option value="46+">46+ years old</option>
          </select>
        </div>

        {/* Offense / Category */}
        <div>
          <label className="block font-semibold text-slate-600 mb-1">
            Conviction Offense
          </label>
          <select
            id="filter-offense-select"
            value={filters.convictionCategory}
            onChange={e => setFilters(prev => ({ ...prev, convictionCategory: e.target.value }))}
            className="w-full py-2 px-2.5 bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:bg-white focus:outline-none focus:border-amber-500"
          >
            <option value="">All Conviction Types</option>
            <option value="Robbery / Theft">Robbery / Theft</option>
            <option value="Violent Crimes">Violent Crimes</option>
            <option value="Narcotics & Smuggling">Narcotics & Smuggling</option>
            <option value="Weapons & Firearms">Weapons & Firearms</option>
            <option value="White Collar / Fraud">White Collar / Fraud</option>
            <option value="Racketeering / RICO">Racketeering / RICO</option>
          </select>
        </div>

        {/* Seeking Intent */}
        <div>
          <label className="block font-semibold text-slate-600 mb-1">
            Looking For
          </label>
          <select
            id="filter-seeking-select"
            value={filters.seeking}
            onChange={e => setFilters(prev => ({ ...prev, seeking: e.target.value }))}
            className="w-full py-2 px-2.5 bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:bg-white focus:outline-none focus:border-amber-500"
          >
            <option value="">Any Pen-Pal Reason</option>
            <option value="Friendship">Friendship</option>
            <option value="Romance">Romance & Dating</option>
            <option value="Pen-Pal Letters">Postal / Letter Writing</option>
            <option value="Legal Assistance">Legal Assistance</option>
            <option value="Creative Exchange">Creative Exchange</option>
          </select>
        </div>
      </div>

      {/* Quick Filter Badges & Counter */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 font-medium mr-1">Quick Filters:</span>
          
          <button
            onClick={() => setQuickFilter('seeking', 'Romance')}
            className={`px-2.5 py-1 rounded-full border transition-colors ${
              filters.seeking === 'Romance'
                ? 'bg-rose-50 border-rose-300 text-rose-700 font-medium'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Seeking Romance
          </button>

          <button
            onClick={() => setQuickFilter('facility', 'Bolingbroke State Penitentiary - Maximum')}
            className={`px-2.5 py-1 rounded-full border transition-colors ${
              filters.facility === 'Bolingbroke State Penitentiary - Maximum'
                ? 'bg-amber-50 border-amber-300 text-amber-800 font-medium'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Bolingbroke Max
          </button>

          <button
            onClick={() => setQuickFilter('gender', 'Female')}
            className={`px-2.5 py-1 rounded-full border transition-colors ${
              filters.gender === 'Female'
                ? 'bg-purple-50 border-purple-300 text-purple-700 font-medium'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Women Inmates
          </button>

          <button
            onClick={() => setQuickFilter('seeking', 'Legal Assistance')}
            className={`px-2.5 py-1 rounded-full border transition-colors ${
              filters.seeking === 'Legal Assistance'
                ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Needs Legal Help
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{filteredCount}</strong> of {totalActiveCount} inmates
          </span>

          {isFiltered && (
            <button
              id="reset-filters-btn"
              onClick={resetFilters}
              className="flex items-center gap-1 text-amber-700 hover:text-amber-800 font-medium transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset All</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
