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
        t（噸）：1,000 kg = 1,000,000 g<br>
        MME（珠穆朗瑪峰質量）：1.619e14 噸 = 1.619e20 g<br>
        M⊕（地球質量）：36,886,967 MME = 5.972e27 g<br>
        M☉（太陽質量）：333,054 M⊕ = 1.989e33 g<br>
        MMWG（銀河系質量）：1.5e12 M☉ = 2.9835e45 g<br>
        uni（宇宙質量）：50,276,520,864 MMWG = 1.5e56 g<br>
        mlt（多元宇宙質量）：1e1e9 uni（對數增長）<br>
        mgv（兆宇宙質量）：1e15 mlt<br>
        giv（吉宇宙質量）：1e15 mgv<br>
        arv^n（第 n 級主宇宙的質量）：1e15 arv^n-1<br>
        `,
    },
    fonts: {
        // <button class="btn" style="font-family: Comic Sans MS;" onclick="player.options.font = 'Comic Sans MS'">Comic Sans MS</button>
        html: `
            <b>提示</b>：以下字型<b>不</b>支援漢字，請謹慎使用。<br>
            <button class="btn" style="font-family: 'Andy Bold';" onclick="player.options.font = 'Andy Bold'">Andy Bold</button>
            <button class="btn" style="font-family: Arial, Helvetica, sans-ser;" onclick="player.options.font = 'Arial, Helvetica, sans-ser'">Arial</button>
            <button class="btn" style="font-family: Bahnschrift;" onclick="player.options.font = 'Bahnschrift'">Bahnschrift</button>
            <button class="btn" style="font-family: Courier;" onclick="player.options.font = 'Courier'">Courier</button>
            <button class="btn" style="font-family: Cousine;" onclick="player.options.font = 'Cousine'">Cousine</button>
            <button class="btn" style="font-family: 'Flexi IBM VGA False';" onclick="player.options.font = 'Flexi IBM VGA False'">Flexi IBM VGA False</button>
            <button class="btn" style="font-family: Inconsolata;" onclick="player.options.font = 'Inconsolata'">Inconsolata</button>
            <button class="btn" style="font-family: 'Lato';" onclick="player.options.font = 'Lato'">Lato</button>
            <button class="btn" style="font-family: 'Lunasima';" onclick="player.options.font = 'Lunasima'">Lunasima</button>
            <button class="btn" style="font-family: 'Lucida Handwriting';" onclick="player.options.font = 'Lucida Handwriting'">Lucida Handwriting</button>
            <button class="btn" style="font-family: Monospace-Typewritter;" onclick="player.options.font = 'Monospace-Typewritter'">Monospace Typewritter</button>
			<button class="btn" style="font-family: 'MS Sans Serif';" onclick="player.options.font = 'MS Sans Serif'">MS Sans Serif</button>
            <button class="btn" style="font-family: 'Nova Mono';" onclick="player.options.font = 'Nova Mono'">Nova Mono</button>
            <button class="btn" style="font-family: 'Nunito';" onclick="player.options.font = 'Nunito'">Nunito</button>
            <button class="btn" style="font-family: 'Retron2000';" onclick="player.options.font = 'Retron2000'">Retron 2000</button>
            <button class="btn" style="font-family: 'Roboto';" onclick="player.options.font = 'Roboto'">Roboto</button>
            <button class="btn" style="font-family: 'Roboto Mono';" onclick="player.options.font = 'Roboto Mono'">Roboto Mono</button>
            <button class="btn" style="font-family: 'Source Sans Pro';" onclick="player.options.font = 'Source Sans Pro'">Source Sans Pro</button>
            <button class="btn" style="font-family: 'Source Serif Pro';" onclick="player.options.font = 'Source Serif Pro'">Source Serif Pro</button>
            <button class="btn" style="font-family: Verdana, Geneva, Tahoma, sans-serif;" onclick="player.options.font = 'Verdana, Geneva, Tahoma, sans-serif'">Verdana</button>
            <hr>
            <b>提示</b>：以下字型皆支援漢字。<br>
            <button class="btn" style="font-family: GenYoGothic TW;" onclick="player.options.font = 'GenYoGothic TW'">源樣黑體 TW</button>
            <button class="btn" style="font-family: GenYoMin TW;" onclick="player.options.font = 'GenYoMin TW'">源樣明體 TW</button>
            <button class="btn" style="font-family: IMing;" onclick="player.options.font = 'IMing'">一點明體</button>
            <button class="btn" style="font-family: KingHwa;" onclick="player.options.font = 'KingHwa'">京華老宋体</button>
            <button class="btn" style="font-family: 'LXGWMarkerGothic';" onclick="player.options.font = 'LXGWMarkerGothic'">霞鶩漫黑</button>
            <button class="btn" style="font-family: 'LXGWNeoXiHei';" onclick="player.options.font = 'LXGWNeoXiHei'">霞鶩新晰黑</button>
            <button class="btn" style="font-family: 'LXGWWenKai';" onclick="player.options.font = 'LXGWWenKai'">霞鶩文楷</button>
            <button class="btn" style="font-family: 'LXGWWenKaiGB';" onclick="player.options.font = 'LXGWWenKaiGB'">霞鶩文楷 GB</button>
            <button class="btn" style="font-family: MisekiBitmap;" onclick="player.options.font = 'MisekiBitmap'">美績點陣體</button>
            <button class="btn" style="font-family: 'Noto Sans JP';" onclick="player.options.font = 'Noto Sans JP'">Noto Sans JP</button>
            <button class="btn" style="font-family: 'Noto Sans SC';" onclick="player.options.font = 'Noto Sans SC'">Noto Sans SC</button>
            <button class="btn" style="font-family: 'Noto Sans TC';" onclick="player.options.font = 'Noto Sans TC'">Noto Sans TC</button>
            <button class="btn" style="font-family: 'Unifont';" onclick="player.options.font = 'Unifont'">Unifont</button>
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

const QUOTES = [
    null,
    `
    <h2>第 1 章：第一次舉重</h2><br>
    <img class='quote' src='images/quotes/1.png'><br>
    你舉重的旅途始於足下。你能獲得多少質量？
    `,`
    <h2>第 2 章：暴怒力量</h2><br>
    <img class='quote' src='images/quotes/2.png'><br>
    你怒不可遏，想要節省能量。你少出力氣的同時，體格也更強了。
    `,`
    <h2>第 3 章：黑洞</h2><br>
    <img class='quote' src='images/quotes/3.png'><br>
    你遇到了宇宙的奧秘。力氣太強，形成了一個黑洞！
    `,`
    <h2>第 4 章：原子</h2><br>
    <img class='quote' src='images/quotes/4.png'><br>
    你發現了原子！你分解它時，找到一個物理奇跡：重力。它能幫你一手！
    `,`
    <h2>第 5 章：超新星誕生</h2><br>
    <img class='quote' src='images/quotes/5.png'><br>
    舊的恆星塌縮殆盡，新的恆星冉冉升起。中子星都像是古代的產物了……
    `,`
    <h2>第 6 章：輻射</h2><br>
    <img class='quote' src='images/quotes/6.png'><br>
    恆星照耀時，你尋根究底：輻射。
    `,`
    <h2>第 7 章：走向量子</h2><br>
    <img class='quote' src='images/quotes/7.png'><br>
    質量已經塌縮成量子規模了！祝你好運！
    `,`
    <h2>第 8 章：撕裂宇宙</h2><br>
    <img class='quote' src='images/quotes/8.png'><br>
    時空都在你面前撕裂！
    `,`
    <h2>第 9 章：困在黑暗</h2><br>
    <img class='quote' src='images/quotes/9.png'><br>
    你讓黑暗擴散了。是時候研究物質之謎吧！
    `,`
    <h2>第 10 章：腐化</h2><br>
    <img class='quote' src='images/quotes/10.png'><br>
    最後挑戰迎面而來。祝你成功！
    `,`
    <h2>第 11 章：無限</h2><br>
    <img class='quote' src='images/quotes/11.png'><br>
    至此，你已成神。
    `,`
    <h2>第 12 章：打破無限</h2><br>
    <img class='quote' src='images/quotes/12.png'><br>
    你超越無限時，感到自己無所不能。
    `,
]

function addQuote(i, debug=false) {
    if (!debug) {
        if (player.quotes.includes(i)) return;

        player.quotes.push(i)
    }

    createPopup(QUOTES[i],'quote'+i,`Let's Go!`)
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

function keyEvent(e) {
    let k = e.keyCode

    // console.log(k)

    if (k == 38 || k == 40) {
        let v = k == 40 ? 1 : -1, t = tmp.tab, s = t

        while (true) {
            t += v
            tt = TABS[1][t]
            if (!tt) {
                tmp.tab = s
                return
            }
            else if (!tt.unl || tt.unl()) {
                tmp.tab = t
                return
            }
        }
    } else if (k == 37 || k == 39) {
        if (!TABS[2][tmp.tab]) return

        let v = k == 39 ? 1 : -1, t = tmp.stab[tmp.tab], s = t

        while (true) {
            t += v
            tt = TABS[2][tmp.tab][t]
            if (!tt) {
                tmp.stab[tmp.tab] = s
                return
            }
            else if (!tt.unl || tt.unl()) {
                tmp.stab[tmp.tab] = t
                return
            }
        }
    }
}

function hideNavigation(i) { player.options.nav_hide[i] = !player.options.nav_hide[i]; updateNavigation() }

function updateNavigation() {
    let ids = [["nav_left_hider","tabs"],["nav_right_hider","resources_table"]]
    let w = 450

    for (i in player.options.nav_hide) {
        let h = player.options.nav_hide[i]

        tmp.el[ids[i][0]].setClasses({toggled: h})
        tmp.el[ids[i][1]].setDisplay(!h)
        if (h) w -= i == 0 ? 198 : 248
    }

    let p = `calc(100% - ${w}px)`

    tmp.el.main_app.changeStyle('width',p)
    tmp.el.nav_btns.changeStyle('width',p)
}

function setupStatsHTML() {
    let h = ""

    for (let i in RANKS.names) {
        h += `<div id="stats_${RANKS.names[i]}_btn" style="width: 145px"><button class="btn_tab" onclick="player.ranks_reward = ${i}">${RANKS.fullNames[i]}</button></div>`
    }

    new Element("ranks_reward_btn").setHTML(h)

    h = ""

    for (let i in SCALE_TYPE) {
        h += `<div id="stats_${SCALE_TYPE[i]}_btn" style="width: 145px"><button class="btn_tab" onclick="player.scaling_ch = ${i}">${FULL_SCALE_NAME[i]}</button></div>`
    }

    new Element("scaling_btn").setHTML(h)

    h = ""

    for (let i in PRESTIGES.names) {
        h += `<div id="stats_${PRESTIGES.names[i]}_btn" style="width: 145px"><button class="btn_tab" onclick="player.pres_reward = ${i}">${PRESTIGES.fullNames[i]}</button></div>`
    }

    new Element("pres_reward_btn").setHTML(h)

    h = ""

    for (let i in ASCENSIONS.names) {
        h += `<div id="stats_${ASCENSIONS.names[i]}_btn" style="width: 145px"><button class="btn_tab" onclick="player.asc_reward = ${i}">${ASCENSIONS.fullNames[i]}</button></div>`
    }

    new Element("asc_reward_btn").setHTML(h)
}

/*
ranks_reward: 0,
pres_reward: 0,
scaling_ch: 0,
*/

function updateStatsHTML() {
    if (tmp.stab[1] == 0) for (let i in RANKS.names) {
        tmp.el[`stats_${RANKS.names[i]}_btn`].setDisplay(player.ranks[RANKS.names[i]].gt(0))
    }
    else if (tmp.stab[1] == 1) for (let i in SCALE_TYPE) {
        tmp.el[`stats_${SCALE_TYPE[i]}_btn`].setDisplay(tmp.scaling[SCALE_TYPE[i]].length>0)
    }
    else if (tmp.stab[1] == 2) for (let i in PRESTIGES.names) {
        tmp.el[`stats_${PRESTIGES.names[i]}_btn`].setDisplay(player.prestiges[i].gt(0))
    }
    else if (tmp.stab[1] == 4) for (let i in ASCENSIONS.names) {
        tmp.el[`stats_${ASCENSIONS.names[i]}_btn`].setDisplay(player.ascensions[i].gt(0))
    }
}