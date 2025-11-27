import { cn } from "@/lib/utils";

export const TokenTapLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient
        id="logo-gradient"
        x1="8"
        y1="4"
        x2="40"
        y2="44"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="hsl(var(--primary))" />
        <stop offset="1" stopColor="hsl(var(--accent))" />
      </linearGradient>
    </defs>
    <path
      d="M24 4C15.163 4 8 11.163 8 20C8 26.69 12.03 32.54 17.99 35.58L24 44L30.01 35.58C35.97 32.54 40 26.69 40 20C40 11.163 32.837 4 24 4Z"
      fill="url(#logo-gradient)"
    />
    <circle cx="24" cy="22" r="6" fill="hsl(var(--background))" />
    <path
      d="M24 20L27 23L24 26L21 23L24 20Z"
      fill="url(#logo-gradient)"
    />
  </svg>
);

export const GlowingCheckmark = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
      className={cn("text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]", props.className)}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );

export const LightningBolt = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);
