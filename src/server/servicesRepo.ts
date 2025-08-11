import { getSupabaseAnon } from "@/lib/db";
import { services as seedServices } from "@/data/seed/services";

export async function listServices(categorySlug?: string) {
  const sb = getSupabaseAnon();
  if (!sb) {
    return (categorySlug
      ? seedServices.filter((s) => s.category_slug === categorySlug)
      : seedServices);
  }
  // TODO: Replace with real DB query
  return (categorySlug
    ? seedServices.filter((s) => s.category_slug === categorySlug)
    : seedServices);
}

export async function getServiceByIdRepo(id: string) {
  const sb = getSupabaseAnon();
  if (!sb) {
    return seedServices.find((s) => s.id === id) || null;
  }
  // TODO: Replace with real DB query
  return seedServices.find((s) => s.id === id) || null;
}


