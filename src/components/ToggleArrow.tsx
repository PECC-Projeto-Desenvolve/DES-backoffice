interface IIconProps {
    id: number;
    open: number;
}

/**
 * Renders a `SelectWithFilter` component that allows users to filter through a list of options
 * in a dropdown by typing in an input field. The component filters options based on the input's
 * value and updates the list dynamically.
 *
 * @param {SelectWithFilterProps} props - Properties passed to the component.
 * @param {string[]} props.options - An array of strings representing the selectable options.
 * @returns {JSX.Element} A component comprising an input field for filtering and a dropdown list of options.
 */
function Icon({ id, open }: IIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${id === open ? 'rotate-180' : ''} h-5 w-5 transition-transform`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

export { Icon };
