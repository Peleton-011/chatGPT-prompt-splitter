import React, { useState } from 'react';

interface DropdownOption {
  label: string;
  value: string;
}

interface Props {
  options: DropdownOption[];
  onSelect: (value: string) => void;
}

const CustomDropdown: React.FC<Props> = ({ options, onSelect }) => {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [customValue, setCustomValue] = useState<string>('');

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedValue(value);
    onSelect(value);
  };

  const handleCustomInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedValue(value); // Select custom value
    setCustomValue(value);
    onSelect(value);
  };

  return (
    <div>
      <select value={selectedValue} onChange={handleSelectChange}>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
        <option value="custom">Custom Value</option>
      </select>
      {selectedValue === 'custom' && (
        <input
          type="number"
          value={customValue}
          onChange={handleCustomInputChange}
          placeholder="Enter custom value"
        />
      )}
    </div>
  );
};

export default CustomDropdown;
