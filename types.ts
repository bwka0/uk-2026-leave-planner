export enum DayType {
  WORKDAY = 'WORKDAY',
  WEEKEND = 'WEEKEND',
  BANK_HOLIDAY = 'BANK_HOLIDAY',
  LEAVE = 'LEAVE',
}

export interface BankHoliday {
  date: string; // YYYY-MM-DD
  name: string;
}

export interface LeaveStrategy {
  id: string;
  name: string;
  description: string;
  datesToBook: string[]; // Dates user needs to take off
  totalDaysOff: number;
  bankHolidaysinvolved: string[];
}

export interface DateInfo {
  dateStr: string;
  dayType: DayType;
  holidayName?: string;
}
