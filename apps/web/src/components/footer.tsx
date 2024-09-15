import Balancer from "react-wrap-balancer";
import { Button } from "./ui/button";
import { SiGithub, SiX } from "@icons-pack/react-simple-icons";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mx-auto max-w-screen-lg px-4 py-16">
      <p className="text-muted-foreground">© 2024</p>
      <p className="mt-4 text-muted-foreground">
        <Balancer>
          {`use-voice's mission is to accelerate innovation in human-computer interaction`}
        </Balancer>
      </p>
      <div className="mt-4 flex">
        <Button size="icon" variant="ghost" asChild>
          <Link href="https://x.com/sshkeda">
            <SiX className="h-4 w-4" />
          </Link>
        </Button>
        <Button size="icon" variant="ghost" asChild>
          <Link href="https://github.com/sshkeda/use-voice">
            <SiGithub className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </footer>
  );
}
