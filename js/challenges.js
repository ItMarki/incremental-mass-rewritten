function setupChalHTML() {
    let chals_table = new Element("chals_table")
	let table = ""
	for (let x = 1; x <= CHALS.cols; x++) {
        table += `<div id="chal_div_${x}" style="width: 120px; margin: 5px;"><img id="chal_btn_${x}" onclick="CHALS.choose(${x})" class="img_chal" src="images/chal_${x}.png"><br><span id="chal_comp_${x}">X</span></div>`
	}
	chals_table.setHTML(table)
}

function updateChalHTML() {
    for (let x = 1; x <= CHALS.cols; x++) {
        let chal = CHALS[x]
        let unl = chal.unl ? chal.unl() : true
        tmp.el["chal_div_"+x].setDisplay(unl)
        tmp.el["chal_btn_"+x].setClasses({img_chal: true, ch: CHALS.inChal(x), chal_comp: player.chal.comps[x].gte(tmp.chal.max[x])})
        if (unl) {
            tmp.el["chal_comp_"+x].setTxt(format(player.chal.comps[x],0)+" / "+format(tmp.chal.max[x],0))
        }
    }
    tmp.el.chal_enter.setVisible(player.chal.active != player.chal.choosed)
    tmp.el.chal_exit.setVisible(player.chal.active != 0)
    tmp.el.chal_exit.setTxt(tmp.chal.canFinish && !player.supernova.tree.includes("qol6") ? "結束挑戰以獲得 +"+tmp.chal.gain+" 完成次數" : "退出挑戰")
    tmp.el.chal_desc_div.setDisplay(player.chal.choosed != 0)
    if (player.chal.choosed != 0) {
        let chal = CHALS[player.chal.choosed]
        tmp.el.chal_ch_title.setTxt(`[${player.chal.choosed}]${CHALS.getScaleName(player.chal.choosed)}「${chal.title}」 [完成 ${player.chal.comps[player.chal.choosed]+"/"+tmp.chal.max[player.chal.choosed]} 次]`)
        tmp.el.chal_ch_desc.setHTML(chal.desc)
        tmp.el.chal_ch_reset.setTxt(CHALS.getReset(player.chal.choosed))
        tmp.el.chal_ch_goal.setTxt("目標："+CHALS.getFormat(player.chal.choosed)(tmp.chal.goal[player.chal.choosed])+CHALS.getResName(player.chal.choosed))
        tmp.el.chal_ch_reward.setHTML("獎勵："+chal.reward)
        tmp.el.chal_ch_eff.setHTML("目前："+chal.effDesc(tmp.chal.eff[player.chal.choosed]))
    }
}

function updateChalTemp() {
    if (!tmp.chal) tmp.chal = {
        goal: {},
        max: {},
        eff: {},
        bulk: {},
        canFinish: false,
        gain: E(0),
    }
	let s = tmp.qu.chroma_eff[2]
    for (let x = 1; x <= CHALS.cols; x++) {
        let data = CHALS.getChalData(x)
        tmp.chal.max[x] = CHALS.getMax(x)
        tmp.chal.goal[x] = data.goal
        tmp.chal.bulk[x] = data.bulk
        tmp.chal.eff[x] = CHALS[x].effect(FERMIONS.onActive("05")?E(0):player.chal.comps[x].mul(x<=8?s:1))
    }
    tmp.chal.format = player.chal.active != 0 ? CHALS.getFormat() : format
    tmp.chal.gain = player.chal.active != 0 ? tmp.chal.bulk[player.chal.active].min(tmp.chal.max[player.chal.active]).sub(player.chal.comps[player.chal.active]).max(0).floor() : E(0)
    tmp.chal.canFinish = player.chal.active != 0 ? tmp.chal.bulk[player.chal.active].gt(player.chal.comps[player.chal.active]) : false
}

const CHALS = {
    choose(x) {
        if (player.chal.choosed == x) {
            this.enter()
        }
        player.chal.choosed = x
    },
    inChal(x) { return player.chal.active == x },
    reset(x, chal_reset=true) {
        if (x < 5) FORMS.bh.doReset()
        else if (x < 9) ATOM.doReset(chal_reset)
        else SUPERNOVA.reset(true, true)
    },
    exit(auto=false) {
        if (!player.chal.active == 0) {
            if (tmp.chal.canFinish) {
                player.chal.comps[player.chal.active] = player.chal.comps[player.chal.active].add(tmp.chal.gain)
            }
            if (!auto) {
                this.reset(player.chal.active)
                player.chal.active = 0
            }
        }
    },
    enter() {
        if (player.chal.active == 0) {
            player.chal.active = player.chal.choosed
            this.reset(player.chal.choosed, false)
        } else if (player.chal.choosed != player.chal.active) {
            this.exit(true)
            player.chal.active = player.chal.choosed
            this.reset(player.chal.choosed, false)
        }
    },
    getResource(x) {
        if (x < 5 || x > 8) return player.mass
        return player.bh.mass
    },
    getResName(x) {
        if (x < 5 || x > 8) return ''
        return ' 黑洞質量'
    },
    getFormat(x) {
        return formatMass
    },
    getReset(x) {
        if (x < 5) return "進入挑戰會執行一次暗物質重置！"
        if (x < 9) return "進入挑戰會執行一次原子重置，但不會重置以往的挑戰！"
        return "進入挑戰會强制執行重置，但不會變成超新星！"
    },
    getMax(i) {
        let x = this[i].max
        if (i <= 4) x = x.add(tmp.chal?tmp.chal.eff[7]:0)
        if (hasElement(13) && (i==5||i==6)) x = x.add(tmp.elements.effect[13])
        if (hasElement(20) && (i==7)) x = x.add(50)
        if (hasElement(41) && (i==7)) x = x.add(50)
        if (hasElement(60) && (i==7)) x = x.add(100)
        if (hasElement(33) && (i==8)) x = x.add(50)
        if (hasElement(56) && (i==8)) x = x.add(200)
        if (hasElement(65) && (i==7||i==8)) x = x.add(200)
        if (hasElement(70) && (i==7||i==8)) x = x.add(200)
        if (hasElement(73) && (i==5||i==6||i==8)) x = x.add(tmp.elements.effect[73])
        if (hasTree("chal1") && (i==7||i==8))  x = x.add(100)
        if (hasTree("chal4b") && (i==9))  x = x.add(100)
        return x.floor()
    },
    getScaleName(i) {
        if (player.chal.comps[i].gte(1000)) return " 極難"
        if (player.chal.comps[i].gte(i==8?200:i>8?50:300)) return " 超難"
        if (player.chal.comps[i].gte(i>8?10:75)) return " 困難"
        return ""
    },
    getPower(i) {
        let x = E(1)
        if (hasElement(2)) x = x.mul(0.75)
        if (hasElement(26)) x = x.mul(tmp.elements.effect[26])
        return x
    },
    getPower2(i) {
        let x = E(1)
        return x
    },
    getPower3(i) {
        let x = E(1)
        return x
    },
    getChalData(x, r=E(-1)) {
        let res = this.getResource(x)
        let lvl = r.lt(0)?player.chal.comps[x]:r
        let chal = this[x]
        let s1 = x > 8 ? 10 : 75
        let s2 = 300
        if (x == 8) s2 = 200
        if (x > 8) s2 = 50
        let s3 = 1000
        let pow = chal.pow
        if (hasElement(10) && (x==3||x==4)) pow = pow.mul(0.95)
        chal.pow = chal.pow.max(1)
        let goal = chal.inc.pow(lvl.pow(pow)).mul(chal.start)
        let bulk = res.div(chal.start).max(1).log(chal.inc).root(pow).add(1).floor()
        if (res.lt(chal.start)) bulk = E(0)
        if (lvl.max(bulk).gte(s1)) {
            let start = E(s1);
            let exp = E(3).pow(this.getPower());
            goal =
            chal.inc.pow(
                    lvl.pow(exp).div(start.pow(exp.sub(1))).pow(pow)
                ).mul(chal.start)
            bulk = res
                .div(chal.start)
                .max(1)
                .log(chal.inc)
                .root(pow)
                .times(start.pow(exp.sub(1)))
                .root(exp)
                .add(1)
                .floor();
        }
        if (lvl.max(bulk).gte(s2)) {
            let start = E(s1);
            let exp = E(3).pow(this.getPower());
            let start2 = E(s2);
            let exp2 = E(4.5).pow(this.getPower2())
            goal =
            chal.inc.pow(
                    lvl.pow(exp2).div(start2.pow(exp2.sub(1))).pow(exp).div(start.pow(exp.sub(1))).pow(pow)
                ).mul(chal.start)
            bulk = res
                .div(chal.start)
                .max(1)
                .log(chal.inc)
                .root(pow)
                .times(start.pow(exp.sub(1)))
                .root(exp)
                .times(start2.pow(exp2.sub(1)))
                .root(exp2)
                .add(1)
                .floor();
        }
        if (lvl.max(bulk).gte(s3)) {
            let start = E(s1);
            let exp = E(3).pow(this.getPower());
            let start2 = E(s2);
            let exp2 = E(4.5).pow(this.getPower2())
            let start3 = E(s3);
            let exp3 = E(1.001).pow(this.getPower3())
            goal =
            chal.inc.pow(
                    exp3.pow(lvl.sub(start3)).mul(start3)
                    .pow(exp2).div(start2.pow(exp2.sub(1))).pow(exp).div(start.pow(exp.sub(1))).pow(pow)
                ).mul(chal.start)
            bulk = res
                .div(chal.start)
                .max(1)
                .log(chal.inc)
                .root(pow)
                .times(start.pow(exp.sub(1)))
                .root(exp)
                .times(start2.pow(exp2.sub(1)))
                .root(exp2)
                .div(start3)
			    .max(1)
			    .log(exp3)
			    .add(start3)
                .add(1)
                .floor();
        }
        return {goal: goal, bulk: bulk}
    },
    1: {
        title: "即時增幅",
        desc: "超級等級和超級質量升級在 25 個開始，超級時間速度在 50 個開始。",
        reward: `超級等級延遲開始；基於完成次數，超級時間速度增幅更慢。`,
        max: E(100),
        inc: E(5),
        pow: E(1.3),
        start: E(1.5e58),
        effect(x) {
            let rank = x.softcap(20,4,1).floor()
            let tick = E(0.96).pow(x.root(2))
            return {rank: rank, tick: tick}
        },
        effDesc(x) { return "超級等級延遲 "+format(x.rank,0)+" 個，超級時間速度的增幅弱 "+format(E(1).sub(x.tick).mul(100))+"%" },
    },
    2: {
        unl() { return player.chal.comps[1].gte(1) || player.atom.unl },
        title: "反時間速度",
        desc: "不能購買時間速度。",
        reward: `每完成一次，時間速度力量增加 7.5%。`,
        max: E(100),
        inc: E(10),
        pow: E(1.3),
        start: E(1.989e40),
        effect(x) {
            let sp = E(0.5)
            if (player.atom.elements.includes(8)) sp = sp.pow(0.25)
            if (player.atom.elements.includes(39)) sp = E(1)
            let ret = x.mul(0.075).add(1).softcap(1.3,sp,0).sub(1)
            return ret
        },
        effDesc(x) { return "+"+format(x.mul(100))+"%"+(x.gte(0.3)?"<span class='soft'>（軟限制）</span>":"") },
    },
    3: {
        unl() { return player.chal.comps[2].gte(1) || player.atom.unl },
        title: "融化質量",
        desc: "質量獲得量軟限制提早 1e150 開始，而且效果更强。",
        reward: `基於完成次數，質量獲得量獲得次方加成，但該加成不適用於此挑戰中！`,
        max: E(100),
        inc: E(25),
        pow: E(1.25),
        start: E(2.9835e49),
        effect(x) {
            if (player.atom.elements.includes(64)) x = x.mul(1.5)
            let ret = x.root(1.5).mul(0.01).add(1)
            return ret.softcap(3,0.25,0)
        },
        effDesc(x) { return "^"+format(x)+(x.gte(3)?"<span class='soft'>（軟限制）</span>":"") },
    },
    4: {
        unl() { return player.chal.comps[3].gte(1) || player.atom.unl },
        title: "弱化狂怒",
        desc: "怒氣值獲得量開十次方根；質量獲得量軟限制提早 1e100 開始。",
        reward: `基於完成次數，怒氣值獲得量獲得次方加成。`,
        max: E(100),
        inc: E(30),
        pow: E(1.25),
        start: E(1.736881338559743e133),
        effect(x) {
            if (player.atom.elements.includes(64)) x = x.mul(1.5)
            let ret = x.root(1.5).mul(0.01).add(1)
            return ret.softcap(3,0.25,0)
        },
        effDesc(x) { return "^"+format(x)+(x.gte(3)?"<span class='soft'>（軟限制）</span>":"") },
    },
    5: {
        unl() { return player.atom.unl },
        title: "無等級",
        desc: "不能升等級。",
        reward: `基於完成次數，等級需求更弱。`,
        max: E(50),
        inc: E(50),
        pow: E(1.25),
        start: E(1.5e136),
        effect(x) {
            let ret = E(0.97).pow(x.root(2).softcap(5,0.5,0))
            return ret
        },
        effDesc(x) { return "弱 "+format(E(1).sub(x).mul(100))+"%"+(x.log(0.97).gte(5)?"<span class='soft'>（軟限制）</span>":"") },
    },
    6: {
        unl() { return player.chal.comps[5].gte(1) || player.supernova.times.gte(1) },
        title: "無時間速度和壓縮器",
        desc: "不能購買時間速度和黑洞壓縮器。",
        reward: `每完成一次，時間速度和黑洞壓縮器增加 10%。`,
        max: E(50),
        inc: E(64),
        pow: E(1.25),
        start: E(1.989e38),
        effect(x) {
            let ret = x.mul(0.1).add(1).softcap(1.5,player.atom.elements.includes(39)?1:0.5,0).sub(1)
            return ret
        },
        effDesc(x) { return "+"+format(x)+"x"+(x.gte(0.5)?"<span class='soft'>（軟限制）</span>":"") },
    },
    7: {
        unl() { return player.chal.comps[6].gte(1) || player.supernova.times.gte(1) },
        title: "無怒氣值",
        desc: "不能獲得怒氣值，但你會根據質量獲得暗物質；<br>質量獲得量軟限制更强。",
        reward: `每完成一次，挑戰 1 - 4 的完成上限增加 2 次。<br><span class="yellow">完成 16 次時，解鎖元素</span>`,
        max: E(50),
        inc: E(64),
        pow: E(1.25),
        start: E(1.5e76),
        effect(x) {
            let ret = x.mul(2)
            if (player.atom.elements.includes(5)) ret = ret.mul(2)
            return ret.floor()
        },
        effDesc(x) { return "+"+format(x,0) },
    },
    8: {
        unl() { return player.chal.comps[7].gte(1) || player.supernova.times.gte(1) },
        title: "白洞",
        desc: "暗物質和黑洞的質量加成開八次方根。",
        reward: `基於完成次數，暗物質和黑洞的質量加成獲得次方加成。<br><span class="yellow">首次完成時，解鎖 3 行元素</span>`,
        max: E(50),
        inc: E(80),
        pow: E(1.3),
        start: E(1.989e38),
        effect(x) {
            if (player.atom.elements.includes(64)) x = x.mul(1.5)
            let ret = x.root(1.75).mul(0.02).add(1)
            return ret.softcap(2.3,0.25,0)
        },
        effDesc(x) { return "^"+format(x)+(x.gte(2.3)?"<span class='soft'>（軟限制）</span>":"") },
    },
    9: {
        unl() { return player.supernova.tree.includes("chal4") },
        title: "無粒子",
        desc: "不能分配夸克；質量獲得量的指數得到 0.9 次方的懲罰。",
        reward: `加强鎂-12 的效果。`,
        max: E(100),
        inc: E('e500'),
        pow: E(2),
        start: E('e9.9e4').mul(1.5e56),
        effect(x) {
            let ret = x.root(player.supernova.tree.includes("chal4a")?3.5:4).mul(0.1).add(1)
            return ret
        },
        effDesc(x) { return "^"+format(x) },
    },
    10: {
        unl() { return player.supernova.tree.includes("chal5") },
        title: "現實·一",
        desc: "挑戰 1-8 的懲罰全部生效，而且你困在質量膨脹裏。",
        reward: `相對粒子公式的指數根據完成次數獲得加成。（該效果不適用於此挑戰中）<br><span class="yellow">首次完成時，解鎖費米子。</span>`,
        max: E(100),
        inc: E('e2000'),
        pow: E(2),
        start: E('e3e4').mul(1.5e56),
        effect(x) {
            let ret = x.root(1.75).mul(0.01).add(1)
            return ret
        },
        effDesc(x) { return format(x)+"x" },
    },
    11: {
        unl() { return player.supernova.tree.includes("chal6") },
        title: "絕對主義",
        desc: "不能獲得相對粒子和膨脹質量。你困在質量膨脹裏。",
        reward: `完成次數加强恆星提升器。`,
        max: E(100),
        inc: E("ee6"),
        pow: E(2),
        start: uni("e3.8e7"),
        effect(x) {
            let ret = x.root(2).div(10).add(1)
            return ret
        },
        effDesc(x) { return format(x)+"x stronger" },
    },
    12: {
        unl() { return player.supernova.tree.includes("chal7") },
        title: "原子的衰變",
        desc: "不能獲得原子和夸克。",
        reward: `完成次數免費給予輻射加成。<br><span class="yellow">首次完成時，解鎖新的重置層次！</span>`,
        max: E(100),
        inc: E('e2e7'),
        pow: E(2),
        start: uni('e8.4e8'),
        effect(x) {
            let ret = x.root(2)
            return ret
        },
        effDesc(x) { return "+"+format(x) },
    },
    cols: 12,
}

/*
3: {
    unl() { return player.chal.comps[2].gte(1) },
    title: "Placeholder",
    desc: "Placeholder.",
    reward: `Placeholder.`,
    max: E(50),
    inc: E(10),
    pow: E(1.25),
    start: E(1/0),
    effect(x) {
        let ret = E(1)
        return ret
    },
    effDesc(x) { return format(x)+"x" },
},
*/

