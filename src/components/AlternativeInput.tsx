import { Checkbox, Input, Typography } from '@material-tailwind/react';
import React from 'react';

interface IAlternativeInputProps {
    label: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    checkboxProps: {
        checked: boolean;
        onChange: () => void;
        disabled: boolean;
      };
}


/**
 * Renders a custom input component with an associated label and checkbox, using Material Tailwind.
 *
 * @param {object} props - Component props.
 * @param {string} props.label - Text to display as the label of the input.
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} props.onChange - Handler for input text changes.
 * @param {string} props.value - The current value of the input field.
 * @param {object} props.checkboxProps - Properties for the checkbox component.
 * @param {boolean} props.checkboxProps.checked - Whether the checkbox is checked or not.
 * @param {() => void} props.checkboxProps.onChange - Handler for checkbox state changes.
 * @param {boolean} props.checkboxProps.disabled - Whether the checkbox is disabled or not.
 * @returns {JSX.Element} A composite component with a label, text input, and a checkbox.
 */
function AlternativeInput({ label, onChange, value, checkboxProps }: IAlternativeInputProps): JSX.Element {
  return (
    <>
      <div className="relative flex w-full">
        <div className="flex items-center gap-2 rounded-l-md border border-r-0 border-blue-gray-200 bg-blue-gray-500/10 px-4 py-2">
          <Typography>
            {label}
          </Typography>
        </div>
        <Input
          type="text"
          size='lg'
          placeholder="Texto da alternativa"
          className="rounded-l-none !border-t-blue-gray-200 focus:!border-t-gray-900"
          labelProps={{
            className: 'before:content-none after:content-none',
          }}
          containerProps={{
            className: 'min-w-0',
          }}
          onChange={onChange}
          value={value}
        />

        <Checkbox {...checkboxProps} />
      </div>
    </>
  );
}

export { AlternativeInput };
