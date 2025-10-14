import type { BookingResponse } from '@/models/reservations';

export async function fetchReservations(): Promise<BookingResponse> {
  const response = await fetch('https://hh.frontend.ark.software/api/booking');
  if (!response.ok) {
    throw new Error(`Ошибка: ${response.status}`);
  }
  const data = (await response.json()) as BookingResponse;
  return data;
}
