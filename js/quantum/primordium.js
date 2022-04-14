const PRIM = {
    unl() { return hasTree('unl2') },
    getTheorems() {
        let b = tmp.prim.t_base
        let x = player.qu.bp.max(1).log(b).mul(2).scale(150,2,true)
        return x.floor()
    },
    getNextTheorem() {
        let b = tmp.prim.t_base
        let x = E(b).pow(player.qu.prim.theorems.scale(150,2).div(2).add(1))

        return x
    },
    spentTheorems() {
        let x = E(0)
        for (let i = 0; i < player.qu.prim.particles.length; i++) x = x.add(player.qu.prim.particles[i])
        return x
    },
    particle: {
        names: ["德爾塔 [Δ]","阿爾法 [Α]","奧米伽 [Ω]","西格馬 [Σ]","法伊 [Φ]","艾普塞朗 [Ε]","西塔 [Θ]","貝塔 [Β]"],
        weight: [6,6,6,6,2,2,2,1],
        total_w: 31,
        chance: [],

        eff: [
            p=>{
                let x = p.add(1).root(2)
                return x
            },
            p=>{
                let x = [p.root(3).div(5).add(1),p.pow(1.25).add(1)]
                return x
            },
            p=>{
                let x = [p.root(3).div(5).add(1),E(3).pow(p.pow(0.75))]
                return x
            },
            p=>{
                let x = [p.root(3).div(5).add(1),E(2).pow(p.pow(0.75))]
                return x
            },
            p=>{
                let x = p.add(1).root(10)
                return x
            },
            p=>{
                let x = [p.root(3).div(10), p.root(3).pow(QCs.active()?2:1)]
                return x
            },
            p=>{
                let x = [E(5).pow(p.pow(0.75)), p.root(5).div(10).add(1)]
                return x
            },
            p=>{
                let x = p.pow(0.9).mul(2)
                return x
            },
        ],
        effDesc: [
            x=>{ return `將增強器力量提升 ${format(x)}x` },
            x=>{ return `將怒氣點獲得量提升 ^${format(x[0])}；<br>將非獎勵時間速度加強 ${format(x[1])}x` },
            x=>{ return `將暗物質獲得量提升 ^${format(x[0])}；<br>將黑洞壓縮器力量提升 ${format(x[1])}x` },
            x=>{ return `將原子獲得量提升 ^${format(x[0])}；<br>將宇宙射線力量提升 ${format(x[1])}x` },
            x=>{ return `將希格斯玻色子的效果加強 ${format(x)}x` },
            x=>{ return `將費米子獲得量的底數增加 ${format(x[0])}` + (hasTree("prim3") ? `；<br>免費給予 ${format(x[1])} 個費米子階` : "") },
            x=>{ return `將所有輻射的獲得量提升 ${format(x[0])}x` + (hasTree("prim2") ? `；<br>將所有輻射的效果加強 ${format(x[1])}x` : "") },
            x=>{ return `將所有超新星增幅延遲 ${format(x)} 個` },
        ],
    },
}

function giveRandomPParticles(v, max=false) {
    if (!PRIM.unl()) return

    let s = max?tmp.prim.unspent:E(v)
    if (!max) s = s.min(tmp.prim.unspent)

    let tw = PRIM.particle.total_w
    let s_div = s.div(tw).floor()
    let sm = s.mod(tw).floor().toNumber()

    for (let x in PRIM.particle.names) player.qu.prim.particles[x] = player.qu.prim.particles[x].add(s_div.mul(PRIM.particle.weight[x]))
    for (let x = 0; x < sm; x++) {
        let c = Math.random()
        for (let y in PRIM.particle.chance) if (c <= PRIM.particle.chance[y]) {
            player.qu.prim.particles[y] = player.qu.prim.particles[y].add(1)
            break
        }
    }

    updatePrimordiumTemp()
}

function respecPParticles() {
    if (confirm("你確定要重置所有粒子嗎？")) {
        for (let i =0; i < 8; i++) player.qu.prim.particles[i] = E(0)
        QUANTUM.doReset()
    }
}

function calcPartChances() {
    var sum = 0
    for (let x in PRIM.particle.names) {
        sum += PRIM.particle.weight[x]
        PRIM.particle.chance[x] = sum / PRIM.particle.total_w
    }
}

calcPartChances()

function updatePrimordiumTemp() {
    tmp.prim.t_base = E(5)
    if (hasTree('prim1')) tmp.prim.t_base = tmp.prim.t_base.sub(1)
    tmp.prim.theorems = PRIM.getTheorems()
    tmp.prim.next_theorem = PRIM.getNextTheorem()
    tmp.prim.unspent = player.qu.prim.theorems.sub(PRIM.spentTheorems()).max(0)
    for (let i = 0; i < player.qu.prim.particles.length; i++) tmp.prim.eff[i] = PRIM.particle.eff[i](player.qu.prim.particles[i].softcap(100,0.75,0))
}

function updatePrimordiumHTML() {
    tmp.el.prim_theorem.setTxt(format(tmp.prim.unspent,0)+" / "+format(player.qu.prim.theorems,0))
    tmp.el.prim_next_theorem.setTxt(format(player.qu.bp,1)+" / "+format(tmp.prim.next_theorem,1))
    for (let i = 0; i < player.qu.prim.particles.length; i++) {
        tmp.el["prim_part"+i].setTxt(format(player.qu.prim.particles[i],0))
        tmp.el["prim_part_eff"+i].setHTML(PRIM.particle.effDesc[i](tmp.prim.eff[i]))
    }
}