import { APP_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 py-8 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} {APP_NAME}. Built for freelancers worldwide.
      </div>
    </footer>
  );
}
