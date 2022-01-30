import classes from './index.module.scss';

const sizes = {
  s: 0.75,
  m: 1,
  l: 1.5,
} as const;

export const Icon = ({ path, size }: { path: string; size?: keyof typeof sizes }) => {
  return (
    <svg
      role="img"
      aria-hidden="true"
      width={size && `${sizes[size]}rem`}
      viewBox="0 0 24 24"
      class={classes.icon}
    >
      <path d={path}></path>
    </svg>
  );
};
