export function dateInPast(daysAgo) {
    return Date.now() - (1000 * 60 * 60 * 24 * daysAgo);
}

export function now() {
    return Date.now();
}