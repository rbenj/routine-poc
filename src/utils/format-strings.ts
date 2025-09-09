export function formatDate(date: Date): string {
  const month = (date.getMonth() + 1).toString();
  const day = date.getDate().toString();
  return `${month}/${day}`;
}

export function formatDistance(miles: number, customUnit = ''): string {
  return `${formatNumber(miles, 1)} ${customUnit || 'mi'}`;
}

export function formatFuzzyDuration(seconds: number, abbreviate = false): string {
  const absSeconds = Math.abs(seconds);
  const sign = seconds < 0 ? '-' : '';

  if (absSeconds >= 3600) {
    const hours = Math.round(absSeconds / 3600);
    return `${sign}${hours} ${abbreviate ? 'hr' : hours === 1 ? 'hour' : 'hours'}`;
  }

  if (absSeconds >= 60) {
    const minutes = Math.round(absSeconds / 60);
    return `${sign}${minutes} ${abbreviate ? 'min' : minutes === 1 ? 'minute' : 'minutes'}`;
  }

  return `${sign}${absSeconds} ${abbreviate ? 'sec' : absSeconds === 1 ? 'second' : 'seconds'}`;
}

export function formatNumber(value: number, decimals: number): string {
  return value.toFixed(decimals);
}

export function formatMinutes(seconds: number, customUnit = ''): string {
  const m = Math.floor(Math.abs(seconds) / 60);
  return `${m} ${customUnit || 'min'}`;
}

export function formatRPE(value: number): string {
  return `${formatNumber(value, 0)}/10`;
}

export function formatSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function formatTimer(seconds: number): string {
  const m = Math.floor(Math.abs(seconds) / 60);
  const s = Math.abs(seconds) % 60;
  const sign = seconds < 0 ? '-' : '';
  return `${sign}${m}:${s.toString().padStart(2, '0')}`;
}

export function formatWeight(pounds: number, customUnit = ''): string {
  return `${formatNumber(pounds, 0)} ${customUnit || 'lbs'}`;
}
