import { Subscription } from "@/models/subscription.model";
import webPush from "web-push";
import { dbConnect } from "./dbConnect";

const vapidKeys = {
    publicKey: 'BA8JjGcf9qRxBDRt-bhYXLICDRj28tL3izZC-7ZN8vNXh2tkAJfou6a0qwWUHpGbDMOJhSr_NsAjGyybhIITRJo',
    privateKey: 'KUSJbKJSvUn97pRUgI42NwKZ2PRT-4h-GBj2qmLJ01o'
};

webPush.setVapidDetails(
    'mailto:anshukr95086@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

interface NotificationPayload {
    title: string;
    message: string;
    url?: string;
    userId?: string;
    role?: string;
}

export async function sendNotification({ title, message, url, userId, role }: NotificationPayload) {
    try {
        await dbConnect();

        let query = {};
        if (userId) query = { userId };
        else if (role) query = { role };
        else return { success: false, message: "No target specified (userId or role)" };

        const subscriptions = await Subscription.find(query);

        if (subscriptions.length === 0) {
            return { success: true, message: "No subscriptions found" };
        }

        const payload = JSON.stringify({
            title: title || "New Notification",
            body: message || "You have a new update!",
            url: url || "/"
        });

        const promises = subscriptions.map(sub => {
            return webPush.sendNotification(
                {
                    endpoint: sub.endpoint,
                    keys: sub.keys
                },
                payload
            ).catch(err => {
                if (err.statusCode === 410 || err.statusCode === 404) {
                    console.log("Subscription expired, deleting:", sub._id);
                    return Subscription.findByIdAndDelete(sub._id);
                }
                console.error("Error sending notification:", err);
            });
        });

        await Promise.all(promises);
        return { success: true, count: subscriptions.length };

    } catch (error) {
        console.error("Error sending notification:", error);
        return { success: false, error };
    }
}
