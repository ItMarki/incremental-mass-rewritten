const TOOLTIP_RES = {
    mass: {
        full: "質量",
        desc() {
            let h = `你已經推了 <b>${formatMass(player.mass)}</b> 的質量。`;

            if (tmp.overflowBefore.mass.gte(tmp.overflow_start.mass[0]))
            h += `<br>（相當於<b>溢出</b>前的 <b>${formatMass(tmp.overflowBefore.mass)}</b>）`;

            if (quUnl())
            h += `
            <br class='line'>你有 <b class='red'>${player.rp.points.format(0)} ${player.rp.points.formatGain(tmp.rp.gain.mul(tmp.preQUGlobalSpeed))}</b> 暴怒力量（量子後）。
            <br class='line'>你有 <b class='yellow'>${player.bh.dm.format(0)} ${player.bh.dm.formatGain(tmp.bh.dm_gain.mul(tmp.preQUGlobalSpeed))}</b> 暗物質（量子後）。
            `;

            return h
        },
    },
    rp: {
        full: "暴怒力量",
        desc() {
            let h = `<i>
            重置之前的功能，可獲得暴怒力量。要求：<b>${formatMass(1e15)}</b>。
            </i>`

            return h
        },
    },
    dm: {
        full: "暗物質",
        desc() {
            let h = `<i>
            重置以往所有功能，獲得暗物質。要求：<b>${format(1e20)}</b>。
            </i>`

            return h
        },
    },
    bh: {
        full: "黑洞",
        desc() {
            let h = `你的黑洞質量是 <b>${formatMass(player.bh.mass)}</b>。`;

            if (tmp.overflowBefore.bh.gte(tmp.overflow_start.bh[0]))
            h += `<br>（相當於<b>溢出</b>前的 <b>${formatMass(tmp.overflowBefore.bh)}</b>）`;

            if (hasCharger(1))
            h += `
            <br class='line'>你的不穩定黑洞質量是 <b class='corrupted_text'>${formatMass(player.bh.unstable)} ${formatGain(player.bh.unstable,UNSTABLE_BH.calcProduction(),true)}</b>。
            `;

            if (quUnl())
            h += `
            <br class='line'>你有 <b class='cyan'>${player.atom.points.format(0)} ${player.atom.points.formatGain(tmp.atom.gain.mul(tmp.preQUGlobalSpeed))}</b> 個原子（量子後）。
            `;

            return h
        },
    },
    atom: {
        full: "原子",
        desc() {
            let h = `<i>
            重置以往所有的功能，獲得原子和夸克。要求：黑洞質量到達 <b>${formatMass(uni(1e100))}</b>。
            </i>`

            return h
        },
    },
    quarks: {
        full: "夸克",
        desc() {
            let h = `你有 <b>${format(player.atom.quarks,0)}</b> 個夸克。`;

            if (tmp.overflowBefore.quark.gte(tmp.overflow_start.quark))
            h += `<br>（相當於<b>溢出</b>前的 <b>${format(tmp.overflowBefore.quark,0)}</b>）`;

            return h
        },
    },
    md: {
        full: "質量膨脹",
        desc() {
            let h = `
            你有 <b>${formatMass(player.md.mass)} ${player.md.mass.formatGain(tmp.md.mass_gain.mul(tmp.preQUGlobalSpeed),true)}</b> 的膨脹質量。
            `

            if (tmp.overflowBefore.dm.gte(tmp.overflow_start.dm))
            h += `<br>（相當於<b>溢出</b>前的 ${formatMass(tmp.overflowBefore.dm)}</b>）`;

            if (player.md.break.active)
            h += `
            <br class='line'>
            你有 <b class='sky'>${player.md.break.energy.format(0)} ${player.md.break.energy.formatGain(tmp.bd.energyGain)}</b> 相對能量。<br>
            你有 <b class='sky'>${formatMass(player.md.break.mass)} ${player.md.break.mass.formatGain(tmp.bd.massGain,true)}</b> 的相對質量。
            `;

            h += `
            <br class='line'><i>
            ${player.md.active?`取消以獲得 ${format(tmp.md.rp_gain)} 相對粒子，或退出膨脹。`:"膨脹質量或取消之。"}<br><br>膨脹質量會執行原子重置，而所有原子前資源和原子力量的獲得量都會減弱到 ^0.8。<br>
            </i>`

            return h
        },
    },
    sn: {
        full: "超新星",
        desc() {
            let h = `
            你有 <b>${player.stars.points.format(0)} ${player.stars.points.formatGain(tmp.stars.gain.mul(tmp.preQUGlobalSpeed))}</b> 個塌縮恆星。
            <br class='line'>
            <i>
            ${"你需要到達 <b>"+format(tmp.supernova.maxlimit)+"</b> 個塌縮恆星才可以變成超新星"}。
            </i>`

            return h
        },
    },
    qu: {
        full: "量子泡沫",
        desc() {
            let h = `<i>
            ${"你需要到達 <b>"+formatMass(mlt(1e4))+"</b> 普通質量才可以"+(QCs.active()?"完成量子挑戰":"量子化")}。
            </i>`

            return h
        },
    },
    br: {
        full: "死亡碎片",
        desc() {
            let h = `<i>
            將維度大撕裂或取消之。
            <br><br>
            你將維度大撕裂時，熵獎勵失效，所有原始素效果都弱 50%（Ε 粒子則失效），[qu2, qu10] 樹升級失效，而且你困在模組為 [10,2,10,10,5,0,2,10] 的量子挑戰中。
            你在大撕裂中會基於你的質量獲得死亡碎片。
            你可以在大撕裂中解鎖各種升級。
            </i>`

            return h
        },
    },
    dark: {
        full: "暗束",
        desc() {
            let h = ``

            if (player.dark.unl) {
                h += `你有 <b>${player.dark.shadow.format(0)} ${player.dark.shadow.formatGain(tmp.dark.shadowGain)}</b> 個暗影。`
                if (tmp.chal14comp) h += `<br>你有 <b>${player.dark.abyssalBlot.format(0)} ${player.dark.abyssalBlot.formatGain(tmp.dark.abGain)}</b> 個深淵之漬。`
                h += `<br class='line'>`
            }

            h += `<i>
            你需要購買<b>鿫（⿹气奧）-118</b> 才可以進入暗界。
            </i>`

            return h
        },
    },
    speed: {
        full: "量子前全局運行速度",
        desc() {
            let h = `<i>
            加快量子前資源生產速度（在膨脹等後適用）。
            </i>`

            return h
        },
    },
    fss: {
        full: "天樞碎片（FSS）",
        desc() {
            let h = `
            你的天樞碎片底數是 <b>${tmp.matters.FSS_base.format(0)}</b>。
            <br class='line'>
            <i>
            你需要到達 <b>${tmp.matters.FSS_req.format(0)}</b> 的 FSS 底數才可以獲得天樞碎片。
            </i>`

            return h
        },
    },
    corrupt: {
        full: "腐蝕碎片",
        desc() {
            let h = `
            你在挑戰 16 中的最佳黑洞質量是 <b>${formatMass(player.dark.c16.bestBH)}</b>。
            <br class='line'>
            <i>
            開始挑戰 16。退出挑戰時，你會基於黑洞質量獲得<b>腐蝕碎片</b>，門檻為 <b>${formatMass('e100')}</b>。<br><br>
            • 你不能獲得暴怒力量和暗物質。所有有色物質的公式失效，但它們會產生其他有色物質。紅物質會生產暗物質。<br>
            • 挑戰 16 前的內容都被腐蝕/禁用（包括級別和重置等級、主升級、元素、中子樹等）。<br>
            • 你困在質量膨脹和黑暗試煉裏，每個符文都有 100 個。<br>
            • 禁用原始素粒子。<br>
            • 量子前全局運行速度一律定為 /100。<br>
            </i>`

            return h
        },
    },
    idk: {
        full: "???",
        desc() {
            let h = `
            我要幹啥？
            <br class='line'>
            <i>
            到達 <b>???</b> 的質量。
            </i>
            `

            return h
        },
    },

    /**
     * desc() {
            let h = ``
            return h
        },
    */
}

function updateTooltipResHTML(start=false) {
    for (let id in TOOLTIP_RES) {
        if (!start && hover_tooltip.id !== id+'_tooltip') continue;

        let tr_data = TOOLTIP_RES[id]
        let tr = tmp.el[id+'_tooltip']

        tr.setTooltip(`<h3>【${tr_data.full}】</h3>`+(tr_data.desc?"<br class='line'>"+tr_data.desc():""))
    }
}