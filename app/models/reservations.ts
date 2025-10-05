export interface Restaurant {
  id: number;
  timezone: string;
  restaurant_name: string;
  opening_time: string; // "HH:mm"
  closing_time: string; // "HH:mm"
}

export type OrderStatus = 'New' | 'Bill' | 'Closed' | 'Banquet';

export interface Order {
  id: string;
  status: OrderStatus;
  start_time: string; // ISO
  end_time: string; // ISO
}

export type ReservationStatus =
  | 'Живая очередь'
  | 'Новая'
  | 'Заявка'
  | 'Открыт'
  | 'Закрыт';

export interface Reservation {
  id: number;
  name_for_reservation: string;
  num_people: number;
  phone_number: string;
  status: ReservationStatus;
  seating_time: string; // ISO
  end_time: string; // ISO
}

export type TableZone = '1 этаж' | '2 этаж' | 'Банкетный зал';

export interface Table {
  id: string;
  capacity: number;
  number: string;
  zone: TableZone;
  orders: Order[];
  reservations: Reservation[];
}

export interface BookingResponse {
  available_days: string[]; // YYYY-MM-DD
  current_day: string; // YYYY-MM-DD
  restaurant: Restaurant;
  tables: Table[];
}

export type EventType = 'order' | 'reservation';

export interface BookingEvent {
  id: string | number;
  status: string;
  start_time: string;
  end_time: string;
  name_for_reservation?: string;
  type: EventType;
  start_min: number;
  end_min: number;
  num_people?: number;
  phone_number?: string;
  offset_index: number;
  row_index: number;
  row_count: number;
  cover_from_min?: number;
  cover_ratio: number;
}
