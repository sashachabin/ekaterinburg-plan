const YM_COUNTER = 85861499;

function sendAnalytics(eventName) {
    return window.ym && ym(YM_COUNTER, 'reachGoal', eventName);
}

export default sendAnalytics;