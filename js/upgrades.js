const UPGS = {
    mass: {
        cols: 4,
        temp() {
            tmp.massFP = 1;
            for (let x = this.cols; x >= 1; x--) {
                let d = tmp.upgs.mass
                let data = this.getData(x)
                d[x].cost = data.cost
                d[x].bulk = data.bulk
                
                d[x].bonus = this[x].bonus?this[x].bonus():E(0)
                d[x].eff = this[x].effect(player.massUpg[x]||E(0))
                d[x].effDesc = this[x].effDesc(d[x].eff)
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
            let d = tmp.upgs.mass[x]
            let bulk = d.bulk
            let cost = d.cost
            if (player.mass.gte(cost)) {
                let m = player.massUpg[x]
                if (!m) m = E(0)
                m = m.max(bulk.floor().max(m.plus(1)))
                player.massUpg[x] = m
                if (!player.mainUpg.bh.includes(1)) player.mass = player.mass.sub(cost)
            }
        },
        getData(i) {
            let upg = this[i]
            let inc = upg.inc
            let start = upg.start
            let lvl = player.massUpg[i]||E(0)
            let cost, bulk = E(0), fp

            if (i==4) {
                let pow = 1.5
                cost = Decimal.pow(10,Decimal.pow(inc,lvl.scaleEvery('massUpg4').pow(pow)).mul(start))
                if (player.mass.gte('ee100')) bulk = player.mass.max(1).log10().div(start).max(1).log(inc).max(0).root(pow).scaleEvery('massUpg4',true).add(1).floor()
            } else {
                fp = tmp.massFP
                
                if (i == 1 && player.ranks.rank.gte(2)) inc = inc.pow(0.8)
                if (i == 2 && player.ranks.rank.gte(3)) inc = inc.pow(0.8)
                if (i == 3 && player.ranks.rank.gte(4)) inc = inc.pow(0.8)
                if (player.ranks.tier.gte(3)) inc = inc.pow(0.8)
                cost = inc.pow(lvl.div(fp).scaleEvery("massUpg")).mul(start)
                bulk = E(0)
                if (player.mass.gte(start)) bulk = player.mass.div(start).max(1).log(inc).scaleEvery("massUpg",true).mul(fp).add(1).floor()
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
                if (hasElement(209)) ret = ret.pow(elemEffect(209))
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
                x = x.mul(getEnRewardEff(4))
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
                if (hasElement(203)) ret = ret.pow(elemEffect(203))
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
                x = x.mul(getEnRewardEff(4))
                return x
            },
        },
        3: {
            unl() { return player.ranks.rank.gte(3) || player.mainUpg.atom.includes(1) },
            title: "增強器",
            start: E(1000),
            inc: E(9),
            effect(x) {
                let xx = x.add(tmp.upgs.mass[3].bonus)
                if (hasElement(81)) xx = xx.pow(1.1)
                let ss = E(10)
                if (player.ranks.rank.gte(34)) ss = ss.add(2)
                if (player.mainUpg.bh.includes(9)) ss = ss.add(tmp.upgs.main?tmp.upgs.main[2][9].effect:E(0))
                let step = E(1)
                if (player.ranks.tetr.gte(2)) step = step.add(RANKS.effect.tetr[2]())
                if (player.mainUpg.rp.includes(9)) step = step.add(0.25)
                if (player.mainUpg.rp.includes(12)) step = step.add(tmp.upgs.main?tmp.upgs.main[1][12].effect:E(0))
                if (hasElement(4)) step = step.mul(tmp.elements.effect[4])
                if (player.md.upgs[3].gte(1)) step = step.mul(tmp.md.upgs[3].eff)
                step = step.pow(tmp.upgs.mass[4]?tmp.upgs.mass[4].eff.eff:1)

                let sp = 0.5
                if (player.mainUpg.atom.includes(9)) sp *= 1.15
                if (player.ranks.tier.gte(30)) sp *= 1.1
                let sp2 = 0.1
                let ss2 = E(5e15)
                let sp3 = hasPrestige(0,12)?0.525:0.5
                if (hasElement(85)) {
                    sp2 **= 0.9
                    ss2 = ss2.mul(3)
                }
                if (hasElement(149)) {
                    sp **= 0.5
                    sp3 **= 0.9
                }
                if (hasElement(150)) {
                    sp **= 0.9
                    sp3 **= 0.925
                }
                step = step.softcap(1e43,hasElement(160)?0.85:0.75,0)
                let ret = step.mul(xx.mul(hasElement(80)?25:1)).add(1).softcap(ss,sp,0).softcap(1.8e5,sp3,0)
                ret = ret.mul(tmp.prim.eff[0])
                if (!player.ranks.pent.gte(15)) ret = ret.softcap(ss2,sp2,0)

                let o = ret
                let os = E('e115')

                if (hasElement(210)) os = os.mul(elemEffect(210))

                ret = overflow(ret,os,0.5)

                tmp.overflow.stronger = calcOverflow(o,ret,os)
                tmp.overflow_start.stronger = os

                return {step: step, eff: ret, ss: ss}
            },
            effDesc(eff) {
                return {
                    step: "+^"+format(eff.step),
                    eff: "提升器力量 ^"+format(eff.eff)+(eff.eff.gte(eff.ss)?`<span class='soft'>（軟上限${eff.eff.gte(1.8e5)?eff.eff.gte(5e15)&&!player.ranks.pent.gte(15)?"^3":"^2":""}）</span>`:"")
                }
            },
            bonus() {
                let x = E(0)
                if (player.mainUpg.rp.includes(7)) x = x.add(tmp.upgs.main?tmp.upgs.main[1][7].effect:0)
                x = x.mul(getEnRewardEff(4))
                return x
            },
        },
        4: {
            unl() { return hasElement(202) },
            title: "過強器",
            start: E(1e100),
            inc: E(1.5),
            effect(i) {
                let xx = i.add(tmp.upgs.mass[4].bonus)

                let step = E(.005)
                if (hasUpgrade('rp',17)) step = step.add(.005)
                if (hasUpgrade('rp',19)) step = step.mul(upgEffect(1,19,0))

                let x = step.mul(xx).add(1)

                return {step: step, eff: x, ss: EINF}
            },
            effDesc(eff) {
                return {
                    step: "+^"+format(eff.step),
                    eff: "增強器力量 ^"+format(eff.eff)+eff.eff.softcapHTML(eff.ss)
                }
            },
            bonus() {
                let x = E(0)
                return x
            },
        },
    },
    main: {
        temp() {
            for (let x = 1; x <= this.cols; x++) {
                for (let y = 1; y <= this[x].lens; y++) {
                    let u = this[x][y]
                    if (u.effDesc) tmp.upgs.main[x][y] = { effect: u.effect(), effDesc: u.effDesc() }
                }
            }
        },
        ids: [null, 'rp', 'bh', 'atom', 'br'],
        cols: 4,
        over(x,y) { player.main_upg_msg = [x,y] },
        reset() { player.main_upg_msg = [0,0] },
        1: {
            title: "暴怒升級",
            res: "暴怒點數",
			getRes() { return player.rp.points },
            unl() { return player.rp.unl },
            can(x) { return player.rp.points.gte(this[x].cost) && !player.mainUpg.rp.includes(x) },
            buy(x) {
                if (this.can(x)) {
                    player.rp.points = player.rp.points.sub(this[x].cost)
                    player.mainUpg.rp.push(x)
                }
            },
            auto_unl() { return player.mainUpg.bh.includes(5) },
            lens: 19,
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
                desc: "增強器增加提升器。",
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
                desc: "每擁有 3 個時間速度，增加 1 個增強器。",
                cost: E(1e7),
                effect() {
                    let ret = player.tickspeed.div(3).add(hasElement(38)?tmp.elements.effect[38]:0).floor()
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)+" 增強器"
                },
            },
            8: {
                desc: "暴怒點數減弱超級和高級質量升級價格增幅。",
                cost: E(1e15),
                effect() {
                    let ret = E(0.9).pow(player.rp.points.max(1).log10().max(1).log10().pow(1.25).softcap(2.5,0.5,0))
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "弱 "+format(E(1).sub(x).mul(100))+"%"+(x.log(0.9).gte(2.5)?"<span class='soft'>（軟上限）</span>":"")
                },
            },
            9: {
                unl() { return player.bh.unl },
                desc: "增強器力量增加 ^0.25。",
                cost: E(1e31),
            },
            10: {
                unl() { return player.bh.unl },
                desc: "超級等級價格增幅減弱 20%。",
                cost: E(1e43),
            },
            11: {
                unl() { return player.chal.unl },
                desc: "暴怒點數加強黑洞質量獲得量。",
                cost: E(1e72),
                effect() {
                    let ret = player.rp.points.add(1).root(10).softcap('e4000',0.1,0)
                    return ret.softcap("e1.5e31",0.95,2)
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"+(x.gte("e4000")?"<span class='soft'>（軟上限）</span>":"")
                },
            },
            12: {
                unl() { return player.chal.unl },
                desc: "暴怒點數的數量級稍微加強增強器力量。",
                cost: E(1e120),
                effect() {
                    let ret = player.rp.points.max(1).log10().softcap(200,0.75,0).div(1000)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "+^"+format(x)+(x.gte(0.2)?"<span class='soft'>（軟上限）</span>":"")
                },
            },
            13: {
                unl() { return player.chal.unl },
                desc: "每擁有一個等級，質量軟上限推遲 3x。",
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
                desc: "高級時間速度價格增幅推遲 50 個。",
                cost: E('e320'),
            },
            15: {
                unl() { return player.atom.unl },
                desc: "質量加強原子獲得量。",
                cost: E('e480'),
                effect() {
                    let ret = player.mass.max(1).log10().pow(1.25)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "x"+format(x)
                },
            },
            16: {
                unl() { return tmp.moreUpgs },
                desc: `移除時間速度力量的軟上限。`,
                cost: E('e1.8e91'),
            },
            17: {
                unl() { return tmp.mass4Unl },
                desc: `過強器力量提升 0.005。`,
                cost: E('e7.75e116'),
            },
            18: {
                unl() { return tmp.brUnl },
                desc: `褪色物質的升級稍微提升暴怒點數獲得量。`,
                cost: E('e1.5e128'),
                effect() {
                    let x = Decimal.pow(10,tmp.matters.upg[12].eff.max(1).log10().pow(.8))
                    return x
                },
                effDesc(x=this.effect()) {
                    return "^"+format(x)
                },
            },
            19: {
                unl() { return tmp.brUnl },
                desc: `超新星加強過強器力量。`,
                cost: E('e6e144'),
                effect() {
                    let x = player.supernova.times.add(1).log10().div(10).add(1)
                    return x
                },
                effDesc(x=this.effect()) {
                    return "x"+format(x)
                },
            },
        },
        2: {
            title: "黑洞升級",
            res: "暗物質",
			getRes() { return player.bh.dm },
            unl() { return player.bh.unl },
            auto_unl() { return player.mainUpg.atom.includes(2) },
            can(x) { return player.bh.dm.gte(this[x].cost) && !player.mainUpg.bh.includes(x) },
            buy(x) {
                if (this.can(x)) {
                    player.bh.dm = player.bh.dm.sub(this[x].cost)
                    player.mainUpg.bh.push(x)
                }
            },
            lens: 19,
            1: {
                desc: "質量升級不再花費質量。",
                cost: E(1),
            },
            2: {
                desc: "時間速度加強黑洞壓縮器力量。",
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
                desc: "黑洞的質量推遲超級質量升級價格增幅。",
                cost: E(100),
                effect() {
                    let ret = player.bh.mass.max(1).log10().pow(1.5).softcap(100,1/3,0).floor()
                    return ret.min(400)
                },
                effDesc(x=this.effect()) {
                    return "推遲 +"+format(x,0)+(x.gte(100)?"<span class='soft'>（軟上限）</span>":"")
                },
            },
            4: {
                desc: "階不再重置任何東西。",
                cost: E(1e4),
            },
            5: {
                desc: "你可以自動購買時間速度和暴怒點數升級。",
                cost: E(5e5),
            },
            6: {
                desc: "每秒獲得重置時獲得的暴怒點數的 100%。黑洞質量加強暴怒點數獲得量。",
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
                desc: "黑洞質量推遲質量軟上限。",
                cost: E(1e13),
                effect() {
                    let ret = player.bh.mass.add(1).root(3)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "推遲 "+format(x)+"x"
                },
            },
            8: {
                unl() { return player.chal.unl },
                desc: "將暴怒點數獲得量提升 ^1.15。",
                cost: E(1e17),
            },
            9: {
                unl() { return player.chal.unl },
                desc: "未花費暗物質推遲增強器效果的軟上限。",
                cost: E(1e27),
                effect() {
                    let ret = player.bh.dm.max(1).log10().pow(0.5)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "推遲 +"+format(x)
                },
            },
            10: {
                unl() { return player.chal.unl },
                desc: "暗物質的數量級加強質量獲得量。",
                cost: E(1e33),
                effect() {
                    let ret = E(2).pow(player.bh.dm.add(1).log10().softcap(11600,0.5,0))
                    return ret
                },
                effDesc(x=this.effect()) {
                    return format(x)+"x"+(x.max(1).log2().gte(11600)?"<span class='soft'>（軟上限）</span>":"")
                },
            },
            11: {
                unl() { return player.atom.unl },
                desc: "質量軟上限減弱 10%、",
                cost: E(1e80),
            },
            12: {
                unl() { return player.atom.unl },
                desc: "高級時間速度價格增幅減弱 15%。",
                cost: E(1e120),
            },
            13: {
                unl() { return player.atom.unl },
                desc: "夸克獲得量乘以 10。",
                cost: E(1e180),
            },
            14: {
                unl() { return player.atom.unl },
                desc: "中子力加強黑洞質量獲得量。",
                cost: E(1e210),
                effect() {
                    let ret = player.atom.powers[1].add(1).pow(2)
                    return overflow(ret,'ee108',0.25).min('ee110')
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
                    let ret = player.atom.atomic.add(1).log(5).softcap(2e9,0.25,0).softcap(1e10,0.1,0)
                    return ret.floor()
                },
                effDesc(x=this.effect()) {
                    return "+"+format(x,0)
                },
            },
            16: {
                unl() { return tmp.moreUpgs },
                desc: `紅物質升級稍微影響質量獲得量。`,
                cost: E('e5e101'),
                effect() {
                    let x = tmp.matters.upg[0].eff.max(1).pow(0.75)
                    return x
                },
                effDesc(x=this.effect()) {
                    return "^"+format(x)
                },
            },
            17: {
                unl() { return tmp.moreUpgs },
                desc: `靛物質的升級稍微提升塌縮恆星獲得量。`,
                cost: E('e4e113'),
                effect() {
                    let x = tmp.matters.upg[4].eff.max(1).log10().add(1).pow(2)
                    return x
                },
                effDesc(x=this.effect()) {
                    return "^"+format(x)
                },
            },
            18: {
                unl() { return tmp.brUnl },
                desc: `黑洞效果更強。`,
                cost: E('e1.5e156'),
            },
            19: {
                unl() { return tmp.brUnl },
                desc: `黑洞質量極微提升加速器力量。`,
                cost: E('e3e201'),
                effect() {
                    let x = player.bh.mass.add(1).log10().add(1).log10().add(1).root(6)
                    return x
                },
                effDesc(x=this.effect()) {
                    return "x"+format(x)
                },
            },
        },
        3: {
            title: "原子升級",
            res: "原子",
			getRes() { return player.atom.points },
            unl() { return player.atom.unl },
            can(x) { return player.atom.points.gte(this[x].cost) && !player.mainUpg.atom.includes(x) },
            buy(x) {
                if (this.can(x)) {
                    player.atom.points = player.atom.points.sub(this[x].cost)
                    player.mainUpg.atom.push(x)
                }
            },
            auto_unl() { return hasTree("qol1") },
            lens: 19,
            1: {
                desc: "開始時解鎖質量升級。",
                cost: E(1),
            },
            2: {
                desc: "你可以自動購買黑洞壓縮器和升級。時間速度不再花費暴怒點數。",
                cost: E(100),
            },
            3: {
                desc: "[層的紀元] 解鎖層。",
                cost: E(25000),
            },
            4: {
                desc: "重置時保留挑戰 1-4。黑洞壓縮器稍微加強宇宙射線力量。",
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
                desc: "你可以自動升層。超級階推遲 10 個。",
                cost: E(1e16),
            },
            6: {
                desc: "每秒獲得重置時獲得的暗物質的 100%。原子力量推遲黑洞質量軟上限。",
                cost: E(1e18),
                effect() {
                    let ret = player.atom.atomic.add(1).pow(0.5)
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "推遲 "+format(x)+"x"
                },
            },
            7: {
                desc: "時間速度加強每個粒子力的獲得量。",
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
                desc: "原子力量加強夸克獲得量。",
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
                desc: "增強器效果軟上限減弱 15%。",
                cost: E(2e44),
            },
            10: {
                desc: "階要求減半。階數推遲高級等級價格增幅。",
                cost: E(5e47),
                effect() {
                    let ret = player.ranks.tier.mul(2).floor()
                    return ret
                },
                effDesc(x=this.effect()) {
                    return "推遲 +"+format(x,0)
                },
            },
            11: {
                unl() { return MASS_DILATION.unlocked() },
                desc: "膨脹質量稍微加強黑洞壓縮器和宇宙射線力量。",
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
                desc: "黑洞質量效果更強。",
                cost: E('e2015'),
            },
            13: {
                unl() { return (player.md.break.active && player.qu.rip.active) || hasElement(128) },
                desc: "宇宙射線效果的軟上限推遲 10x 開始。",
                cost: E('e3.2e11'),
            },
            14: {
                unl() { return (player.md.break.active && player.qu.rip.active) || hasElement(128) },
                desc: "時間速度、黑洞壓縮器和宇宙射線元級或以下的增幅推遲 10x 開始。",
                cost: E('e4.3e13'),
            },
            15: {
                unl() { return (player.md.break.active && player.qu.rip.active) || hasElement(128) },
                desc: "宇宙射線價格增幅弱 20%。",
                cost: E('e3.4e14'),
            },
            16: {
                unl() { return tmp.moreUpgs },
                desc: `夸克溢出推遲 ^10。`,
                cost: E('e3e96'),
            },
            17: {
                unl() { return tmp.moreUpgs },
                desc: `粉紅物質稍微提升夸克獲得量。`,
                cost: E('e7.45e98'),
                effect() {
                    let x = tmp.matters.upg[2].eff.max(1).log10().add(1)
                    return x
                },
                effDesc(x=this.effect()) {
                    return "^"+format(x)
                },
            },
            18: {
                unl() { return tmp.mass4Unl },
                desc: `中子力量的第二個效果提供指數加成，而且會影響黑洞質量。`,
                cost: E('e4.2e120'),
            },
            19: {
                unl() { return tmp.brUnl },
                desc: `黃色物質的升級稍微推遲膨脹質量的溢出。`,
                cost: E('e8e139'),
                effect() {
                    let x = expMult(tmp.matters.upg[9].eff,1/3)
                    return x
                },
                effDesc(x=this.effect()) {
                    return "推遲 ^"+format(x)
                },
            },
        },
		        4: {
            title: "大撕裂升級",
            res: "死亡碎片",
            getRes() { return player.qu.rip.amt },
            unl() { return player.qu.rip.first },
            can(x) { return player.qu.rip.amt.gte(this[x].cost) && !player.mainUpg.br.includes(x) },
            buy(x) {
                if (this.can(x)) {
                    player.qu.rip.amt = player.qu.rip.amt.sub(this[x].cost)
                    player.mainUpg.br.push(x)
                }
            },
            auto_unl() { return hasElement(132) },
            lens: 19,
            1: {
                desc: `開始大撕裂時解鎖氫-1。`,
                cost: E(5),
            },
            2: {
                desc: `質量升級和等級不再受到第 8 個量子挑戰模組影響。`,
                cost: E(10),
            },
            3: {
                desc: `基於死亡碎片，量子前全局運行速度得到指數加強（在應用除法之前）。`,
                cost: E(50),
                effect() {
                    let x = player.qu.rip.amt.add(1).log10().div(25).add(1)
                    return x
                },
                effDesc(x=this.effect()) { return "^"+format(x) },
            },
            4: {
                desc: `開始大撕裂時各費米子解鎖 2 階。`,
                cost: E(250),
            },
            5: {
                desc: `將恆星提升器的初始價格減少到 ^0.1。死亡碎片加強恆星提升器的底數。`,
                cost: E(2500),
                effect() {
                    let x = player.qu.rip.amt.add(1).log10().add(1).pow(3)
                    return x
                },
                effDesc(x=this.effect()) { return "x"+format(x) },
            },
            6: {
                desc: `開始時解鎖所有輻射功能。`,
                cost: E(15000),
            },
            7: {
                desc: `大撕裂中，鈾砹混合體強一倍。`,
                cost: E(100000),
            },
            8: {
                desc: `每秒獲得重置時獲得的量子泡沫和死亡碎片的 10%`,
                cost: E(750000),
            },
            9: {
                desc: `解鎖打破膨脹。`,
                cost: E(1e7),
            },
            10: {
                unl() { return player.md.break.active },
                desc: `賦色子強 10%。`,
                cost: E(2.5e8),
            },
            11: {
                unl() { return player.md.break.active },
                desc: `重置等級不再重置任何東西。`,
                cost: E(1e10),
            },
            12: {
                unl() { return player.md.break.active },
                desc: `原子推遲質量軟上限^5。`,
                cost: E(1e16),
                effect() {
                    let x = player.atom.points.add(1).log10().add(1).log10().add(1).root(3)
                    return x
                },
                effDesc(x=this.effect()) { return "推遲 ^"+format(x) },
            },
            13: {
                unl() { return player.md.break.active },
                desc: `重置底數增加死亡碎片獲得量。`,
                cost: E(1e17),
                effect() {
                    let x = (tmp.prestiges.base||E(1)).add(1).log10().tetrate(1.5).add(1)
                    return x
                },
                effDesc(x=this.effect()) { return "x"+format(x) },
            },
            14: {
                unl() { return player.md.break.active },
                desc: `超級費米子階推遲 10 個開始（在應用第 8 個量子挑戰模組後）。`,
                cost: E(1e22),
            },
            15: {
                unl() { return player.md.break.active },
                desc: `藍圖粒子稍微更強加快量子前全局運行速度。`,
                cost: E(1e24),
            },
            16: {
                unl() { return tmp.moreUpgs },
                desc: `移除 Α、Ω 和 Σ 粒子第一個效果的軟上限，並且加強它們。`,
                cost: E(1e273),
            },
            17: {
                unl() { return tmp.mass4Unl },
                desc: `暗物質對原子獲得量提供稍弱的指數加成。`,
                cost: E('e386'),
                effect() {
                    let x = Decimal.pow(1.1,player.bh.dm.add(1).log10().add(1).log10())
                    return x
                },
                effDesc(x=this.effect()) { return "^"+format(x) },
            },
            18: {
                unl() { return tmp.brUnl },
                desc: `質量提升賦色子。`,
                cost: E('e408'),
                effect() {
                    let x = Decimal.pow(2,player.mass.add(1).log10().add(1).log10().pow(1.5))
                    return x
                },
                effDesc(x=this.effect()) { return "x"+format(x) },
            },
            19: {
                unl() { return tmp.brUnl },
                desc: `紅物質稍微減少聲望前要求。`,
                cost: E('e463'),
                effect() {
                    let x = player.dark.matters.amt[0].add(1).log10().add(1).log10().add(1).log10().div(60).add(1).toNumber()
                    return x
                },
                effDesc(x=this.effect()) { return "便宜 x"+format(x) },
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

function hasUpgrade(id,x) { return player.mainUpg[id].includes(x) }
function upgEffect(id,x,def=E(1)) { return tmp.upgs.main[id][x]?tmp.upgs.main[id][x].effect:def }
function resetMainUpgs(id,keep=[]) {
    let k = []
    let id2 = UPGS.main.ids[id]
    for (let x = 0; x < player.mainUpg[id2].length; x++) if (keep.includes(player.mainUpg[id2][x])) k.push(player.mainUpg[id2][x])
    player.mainUpg[id2] = k
}