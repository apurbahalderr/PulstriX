
const PRIORITY_URL = process.env.PRIORITY_ML_URL || 'http://localhost:8002';
const TEXT_DEDUP_URL = process.env.TEXT_DEDUP_ML_URL || 'http://localhost:8003';
const IMAGE_DEDUP_URL = process.env.IMAGE_DEDUP_ML_URL || 'http://localhost:8001';

export async function classifyPriority(incidentId: string, type: string, description: string, imageAttached: boolean) {
    try {
        const res = await fetch(`${PRIORITY_URL}/priority/classify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                incident_id: incidentId,
                incident_type: type,
                description: description,
                image_attached: imageAttached,
                time_since_report_minutes: 0 
            })
        });
        if (!res.ok) throw new Error(`ML Service Error: ${res.statusText}`);
        return await res.json();
    } catch (e) {
        console.error("Priority ML Error", e);
        return null;
    }
}

export async function checkTextDuplicate(text: string, lat?: number, lng?: number) {
    try {
        const res = await fetch(`${TEXT_DEDUP_URL}/incident`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text,
                timestamp: new Date().toISOString(),
                latitude: lat,
                longitude: lng
            })
        });
        if (!res.ok) throw new Error(`ML Service Error: ${res.statusText}`);
        return await res.json();
    } catch (e) {
        console.error("Text Dedup ML Error", e);
        return null;
    }
}

export async function checkImageDuplicate(imageUrl: string, lat: number, lng: number, candidates: any[]) {
    try {
        const res = await fetch(`${IMAGE_DEDUP_URL}/deduplicate-image`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                new_image: {
                    image_id: "new_img",
                    image_url: imageUrl,
                    latitude: lat,
                    longitude: lng,
                    timestamp: new Date().toISOString()
                },
                candidate_images: candidates.map(c => ({
                    image_id: c._id,
                    incident_id: c._id,
                    image_url: c.image,
                    latitude: c.location.lat,
                    longitude: c.location.lng,
                    timestamp: c.createdAt
                }))
            })
        });
        if (!res.ok) throw new Error(`ML Service Error: ${res.statusText}`);
        return await res.json();
    } catch (e) {
        console.error("Image Dedup ML Error", e);
        return null;
    }
}
