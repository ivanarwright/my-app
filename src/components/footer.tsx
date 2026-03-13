import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <nav className="flex gap-4">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </Link>
        </nav>
        <p className="text-sm text-muted-foreground">
          &copy; Copyright I Wright 2026
        </p>
      </div>
    </footer>
  );
}
