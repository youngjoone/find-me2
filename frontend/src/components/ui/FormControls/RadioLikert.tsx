import React from 'react';
import { twMerge } from 'tailwind-merge';

interface RadioLikertProps {
  name: string;
  value: number;
  onChange: (value: number) => void;
  options?: number[]; // e.g., [1, 2, 3, 4, 5]
  className?: string;
}

const RadioLikert: React.FC<RadioLikertProps> = ({
  name,
  value,
  onChange,
  options = [1, 2, 3, 4, 5],
  className,
}) => {
  return (
    <div className={twMerge('flex space-x-2', className)}>
      {options.map((option) => (
        <label
          key={option}
          className="flex items-center cursor-pointer p-2 rounded-md hover:bg-accent has-[:checked]:bg-primary has-[:checked]:text-primary-foreground transition-colors"
        >
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            className="sr-only" // Hide native radio button
            aria-label={`Option ${option}`}
          />
          <span className="w-6 h-6 flex items-center justify-center border rounded-full text-sm">
            {option}
          </span>
        </label>
      ))}
    </div>
  );
};

export default RadioLikert;
