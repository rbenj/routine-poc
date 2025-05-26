export function colorClassName(index: number): string {
  const positiveIndex = ((index % 4) + 4) % 4;
  const colorNumber = positiveIndex + 1;
  return `color${colorNumber}`;
}
