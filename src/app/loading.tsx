import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy bg-opacity-80 backdrop-blur-sm">
      <Loader2 className="h-12 w-12 text-gold animate-spin" />
    </div>
  );
}