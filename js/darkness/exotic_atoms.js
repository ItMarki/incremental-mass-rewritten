const MUONIC_ELEM = {
    canBuy(x) {
        if (player.atom.muonic_el.includes(x)) return false
        let upg = this.upgs[x], amt = upg.cs ? player.inf.cs_amount : tmp.exotic_atom.amount

        return amt.gte(upg.cost||EINF)
    },
    buyUpg(x) {
        if (this.canBuy(x)) {
            let upg = this.upgs[x]

            if (upg.cs) player.inf.cs_amount = player.inf.cs_amount.sub(upg.cost)

            player.atom.muonic_el.push(x)
        }
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
                let x = Decimal.pow(hasElement(26,1)?3:2,player.atom.muonic_el.length)
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
            desc: `移除第 4 個暗影獎勵的軟上限。超新星提升 π 介子獲得量。`,
            cost: E(1e42),
            eff() {
                let x = player.supernova.times.div(1e6).add(1)
                return x
            },
            effDesc: x=>formatMult(x),
        },
        {
            desc: `移除 187 號元素的腐化。`,
            cost: E(1e46),
        },
        {
            desc: `移除 FSS 對有色物質的獎勵的腐化。`,
            cost: E(1e54),
        },
        {
            desc: `第 1 個 π 介子獎勵更強。第 247 個榮耀的獎勵提升 π 介子獲得量。`,
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
                return x
            },
            effDesc: x=>"+"+format(x),
        },
        {
            desc: `挑戰 15 的獎勵推遲質量溢出^2。`,
            cost: E(1e111),
            eff() {
                if (!tmp.chal) return E(1)
                let x = hasElement(26,1)?tmp.chal.eff[15].root(2):overflow(tmp.chal.eff[15],10,0.5).pow(2)
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
            desc: `加速器對氬-18 的效果提供極弱的指數加成（在第 1 個溢出後）。`,
            cost: E(1e170),
            eff() {
                let x = player.build.accelerator.amt.add(10).log10()
                return x
            },
            effDesc: x=>"^"+format(x),
        },{
            desc: `原子力量的免費時間速度以對數關係加強宇宙弦。`,
            cost: E(1e270),
            eff() {
                if (!tmp.atom) return E(0)
                let x = tmp.atom.atomicEff.max(1).log10()
                if (hasElement(60,1)) x = x.pow(1.75)
                return x.floor()
            },
            effDesc: x=>"+"+format(x,0),
        },{
            desc: `由 1.798e308 開始，奇異原子提升無限點數獲得量。`,
            cost: E(Number.MAX_VALUE),
            eff() {
                let x = tmp.exotic_atom.amount.div(Number.MAX_VALUE).max(1).log(1.1).add(1)
                return x
            },
            effDesc: x=>formatMult(x),
        },{
            desc: `紅物質的升級更強。`,
            cost: E('e420'),
        },{
            desc: `無限點數總數提升 K 介子和 π 介子的獲得量。`,
            cost: E('e470'),
            eff() {
                let x = player.inf.total.add(1).root(4)
                return x
            },
            effDesc: x=>formatMult(x),
        },{
            desc: `移除 [奇] 獎勵的上限，並恢復它對光子升級 4 的效果。`,
            cost: E('e600'),
        },{
            desc: `質量溢出^1-2 弱 5%。`,
            cost: E('e640'),
        },{
            desc: `每擁有一個無限定理，奇異原子的獎勵強度 +1.25%。`,
            cost: E('e778').mul(7/9),
            eff() {
                let x = player.inf.theorem.mul(.0125)
                return x
            },
            effDesc: x=>"+"+formatPercent(x),
        },{
            desc: `緲子硼-5 的底數增加 1。緲子磷-15 更強。`,
            cost: E('e830'),
        },{
            desc: `增強器溢出^1-2 起點乘以重置底數。`,
            cost: E('e1050'),
            eff() {
                let x = overflow(tmp.prestiges.base.add(1),1e10,0.5,2)
                return x
            },
            effDesc: x=>"推遲 "+formatMult(x),
        },{
            desc: `226 號元素加強至 3x。`,
            cost: E('e1500'),
        },{
            desc: `奇異原子的獎勵強度稍微影響有色物質升級。`,
            cost: E('e1600'),
        },{
            desc: `緲子氫-1 也適用於 K 介子獲得量。`,
            cost: E('e1750'),
        },{
            desc: `挑戰 16 的獎勵也適用於挑戰 9 的獎勵。`,
            cost: E('e1970'),
        },{
            desc: `第 1 個 K 介子獎勵更強。`,
            cost: E('e2200'),
        },{
            desc: `無限前全局運行速度稍微提升腐化恆星的速度。`,
            cost: E('e2600'),
            eff() {
                let x = hasElement(59,1) ? expMult(tmp.preInfGlobalSpeed.max(1),0.5).pow(2) : tmp.preInfGlobalSpeed.max(1).log10().add(1).pow(2)
                return x
            },
            effDesc: x=>formatMult(x),
        },{
            cs: true,
            desc: `緲子催化聚合提升腐化恆星的速度。`,
            cost: E('e20'),
            eff() {
                let x = Decimal.pow(1.5,player.dark.exotic_atom.tier)
                return x
            },
            effDesc: x=>formatMult(x),
        },{
            desc: `挑戰 17 的獎勵的底數增加 1。`,
            cost: E('e3000'),
        },{
            cs: true,
            desc: `超新星不再有塌縮恆星的要求，但它們能自動生產超新星。`,
            cost: E('e34'),
        },{
            desc: `超新星推遲腐化恆星速度的減慢。`,
            cost: E('e3500'),
            eff() {
                let x = player.supernova.times.add(1).overflow(10,0.5)
                return x
            },
            effDesc: x=>"推遲 "+formatMult(x),
        },{
            cs: true,
            desc: `解鎖腐化恆星的另一個效果。`,
            cost: E('e56'),
        },{
            desc: `第 1 個 π 介子獎勵提供指數加成。`,
            cost: E('e7300'),
        },{
            cs: true,
            desc: `塌縮恆星推遲腐蝕之星速度的減慢。`,
            cost: E('e72'),
            eff() {
                let x = player.stars.points.add(1).log10().add(1).log10().add(1)
                if (hasElement(56,1)) x = x.pow(2)
                return x
            },
            effDesc: x=>"推遲 "+formatMult(x),
        },{
            cs: true,
            desc: `移除挑戰 9 的獎勵的第 1 個軟上限。`,
            cost: E('e110'),
        },{
            desc: `每擁有一個無限定理，腐化恆星的速度翻倍。`,
            cost: E('e8100'),
            eff() {
                let x = Decimal.pow(2,player.inf.theorem)
                return x
            },
            effDesc: x=>formatMult(x),
        },{
            cs: true,
            desc: `解鎖腐化恆星的另一個效果。`,
            cost: E('e130'),
        },{
            desc: `聲望稍微提升升華底數的指數。`,
            cost: E('e8600'),
            eff() {
                let x = player.prestiges[3].root(2).div(100)
                return x
            },
            effDesc: x=>"+^"+format(x),
        },{
            desc: `夸克溢出弱 25%。`,
            cost: E('e9200'),
        },{
            desc: `超·級別的最高級別加強超新星生產量。`,
            cost: E('e12100'),
            eff() {
                let x = Decimal.pow(2.5,tmp.beyond_ranks.max_tier)
                return x
            },
            effDesc: x=>formatMult(x),
        },{
            cs: true,
            desc: `腐化恆星稍微提升自己的速度。無限時保留超新星。`,
            cost: E('e150'),
            eff() {
                let x = player.inf.cs_amount.add(1).overflow(10,0.5)
                return x
            },
            effDesc: x=>formatMult(x),
        },{
            desc: `霍金定理的第 5 種獎勵影響黑洞的效果。`,
            cost: E('e14900'),
        },{
            desc: `無限前全局運行速度影響超新星生產。`,
            cost: E('e15900'),
            eff() {
                let x = expMult(tmp.preInfGlobalSpeed.max(1),0.5).pow(2)
                return x
            },
            effDesc: x=>formatMult(x),
        },{
            cs: true,
            desc: `腐化之星稍微推遲自己速度的減慢。`,
            cost: E('e230'),
            eff() {
                let x = player.inf.cs_amount.add(1).log10().add(1).pow(3)
                return x
            },
            effDesc: x=>formatMult(x),
        },{
            desc: `第 2 個 π 介子獎勵稍微影響黑洞溢出^2。`,
            cost: E('e20400'),
            eff() {
                let x = exoticAEff(1,1,E(1)).root(5)
                if (tmp.c16active) x = x.max(1).log10().add(1)
                return x
            },
            effDesc: x=>"^"+format(x),
        },{
            desc: `第 3 個 π 介子獎勵強 50%。`,
            cost: E('e23400'),
        },{
            cs: true,
            desc: `腐化之星升級 1 和 2 的價格除以超新星次數。`,
            cost: E('e440'),
            eff() {
                let x = player.supernova.times.add(1)
                if (hasElement(61,1)) x = x.pow(muElemEff(61))
                return x
            },
            effDesc: x=>"/"+format(x),
        },{
            cs: true,
            desc: `解鎖第 6 個恆星生產器。`,
            cost: E('e625'),
        },{
            desc: `第 2 個十一級層的效果影響高級 FSS。`,
            cost: E('e26900'),
        },{
            desc: `緲子鋯-40 效果翻倍。`,
            cost: E('e33100'),
        },{
            desc: `在挑戰 16 外，不穩定黑洞效果 ^10。`,
            cost: E('e35000'),
        },{
            cs: true,
            desc: `解鎖定理的第 6 種效果。`,
            cost: E('e840'),
        },{
            desc: `緲子砷-33 更強。`,
            cost: E('e91000'),
        },{
            desc: `緲子鉀-19 更強。`,
            cost: E('e95600'),
        },{
            desc: `無限定理加強緲子碘-53。`,
            cost: E('e112800'),
            eff() {
                let x = player.inf.theorem.div(10).add(1).root(2)
                return x
            },
            effDesc: x=>"^"+format(x),
        },{
            cs: true,
            desc: `解鎖第 7 個恆星生產器。`,
            cost: E('e1000'),
        },{
            desc: `移除原始素定理的增幅。所有原始素粒子的加成都會乘自己的等級。`,
            cost: E('e155000'),
        },{
            cs: true,
            desc: `解鎖腐化之星的另一個效果。`,
            cost: E('e1100'),
        },{
            desc: `法向能量推遲腐化之星速度的減慢。`,
            cost: E('e161800'),
            eff() {
                let x = expMult(player.gp_resources[4].add(1),0.5)
                return x
            },
            effDesc: x=>"推遲 "+formatMult(x),
        },{
            cs: true,
            desc: `解鎖第 8 個恆星生產器。`,
            cost: E('e1430'),
        },

        /*
        {
            desc: `待定、`,
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

        if (tmp.brokenInf) u += 2
        if (tmp.tfUnl) u += 6
        if (tmp.ascensions_unl) u += 6
        if (tmp.CS_unl) u += 6
        if (tmp.c18reward) u += 10
        if (tmp.fifthRowUnl) u += 8 + 10

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
    requirement: [E(0),E(5e4),E(1e6),E(1e12),E(1e25),E(1e34),E(1e44),E(1e66),E(1e88),E(1e121),E(1e222),E('e321')],
    req() {
        let t = player.dark.exotic_atom.tier, r = EINF

        if (t.lt(12)) r = this.requirement[t.toNumber()]
        else r = Decimal.pow('e1000',Decimal.pow(1.25,t.sub(12).div(tmp.exotic_atom.req_fp)))

        return r
    },
    tier() {
        if (tmp.exotic_atom.amount.gte(tmp.exotic_atom.req)) {
            player.dark.exotic_atom.tier = player.dark.exotic_atom.tier.add(1)

            if (!hasElement(225)) {
                player.dark.exotic_atom.amount = [E(0),E(0)]

                MATTERS.final_star_shard.reset(true)
            }

            updateExoticAtomsTemp()
        }
    },
    getAmount(a0 = player.dark.exotic_atom.amount[0], a1 = player.dark.exotic_atom.amount[1], floor=true) {
        let x = a0.mul(a1)

        x = x.pow(tmp.dark.abEff.ea||1)

        if (tmp.inf_unl) x = x.pow(theoremEff('atom',4))

        return x
    },
    gain() {
        let xy = E(1)
        if (hasTree('ct16')) xy = xy.mul(treeEff('ct16'))
        if (hasPrestige(3,6)) xy = xy.mul(prestigeEff(3,6))
        if (hasElement(5,1)) xy = xy.mul(muElemEff(5))
        if (hasBeyondRank(3,4)) xy = xy.mul(beyondRankEffect(3,4))
        if (hasInfUpgrade(13)) xy = xy.mul(infUpgEffect(13))
        if (hasElement(22,1)) xy = xy.mul(muElemEff(22))
        if (hasAscension(0,4)) xy = xy.mul(ascensionEff(0,4))

        xy = xy.mul(getFragmentEffect('atom'))

        let x = xy.div(10)
        if (hasPrestige(2,34)) x = x.mul(prestigeEff(2,34))
        if (hasPrestige(1,247)) x = x.mul(prestigeEff(1,247))
        if (hasElement(1,1) && hasElement(30,1)) x = x.mul(muElemEff(1))

        let y = xy.div(20)
        if (hasElement(1,1)) y = y.mul(muElemEff(1))
        if (hasElement(9,1)) y = y.mul(muElemEff(9))
        if (hasElement(12,1)&&hasPrestige(1,247)) y = y.mul(prestigeEff(1,247))

        if (hasPrestige(1,510)) [x,y] = [x.pow(1.1),y.pow(1.1)]

        return [x,y]
    },
    milestones: [
        [
            [a=>{
                let x = hasElement(32,1) ? expMult(a.add(1),1.4) : overflow(a.add(1).root(2),100,0.5)
                return x
            },x=>`腐化碎片獲得量提升 <b>${formatMult(x)}</b>`],
            [a=>{
                let x = a.add(1).log10().div(10).add(1).root(2)
                return x
            },x=>`極高級和元級重置等級推遲 <b>${formatMult(x)}</b>`],
            [a=>{
                let x = a.add(1).log10().div(5).add(1).root(2).softcap(10,0.25,0)
                return x
            },x=>`熵獲得量提升 <b>^${format(x)}</b>`],
            [a=>{
                let x = a.add(1).log10().add(1).pow(2)
                return x
            },x=>`魔王挑戰 1-12 增幅推遲 <b>${formatMult(x)}</b>`],
            [a=>{
                let x = Decimal.pow(0.8725,a.add(1).log10().softcap(20,0.25,0).root(2))
                return x.toNumber()
            },x=>`原子力量效果的軟上限減弱 <b>${formatReduction(x)}</b>`],
            [a=>{
                let x = a.add(10).log10().pow(2).sub(1).div(5e3)
                return x
            },x=>`第 382 個重置等級的獎勵中對塌縮恆星的加成底數，以及 201 號元素對黑洞效果的加成底數增加 <b>+${format(x)}</b>`],
        ],[
            [a=>{
                let x = hasElement(12,1) ? expMult(a.add(1),2.5) : a.add(1).pow(2), y = E(1)
                if (hasElement(39,1)) y = a.add(1).log10().add(1).root(3)
                return [x,y]
            },x=>`不穩定黑洞質量獲得量提升 <b>${formatMult(x[0])}</b>`+(hasElement(39,1)?`，<b>^${format(x[1])}</b>`:'')],
            [a=>{
                let x = a.add(1).pow(3)
                return x.overflow('1e10000',0.5)
            },x=>`黑洞溢出推遲 <b>^${format(x)}</b>`],
            [a=>{
                let x = a.add(1).log10().div(80).add(1).root(2)
                if (hasElement(52,1)) x = x.pow(1.5)
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
            [a=>{
                let x = a.add(1).log10().div(50)
                return x
            },x=>`有色物質指數增加 <b>+${format(x)}</b>`],
        ],
    ],
}

function updateExoticAtomsTemp() {
    let tea = tmp.exotic_atom, t = player.dark.exotic_atom.tier

    for (let i = 1; i <= MUONIC_ELEM.upgs.length-1; i++) {
        let u = MUONIC_ELEM.upgs[i]
        if (u.eff) tmp.elements.mu_effect[i] = u.eff()
    }

    let fp = E(1)

    if (hasAscension(1,7)) fp = fp.div(0.9)

    tea.req_fp = fp

    tea.req = EXOTIC_ATOM.req()

    tea.amount = EXOTIC_ATOM.getAmount()
    tea.gain = EXOTIC_ATOM.gain()

    let s = Decimal.add(1,Math.max(t.sub(12),0)*0.1)

    if (hasPrestige(2,58)) s = s.add(prestigeEff(2,58,0))
    if (hasElement(25,1)) s = s.add(muElemEff(25,0))

    if (tmp.inf_unl) s = s.add(theoremEff('time',4))
    s = s.add(tmp.cs_effect.ea_reward||0)

    tea.strength = s

    let tt = t.min(12).toNumber()

    tea.eff = [[],[]]
    for (let i = 0; i < 2; i++) {
        let m = EXOTIC_ATOM.milestones[i]
        let a = player.dark.exotic_atom.amount[i].pow(s)
        for (let j = 0; j < m.length; j++) if (m[j] && j < Math.floor((tt+1-i)/2)) tea.eff[i][j] = m[j][0](a)
    }
}

function exoticAEff(i,j,def=1) { return tmp.exotic_atom.eff[i][j]||def }

function updateExoticAtomsHTML() {
    let ea = player.dark.exotic_atom, tea = tmp.exotic_atom, t = ea.tier
    let inf_gs = tmp.preInfGlobalSpeed

    tmp.el.mcf_btn.setHTML(`
    緲子催化聚合（MCF）第 <b>${format(t,0)}</b> 階<br>
    ${t.gte(12)?`獎勵強度增加 +10%<br>`:''}
    要求：<b>${tea.req.format(0)}</b> 個奇異原子
    `)
    tmp.el.mcf_btn.setClasses({btn: true, half_full: true, locked: tea.amount.lt(tea.req)})

    tmp.el.ea_div.setDisplay(t.gt(0))
    if (t.gt(0)) {
        let g = EXOTIC_ATOM.getAmount(ea.amount[0].add(tea.gain[0].mul(inf_gs)),ea.amount[1].add(tea.gain[1].mul(inf_gs))).sub(tea.amount), tt = t.min(12).toNumber()

        tmp.el.ext_atom.setHTML(tea.amount.format(0)+" "+tea.amount.formatGain(g))
        tmp.el.ea_strength.setHTML(formatPercent(tea.strength))

        for (let i = 0; i < 2; i++) {
            tmp.el['ea_amt'+i].setHTML(ea.amount[i].format(2)+" "+ea.amount[i].formatGain(tea.gain[i].mul(inf_gs)))

            let h = ""

            for (let j = 0; j < Math.floor((tt+1-i)/2); j++) {
                let m = EXOTIC_ATOM.milestones[i][j]
                if (m) h += (j>0?"<br>":"") + m[1](exoticAEff(i,j))
            }

            tmp.el['ea_milestone_table'+i].setHTML(h)
        }
    }
}