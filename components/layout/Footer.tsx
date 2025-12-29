import Link from "next/link";
import { Github, Twitter, Linkedin, Heart } from "lucide-react";

export function Footer() {
    return (
        <footer className="relative mt-20 border-t border-white/10 overflow-hidden">
            {}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xl -z-10"></div>
            <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
                    {}
                    <div className="md:col-span-2 space-y-4">
                        <Link href="/" className="inline-flex items-center gap-2 group">
                            <img src="/logonew.png" alt="Pulstrix" className="h-10 w-10 object-contain group-hover:scale-110 transition-transform" />
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                                PulstriX
                            </span>
                        </Link>
                        <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
                            Advanced emergency response coordination platform utilizing real-time data and community power to save lives.
                        </p>
                    </div>

                    {}
                    <div>
                        <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                            Platform
                        </h3>
                        <ul className="space-y-3">
                            {['Home', 'Analytics', 'Live Map', 'Report Incident'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-text-muted hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                                        <span className="w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary transition-all"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Legal</h3>
                        <ul className="space-y-3">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-text-muted hover:text-primary transition-colors text-sm">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-text-muted text-xs">
                        © {new Date().getFullYear()} PulstriX. All rights reserved.
                    </p>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                            {[Github, Twitter, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="text-text-muted hover:text-white transition-colors hover:scale-110 transform duration-200">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                        <div className="h-4 w-px bg-white/10 hidden md:block"></div>
                        <p className="text-text-muted text-xs flex items-center gap-1.5">
                            Made with <Heart size={12} className="text-red-500 fill-red-500 animate-pulse" /> for Development Hackathon
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
