const RANKS = {
    names: ['rank', 'tier', 'tetr', 'pent', 'hex'],
    fullNames: ['等級', '階', '層', '五級層', '六級層'],
    reset(type) {
        if (tmp.ranks[type].can) {
            player.ranks[type] = player.ranks[type].add(1)
            let reset = true
            if (tmp.chal14comp) reset = false
            else if (type == "rank" && player.mainUpg.rp.includes(4)) reset = false
            else if (type == "tier" && player.mainUpg.bh.includes(4)) reset = false
            else if (type == "tetr" && hasTree("qol5")) reset = false
            else if (type == "pent" && hasTree("qol8")) reset = false
            if (reset) this.doReset[type]()
            updateRanksTemp()
        }
    },
    bulk(type) {
        if (tmp.ranks[type].can) {
            player.ranks[type] = player.ranks[type].max(tmp.ranks[type].bulk.max(player.ranks[type].add(1)))
            let reset = true
            if (tmp.chal14comp) reset = false
            if (type == "rank" && player.mainUpg.rp.includes(4)) reset = false
            else if (type == "tier" && player.mainUpg.bh.includes(4)) reset = false
            else if (type == "tetr" && hasTree("qol5")) reset = false
            else if (type == "pent" && hasTree("qol8")) reset = false
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
            '2': "解鎖質量升級 2。質量升級 1 的價格增幅弱 20%。",
            '3': "解鎖質量升級 3。質量升級 2 的價格增幅弱 20%。質量升級 1 加強自己。",
            '4': "質量升級 3 的價格增幅弱 20%。",
            '5': "質量升級 2 加強自己。",
            '6': "質量獲得量獲得 (x+1)^2 x 的加成，其中 x 是等級數。",
            '13': "質量獲得量三倍。",
            '14': "暴怒力量獲得量翻倍。",
            '17': "第 6 等級的獎勵效果更好。[(x+1)^2 -> (x+1)^x^1/3]",
            '34': "質量升級 3 的軟上限推遲 1.2x 。",
            '40': "等級提升時間速度力量。",
            '45': "等級提升暴怒力量獲得量。",
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
            '6': "階提升暴怒力量獲得量。",
            '8': "暗物質加強第 6 階的獎勵效果。",
            '12': "第 4 階的獎勵效果翻倍，並從中移除軟上限。",
            '30': "增強器的效果軟上限弱 10%。",
            '55': "階加強第 380 等級的效果。",
            '100': "超級階推遲 5 階開始。",
        },
        tetr: {
            '1': "階的要求減少 25%。高級階的增幅弱 15%。",
            '2': "質量升級 3 加強自己。",
            '3': "時間速度效果 ^1.05。",
            '4': "階減弱超級等級的增幅。超級階的增幅弱 20%。",
            '5': "層推遲高級/極高級時間速度。",
            '8': "質量軟上限^2 推遲 ^1.5。",
        },
        pent: {
            '1': "層的要求減少 15%。元級等級推遲 1.1x 開始。",
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
            '91': "有色物質指數 +0.15。",
            '157': "移除第八個質量軟上限。",
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
                return overflow(ret,'ee100',0.5)
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
                let ret = E(1.3).pow(player.ranks.tetr.softcap(12e10,0.1,0))
                return ret
            },
            '4'() {
                let ret = player.supernova.times.add(1).root(5)
                return ret
            },
            '5'() {
                let ret = E(1.05).pow(player.ranks.pent.min(1500))
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
                return overflow(ret,1e11,0.5)
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
            if (!hasCharger(3)) f = f.mul(tmp.chal.eff[5].pow(-1))
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

const CORRUPTED_PRES = [
    [10,40],
]

const PRESTIGES = {
    fullNames: ["重置等級", "榮耀", '榮譽', '聲望'],
    baseExponent() {
        let x = 0
        if (hasElement(100)) x += tmp.elements.effect[100]
        if (hasPrestige(0,32)) x += prestigeEff(0,32,0)
        x += tmp.fermions.effs[1][6]||0
        x += glyphUpgEff(10,0)
        
        x += 1
        if (tmp.c16active || player.dark.run.active) x /= mgEff(5)

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

        if (hasBeyondRank(2,1)) x = x.mul(beyondRankEffect(2,1))

        return x.sub(1)
    },
    req(i) {
        let x = EINF, fp = this.fp(i), y = player.prestiges[i]
        switch (i) {
            case 0:
                x = Decimal.pow(1.1,y.scaleEvery('prestige0',false,[0,0,0,fp]).pow(1.1)).mul(2e13)
                break;
            case 1:
                x = y.div(fp).scaleEvery('prestige1',false).pow(1.25).mul(3).add(4)
                break;
            case 2:
                x = hasElement(167)?y.div(fp).scaleEvery('prestige2',false).pow(1.25).mul(3.5).add(5):y.pow(1.3).mul(4).add(6)
                break;
            case 3:
                x = y.div(fp).pow(1.25).mul(3).add(9)
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
                if (y.gte(2e13)) x = y.div(2e13).max(1).log(1.1).max(0).root(1.1).scaleEvery('prestige0',true,[0,0,0,fp]).add(1)
                break;
            case 1:
                if (y.gte(4)) x = y.sub(4).div(3).max(0).root(1.25).scaleEvery('prestige1',true).mul(fp).add(1)
                break
            case 2:
                if (y.gte(6)) x = hasElement(167)?y.sub(5).div(3.5).max(0).root(1.25).scaleEvery('prestige2',true).mul(fp).add(1):y.sub(6).div(4).max(0).root(1.3).mul(fp).add(1)
                break
            case 3:
                if (y.gte(9)) x = y.sub(9).div(3).max(0).root(1.25).mul(fp).add(1)
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
        if (player.prestiges[3].gte(1) && i < 3) fp *= 1.1
        if (hasUpgrade('br',19) && i < 3) fp *= upgEffect(4,19)
        return fp
    },
    unl: [
        ()=>true,
        ()=>true,
        ()=>tmp.chal14comp,
        ()=>tmp.brUnl,
    ],
    noReset: [
        ()=>hasUpgrade('br',11),
        ()=>tmp.chal13comp,
        ()=>tmp.chal15comp,
        ()=>false,
    ],
    autoUnl: [
        ()=>tmp.chal13comp,
        ()=>tmp.chal14comp,
        ()=>tmp.chal15comp,
        ()=>false,
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
            "552": `奇異級超新星增幅推遲 x1.25。`,
            "607": `重置底數提升賦色子獲得量。`,
            "651": `高級六級層推遲 x1.33。`,
            "867": `鋰-3 提供指數倍數。元級宇宙射線增幅推遲 ^8。`,
            "1337": `量子前全局運行速度稍微提升有色物質指數。重置等級 382 的獎勵更強。`,
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
            "33": `鈾砹混合體稍微影響元級前五級層要求。`,
            "46": `挑戰 11 到 13 的完成上限增加 500 次。`,
            "66": `所有費米子的增幅弱 20%。`,
            "91": `FSS 底數 ^1.05。`,
            "127": `移除等級和階的所有奇異級前增幅，但是挑戰 5 的獎勵無效。`,
            "139": `每擁有一個 FSS，有色物質生產加快至 3x。FVM 稍微更便宜。`,
            "167": `FFS 對深淵之漬的第四個獎勵提供指數倍數。`,
        },
        {
            "1": `重置等級和榮耀的要求減少 15%。`,
            "3": `打破膨脹升級 12 更便宜。`,
            "4": `鈾砹混合體解鎖另一個效果。`,
            "5": `榮譽提升符文質量獲得量。`,
            "8": `榮譽減弱黑洞溢出。`,
            "22": `榮譽提升所有有色物質的獲得量。`,
            "25": `移除黑暗前挑戰的完成上限。更換挑戰 7 的獎勵。`,
            "28": `榮耀加強 FVM 力量。`,
        },
        {
            "1": `之前重置的要求減少 10%。`,
            "2": `每擁有一個聲望，奇異級超新星推遲 x1.25。`,
            "4": `每擁有一個聲望，腐蝕碎片獲得量提升 50%。`,
        },
    ],
    rewardEff: [
        {
            "8": [()=>{
                let x = player.prestiges[0].root(2).div(2).add(1)
                return x
            },x=>"推遲 ^"+x.format()],
            "10": [()=>{
                let x = Decimal.pow(2,player.prestiges[0])
                return x
            },x=>x.format()+"x"],
            "32": [()=>{
                let x = player.prestiges[0].div(1e4).toNumber()
                return x
            },x=>"+^"+format(x)],
            "233": [()=>{
                let x = player.dark.matters.amt[0].add(1).log10().add(1).log10().add(1).pow(2)
                return x
            },x=>"x"+format(x)],
            "382": [()=>{
                let x = player.prestiges[0].max(0).root(2).div(1e3)
                if (hasPrestige(0,1337)) x = x.mul(10)
                return x.toNumber()
            },x=>"+"+format(x)],
            "388": [()=>{
                let x = tmp.qu.chroma_eff[1][1].root(2)
                return x
            },x=>"弱 "+formatReduction(x)],
            "607": [()=>{
                let x = tmp.prestiges.base.max(1).pow(1.5).softcap('e7500',0.1,0)
                return x
            },x=>"x"+format(x)+softcapHTML(x,'e7500')],
            "1337": [()=>{
                let x = tmp.preQUGlobalSpeed.max(1).log10().add(1).log10().div(10)
                return x.toNumber()
            },x=>"+"+format(x)],
            /*
            "1": [()=>{
                let x = E(1)
                return x
            },x=>{
                return x.format()+"x"
            }],
            */
        },
        {
            "3": [()=>{
                let x = tmp.prestiges.base.max(1).log10().div(10).add(1).root(2)
                return x
            },x=>"^"+x.format()],
            "5": [()=>{
                let x = tmp.prestiges.base.max(1).log10().div(10).add(1).root(3)
                return x
            },x=>"x"+x.format()],
            "7": [()=>{
                let x = player.prestiges[1].add(1).root(3)
                return x
            },x=>"^"+x.format()],
            "15": [()=>{
                let x = player.prestiges[1].root(1.5).div(10).add(1).pow(-1)
                return x
            },x=>"減少 "+formatReduction(x)],
            "33": [()=>{
                let x = tmp.qu.chroma_eff[1][0].max(1).log10().add(1).pow(2)
                return x
            },x=>"推遲 x"+x.format()],
            "139": [()=>{
                let x = Decimal.pow(3,player.dark.matters.final)
                return x
            },x=>"x"+x.format(0)],
        },
        {
            "5": [()=>{
                let x = player.prestiges[2].root(2).div(10).add(1)
                return x.toNumber()
            },x=>"x"+format(x,2)],
            "8": [()=>{
                let x = player.prestiges[2].root(3).div(10).add(1).pow(-1)
                return x.toNumber()
            },x=>"弱 "+formatReduction(x)],
            "22": [()=>{
                let x = Decimal.pow(2,player.prestiges[2].pow(.5))
                return x
            },x=>"x"+format(x)],
            "28": [()=>{
                let x = player.prestiges[1].root(2).div(10).add(1)
                return x
            },x=>"x"+format(x)],
        },
        {
            "2": [()=>{
                let x = Decimal.pow(1.25,player.prestiges[3])
                return x
            },x=>"推遲 x"+x.format()],
            "4": [()=>{
                let x = player.prestiges[3].div(2).add(1)
                return x
            },x=>"x"+x.format()],
            
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

function hasPrestige(x,y) { return player.prestiges[x].gte(y) && !(tmp.c16active && CORRUPTED_PRES[x] && CORRUPTED_PRES[x].includes(y)) }

function prestigeEff(x,y,def=E(1)) { return tmp.prestiges.eff[x][y] || def }

function updateRanksTemp() {
    if (!tmp.ranks) tmp.ranks = {}
    for (let x = 0; x < RANKS.names.length; x++) if (!tmp.ranks[RANKS.names[x]]) tmp.ranks[RANKS.names[x]] = {}
    let fp2 = tmp.qu.chroma_eff[1][0]
    let ffp = E(1)
    let ffp2 = 1
    if (tmp.c16active || player.dark.run.active) ffp2 /= mgEff(5)

    let fp = RANKS.fp.rank().mul(ffp)
    tmp.ranks.rank.req = E(10).pow(player.ranks.rank.div(ffp2).scaleEvery('rank',false,[1,1,1,1,fp2]).div(fp).pow(1.15)).mul(10)
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

    tmp.ranks.tetr.req = player.ranks.tetr.div(ffp2).scaleEvery('tetr',false,[1,1,1,fp2]).div(fp).pow(pow).mul(3).add(10-tps).floor()
    tmp.ranks.tetr.bulk = player.ranks.tier.sub(10-tps).div(3).max(0).root(pow).mul(fp).scaleEvery('tetr',true,[1,1,1,fp2]).mul(ffp2).add(1).floor();

    fp = E(1).mul(ffp)
    let fpa = hasPrestige(1,33) ? [1,1,1,prestigeEff(1,33,1)] : []
    if (player.ranks.hex.gte(1)) fp = fp.div(0.8)
    pow = 1.5
    tmp.ranks.pent.req = player.ranks.pent.div(ffp2).scaleEvery('pent',false,fpa).div(fp).pow(pow).add(15-tps).floor()
    tmp.ranks.pent.bulk = player.ranks.tetr.sub(15-tps).gte(0)?player.ranks.tetr.sub(15-tps).max(0).root(pow).mul(fp).scaleEvery('pent',true,fpa).mul(ffp2).add(1).floor():E(0);

    fp = E(1)
    pow = 1.8
    let s = 20
    if (hasElement(167)) {
        s /= 2
        pow *= 0.9
    }
    tmp.ranks.hex.req = player.ranks.hex.div(ffp2).div(fp).scaleEvery('hex',false).pow(pow).add(s-tps).floor()
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

    // Beyond

    tmp.beyond_ranks.max_tier = BEYOND_RANKS.getTier()
    tmp.beyond_ranks.latestRank = BEYOND_RANKS.getRankFromTier(tmp.beyond_ranks.max_tier)

    tmp.beyond_ranks.req = BEYOND_RANKS.req()
    tmp.beyond_ranks.bulk = BEYOND_RANKS.bulk()

    for (let x in BEYOND_RANKS.rewardEff) {
        for (let y in BEYOND_RANKS.rewardEff[x]) {
            if (BEYOND_RANKS.rewardEff[x][y]) tmp.beyond_ranks.eff[x][y] = BEYOND_RANKS.rewardEff[x][y][0]()
        }
    }
}

const BEYOND_RANKS = {
    req() {
        let x = player.ranks.beyond.pow(1.25).mul(10).add(180).ceil()
        return x
    },
    bulk() {
        let x = player.ranks.hex.gte(180)?player.ranks.hex.sub(180).div(10).max(0).root(1.25).add(1).floor():E(0)
        return x
    },
    getTier() {
        let x = player.ranks.beyond.gt(0)?player.ranks.beyond.log10().max(0).pow(.8).add(1).floor().toNumber():1
        return x
    },
    getRankFromTier(i) {
        let hp = Decimal.pow(10,(i-1)**(1/.8)).ceil()

        return player.ranks.beyond.div(hp).floor()
    },
    getRequirementFromTier(i,t=tmp.beyond_ranks.latestRank,mt=tmp.beyond_ranks.max_tier) {
        return Decimal.pow(10,(mt)**(1/.8)-(mt-i)**(1/.8)).mul(Decimal.add(t,1)).ceil()
    },

    reset(auto=false) {
        if (player.ranks.hex.gte(tmp.beyond_ranks.req) && (!auto || tmp.beyond_ranks.bulk.gt(player.ranks.beyond))) {
            player.ranks.beyond = auto ? player.ranks.beyond.max(tmp.beyond_ranks.bulk) : player.ranks.beyond.add(1)

            if (hasBeyondRank(2,2)) return;

            player.ranks.hex = E(0)
            DARK.doReset()
        }
    },

    rewards: {
        1: {
            1: `有色質量指數增加 0.5。`,
            2: `暗束加強所有有色物質的升級。`,
            4: `FSS 加強鈾砹混合體的第二個效果。`,
            7: `七級層提升有色物質獲得量。`,
        },
        2: {
            1: `自動購買超·級別。超·級別提升重置底數。`,
            2: `超·級別不再重置任何東西。[元輕子] 的效果乘以 8。`,
            4: `加速器的效果影響時間速度、黑洞壓縮器和宇宙射線的力量。賦色子獲得量 ^1.1。`,
            7: `七級層提升費米子（除了元費米子）的獲得量。`,
            10: `黑洞質量 ^1.2。`,
            15: `移除質量 1-3 的所有增幅。`,
            17: `黑洞質量加強 [qu9]。量子化次數推遲奇異級超新星。`,
            20: `更換挑戰 1 的獎勵。`,
        },
        3: {
            1: `普通質量的 arv 階數減弱質量和提重器溢出。`
        },
    },

    rewardEff: {
        1: {
            2: [
                ()=>{
                    let x = player.dark.rays.add(1).log10().root(2).softcap(10,0.25,0).toNumber()/100+1

                    return x
                },
                x=>"加強 "+formatPercent(x-1)+softcapHTML(x,1.1),
            ],
            4: [
                ()=>{
                    let x = player.dark.matters.final**0.75/10+1

                    return x
                },
                x=>"加強 "+formatPercent(x-1),
            ],
            7: [
                ()=>{
                    let x = player.ranks.beyond.add(1).root(2)

                    return x
                },
                x=>"^"+format(x),
            ],
        },
        2: {
            1: [
                ()=>{
                    let x = player.ranks.beyond.pow(3).add(1)

                    return x
                },
                x=>"x"+format(x),
            ],
            7: [
                ()=>{
                    let x = player.ranks.beyond.add(1).log10().add(1).pow(2)

                    return overflow(x,10,0.5)
                },
                x=>"x"+format(x),
            ],
            17: [
                ()=>{
                    let x = player.bh.mass.add(1).log10().add(1).log10().add(1).pow(2)

                    let y = player.qu.times.add(1).log10().root(2).div(8).add(1)

                    return [x,y]
                },
                x=>"強 x"+format(x[0])+"；推遲 x"+format(x[1]),
            ],
        },
        3: {
            1: [
                ()=>{
                    let x = Decimal.pow(0.99,player.mass.div(1.5e56).max(1).log10().div(1e9).max(1).log10().div(15).root(3))

                    return x
                },
                x=>"弱 "+formatReduction(x),
            ],
        },
    },
}

const RTNS = [
    ['','等級','階','層','五級層','六級層','七級層','八級層','九級層'],
    ['','十級層','二十級層'],
    ['','一百級層'],
]

const RTNS2 = ['','一','二','三','四','五','六','七','八','九'] // o, d, h

function getRankTierName(i) {
    if (i >= 999) return '['+format(i,0,9,'sc')+']'
    else {
        if (i < 9) return RTNS[0][i]
        i += 1
        let m = ''
        let h = Math.floor(i / 100), d = Math.floor(i / 10) % 10, o = i % 10

        if (h == 0 && d == 1) m = '十' + RTNS2[o]
        else if (h == 0 && d > 1) m = RTNS2[d] + '十' + RTNS2[o]
        else if (h > 0 && d == 0 && o == 0) m = RTNS2[h] + '百'
        else if (h > 0 && d == 0 && o > 0) m = RTNS2[h] + '百零' + RTNS2[o]
        else if (h > 0 && d > 0) m = RTNS2[h] + '百' + RTNS2[d] + '十' + RTNS2[o]

        m += '級層'

        return m
    }
}

function hasBeyondRank(x,y) {
    let t = tmp.beyond_ranks.max_tier, lt = tmp.beyond_ranks.latestRank||E(0)
    return t > x || t == x && lt.gte(y)
}

function beyondRankEffect(x,y,def=1) {
    let e = tmp.beyond_ranks.eff[x]
    return e?e[y]||def:def
}

function updateRanksHTML() {
    tmp.el.rank_tabs.setDisplay(hasUpgrade('br',9))
    for (let x = 0; x < 2; x++) {
        tmp.el["rank_tab"+x].setDisplay(tmp.rank_tab == x)
    }

    if (tmp.rank_tab == 0) {
        for (let x = 0; x < RANKS.names.length; x++) {
            let rn = RANKS.names[x]
            let unl = (!tmp.brUnl || x > 3)&&(RANKS.unl[rn]?RANKS.unl[rn]():true)
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

        let unl = tmp.brUnl

        tmp.el.pre_beyond_ranks.setDisplay(unl)
        tmp.el.beyond_ranks.setDisplay(unl)
        if (unl) {
            let h = ''
            for (let x = 0; x < 4; x++) {
                let rn = RANKS.names[x]
                h += '<div>第 ' + format(player.ranks[rn],0) + ' 個' + getScalingName(rn) + RANKS.fullNames[x] + '</div>'
            }
            tmp.el.pre_beyond_ranks.setHTML(h)

            // Beyond Rank

            tmp.el.br_auto.setDisplay(hasBeyondRank(2,1))
            tmp.el.br_auto.setTxt(player.auto_ranks.beyond?"開啟":"關閉")

            let t = tmp.beyond_ranks.max_tier
            h = ''

            for (let x = Math.min(3,t)-1; x >= 0; x--) {
                h += "第 " + (x == 0 ? tmp.beyond_ranks.latestRank.format(0) : BEYOND_RANKS.getRankFromTier(t-x).format(0)) +  " 個" + getRankTierName(t+5-x) + (x>0?'<br>':"")
            }

            tmp.el.br_amt.setHTML(h)

            let r = '', b = false

            for (tt in BEYOND_RANKS.rewards) {
                b = false
                for (tr in BEYOND_RANKS.rewards[tt]) {
                    tt = Number(tt)
                    if (tt > t || (tmp.beyond_ranks.latestRank.lt(tr) && tt == t)) {
                        r = "在第 "+format(tr,0)+" 個"+getRankTierName(tt+5)+"，"+BEYOND_RANKS.rewards[tt][tr]
                        b = true
                        break
                    }
                }
                if (b) break;
            }

            h = `
                重置六級層（並強制執行暗界重置），但你會升級。${r}<br>
                升${getRankTierName(t+5)}的要求：第 ${
                    t == 1
                    ? tmp.beyond_ranks.req.format(0)
                    : BEYOND_RANKS.getRequirementFromTier(1,tmp.beyond_ranks.latestRank,t-1).format(0)
                } 個${getRankTierName(t+4)}。<br>
                升${getRankTierName(t+6)}的要求：第 ${BEYOND_RANKS.getRequirementFromTier(1,0).format(0)} 個${getRankTierName(t+5)}。
            `

            tmp.el.br_desc.setHTML(h)
            tmp.el.br_desc.setClasses({btn: true, reset: true, locked: player.ranks.hex.lt(tmp.beyond_ranks.req)})
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