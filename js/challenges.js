function setupChalHTML() {
    let chals_table = new Element("chals_table")
	let table = ""
	for (let x = 0; x < Math.ceil(CHALS.cols/4); x++) {
        table += `<div class="table_center" style="min-height: 160px;">`
        for (let y = 1; y <= Math.min(CHALS.cols-4*x,4); y++) {
            let i = 4*x+y
            table += `<div id="chal_div_${i}" style="width: 120px; margin: 5px;"><img id="chal_btn_${i}" onclick="CHALS.choose(${i})" class="img_chal" src="images/chal_${i}.png"><br><span id="chal_comp_${i}">X</span></div>`
        }
        table += "</div>"
	}
	chals_table.setHTML(table)
}

function updateChalHTML() {
    if (tmp.stab[3]==0){
        for (let x = 1; x <= CHALS.cols; x++) {
            let chal = CHALS[x]
            let unl = chal.unl ? chal.unl() : true
            tmp.el["chal_div_"+x].setDisplay(unl)
            tmp.el["chal_btn_"+x].setClasses({img_chal: true, ch: CHALS.inChal(x), chal_comp: player.chal.comps[x].gte(tmp.chal.max[x])})
            if (unl) {
                tmp.el["chal_comp_"+x].setTxt(format(player.chal.comps[x],0)+(tmp.chal.max[x].gte(EINF)?"":" / "+format(tmp.chal.max[x],0)))
            }
        }
        tmp.el.chal_enter.setVisible(player.chal.active != player.chal.choosed)
        tmp.el.chal_exit.setVisible(player.chal.active != 0)
        tmp.el.chal_exit.setTxt(tmp.chal.canFinish && !hasTree("qol6") ? "結束挑戰以獲得 +"+tmp.chal.gain+" 完成次數" : "退出挑戰")
        tmp.el.chal_desc_div.setDisplay(player.chal.choosed != 0)
        if (player.chal.choosed != 0) {
            let chal = CHALS[player.chal.choosed]
            tmp.el.chal_ch_title.setTxt(`[${player.chal.choosed}]${CHALS.getScaleName(player.chal.choosed)} 「${chal.title}」[已完成 ${format(player.chal.comps[player.chal.choosed],0)+(tmp.chal.max[player.chal.choosed].gte(EINF)?"":"/"+format(tmp.chal.max[player.chal.choosed],0))} 次]`)
            tmp.el.chal_ch_desc.setHTML(chal.desc)
            tmp.el.chal_ch_reset.setTxt(CHALS.getReset(player.chal.choosed))
            tmp.el.chal_ch_goal.setTxt("目標："+CHALS.getFormat(player.chal.choosed)(tmp.chal.goal[player.chal.choosed])+CHALS.getResName(player.chal.choosed))
            tmp.el.chal_ch_reward.setHTML("獎勵："+(typeof chal.reward == 'function' ? chal.reward() : chal.reward))
            tmp.el.chal_ch_eff.setHTML("目前："+chal.effDesc(tmp.chal.eff[player.chal.choosed]))
        }
    }
    if (tmp.stab[3]==1){
        updateQCHTML()
    }
}

function enterChal() {
    if (player.chal.choosed == 16) startC16()
    else CHALS.enter()
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
    let s = tmp.qu.chroma_eff[2], w = treeEff('ct5'), v = 12

    if (hasTree('ct5')) v++
    if (hasTree('ct7')) v++
    if (hasTree('ct13')) v++

    for (let x = 1; x <= CHALS.cols; x++) {
        let data = CHALS.getChalData(x)
        tmp.chal.max[x] = CHALS.getMax(x)
        tmp.chal.goal[x] = data.goal
        tmp.chal.bulk[x] = data.bulk
        let q = x<=8?s:hasElement(174)&&x<=12?s.root(5):hasTree('ct5')&&x<=v?w:1
        if (x == 9) q = Decimal.min(q,'e150')
        tmp.chal.eff[x] = CHALS[x].effect(FERMIONS.onActive("05")?E(0):player.chal.comps[x].mul(q))
    }
    tmp.chal.format = player.chal.active != 0 ? CHALS.getFormat() : format
    tmp.chal.gain = player.chal.active != 0 ? tmp.chal.bulk[player.chal.active].min(tmp.chal.max[player.chal.active]).sub(player.chal.comps[player.chal.active]).max(0).floor() : E(0)
    tmp.chal.canFinish = player.chal.active != 0 ? tmp.chal.bulk[player.chal.active].gt(player.chal.comps[player.chal.active]) : false
}

const CHALS = {
    choose(x) {
        if (player.chal.choosed == x) {
            this.exit()
            this.enter()
        }
        player.chal.choosed = x
    },
    inChal(x) { return player.chal.active == x || (player.chal.active == 15 && x <= 12) || (player.chal.active == 20 && x <= 19) },
    reset(x, chal_reset=true) {
        if (x < 5) FORMS.bh.doReset()
        else if (x < 9) ATOM.doReset(chal_reset)
        else if (x < 13) SUPERNOVA.reset(true, true)
        else if (x < 16) DARK.doReset(true)
        else if (x == 16) MATTERS.final_star_shard.reset(true)
        else INF.doReset()
    },
    exit(auto=false) {
        if (!player.chal.active == 0) {
            if (player.chal.active == 16 && !auto) {
                player.dark.c16.shard = player.dark.c16.shard.add(tmp.c16.shardGain)
                player.dark.c16.totalS = player.dark.c16.totalS.add(tmp.c16.shardGain)
            }
            if (tmp.chal.canFinish) {
                player.chal.comps[player.chal.active] = player.chal.comps[player.chal.active].add(tmp.chal.gain).min(tmp.chal.max[player.chal.active])
            }
            if (!auto) {
                this.reset(player.chal.active)
                player.chal.active = 0
            }
        }
    },
    enter(ch=player.chal.choosed) {
        if (player.chal.active == 0) {
            if (ch == 16) {
                player.dark.c16.first = true
                tmp.c16active = true
            }

            player.chal.active = ch
            this.reset(ch, false)
        } else if (ch != player.chal.active) {
            this.exit(true)
            player.chal.active = ch
            this.reset(ch, false)
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
        if (x < 5) return "進入挑戰會強制執行暗物質重置。"
        else if (x < 9) return "進入挑戰會強制執行原子重置。"
        else if (x < 13) return "進入挑戰會強制執行超新星重置。"
        else if (x < 16) return "進入挑戰會強制執行暗界重置。"
        else if (x == 16) return "進入挑戰會強制執行 FSS 重置。"
        return "進入挑戰會強制執行無限重置。"
    },
    getMax(i) {
        if (i <= 12 && hasPrestige(2,25)) return EINF 
        if ((i==13||i==14||i==15) && hasInfUpgrade(19)) return EINF 
        let x = this[i].max
        if (i == 16) {
            if (hasElement(229)) x = E(100)
            if (hasElement(261)) x = x.add(100)
            if (hasElement(271)) x = x.add(300)
            if (hasElement(286)) x = x.add(500)
        }
        else if (i < 16) {
            if (i <= 4 && !hasPrestige(2,25)) x = x.add(tmp.chal?tmp.chal.eff[7]:0)
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
            if (hasTree("chal8") && (i>=9 && i<=12))  x = x.add(200)
            if (hasElement(104) && (i>=9 && i<=12))  x = x.add(200)
            if (hasElement(125) && (i>=9 && i<=12))  x = x.add(elemEffect(125,0))
            if (hasElement(151) && (i==13))  x = x.add(75)
            if (hasElement(171) && (i==13||i==14))  x = x.add(100)
            if (hasElement(186) && (i==13||i==14||i==15))  x = x.add(100)
            if (hasElement(196) && (i==13||i==14))  x = x.add(200)
            if (hasPrestige(1,46) && (i==13||i==14||i==15))  x = x.add(200)
            if (i==13||i==14||i==15)  x = x.add(tmp.dark.rayEff.dChal||0)
        }

        return x.floor()
    },
    getScaleName(i) {
        let c = player.chal.comps[i]
        if (i < 16) {
            if (c.gte(i==13?10:1000)) return " 魔王"
            if (c.gte(i==13?5:i==8?200:i>8&&i!=13&&i!=16?50:300)) return " 超難"
            if (c.gte(i==13?2:i>8&&i!=13&&i!=16?10:75)) return " 困難"
        } else if (i == 16) {
            if (c.gte(500)) return " 困難"
        } else {
            if (c.gte(10)) return " 困難"
        }
        return ""
    },
    getPower(i) {
        let x = E(1)
        if (i == 16) return x
        if (hasElement(2)) x = x.mul(0.75)
        if (hasElement(26)) x = x.mul(tmp.elements.effect[26])
        if (hasElement(180) && i <= 12) x = x.mul(.7)
        if (i != 7 && hasPrestige(2,25)) x = x.mul(tmp.chal.eff[7])
        return x
    },
    getPower2(i) {
        let x = E(1)
        if (i == 16) return x
        if (hasElement(92)) x = x.mul(0.75)
        if (hasElement(120)) x = x.mul(0.75)
        if (hasElement(180) && i <= 12) x = x.mul(.7)
        if (i != 7 && hasPrestige(2,25)) x = x.mul(tmp.chal.eff[7])
        return x
    },
    getPower3(i) {
        let x = E(1)
        if (i == 16) return x
        if (hasElement(120)) x = x.mul(0.75)
        if (hasElement(180) && i <= 12) x = x.mul(.7)
        return x
    },
    getChalData(x, r=E(-1)) {
        let res = this.getResource(x)
        let lvl = r.lt(0)?player.chal.comps[x]:r
        let chal = this[x], fp = 1, goal = EINF, bulk = E(0)

        if (x > 16) {
            goal = chal.start.pow(Decimal.pow(chal.inc,lvl.scale(10,2,0).pow(chal.pow)))
            if (res.gte(chal.start)) bulk = res.log(chal.start).log(chal.inc).root(chal.pow).scale(10,2,0,true).add(1).floor()
        } else if (x == 16) {
            goal = lvl.gt(0) ? Decimal.pow('ee23',Decimal.pow(2,lvl.scale(500,2,0).sub(1).pow(1.5))) : chal.start
            if (res.gte(chal.start)) bulk = res.log('ee23').max(1).log(2).root(1.5).add(1).scale(500,2,0,true).floor()
            if (res.gte('ee23')) bulk = bulk.add(1)
        } else {
            if (QCs.active() && x <= 12) fp /= tmp.qu.qc_eff[5]
            let s1 = x > 8 ? 10 : 75
            let s2 = 300
            if (x == 8) s2 = 200
            if (x > 8) s2 = 50
            let s3 = E(1000)
            if (x == 13 || x == 16) {
                s1 = 2
                s2 = 5
                s3 = E(10)
            }
            if (x <= 12) s3 = s3.mul(exoticAEff(0,3))
            let pow = chal.pow
            if (hasElement(10) && (x==3||x==4)) pow = pow.mul(0.95)
            chal.pow = chal.pow.max(1)
            goal = chal.inc.pow(lvl.div(fp).pow(pow)).mul(chal.start)
            bulk = res.div(chal.start).max(1).log(chal.inc).root(pow).mul(fp).add(1).floor()
            if (res.lt(chal.start)) bulk = E(0)
            if (lvl.max(bulk).gte(s1)) {
                let start = E(s1);
                let exp = E(3).pow(this.getPower(x));
                goal =
                chal.inc.pow(
                        lvl.div(fp).pow(exp).div(start.pow(exp.sub(1))).pow(pow)
                    ).mul(chal.start)
                bulk = res
                    .div(chal.start)
                    .max(1)
                    .log(chal.inc)
                    .root(pow)
                    .times(start.pow(exp.sub(1)))
                    .root(exp).mul(fp)
                    .add(1)
                    .floor();
            }
            if (lvl.max(bulk).gte(s2)) {
                let start = E(s1);
                let exp = E(3).pow(this.getPower(x));
                let start2 = E(s2);
                let exp2 = E(4.5).pow(this.getPower2(x))
                goal =
                chal.inc.pow(
                        lvl.div(fp).pow(exp2).div(start2.pow(exp2.sub(1))).pow(exp).div(start.pow(exp.sub(1))).pow(pow)
                    ).mul(chal.start)
                bulk = res
                    .div(chal.start)
                    .max(1)
                    .log(chal.inc)
                    .root(pow)
                    .times(start.pow(exp.sub(1)))
                    .root(exp)
                    .times(start2.pow(exp2.sub(1)))
                    .root(exp2).mul(fp)
                    .add(1)
                    .floor();
            }
            if (lvl.max(bulk).gte(s3)) {
                let start = E(s1);
                let exp = E(3).pow(this.getPower(x));
                let start2 = E(s2);
                let exp2 = E(4.5).pow(this.getPower2(x))
                let start3 = E(s3);
                let exp3 = E(1.001).pow(this.getPower3(x))
                goal =
                chal.inc.pow(
                        exp3.pow(lvl.div(fp).sub(start3)).mul(start3)
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
                    .add(start3).mul(fp)
                    .add(1)
                    .floor();
            }
        }

        return {goal, bulk}
    },
    1: {
        title: "即時增幅",
        desc: "超級等級和超級質量升級在 25 個開始，超級時間速度在 50 個開始。",
        reward: ()=>hasBeyondRank(2,20)?`推遲超臨界等級和所有費米子階。完成次數減弱超級過強器增幅。`:`推遲超級等級。基於完成次數，超級時間速度增幅更慢。`,
        max: E(100),
        inc: E(5),
        pow: E(1.3),
        start: E(1.5e58),
        effect(x) {
            let c = hasBeyondRank(2,20)
            let rank = c?E(0):x.softcap(20,4,1).floor()
            let tick = c?E(1):E(0.96).pow(x.root(2))
            let scrank = x.add(1).log10().div(10).add(1).root(3)
            let over = Decimal.pow(0.99,x.add(1).log10().root(2)).max(.5)
            return {rank: rank, tick: tick, scrank, over}
        },
        effDesc(x) { return hasBeyondRank(2,20)?"超臨界等級和所有費米子階推遲 "+formatMult(x.scrank)+" 個，超級過強器增幅弱 "+formatReduction(x.over):"超級等級推遲 "+format(x.rank,0)+" 個，超級時間速度增幅弱 "+format(E(1).sub(x.tick).mul(100))+"%" },
    },
    2: {
        unl() { return player.chal.comps[1].gte(1) || player.atom.unl },
        title: "反時間速度",
        desc: "你不能購買時間速度。",
        reward: `每完成一次，時間速度力量增加 7.5%。`,
        max: E(100),
        inc: E(10),
        pow: E(1.3),
        start: E(1.989e40),
        effect(x) {
            let sp = E(0.5)
            if (hasElement(8)) sp = sp.pow(0.25)
            if (hasElement(39)) sp = E(1)
            let ret = x.mul(0.075).add(1).softcap(1.3,sp,0).sub(1)
            return ret
        },
        effDesc(x) { return "+"+format(x.mul(100))+"%"+(x.gte(0.3)?"<span class='soft'>（軟上限）</span>":"") },
    },
    3: {
        unl() { return player.chal.comps[2].gte(1) || player.atom.unl },
        title: "熔融質量",
        desc: "質量獲得量軟上限提早 150 個數量級開始，而且效果更強。",
        reward: `基於完成次數，質量獲得量獲得次方加成。（該加成不適用於此挑戰）`,
        max: E(100),
        inc: E(25),
        pow: E(1.25),
        start: E(2.9835e49),
        effect(x) {
            if (hasElement(64)) x = x.mul(1.5)
            let ret = hasElement(133) ? x.root(4/3).mul(0.01).add(1) : x.root(1.5).mul(0.01).add(1)
            return overflow(ret.softcap(3,0.25,0),1e12,0.5)
        },
        effDesc(x) { return "^"+format(x)+(x.gte(3)?"<span class='soft'>（軟上限）</span>":"") },
    },
    4: {
        unl() { return player.chal.comps[3].gte(1) || player.atom.unl },
        title: "弱化狂怒",
        desc: "暴怒點數獲得量開 10 次方根。質量獲得量軟上限提早 100 個數量級開始。",
        reward: `基於完成次數，暴怒點數獲得量獲得次方加成。`,
        max: E(100),
        inc: E(30),
        pow: E(1.25),
        start: E(1.736881338559743e133),
        effect(x) {
            if (hasElement(64)) x = x.mul(1.5)
            let ret = hasElement(133) ? x.root(4/3).mul(0.01).add(1) : x.root(1.5).mul(0.01).add(1)
            return overflow(ret.softcap(3,0.25,0),1e12,0.5)
        },
        effDesc(x) { return "^"+format(x)+(x.gte(3)?"<span class='soft'>（軟上限）</span>":"") },
    },
    5: {
        unl() { return player.atom.unl },
        title: "無等級",
        desc: "你不能升等級。",
        reward: ()=>hasAscension(0,22)?`完成次數減弱超臨界等級和極高級六級層增幅。`:hasCharger(3)?`完成次數減弱奇異級等級和階，以及極高級重置等級增幅。`:`基於完成次數，等級要求更弱。`,
        max: E(50),
        inc: E(50),
        pow: E(1.25),
        start: E(1.5e136),
        effect(x) {
            let c = hasCharger(3)
            if (!c && hasPrestige(1,127)) return E(1)
            let ret = c?Decimal.pow(0.97,x.add(1).log10().root(4)):E(0.97).pow(x.root(2).softcap(5,0.5,0))
            if (hasAscension(0,22)) ret = ret.root(2)
            if (hasElement(288)) ret = ret.pow(2)
            return ret
        },
        effDesc(x) { return hasCharger(3)?"弱 "+formatReduction(x):"弱 "+format(E(1).sub(x).mul(100))+"%"+(x.log(0.97).gte(5)?"<span class='soft'>（軟上限）</span>":"") },
    },
    6: {
        unl() { return player.chal.comps[5].gte(1) || player.supernova.times.gte(1) || quUnl() },
        title: "無時間速度與壓縮器",
        desc: "你不能購買時間速度和黑洞壓縮器。",
        reward: `每完成一次，時間速度和黑洞壓縮器增加 10%。`,
        max: E(50),
        inc: E(64),
        pow: E(1.25),
        start: E(1.989e38),
        effect(x) {
            let ret = x.mul(0.1).add(1).softcap(1.5,hasElement(39)?1:0.5,0).sub(1)
            return ret
        },
        effDesc(x) { return "+"+format(x)+"x"+(x.gte(0.5)?"<span class='soft'>（軟上限）</span>":"") },
    },
    7: {
        unl() { return player.chal.comps[6].gte(1) || player.supernova.times.gte(1) || quUnl() },
        title: "無暴怒點數",
        desc: "你不能獲得暴怒點數，但你會基於質量獲得暗物質。質量獲得量軟上限更強。",
        reward: ()=>hasPrestige(2,25)?`完成次數減弱魔王前挑戰增幅，但不適用於挑戰 7。`:`每完成一次，挑戰 1 - 4 的完成上限增加 2 次。<br><span class="yellow">完成 16 次時，你會解鎖元素</span>`,
        max: E(50),
        inc: E(64),
        pow: E(1.25),
        start: E(1.5e76),
        effect(x) {
            let c = hasPrestige(2,25)
            let ret = c?Decimal.pow(0.987,x.add(1).log10().root(2)):x.mul(2)
            if (hasElement(5)) ret = c?ret.pow(2):ret.mul(2)
            return c?ret:ret.floor()
        },
        effDesc(x) { return hasPrestige(2,25)?"弱 "+formatReduction(x):"+"+format(x,0) },
    },
    8: {
        unl() { return player.chal.comps[7].gte(1) || player.supernova.times.gte(1) },
        title: "白洞",
        desc: "暗物質和黑洞的質量加成開 8 次方根。",
        reward: `基於完成次數，暗物質和黑洞的質量加成獲得次方加成。<br><span class="yellow">初次完成時，你會解鎖 3 行元素</span>`,
        max: E(50),
        inc: E(80),
        pow: E(1.3),
        start: E(1.989e38),
        effect(x) {
            if (hasElement(64)) x = x.mul(1.5)
            let ret = hasElement(133) ? x.root(1.5).mul(0.025).add(1) : x.root(1.75).mul(0.02).add(1)
            return overflow(ret.softcap(2.3,0.25,0),1e10,0.5)
        },
        effDesc(x) { return "^"+format(x)+(x.gte(2.3)?"<span class='soft'>（軟上限）</span>":"") },
    },
    9: {
        unl() { return hasTree("chal4") },
        title: "無粒子",
        desc: "你不能分配夸克。質量獲得量的指數 ^0.9。",
        reward: `加強鎂-12 的效果。`,
        max: E(100),
        inc: E('e500'),
        pow: E(2),
        start: E('e9.9e4').mul(1.5e56),
        effect(x) {
            let ret = x.root(hasTree("chal4a")?3.5:4).mul(0.1).add(1)
            
            if (!hasElement(41,1)) ret = ret.softcap(21,hasElement(8,1)?0.253:0.25,0)
            
            if (hasElement(31,1) && tmp.chal) ret = ret.pow(tmp.chal.eff[16]||1)

            ret = overflow(ret,5e8,0.5).softcap(1e12,0.1,0)

            return ret
        },
        effDesc(x) { return "^"+format(x)+softcapHTML(x,21) },
    },
    10: {
        unl() { return hasTree("chal5") },
        title: "現實·一",
        desc: "你困在挑戰 1-8 和質量膨脹。",
        reward: `相對粒子公式的指數根據完成次數獲得加成。（該效果不適用於此挑戰）<br><span class="yellow">初次完成時，你會解鎖費米子。</span>`,
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
        unl() { return hasTree("chal6") },
        title: "絕對主義",
        desc: "你不能獲得膨脹質量，而且你困在質量膨脹。",
        reward: `完成次數加強恆星提升器。`,
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
        unl() { return hasTree("chal7") },
        title: "原子的衰變",
        desc: "不能獲得原子和夸克。",
        reward: `完成次數免費給予輻射加成。<br><span class="yellow">初次完成時，你會解鎖新的重置層次！</span>`,
        max: E(100),
        inc: E('e2e7'),
        pow: E(2),
        start: uni('e8.4e8'),
        effect(x) {
            let ret = x.root(hasTree("chal7a")?1.5:2)
            return overflow(ret.softcap(50,0.5,0),1e50,0.5)
        },
        effDesc(x) { return "+"+format(x)+softcapHTML(x,50) },
    },
    13: {
        unl() { return hasElement(132) },
        title: "絕對漆黑",
        desc: "普通質量和黑洞質量的獲得量設為 lg(x)^^1.5。",
        reward: `完成次數增加暗束獲得量。<br><span class="yellow">初次完成時，你會解鎖新的功能！</span>`,
        max: E(25),
        inc: E('e2e4'),
        pow: E(8),
        start: uni('e2e5'),
        effect(x) {
            let ret = x.add(1).pow(1.5)
            return ret
        },
        effDesc(x) { return "x"+format(x,1) },
    },
    14: {
        unl() { return hasElement(144) },
        title: "門捷列夫的怨靈",
        desc: "你不能購買第 118 個或以前的元素。此外，你困在模組為 [5,5,5,5,5,5,5,5] 的量子挑戰。",
        reward: `獲得更多原始素定理。<br><span class="yellow">初次完成時，你會解鎖更多功能！</span>`,
        max: E(100),
        inc: E('e2e19'),
        pow: E(3),
        start: uni('ee20'),
        effect(x) {
            let ret = x.div(25).add(1)
            return ret
        },
        effDesc(x) { return "x"+format(x,2) },
    },
    15: {
        unl() { return hasElement(168) },
        title: "現實·二",
        desc: "你困在挑戰 1-12 和模組為 [10,5,10,10,10,10,10,10] 的量子挑戰。",
        reward: `基於完成次數，普通質量溢出推遲。<br><span class="yellow">初次完成時，你會解鎖更多功能！</span>`,
        max: E(100),
        inc: E('e1e6'),
        pow: E(2),
        start: uni('e2e7'),
        effect(x) {
            let ret = x.add(1).pow(2)
            return ret
        },
        effDesc(x) { return "推遲 ^"+format(x,2) },
    },
    16: {
        unl() { return hasElement(218) },
        title: "混沌物質湮滅",
        desc: `
        • 你不能獲得暴怒點數。所有有色物質的公式失效，但它們會產生其他有色物質。紅物質會生產暗物質。<br>
        • 挑戰 16 前的部分內容，例如級別和重置等級、主升級、元素、中子樹等，會被腐化（禁用）。<br>
        • 你困在質量膨脹和黑暗試煉，每種符文都有 100 個（斯洛伐克符文則有 10 個）。<br>
        • 禁用原始素粒子。<br>
        • 量子前全局運行速度一律定為 /100。<br>
        退出挑戰時，你會基於黑洞質量獲得腐化碎片。
        `,
        get reward() { return `加強鈾砹混合體。<br><span class="yellow">初次完成時，你會在普通質量到達 ${formatMass(Decimal.pow(10,Number.MAX_VALUE))} 時解鎖新的重置層次。</span>` },
        max: E(1),
        start: E('e1.25e11'),
        effect(x) {
            if (hasBeyondRank(12,1)) x = x.mul(beyondRankEffect(12,1))

            x = x.mul(tmp.chal.eff[18])
            let ret = x.root(3).mul(0.05).add(1)
            return ret.softcap(3,0.5,0)
        },
        effDesc(x) { return "^"+format(x)+x.softcapHTML(3) },
    },
    17: {
        unl() { return hasElement(240) },
        title: "不自然時間速度",
        desc: `
        時間速度、加速器、黑洞壓縮器、FVM、宇宙射線、恆星提升器和宇宙弦（包括加成）無效，且不可購買或不可獲得。第 2 個中子效果在購買原子升級 18 前無效。黑洞效果在購買 201 號元素前無效。你困在黑暗試煉，每種符文都有 250 個（不受削弱影響）。
        `,
        reward: `每完成一次，定理等級的軟上限推遲 +3 個。<br><span class="yellow">完成 4 次時，你會解鎖升華和更多的元素。</span>`,
        max: E(100),
        start: E('ee92'),
        inc: E(2),
        pow: E(2),
        effect(x) {
            let b = 3
            if (hasElement(35,1)) b++

            let ret = x.mul(b)
            
            return ret
        },
        effDesc(x) { return "推遲 +"+format(x,0)+" 個" },
    },
    18: {
        unl() { return hasElement(258) },
        title: "強化增幅",
        desc: `
        你不能減弱或移除無限前資源的增幅。你困在黑暗試煉，每種符文都有 500 個（不受削弱影響）。
        `,
        reward: `鈾砹混合體會影響奇異級增幅，而且加強挑戰 16 的獎勵。<br><span class="yellow">完成 4 次時，你會解鎖定理的第 5 種獎勵和更多功能。</span>`,
        max: E(100),
        start: E('ee340'),
        inc: E(10),
        pow: E(3),
        effect(x) {
            let ret = x.pow(1.5).div(2).add(1)

            return ret
        },
        effDesc(x) { return "強 "+formatPercent(x.sub(1)) },
    },
    19: {
        unl() { return hasElement(280) },
        title: "陰陽失衡",
        get desc() { return `
        你不能變成/生產超新星，不能生產恆星資源、暗束（上限為 ${format(1e12)}）、暗影和深淵之漬，也不能購買中子樹升級。你困在黑暗試煉，每種符文都有 1000 個（不受削弱影響）。本挑戰會重置超新星次數。
        `},
        reward: `完成次數提升超新星生產量。<br><span class="yellow">完成 10 次時，解鎖第 6 列無限升級。</span>`,
        max: E(100),
        inc: E('1e10'),
        pow: E(3),
        start: E('ee5555'),
        effect(x) {
            let ret = Decimal.pow(100,expMult(x.mul(10),2/3).div(10))
            return ret
        },
        effDesc(x) { return formatMult(x) },
    },
    20: {
        unl() { return hasElement(290) },
        title: "現實·三",
        desc: "你困在挑戰 1-19 和黑暗試煉，每種符文都有 1500 個。核心中的定理無效。本挑戰會重置主升級。",
        reward: `???。<br><span class="yellow">初次完成時，解鎖 ???。</span>`,
        max: E(100),
        inc: E(10),
        pow: E(1.25),
        start: EINF,
        effect(x) {
            let ret = E(1)
            return ret
        },
        effDesc(x) { return "???" },
    },
    cols: 20,
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
    start: EINF,
    effect(x) {
        let ret = E(1)
        return ret
    },
    effDesc(x) { return format(x)+"x" },
},
*/