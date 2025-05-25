export function colorClassName(index: number): string {
  const colorNumber = (index % 4) + 1;

  return `color${colorNumber}`;
}
