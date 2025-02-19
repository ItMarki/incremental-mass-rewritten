const RANKS = {
    names: ['rank', 'tier', 'tetr', 'pent', 'hex'],
    fullNames: ['等級', '階', '層', '五級層', '六級層'],
    reset(type) {
        if (tmp.ranks[type].can) {
            player.ranks[type] = player.ranks[type].add(1)
            let reset = true
            if (tmp.chal14comp || tmp.inf_unl) reset = false
            else if (type == "rank" && player.mainUpg.rp.includes(4)) reset = false
            else if (type == "tier" && player.mainUpg.bh.includes(4)) reset = false
            else if (type == "tetr" && hasTree("qol5")) reset = false
            else if (type == "pent" && hasTree("qol8")) reset = false
            if (reset) this.doReset[type]()
            updateRanksTemp()
            
            addQuote(1)
        }
    },
    bulk(type) {
        if (tmp.ranks[type].can) {
            player.ranks[type] = player.ranks[type].max(tmp.ranks[type].bulk.max(player.ranks[type].add(1)))
            let reset = true
            if (tmp.chal14comp || tmp.inf_unl) reset = false
            if (type == "rank" && player.mainUpg.rp.includes(4)) reset = false
            else if (type == "tier" && player.mainUpg.bh.includes(4)) reset = false
            else if (type == "tetr" && hasTree("qol5")) reset = false
            else if (type == "pent" && hasTree("qol8")) reset = false
            if (reset) this.doReset[type]()
            updateRanksTemp()
        }
    },
    unl: {
        tier() { return player.ranks.rank.gte(3) || player.ranks.tier.gte(1) || player.mainUpg.atom.includes(3) || tmp.radiation.unl || tmp.inf_unl },
        tetr() { return player.mainUpg.atom.includes(3) || tmp.radiation.unl || tmp.inf_unl },
        pent() { return tmp.radiation.unl || tmp.inf_unl },
        hex() { return tmp.chal13comp || tmp.inf_unl },
    },
    doReset: {
        rank() {
            player.mass = E(0)
            for (let x = 1; x <= UPGS.mass.cols; x++) BUILDINGS.reset("mass_"+x)
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
        rank() { return player.mainUpg.rp.includes(5) || tmp.inf_unl },
        tier() { return player.mainUpg.rp.includes(6) || tmp.inf_unl },
        tetr() { return player.mainUpg.atom.includes(5) || tmp.inf_unl },
        pent() { return hasTree("qol8") || tmp.inf_unl },
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
            '800': "基於等級，質量軟上限弱 0.25%。該效果在 25% 到達硬上限。",
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
            '15': "從增強器中移除第 3 個軟上限。",
        },
        hex: {
            '1': "五級層要求減少 20%。",
            '4': "每擁有一個六級層，暗束獲得量提升 20%。",
            '6': "移除第 1 個質量軟上限。",
            '10': "移除第 2 個質量軟上限。",
            '13': "移除第 3 個質量軟上限。",
            '17': "移除第 4 個質量軟上限。",
            '36': "移除第 5 個質量軟上限。",
            '43': "大幅增強第 4 六級層的效果。",
            '48': "移除第 6 個質量軟上限。",
            '62': "移除第 7 個質量軟上限。",
            '91': "有色物質指數 +0.15。",
            '157': "移除第 8 個質量軟上限。",
        },
    },
    effect: {
        rank: {
            '3'() {
                let ret = player.build.mass_1.amt.div(20)
                return ret
            },
            '5'() {
                let ret = player.build.mass_2.amt.div(40)
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
                return overflow(ret,'ee100',0.5).overflow('ee40000',0.25,2)
            },
            '8'() {
                let ret = player.bh.dm.max(1).log10().add(1).root(2)
                return ret.overflow('ee5',0.5)
            },
            '55'() {
                let ret = player.ranks.tier.max(1).log10().add(1).root(4)
                return ret
            },
        },
        tetr: {
            '2'() {
                let ret = player.build.mass_3.amt.div(400)
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
                if (hex.gte(43)) ret = ret.pow(hex.min(1e18).div(10).add(1).root(2))
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
    names: ['prestige','honor','glory','renown','valor'],
    fullNames: ["重置等級", "榮耀", '榮譽', '聲望', '英勇'],
    baseExponent() {
        let x = E(0)

        if (hasElement(100)) x = x.add(tmp.elements.effect[100])
        if (hasPrestige(0,32)) x = x.add(prestigeEff(0,32,0))
        x = x.add(tmp.fermions.effs[1][6]||0).add(glyphUpgEff(10,0))
        if (tmp.inf_unl) x = x.add(theoremEff('mass',3,0))

        x = x.add(1)

        if (hasBeyondRank(4,2)) x = x.mul(beyondRankEffect(4,2))
        if (hasAscension(1,1)) x = x.mul(2)

        if (tmp.c16active || inDarkRun()) x = x.div(mgEff(5))

        return x.overflow(2e4,0.5)
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
                x = y.scaleEvery('prestige3',false,[0,fp]).pow(1.25).mul(3).add(9)
                break;
            case 4:
                x = y.div(fp).scaleEvery('prestige4',false).pow(1.25).mul(4).add(20)
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
                if (y.gte(9)) x = y.sub(9).div(3).max(0).root(1.25).scaleEvery('prestige3',true,[0,fp]).add(1)
                break 
            case 4:
                if (y.gte(12)) x = y.sub(20).div(4).max(0).root(1.25).scaleEvery('prestige4',true).mul(fp).add(1)
                break 
            default:
                x = E(0)
                break;
        }
        return x.floor()
    },
    fp(i) {
        let fp = E(1)
        if (player.prestiges[2].gte(1) && i < 2) fp = fp.mul(1.15)
        if (player.prestiges[3].gte(1) && i < 3) fp = fp.mul(1.1)
        if (hasUpgrade('br',19) && i < (hasAscension(1,1) ? 4 : 3)) fp = fp.mul(upgEffect(4,19))
        return fp
    },
    unl: [
        ()=>true,
        ()=>true,
        ()=>tmp.chal14comp||tmp.inf_unl,
        ()=>tmp.brUnl||tmp.inf_unl,
        ()=>hasElement(267),
    ],
    noReset: [
        ()=>hasUpgrade('br',11)||tmp.inf_unl,
        ()=>tmp.chal13comp||tmp.inf_unl,
        ()=>tmp.chal15comp||tmp.inf_unl,
        ()=>tmp.inf_unl,
        ()=>hasElement(267),
    ],
    autoUnl: [
        ()=>tmp.chal13comp||tmp.inf_unl,
        ()=>tmp.chal14comp||tmp.inf_unl,
        ()=>tmp.chal15comp||tmp.inf_unl,
        ()=>tmp.inf_unl,
        ()=>hasElement(267),
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
            "110": `119 號元素稍微更強。`,
            "190": `鋯-40 稍微更強。`,
            "218": `145 號元素稍微更強。`,
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
            "127": `移除等級和階的所有奇異級前增幅，但是挑戰 5 的獎勵以及鈾砹混合體對等級和階的第 1 個效果無效。`,
            "139": `每擁有一個 FSS，有色物質生產加快至 3x。FVM 稍微更便宜。`,
            "167": `FFS 對第 4 個深淵之漬獎勵提供指數加成。`,
            "247": `MCF 階數提升 K 介子獲得量。`,
            "300": `[元夸克] 和 [元輕子] 的軟上限稍微更弱。`,
            400: `每個粒子力量的第 1 個效果更強。`,
            510: `K 介子和 π 介子的獲得量 ^1.1。`,
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
            "34": `π 介子稍微提升 K 介子獲得量。`,
            "40": `加強 [ct4] 的效果。`,
            "45": `不穩定黑洞影響黑洞溢出^2。`,
            58: `超·級別每到達一個新的最高級別，奇異原子的獎勵強度增加 5%。`,
            121: `第 1 個八級層的獎勵 ^4。`,
            
        },
        {
            "1": `之前重置的要求減少 10%。`,
            "2": `每擁有一個聲望，奇異級超新星推遲 x1.25。`,
            "4": `每擁有一個聲望，腐化碎片獲得量提升 50%。`,
            "6": `奇異原子提升其他資源。`,
            10: `第 388 個重置等級的獎勵也影響榮譽增幅。`,
        },
        {
            1: `超級聲望弱 25%。`,
            7: `腐化恆星升級 1 和 2 的價格除以 1e10。`,
            12: `大幅增強第 7 個八級層的獎勵。`,
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
                let x = player.prestiges[0].div(1e4)
                return x
            },x=>"+^"+format(x)],
            "233": [()=>{
                let x = player.dark.matters.amt[0].add(1).log10().add(1).log10().add(1).pow(2)
                return x
            },x=>"x"+format(x)],
            "382": [()=>{
                let x = player.prestiges[0].max(0).root(2).div(1e3)
                if (hasPrestige(0,1337)) x = x.mul(10)
                return x
            },x=>"+"+format(x)],
            "388": [()=>{
                let x = tmp.qu.chroma_eff[1][1].root(2)
                return x
            },x=>"弱 "+formatReduction(x)],
            "607": [()=>{
                let x = tmp.prestiges.base.max(1).pow(1.5).softcap('e7500',0.1,0).min('e50000')
                return x
            },x=>"x"+format(x)+softcapHTML(x,'e7500')],
            "1337": [()=>{
                let x = tmp.preQUGlobalSpeed.max(1).log10().add(1).log10().div(10)
                return x
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
            "247": [()=>{
                let x = Decimal.pow(player.dark.exotic_atom.tier.add(1),1.5)
                return x
            },x=>"x"+x.format()],
        },
        {
            "5": [()=>{
                let x = player.prestiges[2].root(2).div(10).add(1)
                return x
            },x=>"x"+format(x,2)],
            "8": [()=>{
                let x = player.prestiges[2].root(3).div(10).add(1).pow(-1)
                return x
            },x=>"弱 "+formatReduction(x)],
            "22": [()=>{
                let x = Decimal.pow(2,player.prestiges[2].pow(.5))
                return x
            },x=>"x"+format(x)],
            "28": [()=>{
                let x = player.prestiges[1].root(2).div(10).add(1)
                return x
            },x=>"x"+format(x)],
            "34": [()=>{
                let x = player.dark.exotic_atom.amount[1].add(1).log10().add(1).pow(1.5)
                return x
            },x=>"x"+format(x)],
            "45": [()=>{
                let y = player.bh.unstable//.overflow(1e24,0.5,0)
                let x = hasElement(224) ? Decimal.pow(1.1,y.root(4)) : y.add(1)
                if (tmp.c16active) x = overflow(x.log10().add(1).root(2),10,0.5)
                return overflow(x,1e100,0.5).min('e1750')
            },x=>"推遲 ^"+format(x)],
            58: [()=>{
                let x = tmp.beyond_ranks.max_tier.mul(.05)
                return x
            },x=>"+"+formatPercent(x)],
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
            "6": [()=>{
                let x = tmp.exotic_atom.amount.add(1).log10().add(1)
                return x
            },x=>"x"+x.format()],
        },
        {

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
    let ifp = E(1)
    if (tmp.inf_unl) ifp = ifp.mul(theoremEff('mass',2))
    let fp2 = tmp.qu.chroma_eff[1][0]
    
    let tetr_fp2 = !hasElement(243) && hasCharger(8) ? 1 : fp2

    let rt_fp2 = !hasElement(243) && hasPrestige(1,127) ? tmp.c16active ? 5e2 : 1 : fp2
    let ffp = E(1)
    let ffp2 = 1
    if (tmp.c16active || inDarkRun()) ffp2 /= mgEff(5)

    let rooted_fp = GPEffect(3)

    let fp = RANKS.fp.rank().mul(ffp)
    tmp.ranks.rank.req = E(10).pow(player.ranks.rank.div(ffp2).scaleEvery('rank',false,[1,1,1,1,rt_fp2,1,ifp]).pow(rooted_fp).div(fp).pow(1.15)).mul(10)
    tmp.ranks.rank.bulk = E(0)
    if (player.mass.gte(10)) tmp.ranks.rank.bulk = player.mass.div(10).max(1).log10().root(1.15).mul(fp).root(rooted_fp).scaleEvery('rank',true,[1,1,1,1,rt_fp2,1,ifp]).mul(ffp2).add(1).floor();
    tmp.ranks.rank.can = player.mass.gte(tmp.ranks.rank.req) && !CHALS.inChal(5) && !CHALS.inChal(10) && !FERMIONS.onActive("03")

    fp = RANKS.fp.tier().mul(ffp)
    tmp.ranks.tier.req = player.ranks.tier.div(ifp).div(ffp2).scaleEvery('tier',false,[1,1,1,rt_fp2]).div(fp).add(2).pow(2).floor()
    tmp.ranks.tier.bulk = player.ranks.rank.max(0).root(2).sub(2).mul(fp).scaleEvery('tier',true,[1,1,1,rt_fp2]).mul(ffp2).mul(ifp).add(1).floor();

    fp = E(1).mul(ffp)
    let pow = 2
    if (hasElement(44)) pow = 1.75
    if (hasElement(9)) fp = fp.mul(1/0.85)
    if (player.ranks.pent.gte(1)) fp = fp.mul(1/0.85)
    if (hasElement(72)) fp = fp.mul(1/0.85)

    let tps = 0

    tmp.ranks.tetr.req = player.ranks.tetr.div(ifp).div(ffp2).scaleEvery('tetr',false,[1,1,1,tetr_fp2]).div(fp).pow(pow).mul(3).add(10-tps).floor()
    tmp.ranks.tetr.bulk = player.ranks.tier.sub(10-tps).div(3).max(0).root(pow).mul(fp).scaleEvery('tetr',true,[1,1,1,tetr_fp2]).mul(ffp2).mul(ifp).add(1).floor();

    fp = E(1).mul(ffp)
    let fpa = hasPrestige(1,33) ? [1,1,1,prestigeEff(1,33,1)] : []
    if (player.ranks.hex.gte(1)) fp = fp.div(0.8)
    pow = 1.5
    tmp.ranks.pent.req = player.ranks.pent.div(ifp).div(ffp2).scaleEvery('pent',false,fpa).div(fp).pow(pow).add(15-tps).floor()
    tmp.ranks.pent.bulk = player.ranks.tetr.sub(15-tps).gte(0)?player.ranks.tetr.sub(15-tps).max(0).root(pow).mul(fp).scaleEvery('pent',true,fpa).mul(ffp2).mul(ifp).add(1).floor():E(0);

    fp = E(1)
    pow = 1.8
    let s = 20
    if (hasElement(167)) {
        s /= 2
        pow *= 0.9
    }
    tmp.ranks.hex.req = player.ranks.hex.div(ifp).div(ffp2).div(fp).scaleEvery('hex',false).pow(pow).add(s-tps).floor()
    tmp.ranks.hex.bulk = player.ranks.pent.sub(s-tps).gte(0)?player.ranks.pent.sub(s-tps).max(0).root(pow).scaleEvery('hex',true).mul(fp).mul(ffp2).mul(ifp).add(1).floor():E(0);

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

    // Ascension

    updateAscensionsTemp()

    // Beyond

    let p = 1

    if (hasElement(221)) p /= 0.95
    p /= getFragmentEffect('time')

    tmp.beyond_ranks.tier_power = p

    let rcs = E(1e14)

    if (hasUpgrade('rp',22)) rcs = rcs.mul(upgEffect(1,22))
    if (hasElement(287)) rcs = rcs.mul(elemEffect(287))

    tmp.rank_collapse.start = rcs

    tmp.beyond_ranks.scale_start = 24
    tmp.beyond_ranks.scale_pow = 1.6
    
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
        let p = player.ranks.beyond, rc = tmp.rank_collapse

        let x = p.scale(rc.start,rc.power,2).pow(1.25).mul(10).add(180)

        rc.reduction = p.gte(rc.start) ? x.log(p.pow(1.25).mul(10).add(180)) : E(1)

        return x.ceil()
    },
    bulk() {
        let rc = tmp.rank_collapse

        let x = player.ranks.hex.gte(180)?player.ranks.hex.sub(180).div(10).max(0).root(1.25).scale(rc.start,rc.power,2,true).add(1).floor():E(0)

        return x
    },
    getTier(r=player.ranks.beyond) {
        let x = r.gt(0)?r.log10().max(0).pow(.8).mul(tmp.beyond_ranks.tier_power).add(1).scale(tmp.beyond_ranks.scale_start,tmp.beyond_ranks.scale_pow,0,true).floor():E(1)
        return x
    },
    getRankFromTier(i,r=player.ranks.beyond) {
        let hp = Decimal.pow(10,Decimal.pow(Decimal.sub(i.scale(tmp.beyond_ranks.scale_start,tmp.beyond_ranks.scale_pow,0),1).div(tmp.beyond_ranks.tier_power),1/.8)).ceil()

        return r.div(hp).floor()
    },
    getRequirementFromTier(i,t=tmp.beyond_ranks.latestRank,mt=tmp.beyond_ranks.max_tier) {
        let s = tmp.beyond_ranks.scale_start, p = tmp.beyond_ranks.scale_pow
        return Decimal.pow(10,Decimal.pow(Decimal.div(mt.add(1).scale(s,p,0).sub(1),tmp.beyond_ranks.tier_power),1/.8).sub(Decimal.pow(Decimal.sub(mt,i).add(1).scale(s,p,0).sub(1).div(tmp.beyond_ranks.tier_power),1/.8))).mul(Decimal.add(t,1)).ceil()
        // Decimal.pow(10,Math.pow(mt/tmp.beyond_ranks.tier_power,1/.8)-Math.pow((mt-i)/tmp.beyond_ranks.tier_power,1/.8)).mul(Decimal.add(t,1)).ceil()
    },
    getRankDisplayFromValue(r) {
        let tier = this.getTier(r), current = this.getRankFromTier(tier,r);

        return '第 '+current.format(0)+' 個'+getRankTierName(tier.add(5))
    },

    reset(auto=false) {
        if (player.ranks.hex.gte(tmp.beyond_ranks.req) && (!auto || tmp.beyond_ranks.bulk.gt(player.ranks.beyond))) {
            player.ranks.beyond = auto ? player.ranks.beyond.max(tmp.beyond_ranks.bulk) : player.ranks.beyond.add(1)

            if (hasBeyondRank(2,2)||hasInfUpgrade(10)) return;

            player.ranks.hex = E(0)
            DARK.doReset()
        }
    },

    rewards: {
        1: {
            1: `有色質量指數增加 0.5。`,
            2: `暗束加強所有有色物質的升級。`,
            4: `FSS 加強第 2 個鈾砹混合體效果。`,
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
            1: `普通質量的主宇宙（arv）階數減弱質量和提重器溢出。`,
            2: `超級 FSS 推遲 1 個。`,
            4: `超·級別提升 K 介子和 π 介子獲得量。`,
            12: `移除第 4 個暗束獎勵的軟上限。`,
            18: `超·級別每達到一個級數，超級 FSS 增幅弱 2.5%（最高 50%）。`,
            32: `氬-18 加強時間速度力量。`,
        },
        4: {
            1: `Β 粒子稍微推遲超臨界超新星。`,
            2: `由十級層開始，超·級別的最高級數提升重置底數的指數。`,
            40: `[陶子] 的獎勵 ^3。`,
        },
        5: {
            2: `由十級層開始，超·級別每達到一個級數，超級 FSS 推遲 +1 個。`,
            7: `移除重置等級的元級前增幅。`,
        },
        6: {
            1: `「自我無限」和「奇異速度」升級的公式從 2 改為以 3 作為底數。`,
            12: `231 號元素的效果 ^3。`,
        },
        8: {
            1: `超·級別每達到一個級數，無限點數獲得量翻倍。`,
        },
        11: {
            1: `移除榮耀和榮譽的所有增幅。`,
        },
        12: {
            1: `中子元素-0 極微加強挑戰 16 的獎勵。`,
        },
        14: {
            1: `第 2 個十級層的效果公式更好。由二十級層開始，超·級別的最高級數推遲元級重置等級。`,
        },
        16: {
            1: `由二十級層開始，超·級別的最高級數提升升華底數的質數。`,
        },
        20: {
            1: `第 2 個加速器效果軟上限稍微更弱。`,
        },
        28: {
            1: `超級無限定理推遲 +5 個。`,
        },
    },

    rewardEff: {
        1: {
            2: [
                ()=>{
                    let x = player.dark.rays.add(1).log10().root(2).softcap(10,0.25,0).div(100).add(1)

                    return x
                },
                x=>"加強 "+formatPercent(x-1)+softcapHTML(x,1.1),
            ],
            4: [
                ()=>{
                    let x = player.dark.matters.final.pow(.75).div(10).add(1)

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
                    let x = player.ranks.beyond.pow(3)

                    if (hasPrestige(2,121)) x = x.pow(4)

                    return x.add(1)
                },
                x=>"x"+format(x),
            ],
            7: [
                ()=>{
                    let x = hasPrestige(4,12) ? player.ranks.beyond.add(1).pow(0.4) : player.ranks.beyond.add(1).log10().add(1).pow(2).overflow(10,0.5)

                    return x
                },
                x=>"x"+format(x),
            ],
            17: [
                ()=>{
                    let x = player.bh.mass.add(1).log10().add(1).log10().add(1).pow(2)

                    let y = player.qu.times.add(1).log10().root(2).div(8).add(1)

                    return [x,y]
                },
                x=>"加強 x"+format(x[0])+"；推遲 x"+format(x[1]),
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
            4: [
                ()=>{
                    let x = player.ranks.beyond.add(1).log10().add(1).pow(2)

                    return x
                },
                x=>"x"+format(x),
            ],
            18: [
                ()=>{
                    let x = Decimal.sub(1,tmp.beyond_ranks.max_tier.mul(0.025))

                    return Decimal.max(0.5,x)
                },
                x=>"弱 "+formatReduction(x),
            ],
        },
        4: {
            1: [
                ()=>{
                    let x = overflow(tmp.prim.eff[7].div(5),1e6,0.5).softcap(1e7,1/3,0)

                    return x
                },
                x=>"推遲 +"+format(x),
            ],
            2: [
                ()=>{
                    let x = tmp.beyond_ranks.max_tier.sub(3).pow(hasBeyondRank(14,1) ? 1 : .2).mul(.2).add(1) // (tmp.beyond_ranks.max_tier-3)**0.2*0.2+1

                    return Decimal.max(1,x)
                },
                x=>"x"+format(x),
            ],
        },
        5: {
            2: [
                ()=>{
                    let x = tmp.beyond_ranks.max_tier.sub(1)

                    return Decimal.max(1,x)
                },
                x=>"推遲 +"+format(x,0)+' 個',
            ],
        },
        8: {
            1: [
                ()=>{
                    let x = Decimal.pow(2,tmp.beyond_ranks.max_tier)

                    return x
                },
                x=>formatMult(x),
            ],
        },
        12: {
            1: [
                ()=>{
                    let x = tmp.qu.chroma_eff[2].max(1).log10().add(1).root(3)

                    return x
                },
                x=>formatMult(x),
            ],
        },
        14: {
            1: [
                ()=>{
                    let x = Decimal.pow(1.25,tmp.beyond_ranks.max_tier.sub(13).max(0).root(2))

                    return x
                },
                x=>"推遲 "+formatMult(x),
            ],
        },
        16: {
            1: [
                ()=>{
                    let x = tmp.beyond_ranks.max_tier.sub(13).max(0).div(50)

                    return x
                },
                x=>"+"+format(x),
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
    if (Decimal.gte(i,999)) return '['+format(i,0,9,'sc')+']'
    else {
        i = Number(i)
        
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
    return t.gt(x) || t.eq(x) && lt.gte(y)
}

function beyondRankEffect(x,y,def=1) {
    let e = tmp.beyond_ranks.eff[x]
    return e?e[y]||def:def
}

function updateRanksHTML() {
    tmp.el.rank_tabs.setDisplay(hasUpgrade('br',9))
    tmp.el.asc_btn.setDisplay(tmp.ascensions_unl)
    for (let x = 0; x < 3; x++) {
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
                tmp.el["ranks_auto_"+x].setTxt(player.auto_ranks[rn]?"開":"關")
            }
        }

        let unl = tmp.brUnl

        tmp.el.pre_beyond_ranks.setDisplay(unl)
        tmp.el.beyond_ranks.setDisplay(unl)
        if (unl) {
            let h = ''
            for (let x = 0; x < 4; x++) {
                let rn = RANKS.names[x]
                h += '<div>第 <h4>' + format(player.ranks[rn],0) + '</h4> 個' + getScalingName(rn) + RANKS.fullNames[x] + '</div>'
            }
            tmp.el.pre_beyond_ranks.setHTML(h)

            // Beyond Rank

            tmp.el.br_auto.setDisplay(hasBeyondRank(2,1)||hasInfUpgrade(10))
            tmp.el.br_auto.setTxt(player.auto_ranks.beyond?"開":"關")

            let t = tmp.beyond_ranks.max_tier
            h = ''

            for (let x = Math.min(3,t.toNumber())-1; x >= 0; x--) {
                h += "第 <h4>" + (x == 0 ? tmp.beyond_ranks.latestRank.format(0) : BEYOND_RANKS.getRankFromTier(t.sub(x)).format(0)) +  "</h4> 個" + getRankTierName(t.add(5).sub(x)) + (x>0?'<br>':"")
            }

            tmp.el.br_amt.setHTML(h)

            let r = '', b = false

            for (tt in BEYOND_RANKS.rewards) {
                b = false
                for (tr in BEYOND_RANKS.rewards[tt]) {
                    tt = Number(tt)
                    if (t.lt(tt) || (tmp.beyond_ranks.latestRank.lt(tr) && t.eq(tt))) {
                        r = "在第 "+format(tr,0)+" 個"+getRankTierName(tt+5)+"，"+BEYOND_RANKS.rewards[tt][tr]
                        b = true
                        break
                    }
                }
                if (b) break;
            }

            h = `
                重置六級層（並強制執行暗界重置），但你會升級。${r}<br>
                升${getRankTierName(t.add(5))}的要求：第 ${
                    t == 1
                    ? tmp.beyond_ranks.req.format(0)
                    : BEYOND_RANKS.getRequirementFromTier(1,tmp.beyond_ranks.latestRank,t.sub(1)).format(0)
                } 個${getRankTierName(t.add(4))}。<br>
                升${getRankTierName(t.add(6))}的要求：第 ${BEYOND_RANKS.getRequirementFromTier(1,0).format(0)} 個${getRankTierName(t.add(5))}。
            `

            tmp.el.br_desc.setHTML(h)
            tmp.el.br_desc.setClasses({btn: true, reset: true, locked: player.ranks.hex.lt(tmp.beyond_ranks.req)})
        }


        let rc = tmp.rank_collapse

        tmp.el.rankCollapse.setDisplay(player.ranks.beyond.gte(rc.start))
        tmp.el.rankCollapse.setHTML(`由於級別塌縮在<b>${BEYOND_RANKS.getRankDisplayFromValue(rc.start)}</b>發生，七級層的要求已經提升至 <b>${rc.reduction.format()}</b> 次方！`)
    }
    else if (tmp.rank_tab == 1) {
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
                tmp.el["pres_req_"+x].setTxt(x==0?"重置底數到達 "+format(tmp.prestiges.req[x],0):"第 "+format(tmp.prestiges.req[x],0)+" 個"+PRESTIGES.fullNames[x-1])
                tmp.el["pres_auto_"+x].setDisplay(PRESTIGES.autoUnl[x]())
                tmp.el["pres_auto_"+x].setTxt(player.auto_pres[x]?"開":"關")
            }
        }

        updateGPHTML()
    }
    else if (tmp.rank_tab == 2) {
        updateAscensionsHTML()
    }
}

const PRES_BEFOREC13 = [40,7]

const GAL_PRESTIGE = {
    req() {
        let x = Decimal.pow(10,player.gal_prestige.scaleEvery('gal_prestige').pow(1.5)).mul(1e17)

        return x
    },
    reset() {
        if (player.supernova.times.gte(tmp.gp.req)) {
            player.gal_prestige = player.gal_prestige.add(1)

            INF.doReset()
        }
    },
    gain(i) {
        let x = E(0), gp = player.gal_prestige

        switch (i) {
            case 0:
                if (gp.gte(1)) {
                    x = player.stars.points.add(1).log10().add(1).log10().add(1).pow(gp.root(1.5)).sub(1)
                }
            break;
            case 1:
                if (gp.gte(2)) {
                    x = tmp.prestiges.base.add(1).log10().add(1).pow(gp.sub(1).root(1.5)).sub(1)
                }
            break;
            case 2:
                if (gp.gte(4)) {
                    x = player.dark.matters.amt[12].add(1).log10().add(1).log10().add(1).pow(2).pow(gp.sub(3).root(1.5)).sub(1)
                }
            break;
            case 3:
                if (gp.gte(6)) {
                    x = player.supernova.radiation.hz.add(1).log10().add(1).log10().add(1).pow(2).pow(gp.sub(5).root(1.5)).sub(1)
                }
            break;
            case 4:
                if (gp.gte(9)) {
                    x = player.inf.cs_amount.add(1).log10().add(1).pow(2).pow(gp.sub(8).root(1.5)).sub(1)
                }
            break;
            case 5:
                if (gp.gte(14)) {
                    x = player.supernova.bosons.hb.add(10).log10().log10().add(1).pow(gp.sub(13).root(1.5)).sub(1)
                }
            break;
        }

        if (hasElement(263)) x = x.mul(elemEffect(263))
        if (hasElement(281)) x = x.mul(elemEffect(281))

        return x
    },
    effect(i) {
        let x, res = player.gp_resources[i]

        switch (i) {
            case 0:
                x = res.add(1).log10().root(2).div(20).add(1)
            break;
            case 1:
                x = Decimal.pow(0.97,res.add(1).log10().overflow(10,0.5).root(2))
            break;
            case 2:
                x = res.add(1).log10().root(3).div(2)
            break;
            case 3:
                x = Decimal.pow(0.9,res.add(10).log10().log10().add(1).pow(2).sub(1))
            break;
            case 4:
                x = Decimal.pow(0.95,res.add(1).slog(10))
            break;
            case 5:
                x = expMult(res.add(1),0.5)
            break;
        }

        return x
    },
    res_length: 5,
}

function GPEffect(i,def=1) { return tmp.gp.res_effect[i]||def }

function updateGPTemp() {
    tmp.gp.req = GAL_PRESTIGE.req()

    for (let i = 0; i < GAL_PRESTIGE.res_length; i++) {
        tmp.gp.res_gain[i] = GAL_PRESTIGE.gain(i)
        tmp.gp.res_effect[i] = GAL_PRESTIGE.effect(i)
    }
}

function updateGPHTML() {
    let unl = hasElement(262)

    tmp.el.galactic_prestige_div.setDisplay(unl)

    if (unl) {
        let gp = player.gal_prestige

        tmp.el.gal_prestige.setHTML(gp.format(0))
        tmp.el.gal_prestige_scale.setHTML(getScalingName('gal_prestige'))
        tmp.el.gp_btn.setHTML(`
        重置超新星（並強制執行無限重置），但你的星系重置會提升一級。下一個星系重置可能會解鎖新的事物。<br><br>
        要求：<b>${tmp.gp.req.format()}</b> 次超新星
        `)
        tmp.el.gp_btn.setClasses({btn: true, galactic: true, locked: player.supernova.times.lt(tmp.gp.req)})

        let h = '', res = player.gp_resources, res_gain = tmp.gp.res_gain, res_effect = tmp.gp.res_effect

        if (gp.gte(1)) h += `你有 <h4>${res[0].format(0)}</h4> ${res[0].formatGain(res_gain[0])} 個星系恆星（基於塌縮恆星和星系重置），對恆星生成器給予 <h4>${formatPercent(res_effect[0].sub(1))}</h4> 的指數加成。<br>`

        if (gp.gte(2)) h += `你有 <h4>${formatMass(res[1])}</h4> ${res[1].formatGain(res_gain[1],true)} 的重置質量（基於重置底數和星系重置），將質量溢出^1-2 減弱 <h4>${formatReduction(res_effect[1])}</h4>。<br>`

        if (gp.gte(4)) h += `你有 <h4>${res[2].format(0)}</h4> ${res[2].formatGain(res_gain[2])} 的星系物質（基於褪色物質和星系重置），將所有有色物質升級的底數提升 <h4>+${format(res_effect[2])}</h4>。<br>`

        if (gp.gte(6)) h += `你有 <h4>${res[3].format(0)}</h4> ${res[3].formatGain(res_gain[3])} 的紅移（基於頻率和星系重置），
        將等級要求減少 <h4>^${format(res_effect[3],5)}</h4>。<br>`

        if (gp.gte(9)) h += `你有 <h4>${res[4].format(0)}</h4> ${res[4].formatGain(res_gain[4])} 法向能量（基於腐化之星和星系重置），
        將腐化之星速度的減少減弱 <h4>${formatReduction(res_effect[4])}</h4>。<br>`

        if (gp.gte(14)) h += `你有 <h4>${res[5].format(0)}</h4> ${res[5].formatGain(res_gain[5])} 個膨脹子（基於希格斯玻色子和星系重置） ，
        將無限前全局運行速度提升 <h4>${formatMult(res_effect[5])}</h4>。<br>`

        tmp.el.gp_rewards.setHTML(h)
    }
}