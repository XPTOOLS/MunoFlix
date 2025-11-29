"use client";
import { useEffect, useState } from 'react';
import { doc, onSnapshot, collection, query, where, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useUserInfoContext } from '@/context/UserInfoContext';
import { FaTimes, FaExclamationTriangle, FaInfoCircle, FaCheckCircle, FaHeadset } from 'react-icons/fa';
import Link from 'next/link';

export default function NotificationSystem() {
  const { userInfo, isUserLoggedIn } = useUserInfoContext();
  const [notifications, setNotifications] = useState([]);
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    if (!isUserLoggedIn || !userInfo?.uid) return;

    // Listen to user's notifications
    const notificationsQuery = query(
      collection(db, 'users', userInfo.uid, 'notifications'),
      where('isRead', '==', false),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const newNotifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setNotifications(newNotifications);
      
      // Show new notifications that aren't already visible
      newNotifications.forEach(notification => {
        if (!visibleNotifications.find(n => n.id === notification.id)) {
          setVisibleNotifications(prev => [...prev, notification]);
        }
      });
    });

    return () => unsubscribe();
  }, [isUserLoggedIn, userInfo?.uid]);

  const handleCloseNotification = (notificationId) => {
    setVisibleNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await updateDoc(doc(db, 'users', userInfo.uid, 'notifications', notificationId), {
        isRead: true
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'info':
        return <FaInfoCircle className="text-blue-500" />;
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const getNotificationStyles = (severity) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500/30 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'info':
        return 'border-blue-500/30 bg-blue-500/10';
      case 'success':
        return 'border-green-500/30 bg-green-500/10';
      default:
        return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg border backdrop-blur-sm ${getNotificationStyles(notification.severity)} animate-in slide-in-from-right duration-500`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getNotificationIcon(notification.severity)}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white text-sm mb-1">
                {notification.title}
              </h4>
              <p className="text-gray-300 text-sm mb-2">
                {notification.message}
              </p>
              
              {notification.showContactSupport && (
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs rounded-lg transition-colors"
                >
                  <FaHeadset size={10} />
                  Contact Support
                </Link>
              )}
            </div>
            
            <button
              onClick={() => {
                handleCloseNotification(notification.id);
                handleMarkAsRead(notification.id);
              }}
              className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
            >
              <FaTimes size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}