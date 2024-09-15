import AccountDropdown from "./account-dropdown";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed left-0 top-0 z-20 w-full bg-background">
      <div className="mx-auto flex max-w-screen-lg items-center justify-between p-2">
        <Link href="/" className="flex items-center">
          <svg
            width="242"
            height="242"
            viewBox="0 0 242 242"
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
          >
            <circle cx="121" cy="121" r="59" fill="white" />
            <circle
              cx="228"
              cy="121"
              r="14"
              className="fill-muted-foreground"
            />
          </svg>
          <span className="-mt-[1px] ml-1 font-mono text-lg text-muted-foreground">
            use-voice
          </span>
        </Link>
        <AccountDropdown />
      </div>
    </nav>
  );
}
