import { BankHoliday, LeaveStrategy } from './types';

// England & Wales 2026 Holidays
const ENGLAND_WALES_HOLIDAYS: BankHoliday[] = [
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-04-03', name: "Good Friday" },
  { date: '2026-04-06', name: "Easter Monday" },
  { date: '2026-05-04', name: "Early May Bank Holiday" },
  { date: '2026-05-25', name: "Spring Bank Holiday" },
  { date: '2026-08-31', name: "Summer Bank Holiday" },
  { date: '2026-12-25', name: "Christmas Day" },
  { date: '2026-12-28', name: "Boxing Day (Substitute)" },
];

// Scotland 2026 Holidays
const SCOTLAND_HOLIDAYS: BankHoliday[] = [
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-01-02', name: "2nd January" },
  { date: '2026-04-03', name: "Good Friday" },
  { date: '2026-05-04', name: "Early May Bank Holiday" },
  { date: '2026-05-25', name: "Spring Bank Holiday" },
  { date: '2026-08-03', name: "Summer Bank Holiday" },
  { date: '2026-11-30', name: "St Andrew's Day" },
  { date: '2026-12-25', name: "Christmas Day" },
  { date: '2026-12-28', name: "Boxing Day (Substitute)" },
];

// Northern Ireland 2026 Holidays
const NI_HOLIDAYS: BankHoliday[] = [
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-03-17', name: "St Patrick's Day" },
  { date: '2026-04-03', name: "Good Friday" },
  { date: '2026-04-06', name: "Easter Monday" },
  { date: '2026-05-04', name: "Early May Bank Holiday" },
  { date: '2026-05-25', name: "Spring Bank Holiday" },
  { date: '2026-07-13', name: "Battle of the Boyne (Substitute)" },
  { date: '2026-08-31', name: "Summer Bank Holiday" },
  { date: '2026-12-25', name: "Christmas Day" },
  { date: '2026-12-28', name: "Boxing Day (Substitute)" },
];

export const REGION_HOLIDAYS: Record<string, BankHoliday[]> = {
  'england-wales': ENGLAND_WALES_HOLIDAYS,
  'scotland': SCOTLAND_HOLIDAYS,
  'northern-ireland': NI_HOLIDAYS,
};

export const UK_BANK_HOLIDAYS_2026 = REGION_HOLIDAYS['england-wales']; // Default

// --- STRATEGIES PER REGION ---

const STRATEGIES_EW: LeaveStrategy[] = [
  {
    id: 'easter-10',
    name: 'Easter 10-Day Break',
    description: 'Book 4 days, get 10 consecutive days off.',
    datesToBook: ['2026-04-01', '2026-04-02', '2026-04-07', '2026-04-08'],
    totalDaysOff: 10,
    bankHolidaysinvolved: ['Good Friday', 'Easter Monday'],
  },
  {
    id: 'easter-16',
    name: 'Easter 16-Day Mega Break',
    description: 'Book 8 days, get 16 consecutive days off.',
    datesToBook: ['2026-03-30', '2026-03-31', '2026-04-01', '2026-04-02', '2026-04-07', '2026-04-08', '2026-04-09', '2026-04-10'],
    totalDaysOff: 16,
    bankHolidaysinvolved: ['Good Friday', 'Easter Monday'],
  },
  {
    id: 'may-double',
    name: 'Double May 18-Day Special',
    description: 'Book 8 days across both May holidays for two 9-day breaks.',
    datesToBook: ['2026-05-05', '2026-05-06', '2026-05-07', '2026-05-08', '2026-05-26', '2026-05-27', '2026-05-28', '2026-05-29'],
    totalDaysOff: 18,
    bankHolidaysinvolved: ['Early May', 'Spring Bank Holiday'],
  },
  {
    id: 'august-9',
    name: 'Late Summer 9-Day Break',
    description: 'Book 4 days, get 9 days off (Sat 29 Aug - Sun 6 Sep).',
    datesToBook: ['2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04'],
    totalDaysOff: 9,
    bankHolidaysinvolved: ['Summer Bank Holiday'],
  },
  {
    id: 'christmas-10',
    name: 'Christmas 10-Day Bridge',
    description: 'Book 3 days, get 10 days off (Fri 25 Dec - Sun 3 Jan).',
    datesToBook: ['2026-12-29', '2026-12-30', '2026-12-31'],
    totalDaysOff: 10,
    bankHolidaysinvolved: ['Christmas Day', 'Boxing Day (Sub)', 'New Year'],
  },
];

const STRATEGIES_SCOTLAND: LeaveStrategy[] = [
  {
    id: 'new-year-11',
    name: 'New Year 11-Day Start',
    description: 'Book 5 days (Jan 5-9), get 11 days off (Jan 1 - Jan 11).',
    datesToBook: ['2026-01-05', '2026-01-06', '2026-01-07', '2026-01-08', '2026-01-09'],
    totalDaysOff: 11,
    bankHolidaysinvolved: ['New Year', '2nd Jan'],
  },
  {
    id: 'scot-august-9',
    name: 'Scottish Summer 9-Day',
    description: 'Book 4 days (Aug 4-7) around the early August Bank Holiday.',
    datesToBook: ['2026-08-04', '2026-08-05', '2026-08-06', '2026-08-07'],
    totalDaysOff: 9,
    bankHolidaysinvolved: ['Summer Bank Holiday (Scot)'],
  },
  {
    id: 'st-andrews-9',
    name: 'St Andrew\'s 9-Day Break',
    description: 'Book 4 days (Dec 1-4), get 9 days off.',
    datesToBook: ['2026-12-01', '2026-12-02', '2026-12-03', '2026-12-04'],
    totalDaysOff: 9,
    bankHolidaysinvolved: ['St Andrew\'s Day'],
  },
  {
    id: 'christmas-10',
    name: 'Christmas 10-Day Bridge',
    description: 'Book 3 days, get 10 days off (Fri 25 Dec - Sun 3 Jan).',
    datesToBook: ['2026-12-29', '2026-12-30', '2026-12-31'],
    totalDaysOff: 10,
    bankHolidaysinvolved: ['Christmas Day', 'Boxing Day (Sub)', 'New Year'],
  },
];

const STRATEGIES_NI: LeaveStrategy[] = [
  {
    id: 'st-patricks-9',
    name: 'St Patrick\'s 9-Day Week',
    description: 'Book 4 days (Mar 16, 18-20), get 9 days off.',
    datesToBook: ['2026-03-16', '2026-03-18', '2026-03-19', '2026-03-20'],
    totalDaysOff: 9,
    bankHolidaysinvolved: ['St Patrick\'s Day'],
  },
  {
    id: 'easter-10',
    name: 'Easter 10-Day Break',
    description: 'Book 4 days, get 10 consecutive days off.',
    datesToBook: ['2026-04-01', '2026-04-02', '2026-04-07', '2026-04-08'],
    totalDaysOff: 10,
    bankHolidaysinvolved: ['Good Friday', 'Easter Monday'],
  },
  {
    id: 'boyne-9',
    name: 'Battle of the Boyne 9-Day',
    description: 'Book 4 days (Jul 14-17), get 9 days off (Jul 11 - Jul 19).',
    datesToBook: ['2026-07-14', '2026-07-15', '2026-07-16', '2026-07-17'],
    totalDaysOff: 9,
    bankHolidaysinvolved: ['Battle of the Boyne'],
  },
  {
    id: 'august-9',
    name: 'Late Summer 9-Day Break',
    description: 'Book 4 days, get 9 days off (Sat 29 Aug - Sun 6 Sep).',
    datesToBook: ['2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04'],
    totalDaysOff: 9,
    bankHolidaysinvolved: ['Summer Bank Holiday'],
  },
  {
    id: 'christmas-10',
    name: 'Christmas 10-Day Bridge',
    description: 'Book 3 days, get 10 days off.',
    datesToBook: ['2026-12-29', '2026-12-30', '2026-12-31'],
    totalDaysOff: 10,
    bankHolidaysinvolved: ['Christmas Day', 'Boxing Day (Sub)'],
  },
];

export const REGION_STRATEGIES: Record<string, LeaveStrategy[]> = {
  'england-wales': STRATEGIES_EW,
  'scotland': STRATEGIES_SCOTLAND,
  'northern-ireland': STRATEGIES_NI,
};

// Kept for backward compatibility if needed, though we primarily use REGION_STRATEGIES now
export const STRATEGIES = STRATEGIES_EW;

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];