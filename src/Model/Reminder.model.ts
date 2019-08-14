export interface IReminder {
    ReminderID: string;
    ReminderType: string;
    ReminderMessage?: string;
    ReminderComponentPage: string;
    ReminderTimeStamp: number;
    ReminderDate: number;
    ReminderShown?: number;
    ReminderCustomData?: string;
    ReminderInvoiceId?: string;
    isActivate?: string;
}
