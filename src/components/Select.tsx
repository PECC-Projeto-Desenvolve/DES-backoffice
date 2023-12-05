import React, { useState, useEffect } from 'react';

interface SelectWithFilterProps {
    options: string[];
    // onSelect: (selectedOption: string) => void;
}

const SelectWithFilter = ({ options }: SelectWithFilterProps) => {
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setFilteredOptions(
      options.filter(option =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      )
    );
  }, [inputValue, options]);

  return (
    <div className="relative z-50">
      <input
        type="text"
        className="w-full rounded-md border border-gray-300 p-2"
        placeholder="Type to filter..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 100)}
      />
      {isOpen && (
        <ul className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              className="cursor-pointer p-2 hover:bg-gray-100"
              onClick={() => {
                setInputValue(option);
                setIsOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectWithFilter;
