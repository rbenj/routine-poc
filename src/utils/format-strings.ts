export function formatDistance(miles: number, customUnit = ''): string {
  return `${formatNumber(miles, 1)} ${customUnit || 'mi'}`;
}

export function formatFuzzyDuration(seconds: number): string {
  const absSeconds = Math.abs(seconds);
  const sign = seconds < 0 ? '-' : '';

  if (absSeconds >= 3600) {
    const hours = Math.floor(absSeconds / 3600);
    return `${sign}${hours} hr`;
  }

  if (absSeconds >= 60) {
    const minutes = Math.floor(absSeconds / 60);
    return `${sign}${minutes} min`;
  }

  return `${sign}${absSeconds} sec`;
}

export function formatNumber(value: number, decimals: number): string {
  return value.toFixed(decimals);
}

export function formatMinutes(seconds: number, customUnit = ''): string {
  const m = Math.floor(Math.abs(seconds) / 60);
  return `${m} ${customUnit || 'min'}`;
}

export function formatSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function formatTimer(seconds: number): string {
  const m = Math.floor(Math.abs(seconds) / 60);
  const s = Math.abs(seconds) % 60;
  const sign = seconds < 0 ? '-' : '';
  return `${sign}${m}:${s.toString().padStart(2, '0')}`;
}

export function formatWeight(pounds: number, customUnit = ''): string {
  return `${formatNumber(pounds, 1)} ${customUnit || 'lbs'}`;
}
