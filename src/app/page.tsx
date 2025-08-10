export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">Home cleaning, made easy.</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-neutral-300">
            Book trusted pros in CDMX with upfront prices. Pick a time, pay online, get matched instantly.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "House cleaning", href: "/category/cleaning" },
            { title: "Plumbing", href: "/category/plumbing" },
            { title: "Electrical", href: "/category/electrical" },
            { title: "Handyman", href: "/category/handyman" },
          ].map((c) => (
            <a
              key={c.title}
              href={c.href}
              className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 p-5 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
            >
              <div className="font-semibold">{c.title}</div>
              <div className="text-sm text-neutral-500">Upfront prices • Instant book</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
