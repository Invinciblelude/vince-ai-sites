import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-4 text-6xl">🔍</div>
        <h1 className="mb-2 text-2xl font-bold">Page Not Found</h1>
        <p className="mb-6 text-muted">This page doesn&apos;t exist.</p>
        <Link
          href="/"
          className="rounded-xl bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent-dim"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
