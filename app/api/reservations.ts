import mock from './mockData.json';
import type { BookingResponse } from '@/models/reservations';

export function fetchReservations(): Promise<BookingResponse> {
  return new Promise<BookingResponse>((resolve) => {
    setTimeout(() => resolve(mock as BookingResponse), 500);
  });
}
