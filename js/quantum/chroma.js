const CHROMA = {
    getChroma(x) {
        if (tmp.qu.pick_chr && !player.qu.chr_get.includes(x)) {
            player.qu.chr_get.push(x)
        }
    },
    gain(i) {
        if (!player.qu.chr_get.includes(i)) return E(0)
        let x = E(1)
        if (tmp.qu.mil_reached[5]) x = x.mul(tmp.preQUGlobalSpeed.max(1).root(2))
        if (hasTree('qu5')) x = x.mul(tmp.supernova.tree_eff.qu5)
        if (hasTree('qu8')) x = x.mul(tmp.supernova.tree_eff.qu8)
        return x
    },
    names: [
        ["紅","熾熱放射性等離子體","f00"],
        ["綠","鈾砹混合體","0f0"],
        ["藍","中子元素-0","66f"],
    ],
    eff: [
        i => {
            let x = i.add(1).log10().add(1).root(3)
            if (hasUpgrade('br',10)) x = x.mul(1.1)
            return x
        },
        i => {
            let x = E(1.01).pow(i.add(1).log10().max(0).pow(0.8))
            if (hasUpgrade('br',7) && (player.qu.rip.active || hasElement(148))) x = x.pow(2)
            if (hasUpgrade('br',10)) x = x.pow(1.1)
            
            let y = hasPrestige(2,4)?i.add(1).log10().root(2).div(250).add(1).pow(-1):E(1)

            return [x,y]
        },
        i => {
            let x = E(1.1).pow(i.add(1).log10().max(0).pow(0.75))
            if (hasUpgrade('br',10)) x = x.pow(1.1)
            return x
        },
    ],
    effDesc: [
        x => {
            return `將時間速度力量提升 ^${format(x)}`
        },
        x => {
            return `將${player.dark.unl ? "奇異級前" : ""}五級層前的要求減少 ${format(x)}x`
            +(hasPrestige(2,4)?`<br>所有奇異級前六級層前增幅弱 ${formatReduction(x[1])}`:"")
        },
        x => {
            return `將挑戰 1-8 的獎勵加強 ${format(x)}x`
        },
    ],
}

const CHROMA_LEN = 3

function updateChromaTemp() {
    for (let x = 0; x < CHROMA_LEN; x++) {
        tmp.qu.chroma_gain[x] = CHROMA.gain(x)
        tmp.qu.chroma_eff[x] = CHROMA.eff[x](player.qu.chroma[x])
    }
}

function updateChromaHTML() {
    tmp.el.qu_theory.setTxt(format(tmp.qu.theories,0))
    tmp.el.qu_theory_div.setDisplay(player.qu.chr_get.length<3)

    for (let x = 0; x < CHROMA_LEN; x++) {
        let id = "chroma_"+x

        tmp.el[id+"_btn"].setClasses({btn: true, locked: !tmp.qu.pick_chr})
        tmp.el[id+"_btn"].setDisplay(!player.qu.chr_get.includes(x))

        tmp.el[id+"_amt"].setTxt(format(player.qu.chroma[x],1)+" "+formatGain(player.qu.chroma[x],tmp.qu.chroma_gain[x]))
        tmp.el[id+"_eff"].setHTML(CHROMA.effDesc[x](tmp.qu.chroma_eff[x]))
    }
}