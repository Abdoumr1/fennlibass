import { useState, useMemo, useRef, useEffect } from "react";
import {
    Check,
    Loader2,
    Truck,
    Building2,
    PackageCheck,
    PackageOpen,
    AlertCircle,
} from "lucide-react";

import { DELIVERY } from "./deliveryPrices";
import { trackPixel } from "./utils/metaPixel";
import { sendOrderEmail } from "./emailOrder";

// Google Apps Script Web App URL
const SHEET_URL =
    "https://script.google.com/macros/s/AKfycbxfTxAdPh24Zn8_QHfjc1VBqSf9TDEscQcBnPxeUHqL1nMd1Mq4SwB6bs_Yo54qqVJB/exec";

const fmt = (n) => `${n.toLocaleString("en-US")} دج`;

// Algerian mobile: 05 / 06 / 07 followed by 8 digits
const PHONE_RE = /^0[567]\d{8}$/;

const FIELD_ORDER = ["name", "phone", "wilayaId", "address"];

const FIELD_LABELS = {
    name: "الاسم الكامل",
    phone: "رقم الهاتف",
    wilayaId: "الولاية",
    address: "العنوان",
};

/* --------------------------------------------------
   VALIDATION
-------------------------------------------------- */

function validate(form, wilaya, delivery) {
    const e = {};

    if (!form.name.trim()) {
        e.name = "اكتب اسمك الكامل";
    } else if (form.name.trim().length < 3) {
        e.name = "الاسم قصير جدًا";
    }

    if (!form.phone) {
        e.phone = "اكتب رقم هاتفك لنتصل بك";
    } else if (!PHONE_RE.test(form.phone)) {
        e.phone =
            form.phone.length < 10
                ? `ينقصك ${10 - form.phone.length} أرقام. الرقم يتكون من 10 أرقام`
                : "الرقم يجب أن يبدأ بـ 05 أو 06 أو 07";
    }

    if (!wilaya) {
        e.wilayaId = "اختر ولايتك لنحسب لك سعر التوصيل";
    }

    if (delivery === "home") {
        if (!form.address.trim()) {
            e.address = "اكتب البلدية والعنوان";
        } else if (form.address.trim().length < 5) {
            e.address = "العنوان غير كافٍ، أضف البلدية والحي";
        }
    } else if (!form.address.trim()) {
        e.address = "اكتب بلديتك";
    }

    return e;
}

/* --------------------------------------------------
   FIELD COMPONENT
-------------------------------------------------- */

function Field({ id, label, hint, error, valid, children }) {
    return (
        <div>
            <label
                htmlFor={id}
                className="flex items-center gap-1.5 text-sm font-medium mb-2"
            >
                {label}

                <span className="text-[#b3261e]" aria-hidden="true">
                    *
                </span>

                {valid && (
                    <span
                        className="mr-auto w-5 h-5 rounded-full bg-[#2e7d4f] text-white flex items-center justify-center"
                        aria-label="مكتمل"
                    >
                        <Check size={12} strokeWidth={3} />
                    </span>
                )}
            </label>

            {children}

            {error ? (
                <p
                    id={`${id}-msg`}
                    role="alert"
                    className="flex items-start gap-1.5 text-sm text-[#b3261e] mt-2"
                >
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    {error}
                </p>
            ) : hint ? (
                <p
                    id={`${id}-msg`}
                    className="text-sm text-[#8a8377] mt-2"
                >
                    {hint}
                </p>
            ) : null}
        </div>
    );
}

const inputBase =
    "w-full rounded-2xl border-2 bg-white px-4 py-3.5 text-base outline-none transition-colors placeholder:text-[#a39c8e] focus:border-[#12100d]";

/* --------------------------------------------------
   CHECKOUT
-------------------------------------------------- */

export default function Checkout({ cart, setCart }) {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        wilayaId: "",
        delivery: "home",
        address: "",
        website: "",
    });

    const [touched, setTouched] = useState({});
    const [attempted, setAttempted] = useState(false);
    const [status, setStatus] = useState("idle");
    const [order, setOrder] = useState(null);

    const successRef = useRef(null);
    const checkoutTracked = useRef(false);

    // Scroll to success message after submission
    useEffect(() => {
        if (!order) return;

        const frame = requestAnimationFrame(() => {
            successRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        });

        return () => cancelAnimationFrame(frame);
    }, [order]);

    const refs = {
        name: useRef(null),
        phone: useRef(null),
        wilayaId: useRef(null),
        address: useRef(null),
    };

    /* ---------- DELIVERY ---------- */

    const wilaya = DELIVERY.find(
        (w) => w.id === Number(form.wilayaId)
    );

    const deskAvailable = wilaya ? wilaya.desk !== null : true;

    const delivery =
        !deskAvailable && form.delivery === "desk"
            ? "home"
            : form.delivery;

    const deliveryPrice = wilaya ? wilaya[delivery] : null;

    /* ---------- TOTALS ---------- */

    const subtotal = useMemo(
        () =>
            cart.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            ),
        [cart]
    );

    const total = subtotal + (deliveryPrice ?? 0);

    /* ---------- META PIXEL: INITIATE CHECKOUT ---------- */
    // Fires once, when the checkout form is displayed with items in the cart.

    useEffect(() => {
        if (checkoutTracked.current || cart.length === 0) return;
        checkoutTracked.current = true;

        trackPixel("InitiateCheckout", {
            content_name: cart.map((item) => item.name).join(", "),
            content_ids: cart.map((item) => item.key),
            content_type: "product",
            num_items: cart.reduce((sum, item) => sum + item.quantity, 0),
            value: subtotal,
            currency: "DZD",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cart.length]);

    /* ---------- VALIDATION ---------- */

    const errors = validate(form, wilaya, delivery);

    const showError = (key) =>
        (touched[key] || attempted) && errors[key];

    const isValid = (key) => touched[key] && !errors[key];

    const doneCount = FIELD_ORDER.filter(
        (key) => !errors[key]
    ).length;

    const set = (key) => (e) => {
        let value = e.target.value;

        if (key === "phone") {
            value = value.replace(/\D/g, "").slice(0, 10);
        }

        setForm((f) => ({
            ...f,
            [key]: value,
        }));
    };

    const blur = (key) => () =>
        setTouched((t) => ({
            ...t,
            [key]: true,
        }));

    const aria = (key) => ({
        id: key,
        "aria-invalid": showError(key) ? "true" : "false",
        "aria-describedby": `${key}-msg`,
        onBlur: blur(key),
    });

    const tone = (key) =>
        showError(key)
            ? "border-[#b3261e] bg-[#fff6f5]"
            : isValid(key)
                ? "border-[#2e7d4f]"
                : "border-[#d9d2c3]";

    /* ---------- FIRST INVALID FIELD ---------- */

    const goToFirstError = (errs) => {
        const first = FIELD_ORDER.find((key) => errs[key]);
        const el = first && refs[first].current;

        if (!el) return;

        el.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });

        setTimeout(() => {
            el.focus({ preventScroll: true });
        }, 350);
    };

    /* --------------------------------------------------
       SUBMIT ORDER
    -------------------------------------------------- */

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (status === "sending") return;

        const errs = validate(form, wilaya, delivery);

        if (Object.keys(errs).length > 0) {
            setAttempted(true);

            setTouched({
                name: true,
                phone: true,
                wilayaId: true,
                address: true,
            });

            goToFirstError(errs);
            return;
        }

        // Ignore bot submissions
        if (form.website.trim()) return;

        if (!cart.length) return;

        const orderId = `FB-${Date.now()
            .toString(36)
            .toUpperCase()}`;

        const itemsCount = cart.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        const payload = {
            orderId,

            name: form.name.trim(),

            phone: form.phone,

            wilayaNumber: wilaya.id,

            wilaya: wilaya.name,

            deliveryType:
                delivery === "home"
                    ? "المنزل"
                    : "المكتب (Stopdesk)",

            address: form.address.trim(),

            items: cart
                .map(
                    (item) =>
                        `${item.name} | ${item.color || "-"} | ${item.size} | x${item.quantity} | ${item.price * item.quantity}`
                )
                .join("\n"),

            itemsCount,

            subtotal,

            deliveryPrice,

            deliveryTime: wilaya.time || "",

            total,

            website: "",
        };

        setStatus("sending");

        try {
            /*
             * IMPORTANT:
             * no-cors means the browser cannot read the Apps Script
             * response. A resolved fetch does not prove the order
             * was successfully saved in Google Sheets.
             */

            await Promise.all([
                fetch(SHEET_URL, {
                    method: "POST",
                    mode: "no-cors",
                    headers: {
                        "Content-Type": "text/plain;charset=utf-8",
                    },
                    body: JSON.stringify(payload),
                }),
                sendOrderEmail(payload),
            ]);

            // META PIXEL: PURCHASE
            // Sent after the order request went through.
            // orderId is used as eventID to avoid duplicate counting.
            trackPixel(
                "Purchase",
                {
                    content_name: cart.map((item) => item.name).join(", "),
                    content_ids: cart.map((item) => item.key),
                    content_type: "product",
                    num_items: itemsCount,
                    value: total,
                    currency: "DZD",
                },
                orderId
            );

            setOrder({
                id: orderId,
                total,
            });

            setCart([]);

            setStatus("success");
        } catch (err) {
            console.error("Order submission error:", err);
            setStatus("error");
        }
    };

    /* --------------------------------------------------
       SUCCESS PAGE
    -------------------------------------------------- */

    if (order) {
        return (
            <section
                ref={successRef}
                id="checkout-success"
                className="max-w-2xl mx-auto px-5 md:px-8 pb-20 scroll-mt-24"
            >
                <div className="rounded-[2rem] bg-white px-6 py-14 md:px-10 text-center shadow-sm">

                    <span className="mx-auto w-20 h-20 rounded-full bg-[#16834a] text-white flex items-center justify-center">
                        <PackageCheck size={38} />
                    </span>

                    <h2 className="fb-display text-4xl md:text-5xl mt-7">
                        تم استلام طلبك بنجاح!
                    </h2>

                    <p className="text-[#6b655b] mt-4 leading-8">
                        شكراً لثقتك في FENLIBASS ❤️
                        <br />
                        لقد وصلنا طلبك، وسنتصل بك قريباً لتأكيده.
                    </p>

                    <div className="mt-8 rounded-2xl bg-[#f3f0ea] p-5">
                        <p className="text-sm text-[#6b655b]">
                            رقم طلبك
                        </p>

                        <p className="font-bold text-xl mt-2" dir="ltr">
                            {order.id}
                        </p>
                    </div>

                    <div className="mt-4 rounded-2xl border border-[#16834a]/20 p-5">
                        <p className="text-sm text-[#6b655b]">
                            المبلغ الإجمالي عند الاستلام
                        </p>

                        <p className="font-bold text-2xl text-[#16834a] mt-2">
                            {fmt(order.total)}
                        </p>
                    </div>

                    <div className="mt-6 rounded-2xl bg-[#f3f0ea] px-5 py-4">
                        <p className="text-sm leading-8 text-[#6b655b]">
                            احتفظ برقم طلبك.
                            <br />
                            سيتواصل معك فريقنا هاتفياً لتأكيد معلومات الطلب والتوصيل.
                        </p>
                    </div>

                    <div className="mt-7 flex items-center justify-center gap-2 text-[#16834a] font-semibold">
                        <Check size={20} />
                        تم إرسال طلبك
                    </div>

                </div>
            </section>
        );
    }

    if (cart.length === 0) return null;

    const missing = FIELD_ORDER.filter(
        (key) => errors[key]
    );

    /* --------------------------------------------------
       CHECKOUT FORM
    -------------------------------------------------- */

    return (
        <section
            id="checkout"
            className="max-w-7xl mx-auto px-5 md:px-8 pb-20 md:pb-28 scroll-mt-4"
        >

            {/* HEADER */}

            <div className="mb-10 max-w-xl">
                <h2 className="fb-display text-5xl md:text-6xl leading-tight">
                    أكمل طلبك
                </h2>

                <p className="text-[#6b655b] mt-4 leading-7">
                    أربعة حقول فقط. تدفع عند الاستلام،
                    بعد أن تفتح الطلبية وتتأكد منها.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                noValidate
                className="grid lg:grid-cols-[1.25fr_0.9fr] gap-8 lg:gap-12 items-start"
            >

                {/* INPUTS */}

                <div className="space-y-6">

                    {attempted && missing.length > 0 && (
                        <div
                            role="alert"
                            className="flex items-start gap-3 rounded-2xl border-2 border-[#b3261e] bg-[#fff6f5] px-4 py-3.5 text-[#8c1d18]"
                        >
                            <AlertCircle
                                size={20}
                                className="shrink-0 mt-0.5"
                            />

                            <p className="text-sm leading-6">
                                <span className="font-semibold">
                                    ينقصك شيء بسيط قبل الإرسال.
                                </span>{" "}
                                أكمل:{" "}
                                {missing
                                    .map((key) => FIELD_LABELS[key])
                                    .join("، ")}
                                .
                            </p>
                        </div>
                    )}

                    {/* NAME AND PHONE */}

                    <div className="grid sm:grid-cols-2 gap-5">

                        <Field
                            id="name"
                            label="الاسم الكامل"
                            error={showError("name")}
                            valid={isValid("name")}
                        >
                            <input
                                {...aria("name")}
                                ref={refs.name}
                                className={`${inputBase} ${tone("name")}`}
                                placeholder="مثال: محمد بن علي"
                                autoComplete="name"
                                value={form.name}
                                onChange={set("name")}
                            />
                        </Field>

                        <Field
                            id="phone"
                            label="رقم الهاتف"
                            hint="10 أرقام، نتصل بك على هذا الرقم لتأكيد الطلب"
                            error={showError("phone")}
                            valid={isValid("phone")}
                        >
                            <input
                                {...aria("phone")}
                                ref={refs.phone}
                                className={`${inputBase} ${tone("phone")}`}
                                placeholder="0555123456"
                                type="tel"
                                inputMode="numeric"
                                autoComplete="tel"
                                dir="ltr"
                                style={{ textAlign: "right" }}
                                value={form.phone}
                                onChange={set("phone")}
                            />
                        </Field>

                    </div>

                    {/* WILAYA */}

                    <Field
                        id="wilayaId"
                        label="الولاية"
                        error={showError("wilayaId")}
                        valid={isValid("wilayaId")}
                    >
                        <select
                            {...aria("wilayaId")}
                            ref={refs.wilayaId}
                            className={`${inputBase} ${tone("wilayaId")}`}
                            value={form.wilayaId}
                            onChange={set("wilayaId")}
                        >
                            <option value="">
                                اختر ولايتك
                            </option>

                            {DELIVERY.map((w) => (
                                <option key={w.id} value={w.id}>
                                    {String(w.id).padStart(2, "0")} - {w.name}
                                </option>
                            ))}
                        </select>
                    </Field>

                    {/* DELIVERY TYPE */}

                    <fieldset>
                        <legend className="text-sm font-medium mb-3">
                            كيف تستلم طلبك؟
                        </legend>

                        <div className="grid sm:grid-cols-2 gap-3">

                            <button
                                type="button"
                                disabled={!wilaya}
                                onClick={() =>
                                    setForm((f) => ({
                                        ...f,
                                        delivery: "home",
                                    }))
                                }
                                aria-pressed={delivery === "home"}
                                className={`text-right rounded-2xl border-2 p-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${delivery === "home"
                                    ? "border-[#12100d] bg-white"
                                    : "border-[#d9d2c3] bg-white/60 hover:border-[#12100d]"
                                    }`}
                            >
                                <span className="flex items-center justify-between">
                                    <Truck size={22} />

                                    {delivery === "home" && wilaya && (
                                        <span className="w-6 h-6 rounded-full bg-[#12100d] text-white flex items-center justify-center">
                                            <Check size={14} />
                                        </span>
                                    )}
                                </span>

                                <p className="font-semibold mt-3">
                                    في المنزل
                                </p>

                                <p className="text-sm text-[#6b655b] mt-1">
                                    {wilaya
                                        ? fmt(wilaya.home)
                                        : "اختر الولاية لترى السعر"}
                                </p>
                            </button>

                            <button
                                type="button"
                                disabled={!wilaya || !deskAvailable}
                                onClick={() =>
                                    setForm((f) => ({
                                        ...f,
                                        delivery: "desk",
                                    }))
                                }
                                aria-pressed={delivery === "desk"}
                                className={`text-right rounded-2xl border-2 p-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${delivery === "desk"
                                    ? "border-[#12100d] bg-white"
                                    : "border-[#d9d2c3] bg-white/60 hover:border-[#12100d]"
                                    }`}
                            >
                                <span className="flex items-center justify-between">
                                    <Building2 size={22} />

                                    {delivery === "desk" &&
                                        wilaya &&
                                        deskAvailable && (
                                            <span className="w-6 h-6 rounded-full bg-[#12100d] text-white flex items-center justify-center">
                                                <Check size={14} />
                                            </span>
                                        )}
                                </span>

                                <p className="font-semibold mt-3">
                                    من مكتب التوصيل
                                </p>

                                <p className="text-sm text-[#6b655b] mt-1">
                                    {!wilaya
                                        ? "اختر الولاية لترى السعر"
                                        : deskAvailable
                                            ? `${fmt(wilaya.desk)} في مكتب ولاية ${wilaya.name}`
                                            : "غير متوفر في هذه الولاية"}
                                </p>
                            </button>

                        </div>
                    </fieldset>

                    {/* ADDRESS */}

                    <Field
                        id="address"
                        label={
                            delivery === "home"
                                ? "البلدية والعنوان"
                                : "بلديتك"
                        }
                        hint={
                            delivery === "home"
                                ? "كلما كان العنوان أدق، وصلك الطلب أسرع"
                                : "نرسل طلبك إلى أقرب مكتب في بلديتك"
                        }
                        error={showError("address")}
                        valid={isValid("address")}
                    >
                        <input
                            {...aria("address")}
                            ref={refs.address}
                            className={`${inputBase} ${tone("address")}`}
                            placeholder={
                                delivery === "home"
                                    ? "البلدية، الحي، رقم المنزل"
                                    : "اسم البلدية"
                            }
                            autoComplete="street-address"
                            value={form.address}
                            onChange={set("address")}
                        />
                    </Field>

                    {/* HONEYPOT */}

                    <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={form.website}
                        onChange={set("website")}
                        className="hidden"
                        aria-hidden="true"
                    />

                </div>

                {/* ORDER SUMMARY */}

                <div className="fb-dark rounded-[2rem] bg-[#12100d] text-white p-7 md:p-9 lg:sticky lg:top-28">

                    <h3 className="fb-display text-3xl">
                        طلبك
                    </h3>

                    {/* PRODUCTS */}

                    <ul className="mt-6 space-y-4">

                        {cart.map((item) => (
                            <li
                                key={item.key}
                                className="flex items-center gap-4"
                            >
                                <span className="w-14 h-16 rounded-xl bg-white overflow-hidden shrink-0">
                                    {item.image && (
                                        <img
                                            src={item.image}
                                            alt=""
                                            className="w-full h-full object-contain"
                                            onError={(e) =>
                                                (e.currentTarget.style.display = "none")
                                            }
                                        />
                                    )}
                                </span>

                                <span className="flex-1 min-w-0">
                                    <span className="block font-medium leading-snug">
                                        {item.name}
                                    </span>

                                    <span className="block text-sm text-white/65">
                                        {item.color && `${item.color}، `}
                                        المقاس {item.size}، الكمية{" "}
                                        {item.quantity}
                                    </span>
                                </span>

                                <span className="text-sm font-medium whitespace-nowrap">
                                    {fmt(item.price * item.quantity)}
                                </span>
                            </li>
                        ))}

                    </ul>

                    {/* PRICE DETAILS */}

                    <dl className="mt-7 pt-6 border-t border-white/15 space-y-3 text-[15px]">

                        <div className="flex justify-between">
                            <dt className="text-white/70">
                                القطع
                            </dt>
                            <dd>{fmt(subtotal)}</dd>
                        </div>

                        <div className="flex justify-between">
                            <dt className="text-white/70">
                                التوصيل
                            </dt>
                            <dd>
                                {deliveryPrice === null
                                    ? "يظهر بعد اختيار الولاية"
                                    : fmt(deliveryPrice)}
                            </dd>
                        </div>

                        {wilaya && (
                            <div className="flex justify-between">
                                <dt className="text-white/70">
                                    مدة التوصيل
                                </dt>
                                <dd>{wilaya.time}</dd>
                            </div>
                        )}

                    </dl>

                    {/* TOTAL */}

                    <div className="flex items-end justify-between mt-6 pt-6 border-t border-white/15">

                        <span className="text-white/80">
                            تدفع عند الاستلام
                        </span>

                        <span className="fb-display text-5xl leading-none">
                            {fmt(total)}
                        </span>

                    </div>

                    {/* CUSTOMER RIGHTS */}

                    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#c9a24a]/40 bg-[#c9a24a]/10 px-4 py-3.5">

                        <PackageOpen
                            size={22}
                            className="text-[#c9a24a] shrink-0 mt-0.5"
                        />

                        <p className="text-sm leading-7 text-white/90">
                            <span className="font-semibold text-white">
                                افتح الطلبية قبل أن تدفع.
                            </span>{" "}
                            من حقك فحصها والتأكد منها. إذا أعجبتك تستلمها،
                            وإذا لم تعجبك تعيدها.
                        </p>

                    </div>

                    {/* ERROR */}

                    {status === "error" && (
                        <p
                            role="alert"
                            className="mt-5 text-sm text-[#c9a24a]"
                        >
                            لم يصل الطلب. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.
                        </p>
                    )}

                    {/* SUBMIT BUTTON */}

                    <button
                        type="submit"
                        disabled={status === "sending"}
                        className="mt-6 w-full py-4 rounded-full bg-[#c9a24a] text-[#12100d] font-semibold flex items-center justify-center gap-3 hover:bg-[#dcb95f] transition-colors disabled:opacity-70"
                    >
                        {status === "sending" ? (
                            <>
                                <Loader2
                                    size={18}
                                    className="animate-spin"
                                />
                                جاري إرسال الطلب
                            </>
                        ) : (
                            "أرسل الطلب"
                        )}
                    </button>

                    {/* PROGRESS */}

                    <p
                        className="text-center text-sm text-white/60 mt-3"
                        aria-live="polite"
                    >
                        {doneCount === FIELD_ORDER.length
                            ? "كل شيء جاهز، يمكنك إرسال الطلب"
                            : `أكملت ${doneCount} من ${FIELD_ORDER.length} حقول`}
                    </p>

                </div>

            </form>

        </section>
    );
}