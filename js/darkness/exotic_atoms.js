const MUONIC_ELEM = {
    canBuy(x) {
        if (player.atom.muonic_el.includes(x)) return false
        return tmp.exotic_atom.amount.gte(this.upgs[x].cost||EINF)
    },
    buyUpg(x) {
        if (this.canBuy(x)) player.atom.muonic_el.push(x)
    },
    upgs: [
        null,
        {
            desc: `不穩定黑洞質量提升 π 介子獲得量。`,
            cost: E(1000),
            eff() {
                let x = player.bh.unstable.add(1).root(3)
                return x
            },
            effDesc: x=>formatMult(x),
        },
        {
            desc: `移除費米子階的所有元級前增幅。`,
            cost: E(1e5),
        },
        {
            desc: `你可以在費米子外自動獲得所有元費米子階。`,
            cost: E(1e10),
        },
        {
            desc: `在挑戰 16 中，有色物質獲得量 ^1.1。挑戰 16 外，有色物質獲得量 ^1.05。`,
            cost: E(1e13),
        },
        {
            desc: `每購買一個緲子元素，K 介子和 π 介子獲得量翻倍。`,
            cost: E(1e15),
            eff() {
                let x = Decimal.pow(2,player.atom.muonic_el.length)
                return x
            },
            effDesc: x=>formatMult(x),
        },
        {
            desc: `挑戰 1-15 的完成次數提升賦色子獲得量，此效果不受中子元素-0 影響。`,
            cost: E(1e20),
            eff() {
                let c16 = tmp.c16active
                let x = E(1)
                for (let i = 1; i <= 15; i++) x = x.mul(Decimal.pow(c16?1.25:1.1,player.chal.comps[i].root(2)))
                return x
            },
            effDesc: x=>formatMult(x),
        },
        {
            desc: `你可以在黑暗試煉外自動獲得西里爾符文、德國符文和瑞典符文，而且它們不會影響黑暗試煉的削弱。`,
            cost: E(1e23),
        },
        {
            desc: `挑戰 9 的效果軟限制弱 1%。`,
            cost: E(1e32),
        },
        {
            desc: `移除暗影的第四個獎勵的軟上限。超新星提升 π 介子獲得量。`,
            cost: E(1e42),
            eff() {
                let x = player.supernova.times.div(1e6).add(1)
                return x
            },
            effDesc: x=>formatMult(x),
        },
        {
            desc: `移除第 187 個元素的腐化。`,
            cost: E(1e46),
        },
        {
            desc: `移除 FSS 對有色物質的獎勵的腐化。`,
            cost: E(1e54),
        },
        {
            desc: `π 介子的第一個獎勵更強。第 247 榮耀的獎勵提升 π 介子獲得量。`,
            cost: E(1e64),
        },
        {
            desc: `熾熱放射性等離子體更強。`,
            cost: E(1e81),
        },
        {
            desc: `天樞碎片加強有色物質公式。`,
            cost: E(1e100),
            eff() {
                let x = player.dark.matters.final.root(2).div(5)
                return x.toNumber()
            },
            effDesc: x=>"+"+format(x),
        },
        {
            desc: `挑戰 15 的獎勵推遲質量溢出^2。`,
            cost: E(1e111),
            eff() {
                if (!tmp.chal) return E(1)
                let x = overflow(tmp.chal.eff[15],10,0.5).pow(2)
                return x
            },
            effDesc: x=>"^"+format(x),
        },{
            desc: `維度質量影響預選理論的等級。`,
            cost: E(1e130),
        },{
            desc: `量子化次數提升無限點數獲得量。恢復 [陶子] 的效果，但改變它的公式。`,
            cost: E(1e150),
            eff() {
                let x = player.qu.times.add(1).log10().add(1)
                return x
            },
            effDesc: x=>formatMult(x),
        },{
            desc: `加速器對氬-18 的效果提供極弱的指數加成（在第一個溢出後）。`,
            cost: E(1e170),
            eff() {
                let x = player.accelerator.add(10).log10()
                return x
            },
            effDesc: x=>"^"+format(x),
        },

        /*
        {
            desc: `Placeholder.`,
            cost: EINF,
            eff() {
                let x = E(1)
                return x
            },
            effDesc: x=>formatMult(x),
        },
        */
    ],
    getUnlLength() {
        let u = 11
        if (tmp.inf_unl) u += 4
        if (hasInfUpgrade(9)) u += 3
        return u
    },
}

function muElemEff(x,def=1) { return tmp.elements.mu_effect[x]||def }

function changeElemLayer() {
    player.atom.elemLayer = (player.atom.elemLayer+1)%2
    updateMuonSymbol()
}

function updateMuonSymbol(start=false) {
    let et = player.atom.elemTier, elayer = player.atom.elemLayer

    if (!start) {
        let tElem = tmp.elements

        tElem.ts = ELEMENTS.exp[et[elayer]-1]
        tElem.te = ELEMENTS.exp[et[elayer]]
        tElem.tt = tElem.te - tElem.ts

        updateElementsHTML()
    }

    document.documentElement.style.setProperty('--elem-symbol-size',["18px","16px"][elayer])

    let divs = document.getElementsByClassName('muon-symbol')
    let e = ["","µ"][elayer]
    for (i in divs) {
        divs[i].textContent = e
    }
}

const EXOTIC_ATOM = {
    requirement: [E(0),E(5e4),E(1e6),E(1e12),E(1e25),E(1e34),E(1e44),E(1e66),E(1e88),E(1e121),E(1e222)],
    req() {
        let t = player.dark.exotic_atom.tier
        let r = this.requirement[t]||EINF

        return r
    },
    tier() {
        if (tmp.exotic_atom.amount.gte(tmp.exotic_atom.req)) {
            player.dark.exotic_atom.tier++

            player.dark.exotic_atom.amount = [E(0),E(0)]
            MATTERS.final_star_shard.reset(true)

            updateExoticAtomsTemp()
        }
    },
    getAmount(a0 = player.dark.exotic_atom.amount[0], a1 = player.dark.exotic_atom.amount[1], floor=true) {
        let x = a0.mul(a1)

        x = x.pow(tmp.dark.abEff.ea||1)

        return x
    },
    gain() {
        let xy = E(1)
        if (hasTree('ct16')) xy = xy.mul(treeEff('ct16'))
        if (hasPrestige(3,6)) xy = xy.mul(prestigeEff(3,6))
        if (hasElement(5,1)) xy = xy.mul(muElemEff(5))
        if (hasBeyondRank(3,4)) xy = xy.mul(beyondRankEffect(3,4))
        if (hasInfUpgrade(13)) xy = xy.mul(infUpgEffect(13))

        let x = xy.div(10)
        if (hasPrestige(2,34)) x = x.mul(prestigeEff(2,34))
        if (hasPrestige(1,247)) x = x.mul(prestigeEff(1,247))

        let y = xy.div(20)
        if (hasElement(1,1)) y = y.mul(muElemEff(1))
        if (hasElement(9,1)) y = y.mul(muElemEff(9))
        if (hasElement(12,1)&&hasPrestige(1,247)) y = y.mul(prestigeEff(1,247))

        return [x,y]
    },
    milestones: [
        [
            [a=>{
                let x = overflow(a.add(1).root(2),100,0.5)
                return x
            },x=>`將腐化碎片獲得量提升 <b>${formatMult(x)}</b>`],
            [a=>{
                let x = a.add(1).log10().div(10).add(1).root(2)
                return x
            },x=>`超高級和元級重置等級推遲 <b>${formatMult(x)}</b>`],
            [a=>{
                let x = a.add(1).log10().div(5).add(1).root(2)
                return x
            },x=>`熵獲得量提升 <b>^${format(x)}</b>`],
            [a=>{
                let x = a.add(1).log10().add(1).pow(2)
                return x.toNumber()
            },x=>`魔王挑戰 1-12 增幅推遲 <b>${formatMult(x)}</b>`],
            [a=>{
                let x = Decimal.pow(0.8725,a.add(1).log10().softcap(20,0.25,0).root(2))
                return x.toNumber()
            },x=>`原子力量效果的軟上限減弱 <b>${formatReduction(x)}</b>`],
            [a=>{
                let x = a.add(10).log10().pow(2).sub(1).div(5e3)
                return x.toNumber()
            },x=>`將第 382 個重置等級的獎勵中對塌縮恆星的加成底數，以及第 201 個元素對黑洞效果的加成底數增加 <b>+${format(x)}</b>`],
        ],[
            [a=>{
                let x = hasElement(12,1) ? expMult(a.add(1),2.5) : a.add(1).pow(2)
                return x
            },x=>`不穩定黑洞質量獲得量提升 <b>${formatMult(x)}</b>`],
            [a=>{
                let x = a.add(1).pow(3)
                return x
            },x=>`黑洞溢出推遲 <b>^${format(x)}</b>`],
            [a=>{
                let x = a.add(1).log10().div(80).add(1).root(2)
                return x
            },x=>`FSS 的底數提升 ^<b>${format(x)}</b>`],
            [a=>{
                let x = a.add(1).log10().div(10).add(1).root(2)
                return x
            },x=>`宇宙弦力量提升 ^<b>${format(x)}</b>`],
            [a=>{
                let x = a.add(1).ssqrt().div(50)
                return isNaN(x)?E(0):x
            },x=>`平行擠壓器的力量提升 <b>+${format(x)}</b>`],
        ],
    ],
}

function updateExoticAtomsTemp() {
    let tea = tmp.exotic_atom, t = player.dark.exotic_atom.tier

    for (let i = 1; i <= MUONIC_ELEM.upgs.length-1; i++) {
        let u = MUONIC_ELEM.upgs[i]
        if (u.eff) tmp.elements.mu_effect[i] = u.eff()
    }

    tea.req = EXOTIC_ATOM.req()

    tea.amount = EXOTIC_ATOM.getAmount()
    tea.gain = EXOTIC_ATOM.gain()

    tea.eff = [[],[]]
    for (let i = 0; i < 2; i++) {
        let m = EXOTIC_ATOM.milestones[i]
        let a = player.dark.exotic_atom.amount[i]
        for (let j = 0; j < m.length; j++) if (m[j] && j < Math.floor((t+1-i)/2)) tea.eff[i][j] = m[j][0](a)
    }
}

function exoticAEff(i,j,def=1) { return tmp.exotic_atom.eff[i][j]||def }

function updateExoticAtomsHTML() {
    let ea = player.dark.exotic_atom, tea = tmp.exotic_atom, t = ea.tier
    let inf_gs = tmp.preInfGlobalSpeed

    tmp.el.mcf_btn.setHTML(`
    緲子催化聚合（MCF）第 <b>${format(t,0)}</b> 階<br>
    要求：<b>${tea.req.format(0)}</b> 個奇異原子
    `)
    tmp.el.mcf_btn.setClasses({btn: true, half_full: true, locked: tea.amount.lt(tea.req)})

    tmp.el.ea_div.setDisplay(t>0)
    if (t>0) {
        let g = EXOTIC_ATOM.getAmount(ea.amount[0].add(tea.gain[0].mul(inf_gs)),ea.amount[1].add(tea.gain[1].mul(inf_gs))).sub(tea.amount)

        tmp.el.ext_atom.setHTML(tea.amount.format(0)+" "+tea.amount.formatGain(g))

        for (let i = 0; i < 2; i++) {
            tmp.el['ea_amt'+i].setHTML(ea.amount[i].format(2)+" "+ea.amount[i].formatGain(tea.gain[i].mul(inf_gs)))

            let h = ""

            for (let j = 0; j < Math.floor((t+1-i)/2); j++) {
                let m = EXOTIC_ATOM.milestones[i][j]
                if (m) h += (j>0?"<br>":"") + m[1](exoticAEff(i,j))
            }

            tmp.el['ea_milestone_table'+i].setHTML(h)
        }
    }
}