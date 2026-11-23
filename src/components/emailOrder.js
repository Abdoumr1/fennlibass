import emailjs from "@emailjs/browser";

// Replace with your values from the EmailJS dashboard
const SERVICE_ID = "service_3e8hoza";
const TEMPLATE_ID = "template_plx0vnl";
const PUBLIC_KEY = "Jg_OErR-o-o_hU1Ag";

const esc = (s) =>
    String(s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

/**
 * Turns the "name | color | size | xQty | price" lines of payload.items
 * into HTML table rows for the email template.
 */
function buildItemsRows(itemsText) {
    const cell = "padding: 8px; border-bottom: 1px solid #eee; text-align: center;";

    return String(itemsText ?? "")
        .split("\n")
        .filter(Boolean)
        .map((line) => {
            const [name, color, size, qty, price] = line
                .split("|")
                .map((s) => s.trim());

            const product = color && color !== "-" ? `${name} (${color})` : name;

            return `<tr>
<td style="${cell}">${esc(product)}</td>
<td style="${cell}">${esc(size)}</td>
<td style="${cell}">${esc((qty || "").replace(/^x/i, ""))}</td>
<td style="${cell}">${esc(price)} DA</td>
</tr>`;
        })
        .join("");
}

/**
 * Sends the order to your inbox through EmailJS.
 * `payload` is the same object you send to Google Sheets.
 * Returns true/false and never throws, so a mail problem
 * cannot break the checkout.
 */
export async function sendOrderEmail(payload) {
    try {
        await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            {
                order_number: payload.orderId,
                order_date: new Date().toLocaleString("fr-FR", {
                    timeZone: "Africa/Algiers",
                }),
                status: "جديد",

                customer_name: payload.name,
                customer_phone: payload.phone,
                customer_wilaya: `${payload.wilayaNumber} - ${payload.wilaya}`,
                customer_address: payload.address,
                delivery_method: payload.deliveryType,
                delivery_duration: payload.deliveryTime || "-",

                items_list: buildItemsRows(payload.items),

                subtotal: payload.subtotal,
                delivery_cost: payload.deliveryPrice,
                total: payload.total,
            },
            { publicKey: PUBLIC_KEY }
        );
        return true;
    } catch (err) {
        console.error("EmailJS error:", err);
        return false;
    }
}