export function hasCookie(name) {
    return document.cookie.split(';').some((item) => item.trim().startsWith(name));
}

export function deleteCookie(name, path="/") {
    document.cookie = name + "; expires=0; path=" + path + ";";
}

export function setCookie(name, age, path) {
    document.cookie = name + "; max-age=" + age + "; path=" + path + "; secure; samesite;";
}