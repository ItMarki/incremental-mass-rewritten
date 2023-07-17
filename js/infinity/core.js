const CORE = {
    mass: {
        title: `牛頓定理`,
        icon: `N`,
        preEff: [
            `提升普通質量獲得量。`,
            `推遲普通質量溢出。`,
            `使超·級別前的級別更便宜。`,
            `增加重置底數的指數。`,
            `推遲普通質量溢出^2。`,
        ],
        res: `普通質量`,
        boost() {return player.mass.add(1).log10().add(1).log10().add(1).log10().add(1)},
        eff: [
            s => {
                let x = s.add(1).pow(s.root(2)).overflow(100,0.5)

                if (tmp.NHDimprove) x = x.pow(10)

                return x
            },
            s => {
                let x = s.add(1).pow(s.root(2).mul(2)).overflow(100,0.5)

                if (tmp.NHDimprove) x = x.pow(10)

                return x
            },
            s => {
                let x = s.root(2).div(10).add(1).root(2)

                if (tmp.NHDimprove) x = x.pow(2)

                return x
            },
            s => {
                let x = s.root(2)

                if (tmp.NHDimprove) x = x.pow(2)

                return x
            },
            s => {
                let x = s.add(1).pow(s.root(1.5))

                return overflow(x,100,0.5)
            },
            s => {
                let x = E(0)

                return x
            },
            s => {
                let x = E(0)

                return x
            },
            s => {
                let x = E(0)

                return x
            },
        ],
        effDesc: [
            x => "^"+format(x),
            x => "^"+format(x),
            x => formatMult(x),
            x => "+"+format(x),
            x => "^"+format(x),
            x => formatMult(x),
            x => formatMult(x),
            x => formatMult(x),
        ],

        fragment: [
            f=>{
                let x = f.add(1).pow(2)

                return x
            },
            x => `增強器溢出推遲 <b>${formatMult(x)}</b>。`,
        ],
    },
    bh: {
        title: `霍金定理`,
        icon: `Λ`,
        preEff: [
            `提升黑洞質量獲得量（在挑戰 16 中較弱）。`,
            `推遲黑洞質量溢出（在挑戰 16 中較弱）。`,
            `減弱不穩定黑洞的削弱。`,
            `提升 FVM 力量。`,
            `加強不穩定黑洞的效果。`,
        ],
        res: `黑洞質量`,
        boost() {return player.bh.mass.add(1).log10().add(1).log10().add(1).log10().add(1)},
        eff: [
            s => {
                let x = s.add(1).pow(s.root(2))
                
                x = overflow(x,100,0.5)

                if (tmp.c16active) x = x.log10().add(1)

                if (tmp.NHDimprove) x = x.pow(10)

                return x
            },
            s => {
                let x = s.add(1).pow(s.root(2).mul(2))

                x = overflow(x,100,0.5)

                if (tmp.c16active) x = x.log10().add(1)

                if (tmp.NHDimprove) x = x.pow(10)

                return x
            },
            s => {
                let x = s.add(1).log10().div(100).add(1).pow(-1) // Math.pow(1+Math.log10(s+1)/100,-1)

                if (tmp.NHDimprove) x = x.pow(10)

                return x
            },
            s => {
                let x = s.add(1).root(2).overflow(10,0.5)

                if (tmp.NHDimprove) x = x.pow(2)

                return x
            },
            s => {
                let x = s.add(1).log10().div(10).add(1)

                return x
            },
            s => {
                let x = E(0)

                return x
            },
            s => {
                let x = E(0)

                return x
            },
            s => {
                let x = E(0)

                return x
            },
        ],
        effDesc: [
            x => "^"+format(x),
            x => "^"+format(x),
            x => formatReduction(x),
            x => formatMult(x),
            x => "^"+format(x),
            x => formatMult(x),
            x => formatMult(x),
            x => formatMult(x),
        ],

        fragment: [
            f=>{
                let x = f.add(1).log10().div(10).add(1)

                return x
            },
            x => `不穩定黑洞質量獲得量 ^<b>${format(x)}</b>。`,
        ],
    },
    atom: {
        title: `道爾頓定理`,
        icon: `Ξ`,
        preEff: [
            `提升夸克獲得量。`,
            `推遲夸克和原子力量溢出。`,
            `提升過強器力量。`,
            `提升加速器力量。`,
            `提升奇異原子獲得量。`,
        ],
        res: `奇異原子`,
        boost() {return tmp.exotic_atom.amount.add(1).log10().add(1).log10().add(1)},
        eff: [
            s => {
                let x = s.add(1).pow(s.root(2))
                
                x = overflow(x,100,0.5)

                if (tmp.NHDimprove) x = x.pow(10)

                return x
            },
            s => {
                let x = s.add(1).pow(s.root(2).mul(2))

                x = overflow(x,100,0.5)

                if (tmp.NHDimprove) x = x.pow(10)

                return x
            },
            s => {
                let x = s.root(4)

                if (tmp.NHDimprove) x = x.pow(1.5)

                if (hasAscension(0,1)) x = x.mul(10)

                return x.div(1e4)
            },
            s => {
                let x = s.root(4)

                if (tmp.NHDimprove) x = x.pow(1.5)

                if (hasAscension(0,1)) x = x.mul(10)

                return x.div(1e4)
            },
            s => {
                let x = s.add(1).log10().root(2).div(10).add(1)

                return x
            },
            s => {
                let x = E(0)

                return x
            },
            s => {
                let x = E(0)

                return x
            },
            s => {
                let x = E(0)

                return x
            },
        ],
        effDesc: [
            x => "^"+format(x),
            x => "^"+format(x),
            x => "+"+format(x),
            x => "+"+format(x),
            x => "^"+format(x),
            x => formatMult(x),
            x => formatMult(x),
            x => formatMult(x),
        ],

        fragment: [
            f=>{
                let x = f.add(1)

                return x
            },
            x => `K 介子和 π 介子的獲得量提升 <b>${formatMult(x)}</b>。`,
        ],
    },
    proto: {
        title: `原始宙定理`,
        icon: `Π`,
        preEff: [
            `使宇宙弦更便宜。`,
            `加強原始素粒子。`,
            `減弱所有「熵」獎勵的增幅。`,
            `減弱 QC 模組。`,
            `提升熵的獲得量和上限。`,
        ],
        res: `量子泡沫`,
        boost() {return player.qu.points.add(1).log10().add(1).log10().add(1)},
        eff: [
            s => {
                let x = s.add(1).log10().div(2).add(1) // Math.log10(s+1)/2+1

                return x
            },
            s => {
                let x = Decimal.pow(1.25,s.add(1).log10())

                return x
            },
            s => {
                let x = s.add(1).log10().div(100).add(1).pow(-1) // Math.pow(1+Math.log10(s+1)/100,-1)

                return x
            },
            s => {
                let x = s.add(1).log10().div(10).add(1).pow(-1) //  Math.pow(1+Math.log10(s+1)/10,-1)

                return x
            },
            s => {
                let x = s.add(1).log10().root(3).div(10).add(1)

                return x
            },
            s => {
                let x = E(0)

                return x
            },
            s => {
                let x = E(0)

                return x
            },
            s => {
                let x = E(0)

                return x
            },
        ],
        effDesc: [
            x => formatMult(x),
            x => formatPercent(x.sub(1)),
            x => formatReduction(x),
            x => formatReduction(x),
            x => "^"+format(x),
            x => formatMult(x),
            x => formatMult(x),
            x => formatMult(x),
        ],

        fragment: [
            f=>{
                let x = f.add(1).log10().root(2).div(100).add(1)

                return x
            },
            x => `賦色子獲得量 ^<b>${format(x)}</b>。`,
        ],
    },
    time: {
        title: `愛因斯坦定理`,
        icon: `Δ`,
        preEff: [
            `提升無限前全局運行速度。`,
            `提升量子前全局運行速度。`,
            `提升暗影和深淵之漬的獲得量。`,
            `減弱所有符文質量的削弱。`,
            `提升奇異原子獎勵強度。`,
        ],
        res: `腐化碎片`,
        boost() {return player.dark.c16.totalS.add(1).log10().add(1).log10().add(1)},
        eff: [
            s => {
                let x = s.add(1)

                return x
            },
            s => {
                let x = s.add(1).log10().root(2).div(100).add(1) // Math.log10(s+1)**0.5/100+1

                return x
            },
            s => {
                let x = s.add(1).log10().div(100).add(1) // Math.log10(s+1)/100+1

                return x
            },
            s => {
                let x = s.add(1).log10().div(100).add(1).pow(-1) // Math.pow(1+Math.log10(s+1)/100,-1)

                return x
            },
            s => {
                let x = s.add(1).log10().root(2).div(5)

                return x
            },
            s => {
                let x = E(0)

                return x
            },
            s => {
                let x = E(0)

                return x
            },
            s => {
                let x = E(0)

                return x
            },
        ],
        effDesc: [
            x => formatMult(x),
            x => "^"+format(x),
            x => "^"+format(x),
            x => formatReduction(x),
            x => "+"+formatPercent(x),
            x => formatMult(x),
            x => formatMult(x),
            x => formatMult(x),
        ],

        fragment: [
            f=>{
                let x = f.overflow(1e100,0.5).add(1).log10().root(2).div(50).add(1).pow(-1)

                return x.toNumber()
            },
            x => `超·級別下一個級別的要求減少 <b>${formatReduction(x)}</b>。`,
        ],
    },
}

const MAX_STARS = 8

const MAX_CORE_LENGTH = 8
const MIN_CORE_LENGTH = 4
const MAX_INV_LENGTH = 100

const CORE_CHANCE_MIN = 0.1
const CORE_TYPE = Object.keys(CORE)
const MIN_STAR_CHANCES = [0.1,0.1,0.1,0.1,0.01,0.001,0.0001,0.00001] // new Array(MAX_STARS).fill(0.1)

const MAX_CORE_FIT = 1

var core_tmp = {}
var core_weight = {}
var core_star_luck = []
var core_star_chances = []

function getCoreChance(i, lvl=tmp.core_lvl) { return Decimal.sub(1,Decimal.pow(Decimal.sub(1,Decimal.pow(MIN_STAR_CHANCES[i],core_star_luck[i].pow(-1))),lvl.floor().pow(0.4))) } // 1-Math.pow(1-MIN_STAR_CHANCES[i]**(1/core_star_luck[i]),Math.floor(lvl)**0.4)
function getPowerMult(lvl=tmp.core_lvl) { return lvl.sub(1).floor().root(2).div(100).mul(tmp.cs_effect.power_mult) } // Math.floor(lvl-1)**0.5/100 * tmp.cs_effect.power_mult
function chanceToBool(arr) { return arr.map((x,i) => core_star_chances[i].gt(x)) }

function resetCoreTemp() {
    for (let i in CORE) {
        core_tmp[i] = {
            total_s: new Array(MAX_STARS).fill(E(0)),
            total_p: E(1),
        }

        core_weight[i] = 0
    }
}

resetCoreTemp()

var t_choosed = "-"

debug.generateTheorem = (chance=CORE_CHANCE_MIN) => {
    let c = []
    while (c.length == 0) {
        let m = [], n = false
        for (let i = 0; i < MAX_STARS; i++) {
            m[i] = Math.random()
            if (m[i] < chance && i < 4) n = true
        }
        if (n) c = m
    }
    let t = CORE_TYPE[Math.floor(Math.random() * CORE_TYPE.length)], s = ""
    let p = 1+Math.random()/5

    for (let i = 0; i < 4; i++) s += `<iconify-icon icon="${c[i]<chance?'ic:baseline-star':'ic:baseline-star-border'}" width="18"></iconify-icon>`

    tmp.el.theorem_debug.setHTML(`
    <div class="theorem_div ${t}">
        <iconify-icon icon="${CORE[t].icon}" width="45"></iconify-icon>
        <div class="c_pow">${format(p*100,0)}%</div>
        <div class="c_lvl">${format(10*Math.random()+1,0)}</div>
        <div>
            ${s}
        </div>
    </div>
    `)
}

debug.addRandomTheorem = (level=1,power=1,max_chance=CORE_CHANCE_MIN) => {
    let c = []
    while (c.length == 0) {
        let m = [], n = false
        for (let i = 0; i < MAX_STARS; i++) {
            m[i] = Math.random()
            if (i < 4 && m[i] < max_chance) n = true
        }
        if (n) c = m
    }

    addTheorem(CORE_TYPE[Math.floor(Math.random() * CORE_TYPE.length)],c,level,power)
}

var changeCoreFromBestLevel = () => {
    let lvl = Decimal.floor(tmp.core_lvl), power = getPowerMult(tmp.core_lvl).mul(100).add(100).round().div(100) // Math.round(100+getPowerMult(tmp.core_lvl)*100)/100

    for (let i = 0; i < MAX_CORE_LENGTH; i++) if (player.inf.core[i]) {
        if (lvl.gt(player.inf.core[i].level)) player.inf.core[i].level=lvl
        if (power.gt(player.inf.core[i].power)) player.inf.core[i].power=power
    }

    updateTheoremCore()
    updateCoreHTML()
}

function theoremEff(t,i,def=1) { return tmp.core_eff[t][i]||def }

// setInterval(debug.generateTheorem,1000)

function getTheoremHTML(data,sub=false) {
    let s = ""
    for (let i = 0; i < MAX_STARS; i++) s += `<div>${data.star[i]?"◉":""}</div>`
    let w = `
    <div class="c_type">${CORE[data.type].icon}</div>
    <div class="c_pow">${format(data.power.mul(100),0)}%</div>
    <div class="c_lvl">${format(data.level,0)}</div>
    <div>
        ${s}
    </div>
    `
    return sub?w:`
    <div class="theorem_div ${data.type} tooltip" tooltip-pos="bottom" tooltip-pos="bottom" tooltip-html="The J">
        ${w}
    </div>
    `
}

function calcFragmentBase(data,s,p,level) {
    let lvl = level||data.level, m = 0
    s.forEach(i=>{m += i})

    return p.mul(1.5).pow(lvl.sub(1)).mul(Decimal.pow(m,p.mul(2))).mul(lvl).floor() // Decimal.pow(1.5*p,lvl-1).mul(m**(2*p)*lvl).floor()
}

function getTheoremPreEffects(data,s,p,level) {
    let t = data.type

    let e = ""
    for (let i = 0; i < MAX_STARS; i++) if (s[i]) e += (CORE[t].preEff[i]||'???.') + "<br>"
    e += `（基於<b>${CORE[t].res}</b>）`
    if (tmp.tfUnl) e += `<br class='line'>可形成 <b>+${format(calcFragmentBase(data,s,p,level),0)}</b> 碎片底數`
    return e
}

function setupCoreHTML() {
    let h = `<div id="preTReq"></div>`

    for (let i = 0; i < 4; i++) {
        h += `
        <div id="preT${i}" class="theorem_div tooltip" tooltip-pos="bottom" onclick="choosePreTheorem(${i})"></div>
        `
    }

    new Element('pre_theorem').setHTML(h)

    h = ``

    for (let i = 0; i < MAX_CORE_LENGTH; i++) {
        h += `
        <div id="coreT${i}" class="theorem_div tooltip" onclick="chooseTheorem('${i}',true)"></div>
        `
    }

    new Element('theorem_table').setHTML(h)

    h = ``

    for (let i = 0; i < MAX_INV_LENGTH; i++) {
        h += `
        <div>
            <div id="invT${i}" class="theorem_div tooltip" onclick="chooseTheorem('${i}')"></div>
        </div>
        `
    }

    new Element('theorem_inv_table').setHTML(h)
}

function updateCoreHTML() {
    let reached = player.inf.reached

    tmp.el.preTReq.setDisplay(!reached)

    tmp.el.pt_selector.setDisplay(TS_visible)

    let lvl = tmp.core_lvl, fl = Decimal.floor(lvl)
    tmp.el.pt_lvl.setHTML(`<b>${format(fl,0)}</b>（${formatPercent(lvl.sub(fl))}）`)

    if (TS_visible) {
        let pm = getPowerMult()

        for (let i = 0; i < player.inf.pre_theorem.length; i++) {
            let pt = tmp.el['preT'+i]
            pt.setDisplay(reached)

            if (!reached) continue

            let p = player.inf.pre_theorem[i], s = chanceToBool(p.star_c), power = pm.mul(p.power_m).mul(100).add(100).round().div(100) // Math.round(100+pm*p.power_m*100)/100
            pt.setClasses({theorem_div:true, tooltip:true, [p.type]:true, choosed: player.inf.pt_choosed == i})
            pt.setHTML(getTheoremHTML({type: p.type, level: fl, power, star: s},true))

            pt.setTooltip(`
            <h3>${CORE[p.type].title}</h3>
            <br class='line'>
            ${getTheoremPreEffects(p,s,power,fl)}
            `)
        }

        tmp.el.preTReq.setHTML(`到達 <b>${formatMass(INF.req)}</b> 的普通質量後，這裏會顯示你可以選擇的定理。`)
    }

    tmp.el.formTBtn.setDisplay(tmp.tfUnl)
}

function updateTheoremCore() {
    resetCoreTemp()

    for (let i = 0; i < MAX_CORE_LENGTH; i++) {
        let u = i < tmp.min_core_len
        let t = tmp.el['coreT'+i]

        t.setDisplay(u)
        if (!u) continue

        let p = player.inf.core[i]

        t.setClasses(p?{theorem_div:true, tooltip:true, [p.type]:true, choosed: i+"c" == t_choosed}:{theorem_div:true})

        t.setHTML(p?getTheoremHTML(p,true):"")

        if (p) {
            let type = p.type, l = p.level, s = p.star, ct = core_tmp[type]
            ct.total_p = ct.total_p.mul(p.power)
            for (let i = 0; i < MAX_STARS; i++) if (s[i]) ct.total_s[i] = ct.total_s[i].add(l)

            t.setTooltip(`
            <h3>${CORE[type].title}</h3><br>
            [第 ${format(p.level,0)} 等級，力量：${format(p.power.mul(100),0)}%]
            <br class='line'>
            ${getTheoremPreEffects(p,p.star,p.power)}
            `)

            core_weight[type]++
        }
    }
}

function updateTheoremInv() {
    for (let i = 0; i < MAX_INV_LENGTH; i++) {
        let t = tmp.el['invT'+i]
        let p = player.inf.inv[i]

        t.setClasses(p?{theorem_div:true, tooltip:true, [p.type]:true, choosed: i == t_choosed}:{theorem_div:true})

        t.setHTML(p?getTheoremHTML(p,true):"")

        t.setTooltip(p?`
        <h3>${CORE[p.type].title}</h3><br>
        [第 ${format(p.level,0)} 等級，力量：${format(p.power*100,0)}%]
        <br class='line'>
        ${getTheoremPreEffects(p,p.star,p.power)}
        `:"")
    }
}

function removeTheorem() {
    if (t_choosed.includes('c') || t_choosed == '-') return

    createConfirm("你確定要移除所選定理嗎？",'remove_selected',()=>{
        delete player.inf.inv[t_choosed]

        t_choosed = '-'

        updateTheoremInv()
    })
}

function formTheorem() {
    if (t_choosed.includes('c') || t_choosed == '-' || !tmp.tfUnl) return

    let inv = player.inf.inv[t_choosed]

    player.inf.fragment[inv.type] = player.inf.fragment[inv.type].add(calcFragmentBase(inv,inv.star,inv.power));

    delete player.inf.inv[t_choosed]

    t_choosed = '-'

    updateTheoremInv()
}

function createPreTheorem() {
    let c = [], t = CORE_TYPE[Math.floor(Math.random() * CORE_TYPE.length)]
    while (c.length == 0) {
        let m = [], n = false
        for (let i = 0; i < MAX_STARS; i++) {
            m[i] = Math.random()
            if (m[i] < CORE_CHANCE_MIN && i < 4) n = true
        }
        if (n) c = m
    }
    return {star_c: c, type: t, power_m: Math.random()}
}

function choosePreTheorem(i) {
    player.inf.pt_choosed = i
}

function addTheorem(type, star, level, power) {
    let s = true
    for (let i = 0; i < MAX_INV_LENGTH; i++) if (!player.inf.inv[i]) {
        player.inf.inv[i] = {type, star: chanceToBool(star), level, power: power.mul(100).round().div(100)} // Math.round(power*100)/100
        s = false
        break
    }
    if (s) createPopup("你的物品欄已滿！你需要移除未使用或沒用途的定理……",'inv_maxed')
    updateTheoremInv()
}

function getFragmentEffect(id,def=1) { return tmp.fragment_eff[id]||def }

function chooseTheorem(id,is_core=false) {
    let inv = player.inf.inv, core = player.inf.core;

    if (popups.includes('pickout')) return

    if (t_choosed == (is_core?id+'c':id)) t_choosed = '-'
    else if (t_choosed == '-') {
        if (is_core ? core[id] : inv[id]) t_choosed = is_core?id+'c':id
    } else {
        // console.log(id,t_choosed)

        if (inv[t_choosed]) {
            if (is_core) {
                if (core[id] !== undefined && core[id] !== null) {
                    if (checkSwitchingCore(t_choosed,id)) {
                        if (isTheoremHigher(core[id],inv[t_choosed])) switchTheorems(t_choosed,id)
                        else createConfirm(`你確定要將定理移出核心嗎？`,'pickout',()=>{
                            switchTheorems(t_choosed,id,true)
                        })
                        return
                    }
                }
                else if (checkSwitchingCore(t_choosed,id)) [inv[t_choosed], core[id]] = [core[id], inv[t_choosed]]
            } else [inv[id], inv[t_choosed]] = [inv[t_choosed], inv[id]]
        } else if (core[t_choosed.split('c')[0]]) {
            if (is_core) [core[id], core[t_choosed.split('c')[0]]] = [core[t_choosed.split('c')[0]], core[id]]
            else if (checkSwitchingCore(id,t_choosed.split('c')[0])) {
                if (isTheoremHigher(core[t_choosed.split('c')[0]],inv[id])) switchTheorems(id,t_choosed.split('c')[0])
                else createConfirm(`你確定要將定理移出核心嗎？`,'pickout',()=>{
                    switchTheorems(id,t_choosed.split('c')[0],true)
                })
                return
            }
        }

        t_choosed = '-'
    }

    updateTheoremCore()
    updateTheoremInv()
}

function checkSwitchingCore(id1,id2) {
    let inv = player.inf.inv, core = player.inf.core;

    return !inv[id1] || (core[id2] && inv[id1].type == core[id2].type) || core_weight[inv[id1].type] < MAX_CORE_FIT
}

function isTheoremHigher(t,t_target) {
    if (!t_target || t.type != t_target.type || t.level.gt(t_target.level) || Decimal.pow(t.level,t.power).gt(Decimal.pow(t_target.level,t_target.power))) return false

    for (let i = 0; i < MAX_STARS; i++) if (t.star[i] > t_target.star[i]) return false

    return true
}

function switchTheorems(id1,id2,force=false) {
    let inv = player.inf.inv, core = player.inf.core;

    [inv[id1], core[id2]] = [core[id2], inv[id1]]

    t_choosed = '-'

    if (force) {
        INF.doReset()
    }
    
    updateTheoremCore()
    updateTheoremInv()
}

function updateCoreTemp() {
    tmp.min_core_len = MIN_CORE_LENGTH

    let t = 4
    if (tmp.c18reward) t++

    for (let i = 0; i < MAX_STARS; i++) {
        let l = E(1)

        if (i < 4) l = l.mul(tmp.cs_effect.theorem_luck)

        core_star_luck[i] = l

        core_star_chances[i] = i < t ? getCoreChance(i) : E(0)
    }
    
    if (player.inf.theorem.gte(6)) tmp.min_core_len++
    
    tmp.core_lvl = INF.level()

    for (let i in CORE) {
        let t = CORE[i], s = tmp.core_score[i], eff = tmp.core_eff[i], ct = core_tmp[i]

        let boost = t.boost?t.boost():1

        for (let j = 0; j < MAX_STARS; j++) {
            let sc = Decimal.pow(ct.total_s[j].mul(Decimal.pow(boost, ct.total_s[j].add(1).log10().add(1))),ct.total_p) // Decimal.pow(ct.total_s[j] * Math.pow(boost, Math.log10(ct.total_s[j]+1)+1),ct.total_p)
            sc = overflow(sc,1000,0.5)
            if (sc.gt(0)) sc = sc.add(tmp.dim_mass_eff)

            s[j] = sc
            eff[j] = t.eff[j](sc)
        }

        tmp.fragment_eff[i] = t.fragment[0](player.inf.fragment[i])
    }
}

var TS_visible = true

function updateOneSec() {
    if (hasElement(242)) changeCoreFromBestLevel()

    if (false) {
        let p = true
        for (let i in player.inf.core) p &&= player.inf.core[i]
        TS_visible = !p
    }
}