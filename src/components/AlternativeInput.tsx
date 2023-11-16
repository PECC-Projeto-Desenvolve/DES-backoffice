import { Checkbox, Input, Typography } from '@material-tailwind/react';
import React from 'react';

interface IAlternativeInputProps {
    label: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function AlternativeInput({ label, onChange }: IAlternativeInputProps): JSX.Element {
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
        />

        <Checkbox />
      </div>
    </>
  );
}

export { AlternativeInput };
