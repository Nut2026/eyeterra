// localStorage helpers with midnight reset support
export function getTodayKey(base: string): string {
  const d = new Date();
  return `${base}-${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function getLocalToday<T>(base: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(getTodayKey(base));
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setLocalToday<T>(base: string, value: T): void {
  localStorage.setItem(getTodayKey(base), JSON.stringify(value));
}

export function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setLocal<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}
