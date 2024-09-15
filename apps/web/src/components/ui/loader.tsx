import { cn } from "@/lib/utils";
import { Loader as LoaderIcon } from "lucide-react";

export default function Loader({ className }: { className?: string }) {
  return <LoaderIcon className={cn("mr-2 h-4 w-4 animate-spin", className)} />;
}
