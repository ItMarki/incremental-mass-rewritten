const RANKS = {
    names: ['rank', 'tier', 'tetr', 'pent'],
    fullNames: ['等級', '階', '層', '五級層'],
    reset(type) {
        if (tmp.ranks[type].can) {
            player.ranks[type] = player.ranks[type].add(1)
            let reset = true
            if (type == "rank" && player.mainUpg.rp.includes(4)) reset = false
            if (type == "tier" && player.mainUpg.bh.includes(4)) reset = false
            if (type == "tetr" && hasTree("qol5")) reset = false
            if (type == "pent" && hasTree("qol8")) reset = false
            if (reset) this.doReset[type]()
            updateRanksTemp()
        }
    },
    bulk(type) {
        if (tmp.ranks[type].can) {
            player.ranks[type] = player.ranks[type].max(tmp.ranks[type].bulk.max(player.ranks[type].add(1)))
            let reset = true
            if (type == "rank" && player.mainUpg.rp.includes(4)) reset = false
            if (type == "tier" && player.mainUpg.bh.includes(4)) reset = false
            if (type == "tetr" && hasTree("qol5")) reset = false
            if (type == "pent" && hasTree("qol8")) reset = false
            if (reset) this.doReset[type]()
            updateRanksTemp()
        }
    },
    unl: {
        tier() { return player.ranks.rank.gte(3) || player.ranks.tier.gte(1) || player.mainUpg.atom.includes(3) || tmp.radiation.unl },
        tetr() { return player.mainUpg.atom.includes(3) || tmp.radiation.unl },
        pent() { return tmp.radiation.unl },
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
    },
    autoSwitch(rn) { player.auto_ranks[rn] = !player.auto_ranks[rn] },
    autoUnl: {
        rank() { return player.mainUpg.rp.includes(5) },
        tier() { return player.mainUpg.rp.includes(6) },
        tetr() { return player.mainUpg.atom.includes(5) },
        pent() { return hasTree("qol8") },
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
            '14': "怒氣點獲得量翻倍。",
            '17': "等級 6 的獎勵效果更好。[(x+1)^2 -> (x+1)^x^1/3]",
            '34': "質量升級 3 的軟限制延遲 1.2x 。",
            '40': "等級提升時間速度力量。",
            '45': "等級提升怒氣點獲得量。",
            '90': "第 40 等級的獎勵更強。",
            '180': "質量獲得量 ^1.025。",
            '220': "第 40 等級的獎勵進一步加強。",
            '300': "夸克獲得量乘以等於。",
            '380': "質量獲得量乘以等於。",
            '800': "基於等級，質量軟限制弱 0.25%。",
        },
        tier: {
            '1': "等級要求減少 20%。",
            '2': "質量獲得量 ^1.15。",
            '3': "所有質量升級的價格增幅弱 20%。",
            '4': "每擁有一個階，時間速度力量增加 5%，在 +40% 開始軟限制。",
            '6': "階提升怒氣點獲得量。",
            '8': "暗物質加強第 6 階的獎勵效果。",
            '12': "第 4 階的獎勵效果翻倍，並移除軟限制。",
            '30': "增強器的效果軟限制弱 10%。",
            '55': "階加強第 380 等級的效果。",
            '100': "超級階延遲 5 階開始。",
        },
        tetr: {
            '1': "階的要求減少 25%；高級階的增幅弱 15%。",
            '2': "質量升級 3 加強自己。",
            '3': "時間速度效果 ^1.05。",
            '4': "階減弱超級等級的增幅；超級階的增幅弱 20%。",
            '5': "層延遲高級/極高級時間速度。",
            '8': "質量軟限制^2 延遲 ^1.5。",
        },
        pent: {
            '1': "層的要求減少 15%；元級等級延遲 1.1x 開始。",
            '2': "層提升所有輻射的獲得量。",
            '4': "超新星延遲元級時間速度。",
            '5': "五級層延遲元級等級。",
			'8': "五級層延遲質量軟限制^4。",
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
            800(x) { return format(E(1).sub(x).mul(100))+"% weaker" },
        },
        tier: {
            4(x) { return "+"+format(x.mul(100))+"%" },
            6(x) { return format(x)+"x" },
            8(x) { return "^"+format(x) },
            55(x) { return "^"+format(x) },
        },
        tetr: {
            2(x) { return "+"+format(x) },
            4(x) { return format(E(1).sub(x).mul(100))+"% weaker" },
            5(x) { return "+"+format(x,0)+" later" },
        },
        pent: {
            2(x) { return format(x)+"x" },
            4(x) { return format(x)+"x later" },
            5(x) { return format(x)+"x later" },
			8(x) { return "^"+format(x)+" later" },
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

function updateRanksTemp() {
    if (!tmp.ranks) tmp.ranks = {}
    for (let x = 0; x < RANKS.names.length; x++) if (!tmp.ranks[RANKS.names[x]]) tmp.ranks[RANKS.names[x]] = {}
    let fp2 = tmp.qu.chroma_eff[1]
    let fp = RANKS.fp.rank()
    tmp.ranks.rank.req = E(10).pow(player.ranks.rank.div(fp).div(fp2).pow(1.15)).mul(10)
    tmp.ranks.rank.bulk = player.mass.div(10).max(1).log10().root(1.15).mul(fp).mul(fp2).add(1).floor();
    if (player.mass.lt(10)) tmp.ranks.rank.bulk = 0
    if (scalingActive("rank", player.ranks.rank.max(tmp.ranks.rank.bulk), "super")) {
		let start = getScalingStart("super", "rank");
		let power = getScalingPower("super", "rank");
		let exp = E(1.5).pow(power);
		tmp.ranks.rank.req =
			E(10).pow(
				player.ranks.rank.div(fp2)
					.pow(exp)
					.div(start.pow(exp.sub(1)))
                    .div(fp)
					.pow(1.15)
			).mul(10)
		tmp.ranks.rank.bulk = player.mass
            .div(10)
			.max(1)
			.log10()
            
			.root(1.15)
            .mul(fp)
			.mul(start.pow(exp.sub(1)))
			.root(exp)
			.mul(fp2)
			.add(1)
			.floor();
	}
    if (scalingActive("rank", player.ranks.rank.max(tmp.ranks.rank.bulk), "hyper")) {
		let start = getScalingStart("super", "rank");
		let power = getScalingPower("super", "rank");
		let exp = E(1.5).pow(power);
        let start2 = getScalingStart("hyper", "rank");
		let power2 = getScalingPower("hyper", "rank");
		let exp2 = E(2.5).pow(power2);
		tmp.ranks.rank.req =
			E(10).pow(
				player.ranks.rank.div(fp2)
                    .pow(exp2)
                    .div(start2.pow(exp2.sub(1)))
					.pow(exp)
					.div(start.pow(exp.sub(1)))
                    .div(fp)
					.pow(1.15)
			).mul(10)
		tmp.ranks.rank.bulk = player.mass
            .div(10)
			.max(1)
			.log10()
            
			.root(1.15)
            .mul(fp)
			.mul(start.pow(exp.sub(1)))
			.root(exp)
            .mul(start2.pow(exp2.sub(1)))
			.root(exp2)
			.mul(fp2)
			.add(1)
			.floor();
	}
    if (scalingActive("rank", player.ranks.rank.max(tmp.ranks.rank.bulk), "ultra")) {
		let start = getScalingStart("super", "rank");
		let power = getScalingPower("super", "rank");
		let exp = E(1.5).pow(power);
        let start2 = getScalingStart("hyper", "rank");
		let power2 = getScalingPower("hyper", "rank");
		let exp2 = E(2.5).pow(power2);
        let start3 = getScalingStart("ultra", "rank");
		let power3 = getScalingPower("ultra", "rank");
		let exp3 = E(4).pow(power3);
		tmp.ranks.rank.req =
			E(10).pow(
				player.ranks.rank.div(fp2)
                    .pow(exp3)
                    .div(start3.pow(exp3.sub(1)))
                    .pow(exp2)
                    .div(start2.pow(exp2.sub(1)))
					.pow(exp)
					.div(start.pow(exp.sub(1)))
                    .div(fp)
					.pow(1.15)
			).mul(10)
		tmp.ranks.rank.bulk = player.mass
            .div(10)
			.max(1)
			.log10()
            
			.root(1.15)
            .mul(fp)
			.mul(start.pow(exp.sub(1)))
			.root(exp)
            .mul(start2.pow(exp2.sub(1)))
			.root(exp2)
            .mul(start3.pow(exp3.sub(1)))
			.root(exp3)
			.mul(fp2)
			.add(1)
			.floor();
	}
    if (scalingActive("rank", player.ranks.rank.max(tmp.ranks.rank.bulk), "meta")) {
		let start = getScalingStart("super", "rank");
		let power = getScalingPower("super", "rank");
		let exp = E(1.5).pow(power);
        let start2 = getScalingStart("hyper", "rank");
		let power2 = getScalingPower("hyper", "rank");
		let exp2 = E(2.5).pow(power2);
        let start3 = getScalingStart("ultra", "rank");
		let power3 = getScalingPower("ultra", "rank");
		let exp3 = E(4).pow(power3);
        let start4 = getScalingStart("meta", "rank");
		let power4 = getScalingPower("meta", "rank");
		let exp4 = E(1.0025).pow(power4);
		tmp.ranks.rank.req =
			E(10).pow(
				exp4.pow(player.ranks.rank.div(fp2).sub(start4)).mul(start4)
                    .pow(exp3)
                    .div(start3.pow(exp3.sub(1)))
                    .pow(exp2)
                    .div(start2.pow(exp2.sub(1)))
					.pow(exp)
					.div(start.pow(exp.sub(1)))
                    .div(fp)
					.pow(1.15)
			).mul(10)
		tmp.ranks.rank.bulk = player.mass
            .div(10)
			.max(1)
			.log10()
            
			.root(1.15)
            .mul(fp)
			.mul(start.pow(exp.sub(1)))
			.root(exp)
            .mul(start2.pow(exp2.sub(1)))
			.root(exp2)
            .mul(start3.pow(exp3.sub(1)))
			.root(exp3)
            .div(start4)
			.max(1)
			.log(exp4)
			.add(start4)
			.mul(fp2)
			.add(1)
			.floor();
	}
    tmp.ranks.rank.can = player.mass.gte(tmp.ranks.rank.req) && !CHALS.inChal(5) && !CHALS.inChal(10) && !FERMIONS.onActive("03")

    fp = RANKS.fp.tier()
    tmp.ranks.tier.req = player.ranks.tier.div(fp).add(2).pow(2).floor()
    tmp.ranks.tier.bulk = player.ranks.rank.max(0).root(2).sub(2).mul(fp).add(1).floor();
    if (scalingActive("tier", player.ranks.tier.max(tmp.ranks.tier.bulk), "super")) {
		let start = getScalingStart("super", "tier");
		let power = getScalingPower("super", "tier");
		let exp = E(1.5).pow(power);
		tmp.ranks.tier.req =
			player.ranks.tier.div(fp2)
			.pow(exp)
			.div(start.pow(exp.sub(1))).div(fp)
			.add(2).pow(2).floor()
		tmp.ranks.tier.bulk = player.ranks.rank
            .max(0)
            .root(2)
            .sub(2)
            .mul(fp)
			.mul(start.pow(exp.sub(1)))
			.root(exp)
			.mul(fp2)
			.add(1)
			.floor();
	}
    if (scalingActive("tier", player.ranks.tier.max(tmp.ranks.tier.bulk), "hyper")) {
		let start = getScalingStart("super", "tier");
		let power = getScalingPower("super", "tier");
		let exp = E(1.5).pow(power);
        let start2 = getScalingStart("hyper", "tier");
		let power2 = getScalingPower("hyper", "tier");
		let exp2 = E(2.5).pow(power2);
		tmp.ranks.tier.req =
			player.ranks.tier.div(fp2)
            .pow(exp2)
			.div(start2.pow(exp2.sub(1)))
			.pow(exp)
			.div(start.pow(exp.sub(1))).div(fp)
			.add(2).pow(2).floor()
		tmp.ranks.tier.bulk = player.ranks.rank
            .max(0)
            .root(2)
            .sub(2)
            .mul(fp)
			.mul(start.pow(exp.sub(1)))
			.root(exp)
            .mul(start2.pow(exp2.sub(1)))
			.root(exp2)
            .mul(fp2)
			.add(1)
			.floor();
	}

    fp = E(1)
    let pow = 2
    if (hasElement(44)) pow = 1.75
    if (hasElement(9)) fp = fp.mul(1/0.85)
    if (player.ranks.pent.gte(1)) fp = fp.mul(1/0.85)
    if (hasElement(72)) fp = fp.mul(1/0.85)
    tmp.ranks.tetr.req = player.ranks.tetr.div(fp2).div(fp).pow(pow).mul(3).add(10).floor()
    tmp.ranks.tetr.bulk = player.ranks.tier.sub(10).div(3).max(0).root(pow).mul(fp).mul(fp2).add(1).floor();
    if (scalingActive("tetr", player.ranks.tetr.max(tmp.ranks.tetr.bulk), "super")) {
		let start = getScalingStart("super", "tetr");
		let power = getScalingPower("super", "tetr");
		let exp = E(2).pow(power);
		tmp.ranks.tetr.req =
			player.ranks.tetr.div(fp2)
			.pow(exp)
			.div(start.pow(exp.sub(1))).div(fp)
			.pow(pow).mul(3).add(10).floor()
		tmp.ranks.tetr.bulk = player.ranks.tier
            .sub(10).div(3).max(0).root(pow)
            .mul(fp)
			.mul(start.pow(exp.sub(1)))
			.root(exp)
            .mul(fp2)
			.add(1)
			.floor();
	}

    fp = E(1)
    pow = 1.5
    tmp.ranks.pent.req = player.ranks.pent.div(fp).pow(pow).add(15).floor()
    tmp.ranks.pent.bulk = player.ranks.tetr.sub(15).gte(0)?player.ranks.tetr.sub(15).max(0).root(pow).mul(fp).add(1).floor():E(0);

    for (let x = 0; x < RANKS.names.length; x++) {
        let rn = RANKS.names[x]
        if (x > 0) {
            tmp.ranks[rn].can = player.ranks[RANKS.names[x-1]].gte(tmp.ranks[rn].req)
        }
    }
}