'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Report, User } from '@/types';


const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';


const defaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


const createCustomIcon = (color: string) =>
    L.divIcon({
        className: 'custom-pin',
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid #FFF; box-shadow: 0 0 10px ${color};"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });

const severityIcons: Record<string, L.DivIcon> = {
    high: createCustomIcon('#EF4444'), 
    medium: createCustomIcon('#F97316'), 
    low: createCustomIcon('#22C55E'), 
};

const employeeIcon = L.divIcon({
    className: 'custom-car-icon',
    html: `<div style="background-color: #3B82F6; width: 32px; height: 32px; border-radius: 50%; border: 2px solid #FFF; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18" height="18">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-2.5 4c-.9.3-1.5 1.1-1.5 1.9v3c0 .6.4 1 1 1h2c0 1.1.9 2 2 2s2-.9 2-2h8c0 1.1.9 2 2 2s2-.9 2-2zm-12 1c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm10 0c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"/>
            </svg>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
});


function MapEvents({ onLocationSelect }: { onLocationSelect?: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            if (onLocationSelect) {
                onLocationSelect(e.latlng.lat, e.latlng.lng);
            }
        },
    });
    return null;
}


function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

interface LiveMapProps {
    incidents?: Report[];
    employees?: any[]; 
    center?: [number, number];
    zoom?: number;
    interactive?: boolean;
    onLocationSelect?: (lat: number, lng: number) => void;
    selectedLocation?: [number, number] | null;
    className?: string;
    selectedIncident?: Report | null;
    userLocation?: { lat: number; lng: number };
}

export default function LiveMap({
    incidents = [],
    employees = [], 
    center = [20.2961, 85.8245],
    zoom = 13,
    interactive = true,
    onLocationSelect,
    selectedLocation,
    className = "h-full w-full rounded-lg",
    selectedIncident,
    userLocation
}: LiveMapProps) {
    
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className={`bg-bg-card animate-pulse ${className} flex items-center justify-center text-text-muted`}>Loading Map...</div>;

    return (
        <div className={className}>
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={interactive}
                dragging={interactive}
                className="h-full w-full rounded-lg z-0"
                style={{ height: '100%', width: '100%' }}
            >
                <MapUpdater center={center} zoom={zoom} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    className="map-tiles-dark" 
                />

                {}
                {incidents.map((incident) => {
                    const sevKey = (incident.severity || '').toString().toLowerCase();
                    const icon = severityIcons[sevKey] || defaultIcon;
                    return (
                        <Marker
                            key={incident._id}
                            position={[incident.location.lat, incident.location.lng]}
                            icon={icon}
                        >
                            <Popup className="leaflet-popup-dark">
                                <div className="text-gray-900">
                                    <h3 className="font-bold">{incident.type}</h3>
                                    <p className="text-sm">{incident.description}</p>
                                    <div className="text-xs mt-1">Status: {incident.status}</div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {}
                {selectedLocation && (
                    <Marker
                        position={selectedLocation}
                        icon={defaultIcon}
                    />
                )}

                {}
                {userLocation && (
                    <Marker
                        position={[userLocation.lat, userLocation.lng]}
                        icon={employeeIcon}
                    >
                        <Popup>
                            <div className="text-gray-900 font-bold">You are here</div>
                        </Popup>
                    </Marker>
                )}

                {}
                {employees.map((emp) => {
                    if (!emp.location) return null;
                    return (
                        <Marker
                            key={emp._id || emp.id}
                            position={[emp.location.lat, emp.location.lng]}
                            icon={employeeIcon}
                        >
                            <Popup className="leaflet-popup-dark">
                                <div className="text-gray-900">
                                    <h3 className="font-bold">{emp.name}</h3>
                                    <p className="text-xs">{emp.role} - {emp.status}</p>
                                    <p className="text-xs">{emp.phone}</p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {}
                {selectedIncident && selectedIncident.employeeLocation && (
                    <>
                        <Marker
                            position={[selectedIncident.employeeLocation.lat, selectedIncident.employeeLocation.lng]}
                            icon={employeeIcon}
                        >
                            <Popup>
                                <div className="text-sm font-bold text-gray-900">Assigned Employee</div>
                            </Popup>
                        </Marker>
                        <Polyline
                            positions={[
                                [selectedIncident.location.lat, selectedIncident.location.lng],
                                [selectedIncident.employeeLocation.lat, selectedIncident.employeeLocation.lng]
                            ]}
                            color="blue"
                            dashArray="5, 10"
                        />
                    </>
                )}

                <MapEvents onLocationSelect={onLocationSelect} />
            </MapContainer>
            <style jsx global>{`
        .leaflet-container {
          background: #151A21;
        }
        
        .leaflet-tile {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
      `}</style>
        </div>
    );
}
