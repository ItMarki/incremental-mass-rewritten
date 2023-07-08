const CHARGERS = [
    {
        req: E(1e100),
        cost: E(3),
        desc: `
        所有有色物質獲得量 x1e10，黑洞質量獲得量 ^2。
        `,
    },{
        req: E('e1000'),
        cost: E(1000),
        desc: `
        解鎖不穩定黑洞，作用是加強普通黑洞。（見黑洞標籤）
        `,
    },{
        req: E('e4500'),
        cost: E(15000),
        desc: `
        不穩定黑洞的效果強 50%（在溢出之後）。
        `,
    },{
        req: E('e30000'),
        cost: E(1e7),
        desc: `
        移除超新星的所有元級前增幅。更換 [微中子] 的效果。重新啟動但更換挑戰 5 的獎勵。
        `,
    },{
        req: E('e33000'),
        cost: E(5e8),
        desc: `
        大幅加強暗影的第 1 個獎勵。移除時間速度的所有增幅，但是移除 [陶子] 的效果。
        `,
    },{
        req: E('e89000'),
        cost: E(5e10),
        desc: `
        在元素標籤裏解鎖奇異元素，並解鎖新的元素層。
        `,
    },{
        req: E('ee6'),
        cost: E(1e26),
        desc: `
        移除黑洞壓縮器的所有元級前增幅，[陶微中子] 的效果不再減少黑洞壓縮器的價格。黑洞壓縮器在挑戰 16 中便宜 1,000,000x。
        `,
    },{
        req: E('e1.6e6'),
        cost: E(5e30),
        desc: `
        移除宇宙射線的所有增幅。[陶微中子] 恢復減少黑洞壓縮器的價格的效果，但效果大幅減弱。
        `,
    },{
        req: E('e3.9e9'),
        cost: E(1e270),
        desc: `
        移除層的所有增幅，但鈾砹混合體的第 1 個效果不再影響它。層在挑戰 16 中便宜 500x。
        `,
    },{
        req: E('e4e10'),
        cost: E('e400'),
        desc: `
        移除第 40、64、67、150、199、200 和 204 個元素的腐化。
        `, // 40,64,67,150,199,200,204
    },
]

const UNSTABLE_BH = {
    gain() {
        let x = tmp.unstable_bh.fvm_eff.eff||E(1)

        let ea=exoticAEff(1,0)

        x = x.mul(ea[0])

        x = x.pow(getFragmentEffect('bh'))
        if (hasElement(39,1)) x = x.pow(ea[1])

        return x
    },
    getProduction(x,gain) {

        return Decimal.pow(10,x.max(0).root(2*tmp.unstable_bh.p)).add(gain).log(10).pow(2*tmp.unstable_bh.p)
    },
    calcProduction() {
        let bh = player.bh.unstable

        return this.getProduction(bh,tmp.unstable_bh.gain.mul(tmp.preInfGlobalSpeed)).sub(bh)
    },
    effect() {
        let x = player.bh.unstable.add(1)

        if (tmp.c16active) x = x.root(3)

        if (!hasAscension(0,3)) x = overflow(x,10,0.5)

        x = x.pow(theoremEff('bh',4))

        if (hasCharger(2)) x = x.pow(1.5)

        return x
    },
    fvm: {
        can() { return tmp.c16active && player.bh.dm.gte(tmp.unstable_bh.fvm_cost) },
        buy() {
            if (this.can()) player.bh.fvm = player.bh.fvm.add(1)
        },
        buyMax() {
            if (this.can()) player.bh.fvm = player.bh.fvm.max(tmp.unstable_bh.fvm_bulk)
        },
        effect() {
            let lvl = player.bh.fvm

            let pow = E(2)

            if (hasPrestige(2,28)) pow = pow.mul(prestigeEff(2,28))

            if (tmp.inf_unl) pow = pow.mul(theoremEff('bh',3))

            let eff = pow.pow(lvl)

            return {pow: pow, eff: eff}
        },
    },
}

function startC16() {
    if (player.chal.active == 16) {
        CHALS.exit()
    }
    else {
        CHALS.exit()
        CHALS.enter(16)

        addQuote(10)
    }
}

function hasCharger(i) { return player.dark.c16.charger.includes(i) }

function buyCharger(i) {
    if (hasCharger(i)) return;

    let c = CHARGERS[i], cost = c.cost

    if (player.dark.c16.shard.gte(cost) && !tmp.c16active) {
        player.dark.c16.shard = player.dark.c16.shard.sub(cost).max(0)

        player.dark.c16.charger.push(i)

        updateC16HTML()
    }
}

function setupC16HTML() {
    let table = new Element('chargers_table')
    let h = ``

    for (let i in CHARGERS) {
        let c = CHARGERS[i]

        h += `
        <button onclick="buyCharger(${i})" class="btn full charger" id="charger${i}_div" style="font-size: 12px;">
            <div id="charger${i}_req"></div>
            <div id="charger${i}_desc" style="min-height: 80px">${c.desc}</div>
            <div id="charger${i}_cost"></div>
        </button>
        `
    }

    table.setHTML(h)
}

function corruptedShardGain() {
    let bh = player.bh.mass

    if (hasElement(232)) bh = player.dark.c16.bestBH.max('e100')
    else if (!tmp.c16active || bh.lt('e100')) return E(0)

    let x = Decimal.pow(10,overflow(bh.max(1).log10(),1e9,0.5).div(100).root(hasElement(223) ? 2.9 : 3).sub(1))

    if (hasPrestige(3,4)) x = x.mul(prestigeEff(3,4))
    
    x = x.mul(exoticAEff(0,0))

    return x.floor()
}

function updateC16Temp() {
    tmp.c16.shardGain = corruptedShardGain()
}

function updateC16HTML() {
    let c16 = tmp.c16active
    let bh = player.dark.c16.bestBH, cs = player.dark.c16.shard
    tmp.el.bestBH.setHTML(formatMass(player.dark.c16.bestBH))

    let e = hasInfUpgrade(15)?12:8

    for (let i in CHARGERS) {
        i = parseInt(i)

        let c = CHARGERS[i], id = 'charger'+i

        tmp.el[id+"_div"].setDisplay(i<e)

        if (i>=e) continue;

        let req = bh.gte(c.req)

        tmp.el[id+"_req"].setHTML(`要求：黑洞質量到達 <b>${formatMass(c.req)}</b>。`)
        tmp.el[id+"_cost"].setHTML(`價格：<b>${c.cost.format(0)}</b> 個腐化碎片。`)

        tmp.el[id+"_req"].setDisplay(!req)
        tmp.el[id+"_desc"].setDisplay(req)
        tmp.el[id+"_cost"].setDisplay(req && !hasCharger(i))

        tmp.el[id+"_div"].setClasses({btn: true, full: true, charger: true, locked: !req || cs.lt(c.cost) || hasCharger(i) || c16})
    }
}

const CORRUPTED_ELEMENTS = [40,64,67,150,162,187,199,200,204] // 40,64,67,150,199,200,204