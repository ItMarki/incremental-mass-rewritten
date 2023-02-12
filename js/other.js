var popups = []
var popupIndex = 0

function updatePopupIndex() {
    let i
    for (i = 0; i < popups.length; i++) {
        if (!popups[i]) {
            popupIndex = i
            return
        }
    }
    popupIndex = i
}

function addNotify(text, duration=3) {
    tmp.notify.push({text: text, duration: duration});
    if (tmp.notify.length == 1) updateNotify()
}

function removeNotify() {
    if (tmp.saving > 0 && tmp.notify[0]?tmp.notify[0].text="遊戲儲存中":false) tmp.saving--
    if (tmp.notify.length <= 1) tmp.notify = []
    let x = []
    for (let i = 1; i < tmp.notify.length; i++) x.push(tmp.notify[i])
    tmp.notify = x
    tmp.el.notify.setVisible(false)
    updateNotify()
}

function updateNotify() {
    if (tmp.notify.length > 0) {
        tmp.el.notify.setHTML(tmp.notify[0].text)
        tmp.el.notify.setVisible(true)
        tmp.el.notify.setClasses({hide: false})
        setTimeout(()=>{
            tmp.el.notify.setClasses({hide: true})
            setTimeout(removeNotify, 750)
        }, tmp.notify[0].duration*1000)
    }
}

const POPUP_GROUPS = {
    help: {
        html: `
        <h1>質量</h1><br>
        g（克）：1 g<br>
        kg（公斤）：1,000 g<br>
        tonne（噸）：1,000 kg = 1,000,000 g<br>
        MME（珠穆朗瑪峰質量）：1.619e14 tonne = 1.619e20 g<br>
        M⊕（地球質量）：36,886,967 MME = 5.972e27 g<br>
        M☉（太陽質量）：333,054 M⊕ = 1.989e33 g<br>
        MMWG（銀河系質量）：1.5e12 M☉ = 2.9835e45 g<br>
        uni（宇宙質量）：50,276,520,864 MMWG = 1.5e56 g<br>
        mlt（多元宇宙質量）：1e1e9 uni（對數增長）<br>
        mgv（百萬宇宙質量）：1e15 mlt<br>
        `,
    },
    fonts: {
        // <button class="btn" style="font-family: Comic Sans MS;" onclick="player.options.font = 'Comic Sans MS'">Comic Sans MS</button>
        html: `
            <b>注意</b>：支援漢字的字型以<span style="color: yellow;">黃色文字</span>標記。<br>
            <button class="btn" style="font-family: 'Andy Bold';" onclick="player.options.font = 'Andy Bold'">Andy Bold</button>
            <button class="btn" style="font-family: Arial, Helvetica, sans-ser;" onclick="player.options.font = 'Arial, Helvetica, sans-ser'">Arial</button>
            <button class="btn" style="font-family: Bahnschrift;" onclick="player.options.font = 'Bahnschrift'">Bahnschrift</button>
            <button class="btn" style="font-family: Courier;" onclick="player.options.font = 'Courier'">Courier</button>
            <button class="btn" style="font-family: Cousine;" onclick="player.options.font = 'Cousine'">Cousine</button>
            <button class="btn" style="font-family: 'Flexi IBM VGA False';" onclick="player.options.font = 'Flexi IBM VGA False'">Flexi IBM VGA False</button>
            <button class="btn" style="color: yellow;font-family: GenYoGothic TW;" onclick="player.options.font = 'GenYoGothic TW'">源樣黑體 TW</button>
            <button class="btn" style="color: yellow;font-family: GenYoMin TW;" onclick="player.options.font = 'GenYoMin TW'">源樣明體 TW</button>
            <button class="btn" style="color: yellow;font-family: IMing;" onclick="player.options.font = 'IMing'">一點明體</button>
            <button class="btn" style="font-family: Inconsolata;" onclick="player.options.font = 'Inconsolata'">Inconsolata</button>
            <button class="btn" style="font-family: 'Lucida Handwriting';" onclick="player.options.font = 'Lucida Handwriting'">Lucida Handwriting</button>
            <button class="btn" style="color: yellow;font-family: 'LXGWNeoXiHei';" onclick="player.options.font = 'LXGWNeoXiHei'">霞鶩新晰黑</button>
            <button class="btn" style="color: yellow;font-family: 'LXGWWenKai';" onclick="player.options.font = 'LXGWWenKai'">霞鶩文楷</button>
            <button class="btn" style="font-family: MisekiBitmap;" onclick="player.options.font = 'MisekiBitmap'">美績點陣體</button>
            <button class="btn" style="font-family: Monospace-Typewritter;" onclick="player.options.font = 'Monospace-Typewritter'">Monospace Typewritter</button>
			<button class="btn" style="font-family: 'MS Sans Serif';" onclick="player.options.font = 'MS Sans Serif'">MS Sans Serif</button>
            <button class="btn" style="color: yellow;font-family: 'Noto Sans SC';" onclick="player.options.font = 'Noto Sans SC'">Noto Sans SC</button>
            <button class="btn" style="color: yellow;font-family: 'Noto Sans TC';" onclick="player.options.font = 'Noto Sans TC'">Noto Sans TC</button>
            <button class="btn" style="font-family: 'Nova Mono';" onclick="player.options.font = 'Nova Mono'">Nova Mono</button>
            <button class="btn" style="font-family: 'Retron2000';" onclick="player.options.font = 'Retron2000'">Retron 2000</button>
            <button class="btn" style="font-family: 'Roboto';" onclick="player.options.font = 'Roboto'">Roboto</button>
            <button class="btn" style="font-family: 'Roboto Mono';" onclick="player.options.font = 'Roboto Mono'">Roboto Mono</button>
            <button class="btn" style="font-family: 'Source Serif Pro';" onclick="player.options.font = 'Source Serif Pro'">Source Serif Pro</button>
            <button class="btn" style="color: yellow;font-family: 'Unifont';" onclick="player.options.font = 'Unifont'">Unifont</button>
            <button class="btn" style="font-family: Verdana, Geneva, Tahoma, sans-serif;" onclick="player.options.font = 'Verdana, Geneva, Tahoma, sans-serif'">Verdana</button>
        `,
    },
    notations: {
        html: `
            <button class="btn" onclick="player.options.notation = 'elemental'">元素</button>
            <button class="btn" onclick="player.options.notation = 'eng'">工程記號</button>
			<button class="btn" onclick="player.options.notation = 'inf'">無限</button>
            <button class="btn" onclick="player.options.notation = 'mixed_sc'">混合科學記號</button>
            <button class="btn" onclick="player.options.notation = 'layer'">重置層次</button>
            <button class="btn" onclick="player.options.notation = 'sc'">科學記號</button>
            <button class="btn" onclick="player.options.notation = 'st'">標準</button>
            <button class="btn" onclick="player.options.notation = 'old_sc'">舊式科學記號</button>
            <button class="btn" onclick="player.options.notation = 'omega'">Omega</button>
            <button class="btn" onclick="player.options.notation = 'omega_short'">短 Omega</button>
        `,
    },
    supernova10: {
        html: `
            恭喜！<br><br>你變成了 10 次超新星了！<br>
            你可以手動超新星！<br><br>
            <b>超新星標籤裏解鎖了玻色子！</b>
        `,
        width: 400,
        height: 150,
        otherStyle: {
            'font-size': "14px",
        },
    },
    fermions: {
        html: `
            恭喜！<br><br>你打敗了挑戰10！<br><br>
            <b>超新星標籤裏解鎖了費米子！</b>
        `,
        width: 400,
        height: 150,
        otherStyle: {
            'font-size': "14px",
        },
    },
	qu: {
        html() { return `
            恭喜！<br><br>你完成了挑戰 12 後到達了 ${formatMass(mlt(1e4))} 質量！<br><br>
            <b>你需要量子化！</b>
        `},
        width: 400,
        height: 150,
        otherStyle: {
            'font-size': "14px",
        },
    },
    qus1: {
        html() { return `
            <img src="images/qu_story1.png"><br><br>
            質量在量子化的過程中塌縮了！看來是蒸發了！可是代價是甚麼呢？
        `},
        button: "糟糕了",
        otherStyle: {
            'font-size': "14px",
        },
    },
    qus2: {
        html() { return `
            <img src="images/qu_story2.png"><br><br>
            不用擔心，新的功能會很快解鎖！
        `},
        button: "好",
        otherStyle: {
            'font-size': "14px",
        },
    },
    en: {
        html() { return `
            恭喜！<br><br>你的質量到達了 ${formatMass(mlt(7.5e6))} ！<br><br>
            <b>量子標籤中解鎖了熵！</b>
        `},
        width: 400,
        height: 150,
        otherStyle: {
            'font-size': "14px",
        },
    },
}

function createPopup(text, id, txtButton) {
    if (popups.includes(id)) return

    popups[popupIndex] = id
    updatePopupIndex()

    const popup = document.createElement('div')
    popup.className = 'popup'
    popup.innerHTML = `
    <div>
        ${text}
    </div><br>
    `

    const textButton = document.createElement('button')
    textButton.className = 'btn'
    textButton.innerText = txtButton||"好"
    textButton.onclick = () => {
        popups[popups.indexOf(id)] = undefined
        updatePopupIndex()
        popup.remove()
    }

    popup.appendChild(textButton)

    document.getElementById('popups').appendChild(popup)
}

function createConfirm(text, id, yesFunction, noFunction) {
    if (popups.includes(id)) return

    popups[popupIndex] = id
    updatePopupIndex()

    const popup = document.createElement('div')
    popup.className = 'popup'
    popup.innerHTML = `
    <div>
        ${text}
    </div><br>
    `

    const yesButton = document.createElement('button')
    yesButton.className = 'btn'
    yesButton.innerText = "是"
    yesButton.onclick = () => {
        popups[popups.indexOf(id)] = undefined
        updatePopupIndex()
        if (yesFunction) yesFunction()
        popup.remove()
    }

    const noButton = document.createElement('button')
    noButton.className = 'btn'
    noButton.innerText = "不是"
    noButton.onclick = () => {
        popups[popups.indexOf(id)] = undefined
        updatePopupIndex()
        if (noFunction) noFunction()
        popup.remove()
    }

    popup.appendChild(yesButton)
    popup.appendChild(noButton)

    document.getElementById('popups').appendChild(popup)
}

function createPrompt(text, id, func) {
    if (popups.includes(id)) return

    popups[popupIndex] = id
    updatePopupIndex()

    const popup = document.createElement('div')
    popup.className = 'popup'
    popup.innerHTML = `
    <div>
        ${text}
    </div><br>
    `

    const br = document.createElement("br")

    const input = document.createElement('input')

    const textButton = document.createElement('button')
    textButton.className = 'btn'
    textButton.innerText = "好"
    textButton.onclick = () => {
        popups[popups.indexOf(id)] = undefined
        updatePopupIndex()
        if (func) func(input.value)
        popup.remove()
    }

    popup.appendChild(input)

    popup.appendChild(br)

    popup.appendChild(textButton)

    document.getElementById('popups').appendChild(popup)
}

let SEED = [42421n, 18410740n, 9247923n]

function convertStringIntoAGY(s) {
    let ca = ` abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,?!/<>@#$%^&*()_-+=~№;:'"[]{}|`, cl = BigInt(ca.length), r = 0n, sd = SEED[0], result = ''

    for (let i = BigInt(s.length)-1n; i >= 0n; i--) {
        let q = BigInt(ca.indexOf(s[i])), w = q >= 0n ? cl**(BigInt(s.length)-i-1n)*q : 0

        if (i % 2n == 0n && w % 3n == i % (w % 4n + 2n)) w *= (w % 4n + 2n) * (i + 1n)

        r += w * sd

        sd = (sd + SEED[2]**(i % 3n + i * (q + 2n) % 3n)) % SEED[1]
    }

    while (r > 0n) {
        result += ca[r % cl]

        r /= cl
    }

    return result
}