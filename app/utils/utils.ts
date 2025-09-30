import moment from 'moment';

export function getMinutesFromHHmm(time: string): number {
  const [hStr, mStr] = time.split(':');
  const h = Number(hStr ?? 0);
  const m = Number(mStr ?? 0);
  return h * 60 + m;
}

export function getMinutesFromISO(iso: string): number {
  const m = moment.parseZone(iso);
  return m.hour() * 60 + m.minute();
}

export function durationMinutes(start: number, end: number): number {
  let diff = end - start;

  // If the closing time is after 00:00
  if (diff < 0) {
    diff += 24 * 60;
  }
  return diff;
}
