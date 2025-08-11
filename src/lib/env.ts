export function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export function optional(name: string, def = ""): string {
  return process.env[name] ?? def;
}


