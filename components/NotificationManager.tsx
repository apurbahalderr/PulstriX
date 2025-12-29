'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button';
import { Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

interface NotificationManagerProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
}

export default function NotificationManager({ className, variant = "ghost" }: NotificationManagerProps) {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      
      navigator.serviceWorker.ready.then(function (reg) {
        setRegistration(reg);
        reg.pushManager.getSubscription().then(function (sub) {
          if (sub) {
            setIsSubscribed(true);
            setSubscription(sub);
          }
        });
      });

      
      navigator.serviceWorker.register('/sw.js')
        .then(function (reg) {
          console.log('Service Worker Registered', reg);
          setRegistration(reg);
        })
        .catch(function (error) {
          console.error('Service Worker Registration Failed', error);
        });
    }
  }, []);

  // Update subscription with user details when user changes
  useEffect(() => {
    if (isSubscribed && subscription && user) {
      fetch('/api/notifications/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          subscription: subscription,
          userId: user._id || user.id,
          role: user.role
        }),
        headers: { 'Content-Type': 'application/json' }
      }).catch(err => console.error("Failed to update subscription user mapping", err));
    }
  }, [user, isSubscribed, subscription]);

  const subscribeUser = async () => {
    if (Notification.permission === 'denied') {
      alert("Notifications are blocked. Please enable them in your browser settings.");
      return;
    }

    setIsLoading(true);
    try {
      let reg = registration;
      if (!reg) {
        console.log("Registration not found, waiting for ready...");
        reg = await navigator.serviceWorker.ready;
        setRegistration(reg);
      }

      if (!reg) {
        console.error("Service Worker registration failed or not available");
        alert("Notifications are not supported or service worker failed to load.");
        setIsLoading(false);
        return;
      }

      const applicationServerKey = urlBase64ToUint8Array('BA8JjGcf9qRxBDRt-bhYXLICDRj28tL3izZC-7ZN8vNXh2tkAJfou6a0qwWUHpGbDMOJhSr_NsAjGyybhIITRJo');

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      });
      console.log('User is subscribed:', sub);
      setSubscription(sub);
      setIsSubscribed(true);

      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          subscription: sub,
          userId: user?._id || user?.id,
          role: user?.role
        }),
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (err: any) {
      console.error('Failed to subscribe the user: ', err);

      if ((Notification.permission as NotificationPermission) === 'denied') {
        alert("Notifications are blocked. Please enable them in your browser settings (click the lock icon in the address bar).");
      } else {
        alert(`Failed to subscribe: ${err.message || "Unknown error"}. Check console for details.`);
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (!user) return null;
  

  return (
    <Button
      onClick={isSubscribed ? undefined : subscribeUser}
      variant={isSubscribed ? "outline" : variant} 
      size="sm"
      className={`${className} ${isSubscribed ? 'opacity-70 cursor-default border-green-500/50 text-green-500' : ''}`}
      leftIcon={<Bell size={18} className={isSubscribed ? "fill-current" : ""} />}
      isLoading={isLoading}
      disabled={isSubscribed} 
    >
      {isSubscribed ? 'Notifications On' : 'Enable Notifications'}
    </Button>
  )
}
