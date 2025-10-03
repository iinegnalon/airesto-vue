import moment from 'moment/moment';
import 'moment/locale/ru';

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

export function formatMinutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

export function getDay(date: string, currentDate: string): string {
  const inputDate = moment(date).startOf('day');
  const current = moment(currentDate).startOf('day');

  const diffDays = inputDate.diff(current, 'days');

  if (diffDays === 0) return 'сегодня';
  if (diffDays === 1) return 'завтра';

  return moment(date).locale('ru').format('dddd');
}
