import { useState, useMemo, useEffect, useRef, Fragment } from "react";

import Navbar from "../components/Navbar";
import { FaWhatsapp } from "react-icons/fa";
import Footer from "../components/Footer";
import Checkout from "../components/Checkout";

import { ArrowUpRight } from "lucide-react";

import Veste_Tshirt from "../images/vest_trico.jpg";
import Tshirt_veste from "../images/trico_veste.jpg";
import VesteBlack from "../images/veste_black.jpg";
import VesteBeige from "../images/beigeveste.jpg";
import OldBrown from "../images/ToBrown.jpg";
import OldBlue from "../images/OldBlue.jpg";
import OldGray from "../images/OldGray.png";
import PoloBlue from "../images/PoloBlue.png";
import PoloBlack from "../images/PoloBlack.png";
import PoloDGreen from "../images/PoloDGreen.png";
import PoloLGreen from "../images/PoloLGreen.png";

import rv1 from "../images/reviews/rv1.jpg";
import rv2 from "../images/reviews/rv2.jpg";
import rv3 from "../images/reviews/rv3.jpg";

import {
    ShoppingBag,
    Truck,
    ShieldCheck,
    Wallet,
    PackageOpen,
    Plus,
    Minus,
    Trash2,
    Check,
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* DATA                                                                */
/* ------------------------------------------------------------------ */

const mainOffer = {
    id: "oldmoney-set",
    name: "عرض فصل الخريف",
    description:
        "أناقة بسيطة بتصميم عصري. اكتشف عرض Old Money المميز الذي يجمع بين التريكو والفيست.",
    price: 6600,
    badge: "العرض الرئيسي",
    // the two pieces of the offer
    bundle: [
        { en: "Trico Old Money", ar: "تريكو" },
        { en: "Veste Demi Saison", ar: "فيست نصف موسم" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [Veste_Tshirt, Tshirt_veste, VesteBlack, OldBrown],
};

const otherProducts = [
    {
        id: "zara-vest",
        name: "فيست Zara",
        price: 3900,
        badge: "جديد",
        sizes: ["S", "M", "L", "XL"],
        colors: [
            { name: "أسود", hex: "#111111", image: VesteBlack },
            { name: "بيج", hex: "#d6c7a8", image: VesteBeige },
        ],
    },
    {
        id: "oldmoney-tshirt",
        name: "تريكو Old Money",
        price: 2800,
        badge: "عرض خاص",
        sizes: ["M", "L", "XL", "XXL"],
        colors: [
            { name: "بني", hex: "#6b4a2f", image: OldBrown },
            { name: "أزرق", hex: "#1f2a44", image: OldBlue },
            { name: "رمادي", hex: "#8a8a8a", image: OldGray },
        ],
    },
    {
        id: "polo",
        name: "تريكو POLO",
        price: 2500,
        badge: "جديد",
        sizes: ["S", "M", "L"],
        colors: [
            { name: "أزرق", hex: "#1f2a44", image: PoloBlue },
            { name: "أسود", hex: "#111111", image: PoloBlack },
            { name: "أخضر غامق", hex: "#00703c", image: PoloDGreen },
            { name: "أخضر فاتح", hex: "#a4d4a3", image: PoloLGreen },
        ],
    },
];

const perks = [
    { icon: Truck, text: "نوصّل إلى 58 ولاية" },
    { icon: Wallet, text: "تدفع عند الاستلام" },
    { icon: PackageOpen, text: "افتح الطلبية وتأكد قبل الدفع" },
    { icon: ShieldCheck, text: "قطع مختارة بعناية" },
];

const faqs = [
    {
        q: "كيف يمكنني تأكيد طلبي؟",
        a: "بعد إرسال الطلب، نتواصل معك هاتفياً لتأكيد المنتجات والعنوان قبل الشحن.",
    },
    {
        q: "متى أدفع ثمن الطلب؟",
        a: "الدفع عند الاستلام، بعد وصول الطلب إليك.",
    },
    {
        q: "هل يمكنني فتح الطلبية والتأكد منها قبل الدفع؟",
        a: "نعم، من حقك فتح الطلبية وفحصها والتأكد منها قبل أن تدفع. إذا أعجبتك تستلمها وتدفع ثمنها، وإذا لم تعجبك تعيدها.",
    },
    {
        q: "في حال مجاتنيش",
        a: "خدمة الاستبدال متوفرة",
    },
    {
        q: "كم تكلفة التوصيل؟",
        a: "تختلف حسب الولاية، ويظهر سعر التوصيل في صفحة إتمام الطلب.",
    },
];

// Put your real customer review screenshots/photos in src/images/reviews/
const customerReviews = [
    { image: rv1, alt: "رأي أحد زبائننا 1" },
    { image: rv2, alt: "رأي أحد زبائننا 2" },
    { image: rv3, alt: "رأي أحد زبائننا 3" },
];

const steps = [
    { title: "اختر قطعتك", text: "حدّد اللون والمقاس وأضفها إلى السلة." },
    { title: "أدخل معلوماتك", text: "الاسم، الهاتف والولاية. يظهر سعر التوصيل فورًا." },
    { title: "افتح وتأكد ثم ادفع", text: "نتصل بك لتأكيد الطلب. عند وصوله تفتحه وتتأكد منه، وتدفع فقط إذا أعجبك." },
];

/* ------------------------------------------------------------------ */
/* HELPERS                                                             */
/* ------------------------------------------------------------------ */

const fmt = (n) => `${n.toLocaleString("en-US")} دج`;

const CATALOG = [mainOffer, ...otherProducts];
const getProduct = (id) => CATALOG.find((p) => p.id === id);
const imageFor = (product, color) =>
    color
        ? product.colors?.find((c) => c.name === color)?.image
        : product.images?.[0];

// The cart is saved in the browser so it survives a refresh.
// Only ids/sizes/colors/quantities are stored; names, prices and images
// always come from the catalog above, so price changes never go stale.
const CART_KEY = "fenlibass-cart-v1";

// WhatsApp number with country code, without +, spaces or leading zero.
const WHATSAPP_NUMBER = "213553551559";

function useStoredCart() {
    const [lines, setLines] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(CART_KEY, JSON.stringify(lines));
        } catch {
            /* storage unavailable: the cart still works for this visit */
        }
    }, [lines]);

    return [lines, setLines];
}

/* ------------------------------------------------------------------ */
/* STYLES (fonts + a few animations)                                   */
/* Palette: black #12100d · gold #c9a24a · ivory #f3f0ea               */
/* To match your logo exactly, search and replace #c9a24a everywhere. */
/* ------------------------------------------------------------------ */

function Styles() {
    return (
        <style>{`
@import url('https://fonts.googleapis.com/css2?family=El+Messiri:wght@500;700&family=Readex+Pro:wght@300;400;500;600&display=swap');

html { scroll-behavior: smooth; }
.fb { font-family: 'Readex Pro', system-ui, sans-serif; }
.fb-display { font-family: 'El Messiri', 'Readex Pro', sans-serif; font-weight: 700; letter-spacing: 0; }
.fb :focus-visible { outline: 3px solid #12100d; outline-offset: 3px; }
.fb .fb-dark :focus-visible { outline-color: #c9a24a; }

@keyframes fb-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
@keyframes fb-pop { 0% { transform: scale(.6) rotate(-14deg); opacity: 0; } 70% { transform: scale(1.08) rotate(-6deg); } 100% { transform: scale(1) rotate(-8deg); opacity: 1; } }
@keyframes fb-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }

.fb-rise { animation: fb-rise .7s cubic-bezier(.2,.7,.2,1) both; }
.fb-pop { animation: fb-pop .6s .55s cubic-bezier(.2,.9,.3,1.2) both; }
.fb-shake { animation: fb-shake .35s; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .fb-rise, .fb-pop, .fb-shake { animation: none; }
}
        `}</style>
    );
}

/* ------------------------------------------------------------------ */
/* SMALL PIECES                                                        */
/* ------------------------------------------------------------------ */

function ProductImage({ src, alt, className = "" }) {
    const [failed, setFailed] = useState(false);

    if (!src || failed) {
        return (
            <div className="w-full h-full flex items-center justify-center text-[#b0a898]">
                <ShoppingBag size={42} strokeWidth={1.4} />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            loading="lazy"
            onError={() => setFailed(true)}
            className={`w-full h-full object-contain ${className}`}
        />
    );
}

// `attempts` goes up each time someone tries to add without a size:
// it re-triggers the shake and shows the hint.
function SizePicker({ sizes, value, onChange, attempts, dark = false }) {
    const missing = attempts > 0 && !value;

    return (
        <div>
            <div
                key={attempts}
                role="group"
                aria-label="المقاس"
                className={`flex flex-wrap gap-2 ${missing ? "fb-shake" : ""}`}
            >
                {sizes.map((s) => {
                    const on = value === s;
                    const look = dark
                        ? on
                            ? "bg-[#c9a24a] text-[#12100d] border-[#c9a24a]"
                            : "border-white/35 text-white hover:border-white"
                        : on
                            ? "bg-[#12100d] text-white border-[#12100d]"
                            : "border-[#cbc3b3] text-[#12100d] hover:border-[#12100d]";
                    return (
                        <button
                            key={s}
                            type="button"
                            aria-pressed={on}
                            onClick={() => onChange(s)}
                            className={`h-11 min-w-11 px-4 rounded-full text-sm font-medium border transition-colors ${look}`}
                        >
                            {s}
                        </button>
                    );
                })}
            </div>

            {missing && (
                <p
                    role="alert"
                    className={`mt-2 text-sm ${dark ? "text-[#c9a24a]" : "text-[#b3261e]"}`}
                >
                    اختر المقاس أولاً
                </p>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* SIZE GUIDE                                                          */
/* ------------------------------------------------------------------ */

function SizeGuide({ open, onClose }) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="presentation">
            <button
                type="button"
                aria-label="إغلاق دليل المقاسات"
                onClick={onClose}
                className="absolute inset-0 bg-black/60"
            />
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="size-guide-title"
                className="relative w-full max-w-lg rounded-3xl bg-[#faf8f4] p-5 sm:p-7 shadow-2xl text-[#12100d]"
                dir="rtl"
            >
                <div className="flex items-center justify-between gap-4">
                    <h2 id="size-guide-title" className="fb-display text-2xl sm:text-3xl">
                        دليل المقاسات
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="إغلاق"
                        className="w-10 h-10 rounded-full hover:bg-[#ebe5d8] text-xl"
                    >
                        ×
                    </button>
                </div>
                <p className="text-sm text-[#6b655b] leading-7 mt-3">
                    هذا جدول إرشادي فقط. للحصول على اختيار أدق، قارن القياسات مع قطعة ملابس
                    مناسبة لديك، أو تواصل معنا قبل تأكيد الطلب.
                </p>
                <div className="overflow-x-auto mt-5">
                    <table className="w-full text-sm text-center border-collapse">
                        <thead>
                            <tr className="bg-[#12100d] text-white">
                                <th className="p-3 rounded-tr-xl">المقاس</th>
                                <th className="p-3">الصدر (سم)</th>
                                <th className="p-3 rounded-tl-xl">الطول (سم)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                ["S", "حدّد القياس", "حدّد القياس"],
                                ["M", "حدّد القياس", "حدّد القياس"],
                                ["L", "حدّد القياس", "حدّد القياس"],
                                ["XL", "حدّد القياس", "حدّد القياس"],
                                ["XXL", "حدّد القياس", "حدّد القياس"],
                            ].map((row) => (
                                <tr key={row[0]} className="border-b border-[#ddd6c8]">
                                    {row.map((cell, i) => <td key={i} className="p-3">{cell}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-xs text-[#8a8377] mt-3">
                    استبدل عبارة «حدّد القياس» بقياسات منتجاتك الفعلية قبل نشر المتجر.
                </p>
                <button
                    type="button"
                    onClick={onClose}
                    className="mt-5 w-full py-3 rounded-full bg-[#12100d] text-white font-medium"
                >
                    فهمت
                </button>
            </section>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* GALLERY (arch frame)                                                */
/* ------------------------------------------------------------------ */

function Gallery({ images, alt, sticker }) {
    const [i, setI] = useState(0);
    const startX = useRef(null);

    const go = (d) => setI((c) => (c + d + images.length) % images.length);

    // In RTL, swiping toward the left shows the next photo
    const onTouchEnd = (e) => {
        if (startX.current === null) return;
        const dx = e.changedTouches[0].clientX - startX.current;
        startX.current = null;
        if (Math.abs(dx) < 45) return;
        go(dx < 0 ? 1 : -1);
    };

    return (
        <div>
            <div
                className="relative mx-auto w-full max-w-[440px]"
                onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
                onTouchEnd={onTouchEnd}
            >
                <div className="aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[2rem] bg-[#faf8f4]">
                    <ProductImage key={i} src={images[i]} alt={`${alt} - صورة ${i + 1}`} />
                </div>

                {sticker && (
                    <span className="fb-pop fb-display absolute top-24 -right-3 sm:-right-6 bg-[#c9a24a] text-[#12100d] text-2xl px-5 py-2 rounded-full shadow-[0_6px_0_rgba(0,0,0,.18)]">
                        {sticker}
                    </span>
                )}

                <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="الصورة السابقة"
                    className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-white/90 text-[#12100d] flex items-center justify-center hover:bg-white transition-colors"
                >
                    <ChevronRight size={20} />
                </button>
                <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="الصورة التالية"
                    className="absolute bottom-4 left-4 w-11 h-11 rounded-full bg-white/90 text-[#12100d] flex items-center justify-center hover:bg-white transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>
            </div>

            <div className="flex justify-center gap-3 mt-5">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => setI(idx)}
                        aria-label={`عرض الصورة ${idx + 1}`}
                        aria-pressed={i === idx}
                        className={`w-14 h-16 rounded-2xl overflow-hidden bg-[#faf8f4] border-2 transition-colors ${i === idx ? "border-[#c9a24a]" : "border-transparent opacity-70 hover:opacity-100"}`}
                    >
                        <ProductImage src={img} alt="" />
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* PRODUCT CARD                                                        */
/* ------------------------------------------------------------------ */

function ProductCard({ product, onAdd }) {
    const [color, setColor] = useState(product.colors[0]);
    const [size, setSize] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [added, setAdded] = useState(false);
    const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

    const handleAdd = () => {
        if (!size) {
            setAttempts((n) => n + 1);
            return;
        }
        onAdd(product, size, color.name);
        setAdded(true);
        setTimeout(() => setAdded(false), 1600);
    };

    return (
        <article className="min-w-0">
            <div className="relative aspect-[4/5] rounded-[2rem] bg-white overflow-hidden">
                <ProductImage
                    key={color.image}
                    src={color.image}
                    alt={`${product.name} - ${color.name}`}
                />
                <span className="absolute top-4 right-4 bg-[#c9a24a] text-[#12100d] text-xs font-semibold px-3 py-1.5 rounded-full">
                    {product.badge}
                </span>
            </div>

            <div className="pt-5 px-1">
                <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-lg leading-snug">{product.name}</h3>
                    <div className="text-left shrink-0">
                        <p className="font-semibold">{fmt(product.price)}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                    {product.colors.map((c) => (
                        <button
                            key={c.name}
                            type="button"
                            title={c.name}
                            aria-label={c.name}
                            aria-pressed={color.name === c.name}
                            onClick={() => setColor(c)}
                            style={{ backgroundColor: c.hex }}
                            className={`w-7 h-7 rounded-full border border-black/15 transition-shadow ${color.name === c.name ? "ring-2 ring-offset-2 ring-offset-[#f3f0ea] ring-[#12100d]" : ""}`}
                        />
                    ))}
                    <span className="text-sm text-[#6b655b]">{color.name}</span>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">اختر المقاس</p>
                    <button
                        type="button"
                        onClick={() => setSizeGuideOpen(true)}
                        className="text-xs underline underline-offset-4 text-[#6b655b] hover:text-[#12100d]"
                    >
                        دليل المقاسات
                    </button>
                </div>
                <div className="mt-3">
                    <SizePicker
                        sizes={product.sizes}
                        value={size}
                        onChange={setSize}
                        attempts={attempts}
                    />
                </div>
                <SizeGuide open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />

                <button
                    type="button"
                    onClick={handleAdd}
                    className={`mt-5 w-full py-3.5 rounded-full font-medium flex items-center justify-center gap-2 transition-colors ${added ? "bg-[#c9a24a] text-[#12100d]" : "bg-[#12100d] text-white hover:bg-[#c9a24a] hover:text-[#12100d]"}`}
                >
                    {added ? (
                        <>
                            <Check size={18} />
                            تمت الإضافة
                        </>
                    ) : (
                        <>
                            <ShoppingBag size={18} />
                            أضف إلى السلة
                        </>
                    )}
                </button>
            </div>
        </article>
    );
}

/* ------------------------------------------------------------------ */
/* CART DRAWER                                                         */
/* ------------------------------------------------------------------ */

function CartDrawer({ open, onClose, items, total, setLines, onCheckout }) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open, onClose]);

    const change = (key, d) =>
        setLines((cur) =>
            cur.map((i) =>
                i.key === key
                    ? { ...i, quantity: Math.min(10, Math.max(1, i.quantity + d)) }
                    : i
            )
        );
    const remove = (key) => setLines((cur) => cur.filter((i) => i.key !== key));

    return (
        <div
            className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`}
            aria-hidden={!open}
        >
            <div
                onClick={onClose}
                className={`absolute inset-0 bg-[#12100d]/55 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
            />

            <aside
                role="dialog"
                aria-modal="true"
                aria-label="سلة المشتريات"
                className={`absolute top-0 bottom-0 left-0 w-full max-w-md bg-[#faf8f4] flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex items-center justify-between px-6 h-20 border-b border-[#ddd6c8]">
                    <h2 className="fb-display text-3xl">سلتك</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="إغلاق السلة"
                        className="w-11 h-11 rounded-full hover:bg-[#ebe5d8] flex items-center justify-center"
                    >
                        <X size={22} />
                    </button>
                </div>

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                        <ShoppingBag size={48} strokeWidth={1.3} className="text-[#b0a898]" />
                        <p className="fb-display text-2xl mt-5">السلة فارغة</p>
                        <p className="text-[#6b655b] mt-2 text-sm">
                            اختر قطعة تعجبك وسنحجزها لك هنا.
                        </p>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-6 px-7 py-3 rounded-full bg-[#12100d] text-white text-sm font-medium"
                        >
                            تصفّح القطع
                        </button>
                    </div>
                ) : (
                    <>
                        <ul className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#e5dfd2]">
                            {items.map((item) => (
                                <li key={item.key} className="flex gap-4 py-5">
                                    <div className="w-20 h-24 rounded-2xl bg-white overflow-hidden shrink-0">
                                        <ProductImage src={item.image} alt={item.name} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between gap-3">
                                            <h3 className="font-semibold leading-snug">{item.name}</h3>
                                            <button
                                                type="button"
                                                onClick={() => remove(item.key)}
                                                aria-label={`حذف ${item.name}`}
                                                className="text-[#8a8377] hover:text-[#b3261e] shrink-0"
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>

                                        <p className="text-sm text-[#6b655b] mt-1">
                                            {item.color && `${item.color}، `}المقاس {item.size}
                                        </p>

                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center rounded-full border border-[#cbc3b3]">
                                                <button
                                                    type="button"
                                                    onClick={() => change(item.key, -1)}
                                                    aria-label="إنقاص الكمية"
                                                    className="w-9 h-9 flex items-center justify-center"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-6 text-center text-sm">{item.quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => change(item.key, 1)}
                                                    aria-label="زيادة الكمية"
                                                    className="w-9 h-9 flex items-center justify-center"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <span className="font-semibold">
                                                {fmt(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="px-6 py-5 border-t border-[#ddd6c8] bg-white">
                            <div className="flex items-center justify-between">
                                <span className="text-[#6b655b]">المجموع</span>
                                <span className="fb-display text-3xl">{fmt(total)}</span>
                            </div>
                            <p className="text-xs text-[#8a8377] mt-1">
                                سعر التوصيل يظهر في الخطوة التالية حسب ولايتك.
                            </p>
                            <button
                                type="button"
                                onClick={onCheckout}
                                className="mt-4 w-full py-4 rounded-full bg-[#12100d] text-white font-medium hover:bg-[#c9a24a] hover:text-[#12100d] transition-colors"
                            >
                                أكمل الطلب
                            </button>
                        </div>
                    </>
                )}
            </aside>
        </div>
    );
}

function ReviewImage({ src, alt }) {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return (
            <div className="aspect-[4/5] flex flex-col items-center justify-center bg-[#ebe5d8] text-[#8a8377] p-4 text-center">
                <ShoppingBag size={30} strokeWidth={1.3} />
                <span className="text-xs mt-3">أضف صورة تقييم الزبون هنا</span>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            loading="lazy"
            onError={() => setFailed(true)}
            className="w-full aspect-[4/5] object-contain bg-white rounded-2xl"
        />
    );
}

/* ------------------------------------------------------------------ */
/* HOME                                                                */
/* ------------------------------------------------------------------ */

function Home() {
    const [lines, setLines] = useStoredCart();
    const [drawer, setDrawer] = useState(false);
    const [mainSize, setMainSize] = useState("");
    const [mainAttempts, setMainAttempts] = useState(0);
    const [mainSizeGuideOpen, setMainSizeGuideOpen] = useState(false);

    // Full cart items, built from the catalog
    const cart = useMemo(
        () =>
            lines
                .map((l) => {
                    const p = getProduct(l.id);
                    if (!p) return null;
                    return {
                        key: l.key,
                        id: l.id,
                        name: p.name,
                        price: p.price,
                        size: l.size,
                        color: l.color,
                        quantity: l.quantity,
                        image: imageFor(p, l.color),
                    };
                })
                .filter(Boolean),
        [lines]
    );

    const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
    const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    const addToCart = (product, size, color = "") => {
        const key = `${product.id}-${size}-${color}`;
        setLines((cur) => {
            const found = cur.find((i) => i.key === key);
            if (found) {
                return cur.map((i) =>
                    i.key === key ? { ...i, quantity: Math.min(10, i.quantity + 1) } : i
                );
            }
            return [...cur, { key, id: product.id, size, color, quantity: 1 }];
        });
    };

    const goCheckout = () => {
        setDrawer(false);
        setTimeout(() => {
            document
                .getElementById("checkout")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 220);
    };

    const buyMain = (checkoutNow) => {
        if (!mainSize) {
            setMainAttempts((n) => n + 1);
            return;
        }
        addToCart(mainOffer, mainSize);
        if (checkoutNow) goCheckout();
        else setDrawer(true);
    };

    return (
        <div dir="rtl" className="fb min-h-screen bg-[#f3f0ea] text-[#12100d]">
            <Styles />

            <Navbar />

            {/* ---------------- WHATSAPP HELP BANNER ---------------- */}
            <div className="group relative mx-auto max-w-7xl overflow-hidden border border-[#c9a44c]/40 bg-[#16834a] shadow-xl">
                {/* Animated glow */}
                <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[shine_4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="relative flex min-h-[80px] items-center justify-between gap-3 px-3 py-4 sm:px-6 sm:py-5">
                    <div className="min-w-0 flex-1 text-center animate-[fadeIn_0.8s_ease-out]">
                        <p className="text-lg font-extrabold leading-relaxed text-white sm:text-2xl md:text-3xl">
                            ما تعرفش دير طلب في الموقع؟
                        </p>
                    </div>

                    <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                            "السلام عليكم، أحتاج مساعدة لاختيار المنتج والمقاس المناسب."
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="relative inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-3 py-3 text-sm font-extrabold text-[#16834a] shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#f3f0ea] hover:shadow-xl animate-[pulse_2.5s_ease-in-out_infinite] sm:px-6 sm:py-4 sm:text-lg"
                    >
                        <FaWhatsapp size={23} />
                        <span>راسلنا على واتساب</span>
                        <ArrowUpRight size={18} />
                    </a>
                </div>

                {/* GOLD BOTTOM LINE */}
                <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#e5c477] to-transparent" />

                <style>{`
        @keyframes shine {
            0%, 60% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `}</style>
            </div>

            {/* ---------------- HERO / MAIN OFFER ---------------- */}
            <section id="main-offer" className="fb-dark bg-[#12100d] text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 md:py-20 grid md:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-center">

                    {/* DETAILS (right in RTL) */}
                    <div className="order-2 md:order-1">
                        <span
                            className="fb-rise inline-flex items-center gap-2 rounded-full bg-[#c9a24a] text-[#12100d] text-sm font-semibold px-4 py-1.5"
                            style={{ animationDelay: ".0s" }}
                        >
                            قطعتان في عرض واحد
                        </span>

                        <h1
                            className="fb-rise fb-display text-6xl md:text-8xl leading-[1.05] mt-5"
                            style={{ animationDelay: ".05s" }}
                        >
                            {mainOffer.name}
                        </h1>

                        <p
                            className="fb-rise text-white/80 text-lg leading-8 mt-5 max-w-md"
                            style={{ animationDelay: ".14s" }}
                        >
                            {mainOffer.description}
                        </p>

                        {/* THE TWO PIECES */}
                        <div
                            className="fb-rise mt-7 flex items-stretch gap-3 max-w-lg"
                            style={{ animationDelay: ".22s" }}
                        >
                            {mainOffer.bundle.map((item, idx) => (
                                <Fragment key={item.en}>
                                    {idx > 0 && (
                                        <span className="self-center w-9 h-9 shrink-0 rounded-full bg-[#c9a24a] text-[#12100d] flex items-center justify-center">
                                            <Plus size={18} strokeWidth={2.5} />
                                        </span>
                                    )}
                                    <div className="flex-1 min-w-0 rounded-2xl border border-[#c9a24a]/50 bg-white/[0.05] px-4 py-4">
                                        <p className="fb-display text-xl md:text-2xl text-[#c9a24a] leading-tight">
                                            {item.en}
                                        </p>
                                        <p className="text-sm text-white/70 mt-1.5">{item.ar}</p>
                                    </div>
                                </Fragment>
                            ))}
                        </div>

                        {/* PRICE */}
                        <div
                            className="fb-rise flex items-end flex-wrap gap-x-4 gap-y-1 mt-8"
                            style={{ animationDelay: ".3s" }}
                        >
                            <span className="fb-display text-6xl md:text-7xl leading-none">
                                {fmt(mainOffer.price)}
                            </span>
                            <span className="pb-1.5 text-white/70">للقطعتين معًا</span>
                        </div>

                        {/* SIZE */}
                        <div className="fb-rise mt-8" style={{ animationDelay: ".38s" }}>
                            <div className="flex items-center justify-between gap-3 mb-3">
                                <p className="text-sm text-white/75">المقاس</p>
                                <button
                                    type="button"
                                    onClick={() => setMainSizeGuideOpen(true)}
                                    className="text-xs text-[#c9a24a] underline underline-offset-4"
                                >
                                    دليل المقاسات
                                </button>
                            </div>
                            <SizePicker
                                sizes={mainOffer.sizes}
                                value={mainSize}
                                onChange={setMainSize}
                                attempts={mainAttempts}
                                dark
                            />
                            <SizeGuide
                                open={mainSizeGuideOpen}
                                onClose={() => setMainSizeGuideOpen(false)}
                            />
                        </div>

                        {/* BUTTONS */}
                        <div
                            className="fb-rise flex flex-col sm:flex-row gap-3 mt-8"
                            style={{ animationDelay: ".46s" }}
                        >
                            <button
                                type="button"
                                onClick={() => buyMain(true)}
                                className="flex-1 sm:flex-none sm:px-10 py-4 rounded-full bg-[#c9a24a] text-[#12100d] font-semibold hover:bg-[#dcb95f] transition-colors"
                            >
                                اطلب الآن
                            </button>
                            <button
                                type="button"
                                onClick={() => buyMain(false)}
                                className="flex-1 sm:flex-none sm:px-8 py-4 rounded-full border border-white/40 hover:border-white flex items-center justify-center gap-2 transition-colors"
                            >
                                <ShoppingBag size={18} />
                                أضف إلى السلة
                            </button>
                        </div>

                        {/* RIGHT TO INSPECT THE ORDER */}
                        <div
                            className="fb-rise mt-6 max-w-lg flex items-start gap-3 rounded-2xl border border-[#c9a24a]/40 bg-[#c9a24a]/10 px-4 py-3.5"
                            style={{ animationDelay: ".54s" }}
                        >
                            <PackageOpen size={22} className="text-[#c9a24a] shrink-0 mt-0.5" />
                            <p className="text-sm leading-7 text-white/90">
                                <span className="font-semibold text-white">افتح الطلبية قبل أن تدفع.</span>{" "}
                                من حقك فحصها والتأكد منها. إذا أعجبتك تستلمها، وإذا لم تعجبك تعيدها.
                            </p>
                        </div>
                    </div>

                    {/* GALLERY (left in RTL) */}
                    <div
                        className="order-1 md:order-2 fb-rise"
                        style={{ animationDelay: ".12s" }}
                    >
                        <Gallery
                            images={mainOffer.images}
                            alt={mainOffer.name}
                            sticker="قطعتان"
                        />
                    </div>
                </div>
            </section>

            {/* ---------------- PERKS BAND ---------------- */}
            <section className="bg-[#c9a24a] text-[#12100d]">
                <ul className="max-w-7xl mx-auto px-5 md:px-8 py-4 flex flex-wrap justify-center md:justify-between gap-x-10 gap-y-3">
                    {perks.map(({ icon: Icon, text }) => (
                        <li key={text} className="flex items-center gap-2.5 text-sm font-medium">
                            <Icon size={20} strokeWidth={1.7} />
                            {text}
                        </li>
                    ))}
                </ul>
            </section>

            {/* ---------------- OTHER PRODUCTS ---------------- */}
            <section id="other-products" className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24 scroll-mt-4">
                <div className="max-w-xl mb-12">
                    <h2 className="fb-display text-5xl md:text-6xl leading-tight">
                        قطع تكمل إطلالتك
                    </h2>
                    <p className="text-[#6b655b] mt-4 leading-7">
                        اختر اللون ثم المقاس. يمكنك جمع أكثر من قطعة في طلب واحد.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
                    {otherProducts.map((p) => (
                        <ProductCard
                            key={p.id}
                            product={p}
                            onAdd={(...args) => {
                                addToCart(...args);
                                setDrawer(true);
                            }}
                        />
                    ))}
                </div>
            </section>

            {/* ---------------- CUSTOMER REVIEWS ---------------- */}
            <section id="reviews" className="bg-white py-16 md:py-20">
                <div className="max-w-7xl mx-auto px-5 md:px-8">
                    <div className="max-w-xl mb-10">
                        <p className="text-sm font-semibold text-[#a17b2e] mb-2">ثقة زبائننا هي فخرنا</p>
                        <h2 className="fb-display text-4xl md:text-5xl">آراء زبائننا</h2>
                        <p className="text-[#6b655b] mt-4 leading-7">
                            شوفوا تجارب وآراء الناس اللي اختاروا FENLIBASS. الصور هنا مخصصة
                            لتقييماتكم الحقيقية.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {customerReviews.map((review, index) => (
                            <div key={index} className="rounded-2xl overflow-hidden border border-[#e8e1d5] bg-[#faf8f4] p-2">
                                <ReviewImage src={review.image} alt={review.alt} />
                                <p className="text-center text-xs text-[#6b655b] py-3">تجربة زبون #{index + 1}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------------- HOW IT WORKS ---------------- */}
            <section id="how-it-works" className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24">
                <h2 className="fb-display text-4xl md:text-5xl mb-10">كيف تطلب؟</h2>

                <ol className="grid md:grid-cols-3 gap-10 md:gap-12">
                    {steps.map((s, idx) => (
                        <li key={s.title} className="flex gap-5">
                            <span className="fb-display text-6xl leading-none text-[#c9a24a]">
                                {idx + 1}
                            </span>
                            <div>
                                <h3 className="font-semibold text-lg">{s.title}</h3>
                                <p className="text-[#6b655b] mt-2 leading-7">{s.text}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </section>

            {/* ---------------- FAQ ---------------- */}
            <section id="faq" className="max-w-4xl mx-auto px-5 md:px-8 pb-16 md:pb-24">
                <h2 className="fb-display text-4xl md:text-5xl mb-8">أسئلة شائعة</h2>
                <div className="space-y-3">
                    {faqs.map((item) => (
                        <details key={item.q} className="group rounded-2xl bg-white px-5 py-4">
                            <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-semibold">
                                {item.q}
                                <span className="text-xl text-[#c9a24a] transition-transform group-open:rotate-45">+</span>
                            </summary>
                            <p className="text-sm text-[#6b655b] leading-7 mt-3">{item.a}</p>
                        </details>
                    ))}
                </div>
            </section>

            {/* ---------------- CHECKOUT ---------------- */}
            <Checkout cart={cart} setCart={setLines} />

            {/* ---------------- FOOTER ---------------- */}
            <Footer />

            {/* ---------------- FLOATING CART BUTTON ---------------- */}
            <button
                type="button"
                onClick={() => setDrawer(true)}
                aria-label={`فتح السلة، ${cartCount} قطعة`}
                className="fixed z-50 bottom-5 left-5 h-14 rounded-full bg-[#12100d] ring-1 ring-[#c9a24a]/70 text-white shadow-[0_8px_24px_rgba(0,0,0,.25)] flex items-center gap-3 pl-5 pr-4 hover:bg-[#2a251c] transition-colors"
            >
                <span className="relative">
                    <ShoppingBag size={22} />
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-[#c9a24a] text-[#12100d] text-[11px] font-bold flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                </span>
                {cartCount > 0 && (
                    <span className="text-sm font-medium">{fmt(cartTotal)}</span>
                )}
            </button>

            {/* ---------------- FLOATING WHATSAPP ---------------- */}
            <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    "السلام عليكم، أريد الاستفسار عن منتجات FENLIBASS."
                )}`}
                target="_blank"
                rel="noreferrer"
                aria-label="تواصل معنا عبر واتساب"
                className="fixed z-40 bottom-24 left-5 h-12 px-5 rounded-full bg-[#16834a] text-white shadow-lg flex items-center gap-2 text-sm font-bold hover:bg-[#116b3c] hover:scale-105 transition-all duration-300"
            >
                <FaWhatsapp size={23} />
                <span>واتساب</span>
            </a>

            <CartDrawer
                open={drawer}
                onClose={() => setDrawer(false)}
                items={cart}
                total={cartTotal}
                setLines={setLines}
                onCheckout={goCheckout}
            />
        </div>
    );
}

export default Home;