interface IconsProps{
    className:string
}
export const ChevronIconDown = ({ className}:IconsProps) => {

  return (
    <>
      <svg width="10" height="7" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path stroke="#635FC7" strokeWidth="2" fill="none" d="m1 1 4 4 4-4" />
      </svg>
    </>
  );
};


