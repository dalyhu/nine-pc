const visibilityState = {
    current: document.visibilityState === 'hidden' ? 'background' : 'foreground',
    initial: 'unknown',
    ready: false,
    lastChangeAt: Date.now(),
    lastStableAt: 0,
    confidence: 'low'
}
function readRaw() {
    return document.visibilityState === 'hidden' ? 'background' : 'foreground'
}

const syncCurrent = () => {
    visibilityState.current = readRaw()
    visibilityState.lastChangeAt = Date.now()
}
document.addEventListener('visibilitychange', syncCurrent, true)

window.addEventListener('pageshow',  syncCurrent, true)
window.addEventListener('focus',  syncCurrent, true)
window.addEventListener('blur',  syncCurrent, true)

export function initVisibilityState(timeout=1500, settleMs=180) {
    return new Promise((resolve) => {
        let done = false
        let settleTimer = 0
        const starAt = Date.now()

        const cleanup = () => {
            document.removeEventListener('visibilitychange', onTriggere, true)
            window.removeEventListener('pageshow', onTriggere, true)
            window.removeEventListener('focus', onTriggere, true)
            window.removeEventListener('blur', onTriggere, true)
            if(settleTimer) clearTimeout(settleTimer)
        }
        const finish = (value: string, confidence='high') => {
            if(done) return;
            done = true
            visibilityState.initial = value
            visibilityState.ready = true
            visibilityState.confidence = confidence
            visibilityState.lastStableAt = Date.now()
            cleanup()
            resolve(visibilityState)
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const schduleSettleCheck = () => {
            if(done) return;
            if(settleTimer) clearTimeout(settleTimer)

            settleTimer = window.setTimeout(() => {
                const age = Date.now() - visibilityState.lastChangeAt
                if(age < settleMs) {
                    schduleSettleCheck()
                    return;
                }
                finish(readRaw(), 'high')
            },settleMs)
        }
        const onTriggere = () => {
            requestAnimationFrame(() => {
                syncCurrent()
                schduleSettleCheck()
            })
        }
        document.addEventListener('visibilitychange', onTriggere, true)
        window.addEventListener('pageshow',  onTriggere, true)
        window.addEventListener('focus',  onTriggere, true)
        window.addEventListener('blur',  onTriggere, true)
        //尝试判定
        onTriggere()
        //超时兜底
        setTimeout(() => {
            if(done) return;
            const total = Date.now() - starAt
            const age = Date.now() - visibilityState.lastChangeAt

            if(total >= timeout && age < settleMs) {
                finish('unknown', 'low')
            } else {
                finish(readRaw(), age >= settleMs ? 'high' : 'low')
            }
        },timeout)
    })
}

export function getVisibilityState(){
    return visibilityState
}

//拦截
export function getVisibilityForRequest() {
    const stableAge = visibilityState.lastStableAt ? Date.now() - visibilityState.lastStableAt :
    Number.MAX_SAFE_INTEGER

    const unstable = !visibilityState.ready || stableAge < 120
    return {
        state: unstable ? 'unknown' : visibilityState.current,
        confidence: unstable ? 'low' : visibilityState.confidence,
        stableAge
    }
}