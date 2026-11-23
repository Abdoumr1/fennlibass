export const trackPixel = (event, data = {}, eventID) => {
    if (typeof window === "undefined" || typeof window.fbq !== "function") return;

    if (eventID) {
        window.fbq("track", event, data, { eventID });
    } else {
        window.fbq("track", event, data);
    }
};
