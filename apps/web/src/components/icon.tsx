import { cn } from "@/lib/utils";

export default function Icon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="97"
      height="64"
      viewBox="0 0 97 64"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("fill-white", className)}
      {...props}
    >
      <circle cx="32" cy="32" r="32" />
      <circle cx="89.695" cy="32.295" r="7.295" />
    </svg>
  );
}
