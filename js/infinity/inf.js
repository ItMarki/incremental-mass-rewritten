const INF = {
    doReset() {
        player.inf.reached = false
        player.mass = E(0)

        // QoL

        let iu11 = hasInfUpgrade(11), iu15 = hasInfUpgrade(15)

        resetMainUpgs(1,[3])
        resetMainUpgs(2,[5,6])
        resetMainUpgs(3,[2,6])
        if (!iu11) resetMainUpgs(4,[8])

        let e = [14,18,24,30,122,124,131,136,143,194]
        if (hasInfUpgrade(2)) e.push(202)
        if (hasInfUpgrade(3)) e.push(161)
        if (iu15) e.push(218)

        for (let i = 0; i < player.atom.elements.length; i++) if (player.atom.elements[i] > 218) e.push(player.atom.elements[i])

        player.atom.elements = e
        
        e = []

        for (let i = 0; i < player.atom.muonic_el.length; i++) if (MUONIC_ELEM.upgs[player.atom.muonic_el[i]].cs) e.push(player.atom.muonic_el[i])

        player.atom.muonic_el = e
        for (let x = 1; x <= (hasElement(229) ? 15 : 16); x++) player.chal.comps[x] = E(0)
        player.supernova.tree = ["qu_qol1", "qu_qol2", "qu_qol3", "qu_qol4", "qu_qol5", "qu_qol6", "qu_qol7", "qu_qol8", "qu_qol9", "qu_qol8a", "unl1", "unl2", "unl3", "unl4",
        "qol1", "qol2", "qol3", "qol4", "qol5", "qol6", "qol7", "qol8", "qol9", 'qu_qol10', 'qu_qol11', 'qu_qol12', 'qu0']

        player.ranks.beyond = E(0)
        for (let x = 0; x < PRESTIGES.names.length; x++) player.prestiges[x] = E(0)

        // Reset

        player.ranks[RANKS.names[RANKS.names.length-1]] = E(0)
        RANKS.doReset[RANKS.names[RANKS.names.length-1]]()

        player.rp.points = E(0)
        player.tickspeed = E(0)
        player.accelerator = E(0)
        player.bh.mass = E(0)

        player.atom.atomic = E(0)
        player.bh.dm = E(0)
        player.bh.condenser = E(0)

        tmp.supernova.time = 0

        player.atom.points = E(0)
        player.atom.quarks = E(0)
        player.atom.particles = [E(0),E(0),E(0)]
        player.atom.powers = [E(0),E(0),E(0)]
        player.atom.atomic = E(0)
        player.atom.gamma_ray = E(0)

        player.md.active = false
        player.md.particles = E(0)
        player.md.mass = E(0)
        for (let x = 0; x < MASS_DILATION.upgs.ids.length; x++) player.md.upgs[x] = E(0)

        player.stars.unls = 0
        player.stars.generators = [E(0),E(0),E(0),E(0),E(0)]
        player.stars.points = E(0)
        player.stars.boost = E(0)

        player.supernova.chal.noTick = true
        player.supernova.chal.noBHC = true

        player.supernova.times = E(0)
        player.supernova.stars = E(0)

        player.supernova.bosons = {
            pos_w: E(0),
            neg_w: E(0),
            z_boson: E(0),
            photon: E(0),
            gluon: E(0),
            graviton: E(0),
            hb: E(0),
        }
        for (let x in BOSONS.upgs.ids) for (let y in BOSONS.upgs[BOSONS.upgs.ids[x]]) player.supernova.b_upgs[BOSONS.upgs.ids[x]][y] = E(0)

        player.supernova.fermions.points = [E(0),E(0)]

        for (let x = 0; x < 2; x++) for (let y = 0; y < 7; y++) player.supernova.fermions.tiers[x][y] = E(0)

        player.supernova.radiation.hz = hasUpgrade('br',6)?E(1e50):E(0)
        for (let x = 0; x < 7; x++) {
            player.supernova.radiation.ds[x] = E(0)
            for (let y = 0; y < 2; y++) player.supernova.radiation.bs[2*x+y] = E(0)
        }

        // Quantum

        let qu = player.qu
        let bmd = player.md.break
        let quSave = getQUSave()

        qu.times = E(10)
        qu.points = E(0)
        qu.bp = E(0)
        qu.chroma = [E(0),E(0),E(0)]
        qu.cosmic_str = E(0)

        qu.prim.theorems = E(0)
        qu.prim.particles = [E(0),E(0),E(0),E(0),E(0),E(0),E(0),E(0)]

        qu.en.amt = E(0)
        qu.en.eth = quSave.en.eth
        qu.en.hr = quSave.en.hr
        qu.en.rewards = quSave.en.rewards

        qu.rip.active = false
        qu.rip.amt = E(0)

        if (!iu11) bmd.active = false
        bmd.energy = E(0)
        bmd.mass = E(0)
        for (let x = 0; x < 12; x++) if (x != 10) bmd.upgs[x] = E(0)

        // Dark Reset

        let dark = player.dark
        let darkSave = getDarkSave()

        dark.rays = hasInfUpgrade(7)?E(1e12):E(0)
        dark.shadow = E(0)
        dark.abyssalBlot = E(0)

        dark.run.active = false
        dark.run.glyphs = [0,0,0,0,0,0]
        if (!hasInfUpgrade(3)) dark.run.upg = []

        dark.matters = darkSave.matters

        if (iu15) {
            darkSave.c16.first = true
            darkSave.c16.bestBH = dark.c16.bestBH
            darkSave.c16.charger = dark.c16.charger
        }

        dark.c16 = darkSave.c16

        if (hasInfUpgrade(8)) {
            for (let i = 0; i < infUpgEffect(8); i++) dark.c16.tree.push(...TREE_IDS[i][5])
        }

        dark.exotic_atom = darkSave.exotic_atom

        if (!hasElement(242)) player.bh.fvm = E(0)
        player.bh.unstable = E(0)

        // Other

        if (!hasInfUpgrade(11)) {
            tmp.rank_tab = 0
            tmp.stab[4] = 0
        }

        tmp.stab[7] = 0

        if (!iu15) {
            player.atom.elemTier[0] = 1
            player.atom.elemLayer = 0
        }

        // Infinity

        player.inf.dim_mass = E(0)
        player.inf.cs_amount = E(0)

        updateMuonSymbol()

        updateTemp()

        player.inf.pt_choosed=-1

        generatePreTheorems()

        tmp.pass = 2
    },
    req: Decimal.pow(10,Number.MAX_VALUE),
    limit() {
        let x = Decimal.pow(10,Decimal.pow(10,Decimal.pow(1.05,player.inf.theorem.scaleEvery('inf_theorem').pow(1.25)).mul(Math.log10(Number.MAX_VALUE))))

        return x
    },
    goInf(limit=false) {
        if (player.mass.gte(this.req)) {
            if (limit || player.inf.pt_choosed >= 0 || hasElement(239)) CONFIRMS_FUNCTION.inf(limit)
            else if (player.confirms.inf) createConfirm(`你確定在不選擇任何定理的情況下變成無限嗎？`,'inf',()=>{CONFIRMS_FUNCTION.inf(limit)})
            else CONFIRMS_FUNCTION.inf(limit)
        }
    },
    level() {
        let s = player.mass.add(1).log10().add(1).log10().div(308).max(1).log(1.1).add(1)
        s = s.mul(player.dark.c16.bestBH.add(1).log10().div(3.5e6).max(1).log(1.1).add(1))

        if (hasElement(16,1)) s = s.mul(player.inf.dim_mass.add(1).log(1e6).add(1))

        return s.max(1).root(2).softcap(tmp.inf_level_ss,1/3,0).toNumber()
    },
    gain() {
        if (player.mass.lt(this.req)) return E(0)
        let x = player.mass.add(1).log10().add(1).log10().sub(307).root(2).div(2)
        x = Decimal.pow(10,x.sub(1))

        if (hasInfUpgrade(5)) x = x.mul(infUpgEffect(5))
        if (hasElement(17,1)) x = x.mul(muElemEff(17))
        if (hasElement(20,1)) x = x.mul(muElemEff(20))

        if (hasBeyondRank(8,1)) x = x.mul(beyondRankEffect(8,1))

        return x.max(1).floor()
    },

    upgs: [
        [
            {
                title: "無要求樹",
                desc: "中子樹中腐化前部分的升級無需滿足要求也可以購買。",
                cost: E(1),
            },{
                title: "無限質量",
                desc: "無限點數總數提升普通質量和黑洞質量獲得量。",
                cost: E(1),
                effect() {
                    let x = player.inf.total

                    return [x.add(1).pow(2).softcap(1e3,0.5,0),overflow(x.add(1).softcap(10,0.5,0),10,0.5)]
                },
                effectDesc: x => "普通質量 ^"+x[0].format(0)+x[0].softcapHTML(1e3)+"；黑洞質量 ^"+x[1].format(0),
            },{
                title: "舊版質量升級 4",
                desc: "開始時解鎖過強器，而它的起始價格大幅降低（同樣，開始時解鎖第 202 個元素）。",
                cost: E(1),
            },{
                title: "暗界靜止",
                desc: "變成無限時保留符文升級（同樣，開始時解鎖第 161 個升級）。",
                cost: E(1),
            },
            /*
            {
                title: "Placeholder Title",
                desc: "Placeholder Description.",
                cost: E(1),
                effect() {
                    let x = E(1)

                    return x
                },
                effectDesc: x => "Placeholder",
            },
            */
        ],[
            {
                title: "樹自動化",
                desc: "自動購買中子數的腐化前部分。",
                cost: E(100),
            },{
                title: "自我無限",
                desc: "無限定理提升無限點數獲得量。",
                cost: E(100),
                effect() {
                    let x = Decimal.pow(hasBeyondRank(6,1)?3:2,player.inf.theorem)

                    return x
                },
                effectDesc: x => formatMult(x,0),
            },{
                title: "停止切換大撕裂",
                desc: "第 218 個前的大撕裂元素可以在大撕裂外購買。自動購買第 2 階元素（第 119-218 個）。",
                cost: E(100),
            },{
                title: "暗界被動技",
                desc: "開始時有更多暗束（解鎖第一個暗束獎勵的程度）。",
                cost: E(100),
            },
        ],[
            {
                title: "腐化建構",
                desc: "開始時解鎖中子樹的腐化部分（列數基於無限定理，由 2 個開始，在 5 個結束）。",
                cost: E(2e3),
                effect() {
                    let x = Math.min(Math.max(1,player.inf.theorem-1),4)

                    return x
                },
                effectDesc: x => "第 1-"+x+" 列升級",
            },{
                title: "平行擠壓器",
                desc: "在主標籤解鎖新的生產器。此外，你會自動生產提升配戴定理的元得分的維度質量。",
                cost: E(2e3),
            },{
                title: "天樞自動化",
                desc: "自動購買天樞碎片，而且它不會重置任何東西。此外，開始時解鎖自動購買超·級別的功能。",
                cost: E(2e3),
            },{
                title: "致命宇宙",
                desc: "變成無限時保留大撕裂升級和打破膨脹。",
                cost: E(2e3),
            },
        ],[
            {
                title: "黑暗挑戰自動化",
                desc: "自動完成挑戰 13-15。",
                cost: E(6e6),
            },{
                title: "奇異速度",
                desc: "無限定理提升 K 介子和 π 介子獲得量。",
                cost: E(6e6),
                effect() {
                    let x = Decimal.pow(hasBeyondRank(6,1)?3:2,player.inf.theorem)

                    return x
                },
                effectDesc: x => formatMult(x,0),
            },{
                title: "緲子自動化",
                desc: "自動購買緲子元素和 MCF。",
                cost: E(6e6),
            },{
                title: "腐化高峰",
                desc: "開始時解鎖挑戰 16。無限時保留腐化升級和在挑戰 16 中的最佳黑洞質量。解鎖更多腐化升級。",
                cost: E(6e6),
            },
        ],[
            {
                title: "打破無限",
                desc: "到達無限不會再播放動畫。你可以舉起的普通質量不受上限限制，且隨時可以獲得無限定理。最後，解鎖元素第 3 階和更多的緲子元素。",
                cost: E(1e12),
            },
        ],
    ],

    upg_row_req: [
        1,
        2,
        3,
        6,
        9,
    ],

    dim_mass: {
        gain() {
            if (!hasInfUpgrade(9)) return E(0)

            let x = tmp.peEffect.eff||E(1)

            if (hasElement(244)) x = x.mul(elemEffect(244))

            return x
        },
        effect() {
            let x = player.inf.dim_mass.add(1).log10().pow(hasElement(244)?2.2:2).div(10)

            return x//.softcap(10,0.5,0)
        },
    },
    pe: {
        cost(i) { return Decimal.pow(1.2,i.scaleEvery('pe')).mul(1000).floor() },
        can() { return player.inf.points.gte(tmp.peCost) },
        buy() {
            if (this.can()) {
                player.inf.points = player.inf.points.sub(tmp.peCost).max(0)
                player.inf.pe = player.inf.pe.add(1)
            }
        },
        buyMax() { 
            if (this.can()) {
                player.inf.points = player.inf.points.sub(this.cost(tmp.peBulk.sub(1))).max(0)
                player.inf.pe = tmp.peBulk
            }
        },
        effect() {
            let t = player.inf.pe

            let bonus = E(0)

            let step = E(2).add(exoticAEff(1,4,0))

            if (hasElement(225)) step = step.add(elemEffect(225,0))

            let eff = step.pow(t.add(bonus))

            let eff_bottom = eff

            return {step: step, eff: eff, bonus: bonus, eff_bottom: eff_bottom}
        },
    },
}

const IU_LENGTH = (()=>{
    let n = 0
    for (let x in INF.upgs) n += INF.upgs[x].length
    return n
})()

function generatePreTheorems() {
    for (let i = 0; i < 4; i++) player.inf.pre_theorem[i] = createPreTheorem()
}

function hasInfUpgrade(i) { return player.inf.upg.includes(i) }

function buyInfUpgrade(r,c) {
    if (hasInfUpgrade(r*4+c)) return

    let u = INF.upgs[r][c]
    let cost = u.cost

    if (player.inf.points.gte(cost) && player.inf.theorem.gte(INF.upg_row_req[r])) {
        player.inf.upg.push(r*4+c)
        player.inf.points = player.inf.points.sub(cost).max(0).round()

        if (r == 4 && c == 0) addQuote(12)
    }
}

function getInfSave() {
    let s = {
        theorem: E(0),
        total: E(0),
        points: E(0),
        best: E(0),
        reached: false,

        core: [],
        inv: [],
        pre_theorem: [],
        upg: [],
        fragment: {},
        pt_choosed: -1,

        dim_mass: E(0),
        pe: E(0),

        cs_amount: E(0),
        cs_double: [E(0),E(0)],
    }
    for (let i in CORE) s.fragment[i] = E(0)
    //for (let i = 0; i < 4; i++) s.pre_theorem.push(createPreTheorem())
    return s
}

function infUpgEffect(i,def=1) { return tmp.iu_eff[i] || def }

function updateInfTemp() {
    updateCSTemp()

    tmp.peCost = INF.pe.cost(player.inf.pe)
    tmp.peBulk = E(0)
    if (player.inf.points.gte(100)) tmp.peBulk = player.inf.points.div(1000).log(1.2).scaleEvery('pe',true).add(1).floor()
    tmp.peEffect = INF.pe.effect()

    tmp.dim_mass_gain = INF.dim_mass.gain()
    tmp.dim_mass_eff = INF.dim_mass.effect()

    for (let r in INF.upgs) {
        r = parseInt(r)

        let ru = INF.upgs[r]

        for (let c in ru) {
            c = parseInt(c)

            let u = ru[c]

            if (u.effect) tmp.iu_eff[r*4+c] = u.effect()
        }
    }

    updateCoreTemp()

    tmp.inf_level_ss = 5

    if (hasElement(222)) tmp.inf_level_ss += 5
    if (hasElement(235)) tmp.inf_level_ss += 5
    if (tmp.chal) tmp.inf_level_ss += tmp.chal.eff[17]||0

    tmp.IP_gain = INF.gain()
    tmp.inf_limit = INF.limit()
    tmp.inf_reached = player.mass.gte(tmp.inf_limit)
}

function infButton() {
    if (tmp.inf_time == 2) {
        tmp.inf_time += 1

        INF.goInf(true)

        document.body.style.animation = "inf_reset_2 2s 1"

        setTimeout(()=>{
            tmp.inf_time += 1
            tmp.el.inf_popup.setDisplay(false)

            setTimeout(()=>{
                tmp.inf_time = 0
                document.body.style.backgroundColor = 'hsl(0, 0%, 7%)'
            },1000)
        },1000)
    }
}

function calcInf(dt) {
    if (!tmp.brokenInf && tmp.inf_reached && tmp.inf_time == 0) {
        tmp.inf_time += 1
        document.body.style.animation = "inf_reset_1 10s 1"

        setTimeout(()=>{
            tmp.inf_time += 1
            document.body.style.backgroundColor = 'orange'
            tmp.el.inf_popup.setDisplay(true)
        },8500)
    }

    if (!player.inf.reached && player.mass.gte(INF.req)) player.inf.reached=true

    if (hasInfUpgrade(4)) for (let x = 0; x < TREE_TYPES.qu.length; x++) TREE_UPGS.buy(TREE_TYPES.qu[x], true)
    if (hasInfUpgrade(6)) for (let x = 119; x <= 218; x++) buyElement(x,0)

    player.inf.dim_mass = player.inf.dim_mass.add(tmp.dim_mass_gain.mul(dt))

    if (hasElement(232)) {
        let cs = tmp.c16.shardGain

        player.dark.c16.shard = player.dark.c16.shard.add(cs.mul(dt))
        player.dark.c16.totalS = player.dark.c16.totalS.add(cs.mul(dt))
    }

    if (hasElement(235)) {
        let ig = player.inf.best.div(1e2).mul(tmp.cs_effect.inf_speed).mul(dt)

        player.inf.points = player.inf.points.add(ig)
        player.inf.total = player.inf.total.add(ig)
    }

    if (tmp.CS_unl) {
        player.inf.cs_amount = CORRUPTED_STAR.calcNextGain(player.inf.cs_amount,tmp.cs_speed.mul(dt))
    }

    if (hasElement(253)) {
        for (let i in player.inf.core) {
            let p = player.inf.core[i]
            if (p) {
                player.inf.fragment[p.type]=player.inf.fragment[p.type].add(calcFragmentBase(p,p.star,p.power).mul(dt/100))
            }
        }
    }
}

function setupInfHTML() {
    setupCoreHTML()
    setupInfUpgradesHTML()
}

function updateInfHTML() {
    if (tmp.tab == 0 && tmp.stab[0] == 5) {
        tmp.el.dim_mass.setTxt(formatMass(player.inf.dim_mass)+" "+player.inf.dim_mass.formatGain(tmp.dim_mass_gain,true))
        tmp.el.dim_mass_eff.setHTML("+"+tmp.dim_mass_eff.format())

        let pe_eff = tmp.peEffect
		tmp.el.pe_scale.setTxt(getScalingName('pe'))
		tmp.el.pe_lvl.setTxt(format(player.inf.pe,0)+(pe_eff.bonus.gte(1)?" + "+format(pe_eff.bonus,0):""))
		tmp.el.pe_btn.setClasses({btn: true, locked: !INF.pe.can()})
		tmp.el.pe_cost.setTxt(format(tmp.peCost,0))
		tmp.el.pe_step.setHTML(formatMult(pe_eff.step))
		tmp.el.pe_eff.setTxt(formatMult(pe_eff.eff))
    }
    else if (tmp.tab == 8) {
        if (tmp.stab[8] == 0) updateCoreHTML()
        else if (tmp.stab[8] == 1) {
            let h = ``
            for (let t in CORE) {
                let hh = ``, ct = CORE[t], ctmp = tmp.core_eff[t], s = tmp.core_score[t]
                for (let i = 0; i < MAX_STARS; i++) {
                    if (s[i] > 0) hh += "元得分 "+format(s[i],2)+" | "+(ct.preEff[i] || '???.')+` <b class='sky'>(${ct.effDesc[i](ctmp[i])})</b><br>`
                }
                let f = player.inf.fragment[t]
                if (f.gt(0)) hh += `<br>${f.format(0)} ${ct.title.substring(0,ct.title.search("定理"))}碎片 | ${ct.fragment[1](tmp.fragment_eff[t])}<br>`
                if (hh != '') h += `<h2>${ct.title}<b>（${format(core_tmp[t].total_p*100,0)}%）</b></h2><br>`+hh+'<br>'
            }
            tmp.el.core_eff_div.setHTML(h||"將任何定理放入核心以顯示其效果！")
        }
        else if (tmp.stab[8] == 2) {
            tmp.el.ip_amt.setHTML(player.inf.points.format(0) + (hasElement(235)?" "+player.inf.points.formatGain(player.inf.best.div(1e2).mul(tmp.cs_effect.inf_speed)):""))

            for (let r in INF.upgs) {
                r = parseInt(r)

                let unl = r == 0 || player.inf.theorem.gte(INF.upg_row_req[r-1])

                tmp.el['iu_row'+r].setDisplay(unl)

                if (!unl) continue;
                
                let ru = INF.upgs[r], req = player.inf.theorem.gte(INF.upg_row_req[r])

                for (let c in ru) {
                    c = parseInt(c)

                    let id = r*4+c

                    let el = tmp.el[`iu_${id}_div`]

                    if (el) {
                        let u = ru[c], b = hasInfUpgrade(id)

                        el.setClasses({inf_upg: true, locked: !b && (player.inf.points.lt(u.cost) || !req), bought: b})

                        tmp.el[`iu_${id}_desc`].setHTML(b?u.effectDesc?"<br>效果："+u.effectDesc(infUpgEffect(id)):"":"<br>價格：<b>"+u.cost.format(0)+"</b> 無限點數")
                    }
                }
            }
        }
        else if (tmp.stab[8] == 3) updateCSHTML()
    }
}

function setupInfUpgradesHTML() {
    let html = ''

    for (let r in INF.upgs) {
        r = parseInt(r)

        let h = `<div class='table_center' id='iu_row${r}'>
        <div class='iu_req_div'><div>需要 ${INF.upg_row_req[r]} 個無限定理</div></div>`

        let ru = INF.upgs[r]

        for (let c in ru) {
            c = parseInt(c)

            let u = ru[c], id = r*4+c

            h += `
            <button class='inf_upg' id='iu_${id}_div' onclick='buyInfUpgrade(${r},${c})'>
                <img src='images/upgrades/iu${id}.png'>
                <div>
                    <b>${u.title}</b><br>
                    ${u.desc}<br>
                    <span id='iu_${id}_desc'></span>
                </div>
            </button>
            `
        }

        html += h + `</div>`
    }

    new Element('inf_upg_table').setHTML(html)
}