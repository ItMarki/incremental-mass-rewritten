function addNotify(text, duration=3) {
    tmp.notify.push({text: text, duration: duration});
    if (tmp.notify.length == 1) updateNotify()
}

function removeNotify() {
    if (tmp.saving > 0 && tmp.notify[0]?tmp.notify[0].text="Game Saving":false) tmp.saving--
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
        setTimeout(_=>{
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
        kg（千克）：1,000 g<br>
        tonne（噸）：1,000 kg = 1,000,000 g<br>
        MME（珠穆朗瑪峰質量）：1.619e14 tonne = 1.619e20 g<br>
        M⊕（地球質量）：36,886,967 MME = 5.972e27 g<br>
        M☉（太陽質量）：333,054 M⊕ = 1.989e33 g<br>
        MMWG（銀河系質量）：1.5e12 M☉ = 2.9835e45 g<br>
        uni（宇宙質量）：50,276,520,864 MMWG = 1.5e56 g<br>
        mlt（多元宙質量）：1e1e9 uni<br>
        `,
    },
    fonts: {
        html: `
            <button class="btn" style="font-family: 'Andy Bold';" onclick="player.options.font = 'Andy Bold'">Andy Bold</button>
            <button class="btn" style="font-family: Arial, Helvetica, sans-ser;" onclick="player.options.font = 'Arial, Helvetica, sans-ser'">Arial</button>
            <button class="btn" style="font-family: Bahnschrift;" onclick="player.options.font = 'Bahnschrift'">Bahnschrift</button>
            <button class="btn" style="font-family: Comic Sans MS;" onclick="player.options.font = 'Comic Sans MS'">Comic Sans MS</button>
            <button class="btn" style="font-family: Courier;" onclick="player.options.font = 'Courier'">Courier</button>
            <button class="btn" style="font-family: Cousine;" onclick="player.options.font = 'Cousine'">Cousine</button>
            <button class="btn" style="font-family: 'Flexi IBM VGA False';" onclick="player.options.font = 'Flexi IBM VGA False'">Flexi IBM VGA False</button>
            <button class="btn" style="font-family: Inconsolata;" onclick="player.options.font = 'Inconsolata'">Inconsolata</button>
            <button class="btn" style="font-family: 'Lucida Handwriting';" onclick="player.options.font = 'Lucida Handwriting'">Lucida Handwriting</button>
            <button class="btn" style="font-family: Monospace-Typewritter;" onclick="player.options.font = 'Monospace-Typewritter'">Monospace Typewritter</button>
			<button class="btn" style="font-family: 'MS Sans Serif';" onclick="player.options.font = 'MS Sans Serif'">MS Sans Serif</button>
            <button class="btn" style="font-family: 'Nova Mono';" onclick="player.options.font = 'Nova Mono'">Nova Mono</button>
            <button class="btn" style="font-family: 'Retron2000';" onclick="player.options.font = 'Retron2000'">Retron 2000</button>
            <button class="btn" style="font-family: 'Roboto Mono';" onclick="player.options.font = 'Roboto Mono'">Roboto Mono</button>
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
            質量在量子化的過程中塌縮了！看來是蒸發了！但代價是什麼呢？
        `},
        button: "我去",
        otherStyle: {
            'font-size': "14px",
        },
    },
    qus2: {
        html() { return `
            <img src="images/qu_story2.png"><br><br>
            不用擔心，新的功能會很快到達！
        `},
        button: "好",
        otherStyle: {
            'font-size': "14px",
        },
    },
}

function addPopup(data) {
    tmp.popup.push({
        html: typeof data.html == "function" ? data.html() : data.html||"",
        button: data.button||"好",
        callFunctions: data.callFunction?function() {removePopup();data.callFunctions()}:removePopup,

        width: data.width||600,
        height: data.height||400,
        otherStyle: data.otherStyle||{},
    })
    updatePopup()
}

function updatePopup() {
    tmp.el.popup.setDisplay(tmp.popup.length > 0)
    if (tmp.popup.length > 0) {
        tmp.el.popup_html.setHTML(tmp.popup[0].html)
        tmp.el.popup_html.changeStyle("height", tmp.popup[0].height-35)
        tmp.el.popup_button.setHTML(tmp.popup[0].button)
        tmp.el.popup.changeStyle("width", tmp.popup[0].width)
        tmp.el.popup.changeStyle("height", tmp.popup[0].height)
        for (let x in tmp.popup[0].otherStyle) tmp.el.popup_html.changeStyle(x, tmp.popup[0].otherStyle[x])
    }
}

function removePopup() {
    if (tmp.popup.length <= 1) tmp.popup = []
    let x = []
    for (let i = 1; i < tmp.popup.length; i++) x.push(tmp.popup[i])
    tmp.popup = x
    updatePopup()
}