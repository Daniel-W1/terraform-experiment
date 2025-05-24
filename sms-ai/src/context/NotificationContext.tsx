import React, { createContext, useContext, useState, useCallback } from 'react';
import Notifications, { Notification, NotificationType } from '../components/Notifications';

interface NotificationContextType {
  showNotification: (type: NotificationType, title: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((type: NotificationType, title: string, message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, title, message }]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 5000);
  }, []);

  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Notifications notifications={notifications} onDismiss={handleDismiss} />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
} 