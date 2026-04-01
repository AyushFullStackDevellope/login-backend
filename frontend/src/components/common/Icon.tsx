import React, { SVGProps } from 'react';

/**
 * A reusable simple Icon proxy.
 * To keep it beginner friendly without generic libraries, we pass standard inline SVGs if provided,
 * otherwise we render fallback user SVG logic. 
 */
interface IconProps extends SVGProps<SVGSVGElement> {
  svgPath?: React.ReactNode;
  circle?: boolean;
}

export function Icon({ svgPath, circle, width = 24, height = 24, ...props }: IconProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`} 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      {circle && <circle cx={Number(width)/2} cy={Number(height)/2} r={(Number(width)/2)-2} />}
      {svgPath}
    </svg>
  );
}
