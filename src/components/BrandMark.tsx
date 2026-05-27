type Props = { className?: string; title?: string };

/**
 * Three ascending rounded bars — short teal, medium muted blue, tall navy.
 * Suggests scope/progression without authority/seal imagery.
 */
export function BrandMark({ className, title = "cybersakerhetslagen.nu" }: Props) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      {/* Short — muted teal */}
      <rect x="2"  y="13" width="4" height="8"  rx="2" fill="var(--accent)" fillOpacity="0.9" />
      {/* Medium — muted blue */}
      <rect x="9"  y="8"  width="4" height="13" rx="2" fill="var(--primary)" fillOpacity="0.55" />
      {/* Tall — deep navy */}
      <rect x="16" y="2"  width="4" height="19" rx="2" fill="var(--primary)" />
    </svg>
  );
}
