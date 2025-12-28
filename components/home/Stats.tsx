export function Stats() {
    const stats = [
        { label: 'Active Responders', value: '120+' },
        { label: 'Avg. Response Time', value: '< 5m' },
        { label: 'Incidents Resolved', value: '15k+' },
        { label: 'Communities Safe', value: '100%' }, // A bit ambitious, but good for hackathon pitch
    ];

    return (
        <div className="bg-bg-secondary border-y border-border-main">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                            <div className="text-sm font-medium text-text-secondary uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
