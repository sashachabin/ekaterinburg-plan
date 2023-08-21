const YM_COUNTER = import.meta.env.VITE_YANDEX_METRIKA_API_KEY;

const script = document.createElement('script');
script.innerHTML = `(function (m, e, t, r, i, k, a) { m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) }; m[i].l = 1 * new Date(); k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a) })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym"); ym(${YM_COUNTER}, "init", { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true })`;
document.body.appendChild(script);

const noScript = document.createElement('noscript');
noScript.innerHTML = `<div><img src="https://mc.yandex.ru/watch/${YM_COUNTER}" style="position:absolute; left:-9999px;" alt="" /></div>`;
document.body.appendChild(noScript);

export function sendAnalytics(eventName) {
    return window.ym && ym(YM_COUNTER, 'reachGoal', eventName);
}
