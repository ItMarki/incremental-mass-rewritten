const QUANTUM = {
    gain() {
        let x = player.mass.max(1).log10().div(1e13)
        if (x.lt(1)) return E(0)
        x = x.max(0).pow(1.5)

        if (tmp.qu.mil_reached[4]) x = x.mul(2)
        if (hasTree("qf1")) x = x.mul(tmp.supernova.tree_eff.qf1||1)
        return x.floor()
    },
    enter() {
        if (tmp.qu.gain.gte(1)) {
            if (player.confirms.qu) if (confirm("你確定要量子化嗎？量子化會重置生活質素升級以外的所有功能。")?!confirm("你確定嗎？"):true) return
            if (player.qu.times.gte(10)) {
                player.qu.points = player.qu.points.add(tmp.qu.gain)
                player.qu.times = player.qu.times.add(1)
                updateQuantumTemp()
                this.doReset()
            } else {
                document.body.style.animation = "implode 2s 1"
                setTimeout(_=>{
                    if (player.qu.times.lte(0)) {
                        addPopup(POPUP_GROUPS.qus1);
                        addPopup(POPUP_GROUPS.qus2);
                    }
                    
                    player.qu.points = player.qu.points.add(tmp.qu.gain)
                    player.qu.times = player.qu.times.add(1)

                    updateQuantumTemp()
                    
                    this.doReset()
                },1000)
                setTimeout(_=>{
                    document.body.style.animation = ""
                },2000)
            }
        }
    },
    doReset() {
        player.supernova.times = E(0)
        player.supernova.stars = E(0)

        let keep = ['qol1','qol2','qol3','qol4','qol5','qol6','fn2','fn6','fn7','fn8']
        for (let x = 0; x < tmp.supernova.tree_had.length; x++) if (TREE_UPGS.ids[tmp.supernova.tree_had[x]].qf) keep.push(tmp.supernova.tree_had[x])
        if (tmp.qu.mil_reached[2]) keep.push('chal1','chal2','chal3','chal4','chal4a','chal5','chal6','chal7','c','qol7')
        if (tmp.qu.mil_reached[3]) keep.push('qol8','qol9','unl1')

        let save_keep = []
        for (let x in keep) if (hasTree(keep[x])) save_keep.push(keep[x])
        player.supernova.tree = save_keep

        player.supernova.bosons = {
            pos_w: E(0),
            neg_w: E(0),
            z_boson: E(0),
            photon: E(0),
            gluon: E(0),
            graviton: E(0),
            hb: E(0),
        }
        for (let x in BOSONS.upgs.ids) for (let y in BOSONS.upgs[BOSONS.upgs.ids[x]]) player.supernova.b_upgs[BOSONS.upgs.ids[x]][y] = E(0)

        player.supernova.fermions.points = [E(0),E(0)]
        player.supernova.fermions.choosed = ""

        for (let x = 0; x < 2; x++) if (!hasTree("qu_qol"+(2+4*x))) player.supernova.fermions.tiers[x] = [E(0),E(0),E(0),E(0),E(0),E(0)]

        player.supernova.radiation.hz = E(0)
        for (let x = 0; x < 7; x++) {
            player.supernova.radiation.ds[x] = E(0)
            for (let y = 0; y < 2; y++) player.supernova.radiation.bs[2*x+y] = E(0)
        }

        for (let x = 1; x <= 12; x++) if (!hasTree("qu_qol7") || x <= 8) player.chal.comps[x] = E(0)

        SUPERNOVA.doReset()

        tmp.pass = false
    },
    bpGain() {
        let x = E(1)
        if (tmp.qu.mil_reached[5]) x = x.mul(tmp.preQUGlobalSpeed.root(2))
        if (hasTree('qu5')) x = x.mul(tmp.supernova.tree_eff.qu5)
        x = x.mul(tmp.qu.cosmic_str_eff.eff)
        return x
    },
    bpEff() {
        let x = player.qu.bp.add(1).log10().add(1).pow(1.5)
        return x
    },
    cosmic_str: {
        buy() {
            if (tmp.qu.cosmic_str_can) {
                player.qu.points = player.qu.points.sub(tmp.qu.cosmic_str_cost).max(0)
                player.qu.cosmic_str = player.qu.cosmic_str.add(1)
            }
        },
        buyMax() {
            if (tmp.qu.cosmic_str_can) {
                player.qu.cosmic_str = tmp.qu.cosmic_str_bulk
                player.qu.points = player.qu.points.sub(tmp.qu.cosmic_str_cost).max(0)
            }
        },
        eff() {
            let pow = E(2)
            let x = pow.pow(player.qu.cosmic_str)
            return {pow: pow, eff: x}
        },
    },
    mils: [
        [E(1), `你開始時解鎖生活質素升級（qol1-6）、玻色子和費米子。`],
        [E(2), `中子樹的量子前部分的所有升級都移除需求。量子前部分的運行速度增至 10x。`],
        [E(3), `你開始時解鎖中子樹的量子前挑戰部分以及升級 [c] 和 [qol7]。`],
        [E(5), `你開始時解鎖生活質素升級（qol8-9 和 unl1）和輻射。`],
        [E(6), `量子泡沫獲得量翻倍。`],
        [E(8), `量子前部分的運行速度稍微加強藍圖粒子和賦色子的獲得量。`],
        [E(10), `超新星恆星獲得量乘以量子化次數（最高 1e10）。`],
    ],
}

function quUnl() { return player.qu.times.gte(1) }

function getQUSave() {
    return {
        reached: false,
        points: E(0),
        times: E(0),
        bp: E(0),
        cosmic_str: E(0),

        chr_get: [],
        chroma: [E(0),E(0),E(0)],

        prim: {
            theorems: E(0),
            particles: [E(0),E(0),E(0),E(0),E(0),E(0),E(0),E(0)],
        },
    }
}

function calcQuantum(dt, dt_offline) {
    if (player.mass.gte(mlt(1e4)) && !player.qu.reached) {
        player.qu.reached = true
        addPopup(POPUP_GROUPS.qu)
    }

    if (quUnl()) {
        player.qu.bp = player.qu.bp.add(tmp.qu.bpGain.mul(dt))
        for (let x = 0; x < CHROMA_LEN; x++) player.qu.chroma[x] = player.qu.chroma[x].add(tmp.qu.chroma_gain[x].mul(dt))

        if (PRIM.unl()) {
            player.qu.prim.theorems = player.qu.prim.theorems.max(tmp.prim.theorems)
        }
    }

    if (hasTree("qu_qol1")) for (let x = 0; x < tmp.supernova.auto_tree.length; x++) TREE_UPGS.buy(tmp.supernova.auto_tree[x], true)
}

function updateQuantumTemp() {
    updatePrimordiumTemp()
    updateChromaTemp()

    tmp.qu.gain = QUANTUM.gain()

    tmp.qu.theories = player.qu.times.sub(player.qu.chr_get.length).max(0).min(3).toNumber()
    tmp.qu.pick_chr = tmp.qu.theories > 0

    tmp.qu.cosmic_str_cost = E(2).pow(player.qu.cosmic_str.add(1)).floor()
    tmp.qu.cosmic_str_bulk = player.qu.points.max(1).log(2).floor()

    tmp.qu.cosmic_str_can = player.qu.points.gte(tmp.qu.cosmic_str_cost)
    tmp.qu.cosmic_str_eff = QUANTUM.cosmic_str.eff()

    tmp.qu.bpGain = QUANTUM.bpGain()
    tmp.qu.bpEff = QUANTUM.bpEff()

    for (let x = 0; x < QUANTUM.mils.length; x++) tmp.qu.mil_reached[x] = player.qu.times.gte(QUANTUM.mils[x][0])
}

function updateQuantumHTML() {
    tmp.el.qu_div.setDisplay(quUnl() || player.chal.comps[12].gte(1))
    tmp.el.quAmt.setHTML(format(player.qu.points,0)+"<br>(+"+format(tmp.qu.gain,0)+")")

    if (tmp.tab == 0 && tmp.stab[0] == 4) {
        tmp.el.bpAmt.setTxt(format(player.qu.bp,1)+" "+formatGain(player.qu.bp,tmp.qu.bpGain))
        tmp.el.bpEff.setTxt(format(tmp.qu.bpEff))

        tmp.el.cosmic_str_lvl.setTxt(format(player.qu.cosmic_str,0))//+(tmp.qu.cosmic_str_bonus.gte(1)?" + "+format(tmp.qu.cosmic_str_bonus,0):"")
        tmp.el.cosmic_str_btn.setClasses({btn: true, locked: !tmp.qu.cosmic_str_can})
        //tmp.el.cosmic_str_scale.setTxt(getScalingName('cosmic_str'))
        tmp.el.cosmic_str_cost.setTxt(format(tmp.qu.cosmic_str_cost,0))
        tmp.el.cosmic_str_pow.setTxt(format(tmp.qu.cosmic_str_eff.pow))
        tmp.el.cosmic_str_eff.setHTML(format(tmp.qu.cosmic_str_eff.eff))
    }

    if (tmp.tab == 6) {
        if (tmp.stab[6] == 0) updateChromaHTML()
        if (tmp.stab[6] == 1) {
            tmp.el.qu_times.setTxt(format(player.qu.times,0))

            for (let x = 0; x < QUANTUM.mils.length; x++) {
                tmp.el['qu_mil'+x].changeStyle('background-color',tmp.qu.mil_reached[x]?'#2f22':'#4442')
                tmp.el['qu_mil_goal'+x].setTxt(format(QUANTUM.mils[x][0],0))
            }
        }
        if (tmp.stab[6] == 2) updatePrimordiumHTML()
    }

    if (hasTree("qu_qol4")) SUPERNOVA.reset(false,false,true)
}

function setupQuantumHTML() {
    let new_table = new Element("chroma_table")
    let html = ""
    for (let x = 0; x < CHROMA_LEN; x++) {
        let n = CHROMA.names[x]
        let id = "chroma_"+x

        html += `
        <div style="width: 33%">
            <div style="height: 60px">
                <button id="${id}_btn" class="btn" onclick="CHROMA.getChroma(${x})">需要量子理論以開始生產${n[1]}</button>
            </div>
            <br>
            <img src="images/chroma${x}.png">
            <div style="width: 100%; color: #${n[2]}; background: linear-gradient(90deg, #${n[2]}0 0%, #${n[2]}2 10%, #${n[2]}2 90%, #${n[2]}0 100%); padding: 8px 0px; margin: 8px 0;">
                <h2>${n[1]}</h2><br><br>
                你有 <span id="${id}_amt">0</span> 個${n[0]}賦色子，<br>
                <span id="${id}_eff"></span>
            </div>
        </div>
        `
    }
    new_table.setHTML(html)

    new_table = new Element("qu_milestones_table")
    html = ""
    for (let x in QUANTUM.mils) {
        html += `
        <div id="qu_mil${x}" style="width: 100%; margin: 5px 0px; padding: 8px 0px; background-color: #4444; font-size: 14px;">
            <h2>量子化 <span id="qu_mil_goal${x}">X</span> 次</h2><br><br>
            ${QUANTUM.mils[x][1]}
        </div>
        `
    }
    new_table.setHTML(html)

    new_table = new Element("primordium_table")
    html = ""
    for (let x in PRIM.particle.names) {
        html += `
        <div class="primordium table_center">
            <div style="width: 350px; height: 60px;">
                <h2>${PRIM.particle.names[x]} 粒子</h2><br>
                 - [<span id="prim_part${x}">0</span>]
            </div><div style="width: 700px;" id="prim_part_eff${x}"></div>
        </div>
        `
    }
    new_table.setHTML(html)
}