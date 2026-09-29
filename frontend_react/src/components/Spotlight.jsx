import React from 'react';

// Sets --mx/--my for the `.spotlight` glow and, with `tilt`, --rx/--ry for a
// subtle 3D lean toward the cursor. Pure CSS variables, so no re-renders.
export const trackPointer = (e, tilt = 0) => {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const px = e.clientX - rect.left;
  const py = e.clientY - rect.top;
  el.style.setProperty('--mx', `${px}px`);
  el.style.setProperty('--my', `${py}px`);
  if (tilt && e.pointerType === 'mouse') {
    el.style.setProperty('--ry', `${((px / rect.width) - 0.5) * tilt}deg`);
    el.style.setProperty('--rx', `${(0.5 - (py / rect.height)) * tilt}deg`);
  }
};

export const resetTilt = (e) => {
  e.currentTarget.style.setProperty('--rx', '0deg');
  e.currentTarget.style.setProperty('--ry', '0deg');
};

const Spotlight = ({ as: Tag = 'div', className = '', tilt = 0, children, ...rest }) => (
  <Tag
    className={`card spotlight ${className}`}
    onPointerMove={(e) => trackPointer(e, tilt)}
    onPointerLeave={tilt ? resetTilt : undefined}
    {...rest}
  >
    {children}
  </Tag>
);

export default Spotlight;
