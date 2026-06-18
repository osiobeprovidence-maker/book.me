import { AppNotification, NotificationType } from '../types';

export interface EmailPayload {
  to: string;
  subject: string;
  message: string;
  actionLabel?: string;
  actionUrl?: string;
}

export interface EmailService {
  send(payload: EmailPayload): Promise<boolean>;
}

class ConsoleEmailService implements EmailService {
  async send(payload: EmailPayload): Promise<boolean> {
    console.log('[Email Service]', payload);
    return true;
  }
}

let emailService: EmailService = new ConsoleEmailService();

export function setEmailService(service: EmailService) {
  emailService = service;
}

export function getEmailService(): EmailService {
  return emailService;
}

export function buildNotificationEmail(notification: AppNotification, userEmail: string): EmailPayload {
  const subjectMap: Record<NotificationType, string> = {
    booking_request: 'New Booking Request',
    booking_confirmed: 'Booking Confirmed',
    booking_cancelled: 'Booking Cancelled',
    message: 'New Message Received',
    payment: 'Payment Update',
    application_update: 'Application Status Update',
    system_alert: 'System Alert',
    security_alert: 'Security Alert',
  };

  return {
    to: userEmail,
    subject: subjectMap[notification.type] || 'Notification',
    message: notification.message,
    actionLabel: notification.action_label,
    actionUrl: notification.action_screen ? `${window.location.origin}` : undefined,
  };
}

export async function sendNotificationEmail(notification: AppNotification, userEmail: string): Promise<boolean> {
  const payload = buildNotificationEmail(notification, userEmail);
  return emailService.send(payload);
}
