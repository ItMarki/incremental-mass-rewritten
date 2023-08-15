const TREE_TAB = [
    {title: "主標籤"},
    {title: "生活質素"},
    {title: "挑戰"},
    {title: "超新星後", unl() { return player.supernova.post_10 } },
    {title: "量子", unl() { return quUnl() } },
    {title: "腐化", unl() { return player.dark.c16.first || hasInfUpgrade(8) } },
]

const CORRUPTED_TREE = ['s1']

const TREE_IDS = [
    [
        ['c'],
        ['qol1','','','','qu_qol1',''],
        ['chal1'],
        ['bs4','bs1','','qf1','','rad1'],
        ['qu0'],
        ['ct1'],
    ],[
        ['s1','m1','rp1','bh1','sn1'],
        ['qol2','qol3','qol4','qu_qol2','qu_qol3','qu_qol4','qu_qol5','qu_qol6'],
        ['chal2','chal4a','chal4b','chal3'],
        ['bs5','bs2','fn1','bs3','qf2','qf3','rad2','rad3'],
        ['qu1','qu2','qu3'],
        ['ct2','ct3','ct4','ct5','ct6'],
    ],[
        ['s2','m2','t1','d1','bh2','gr1','sn2'],
        ['qol5','qol6','qol7','','','qu_qol7','',''],
        ['chal4','chal7a'],
        ['fn4','fn3','fn9','fn2','fn5','qf4','rad4','rad5'],
        ['prim3','prim2','prim1','qu4','qc1','qc2','qc3'],
        ['ct8','ct9','ct10','ct7','ct11'],
    ],[
        ['s3','m3','gr2','sn3'],
        ['qol9','unl1','qol8','unl2','unl3','qu_qol8','qu_qol9','unl4'],
        ['chal5','chal6','chal7','chal8'],
        ['fn12','fn11','fn6','fn10','rad6',""],
        ['en1','qu5','br1'],
        ['ct15','ct12','ct16','ct13','ct14'],
    ],[
        ['s4','sn5','sn4'],
        ['','','','qu_qol8a'],
        [],
        ['','fn7','fn8','fn13'],
        ['qu6','qu7','qu8','qu9','qu10','qu11'],
        [],
    ],[
        [],
        ['qu_qol10','qu_qol11','qu_qol12'],
        [],
        [],
        [],
        [],
    ],
]

const CS_TREE = (()=>{
    let t = []
    for (let i in TREE_IDS) t.push(...TREE_IDS[i][5])
    return t
})()

var tree_canvas,tree_ctx,tree_update=true

const NO_REQ_QU = ['qol1','qol2','qol3','qol4','qol5',
'qol6','qol7','qol8','qol9','unl1',
'c','s2','s3','s4','sn3',
'sn4','t1','bh2','gr1','chal1',
'chal2','chal3','bs1','fn2','fn3',
'fn5','fn6','fn10']

const TREE_UPGS = {
    buy(x, auto=false) {
        if ((tmp.supernova.tree_choosed == x || auto) && tmp.supernova.tree_afford[x]) {
            if (this.ids[x].qf) player.qu.points = player.qu.points.sub(this.ids[x].cost).max(0)
            else if (this.ids[x].cs) player.dark.c16.shard = player.dark.c16.shard.sub(this.ids[x].cost).max(0)
            else player.supernova.stars = player.supernova.stars.sub(this.ids[x].cost).max(0)
            
            if (CS_TREE.includes(x)) player.dark.c16.tree.push(x)
            else  player.supernova.tree.push(x)

            if (x == 'unl1') addQuote(6)
        }
    },
    ids: {
		c: {
            req() { return player.supernova.times.gte(1) },
            reqDesc: `1 個超新星。`,
            desc: `每秒生產 0.1 個中子星（不受離線生產影響）。`,
            cost: E(0),
        },
        sn1: {
            branch: ["c"],
            desc: `時間速度稍微加強中子星獲得量。`,
            cost: E(10),
            effect() {
                let x = player.build.tickspeed.amt.add(1).pow(0.25)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        sn2: {
            branch: ["sn1"],
            desc: `超新星加強中子星獲得量。`,
            cost: E(350),
            effect() {
                let sn = player.supernova.times
                if (!hasTree("qu4")) sn = sn.softcap(15,0.8,0).softcap(25,0.5,0)
                let x = E(2).add(hasTree("sn4")?tmp.supernova.tree_eff.sn4:0).pow(sn)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        sn3: {
            branch: ["sn2"],
            desc: `藍星稍微加強中子星獲得量。`,
            req() { return player.supernova.times.gte(6) },
            reqDesc: `6 個超新星。`,
            cost: E(50000),
            effect() {
                let x = player.stars.generators[4].max(1).log10().add(1)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        sn4: {
            branch: ["sn3"],
            desc: `超新星提升 [sn2] 的效果。`,
            unl() { return player.supernova.post_10 },
            req() { return player.supernova.times.gte(13) },
            reqDesc: `13 個超新星。`,
            cost: E(1e8),
            effect() {
                let x = player.supernova.times.mul(0.1).softcap(1.5,0.75,0)
                if (hasElement(112)) x = x.add(2)
                return x
            },
            effDesc(x) { return "+"+format(x)+(x.gte(1.5)?"<span class='soft'>（軟上限）</span>":"") },
        },
		 sn5: {
            branch: ["sn4"],
            desc: `質量提升中子星獲得量。`,
            unl() { return quUnl() },
            cost: E('e450'),
            effect() {
                let x = player.mass.add(1).log10().add(1).pow(2)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        m1: {
            branch: ["c"],
            desc: `中子星提升質量獲得量。`,
            cost: E(100),
            effect() {
                let x = 
                hasElement(219)
                ? Decimal.pow(1.25,player.supernova.stars.add(1).log10().add(1).log10().softcap(100,0.5,0))
                :
                hasElement(164)
                ? player.supernova.stars.add(1).log10().add(1).log10().div(10).add(1)
                : E(1e100).pow(player.supernova.stars.add(1).log10().pow(5).softcap(1e3,0.25,0))
                return x
            },
            effDesc(x) { return hasElement(164)||hasElement(219)?"^"+format(x):(format(x)+"x"+(x.max(1).log(1e100).gte(1e3)?"<span class='soft'>（軟上限）</span>":"")) },
        },
        m2: {
            branch: ["m1"],
            desc: `質量軟上限^2 推遲 ^1.5。`,
            cost: E(800),
        },
        m3: {
            branch: ["m2"],
            unl() { return player.supernova.fermions.unl && hasTree("fn1") },
            desc: `超新星推遲質量軟上限^2-3。`,
            cost: E(1e46),
            effect() {
                let x = player.supernova.times.mul(0.0125).add(1)
                return x
            },
            effDesc(x) { return "推遲 ^"+format(x) },
        },
        t1: {
            branch: ["m1", 'rp1'],
            req() { return player.supernova.chal.noTick && player.mass.gte(E("1.5e1.650056e6").pow(hasTree('bh2')?1.46:1)) },
            reqDesc() {return `執行一次超新星重置後在不購買時間速度的情況下到達 ${formatMass(E("1.5e1.650056e6").pow(hasTree('bh2')?1.46:1))}。你仍可以從宇宙射線獲得時間速度。`},
            desc: `時間速度力量 ^1.15。`,
            cost: E(1500),
        },
        rp1: {
            branch: ["c"],
            desc: `中子星提升暴怒力量獲得量。`,
            cost: E(200),
            effect() {
                let x = hasElement(165)
                ? player.supernova.stars.add(1).log10().add(1).log10().div(10).add(1)
                : E(1e50).pow(player.supernova.stars.add(1).log10().pow(5).softcap(1e3,0.25,0))
                return x
            },
            effDesc(x) { return hasElement(165)?"^"+format(x):(format(x)+"x"+(x.max(1).log(1e50).gte(1e3)?"<span class='soft'>（軟上限）</span>":"")) },
        },
        bh1: {
            branch: ["c"],
            desc: `中子星提升暗物質獲得量。`,
            cost: E(400),
            effect() {
                let x = hasElement(166)
                ? player.supernova.stars.add(1).log10().add(1).log10().div(10).add(1)
                : E(1e35).pow(player.supernova.stars.add(1).log10().pow(5).softcap(1e3,0.25,0))
                return x
            },
            effDesc(x) { return hasElement(166)?"^"+format(x):(format(x)+"x"+(x.max(1).log(1e35).gte(1e3)?"<span class='soft'>（軟上限）</span>":"")) },
        },
        bh2: {
            branch: ['bh1'],
            req() { return player.supernova.chal.noBHC && player.bh.mass.gte("1.5e1.7556e4") },
            reqDesc() {return `執行一次超新星重置後在不購買黑洞壓縮器的情況下到達 ${format("e1.75e4")} uni 的黑洞質量。`},
            desc: `黑洞壓縮器力量 ^1.15。`,
            cost: E(1500),
        },
        s1: {
            branch: ["c"],
            desc: `中子星提升最後一種恆星的獲得量。`,
            cost: E(400),
            effect() {
                let x = player.supernova.stars.add(1).pow(1.4)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        s2: {
            branch: ["s1"],
            req() { return player.supernova.times.gte(3) },
            reqDesc: `3 個超新星。`,
            desc: `在恆星加成公式中，層的軟上限弱 50%。`,
            cost: E(2500),
        },
        s3: {
            branch: ["s2"],
            req() { return player.supernova.times.gte(4) },
            reqDesc: `4 個超新星。`,
            desc: `超新星加強恆星生產器。`,
            cost: E(10000),
            effect() {
                let x = player.supernova.times.max(0).root(10).mul(0.1).add(1)
                return x
            },
            effDesc(x) { return "^"+format(x) },
        },
        s4: {
            branch: ["s3"],
            req() { return player.supernova.times.gte(6) },
            reqDesc: `6 個超新星。`,
            desc: `解鎖恆星提升器。`,
            cost: E(1e5),
        },
        qol1: {
            req() { return player.supernova.times.gte(2) },
            reqDesc: `2 個超新星。`,
            desc: `開始時解鎖矽-14 和 氬-18。你可以自動購買元素和原子升級。`,
            cost: E(1500),
        },
        qol2: {
            branch: ["qol1"],
            req() { return player.supernova.times.gte(3) },
            reqDesc: `3 個超新星。`,
            desc: `開始時解鎖鉻-24 和原子升級 6。`,
            cost: E(2000),
        },
        qol3: {
            branch: ["qol2"],
            req() { return player.supernova.times.gte(4) },
            reqDesc: `4 個超新星。`,
            desc: `開始時解鎖鍀-43，並加強這個元素。你可以自動從質量獲得相對粒子。`,
            cost: E(10000),
        },
        qol4: {
            branch: ["qol3"],
            unl() { return player.supernova.post_10 },
            req() { return player.supernova.times.gte(12) },
            reqDesc: `12 個超新星。`,
            desc: `你可以自動購買恆星解鎖器和提升器。`,
            cost: E(1e8),
        },
        qol5: {
            branch: ["qol4"],
            req() { return player.supernova.times.gte(16) },
            reqDesc: `16 個超新星。`,
            desc: `層不再重置任何東西。`,
            cost: E(1e13),
        },
        qol6: {
            branch: ["qol5"],
            req() { return player.supernova.times.gte(17) },
            reqDesc: `17 個超新星。`,
            desc: `在任何挑戰中，你即使不退出也可以獲得完成次數。`,
            cost: E(1e15),
        },
        qol7: {
            branch: ["qol6"],
            unl() { return player.supernova.fermions.unl && hasTree("fn2") },
            req() { return player.supernova.times.gte(40) },
            reqDesc: `40 個超新星。`,
            desc: `你可以自動購買光子和膠子升級。它們不再花費任何東西。`,
            cost: E(1e48),
        },
        qol8: {
            branch: ["unl1"],
            req() { return player.supernova.times.gte(60) },
            reqDesc: `60 個超新星。`,
            desc: `你可以升五級層。五級層不再重置任何東西。`,
            cost: E(1e78),
        },
        qol9: {
            branch: ["unl1"],
            req() { return player.supernova.times.gte(78) },
            reqDesc: `78 個超新星。`,
            desc: `你可以自動購買輻射加成。它們不再花費任何東西。`,
            cost: E(1e111),
        },
        chal1: {
            req() { return player.supernova.times.gte(4) },
            reqDesc: `4 個超新星。`,
            desc: `挑戰 7 和 8 的完成上限增加 100 次。`,
            cost: E(6000),
        },
        chal2: {
            branch: ["chal1"],
            req() {
                for (let x = 1; x <= 4; x++) if (player.chal.comps[x].gte(1)) return false
                return player.mass.gte(E('e2.05e6').mul(1.5e56))
            },
            reqDesc() { return `執行一次超新星重置後在不完成挑戰 1-4 的情況下到達 ${format('e2.05e6')} uni 的質量。` },
            desc: `重置時保留挑戰 1-4 的完成次數。`,
            cost: E(1e4),
        },
        chal3: {
            branch: ["chal1"],
            req() {
                for (let x = 5; x <= 8; x++) if (player.chal.comps[x].gte(1)) return false
                return player.bh.mass.gte(E('e1.75e4').mul(1.5e56))
            },
            reqDesc() { return `執行一次超新星重置後在不完成挑戰 5-8 的情況下到達 ${format('e1.75e4')} uni。` },
            desc: `重置時保留挑戰 5-8 的完成次數。`,
            cost: E(1e4),
        },
        chal4: {
            branch: ["chal2","chal3"],
            desc: `解鎖一個新的挑戰。`,
            cost: E(1.5e4),
        },
        chal4a: {
            unl() { return player.supernova.post_10 },
            branch: ["chal4"],
            desc: `挑戰 9 的效果更強。`,
            cost: E(1e8),
        },
        chal4b: {
            unl() { return quUnl() },
            branch: ["chal4"],
            desc: `挑戰 9 的完成上限增加 100 次。`,
            cost: E('e480'),
        },
        chal5: {
            branch: ["chal4"],
            desc: `解鎖一個新的挑戰。`,
            cost: E(1e17),
        },
        chal6: {
            unl() { return tmp.radiation.unl },
            branch: ["chal5"],
            desc: `解鎖一個新的挑戰。`,
            cost: E(1e88),
        },
        chal7: {
            branch: ["chal6"],
            desc: `解鎖挑戰 12。`,
            cost: E(1e200),
        },
        chal7a: {
            unl() { return hasTree("unl3") },
            branch: ["chal7"],
            desc: `挑戰 12 的效果更強。`,
            cost: E('e900'),
        },
        chal8: {
            unl() { return player.qu.rip.first },
            branch: ["chal7"],
            desc: `挑戰 9-12 的完成上限增加 200 次。`,
            cost: E('e35000'),
        },
        gr1: {
            branch: ["bh1"],
            desc: `黑洞壓縮器力量提升宇宙射線力量。`,
            req() { return player.supernova.times.gte(7) },
            reqDesc: `7 個超新星。`,
            cost: E(1e6),
            effect() {
                let x = BUILDINGS.eff('bhc','power').max(1).root(3)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        gr2: {
            unl() { return player.supernova.fermions.unl },
            branch: ["gr1"],
            desc: `宇宙射線力量 ^1.25。`,
            cost: E(1e20),
        },
        bs1: {
            unl() { return player.supernova.post_10 },
            req() { return player.supernova.times.gte(15) },
            reqDesc: `15 個超新星。`,
            desc: `時間速度稍微加強希格斯玻色子獲得量。`,
            cost: E(1e13),
            effect() {
                let x = player.build.tickspeed.amt.add(1).pow(0.6)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        bs2: {
            branch: ["bs1"],
            desc: `光子和膠子提升彼此的獲得量。`,
            cost: E(1e14),
            effect() {
                let x = overflow(expMult(player.supernova.bosons.photon,hasElement(113) ? 0.95 : 1/2,2).max(1),'ee60',0.5)
                let y = overflow(expMult(player.supernova.bosons.gluon,hasElement(113) ? 0.95 : 1/2,2).max(1),'ee60',0.5)
                return [x,y]
            },
            effDesc(x) { return "光子 "+format(x[1])+"x，膠子 "+format(x[0])+"x" },
        },
        bs3: {
            branch: ["bs1"],
            desc: `引力子的效果稍微提升中子獲得量。`,
            cost: E(1e14),
            effect() {
                let x = tmp.bosons.effect.graviton[0].add(1).root(2)
                return x.softcap('e1000',1/3,0).softcap('ee38',0.95,2)
            },
            effDesc(x) { return format(x)+"x"+x.softcapHTML('e1000') },
        },
        bs4: {
            unl() { return player.supernova.fermions.unl },
            branch: ["bs2"],
            desc: `Z 玻色子獲得量 ^1.5。`,
            cost: E(1e24),
        },
        bs5: {
            unl() { return player.qu.en.unl },
            branch: ["bs4"],
            desc: `Z 玻色子也加強黑洞壓縮器和宇宙射線力量。`,
            cost: E('e1100'),
        },
        fn1: {
            unl() { return player.supernova.fermions.unl },
            branch: ["bs1"],
            desc: `時間速度稍微提升各費米子的獲得量。`,
            cost: E(1e27),
            effect() {
                let x = E(1.25).pow(player.build.tickspeed.amt.softcap(1e24,0.5,2).pow(0.4))
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        fn2: {
            branch: ["fn1"],
            req() { return player.mass.div('1.5e56').gte("ee6") && player.md.active && FERMIONS.onActive("01") },
            reqDesc() { return `在[下]和質量膨脹中到達 ${formatMass(E('e1e6').mul(1.5e56))}。` },
            desc: `解鎖一種新的 U-夸克和一種新的 U-輕子。`,
            cost: E(1e33),
        },
        fn3: {
            branch: ["fn1"],
            req() { return player.supernova.fermions.points[0].gte(1e7) || player.supernova.fermions.points[1].gte(1e7) },
            reqDesc() { return `到達 ${format(1e7)} 個任意費米子。` },
            desc: `超級費米子階的增幅弱 7.5%。`,
            cost: E(1e30),
        },
        fn4: {
            unl() { return hasTree("fn2") },
            branch: ["fn1"],
            desc: `光子和膠子升級 2 稍微更強。`,
            cost: E(1e39),
        },
        fn5: {
            unl() { return hasTree("fn2") },
            branch: ["fn1"],
            req() { return player.atom.quarks.gte("e12500") && FERMIONS.onActive("10") },
            reqDesc() { return `在[電子]中到達 ${format("e12500")} 夸克。` },
            desc: `[電子] 的階上限增加 35 個。它的效果軟上限更弱。`,
            cost: E(1e42),
        },
        fn6: {
            branch: ["fn2"],
            req() { return player.mass.gte(uni('e4e4')) && FERMIONS.onActive("02") && CHALS.inChal(5) },
            reqDesc() { return `在[魅]和挑戰 5 中到達 ${formatMass(uni("e4e4"))}。` },
            desc: `解鎖一種新的 U-夸克和一種新的 U-費米子。`,
            cost: E(1e48),
        },
        fn7: {
            branch: ["fn6"],
            desc: `解鎖一種新的 U-夸克和一種新的 U-費米子。`,
            cost: E(1e90),
        },
        fn8: {
            branch: ["fn7"],
            desc: `解鎖一種新的 U-夸克和一種新的 U-費米子。`,
            cost: E(1e159),
        },
        fn9: {
            branch: ["fn1"],
            desc: `[奇] 和 [微中子] 的階上限增加 2 個。`,
            cost: E(1e166),
        },
        fn10: {
            unl() { return PRIM.unl() },
            branch: ["fn5"],
            req() { return player.atom.points.gte("e1.5e8") && FERMIONS.onActive("10") && CHALS.inChal(9) },
            reqDesc() { return `在 [電子] 和挑戰 9 中到達 ${format("e1.5e8")} 原子。` },
            desc: `移除 [電子] 的階上限，而且大幅增強它的效果。`,
            cost: E('e600'),
        },
        fn11: {
            unl() { return PRIM.unl() },
            branch: ["fn9"],
            desc: `[奇]、[頂]、[底]、[中子] 和 [緲微中子] 的階上限增加 5。`,
            cost: E('e680'),
        },
        fn12: {
            branch: ["fn3"],
            desc: `元級前費米子階的增幅弱 10%。`,
            cost: E('e960'),
        },
        d1: {
            unl() { return hasTree("fn6") },
            branch: ["rp1"],
            desc: `在質量膨脹外生產相對粒子強 25%。`,
            cost: E(1e51),
        },
        rad1: {
            unl() { return tmp.radiation.unl },
            desc: `基於超新星獲得更多頻率。如果已解鎖下一個輻射則以此加成提升該輻射。<sup>[?]</sup>`,
            cost: E(1e54),
            effect() {
                let x = player.supernova.times.add(1)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        rad2: {
            branch: ["rad1"],
            desc: `所有輻射獲得量 10x。`,
            cost: E(1e72),
        },
        rad3: {
            branch: ["rad1"],
            desc: `輻射加成便宜 1.1x。`,
            cost: E(1e86),
        },
        rad4: {
            branch: ["rad2"],
            desc: `所有元加成效果翻倍。`,
            cost: E(1e118),
        },
        rad5: {
            branch: ["rad3"],
            desc: `每變成一次超新星，所有輻射獲得量增加 10%。`,
            cost: E(1e170),
            effect() {
                let x = E(1.1).pow(player.supernova.times)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        rad6: {
            unl() { return PRIM.unl() },
            branch: ["rad4"],
            desc: `輻射種類加強獎勵輻射加成。`,
            cost: E('e490'),
        },

        qf1: {
            unl() { return quUnl() },
            desc: `超新星提升量子泡沫獲得量。`,
            cost: E(1e290),
            effect() {
                let x = player.supernova.times.root(2).div(10).add(1)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        qf2: {
            unl() { return PRIM.unl() },
            branch: ["qf1"],
            desc: `中子星提升量子泡沫獲得量。`,
            cost: E('e735'),
            effect() {
                let x = player.supernova.stars.add(1).log10().add(1).root(3)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        qf3: {
            unl() { return hasTree('unl3') },
            branch: ["qf1"],
            desc: `藍圖粒子提升量子泡沫獲得量。`,
            cost: E('e850'),
            effect() {
                let x = player.qu.bp.add(1).log10().add(1).pow(2)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        qf4: {
            branch: ["qf3"],
            desc: `量子碎片的底數增加 0.5。`,
            cost: E('e1000'),
        },

        // Quatnum

        qu0: {
            unl() { return quUnl() },
            qf: true,
            desc: `新紀元祝你好運！`,
            cost: E(0),
        },
        qu1: {
            qf: true,
            branch: ["qu0"],
            desc: `費米子的要求減少 20%。`,
            cost: E(1),
        },
        qu2: {
            qf: true,
            branch: ["qu0"],
            desc: `大幅增強第 1 個 W<sup>+</sup> 玻色子效果。`,
            cost: E(1),
        },
        qu3: {
            qf: true,
            branch: ["qu0"],
            desc: `黑洞公式的軟上限弱 30%。`,
            cost: E(1),
        },
        qu4: {
            qf: true,
            branch: ["qu1", 'qu2', 'qu3'],
            desc: `從 [sn2] 效果中移除軟上限。`,
            cost: E(35),
        },
        qu5: {
            qf: true,
            unl() { return PRIM.unl() },
            branch: ['qu4'],
            desc: `時間速度效果稍微提升藍圖粒子和賦色子的獲得量。`,
            cost: E(100),
            effect() {
                let x = BUILDINGS.eff('tickspeed','eff_bottom').add(1).log10().add(1).log10().add(1).pow(3)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        qu6: {
            qf: true,
            branch: ['qu5'],
            desc: `量子化次數提升宇宙弦力量。`,
            cost: E(1e3),
            effect() {
                let x = player.qu.times.add(1).log10().add(1)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        qu7: {
            qf: true,
            unl() { return hasTree("unl3") },
            branch: ['qu6'],
            desc: `基於量子碎片，獲得更多量子化次數。`,
            cost: E(1e15),
            effect() {
                let x = player.qu.qc.shard+1
                return x
            },
            effDesc(x) { return format(x,0)+"x" },
        },
        qu8: {
            qf: true,

            branch: ['qu7'],
            desc: `量子碎片的效果影響賦色子。`,
            cost: E(1e21),
            effect() {
                let x = tmp.qu.qc_s_eff.max(1)
                return x
            },
            effDesc(x) { return format(x,1)+"x" },
        },
        qu9: {
            unl() { return player.qu.en.unl },
            qf: true,
            branch: ['qu8'],
            desc: `原始素粒子總數提升量子化次數。`,
            cost: E(1e24),
            effect() {
                let x = player.qu.prim.theorems.add(1)
                if (hasBeyondRank(2,17)) x = x.mul(beyondRankEffect(2,17)[0])
                return x
            },
            effDesc(x) { return format(x,0)+"x" },
        },
        qu10: {
            qf: true,
            branch: ['qu9'],
            desc: `藍圖粒子每多一個數量級，希格斯玻色子的效果強 3.3%。`,
            cost: E(1e32),
            effect() {
                let x = E(1.0333).pow(player.qu.bp.add(1).log10().softcap(70,0.5,0))
                return overflow(x,'e450',0.5)
            },
            effDesc(x) { return format(x)+"x" },
        },
        qu11: {
            qf: true,
            branch: ['qu10'],
            desc: `量子泡沫獲得量公式更強。`,
            cost: E(1e43),
        },
        qu_qol1: {
            qf: true,
            unl() { return quUnl() },
            req() { return player.qu.times.gte(4) },
            reqDesc: `量子化 4 次。`,
            desc: `你可以自動購買不花費量子泡沫的中子樹升級。`,
            cost: E(3),
        },
        qu_qol2: {
            qf: true,
            branch: ["qu_qol1"],
            req() {
                for (let x = 0; x < 6; x++) if (player.supernova.fermions.tiers[0][x].gte(1)) return false
                return player.supernova.times.gte(81)
            },
            reqDesc: `量子化後在不獲得 U-夸克階的情況下變成 81 次超新星。`,
            desc: `量子化時保留 U-夸克階。`,
            cost: E(4),
        },
        qu_qol3: {
            qf: true,
            branch: ["qu_qol1"],
            req() {
                for (let x = 1; x <= 4; x++) if (player.chal.comps[x].gte(1)) return false
                return player.mass.gte(mlt(1e4))
            },
            reqDesc() { return `量子化後在不完成挑戰 1-4 的情況下到達 ${formatMass(mlt(1e4))} 的質量。` },
            desc: `你可以自動完成挑戰 1-4。`,
            cost: E(4),
        },
        qu_qol4: {
            qf: true,
            branch: ["qu_qol1"],
            desc: `你可以自動變成超新星，它不重置任何東西。`,
            cost: E(4),
        },
        qu_qol5: {
            qf: true,
            branch: ["qu_qol1"],
            req() {
                for (let x = 5; x <= 8; x++) if (player.chal.comps[x].gte(1) && x != 7) return false
                return player.mass.gte(mlt(1.35e4))
            },
            reqDesc() { return `量子化後在不完成挑戰 5、6 和 8 的情況下到達 ${formatMass(mlt(1.35e4))} 的質量。` },
            desc: `你可以自動完成挑戰 5-8。`,
            cost: E(4),
        },
        qu_qol6: {
            qf: true,
            branch: ["qu_qol1"],
            req() {
                for (let x = 0; x < 6; x++) if (player.supernova.fermions.tiers[1][x].gte(1)) return false
                return player.supernova.times.gte(42)
            },
            reqDesc: `量子化後在不獲得 U-輕子階的情況下變成 42 次超新星。`,
            desc: `量子化時保留 U-輕子階。`,
            cost: E(4),
        },
        qu_qol7: {
            qf: true,
            branch: ["qu_qol3","qu_qol5"],
            req() {
                for (let x = 9; x <= 12; x++) if (player.chal.comps[x].gte(1)) return false
                return player.mass.gte(mlt(5e3)) && FERMIONS.onActive("05")
            },
            reqDesc() { return `量子化後在 [底] 中在不完成挑戰 9-12 的情況下到達 ${formatMass(mlt(5e3))} 的質量。` },
            desc: `量子化時保留挑戰 9-12 的完成次數。`,
            cost: E(25),
        },
        qu_qol8: {
            qf: true,
            branch: ["unl3"],
            req() { return player.qu.qc.shard >= 15 },
            reqDesc() { return `Get 15 Quantum Shards.` },
            desc: `除了在量子挑戰中，你可以在任何費米子外自動獲得所有費米子階。`,
            cost: E(1e11),
        },
        qu_qol8a: {
            unl() { return player.md.break.active },
            qf: true,
            branch: ["qu_qol8"],
            desc: `[qu_qol8] 在量子挑戰和大撕裂中有效。`,
            cost: E(1e75),
        },
        qu_qol9: {
            qf: true,
            branch: ["qu_qol8"],
            req() { return player.qu.qc.shard >= 24 },
            reqDesc() { return `獲得 24 個量子碎片。` },
            desc: `進入量子挑戰時立即解鎖釙-84。`,
            cost: E(1e17),
        },
        prim1: {
            qf: true,
            branch: ["qu5"],
            desc: `原始素定理的要求底數減少 1。`,
            cost: E(200),
        },
        prim2: {
            qf: true,
            branch: ["prim1"],
            desc: `Θ 粒子增加第 2 個效果。`,
            cost: E(500),
        },
        prim3: {
            qf: true,
            unl() { return hasTree("unl3") },
            branch: ["prim2"],
            desc: `Ε 粒子增加第 2 個效果。這個效果在量子挑戰中更強。`,
            cost: E(1e16),
        },
        qc1: {
            qf: true,
            unl() { return hasTree("unl3") },
            branch: ['qu5'],
            desc: `量子碎片推遲質量軟上限^4。`,
            cost: E(1e10),
            effect() {
                let x = (player.qu.qc.shard+1)**0.75
                return x
            },
            effDesc(x) { return "推遲 ^"+format(x)},
        },
        qc2: {
            unl() { return player.qu.en.unl },
            qf: true,
            branch: ['qc1'],
            req() { return tmp.qu.qc_s >= 70 && player.mass.gte(uni('ee5')) && QCs.active() },
            reqDesc() { return `在 70 個量子碎片的模組組合中到達 ${formatMass(uni('ee5'))} 質量（獎勵適用前）。` },
            desc: `某種量子挑戰到達 10 個時，額外獲得 1 個碎片。`,
            cost: E(1e27),
        },
        qc3: {
            unl() { return hasTree('unl4') },
            qf: true,
            branch: ['qc2'],
            req() { return player.qu.qc.shard >= 88 },
            reqDesc() { return `獲得 88 個量子碎片。` },
            desc: `重置底數增加量子碎片的底數。`,
            cost: E(1e78),
            effect() {
                let x = (tmp.prestiges.base||E(1)).add(1).log10().div(10)
                return x
            },
            effDesc(x) { return "+"+format(x) },
        },
        en1: {
            unl() { return player.qu.rip.first },
            qf: true,
            branch: ['qu5'],
            desc: `蒸發頻率和黑洞質量所獲得的資源快一倍，其效果也更強。`,
            cost: E(1e55),
        },
        br1: {
            unl() { return player.qu.rip.first },
            qf: true,
            branch: ['qu5'],
            req() { return tmp.qu.qc_s >= 76 && player.mass.gte(uni('e7500')) && QCs.active() },
            reqDesc() { return `在 76 個量子碎片的模組組合中得到 ${formatMass(uni('e7500'))} 質量（獎勵適用前）。` },
            desc: `量子碎片提升死亡碎片獲得量。`,
            cost: E(1e58),
            effect() {
                let x = (player.qu.qc.shard+1)**0.5
                return x
            },
            effDesc(x) { return "x"+format(x) },
        },

        // Other

        unl1: {
            branch: ["qol7"],
            unl() { return hasTree("fn6") },
            req() { return player.supernova.times.gte(44) },
            reqDesc: `44 個超新星。`,
            desc: `解鎖輻射。`,
            cost: E(5e52),
        },
        unl2: {
            qf: true,
            branch: ["qu_qol7"],
            req() { return player.qu.times.gte(20) },
            reqDesc: `量子化 20 次。`,
            desc: `解鎖原始素。`,
            cost: E(50),
        },
        unl3: {
            qf: true,
            branch: ["unl2"],
            req() { return player.qu.times.gte(200) },
            reqDesc: `量子化 200 次。`,
            desc: `解鎖量子挑戰。`,
            cost: E(1e6),
        },
        unl4: {
            qf: true,
            branch: ["qu_qol9"],
            req() { return player.qu.qc.shard >= 66 },
            reqDesc: `66 個量子碎片。`,
            desc: `解鎖大撕裂。`,
            cost: E(1e42),
        },

        qu_qol10: {
            unl: ()=>player.dark.unl,

            qf: true,
            desc: `你不能從原始素定理獲得 Δ、Α、Ο 和 Σ 粒子，但是以上每個粒子的數量等於原始素定理。`,
            cost: E(1e110),
        },
        qu_qol11: {
            branch: ["qu_qol10"],

            qf: true,
            desc: `你不能從原始素定理獲得 Φ 和 Ε 粒子，但是以上每個粒子的數量等於原始素定理。`,
            cost: E(1e130),
        },
        qu_qol12: {
            branch: ["qu_qol11"],

            qf: true,
            desc: `你不能從原始素定理獲得 Θ 和 Β 粒子，但是以上每個粒子的數量等於原始素定理。`,
            cost: E(1e190),
        },

        fn13: {
            unl: ()=>tmp.chal13comp,

            branch: ["fn8"],
            desc: `解鎖一種元 U-夸克和一種元 U-輕子。`,
            cost: E('e1.5e10'),
        },

        // Corrupted Tree

        ct1: {
            desc: `你在挑戰 16 中的最佳黑洞質量提升普通質量獲得量。`,
            cost: E(10),

            effect() {
                let x = player.dark.c16.bestBH.add(1).log10().add(1)
                return overflow(x,10,0.5)
            },
            effDesc(x) { return "^"+format(x) },
        },
        ct2: {
            branch: ['ct1'],

            desc: `你在挑戰 16 中的最佳黑洞質量提升玻色子資源獲得量。`,
            cost: E(50),

            effect() {
                let x = player.dark.c16.bestBH.add(1).log10().add(1).pow(2)
                return x
            },
            effDesc(x) { return "x"+format(x) },
        },
        ct3: {
            branch: ['ct1'],

            desc: `你在挑戰 16 中的最佳黑洞質量免費提供費米子階。`,
            cost: E(50),

            req() { return tmp.c16active && player.supernova.fermions.choosed == "06" && player.bh.mass.gte('1e81') },
            reqDesc() { return `在挑戰 16 和 [元夸克] 中到達 ${formatMass('1e81')} 的黑洞質量。` },

            effect() {
                let x = player.dark.c16.bestBH.add(1).log10().add(1).log10().mul(1.5)
                return x
            },
            effDesc(x) { return "+"+format(x) },
        },
        ct4: {
            branch: ['ct1'],

            desc: `你在挑戰 16 中的最佳黑洞質量提升所有有色物質的升級的底數。`,
            cost: E(100),

            req() { return tmp.c16active && player.bh.dm.gte(1e300) },
            reqDesc() { return `在挑戰 16 中到達 ${format(1e300)} 暗物質。` },

            effect() {
                let p = hasPrestige(2,40), c = tmp.c16active
                let x = player.dark.c16.bestBH.add(1).log10().add(1).log10().div(c?8:30)
                if (p) x = x.mul(c?3:1.2)
                return x
            },
            effDesc(x) { return "+"+format(x) },
        },
        ct5: {
            branch: ['ct1'],

            desc: `中子元素-0 稍微加強挑戰 13 的獎勵。`,
            cost: E(100),

            effect() {
                let x = hasElement(237) ? expMult(tmp.qu.chroma_eff[2],0.5) : overflow(tmp.qu.chroma_eff[2],10,0.5).root(3)
                return x
            },
            effDesc(x) { return "x"+format(x) },
        },
        ct6: {
            branch: ['ct1'],

            desc: `在挑戰 16 中，最佳黑洞質量推遲質量溢出。`,
            cost: E(300),

            req() { return tmp.c16active && player.atom.atomic.gte(1e8) },
            reqDesc() { return `在挑戰 16 中到達 ${format(1e8)} 原子力量。` },

            effect() {
                let x = player.dark.c16.bestBH.add(1).log10().add(1).pow(2)
                return overflow(x,10,0.5)
            },
            effDesc(x) { return "推遲 ^"+format(x) },
        },
        ct7: {
            branch: ['ct5'],

            desc: `中子元素-0 稍微加強挑戰 14 的獎勵（如 [ct5]）。`,
            cost: E(1500),

            req() { return player.chal.comps[14]&&player.chal.comps[14].gte(750) },
            reqDesc() { return `將挑戰 14 完成 ${format(750,0)} 次。` },
        },
        ct8: {
            branch: ['ct2'],

            desc: `進入挑戰 16 時保留中子樹挑戰 16 前的部分。在挑戰 16 中，最佳黑洞質量提升所有輻射的獲得量。`,
            cost: E(2500),

            effect() {
                let x = player.dark.c16.bestBH.add(1).log10().add(1).pow(2)
                return x
            },
            effDesc(x) { return "x"+format(x) },
        },
        ct9: {
            branch: ['ct3'],

            desc: `你在挑戰 16 中的最佳黑洞質量免費提供輻射加成。`,
            cost: E(5000),

            req() { return tmp.c16active && player.supernova.fermions.choosed == "16" && player.bh.mass.gte('1e400') && player.build.bhc.amt.lte(0) },
            reqDesc() { return `在挑戰 16 和 [元輕子] 中，在不購買黑洞壓縮器的情況下到達 ${formatMass('1e400')} 的黑洞質量。` },

            effect() {
                let x = player.dark.c16.bestBH.add(1).log10().root(3)
                return x.overflow('1e300',0.25)
            },
            effDesc(x) { return "+"+format(x) },
        },
        ct10: {
            branch: ['ct4'],

            desc: `腐化碎片總數降低 FSS 要求。`,
            cost: E(5e4),

            effect() {
                let x = Decimal.pow(0.95,overflow(player.dark.c16.totalS.add(1).log10(),2,0.5).root(2))
                if (hasElement(241)) x = x.pow(2)
                return x
            },
            effDesc(x) { return formatReduction(x) },
        },
        ct11: {
            branch: ['ct6'],

            desc: `你在挑戰 16 中的最佳黑洞質量推遲黑洞質量溢出。（在挑戰 16 中較弱）`,
            cost: E(1e6),

            req() { return tmp.c16active && player.atom.atomic.gte(1e20) },
            reqDesc() { return `在挑戰 16 中到達 ${format(1e20)} 原子力量。` },

            effect() {
                let x = player.dark.c16.bestBH.add(1).log10().add(1)
                x = tmp.c16active ? x.root(4) : x.pow(3)
                x = overflow(x,10,0.5)
                x = tmp.c16active ? x.root(3) : x.pow(2)
                return x
            },
            effDesc(x) { return "推遲 ^"+format(x) },
        },
        ct12: {
            branch: ['ct9'],

            desc: `你在挑戰 16 中的最佳黑洞質量免費提供原始素粒子。`,
            cost: E(5e7),

            req() { return tmp.c16active && player.supernova.fermions.choosed == "06" && player.bh.mass.gte('1e1960') && player.build.bhc.amt.lte(0) },
            reqDesc() { return `挑戰 16 和 [元夸克] 中，在不購買黑洞壓縮器的情況下到達 ${formatMass('1e1960')} 的黑洞質量。` },

            effect() {
                let x = player.dark.c16.bestBH.add(1).log10().root(2).overflow('1e430',0.25)
                return x
            },
            effDesc(x) { return "+"+format(x) },
        },
        ct13: {
            branch: ['ct7'],

            desc: `中子元素-0 稍微加強挑戰 15（像 [ct5] 一樣）。挑戰 15 推遲原子和夸克溢出。`,
            cost: E(2.5e8),

            req() { return player.chal.comps[14]&&player.chal.comps[14].gte(940) },
            reqDesc() { return `將挑戰 14 完成 ${format(940,0)} 次。` },
        },
        ct14: {
            branch: ['ct11'],

            desc: `你在挑戰 16 中的最佳黑洞質量推遲膨脹質量溢出。`,
            cost: E(1e10),

            req() { return tmp.c16active && player.atom.atomic.gte(1e144) },
            reqDesc() { return `在挑戰 16 中到達 ${format(1e144)} 原子力量。` },

            effect() {
                let x = player.dark.c16.bestBH.add(1).log10().add(1).pow(2)
                return x
            },
            effDesc(x) { return "推遲 ^"+format(x) },
        },
        ct15: {
            branch: ['ct8'],

            desc: `腐化碎片總數提升有色物質獲得量。`,
            cost: E(2.5e10),

            effect() {
                let x = player.dark.c16.totalS.add(1).root(2)
                return x
            },
            effDesc(x) { return "x"+format(x) },
        },
        ct16: {
            unl: ()=>tmp.eaUnl,
            branch: ['ct10'],

            desc: `你在挑戰 16 中的最佳黑洞質量提升 K 介子和 π 介子獲得量。`,
            cost: E(5e16),

            effect() {
                let x = player.dark.c16.bestBH.add(1).log10().div(1e5).add(1).pow(2)
                return x
            },
            effDesc(x) { return "x"+format(x) },
        },

        /*
        x: {
            unl() { return true },
            req() { return true },
            icon: "placeholder",
            reqDesc: ``,
            desc: `Placeholder.`,
            cost: EINF,
            effect() {
                let x = E(1)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        */
    },
}

for (let i in CS_TREE) {
    let u = TREE_UPGS.ids[CS_TREE[i]]
    if (!u) TREE_UPGS.ids[CS_TREE[i]] = {
        icon: `placeholder`,
        cs: true,
        desc: `待定。`,
        cost: EINF,
    }
    else {
        u.desc = u.desc||`待定。`
        u.cs = true
        u.cost = u.cost||EINF
    }
}

const TREE_TYPES = (()=>{
    let t = {
        normal: [],
        qu: [],
        cs: [],
    }
    for (let x in TREE_UPGS.ids) {
        if (TREE_UPGS.ids[x].qf) t.qu.push(x)
        else if (TREE_UPGS.ids[x].cs) t.cs.push(x)
        else t.normal.push(x)
    }
    return t
})()

function hasTree(id) { return (player.supernova.tree.includes(id) || player.dark.c16.tree.includes(id)) && !(tmp.c16active && CORRUPTED_TREE.includes(id)) }

function treeEff(id,def=1) { return tmp.supernova.tree_eff[id]||E(def) }

function setupTreeHTML() {
    let tree_table = new Element("tree_table")
    let tree_tab_table = new Element("tree_tab_table")
	let table = ``
    let table2 = ``
    for (let j = 0; j < TREE_TAB.length; j++) {
        table2 += `
        <div style="width: 145px">
            <button onclick="tmp.tree_tab = ${j}" class="btn_tab" id="tree_tab${j}_btn">${TREE_TAB[j].title}<b id="tree_tab${j}_notify" style="color: red"> [!]</b></button>
        </div>
        `
        table += `<div id="tree_tab${j}_div">`
        for (let i = 0; i < TREE_IDS.length; i++) {
            table += `<div class="tree_table_column">`
            for (let k = 0; k < TREE_IDS[i][j].length; k++) {
                let id = TREE_IDS[i][j][k]
                let u = TREE_UPGS.ids[id]

                let option = id == "" ? `style="visibility: hidden"` : ``
                let img = TREE_UPGS.ids[id]?`<img src="images/tree/${u.icon||id}.png">`:""
                table += `<button id="treeUpg_${id}" class="btn_tree" onclick="TREE_UPGS.buy('${id}'); tmp.supernova.tree_choosed = '${id}'" ${option}>${img}</button>`
            }
            table += `</div>`
        }
        table += `</div>`
    }

	tree_table.setHTML(table)
    tree_tab_table.setHTML(table2)
}

function retrieveCanvasData() {
	let treeCanv = document.getElementById("tree_canvas")
	if (treeCanv===undefined||treeCanv===null) return false;
    tree_canvas = treeCanv
	tree_ctx = tree_canvas.getContext("2d");
	return true;
}

function resizeCanvas() {
    if (!retrieveCanvasData()) return
	tree_canvas.width = 0;
	tree_canvas.height = 0;
	tree_canvas.width = tree_canvas.clientWidth
	tree_canvas.height = tree_canvas.clientHeight
}

function drawTreeHTML() {
    if (tmp.tab == 5) {
        if (tree_canvas.width == 0 || tree_canvas.height == 0) resizeCanvas()
        drawTree()
    }
}

function drawTree() {
	if (!retrieveCanvasData()) return;
	tree_ctx.clearRect(0, 0, tree_canvas.width, tree_canvas.height);
	for (let x in tmp.supernova.tree_had2[tmp.tree_tab]) {
        let id = tmp.supernova.tree_had2[tmp.tree_tab][x]
        let branch = TREE_UPGS.ids[id].branch||[]
        if (branch.length > 0 && tmp.supernova.tree_unlocked[id]) for (let y in branch) if (tmp.supernova.tree_unlocked[branch[y]]) {
			drawTreeBranch(branch[y], id)
		}
	}
}

function treeCanvas() {
    if (!retrieveCanvasData()) return
    if (tree_canvas && tree_ctx) {
        window.addEventListener("resize", resizeCanvas)

        tree_canvas.width = tree_canvas.clientWidth
        tree_canvas.height = tree_canvas.clientHeight
    }
}

const TREE_ANIM = ["圓形", "正方形", "關"]
const CR = 5
const SR = 7.0710678118654755

function drawTreeBranch(num1, num2) {
    var start = document.getElementById("treeUpg_"+num1).getBoundingClientRect();
    var end = document.getElementById("treeUpg_"+num2).getBoundingClientRect();
    var x1 = start.left + (start.width / 2) - (document.body.scrollWidth-tree_canvas.width)/2;
    var y1 = start.top + (start.height / 2) - (window.innerHeight-tree_canvas.height);
    var x2 = end.left + (end.width / 2) - (document.body.scrollWidth-tree_canvas.width)/2;
    var y2 = end.top + (end.height / 2) - (window.innerHeight-tree_canvas.height);
    tree_ctx.lineWidth=10;
    tree_ctx.beginPath();
    let color = TREE_UPGS.ids[num2].qf?"#39FF49":"#00520b"
    let color2 = TREE_UPGS.ids[num2].qf?"#009C15":"#fff"
    tree_ctx.strokeStyle = player.supernova.tree.includes(num2)||player.dark.c16.tree.includes(num2)?color:tmp.supernova.tree_afford[num2]?"#fff":"#333";
    tree_ctx.moveTo(x1, y1);
    tree_ctx.lineTo(x2, y2);
    tree_ctx.stroke();

    if (player.options.tree_animation != 2) {
        tree_ctx.fillStyle = player.supernova.tree.includes(num2)||player.dark.c16.tree.includes(num2)?color2:"#888";
        let tt = [tmp.tree_time, (tmp.tree_time+1)%3, (tmp.tree_time+2)%3]
        for (let i = 0; i < 3; i++) {
            let [t, dx, dy] = [tt[i], x2-x1, y2-y1]
            let [x, y] = [x1+dx*t/3, y1+dy*t/3]
            tree_ctx.beginPath();
            if (player.options.tree_animation == 1) {
                let a = Math.atan2(y1-y2,dx)-Math.PI/4
                tree_ctx.moveTo(x+SR*Math.cos(a), y-SR*Math.sin(a))
                for (let j = 1; j <= 3; j++) tree_ctx.lineTo(x+SR*Math.cos(a+Math.PI*j/2), y-SR*Math.sin(a+Math.PI*j/2))
            } else if (player.options.tree_animation == 0) {
                tree_ctx.arc(x, y, CR, 0, Math.PI*2, true);
            }
            tree_ctx.fill();
        }
    }
}

function changeTreeAnimation() {
    player.options.tree_animation = (player.options.tree_animation + 1) % 3;
}

function updateTreeHTML() {
    let c16 = tmp.c16active
    let req = ""
    let t_ch = TREE_UPGS.ids[tmp.supernova.tree_choosed]
    if (tmp.supernova.tree_choosed != "") req = t_ch.req?`<span class="${t_ch.req()?"green":"red"}">${t_ch.reqDesc?"要求："+(typeof t_ch.reqDesc == "function"?t_ch.reqDesc():t_ch.reqDesc):""}</span>`:""
    tmp.el.tree_desc.setHTML(
        tmp.supernova.tree_choosed == "" ? `<div style="font-size: 12px; font-weight: bold;"><span class="gray">（點擊任意升級以顯示）</span></div>`
        : `<div style="font-size: 12px; font-weight: bold;"><span class="gray">（再次點擊以購買）</span>${req}</div>
        ${`<span class="sky"><b>[${tmp.supernova.tree_choosed}]</b> ${t_ch.desc}</span>`.corrupt(c16 && CORRUPTED_TREE.includes(tmp.supernova.tree_choosed))}<br>
        <span>價格：${format(t_ch.cost,2)} 個${t_ch.qf?'量子泡沫':t_ch.cs?'<span class="corrupted_text">腐化碎片</span>':'中子星'}</span><br>
        <span class="green">${t_ch.effDesc?"目前："+t_ch.effDesc(tmp.supernova.tree_eff[tmp.supernova.tree_choosed]):""}</span>
        `
    )
    
    for (let i = 0; i < TREE_TAB.length; i++) {
        tmp.el["tree_tab"+i+"_btn"].setDisplay(TREE_TAB[i].unl?TREE_TAB[i].unl():true)
        tmp.el["tree_tab"+i+"_notify"].setDisplay(tmp.supernova.tree_afford2[i].length>0)
        tmp.el["tree_tab"+i+"_div"].setDisplay(tmp.tree_tab == i)
        if (tmp.tree_tab == i) for (let x = 0; x < tmp.supernova.tree_had2[i].length; x++) {
            let id = tmp.supernova.tree_had2[i][x]
            let unl = tmp.supernova.tree_unlocked[id]
            tmp.el["treeUpg_"+id].setVisible(unl)
            let bought = player.supernova.tree.includes(id)
            if (unl) tmp.el["treeUpg_"+id].setClasses(player.dark.c16.tree.includes(id) || c16 && CORRUPTED_TREE.includes(id) ? {btn_tree: true, corrupted: true, choosed: id == tmp.supernova.tree_choosed} : {btn_tree: true, qu_tree: TREE_UPGS.ids[id].qf, locked: !tmp.supernova.tree_afford[id], bought: bought, choosed: id == tmp.supernova.tree_choosed})
        }
    }
}