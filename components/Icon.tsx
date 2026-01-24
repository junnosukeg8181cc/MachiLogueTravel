
import React from 'react';

interface IconProps {
  name: string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, className }) => {
  return (
    <span
      className={`material-icons-outlined inline-flex items-center justify-center w-[1em] h-[1em] overflow-hidden select-none ${className || ''}`}
      aria-hidden="true"
    >
      {name}
    </span>
  );
};

export default Icon;
