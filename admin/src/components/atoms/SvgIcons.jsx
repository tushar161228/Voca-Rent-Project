const CloseIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" stroke="currentColor" fill="none">
    <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ArrowDownIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" stroke="currentColor" fill="none">
    <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" />
  </svg>

);

const ArrowUp = () => {
  return (
    <svg
      className="w-3 h-3"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
};

export { CloseIcon, ArrowDownIcon, ArrowUp };