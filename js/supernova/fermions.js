const FERMIONS = {
    onActive(id) {
        let i = player.supernova.fermions.choosed
        return i == id || (i[1] == '6' && i[0] == id[0])
    },
    gain(i) {
        if (!player.supernova.fermions.unl) return E(0)
        let x = E(1)
        let base = E(1.25).add(tmp.prim.eff[5][0])
        if (tmp.radiation.unl) x = x.mul(tmp.radiation.hz_effect)
        for (let j = 0; j < FERMIONS.types[i].length; j++) x = x.mul(base.pow(player.supernova.fermions.tiers[i][j]))
        if (hasTree("fn1") && tmp.supernova) x = x.mul(tmp.supernova.tree_eff.fn1)

        if (tmp.c16active || player.dark.run.active) x = expMult(x,mgEff(4)[0])

        return x
    },
    backNormal() {
        if (player.supernova.fermions.choosed != "") {
            player.supernova.fermions.choosed = ""
            SUPERNOVA.reset(false,false,false,true)
        }
    },
    choose(i,x) {
        if (player.confirms.sn) createConfirm("你確定要轉換成另一個費米子嗎？",'switchF', ()=>CONFIRMS_FUNCTION.switchF(i,x))
        else CONFIRMS_FUNCTION.switchF(i,x)
    },
    bonus(i,j) {
        let x = E(0)
        if (hasTree("prim3") && j < 6) x = x.add(tmp.prim.eff[5][1].min(j>2&&!hasElement(172)?4:1/0))
        if (hasTree('ct3')) x = x.add(treeEff('ct3'))
        return x
    },
	fp() {
        let x = E(1)
        if (hasTree("qu1")) x = x.mul(1.2)
        if (QCs.active()) x = x.div(tmp.qu.qc_eff[2])
        return x
    },
    getTierScaling(t, bulk=false, meta=false) {
        let x = t
        let fp = meta?E(1):tmp.fermions.fp
        if (bulk) {
            x = t.scaleEvery('fTier',true,[1,1,1,fp]).add(1).floor()
        } else {
            x = t.scaleEvery('fTier',false,[1,1,1,fp])
        }
        return x
    },
    getUnlLength(x) {
        let u = 2
        if (hasTree("fn2")) u++
        if (hasTree("fn6")) u++
        if (hasTree("fn7")) u++
        if (hasTree("fn8")) u++
        if (hasTree("fn13")) u++
        return u
    },
    names: ['quark', 'lepton'],
    sub_names: [["上","下","魅","奇","頂","底","元夸克"],["電子","緲子","陶子","微中子","緲微中子","陶微中子","元輕子"]],
    types: [
        [
            {
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e50').pow(t.pow(1.25)).mul("e800")
                },
                calcTier() {
                    let res = player.atom.atomic
                    if (res.lt('e800')) return E(0)
                    let x = res.div('e800').max(1).log('e50').max(0).root(1.25)
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
                    let x = i.max(1).log(1.1).mul(t.pow(0.75))
                    return x
                },
                desc(x) {
                    return `免費給予 ${format(x,0)} 個宇宙射線`
                },
                inc: "原子力量",
                cons: "原子力量獲得量 ^0.6",
            },{
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e50').pow(t.pow(1.25)).mul("e400")
                },
                calcTier() {
                    let res = player.md.particles
                    if (res.lt('e400')) return E(0)
                    let x = res.div('e400').max(1).log('e50').max(0).root(1.25)
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
                    let x = E(1e5).pow(i.add(1).log10().mul(t)).softcap("ee3",0.9,2)
                    return x
                },
                desc(x) {
                    return `相對粒子獲得量 x${format(x)}`+(x.gte('ee3')?"<span class='soft'>（軟上限）</span>":"")
                },
                inc: "相對粒子",
                cons: "相對粒子公式的指數除以 10",
            },{
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('ee3').pow(t.pow(1.5)).mul(uni("e36000"))
                },
                calcTier() {
                    let res = player.mass
                    if (res.lt(uni("e36000"))) return E(0)
                    let x = res.div(uni("e36000")).max(1).log('ee3').max(0).root(1.5)
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
                    let x = i.add(1).log10().pow(1.75).mul(t.pow(0.8)).div(100).add(1).softcap(5,0.75,0).softcap(449,0.25,0)
                    return x
                },
                desc(x) {
                    return `Z<sup>0</sup> 玻色子的第一個效果強 ${format(x.sub(1).mul(100))}%`+(x.gte(5)?"<span class='soft'>（軟上限）</span>":"")
                },
                inc: "質量",
                cons: "你困在效果翻倍的質量膨脹裏",
                isMass: true,
            },{
                maxTier() {
                    if (hasElement(142)) return Infinity
                    let x = 15
                    if (hasTree("fn9")) x += 2
                    if (hasTree("fn11")) x += 5
                    return x
                },
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e1000').pow(t.pow(1.5)).mul("e3e4")
                },
                calcTier() {
                    let res = player.rp.points
                    if (res.lt('e3e4')) return E(0)
                    let x = res.div('e3e4').max(1).log('e1000').max(0).root(1.5)
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
                    let x = i.max(1).log10().add(1).mul(t).pow(0.9).div(100).add(1).softcap(1.5,0.5,0).softcap(5,1/3,0).min(6.5)
                    return x
                },
                desc(x) {
                    return `光子和膠子升級 4 強 ${format(x)}x`+(x.gte(1.5)?"<span class='soft'>（軟上限）</span>":"")
                },
                inc: "暴怒點數",
                cons: "你困在質量膨脹和挑戰 3-5 裏",
            },{
                maxTier() {
                    if (hasElement(156)) return Infinity
                    let x = 30
                    if (hasTree("fn11")) x += 5
                    return x
                },
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('ee4').pow(t.pow(1.5)).mul(uni('e5.75e5'))
                },
                calcTier() {
                    let res = player.md.mass
                    if (res.lt(uni('e5.75e5'))) return E(0)
                    let x = res.div(uni('e5.75e5')).max(1).log('ee4').max(0).root(1.5)
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
                    let x = i.add(1).log10().div(500).mul(t.root(2)).add(1)
                    return x.softcap(1.15,0.5,0).softcap(1.8,1/3,0).min(2)//.softcap(2,0.1,0)
                },
                desc(x) {
                    return `輻射加成便宜 ${format(x)}x`+(x.gte(1.15)?"<span class='soft'>（軟上限）</span>":"")
                },
                inc: "膨脹質量",
                cons: "U-夸克、光子和膠子無效",
                isMass: true,
            },{
                maxTier() {
                    if (hasElement(173)) return Infinity
                    let x = 10
                    if (hasTree("fn11")) x += 5
                    return x
                },
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e5e8').pow(t.pow(2)).mul('e6e9')
                },
                calcTier() {
                    let res = tmp.tickspeedEffect && !tmp.pass?tmp.tickspeedEffect.eff_bottom:E(1)
                    if (res.lt('e6e9')) return E(0)
                    let x = res.div('e6e9').max(1).log('e5e8').max(0).root(2)
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
                    let x = i.add(1).log10().pow(0.5).div(150).add(1).pow(t)
                    if (hasElement(213)) {
                        let y = expMult(t.add(1).pow(i.add(1).log10().add(1).log10()),0.8)
                        return x.min(500).max(y)
                    }
                    return x.min(500)//overflow(x,500,0.25)
                },
                desc(x) {
                    return `元級時間速度推遲 ${format(x)}x`
                },
                inc: "時間速度效果",
                cons: "禁用挑戰",
            },{
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x, false, true)
                    return Decimal.pow(1.5,t).mul(1e10)
                },
                calcTier() {
                    let res = tmp.fermions.prod[0]
                    if (res.lt(1e10)) return E(0)
                    let x = res.div(1e10).max(1).log(1.5).max(0)
                    return FERMIONS.getTierScaling(x, true, true)
                },
                eff(i, t) {
                    let x = i.add(1).log10().add(1).log10().div(200).mul(t.softcap(8,0.5,0)).add(1)
                    return x
                },
                desc(x) {
                    return `暗束效果強 ^${x.format()}`.corrupt(tmp.c16active)
                },
                inc: "以上所有 U-夸克的乘積",
                cons: "啟動以上所有 U-夸克，但強制執行量子重置",
            },

        ],[
            {
                maxTier() {
                    if (hasTree("fn10")) return 1/0
                    let x = 15
                    if (hasTree("fn5")) x += 35
                    return x
                },
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e5').pow(t.pow(1.5)).mul("e175")
                },
                calcTier() {
                    let res = player.atom.quarks
                    if (res.lt('e175')) return E(0)
                    let x = res.div('e175').max(1).log('e5').max(0).root(1.5)
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
                    let x = i.add(1).log10().mul(t).div(100).add(1).softcap(1.5,hasTree("fn5")?0.75:0.25,0)
                    if (hasTree("fn10")) x = x.pow(4.5)
                    return x//.softcap(1e18,0.1,0)
                },
                desc(x) {
                    return `塌縮恆星獲得量的軟上限推遲 ^${format(x)}`+(x.gte(1.5)?"<span class='soft'>（軟上限）</span>":"")
                },
                inc: "夸克",
                cons: "原子獲得量的指數 ^0.625",
            },{
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e4e4').pow(t.pow(1.25)).mul("e6e5")
                },
                calcTier() {
                    let res = player.bh.mass
                    if (res.lt('e6e5')) return E(0)
                    let x = res.div('e6e5').max(1).log('e4e4').max(0).root(1.25)
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
                    let x = t.pow(1.5).add(1).pow(i.add(1).log10().softcap(10,0.75,0)).softcap(1e6,0.75,0)
                    return x
                },
                desc(x) {
                    return `希格斯玻色子和引力子的獲得量 x${format(x)}`+(x.gte(1e6)?"<span class='soft'>（軟上限）</span>":"")
                },
                isMass: true,
                inc: "黑洞質量",
                cons: "黑洞質量公式的指數一律設為 -1",
            },{
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e5e3').pow(t.pow(1.5)).mul("e4.5e5")
                },
                calcTier() {
                    let res = player.bh.dm
                    if (res.lt('e4.5e5')) return E(0)
                    let x = res.div('e4.5e5').max(1).log('e5e3').max(0).root(1.5)
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
                    let x = t.pow(0.8).mul(0.025).add(1).pow(i.add(1).log10())
                    return x
                },
                desc(x) {
                    return `時間速度便宜 ${format(x)}x（在元級價格增幅生效之前）`
                },
                inc: "暗物質",
                cons: "你困在挑戰 8-9 裏",
            },{
                maxTier() {
                    if (hasElement(142)) return Infinity
                    let x = 15
                    if (hasTree("fn9")) x += 2
                    if (hasTree("fn11")) x += 5
                    return x
                },
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e400').pow(t.pow(1.5)).mul("e1600")
                },
                calcTier() {
                    let res = player.stars.points
                    if (res.lt('e1600')) return E(0)
                    let x = res.div('e1600').max(1).log('e400').max(0).root(1.5)
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
                    let x = i.max(1).log10().add(1).mul(t).div(200).add(1).softcap(1.5,0.5,0)
                    return x
                },
                desc(x) {
                    return `階的要求便宜 ${format(x)}x`+(x.gte(1.5)?"<span class='soft'>（軟上限）</span>":"")
                },
                inc: "塌縮恆星",
                cons: "恆星生產器 ^0.5",
            },{
                maxTier() {
                    if (hasElement(156)) return Infinity
                    let x = 25
                    if (hasTree("fn11")) x += 5
                    return x
                },
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('e1.5e7').pow(t.pow(2)).mul("e3.5e8")
                },
                calcTier() {
                    let res = player.atom.points
                    if (res.lt('e3.5e8')) return E(0)
                    let x = res.div('e3.5e8').max(1).log('e1.5e7').max(0).root(2)
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
                    let m = i.add(1).log10().mul(t).root(4)
                    let x = Math.min(hasElement(157)?m.div(150).add(1).softcap(5,0.5,0).pow(-1).toNumber():1,E(0.95).pow(m.softcap(27,0.5,0)).max(2/3).toNumber())
                    return x
                },
                desc(x) {
                    return `元級前超新星增幅弱 ${format(100-x*100)}%`
                },
                inc: "原子",
                cons: "U-輕子和 Z<sup>0</sup> 玻色子無效",
            },{
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x)
                    return E('10').pow(t.pow(1.5)).mul('e80')
                },
                calcTier() {
                    let res = tmp.tickspeedEffect && !tmp.pass?tmp.tickspeedEffect.step:E(1)
                    if (res.lt('e80')) return E(0)
                    let x = res.div('e80').max(1).log('10').max(0).root(1.5)
                    return FERMIONS.getTierScaling(x, true)
                },
                eff(i, t) {
                    let x = i.add(1).log10().pow(0.75).div(100).add(1).pow(t.pow(0.75))
                    return x
                },
                desc(x) {
                    return `元級前黑洞壓縮器和宇宙射線便宜 ${format(x)}x`
                },
                inc: "時間速度力量",
                cons: "禁用輻射加成",
            },{
                nextTierAt(x) {
                    let t = FERMIONS.getTierScaling(x, false, true)
                    return Decimal.pow(1.5,t).mul(1e11)
                },
                calcTier() {
                    let res = tmp.fermions.prod[1]
                    if (res.lt(1e11)) return E(0)
                    let x = res.div(1e11).max(1).log(1.5).max(0)
                    return FERMIONS.getTierScaling(x, true, true)
                },
                eff(i, t) {
                    let x = i.add(1).log10().add(1).log10().div(2000).mul(t.softcap(8,0.5,0))
                    if (hasBeyondRank(2,2)) x = x.mul(8)
                    return x.toNumber()
                },
                desc(x) {
                    return `將重置底數的指數增加 ${format(x)}`
                },
                inc: "以上所有 U-輕子的乘積",
                cons: "啟動以上所有 U-輕子，但強制執行量子重置",
            },

            /*
            {
                nextTierAt(x) {
                    return EINF
                },
                calcTier() {
                    let res = E(0)
                    let x = E(0)
                    return x
                },
                eff(i, t) {
                    let x = E(1)
                    return x
                },
                desc(x) {
                    return `Placeholder`
                },
                inc: "Placeholder",
                cons: "Placeholder",
            },
            */
        ],
    ],
    productF(i) {
        let s = E(1)
        for (let x = 0; x < 6; x++) s = s.mul(player.supernova.fermions.tiers[i][x].add(1))
        return s
    },
}

function setupFermionsHTML() {
    for (i = 0; i < 2; i++) {
        let new_table = new Element("fermions_"+FERMIONS.names[i]+"_table")
        let table = ""
        for (let x = 0; x < FERMIONS.types[i].length; x++) {
            let f = FERMIONS.types[i][x]
            let id = `f${FERMIONS.names[i]}${x}`
            table += `
            <button id="${id}_div" class="fermion_btn ${FERMIONS.names[i]}" onclick="FERMIONS.choose(${i},${x})">
                <b>[${FERMIONS.sub_names[i][x]}]</b><br>[第 <span id="${id}_tier">0</span> <span id="${id}_tier_scale"></span>階]<br>
                <span id="${id}_cur">目前：X</span><br>
                下一階：<span id="${id}_nextTier">X</span><br>
                （基於${f.inc}）<br><br>
                效果：<span id="${id}_desc">X</span><br>
                啟動時：${f.cons}
            </button>
            `
        }
	    new_table.setHTML(table)
    }
}

function updateFermionsTemp() {
    let tf = tmp.fermions

    tf.prod = [FERMIONS.productF(0),FERMIONS.productF(1)]
    tf.ch = player.supernova.fermions.choosed == "" ? [-1,-1] : [Number(player.supernova.fermions.choosed[0]),Number(player.supernova.fermions.choosed[1])]
    tf.fp = FERMIONS.fp()
    for (i = 0; i < 2; i++) {
        tf.gains[i] = FERMIONS.gain(i)

        for (let x = 0; x < FERMIONS.types[i].length; x++) {
            let f = FERMIONS.types[i][x]

            tf.bonuses[i][x] = FERMIONS.bonus(i,x)
            tf.maxTier[i][x] = typeof f.maxTier == "function" ? f.maxTier() : f.maxTier||1/0
            tf.tiers[i][x] = f.calcTier().min(tf.maxTier[i][x])
            tf.effs[i][x] = f.eff(player.supernova.fermions.points[i], (FERMIONS.onActive("04") && i == 0) || (FERMIONS.onActive("14") && i == 1) ? E(0) : player.supernova.fermions.tiers[i][x].add(tmp.fermions.bonuses[i][x]).mul(i==1?tmp.radiation.bs.eff[16]:1).mul(i==0?tmp.radiation.bs.eff[19]:1))
        }
    }
}

function updateFermionsHTML() {
    let r = [
        [player.atom.atomic, player.md.particles, player.mass, player.rp.points, player.md.mass, tmp.tickspeedEffect.eff_bottom, tmp.fermions.prod[0]],
        [player.atom.quarks, player.bh.mass, player.bh.dm, player.stars.points, player.atom.points, tmp.tickspeedEffect.step, tmp.fermions.prod[1]]
    ]
    for (i = 0; i < 2; i++) {
        tmp.el["f"+FERMIONS.names[i]+"Amt"].setTxt(format(player.supernova.fermions.points[i],2)+" "+formatGain(player.supernova.fermions.points[i],tmp.fermions.gains[i].mul(tmp.preQUGlobalSpeed)))
        let unls = FERMIONS.getUnlLength(i)
        for (let x = 0; x < FERMIONS.types[i].length; x++) {
            let unl = x < unls
            let f = FERMIONS.types[i][x]
            let id = `f${FERMIONS.names[i]}${x}`
            let fm = f.isMass?formatMass:format

            tmp.el[id+"_div"].setDisplay(unl)

            if (unl) {
                let active = FERMIONS.onActive(i+""+x)
                tmp.el[id+"_div"].setClasses({fermion_btn: true, [FERMIONS.names[i]]: true, choosed: active})
                tmp.el[id+"_nextTier"].setTxt(fm(f.nextTierAt(player.supernova.fermions.tiers[i][x])))
                tmp.el[id+"_tier_scale"].setTxt(getScalingName('fTier', i, x)!=""?"個"+getScalingName('fTier', i, x):getScalingName('fTier', i, x))
                tmp.el[id+"_tier"].setTxt(format(player.supernova.fermions.tiers[i][x],0)+(tmp.fermions.maxTier[i][x] < Infinity?" / "+format(tmp.fermions.maxTier[i][x],0):"") + (tmp.fermions.bonuses[i][x].gt(0)?" + "+tmp.fermions.bonuses[i][x].format():""))
                tmp.el[id+"_desc"].setHTML(f.desc(tmp.fermions.effs[i][x]))

                tmp.el[id+"_cur"].setDisplay(active)
                if (active) {
                    tmp.el[id+"_cur"].setTxt(`目前：${fm(
                        r[i][x]
                    )}`)
                }
            }
        }
    }
}