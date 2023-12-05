interface IIconProps {
    id: number;
    open: number;
}

/**
 * Renders an SVG icon that changes orientation based on the provided `id` and `open` props.
 *
 * @param {object} props - Component props.
 * @param {number} props.id - Unique identifier for the icon.
 * @param {number} props.open - Identifier to determine the icon's orientation.
 * @returns {JSX.Element} An SVG icon which rotates when the `id` matches the `open` value.
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
