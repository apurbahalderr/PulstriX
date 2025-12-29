import { TrendingUp, Clock, ShieldCheck } from 'lucide-react';

export function Impacts() {
    return (
        <section className="py-24 bg-bg-secondary relative overflow-hidden">
            {}
            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-alert-medium/5 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Real World Impact</h2>
                        <div className="space-y-8">
                            <div className="flex">
                                <div className="flex-shrink-0 mr-4">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        <Clock size={24} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Reduced Response Time</h3>
                                    <p className="text-text-secondary">
                                        By automating location sharing and incident verification, we cut down critical minutes from emergency response times.
                                    </p>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="flex-shrink-0 mr-4">
                                    <div className="w-12 h-12 rounded-lg bg-status-resolved/10 flex items-center justify-center text-status-resolved">
                                        <ShieldCheck size={24} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Saved Lives</h3>
                                    <p className="text-text-secondary">
                                        Faster intervention means higher survival rates. PulstriX directly contributes to saving lives in critical situations.
                                    </p>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="flex-shrink-0 mr-4">
                                    <div className="w-12 h-12 rounded-lg bg-alert-medium/10 flex items-center justify-center text-alert-medium">
                                        <TrendingUp size={24} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Data-Driven Safety</h3>
                                    <p className="text-text-secondary">
                                        Aggregated data helps authorities identify high-risk zones and allocate resources proactively to prevent future incidents.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-bg-card p-6 rounded-2xl border border-border-main text-center transform translate-y-8">
                            <div className="text-4xl font-bold text-primary mb-2">40%</div>
                            <div className="text-text-muted text-sm uppercase tracking-wider">Faster Response</div>
                        </div>
                        <div className="bg-bg-card p-6 rounded-2xl border border-border-main text-center">
                            <div className="text-4xl font-bold text-status-resolved mb-2">99%</div>
                            <div className="text-text-muted text-sm uppercase tracking-wider">Uptime Reliability</div>
                        </div>
                        <div className="bg-bg-card p-6 rounded-2xl border border-border-main text-center transform translate-y-8">
                            <div className="text-4xl font-bold text-alert-medium mb-2">24/7</div>
                            <div className="text-text-muted text-sm uppercase tracking-wider">Monitoring</div>
                        </div>
                        <div className="bg-bg-card p-6 rounded-2xl border border-border-main text-center">
                            <div className="text-4xl font-bold text-info mb-2">10k+</div>
                            <div className="text-text-muted text-sm uppercase tracking-wider">Active Users</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
