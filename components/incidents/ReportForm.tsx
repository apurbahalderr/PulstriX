'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { IncidentType } from '@/types';
import { Camera, MapPin, Send } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import for Map to avoid SSR issues
const LiveMap = dynamic(() => import('@/components/map/LiveMap'), {
    loading: () => <div className="h-64 w-full bg-bg-secondary animate-pulse rounded-lg" />,
    ssr: false
});

export function ReportForm() {
    const [formData, setFormData] = useState({
        type: '' as IncidentType,
        description: '',
        phone: '',
        location: null as [number, number] | null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const incidentTypes: IncidentType[] = [
        'Crime', 'Medical', 'Disaster', 'Infrastructure Collapse', 'Accident', 'Other'
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.type || !formData.description) return; // Basic validation

        setIsSubmitting(true);
        // Simulate API call
        console.log("Submitting report:", formData);

        setTimeout(() => {
            setIsSubmitting(false);
            alert("Report Submitted Successfully!");
            // Reset form or redirect
        }, 1500);
    };

    const handleLocationSelect = (lat: number, lng: number) => {
        setFormData(prev => ({ ...prev, location: [lat, lng] }));
    };

    return (
        <Card className="h-full border-0 md:border border-border-main shadow-none md:shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <span className="bg-primary/20 text-primary p-2 rounded-lg mr-3">
                        <Send size={20} />
                    </span>
                    New Incident Report
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Incident Type */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Incident Type</label>
                        <div className="grid grid-cols-2 gap-2">
                            {incidentTypes.map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type })}
                                    className={`px-3 py-2 text-sm rounded-md border transition-all ${formData.type === type
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-bg-secondary text-text-secondary border-transparent hover:border-border-main'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Description</label>
                        <textarea
                            required
                            rows={3}
                            className="w-full bg-bg-secondary border border-border-main rounded-lg p-3 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="Describe what happened..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {/* Location Picker */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Location <span className="text-text-muted font-normal">(Tap on map)</span>
                        </label>
                        <div className="h-64 rounded-lg overflow-hidden border border-border-main relative">
                            <LiveMap
                                interactive={true}
                                zoom={15}
                                onLocationSelect={handleLocationSelect}
                                selectedLocation={formData.location}
                                className="h-full w-full"
                            />
                            {!formData.location && (
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/40 text-white font-medium">
                                    Tap map to pin location
                                </div>
                            )}
                        </div>
                        {formData.location && (
                            <div className="mt-2 text-xs text-primary flex items-center">
                                <MapPin size={12} className="mr-1" />
                                Selected: {formData.location[0].toFixed(4)}, {formData.location[1].toFixed(4)}
                            </div>
                        )}
                    </div>

                    {/* Image & Phone */}
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Phone Number"
                            placeholder="Optional"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">Evidence</label>
                            <Button type="button" variant="outline" className="w-full justify-center" leftIcon={<Camera size={16} />}>
                                Upload
                            </Button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        size="lg"
                        isLoading={isSubmitting}
                        disabled={!formData.type || !formData.location}
                    >
                        Submit Report
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
