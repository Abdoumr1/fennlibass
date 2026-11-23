import logo from "../images/fenimg.jpg";
import { Phone, MessageCircle, Mail, MapPin, Clock, ArrowUp, Truck, Wallet } from "lucide-react";

/* ------------------------------------------------------------------ */
/* YOUR STORE INFO: edit only this block                               */
/* Anything still containing X, "your" or "اكتب" is treated as a       */
/* placeholder: it is shown as plain text and not turned into a link.  */
/* ------------------------------------------------------------------ */

const STORE = {
    phone: "0553551559",
    whatsapp: "213553551559", // international format, no + or spaces
    email: "abdoumr67@gamil.com",
    address: "الجزائر العاصمة",
    facebook: "https://www.facebook.com/profile.php?id=61580202974042",
};

const isReal = (v) => Boolean(v) && !/X|your|اكتب/i.test(v);
const digits = (v) => v.replace(/\D/g, "");

const quickLinks = [
    { href: "#main-offer", label: "العرض المميز" },
    { href: "#other-products", label: "المنتجات" },
    { href: "#how-it-works", label: "كيف تطلب؟" },
];

const deliveryInfo = [
    { icon: Truck, text: "توصيل إلى 58 ولاية، إلى المنزل أو إلى مكتب التوصيل" },
    { icon: Clock, text: "مدة التوصيل من يوم إلى 10 أيام حسب الولاية" },
    { icon: Wallet, text: "الدفع عند الاستلام، وتأكيد الطلب بمكالمة هاتفية" },
];

/* small inline icons (they exist in every icon-pack version) */
const InstagramIcon = (props) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
        <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5h.01" />
    </svg>
);
const FacebookIcon = (props) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

function ContactRow({ icon: Icon, label, value, href }) {
    const content = (
        <>
            <Icon size={18} className="text-[#c9a24a] shrink-0 mt-0.5" />
            <span className="min-w-0">
                <span className="block text-xs text-white/50">{label}</span>
                <span className="block text-white/90 break-words" dir={href ? "ltr" : undefined} style={href ? { textAlign: "right" } : undefined}>
                    {value}
                </span>
            </span>
        </>
    );

    return (
        <li>
            {href ? (
                <a href={href} className="flex items-start gap-3 hover:text-white group">
                    {content}
                </a>
            ) : (
                <div className="flex items-start gap-3">{content}</div>
            )}
        </li>
    );
}

function Footer() {
    const phoneOk = isReal(STORE.phone);
    const waOk = isReal(STORE.whatsapp);
    const mailOk = isReal(STORE.email);

    return (
        <footer className="fb-dark bg-[#070706] text-white border-t border-[#c9a24a]/50">
            <div className="max-w-7xl mx-auto px-5 md:px-8 pt-16 pb-12 grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_1.2fr_1.2fr]">

                {/* BRAND */}
                <div>
                    <img
                        src={logo}
                        alt="فن للباس FENLIBASS - ملابس رجال"
                        className="w-36 md:w-44 h-auto"
                    />
                    <p className="text-white/70 leading-7 mt-5 max-w-xs">
                        ملابس رجال بتصميم عصري وأناقة بسيطة. نختار القطع بعناية لتصلك كما تحب.
                    </p>

                    <div className="flex items-center gap-3 mt-6">
                        <a
                            href={isReal(STORE.instagram) ? STORE.instagram : "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="إنستغرام"
                            className="w-11 h-11 rounded-full border border-white/25 flex items-center justify-center hover:bg-[#c9a24a] hover:text-[#12100d] hover:border-[#c9a24a] transition-colors"
                        >
                            <InstagramIcon />
                        </a>
                        <a
                            href={isReal(STORE.facebook) ? STORE.facebook : "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="فيسبوك"
                            className="w-11 h-11 rounded-full border border-white/25 flex items-center justify-center hover:bg-[#c9a24a] hover:text-[#12100d] hover:border-[#c9a24a] transition-colors"
                        >
                            <FacebookIcon />
                        </a>
                        {waOk && (
                            <a
                                href={`https://wa.me/${digits(STORE.whatsapp)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="واتساب"
                                className="w-11 h-11 rounded-full border border-white/25 flex items-center justify-center hover:bg-[#c9a24a] hover:text-[#12100d] hover:border-[#c9a24a] transition-colors"
                            >
                                <MessageCircle size={20} />
                            </a>
                        )}
                    </div>
                </div>

                {/* QUICK LINKS */}
                <nav aria-label="روابط سريعة">
                    <h3 className="fb-display text-2xl text-[#c9a24a] mb-5">روابط سريعة</h3>
                    <ul className="space-y-3 text-white/75">
                        {quickLinks.map((l) => (
                            <li key={l.href}>
                                <a href={l.href} className="hover:text-white hover:underline underline-offset-4 decoration-[#c9a24a]">
                                    {l.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* DELIVERY + PAYMENT */}
                <div>
                    <h3 className="fb-display text-2xl text-[#c9a24a] mb-5">التوصيل والدفع</h3>
                    <ul className="space-y-4 text-white/75 leading-7">
                        {deliveryInfo.map(({ icon: Icon, text }) => (
                            <li key={text} className="flex items-start gap-3">
                                <Icon size={18} className="text-[#c9a24a] shrink-0 mt-1.5" />
                                <span>{text}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CONTACT */}
                <div>
                    <h3 className="fb-display text-2xl text-[#c9a24a] mb-5">تواصل معنا</h3>
                    <ul className="space-y-4 text-white/75">
                        <ContactRow
                            icon={Phone}
                            label="الهاتف"
                            value={STORE.phone}
                            href={phoneOk ? `tel:${digits(STORE.phone)}` : undefined}
                        />
                        <ContactRow
                            icon={MessageCircle}
                            label="واتساب"
                            value={waOk ? `+${digits(STORE.whatsapp)}` : STORE.whatsapp}
                            href={waOk ? `https://wa.me/${digits(STORE.whatsapp)}` : undefined}
                        />
                        <ContactRow
                            icon={Mail}
                            label="البريد الإلكتروني"
                            value={STORE.email}
                            href={mailOk ? `mailto:${STORE.email}` : undefined}
                        />
                        <ContactRow icon={MapPin} label="العنوان" value={STORE.address} />
                        <ContactRow icon={Clock} label="أوقات العمل" value={STORE.hours} />
                    </ul>
                </div>
            </div>

            {/* BOTTOM BAR */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-5 md:px-8 pt-5 pb-24 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 text-sm text-white/50">
                    <p>© {new Date().getFullYear()} FENLIBASS. جميع الحقوق محفوظة.</p>

                    <button
                        type="button"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="flex items-center gap-2 text-white/70 hover:text-[#c9a24a] transition-colors"
                    >
                        العودة للأعلى
                        <ArrowUp size={16} />
                    </button>
                </div>
            </div>
        </footer>
    );
}

export default Footer;