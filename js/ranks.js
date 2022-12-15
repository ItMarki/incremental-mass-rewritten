const RANKS = {
    names: ['rank', 'tier', 'tetr', 'pent', 'hex'],
    fullNames: ['等級', '階', '層', '五級層', '六級層'],
    reset(type) {
        if (tmp.ranks[type].can) {
            player.ranks[type] = player.ranks[type].add(1)
            let reset = true
            if (type == "rank" && player.mainUpg.rp.includes(4)) reset = false
            else if (type == "tier" && player.mainUpg.bh.includes(4)) reset = false
            else if (type == "tetr" && hasTree("qol5")) reset = false
            else if (type == "pent" && hasTree("qol8")) reset = false
            else if (type == "hex" && tmp.chal14comp) reset = false
            if (reset) this.doReset[type]()
            updateRanksTemp()
        }
    },
    bulk(type) {
        if (tmp.ranks[type].can) {
            player.ranks[type] = player.ranks[type].max(tmp.ranks[type].bulk.max(player.ranks[type].add(1)))
            let reset = true
            if (type == "rank" && player.mainUpg.rp.includes(4)) reset = false
            else if (type == "tier" && player.mainUpg.bh.includes(4)) reset = false
            else if (type == "tetr" && hasTree("qol5")) reset = false
            else if (type == "pent" && hasTree("qol8")) reset = false
            else if (type == "hex" && tmp.chal14comp) reset = false
            if (reset) this.doReset[type]()
            updateRanksTemp()
        }
    },
    unl: {
        tier() { return player.ranks.rank.gte(3) || player.ranks.tier.gte(1) || player.mainUpg.atom.includes(3) || tmp.radiation.unl },
        tetr() { return player.mainUpg.atom.includes(3) || tmp.radiation.unl },
        pent() { return tmp.radiation.unl },
        hex() { return tmp.chal13comp },
    },
    doReset: {
        rank() {
            player.mass = E(0)
            for (let x = 1; x <= UPGS.mass.cols; x++) if (player.massUpg[x]) player.massUpg[x] = E(0)
        },
        tier() {
            player.ranks.rank = E(0)
            this.rank()
        },
        tetr() {
            player.ranks.tier = E(0)
            this.tier()
        },
        pent() {
            player.ranks.tetr = E(0)
            this.tetr()
        },
        hex() {
            player.ranks.pent = E(0)
            this.pent()
        },
    },
    autoSwitch(rn) { player.auto_ranks[rn] = !player.auto_ranks[rn] },
    autoUnl: {
        rank() { return player.mainUpg.rp.includes(5) },
        tier() { return player.mainUpg.rp.includes(6) },
        tetr() { return player.mainUpg.atom.includes(5) },
        pent() { return hasTree("qol8") },
        hex() { return true },
    },
    desc: {
        rank: {
            '1': "解鎖質量升級 1。",
            '2': "解鎖質量升級 2；質量升級 1 的價格增幅弱 20%。",
            '3': "解鎖質量升級 3；質量升級 2 的價格增幅弱 20%；質量升級 1 加強自己。",
            '4': "質量升級 3 的價格增幅弱 20%。",
            '5': "質量升級 2 加強自己。",
            '6': "質量獲得量獲得 (x+1)^2 x 的加成，其中 x 是等級數。",
            '13': "質量獲得量三倍。",
            '14': "暴怒點數獲得量翻倍。",
            '17': "第 6 等級的獎勵效果更好。[(x+1)^2 -> (x+1)^x^1/3]",
            '34': "質量升級 3 的軟上限推遲 1.2x 。",
            '40': "等級提升時間速度力量。",
            '45': "等級提升暴怒點數獲得量。",
            '90': "第 40 等級的獎勵更強。",
            '180': "質量獲得量 ^1.025。",
            '220': "第 40 等級的獎勵進一步加強。",
            '300': "夸克獲得量乘以等於。",
            '380': "質量獲得量乘以等於。",
            '800': "基於等級，質量軟上限弱 0.25%。",
        },
        tier: {
            '1': "等級要求減少 20%。",
            '2': "質量獲得量 ^1.15。",
            '3': "所有質量升級的價格增幅弱 20%。",
            '4': "每擁有一個階，時間速度力量增加 5%，在 +40% 開始軟上限。",
            '6': "階提升暴怒點數獲得量。",
            '8': "暗物質加強第 6 階的獎勵效果。",
            '12': "第 4 階的獎勵效果翻倍，並從中移除軟上限。",
            '30': "增強器的效果軟上限弱 10%。",
            '55': "階加強第 380 等級的效果。",
            '100': "超級階推遲 5 階開始。",
        },
        tetr: {
            '1': "階的要求減少 25%；高級階的增幅弱 15%。",
            '2': "質量升級 3 加強自己。",
            '3': "時間速度效果 ^1.05。",
            '4': "階減弱超級等級的增幅；超級階的增幅弱 20%。",
            '5': "層推遲高級/極高級時間速度。",
            '8': "質量軟上限^2 推遲 ^1.5。",
        },
        pent: {
            '1': "層的要求減少 15%；元級等級推遲 1.1x 開始。",
            '2': "層提升所有輻射的獲得量。",
            '4': "超新星推遲元級時間速度。",
            '5': "五級層推遲元級等級。",
			'8': "五級層推遲質量軟上限^4。",
            '15': "從增強器中移除第三個軟上限。",
        },
        hex: {
            '1': "五級層要求減少 20%。",
            '4': "每擁有一個六級層，暗束獲得量提升 20%。",
            '6': "移除第一個質量軟上限。",
            '10': "移除第二個質量軟上限。",
            '13': "移除第三個質量軟上限。",
            '17': "移除第四個質量軟上限。",
            '36': "移除第五個質量軟上限。",
            '43': "大幅增強第 4 六級層的效果。",
            '48': "移除第六個質量軟上限。",
            '62': "移除第七個質量軟上限。",
        },
    },
    effect: {
        rank: {
            '3'() {
                let ret = E(player.massUpg[1]||0).div(20)
                return ret
            },
            '5'() {
                let ret = E(player.massUpg[2]||0).div(40)
                return ret
            },
            '6'() {
                let ret = player.ranks.rank.add(1).pow(player.ranks.rank.gte(17)?player.ranks.rank.add(1).root(3):2)
                return ret
            },
            '40'() {
                let ret = player.ranks.rank.root(2).div(100)
                if (player.ranks.rank.gte(90)) ret = player.ranks.rank.root(1.6).div(100)
                if (player.ranks.rank.gte(220)) ret = player.ranks.rank.div(100)
                return ret
            },
            '45'() {
                let ret = player.ranks.rank.add(1).pow(1.5)
                return ret
            },
            '300'() {
                let ret = player.ranks.rank.add(1)
                return ret
            },
            '380'() {
                let ret = E(10).pow(player.ranks.rank.sub(379).pow(1.5).pow(player.ranks.tier.gte(55)?RANKS.effect.tier[55]():1).softcap(1000,0.5,0))
                return ret
            },
            '800'() {
                let ret = E(1).sub(player.ranks.rank.sub(799).mul(0.0025).add(1).softcap(1.25,0.5,0).sub(1)).max(0.75)
                return ret
            },
        },
        tier: {
            '4'() {
                let ret = E(0)
                if (player.ranks.tier.gte(12)) ret = player.ranks.tier.mul(0.1)
                else ret = player.ranks.tier.mul(0.05).add(1).softcap(1.4,0.75,0).sub(1)
                return ret
            },
            '6'() {
                let ret = E(2).pow(player.ranks.tier)
                if (player.ranks.tier.gte(8)) ret = ret.pow(RANKS.effect.tier[8]())
                return ret
            },
            '8'() {
                let ret = player.bh.dm.max(1).log10().add(1).root(2)
                return ret
            },
            '55'() {
                let ret = player.ranks.tier.max(1).log10().add(1).root(4)
                return ret
            },
        },
        tetr: {
            '2'() {
                let ret = E(player.massUpg[3]||0).div(400)
                if (ret.gte(1) && hasPrestige(0,15)) ret = ret.pow(1.5)
                return ret
            },
            '4'() {
                let ret = E(0.96).pow(player.ranks.tier.pow(1/3))
                return ret
            },
            '5'() {
                let ret = player.ranks.tetr.pow(4).softcap(1000,0.25,0)
                return ret
            },
        },
        pent: {
            '2'() {
                let ret = E(1.3).pow(player.ranks.tetr)
                return ret
            },
            '4'() {
                let ret = player.supernova.times.add(1).root(5)
                return ret
            },
            '5'() {
                let ret = E(1.05).pow(player.ranks.pent)
                return ret
            },
			'8'() {
                let ret = E(1.1).pow(player.ranks.pent)
                return ret
            },
        },
        hex: {
            '4'() {
                let hex = player.ranks.hex
                let ret = hex.mul(.2).add(1)
                if (hex.gte(43)) ret = ret.pow(hex.div(10).add(1).root(2))
                return ret
            },
        },
    },
    effDesc: {
        rank: {
            3(x) { return "+"+format(x) },
            5(x) { return "+"+format(x) },
            6(x) { return format(x)+"x" },
            40(x) {  return "+"+format(x.mul(100))+"%" },
            45(x) { return format(x)+"x" },
            300(x) { return format(x)+"x" },
            380(x) { return format(x)+"x" },
            800(x) { return "弱 "+format(E(1).sub(x).mul(100))+"%" },
        },
        tier: {
            4(x) { return "+"+format(x.mul(100))+"%" },
            6(x) { return format(x)+"x" },
            8(x) { return "^"+format(x) },
            55(x) { return "^"+format(x) },
        },
        tetr: {
            2(x) { return "+"+format(x) },
            4(x) { return "弱 "+format(E(1).sub(x).mul(100))+"%" },
            5(x) { return "推遲 +"+format(x,0)+" 個" },
        },
        pent: {
            2(x) { return format(x)+"x" },
            4(x) { return "推遲 "+format(x)+"x" },
            5(x) { return "推遲 "+format(x)+"x" },
            8(x) { return "推遲 ^"+format(x) },
        },
        hex: {
            4(x) { return format(x,1)+"x" },
        },
    },
    fp: {
        rank() {
            let f = E(1)
            if (player.ranks.tier.gte(1)) f = f.mul(1/0.8)
            f = f.mul(tmp.chal.eff[5].pow(-1))
            return f
        },
        tier() {
            let f = E(1)
            f = f.mul(tmp.fermions.effs[1][3])
            if (player.ranks.tetr.gte(1)) f = f.mul(1/0.75)
            if (player.mainUpg.atom.includes(10)) f = f.mul(2)
            return f
        },
    },
}

const PRESTIGES = {
    fullNames: ["重置等級", "榮耀", '榮譽'],
    baseExponent() {
        let x = 0
        if (hasElement(100)) x += tmp.elements.effect[100]
        if (hasPrestige(0,32)) x += prestigeEff(0,32,0)
        x += tmp.fermions.effs[1][6]||0
        x += glyphUpgEff(10,0)
        
        x += 1
        if (player.dark.run.active) x /= mgEff(5)

        return x
    },
    base() {
        let x = E(1)

        for (let i = 0; i < RANKS.names.length; i++) {
            let r = player.ranks[RANKS.names[i]]
            if (hasPrestige(0,18) && i == 0) r = r.mul(2)
            x = x.mul(r.add(1))
        }

        if (tmp.dark.abEff.pb) x = x.mul(tmp.dark.abEff.pb)

        return x.sub(1)
    },
    req(i) {
        let x = EINF, fp = this.fp(i), y = player.prestiges[i].div(fp)
        switch (i) {
            case 0:
                x = Decimal.pow(1.1,y.scaleEvery('prestige0').pow(1.1)).mul(2e13)
                break;
            case 1:
                x = y.scaleEvery('prestige1').pow(1.25).mul(3).add(4)
                break;
            case 2:
                x = hasElement(167)?y.pow(1.25).mul(3.5).add(5):y.pow(1.3).mul(4).add(6)
                break;
            default:
                x = EINF
                break;
        }
        return x.ceil()
    },
    bulk(i) {
        let x = E(0), y = i==0?tmp.prestiges.base:player.prestiges[i-1], fp = this.fp(i)
        switch (i) {
            case 0:
                if (y.gte(2e13)) x = y.div(2e13).max(1).log(1.1).max(0).root(1.1).scaleEvery('prestige0',true).mul(fp).add(1)
                break;
            case 1:
                if (y.gte(4)) x = y.sub(4).div(3).max(0).root(1.25).scaleEvery('prestige1',true).mul(fp).add(1)
                break
            case 2:
                if (y.gte(6)) x = hasElement(167)?y.sub(5).div(3.5).max(0).root(1.25).mul(fp).add(1):y.sub(6).div(4).max(0).root(1.3).mul(fp).add(1)
                break
            default:
                x = E(0)
                break;
        }
        return x.floor()
    },
    fp(i) {
        let fp = 1
        if (player.prestiges[2].gte(1) && i < 2) fp *= 1.15
        return fp
    },
    unl: [
        _=>true,
        _=>true,
        _=>tmp.chal14comp,
    ],
    noReset: [
        _=>hasUpgrade('br',11),
        _=>tmp.chal13comp,
        _=>tmp.chal15comp,
    ],
    autoUnl: [
        _=>tmp.chal13comp,
        _=>tmp.chal14comp,
        _=>tmp.chal15comp,
    ],
    autoSwitch(x) { player.auto_pres[x] = !player.auto_pres[x] },
    rewards: [
        {
            "1": `^5 以下的所有質量軟上限推遲 ^10。`,
            "2": `量子碎片的底數增加 0.5。`,
            "3": `量子泡沫和死亡碎片獲得量增到四倍。`,
            "5": `量子前全局運行速度平方（在應用除法前）。`,
            "6": `時間速度力量軟上限推遲 ^100。`,
            "8": `重置次數推遲質量軟上限^5。`,
            "10": `重置次數提升相對能量獲得量。`,
            "12": `增強器的軟上限^2 弱 7.04%。`,
            "15": `大幅增強第 2 層的獎勵。`,
            "18": `重置底數中的等級翻倍。`,
            "24": `超級宇宙弦增幅弱 20%。`,
            "28": `從膠子升級 4 的效果中移除所有軟上限。`,
            "32": `重置等級提升重置底數的指數。`,
            "40": `鉻-24 稍微更強。`,
            "70": `鐒-103 稍微更強。`,
            "110": `第 119 個元素稍微更強。`,
            "190": `鋯-40 稍微更強。`,
            "218": `第 145 個元素稍微更強。`,
            "233": `紅物質提升暗束獲得量。`,
            "382": `重置等級提升有色物質指數。塌縮恆星的效果大幅增強。`,
            "388": `鈾砹混合體稍微影響元級前榮譽前資源。`,
        },
        {
            "1": `所有恆星資源平方。`,
            "2": `元級超新星推遲 100 個。`,
            "3": `重置底數增強玻色子資源。`,
            "4": `免費獲得各原始素粒子 5 個等級。`,
            "5": `重置底數加強第 5 個五級層的獎勵。`,
            "7": `榮耀提升夸克獲得量。`,
            "15": `榮耀減弱超級和高級宇宙弦增幅。`,
            "22": `暗影獲得量 ^1.1。`,
        },
        {
            "1": `重置等級和榮耀的要求減少 15%。`,
            "3": `打破膨脹升級 12 更便宜。`,
            "4": `鈾砹混合體解鎖另一個效果。`,
            "5": `榮譽提升符文質量獲得量。`,
        },
    ],
    rewardEff: [
        {
            "8": [_=>{
                let x = player.prestiges[0].root(2).div(2).add(1)
                return x
            },x=>"推遲 ^"+x.format()],
            "10": [_=>{
                let x = Decimal.pow(2,player.prestiges[0])
                return x
            },x=>x.format()+"x"],
            "32": [_=>{
                let x = player.prestiges[0].div(1e4).toNumber()
                return x
            },x=>"+^"+format(x)],
            "233": [_=>{
                let x = player.dark.matters.amt[0].add(1).log10().add(1).log10().add(1).pow(2)
                return x
            },x=>"x"+format(x)],
            "382": [_=>{
                let x = player.prestiges[0].max(0).root(2).div(1e3).toNumber()
                return x
            },x=>"+"+format(x)],
            "388": [_=>{
                let x = tmp.qu.chroma_eff[1][1].root(2)
                return x
            },x=>"弱 "+formatReduction(x)],
            /*
            "1": [_=>{
                let x = E(1)
                return x
            },x=>{
                return x.format()+"x"
            }],
            */
        },
        {
            "3": [_=>{
                let x = tmp.prestiges.base.max(1).log10().div(10).add(1).root(2)
                return x
            },x=>"^"+x.format()],
            "5": [_=>{
                let x = tmp.prestiges.base.max(1).log10().div(10).add(1).root(3)
                return x
            },x=>"x"+x.format()],
            "7": [_=>{
                let x = player.prestiges[1].add(1).root(3)
                return x
            },x=>"^"+x.format()],
            "15": [_=>{
                let x = player.prestiges[1].root(1.5).div(10).add(1).pow(-1)
                return x
            },x=>"減少 "+formatReduction(x)],
        },
        {
            "5": [_=>{
                let x = player.prestiges[2].root(2).div(10).add(1)
                return x.toNumber()
            },x=>"x"+format(x,2)],
        },
    ],
    reset(i, bulk = false) {
        let b = this.bulk(i)
        if (i==0?tmp.prestiges.base.gte(tmp.prestiges.req[i]):player.prestiges[i-1].gte(tmp.prestiges.req[i])) if (!bulk || b.gt(player.prestiges[i]) ) {
            if (bulk) player.prestiges[i] = b
            else player.prestiges[i] = player.prestiges[i].add(1)

            if (!this.noReset[i]()) {
                for (let j = i-1; j >= 0; j--) {
                    player.prestiges[j] = E(0)
                }
                QUANTUM.enter(false,true,false,true)
            }

            updateRanksTemp()
        }
    },
}

const PRES_LEN = PRESTIGES.fullNames.length

function hasPrestige(x,y) { return player.prestiges[x].gte(y) }

function prestigeEff(x,y,def=E(1)) { return tmp.prestiges.eff[x][y] || def }

function updateRanksTemp() {
    if (!tmp.ranks) tmp.ranks = {}
    for (let x = 0; x < RANKS.names.length; x++) if (!tmp.ranks[RANKS.names[x]]) tmp.ranks[RANKS.names[x]] = {}
    let fp2 = tmp.qu.chroma_eff[1][0]
    let ffp = E(1)
    let ffp2 = 1
    if (player.dark.run.active) ffp2 /= mgEff(5)

    let fp = RANKS.fp.rank().mul(ffp)
    tmp.ranks.rank.req = E(10).pow(player.ranks.rank.div(ffp2).scaleEvery('rank',[1,1,1,1,fp2]).div(fp).pow(1.15)).mul(10)
    tmp.ranks.rank.bulk = E(0)
    if (player.mass.gte(10)) tmp.ranks.rank.bulk = player.mass.div(10).max(1).log10().root(1.15).mul(fp).scaleEvery('rank',true,[1,1,1,1,fp2]).mul(ffp2).add(1).floor();
    tmp.ranks.rank.can = player.mass.gte(tmp.ranks.rank.req) && !CHALS.inChal(5) && !CHALS.inChal(10) && !FERMIONS.onActive("03")

    fp = RANKS.fp.tier().mul(ffp)
    tmp.ranks.tier.req = player.ranks.tier.div(ffp2).scaleEvery('tier',false,[1,1,1,fp2]).div(fp).add(2).pow(2).floor()
    tmp.ranks.tier.bulk = player.ranks.rank.max(0).root(2).sub(2).mul(fp).scaleEvery('tier',true,[1,1,1,fp2]).mul(ffp2).add(1).floor();

    fp = E(1).mul(ffp)
    let pow = 2
    if (hasElement(44)) pow = 1.75
    if (hasElement(9)) fp = fp.mul(1/0.85)
    if (player.ranks.pent.gte(1)) fp = fp.mul(1/0.85)
    if (hasElement(72)) fp = fp.mul(1/0.85)

    let tps = 0

    tmp.ranks.tetr.req = player.ranks.tetr.div(ffp2).scaleEvery('tetr',[1,1,1,fp2]).div(fp).pow(pow).mul(3).add(10-tps).floor()
    tmp.ranks.tetr.bulk = player.ranks.tier.sub(10-tps).div(3).max(0).root(pow).mul(fp).scaleEvery('tetr',true,[1,1,1,fp2]).mul(ffp2).add(1).floor();

    fp = E(1).mul(ffp)
    if (player.ranks.hex.gte(1)) fp = fp.div(0.8)
    pow = 1.5
    tmp.ranks.pent.req = player.ranks.pent.div(ffp2).scaleEvery('pent').div(fp).pow(pow).add(15-tps).floor()
    tmp.ranks.pent.bulk = player.ranks.tetr.sub(15-tps).gte(0)?player.ranks.tetr.sub(15-tps).max(0).root(pow).mul(fp).scaleEvery('pent',true).mul(ffp2).add(1).floor():E(0);

    fp = E(1)
    pow = 1.8
    let s = 20
    if (hasElement(167)) {
        s /= 2
        pow *= 0.9
    }
    tmp.ranks.hex.req = player.ranks.hex.div(ffp2).div(fp).scaleEvery('hex').pow(pow).add(s-tps).floor()
    tmp.ranks.hex.bulk = player.ranks.pent.sub(s-tps).gte(0)?player.ranks.pent.sub(s-tps).max(0).root(pow).scaleEvery('hex',true).mul(fp).mul(ffp2).add(1).floor():E(0);

    for (let x = 0; x < RANKS.names.length; x++) {
        let rn = RANKS.names[x]
        if (x > 0) {
            tmp.ranks[rn].can = player.ranks[RANKS.names[x-1]].gte(tmp.ranks[rn].req)
        }
    }
    
    // Prestige

    tmp.prestiges.baseMul = PRESTIGES.base()
    tmp.prestiges.baseExp = PRESTIGES.baseExponent()
    tmp.prestiges.base = tmp.prestiges.baseMul.pow(tmp.prestiges.baseExp)
    for (let x = 0; x < PRES_LEN; x++) {
        tmp.prestiges.req[x] = PRESTIGES.req(x)
        for (let y in PRESTIGES.rewardEff[x]) {
            if (PRESTIGES.rewardEff[x][y]) tmp.prestiges.eff[x][y] = PRESTIGES.rewardEff[x][y][0]()
        }
    }
}

function updateRanksHTML() {
    tmp.el.rank_tabs.setDisplay(hasUpgrade('br',9))
    for (let x = 0; x < 2; x++) {
        tmp.el["rank_tab"+x].setDisplay(tmp.rank_tab == x)
    }

    if (tmp.rank_tab == 0) {
        for (let x = 0; x < RANKS.names.length; x++) {
            let rn = RANKS.names[x]
            let unl = RANKS.unl[rn]?RANKS.unl[rn]():true
            tmp.el["ranks_div_"+x].setDisplay(unl)
            if (unl) {
                let keys = Object.keys(RANKS.desc[rn])
                let desc = ""
                for (let i = 0; i < keys.length; i++) {
                    if (player.ranks[rn].lt(keys[i])) {
                        desc = `在第 ${format(keys[i],0)} 個${RANKS.fullNames[x]}，${RANKS.desc[rn][keys[i]]}`
                        break
                    }
                }

                tmp.el["ranks_scale_"+x].setTxt(x>=3||getScalingName(rn)!=""?"個"+getScalingName(rn):getScalingName(rn))
                tmp.el["ranks_amt_"+x].setTxt(format(player.ranks[rn],0))
                tmp.el["ranks_"+x].setClasses({btn: true, reset: true, locked: !tmp.ranks[rn].can})
                tmp.el["ranks_desc_"+x].setTxt(desc)
                tmp.el["ranks_req_"+x].setTxt(x==0?formatMass(tmp.ranks[rn].req):"第 "+format(tmp.ranks[rn].req,0)+" 個"+RANKS.fullNames[x-1])
                tmp.el["ranks_auto_"+x].setDisplay(RANKS.autoUnl[rn]())
                tmp.el["ranks_auto_"+x].setTxt(player.auto_ranks[rn]?"開啟":"關閉")
            }
        }
    }
    if (tmp.rank_tab == 1) {
        tmp.el.pres_base.setHTML(`${tmp.prestiges.baseMul.format(0)}<sup>${format(tmp.prestiges.baseExp)}</sup> = ${tmp.prestiges.base.format(0)}`)

        for (let x = 0; x < PRES_LEN; x++) {
            let unl = PRESTIGES.unl[x]?PRESTIGES.unl[x]():true

            tmp.el["pres_div_"+x].setDisplay(unl)

            if (unl) {
                let p = player.prestiges[x] || E(0)
                let keys = Object.keys(PRESTIGES.rewards[x])
                let desc = ""
                for (let i = 0; i < keys.length; i++) {
                    if (p.lt(keys[i]) && (tmp.chal13comp || p.lte(PRES_BEFOREC13[x]||Infinity))) {
                        desc = `在第 ${format(keys[i],0)} 個${PRESTIGES.fullNames[x]}，${PRESTIGES.rewards[x][keys[i]]}`
                        break
                    }
                }

                tmp.el["pres_scale_"+x].setTxt(getScalingName("prestige"+x))
                tmp.el["pres_amt_"+x].setTxt(format(p,0))
                tmp.el["pres_"+x].setClasses({btn: true, reset: true, locked: x==0?tmp.prestiges.base.lt(tmp.prestiges.req[x]):player.prestiges[x-1].lt(tmp.prestiges.req[x])})
                tmp.el["pres_desc_"+x].setTxt(desc)
                tmp.el["pres_req_"+x].setTxt(x==0?"重置底數到達 "+format(tmp.prestiges.req[x],0):PRESTIGES.fullNames[x-1]+" "+format(tmp.prestiges.req[x],0))
                tmp.el["pres_auto_"+x].setDisplay(PRESTIGES.autoUnl[x]())
                tmp.el["pres_auto_"+x].setTxt(player.auto_pres[x]?"開啟":"關閉")
            }
        }
    }
}

const PRES_BEFOREC13 = [40,7]