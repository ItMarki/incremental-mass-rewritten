const CHARGERS = [
    {
        req: E(1e100),
        cost: E(10),
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
        req: E('e45000'),
        cost: E(5e8),
        desc: `
        大幅加強暗影的第一個獎勵。移除時間速度的所有增幅。
        `,
    },
]

const UNSTABLE_BH = {
    gain() {
        let x = tmp.unstable_bh.fvm_eff.eff||E(1)

        return x
    },
    getProduction(x,gain) {
        return Decimal.pow(10,x.max(0).root(2)).add(gain).log10().pow(2)
    },
    calcProduction() {
        let bh = player.bh.unstable

        return this.getProduction(bh,tmp.unstable_bh.gain).sub(bh)
    },
    effect() {
        let x = player.bh.unstable.add(1)

        if (tmp.c16active) x = x.root(3)

        x = overflow(x,10,0.5)

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
    }
}

function hasCharger(i) { return player.dark.c16.charger.includes(i) }

function buyCharger(i) {
    if (hasCharger(i)) return;

    let c = CHARGERS[i], cost = c.cost

    if (player.dark.c16.shard.gte(cost)) {
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
    if (!tmp.c16active || player.bh.mass.lt('e100')) return E(0)

    let x = Decimal.pow(10,player.bh.mass.max(1).log10().div(100).root(3).sub(1))

    if (hasPrestige(3,4)) x = x.mul(prestigeEff(3,4))
    
    return x.floor()
}

function updateC16Temp() {
    tmp.c16.shardGain = corruptedShardGain()
}

function updateC16HTML() {
    let bh = player.dark.c16.bestBH, cs = player.dark.c16.shard
    tmp.el.bestBH.setHTML(formatMass(player.dark.c16.bestBH))

    for (let i in CHARGERS) {
        i = parseInt(i)

        let c = CHARGERS[i], id = 'charger'+i

        let req = bh.gte(c.req)

        tmp.el[id+"_req"].setHTML(`要求：黑洞質量到達 <b>${formatMass(c.req)}</b>。`)
        tmp.el[id+"_cost"].setHTML(`價格：<b>${c.cost.format(0)}</b> 個腐蝕碎片。`)

        tmp.el[id+"_req"].setDisplay(!req)
        tmp.el[id+"_desc"].setDisplay(req)
        tmp.el[id+"_cost"].setDisplay(req && !hasCharger(i))

        tmp.el[id+"_div"].setClasses({btn: true, full: true, charger: true, locked: !req || cs.lt(c.cost) || hasCharger(i)})
    }
}