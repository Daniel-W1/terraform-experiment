import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title: string;
}

interface NotificationsProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export default function Notifications({ notifications, onDismiss }: NotificationsProps) {
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'error':
        return <X className="text-red-500" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={20} />;
      default:
        return <Info className="text-blue-500" size={20} />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="bg-white rounded-lg shadow-lg p-4 min-w-[320px] flex items-start gap-4"
          >
            {getIcon(notification.type)}
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{notification.title}</h3>
              <p className="text-sm text-gray-500">{notification.message}</p>
            </div>
            <button
              onClick={() => onDismiss(notification.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 