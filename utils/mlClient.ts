
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

export async function checkImageDuplicate(imageUrl: string, lat: number, lng: number) {
    try {
        // Construct payload matching DeduplicationRequest in incident_dedup/schemas.py
        // It expects new_image and candidate_images. 
        // In a real scenario, we'd need to fetch candidates from DB.
        // For now, we might just send the new image to get an embedding or similar if the API supported it,
        // but the current API requires candidates.
        // We will skip full implementation here as it requires DB query logic.
        return null; 
    } catch (e) {
        console.error("Image Dedup ML Error", e);
        return null;
    }
}
