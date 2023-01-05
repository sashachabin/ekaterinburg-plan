/** @type {function(string): Element } */
export function query(selector) {
    return document.querySelector(selector);
}

/** @type {function(string): Array<Element> } */
export function queryAll(selector) {
    return document.querySelectorAll(selector);
}
