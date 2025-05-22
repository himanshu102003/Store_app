import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  to?: string;
}

const Logo: React.FC<LogoProps> = ({ to = '/', className = '', ...props }) => {
  const logo = (
    <svg
      className={`h-8 w-auto ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 2L3 8V22H21V8L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 22V15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 12H15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return to ? <Link to={to}>{logo}</Link> : logo;
};

export { Logo };
