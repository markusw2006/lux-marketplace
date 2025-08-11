import { services } from "@/data/seed/services";

export type AddonSelection = Record<string, number>; // addonId -> qty

export function getServiceById(serviceId: string) {
  return services.find((s) => s.id === serviceId) || null;
}

export function computeServiceTotalCents(
  serviceId: string,
  selections: AddonSelection = {}
) {
  const service = getServiceById(serviceId);
  if (!service) throw new Error("Service not found");
  let total = service.fixed_base_price;
  for (const addon of service.addons) {
    const qty = selections[addon.id] ?? 0;
    if (qty > 0) {
      total += addon.price_delta * qty;
    }
  }
  return total;
}


