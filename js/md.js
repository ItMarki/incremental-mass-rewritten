const MASS_DILATION = {
    unlocked() { return hasElement(21) },
    penalty() {
        let x = 0.8
        if (FERMIONS.onActive("02")) x **= 2
        return x
    },
    onactive() {
        if (player.md.active) player.md.particles = player.md.particles.add(tmp.md.rp_gain)
        player.md.active = !player.md.active
        ATOM.doReset()
        updateMDTemp()
    },
    RPexpgain() {
        let x = E(2).add(tmp.md.upgs[5].eff).mul((tmp.chal && !CHALS.inChal(10))?tmp.chal.eff[10]:1)
        if (!player.md.active && hasTree("d1")) x = x.mul(1.25)
        if (FERMIONS.onActive("01")) x = x.div(10)
        return x
    },
    RPmultgain() {
        let x = E(1).mul(tmp.md.upgs[2].eff)
        if (hasElement(24)) x = x.mul(tmp.elements.effect[24])
        if (hasElement(31)) x = x.mul(tmp.elements.effect[31])
        if (hasElement(34)) x = x.mul(tmp.elements.effect[34])
        if (hasElement(45)) x = x.mul(tmp.elements.effect[45])
        x = x.mul(tmp.fermions.effs[0][1]||1)
        return x
    },
    RPgain(m=player.mass) {
        if (CHALS.inChal(11)) return E(0)
        let x = m.div(1.50005e56).max(1).log10().div(40).sub(14).max(0).pow(tmp.md.rp_exp_gain).mul(tmp.md.rp_mult_gain)
        return x.sub(player.md.particles).max(0).floor()
    },
    massGain() {
        if (CHALS.inChal(11)) return E(0)
        let pow = E(2)
        let x = player.md.particles.pow(pow)
        x = x.mul(tmp.md.upgs[0].eff)
        if (hasElement(22)) x = x.mul(tmp.elements.effect[22])
        if (hasElement(35)) x = x.mul(tmp.elements.effect[35])
        if (hasElement(40)) x = x.mul(tmp.elements.effect[40])
        if (hasElement(32)) x = x.pow(1.05)
        return x
    },
    mass_req() {
        let x = E(10).pow(player.md.particles.add(1).div(tmp.md.rp_mult_gain).root(tmp.md.rp_exp_gain).add(14).mul(40)).mul(1.50005e56)
        return x
    },
    effect() {
        let x = player.md.mass.max(1).log10().add(1).root(3).mul(tmp.md.upgs[1].eff)
        return x
    },
    upgs: {
        buy(x) {
            if (tmp.md.upgs[x].can) {
                if (!hasElement(43)) player.md.mass = player.md.mass.sub(this.ids[x].cost(tmp.md.upgs[x].bulk.sub(1))).max(0)
                player.md.upgs[x] = player.md.upgs[x].max(tmp.md.upgs[x].bulk)
            }
        },
        ids: [
            {
                desc: `膨脹質量獲得量翻倍。`,
                cost(x) { return E(10).pow(x).mul(10) },
                bulk() { return player.md.mass.gte(10)?player.md.mass.div(10).max(1).log10().add(1).floor():E(0) },
                effect(x) {
                    let b = 2
                    if (hasElement(25)) b++
                    return E(b).pow(x.mul(tmp.md.upgs[11].eff||1)).softcap('e1.2e4',0.96,2)//.softcap('e2e4',0.92,2)
                },
                effDesc(x) { return format(x,0)+"x"+(x.gte('e1.2e4')?`<span class='soft'>（軟限制${x.gte('e2e400')?"^2":""}）</span>`:"")},
            },{
                desc: `加強膨脹質量效果。`,
                cost(x) { return E(10).pow(x).mul(100) },
                bulk() { return player.md.mass.gte(100)?player.md.mass.div(100).max(1).log10().add(1).floor():E(0) },
                effect(x) {
                    return player.md.upgs[7].gte(1)?x.mul(tmp.md.upgs[11].eff||1).root(1.5).mul(0.25).add(1):x.mul(tmp.md.upgs[11].eff||1).root(2).mul(0.15).add(1)
                },
                effDesc(x) { return "加強 "+(x.gte(10)?format(x)+"x":format(x.sub(1).mul(100))+"%")},
            },{
                desc: `相對粒子獲得量翻倍。`,
                cost(x) { return E(10).pow(x.pow(E(1.25).pow(tmp.md.upgs[4].eff||1))).mul(1000) },
                bulk() { return player.md.mass.gte(1000)?player.md.mass.div(1000).max(1).log10().root(E(1.25).pow(tmp.md.upgs[4].eff||1)).add(1).floor():E(0) },
                effect(x) { return E(2).pow(x.mul(tmp.md.upgs[11].eff||1)).softcap(1e25,0.75,0) },
                effDesc(x) { return format(x,0)+"x"+(x.gte(1e25)?"<span class='soft'>（軟限制）</span>":"") },
            },{
                desc: `膨脹質量加強增強器力量。`,
                maxLvl: 1,
                cost(x) { return E(1.619e20).mul(25) },
                bulk() { return player.md.mass.gte(E(1.619e20).mul(25))?E(1):E(0) },
                effect(x) { return player.md.mass.max(1).log(100).root(3).div(8).add(1) },
                effDesc(x) { return format(x)+"x" },
            },{
                desc: `質量膨脹升級 3 的價格增幅減弱 10%。`,
                maxLvl: 5,
                cost(x) { return E(1e5).pow(x).mul(E(1.619e20).mul(1e4)) },
                bulk() { return player.md.mass.gte(E(1.619e20).mul(1e4))?player.md.mass.div(E(1.619e20).mul(1e4)).max(1).log(1e5).add(1).floor():E(0) },
                effect(x) { return E(1).sub(x.mul(0.1)) },
                effDesc(x) { return "弱 "+format(E(1).sub(x).mul(100))+"%" },
            },{
                desc: `增加相對粒子公式的指數。`,
                cost(x) { return E(1e3).pow(x.pow(1.5)).mul(1.5e73) },
                bulk() { return player.md.mass.gte(1.5e73)?player.md.mass.div(1.5e73).max(1).log(1e3).max(0).root(1.5).add(1).floor():E(0) },
                effect(i) {
                    let s = E(0.25).add(tmp.md.upgs[10].eff||1)
                    let x = i.mul(s)
                    if (hasElement(53)) x = x.mul(1.75)
                    return x.softcap(1e3,0.6,0)
                },
                effDesc(x) { return "+^"+format(x)+(x.gte(1e3)?"<span class='soft'>（軟限制）</span>":"") },
            },{
                desc: `膨脹質量加強夸克獲得量。`,
                maxLvl: 1,
                cost(x) { return E(1.5e191) },
                bulk() { return player.md.mass.gte(1.5e191)?E(1):E(0) },
                effect(x) { return E(5).pow(player.md.mass.max(1).log10().root(2)) },
                effDesc(x) { return format(x)+"x" },
            },{
                desc: `改善質量膨脹升級 2 效果的公式。`,
                maxLvl: 1,
                cost(x) { return E(1.5e246) },
                bulk() { return player.md.mass.gte(1.5e246)?E(1):E(0) },
            },{
                unl() { return STARS.unlocked() || player.supernova.times.gte(1) },
                desc: `時間速度稍微加強所有恆星資源。`,
                maxLvl: 1,
                cost(x) { return E(1.5e296) },
                bulk() { return player.md.mass.gte(1.5e296)?E(1):E(0) },
                effect(x) { return player.tickspeed.add(1).pow(2/3) },
                effDesc(x) { return format(x)+"x" },
            },{
                unl() { return STARS.unlocked() || player.supernova.times.gte(1) },
                desc: `夸克獲得量翻倍。`,
                cost(x) { return E(5).pow(x).mul('1.50001e536') },
                bulk() { return player.md.mass.gte('1.50001e536')?player.md.mass.div('1.50001e536').max(1).log(5).add(1).floor():E(0) },
                effect(x) {
                    return E(2).pow(x).softcap(1e25,2/3,0)
                },
                effDesc(x) { return format(x)+"x"+(x.gte(1e25)?"<span class='soft'>（軟限制）</span>":"") },
            },{
                unl() { return player.supernova.times.gte(1) },
                desc: `將質量膨脹升級 6 的底數增加 0.015。`,
                cost(x) { return E(1e50).pow(x.pow(1.5)).mul('1.50001e1556') },
                bulk() { return player.md.mass.gte('1.50001e1556')?player.md.mass.div('1.50001e1556').max(1).log(1e50).max(0).root(1.5).add(1).floor():E(0) },
                effect(x) {
                    return x.mul(0.015).add(1).softcap(1.2,0.75,0).sub(1)
                },
                effDesc(x) { return "+"+format(x)+(x.gte(0.2)?"<span class='soft'>（軟限制）</span>":"") },
            },{
                unl() { return player.supernova.post_10 },
                desc: `加強首 3 個質量膨脹升級。`,
                cost(x) { return E(1e100).pow(x.pow(2)).mul('1.5e8056') },
                bulk() { return player.md.mass.gte('1.5e8056')?player.md.mass.div('1.5e8056').max(1).log(1e100).max(0).root(2).add(1).floor():E(0) },
                effect(x) {
                    return x.pow(0.5).softcap(3.5,0.5,0).div(100).add(1)
                },
                effDesc(x) { return "加強 +"+format(x.sub(1).mul(100))+"%" },
            },
        ],
    },
}

function setupMDHTML() {
    let md_upg_table = new Element("md_upg_table")
	let table = ""
	for (let i = 0; i < MASS_DILATION.upgs.ids.length; i++) {
        let upg = MASS_DILATION.upgs.ids[i]
        table += `
        <button onclick="MASS_DILATION.upgs.buy(${i})" class="btn full md" id="md_upg${i}_div" style="font-size: 11px;">
        <div style="min-height: 80px">
            [第 <span id="md_upg${i}_lvl"></span> 等級]<br>
            ${upg.desc}<br>
            ${upg.effDesc?`目前：<span id="md_upg${i}_eff"></span>`:""}
        </div>
        <span id="md_upg${i}_cost"></span>
        </button>
        `
	}
	md_upg_table.setHTML(table)
}

function updateMDTemp() {
    if (!tmp.md) tmp.md = {}
    if (!tmp.md.upgs) {
        tmp.md.upgs = []
        for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) tmp.md.upgs[x] = {}
    }
    for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) {
        let upg = MASS_DILATION.upgs.ids[x]
        tmp.md.upgs[x].cost = upg.cost(player.md.upgs[x])
        tmp.md.upgs[x].bulk = upg.bulk().min(upg.maxLvl||1/0)
        tmp.md.upgs[x].can = player.md.mass.gte(tmp.md.upgs[x].cost) && player.md.upgs[x].lt(upg.maxLvl||1/0)
        if (upg.effect) tmp.md.upgs[x].eff = upg.effect(player.md.upgs[x])
    }
    tmp.md.pen = MASS_DILATION.penalty()
    tmp.md.rp_exp_gain = MASS_DILATION.RPexpgain()
    tmp.md.rp_mult_gain = MASS_DILATION.RPmultgain()
    tmp.md.rp_gain = MASS_DILATION.RPgain()
    tmp.md.passive_rp_gain = hasTree("qol3")?MASS_DILATION.RPgain(expMult(player.mass,tmp.md.pen)):E(0)
    tmp.md.mass_gain = MASS_DILATION.massGain()
    tmp.md.mass_req = MASS_DILATION.mass_req()
    tmp.md.mass_eff = MASS_DILATION.effect()
}

function updateMDHTML() {
    tmp.el.md_particles.setTxt(format(player.md.particles,0)+(hasTree("qol3")?" "+formatGain(player.md.particles,tmp.md.passive_rp_gain.mul(tmp.preQUGlobalSpeed)):""))
    tmp.el.md_eff.setTxt(tmp.md.mass_eff.gte(10)?format(tmp.md.mass_eff)+"x":format(tmp.md.mass_eff.sub(1).mul(100))+"%")
    tmp.el.md_mass.setTxt(formatMass(player.md.mass)+" "+formatGain(player.md.mass,tmp.md.mass_gain,true))
    tmp.el.md_btn.setTxt(player.md.active
        ?(tmp.md.rp_gain.gte(1)?`取消以獲得 ${format(tmp.md.rp_gain,0)} 相對粒子：`:`到達 ${formatMass(tmp.md.mass_req)} 以獲得相對粒子，或取消膨脹`)
        :"膨脹質量"
    )
    for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) {
        let upg = MASS_DILATION.upgs.ids[x]
        let unl = upg.unl?upg.unl():true
        tmp.el["md_upg"+x+"_div"].setVisible(unl)
        if (unl) {
            tmp.el["md_upg"+x+"_div"].setClasses({btn: true, full: true, md: true, locked: !tmp.md.upgs[x].can})
            tmp.el["md_upg"+x+"_lvl"].setTxt(format(player.md.upgs[x],0)+(upg.maxLvl!==undefined?" / "+format(upg.maxLvl,0):""))
            if (upg.effDesc) tmp.el["md_upg"+x+"_eff"].setHTML(upg.effDesc(tmp.md.upgs[x].eff))
            tmp.el["md_upg"+x+"_cost"].setTxt(player.md.upgs[x].lt(upg.maxLvl||1/0)?"價格："+formatMass(tmp.md.upgs[x].cost):"")
        }
    }
}