export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  // Placeholder: fetch services via API
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">{slug} services</h1>
      <p className="mt-2 text-neutral-500">Instant-book, upfront pricing.</p>
    </div>
  );
}


