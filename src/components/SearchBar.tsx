import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, Compass } from 'lucide-react';
import { GeoLocationResult } from '../types';
import { searchCities } from '../utils/api';

interface SearchBarProps {
  onSelectCity: (city: GeoLocationResult) => void;
  onUseCurrentLocation: () => void;
  isLoading: boolean;
  popularCities: GeoLocationResult[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectCity,
  onUseCurrentLocation,
  isLoading,
  popularCities,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<GeoLocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search input debounced query
  useEffect(() => {
    const query = searchTerm.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(async () => {
      try {
        const results = await searchCities(query);
        setSuggestions(results);
        setShowDropdown(results.length > 0);
      } catch (err) {
        console.error('Error fetching city suggestions:', err);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    } else if (searchTerm.trim()) {
      // Trigger search for typed city
      setIsSearching(true);
      searchCities(searchTerm.trim()).then((results) => {
        setIsSearching(false);
        if (results && results.length > 0) {
          handleSelect(results[0]);
        } else {
          // Pass dummy location to trigger "City not found" error in parent
          onSelectCity({
            id: 0,
            name: searchTerm.trim(),
            latitude: NaN,
            longitude: NaN,
            country: '',
          });
        }
      });
    }
  };

  const handleSelect = (city: GeoLocationResult) => {
    setSearchTerm(`${city.name}${city.country ? `, ${city.country}` : ''}`);
    setShowDropdown(false);
    onSelectCity(city);
  };

  return (
    <div id="search-section" className="w-full max-w-3xl mx-auto space-y-3">
      
      {/* Search Bar Input Container */}
      <div className="relative" ref={dropdownRef}>
        <form onSubmit={handleSubmit} className="relative flex items-center">
          
          <div className="absolute left-4 pointer-events-none text-slate-400 dark:text-slate-500">
            {isLoading || isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin text-sky-500" id="search-spinner" />
            ) : (
              <Search className="w-5 h-5 text-slate-400" />
            )}
          </div>

          <input
            id="city-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setShowDropdown(true);
            }}
            placeholder="Search city (e.g., Chennai, London, Tokyo, New York)..."
            className="w-full pl-12 pr-28 py-3.5 text-sm sm:text-base bg-white dark:bg-slate-800/90 text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:border-sky-300 dark:hover:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />

          <div className="absolute right-2 flex items-center gap-1">
            {searchTerm && (
              <button
                type="button"
                id="clear-search-btn"
                onClick={() => {
                  setSearchTerm('');
                  setSuggestions([]);
                  setShowDropdown(false);
                }}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              id="geo-location-btn"
              onClick={onUseCurrentLocation}
              title="Use current GPS location"
              className="flex items-center gap-1.5 px-3 py-2 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/80 text-sky-600 dark:text-sky-400 text-xs font-semibold rounded-xl border border-sky-200 dark:border-sky-800 transition-colors"
            >
              <Compass className="w-4 h-4 text-sky-500" />
              <span className="hidden sm:inline">My Location</span>
            </button>
          </div>
        </form>

        {/* Auto-complete Suggestions Dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <div
            id="search-suggestions-dropdown"
            className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50"
          >
            {suggestions.map((city) => (
              <button
                key={`${city.id}-${city.name}`}
                type="button"
                id={`suggestion-item-${city.id}`}
                onClick={() => handleSelect(city)}
                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-sky-50 dark:hover:bg-slate-700/60 transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <MapPin className="w-4 h-4 text-sky-500 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                    {city.name}
                  </span>
                  {city.admin1 && (
                    <span className="text-xs text-slate-400 dark:text-slate-400 truncate hidden sm:inline">
                      ({city.admin1})
                    </span>
                  )}
                </div>
                {city.country && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shrink-0 ml-2">
                    {city.country}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Popular City Quick Select Chips */}
      <div id="popular-cities-bar" className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
          Popular:
        </span>
        {popularCities.map((city) => (
          <button
            key={city.name}
            id={`popular-city-chip-${city.name.toLowerCase()}`}
            onClick={() => onSelectCity(city)}
            className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-sky-100 dark:hover:bg-sky-950 hover:text-sky-700 dark:hover:text-sky-300 border border-slate-200/80 dark:border-slate-700 transition-colors"
          >
            {city.name}
          </button>
        ))}
      </div>

    </div>
  );
};
