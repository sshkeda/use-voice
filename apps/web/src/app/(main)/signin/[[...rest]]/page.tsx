import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="mx-auto mt-4 max-w-screen-lg px-2 md:mt-16">
      <div className="flex justify-center">
        <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
          <div className="inline-flex items-center justify-center whitespace-nowrap rounded-sm bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            sign in
          </div>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            sign up
          </Link>
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <SignIn forceRedirectUrl="" />
      </div>
    </div>
  );
}
