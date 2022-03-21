var diff = 0;
var date = Date.now();
var player

const ST_NAMES = [
	null, [
		["","U","D","T","Qa","Qt","Sx","Sp","Oc","No"],
		["","Dc","Vg","Tg","Qag","Qtg","Sxg","Spg","Ocg","Nog"],
		["","Ce","De","Te","Qae","Qte","Sxe","Spe","Oce","Noe"],
	],[
		["","Mi","Mc","Na","Pc","Fm","At","Zp","Yc","Xn"],
		["","Me","Du","Tr","Te","Pe","He","Hp","Ot","En"],
		["","c","Ic","TCn","TeC","PCn","HCn","HpC","OCn","ECn"],
		["","Hc","DHe","THt","TeH","PHc","HHe","HpH","OHt","EHc"]
	]
]
const CONFIRMS = ['rp', 'bh', 'atom', 'sn', 'qu']

const FORMS = {
	getPreQUGlobalSpeed() {
        let x = E(1)
        if (tmp.qu.mil_reached[1]) x = x.mul(10)
        if (quUnl()) x = x.mul(tmp.qu.bpEff)
        return x
    },
    massGain() {
        let x = E(1)
        x = x.add(tmp.upgs.mass[1]?tmp.upgs.mass[1].eff.eff:1)
        if (player.ranks.rank.gte(6)) x = x.mul(RANKS.effect.rank[6]())
        if (player.ranks.rank.gte(13)) x = x.mul(3)
        x = x.mul(tmp.tickspeedEffect.eff||E(1))
        if (player.bh.unl) x = x.mul(tmp.bh.effect)
        if (player.mainUpg.bh.includes(10)) x = x.mul(tmp.upgs.main?tmp.upgs.main[2][10].effect:E(1))
        x = x.mul(tmp.atom.particles[0].powerEffect.eff1)
        x = x.mul(tmp.atom.particles[1].powerEffect.eff2)
        if (player.ranks.rank.gte(380)) x = x.mul(RANKS.effect.rank[380]())
        x = x.mul(tmp.stars.effect)
        if (hasTree("m1")) x = x.mul(tmp.supernova.tree_eff.m1)

        x = x.mul(tmp.bosons.effect.pos_w[0])

        if (player.ranks.tier.gte(2)) x = x.pow(1.15)
        if (player.ranks.rank.gte(180)) x = x.pow(1.025)
        if (!CHALS.inChal(3) || CHALS.inChal(10) || FERMIONS.onActive("03")) x = x.pow(tmp.chal.eff[3])
        if (player.md.active || CHALS.inChal(10) || FERMIONS.onActive("02") || FERMIONS.onActive("03") || CHALS.inChal(11)) {
            x = expMult(x,tmp.md.pen)
            if (hasElement(28)) x = x.pow(1.5)
        }
        if (CHALS.inChal(9) || FERMIONS.onActive("12")) x = expMult(x,0.9)
        return x.softcap(tmp.massSoftGain,tmp.massSoftPower,0)
        .softcap(tmp.massSoftGain2,tmp.massSoftPower2,0)
        .softcap(tmp.massSoftGain3,tmp.massSoftPower3,0)
        .softcap(tmp.massSoftGain4,tmp.massSoftPower4,0)
    },
    massSoftGain() {
        let s = E(1.5e156)
        if (CHALS.inChal(3) || CHALS.inChal(10) || FERMIONS.onActive("03")) s = s.div(1e150)
        if (CHALS.inChal(4) || CHALS.inChal(10) || FERMIONS.onActive("03")) s = s.div(1e100)
        if (player.mainUpg.bh.includes(7)) s = s.mul(tmp.upgs.main?tmp.upgs.main[2][7].effect:E(1))
        if (player.mainUpg.rp.includes(13)) s = s.mul(tmp.upgs.main?tmp.upgs.main[1][13].effect:E(1))
        return s.min(tmp.massSoftGain2||1/0)
    },
    massSoftPower() {
        let p = E(1/3)
        if (CHALS.inChal(3) || CHALS.inChal(10) || FERMIONS.onActive("03")) p = p.mul(4)
        if (CHALS.inChal(7) || CHALS.inChal(10)) p = p.mul(6)
        if (player.mainUpg.bh.includes(11)) p = p.mul(0.9)
        if (player.ranks.rank.gte(800)) p = p.mul(RANKS.effect.rank[800]())
        return E(1).div(p.add(1))
    },
    massSoftGain2() {
        let s = E('1.5e1000056')
        if (hasTree("m2")) s = s.pow(1.5)
        if (hasTree("m2")) s = s.pow(tmp.supernova.tree_eff.m3)
        if (player.ranks.tetr.gte(8)) s = s.pow(1.5)

        s = s.pow(tmp.bosons.effect.neg_w[0])

        return s.min(tmp.massSoftGain3||1/0)
    },
    massSoftPower2() {
        let p = E(0.25)
        if (hasElement(51)) p = p.pow(0.9)
        return p
    },
    massSoftGain3() {
        let s = uni("ee8")
        if (hasTree("m3")) s = s.pow(tmp.supernova.tree_eff.m3)
        s = s.pow(tmp.radiation.bs.eff[2])
        return s
    },
    massSoftPower3() {
        let p = E(0.2)
        if (hasElement(77)) p = p.pow(0.825)
        return p
    },
    massSoftGain4() {
        let s = mlt(1e4)
        if (player.ranks.pent.gte(8)) s = s.pow(RANKS.effect.pent[8]())
        return s
    },
    massSoftPower4() {
        let p = E(0.1)
        return p
    },
    tickspeed: {
        cost(x=player.tickspeed) { return E(2).pow(x).floor() },
        can() { return player.rp.points.gte(tmp.tickspeedCost) && !CHALS.inChal(2) && !CHALS.inChal(6) && !CHALS.inChal(10) },
        buy() {
            if (this.can()) {
                if (!player.mainUpg.atom.includes(2)) player.rp.points = player.rp.points.sub(tmp.tickspeedCost).max(0)
                player.tickspeed = player.tickspeed.add(1)
            }
        },
        buyMax() { 
            if (this.can()) {
                if (!player.mainUpg.atom.includes(2)) player.rp.points = player.rp.points.sub(tmp.tickspeedCost).max(0)
                player.tickspeed = tmp.tickspeedBulk
            }
        },
        effect() {
            let t = player.tickspeed
            if (hasElement(63)) t = t.mul(25)
            t = t.mul(tmp.prim.eff[1][1])
            t = t.mul(tmp.radiation.bs.eff[1])
            let bonus = E(0)
            if (player.atom.unl) bonus = bonus.add(tmp.atom.atomicEff)
            let step = E(1.5)
                step = step.add(tmp.chal.eff[6])
                step = step.add(tmp.chal.eff[2])
                step = step.add(tmp.atom.particles[0].powerEffect.eff2)
                if (player.ranks.tier.gte(4)) step = step.add(RANKS.effect.tier[4]())
                if (player.ranks.rank.gte(40)) step = step.add(RANKS.effect.rank[40]())
                step = step.mul(tmp.md.mass_eff)
            step = step.mul(tmp.bosons.effect.z_boson[0])
            step = step.pow(tmp.qu.chroma_eff[0])
            if (hasTree("t1")) step = step.pow(1.15)

            let ss = E(1e50).mul(tmp.radiation.bs.eff[13])
            step = step.softcap(ss,0.1,0)
            
            let eff = step.pow(t.add(bonus).mul(hasElement(80)?25:1))
            if (hasElement(18)) eff = eff.pow(tmp.elements.effect[18])
            if (player.ranks.tetr.gte(3)) eff = eff.pow(1.05)
            return {step: step, eff: eff, bonus: bonus}
        },
        autoUnl() { return player.mainUpg.bh.includes(5) },
        autoSwitch() { player.autoTickspeed = !player.autoTickspeed },
    },
    rp: {
        gain() {
            if (player.mass.lt(1e15) || CHALS.inChal(7) || CHALS.inChal(10)) return E(0)
            let gain = player.mass.div(1e15).root(3)
            if (player.ranks.rank.gte(14)) gain = gain.mul(2)
            if (player.ranks.rank.gte(45)) gain = gain.mul(RANKS.effect.rank[45]())
            if (player.ranks.tier.gte(6)) gain = gain.mul(RANKS.effect.tier[6]())
            if (player.mainUpg.bh.includes(6)) gain = gain.mul(tmp.upgs.main?tmp.upgs.main[2][6].effect:E(1))
            gain = gain.mul(tmp.atom.particles[1].powerEffect.eff1)
            if (hasTree("rp1")) gain = gain.mul(tmp.supernova.tree_eff.rp1)
            if (player.mainUpg.bh.includes(8)) gain = gain.pow(1.15)
            gain = gain.pow(tmp.chal.eff[4])
            if (CHALS.inChal(4) || CHALS.inChal(10) || FERMIONS.onActive("03")) gain = gain.root(10)
            gain = gain.pow(tmp.prim.eff[1][0])

            if (player.md.active || CHALS.inChal(10) || FERMIONS.onActive("02") || FERMIONS.onActive("03") || CHALS.inChal(11)) gain = expMult(gain,tmp.md.pen)
            return gain.floor()
        },
        reset() {
            if (tmp.rp.can) if (player.confirms.rp?confirm("你確定要重置嗎？"):true) {
                player.rp.points = player.rp.points.add(tmp.rp.gain)
                player.rp.unl = true
                this.doReset()
            }
        },
        doReset() {
            player.ranks[RANKS.names[RANKS.names.length-1]] = E(0)
            RANKS.doReset[RANKS.names[RANKS.names.length-1]]()
        },
    },
    bh: {
        see() { return player.rp.unl },
        DM_gain() {
            let gain = player.rp.points.div(1e20)
            if (CHALS.inChal(7) || CHALS.inChal(10)) gain = player.mass.div(1e180)
            if (gain.lt(1)) return E(0)
            gain = gain.root(4)

            if (hasTree("bh1")) gain = gain.mul(tmp.supernova.tree_eff.bh1)
            gain = gain.mul(tmp.bosons.upgs.photon[0].effect)

            if (CHALS.inChal(7) || CHALS.inChal(10)) gain = gain.root(6)
            gain = gain.mul(tmp.atom.particles[2].powerEffect.eff1)
            if (CHALS.inChal(8) || CHALS.inChal(10) || FERMIONS.onActive("12")) gain = gain.root(8)
            gain = gain.pow(tmp.chal.eff[8])
            gain = gain.pow(tmp.prim.eff[2][0])

            if (player.md.active || CHALS.inChal(10) || FERMIONS.onActive("02") || FERMIONS.onActive("03") || CHALS.inChal(11)) gain = expMult(gain,tmp.md.pen)
            return gain.floor()
        },
        massPowerGain() {
            let x = E(0.33)
            if (FERMIONS.onActive("11")) return E(-1)
            if (hasElement(59)) x = E(0.45)
			x = x.add(tmp.radiation.bs.eff[4])
            return x
        },
        massGain() {
            let x = tmp.bh.f
            .mul(this.condenser.effect().eff)
            if (player.mainUpg.rp.includes(11)) x = x.mul(tmp.upgs.main?tmp.upgs.main[1][11].effect:E(1))
            if (player.mainUpg.bh.includes(14)) x = x.mul(tmp.upgs.main?tmp.upgs.main[2][14].effect:E(1))
            if (hasElement(46)) x = x.mul(tmp.elements.effect[46])
            x = x.mul(tmp.bosons.upgs.photon[0].effect)
            if (CHALS.inChal(8) || CHALS.inChal(10) || FERMIONS.onActive("12")) x = x.root(8)
            x = x.pow(tmp.chal.eff[8])
            if (player.md.active || CHALS.inChal(10) || FERMIONS.onActive("02") || FERMIONS.onActive("03") || CHALS.inChal(11)) x = expMult(x,tmp.md.pen)
            return x.softcap(tmp.bh.massSoftGain, tmp.bh.massSoftPower, 0)
        },
        f() {
            let x = player.bh.mass.add(1).pow(tmp.bh.massPowerGain).softcap(tmp.bh.fSoftStart,tmp.bh.fSoftPower,2)
            return x
        },
        fSoftStart() {
            let x = uni("e3e9")
            if (hasElement(71)) x = x.pow(tmp.elements.effect[71])
            x = x.pow(tmp.radiation.bs.eff[20])
            return x
        },
        fSoftPower() {
            let x = 0.95
            if (hasTree("qu3")) x **= 0.7
            return x
        },
        massSoftGain() {
            let s = E(1.5e156)
            if (player.mainUpg.atom.includes(6)) s = s.mul(tmp.upgs.main?tmp.upgs.main[3][6].effect:E(1))
            return s
        },
        massSoftPower() {
            let p = E(1)
            return E(1).div(p.add(1))
        },
        reset() {
            if (tmp.bh.dm_can) if (player.confirms.bh?confirm("Are you sure to reset?"):true) {
                player.bh.dm = player.bh.dm.add(tmp.bh.dm_gain)
                player.bh.unl = true
                this.doReset()
            }
        },
        doReset() {
            let keep = []
            for (let x = 0; x < player.mainUpg.rp.length; x++) if ([3,5,6].includes(player.mainUpg.rp[x])) keep.push(player.mainUpg.rp[x])
            player.mainUpg.rp = keep
            player.rp.points = E(0)
            player.tickspeed = E(0)
            player.bh.mass = E(0)
            FORMS.rp.doReset()
        },
        effect() {
            let x = player.mainUpg.atom.includes(12)
            ?player.bh.mass.add(1).pow(1.25)
            :player.bh.mass.add(1).root(4)
            return x//.softcap("ee14",0.95,2)
        },
        condenser: {
            autoSwitch() { player.bh.autoCondenser = !player.bh.autoCondenser },
            autoUnl() { return player.mainUpg.atom.includes(2) },
            can() { return player.bh.dm.gte(tmp.bh.condenser_cost) && !CHALS.inChal(6) && !CHALS.inChal(10) },
            buy() {
                if (this.can()) {
                    player.bh.dm = player.bh.dm.sub(tmp.bh.condenser_cost).max(0)
                    player.bh.condenser = player.bh.condenser.add(1)
                }
            },
            buyMax() {
                if (this.can()) {
                    player.bh.condenser = tmp.bh.condenser_bulk
                    player.bh.dm = player.bh.dm.sub(tmp.bh.condenser_cost).max(0)
                }
            },
            effect() {
                let t = player.bh.condenser
                t = t.mul(tmp.radiation.bs.eff[5])
                let pow = E(2)
                    pow = pow.add(tmp.chal.eff[6])
                    if (player.mainUpg.bh.includes(2)) pow = pow.mul(tmp.upgs.main?tmp.upgs.main[2][2].effect:E(1))
                    pow = pow.add(tmp.atom.particles[2].powerEffect.eff2)
                    if (player.mainUpg.atom.includes(11)) pow = pow.mul(tmp.upgs.main?tmp.upgs.main[3][11].effect:E(1))
                    pow = pow.mul(tmp.bosons.upgs.photon[1].effect)
					pow = pow.mul(tmp.prim.eff[2][1])
                    if (hasTree("bh2")) pow = pow.pow(1.15)
                
                let eff = pow.pow(t.add(tmp.bh.condenser_bonus))
                return {pow: pow, eff: eff}
            },
            bonus() {
                let x = E(0)
                if (player.mainUpg.bh.includes(15)) x = x.add(tmp.upgs.main?tmp.upgs.main[2][15].effect:E(0))
                return x
            },
        },
    },
    reset_msg: {
        msgs: {
            rp: "到達 1e9 tonne 的質量後，可以重置以往功能以獲得怒氣點",
            dm: "到達 1e20 怒氣點後，可以重置以往功能以獲得暗物質",
            atom: "到達 1e100 uni 的黑洞後，可以重置以往所有功能以獲得原子和夸克",
            md: "膨脹質量，然後取消",
        },
        set(id) {
            if (id=="sn") {
                player.reset_msg = "到達 "+format(tmp.supernova.maxlimit)+" 塌縮恆星以成為超新星"
                return
            }
            if (id=="qu") {
                player.reset_msg = "到達 "+formatMass(mlt(1e4))+" 質量以量子化"
                return
            }
            player.reset_msg = this.msgs[id]
        },
        reset() { player.reset_msg = "" },
    },
}

const UPGS = {
    mass: {
        cols: 3,
        autoOnly: [0,1,2],
        temp() {
            if (!tmp.upgs.mass) tmp.upgs.mass = {}
            for (let x = this.cols; x >= 1; x--) {
                if (!tmp.upgs.mass[x]) tmp.upgs.mass[x] = {}
                let data = this.getData(x)
                tmp.upgs.mass[x].cost = data.cost
                tmp.upgs.mass[x].bulk = data.bulk
                
                tmp.upgs.mass[x].bonus = this[x].bonus?this[x].bonus():E(0)
                tmp.upgs.mass[x].eff = this[x].effect(player.massUpg[x]||E(0))
                tmp.upgs.mass[x].effDesc = this[x].effDesc(tmp.upgs.mass[x].eff)
            }
        },
        autoSwitch(x) {
            player.autoMassUpg[x] = !player.autoMassUpg[x]
        },
        buy(x, manual=false) {
            let cost = manual ? this.getData(x).cost : tmp.upgs.mass[x].cost
            if (player.mass.gte(cost)) {
                if (!player.mainUpg.bh.includes(1)) player.mass = player.mass.sub(cost)
                if (!player.massUpg[x]) player.massUpg[x] = E(0)
                player.massUpg[x] = player.massUpg[x].add(1)
            }
        },
        buyMax(x) {
            let bulk = tmp.upgs.mass[x].bulk
            let cost = tmp.upgs.mass[x].cost
            if (player.mass.gte(cost)) {
                if (!player.massUpg[x]) player.massUpg[x] = E(0)
                player.massUpg[x] = player.massUpg[x].max(bulk.floor().max(player.massUpg[x].plus(1)))
                if (!player.mainUpg.bh.includes(1)) player.mass = player.mass.sub(cost)
            }
        },
        getData(i) {
            let upg = this[i]
            let inc = upg.inc
            if (i == 1 && player.ranks.rank.gte(2)) inc = inc.pow(0.8)
            if (i == 2 && player.ranks.rank.gte(3)) inc = inc.pow(0.8)
            if (i == 3 && player.ranks.rank.gte(4)) inc = inc.pow(0.8)
            if (player.ranks.tier.gte(3)) inc = inc.pow(0.8)
            let lvl = player.massUpg[i]||E(0)
            let cost = inc.pow(lvl).mul(upg.start)
            let bulk = player.mass.div(upg.start).max(1).log(inc).add(1).floor()
            if (player.mass.lt(upg.start)) bulk = E(0)

            if (scalingActive("massUpg", lvl.max(bulk), "super")) {
                let start = getScalingStart("super", "massUpg");
                let power = getScalingPower("super", "massUpg");
                let exp = E(2.5).pow(power);
                cost =
                    inc.pow(
                        lvl.pow(exp).div(start.pow(exp.sub(1)))
                    ).mul(upg.start)
                bulk = player.mass
                    .div(upg.start)
                    .max(1)
                    .log(inc)
                    .times(start.pow(exp.sub(1)))
                    .root(exp)
                    .add(1)
                    .floor();
            }
            if (scalingActive("massUpg", lvl.max(bulk), "hyper")) {
                let start = getScalingStart("super", "massUpg");
                let power = getScalingPower("super", "massUpg");
                let start2 = getScalingStart("hyper", "massUpg");
                let power2 = getScalingPower("hyper", "massUpg");
                let exp = E(2.5).pow(power);
                let exp2 = E(5).pow(power);
                cost =
                    inc.pow(
                        lvl.pow(exp2).div(start2.pow(exp2.sub(1))).pow(exp).div(start.pow(exp.sub(1)))
                    ).mul(upg.start)
                bulk = player.mass
                    .div(upg.start)
                    .max(1)
                    .log(inc)
                    .times(start.pow(exp.sub(1)))
                    .root(exp)
                    .times(start2.pow(exp2.sub(1)))
                    .root(exp2)
                    .add(1)
                    .floor();
            }
            return {cost: cost, bulk: bulk}
        },
        1: {
            unl() { return player.ranks.rank.gte(1) || player.mainUpg.atom.includes(1) },
            title: "提重器",
            start: E(10),
            inc: E(1.5),
            effect(x) {
                let step = E(1)
                if (player.ranks.rank.gte(3)) step = step.add(RANKS.effect.rank[3]())
                step = step.mul(tmp.upgs.mass[2]?tmp.upgs.mass[2].eff.eff:1)
                let ret = step.mul(x.add(tmp.upgs.mass[1].bonus))
                return {step: step, eff: ret}
            },
            effDesc(eff) {
                return {
                    step: "+"+formatMass(eff.step),
                    eff: "質量獲得量 +"+formatMass(eff.eff)
                }
            },
            bonus() {
                let x = E(0)
                if (player.mainUpg.rp.includes(1)) x = x.add(tmp.upgs.main?tmp.upgs.main[1][1].effect:E(0))
                if (player.mainUpg.rp.includes(2)) x = x.add(tmp.upgs.mass[2].bonus)
                return x
            },
        },
        2: {
            unl() { return player.ranks.rank.gte(2) || player.mainUpg.atom.includes(1) },
            title: "提升器",
            start: E(100),
            inc: E(4),
            effect(x) {
                let step = E(2)
                if (player.ranks.rank.gte(5)) step = step.add(RANKS.effect.rank[5]())
                step = step.pow(tmp.upgs.mass[3]?tmp.upgs.mass[3].eff.eff:1)
                let ret = step.mul(x.add(tmp.upgs.mass[2].bonus)).add(1)//.softcap("ee14",0.95,2)
                return {step: step, eff: ret}
            },
            effDesc(eff) {
                return {
                    step: "+"+format(eff.step)+"x",
                    eff: "提重器力量 x"+format(eff.eff)
                }
            },
            bonus() {
                let x = E(0)
                if (player.mainUpg.rp.includes(2)) x = x.add(tmp.upgs.main?tmp.upgs.main[1][2].effect:E(0))
                if (player.mainUpg.rp.includes(7)) x = x.add(tmp.upgs.mass[3].bonus)
                return x
            },
        },
        3: {
            unl() { return player.ranks.rank.gte(3) || player.mainUpg.atom.includes(1) },
            title: "增强器",
            start: E(1000),
            inc: E(9),
            effect(x) {
                let ss = E(10)
                if (player.ranks.rank.gte(34)) ss = ss.add(2)
                if (player.mainUpg.bh.includes(9)) ss = ss.add(tmp.upgs.main?tmp.upgs.main[2][9].effect:E(0))
                let step = E(1).add(RANKS.effect.tetr[2]())
                if (player.mainUpg.rp.includes(9)) step = step.add(0.25)
                if (player.mainUpg.rp.includes(12)) step = step.add(tmp.upgs.main?tmp.upgs.main[1][12].effect:E(0))
                if (hasElement(4)) step = step.mul(tmp.elements.effect[4])
                if (player.md.upgs[3].gte(1)) step = step.mul(tmp.md.upgs[3].eff)
                let sp = 0.5
                if (player.mainUpg.atom.includes(9)) sp *= 1.15
                if (player.ranks.tier.gte(30)) sp *= 1.1
                let ret = step.mul(x.add(tmp.upgs.mass[3].bonus).mul(hasElement(80)?25:1)).add(1).softcap(ss,sp,0).softcap(1.8e5,0.5,0)//.softcap(1e14,0.1,0)
                ret = ret.mul(tmp.prim.eff[0])
                return {step: step, eff: ret, ss: ss}
            },
            effDesc(eff) {
                return {
                    step: "+^"+format(eff.step),
                    eff: "提升器力量 ^"+format(eff.eff)+(eff.eff.gte(eff.ss)?`<span class='soft'>（軟限制${eff.eff.gte(1.8e5)?"^2":""}）</span>`:"")
                }
            },
            bonus() {
                let x = E(0)
                if (player.mainUpg.rp.includes(7)) x = x.add(tmp.upgs.main?tmp.upgs.main[1][7].effect:0)
                return x
            },
        },
    },
    main: {
        temp() {
            if (!tmp.upgs.main) tmp.upgs.main = {}
            for (let x = 1; x <= UPGS.main.cols; x++) {
                if (!tmp.upgs.main[x]) tmp.upgs.main[x] = {}
                for (let y = 1; y <= UPGS.main[x].lens; y++) if (UPGS.main[x][y].effDesc) tmp.upgs.main[x][y] = { effect: UPGS.main[x][y].effect(), effDesc: UPGS.main[x][y].effDesc() }
            }
        },
        ids: [null, 'rp', 'bh', 'atom'],
        cols: 3,
        over(x,y) { player.main_upg_msg = [x,y] },
        reset() { player.main_upg_msg = [0,0] },
        1: {
            title: "怒氣升級",
            res: "怒氣點",
            unl() { return player.rp.unl },
            can(x) { return player.rp.points.gte(this[x].cost) && !player.mainUpg.rp.includes(x) },
            buy(x) {
                if (this.can(x)) {
                    player.rp.points = player.rp.points.sub(this[x].cost)
                    player.mainUpg.rp.push(x)
                }
            },
            auto_unl() { return player.mainUpg.bh.includes(5) },
            lens: 15,
            1: {
                desc: "提升器增加提重器。",
                cost: E(1),
                effect() {
                    let ret = E(player.massUpg[2]||0)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)+" 提重器"
                },
            },
            2: {
                desc: "增强器增加提升器。",
                cost: E(10),
                effect() {
                    let ret = E(player.massUpg[3]||0)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)+" 提升器"
                },
            },
            3: {
                desc: "你可以自動購買質量升級。",
                cost: E(25),
            },
            4: {
                desc: "等級不再重置任何東西。",
                cost: E(50),
            },
            5: {
                desc: "你可以自動升等級。",
                cost: E(1e4),
            },
            6: {
                desc: "你可以自動升階。",
                cost: E(1e5),
            },
            7: {
                desc: "每擁有 3 個時間速度，增加 1 個增强器。",
                cost: E(1e7),
                effect() {
                    let ret = player.tickspeed.div(3).add(hasElement(38)?tmp.elements.effect[38]:0).floor()
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)+" 增强器"
                },
            },
            8: {
                desc: "怒氣點減輕超級質量升級價格增幅。",
                cost: E(1e15),
                effect() {
                    let ret = E(0.9).pow(player.rp.points.max(1).log10().max(1).log10().pow(1.25).softcap(2.5,0.5,0))
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "弱 "+format(E(1).sub(x).mul(100))+"%"+(x.log(0.9).gte(2.5)?"<span class='soft'>（軟限制）</span>":"")
                },
            },
            9: {
                unl() { return player.bh.unl },
                desc: "增强器力量增加 ^0.25。",
                cost: E(1e31),
            },
            10: {
                unl() { return player.bh.unl },
                desc: "超級等級價格增幅減弱 20%。",
                cost: E(1e43),
            },
            11: {
                unl() { return player.chal.unl },
                desc: "怒氣點加强黑洞質量獲得量。",
                cost: E(1e72),
                effect() {
                    let ret = player.rp.points.add(1).root(10).softcap('e4000',0.1,0)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"+(x.gte("e4000")?"<span class='soft'>（軟限制）</span>":"")
                },
            },
            12: {
                unl() { return player.chal.unl },
                desc: "怒氣點的數量級稍微加强增强器力量。",
                cost: E(1e120),
                effect() {
                    let ret = player.rp.points.max(1).log10().softcap(200,0.75,0).div(1000)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+^"+format(x)+(x.gte(0.2)?"<span class='soft'>（軟限制）</span>":"")
                },
            },
            13: {
                unl() { return player.chal.unl },
                desc: "每擁有一個等級，質量軟限制延遲 3x。",
                cost: E(1e180),
                effect() {
                    let ret = E(3).pow(player.ranks.rank)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "x"+format(x)
                },
            },
            14: {
                unl() { return player.atom.unl },
                desc: "高級時間速度價格增幅延遲 50 個。",
                cost: E('e320'),
            },
            15: {
                unl() { return player.atom.unl },
                desc: "質量加强原子獲得量。",
                cost: E('e480'),
                effect() {
                    let ret = player.mass.max(1).log10().pow(1.25)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "x"+format(x)
                },
            },
        },
        2: {
            title: "黑洞升級",
            res: "暗物質",
            unl() { return player.bh.unl },
            auto_unl() { return player.mainUpg.atom.includes(2) },
            can(x) { return player.bh.dm.gte(this[x].cost) && !player.mainUpg.bh.includes(x) },
            buy(x) {
                if (this.can(x)) {
                    player.bh.dm = player.bh.dm.sub(this[x].cost)
                    player.mainUpg.bh.push(x)
                }
            },
            lens: 15,
            1: {
                desc: "質量升級不再花費質量。",
                cost: E(1),
            },
            2: {
                desc: "時間速度加强黑洞壓縮器力量。",
                cost: E(10),
                effect() {
                    let ret = player.tickspeed.add(1).root(8)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            3: {
                desc: "黑洞的質量延遲超級質量升級價格增幅。",
                cost: E(100),
                effect() {
                    let ret = player.bh.mass.max(1).log10().pow(1.5).softcap(100,1/3,0).floor()
                    return ret.min(400)
                },
                effDesc(x=this.effect()) {
                    return "延遲 +"+format(x,0)+(x.gte(100)?"<span class='soft'>（軟限制）</span>":"")
                },
            },
            4: {
                desc: "階不再重置任何東西。",
                cost: E(1e4),
            },
            5: {
                desc: "你可以自動購買時間速度和怒氣點升級。",
                cost: E(5e5),
            },
            6: {
                desc: "每秒獲得重置時獲得的怒氣點的 100%。黑洞質量加强怒氣點獲得量。",
                cost: E(2e6),
                effect() {
                    let ret = player.bh.mass.max(1).log10().add(1).pow(2)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            7: {
                unl() { return player.chal.unl },
                desc: "黑洞質量延遲質量軟限制。",
                cost: E(1e13),
                effect() {
                    let ret = player.bh.mass.add(1).root(3)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "延遲 "+format(x)+"x"
                },
            },
            8: {
                unl() { return player.chal.unl },
                desc: "將怒氣點獲得量加以 1.15 的次方。",
                cost: E(1e17),
            },
            9: {
                unl() { return player.chal.unl },
                desc: "未花費暗物質延遲增强器效果的軟限制。",
                cost: E(1e27),
                effect() {
                    let ret = player.bh.dm.max(1).log10().pow(0.5)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x)+" later"
                },
            },
            10: {
                unl() { return player.chal.unl },
                desc: "暗物質的數量級加强質量獲得量。",
                cost: E(1e33),
                effect() {
                    let ret = E(2).pow(player.bh.dm.add(1).log10().softcap(11600,0.5,0))
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"+(x.max(1).log2().gte(11600)?"<span class='soft'>（軟限制）</span>":"")
                },
            },
            11: {
                unl() { return player.atom.unl },
                desc: "質量軟限制減弱 10%、",
                cost: E(1e80),
            },
            12: {
                unl() { return player.atom.unl },
                desc: "高級質量升級和時間速度價格增幅減弱 15%。",
                cost: E(1e120),
            },
            13: {
                unl() { return player.atom.unl },
                desc: "夸克獲得量乘以 10。",
                cost: E(1e180),
            },
            14: {
                unl() { return player.atom.unl },
                desc: "中子力加强黑洞質量獲得量。",
                cost: E(1e210),
                effect() {
                    let ret = player.atom.powers[1].add(1).pow(2)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            15: {
                unl() { return player.atom.unl },
                desc: "原子力量稍微增加黑洞壓縮器。",
                cost: E('e420'),
                effect() {
                    let ret = player.atom.atomic.add(1).log(5)
                    return ret.floor()
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)
                },
            },
        },
        3: {
            title: "原子升級",
            res: "原子",
            unl() { return player.atom.unl },
            can(x) { return player.atom.points.gte(this[x].cost) && !player.mainUpg.atom.includes(x) },
            buy(x) {
                if (this.can(x)) {
                    player.atom.points = player.atom.points.sub(this[x].cost)
                    player.mainUpg.atom.push(x)
                }
            },
            auto_unl() { return hasTree("qol1") },
            lens: 12,
            1: {
                desc: "開始時解鎖質量升級。",
                cost: E(1),
            },
            2: {
                desc: "你可以自動購買黑洞壓縮器和升級。時間速度不再花費怒氣點。",
                cost: E(100),
            },
            3: {
                desc: "[層的紀元] 解鎖層。",
                cost: E(25000),
            },
            4: {
                desc: "重置時保留挑戰 1-4。黑洞壓縮器稍微加强宇宙射線力量。",
                cost: E(1e10),
                effect() {
                    let ret = player.bh.condenser.pow(0.8).mul(0.01)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x)+"x"
                },
            },
            5: {
                desc: "你可以自動升層。超級階延遲 10 個。",
                cost: E(1e16),
            },
            6: {
                desc: "每秒獲得重置時獲得的暗物質的 100%。原子力量延遲黑洞質量軟限制。",
                cost: E(1e18),
                effect() {
                    let ret = player.atom.atomic.add(1).pow(0.5)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "延遲 "+format(x)+"x"
                },
            },
            7: {
                desc: "時間速度加强每個粒子力的獲得量。",
                cost: E(1e25),
                effect() {
                    let ret = E(1.025).pow(player.tickspeed)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            8: {
                desc: "原子力量加强夸克獲得量。",
                cost: E(1e35),
                effect() {
                    let ret = player.atom.atomic.max(1).log10().add(1)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            9: {
                desc: "增强器效果軟限制減弱 15%。",
                cost: E(2e44),
            },
            10: {
                desc: "階需求減半。階數延遲高級等級價格增幅。",
                cost: E(5e47),
                effect() {
                    let ret = player.ranks.tier.mul(2).floor()
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "延遲 +"+format(x,0)
                },
            },
            11: {
                unl() { return MASS_DILATION.unlocked() },
                desc: "膨脹質量稍微加强黑洞壓縮器和宇宙射線力量。",
                cost: E('e1640'),
                effect() {
                    let ret = player.md.mass.max(1).log10().add(1).pow(0.1)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"
                },
            },
            12: {
                unl() { return MASS_DILATION.unlocked() },
                desc: "黑洞質量效果更强。",
                cost: E('e2015'),
                effect() {
                    let ret = E(1)
                    return ret
                },
            },
        },
    },
}

/*
1: {
    desc: "Placeholder.",
    cost: E(1),
    effect() {
        let ret = E(1)
        return ret
    },
    effDesc(x=this.effect()) {
        return format(x)+"x"
    },
},
*/

function loop() {
    diff = Date.now()-date;
    ssf[1]()
    updateTemp()
    updateHTML()
    calc(diff/1000*tmp.offlineMult,diff/1000);
    date = Date.now();
    player.offline.current = date
}

function format(ex, acc=4, max=12, type=player.options.notation) {
    ex = E(ex)
    neg = ex.lt(0)?"-":""
    if (ex.mag == Infinity) return neg + '無限'
    if (Number.isNaN(ex.mag)) return neg + 'NaN'
    if (ex.lt(0)) ex = ex.mul(-1)
    if (ex.eq(0)) return ex.toFixed(acc)
    let e = ex.log10().floor()
    switch (type) {
        case "sc":
            if (ex.log10().lt(Math.min(-acc,0)) && acc > 0) {
                let e = ex.log10().ceil()
                let m = ex.div(e.eq(-1)?E(0.1):E(10).pow(e))
                let be = e.mul(-1).max(1).log10().gte(9)
                return neg+(be?'':m.toFixed(4))+'e'+format(e, 0, max, "sc")
            } else if (e.lt(max)) {
                let a = Math.max(Math.min(acc-e.toNumber(), acc), 0)
                return neg+(a>0?ex.toFixed(a):ex.toFixed(a).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'))
            } else {
                if (ex.gte("eeee10")) {
                    let slog = ex.slog()
                    return (slog.gte(1e9)?'':E(10).pow(slog.sub(slog.floor())).toFixed(4)) + "F" + format(slog.floor(), 0)
                }
                let m = ex.div(E(10).pow(e))
                let be = e.log10().gte(9)
                return neg+(be?'':m.toFixed(4))+'e'+format(e, 0, max, "sc")
            }
        case "st":
            let e3 = ex.log(1e3).floor()
			if (e3.lt(1)) {
				return neg+ex.toFixed(Math.max(Math.min(acc-e.toNumber(), acc), 0))
			} else {
				let e3_mul = e3.mul(3)
				let ee = e3.log10().floor()
				if (ee.gte(3000)) return "e"+format(e, acc, max, "st")

				let final = ""
				if (e3.lt(4)) final = ["", "K", "M", "B"][Math.round(e3.toNumber())]
				else {
					let ee3 = Math.floor(e3.log(1e3).toNumber())
					if (ee3 < 100) ee3 = Math.max(ee3 - 1, 0)
					e3 = e3.sub(1).div(E(10).pow(ee3*3))
					while (e3.gt(0)) {
						let div1000 = e3.div(1e3).floor()
						let mod1000 = e3.sub(div1000.mul(1e3)).floor().toNumber()
						if (mod1000 > 0) {
							if (mod1000 == 1 && !ee3) final = "U"
							if (ee3) final = FORMATS.standard.tier2(ee3) + (final ? "-" + final : "")
							if (mod1000 > 1) final = FORMATS.standard.tier1(mod1000) + final
						}
						e3 = div1000
						ee3++
					}
				}

				let m = ex.div(E(10).pow(e3_mul))
				return neg+(ee.gte(10)?'':(m.toFixed(E(3).sub(e.sub(e3_mul)).add(acc==0?0:1).toNumber()))+' ')+final
			}
        default:
            return neg+FORMATS[type].format(ex, acc, max)
    }
}

function turnOffline() { player.offline.active = !player.offline.active }

function formatMass(ex) {
    ex = E(ex)
    if (ex.gte(E(1.5e56).mul('ee9'))) return format(ex.div(1.5e56).log10().div(1e9)) + ' mlt'
    if (ex.gte(1.5e56)) return format(ex.div(1.5e56)) + ' uni'
    if (ex.gte(2.9835e45)) return format(ex.div(2.9835e45)) + ' MMWG'
    if (ex.gte(1.989e33)) return format(ex.div(1.989e33)) + ' M☉'
    if (ex.gte(5.972e27)) return format(ex.div(5.972e27)) + ' M⊕'
    if (ex.gte(1.619e20)) return format(ex.div(1.619e20)) + ' MME'
    if (ex.gte(1e6)) return format(ex.div(1e6)) + ' tonne'
    if (ex.gte(1e3)) return format(ex.div(1e3)) + ' kg'
    return format(ex) + ' g'
}

function formatGain(amt, gain, isMass=false) {
    let f = isMass?formatMass:format
    let next = amt.add(gain)
    let rate
    if (next.div(amt).gte(10) && amt.gte(1e100)) {
        let ooms = next.div(amt).log10().mul(20)
        if (isMass && amt.gte(mlt(1)) && ooms.gte(1e6)) rate = "（+"+format(ooms.div(1e9)) + " mlt/秒）"
        else rate = "（x"+format(ooms) + "/秒）"
    }
    else rate = "（+"+f(gain)+"/秒）"
    return rate
}

function formatTime(ex,type="s") {
    ex = E(ex)
    if (ex.gte(86400)) return format(ex.div(86400).floor(),0)+":"+formatTime(ex.mod(86400),'d')
    if (ex.gte(3600)||type=="d") return (ex.div(3600).gte(10)||type!="d"?"":"0")+format(ex.div(3600).floor(),0)+":"+formatTime(ex.mod(3600),'h')
    if (ex.gte(60)||type=="h") return (ex.div(60).gte(10)||type!="h"?"":"0")+format(ex.div(60).floor(),0)+":"+formatTime(ex.mod(60),'m')
    return (ex.gte(10)||type!="m" ?"":"0")+format(ex)
}

function expMult(a,b,base=10) { return E(a).gte(1) ? E(base).pow(E(a).log(base).pow(b)) : E(0) }

function capitalFirst(str) {
	if (str=="" || str==" ") return str
	return str
		.split(" ")
		.map(x => x[0].toUpperCase() + x.slice(1))
		.join(" ");
}