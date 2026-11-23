import { useState, useEffect } from "react";
// Transparent gold emblem (hanger, sweater, palette) made from your logo.
import logo from "../images/logo-emblem.png";

const links = [
    { href: "#main-offer", label: "العرض المميز" },
    { href: "#other-products", label: "المنتجات" },
    { href: "#how-it-works", label: "كيف تطلب؟" },
];

function Navbar() {
    // Big logo at the top of the page, smaller once you scroll down
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header className="fb-dark sticky top-0 z-40 bg-[#12100d]/95 backdrop-blur border-b border-[#c9a24a]/40">
            {/* keeps anchor targets from hiding under the sticky bar */}
            <style>{`html { scroll-padding-top: 6rem; }`}</style>

            <nav
                aria-label="التنقل الرئيسي"
                className={`max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between gap-5 transition-[height] duration-300 ${scrolled ? "h-[72px]" : "h-[88px] md:h-[104px]"}`}
            >
                {/* LOGO + NAME */}
                <a
                    href="/"
                    className="flex items-center gap-3 md:gap-4 group min-w-0"
                    aria-label="فن للباس FENLIBASS - الصفحة الرئيسية"
                >
                    {/* Emblem only (the name is written next to it), so it can be big and clear */}
                    <img
                        src={logo}
                        alt="شعار فن للباس"
                        className={`w-auto shrink-0 object-contain transition-all duration-300 ${scrolled ? "h-11" : "h-14 sm:h-16 md:h-[76px]"}`}
                    />

                    <span className="leading-none min-w-0">
                        <span
                            className={`fb-display block text-[#c9a24a] group-hover:text-[#dcb95f] transition-all duration-300 ${scrolled ? "text-3xl" : "text-3xl md:text-[2.6rem]"}`}
                        >
                            فن للباس
                        </span>
                        <span
                            dir="ltr"
                            className={`block mt-1.5 text-white font-medium tracking-[0.32em] transition-all duration-300 ${scrolled ? "text-[11px]" : "text-xs md:text-sm"}`}
                        >
                            FENLIBASS
                        </span>
                    </span>
                </a>

                {/* LINKS */}
                <ul className="hidden lg:flex items-center gap-9 text-[15px] text-white/80">
                    {links.map((l) => (
                        <li key={l.href}>
                            <a
                                href={l.href}
                                className="py-2 border-b-2 border-transparent hover:text-white hover:border-[#c9a24a] transition-colors"
                            >
                                {l.label}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* CTA */}
                <a
                    href="#main-offer"
                    className="shrink-0 px-4 md:px-6 py-2.5 rounded-full bg-[#c9a24a] text-[#12100d] text-sm font-semibold hover:bg-[#dcb95f] transition-colors"
                >
                    اطلب الآن
                </a>
            </nav>
        </header>
    );
}

export default Navbar;