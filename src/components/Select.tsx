import React from 'react';

interface SelectWithFilterProps {
    options: string[];
}

const SelectWithFilter = ({ options }: SelectWithFilterProps) => {
  const [filteredOptions, setFilteredOptions] = React.useState(options);
  const [inputValue, setInputValue] = React.useState<string>('');
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
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
