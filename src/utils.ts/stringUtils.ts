export function cx(...classes: unknown[]) {
  return classes.filter(Boolean).join(" ");
}
