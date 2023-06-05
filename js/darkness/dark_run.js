const DARK_RUN = {
    mass_glyph_name: ['西里爾符文', '德國符文', '瑞典符文', '中國符文', '西班牙符文', '斯洛伐克符文'],

    mass_glyph_eff(i) {
        let x, g = (tmp.c16active ? i == 5 ? 10 : 100 : player.dark.run.glyphs[i]) / tmp.dark.glyph_weak

        if (i < 4) x = 1/(g**0.5/100+1)
        else if (i == 4) x = [1/(g**0.5/100+1),1.1**(g**0.75)]
        else x = 1.1**(g**0.75)

        return x
    },

    mass_glyph_effDesc: [
        x => `在黑暗試煉中，將普通質量加成和黑洞質量加成的指數和減少 <b>^${format(x)}</b>。<br class='line'>你會根據普通質量獲得符文。`,
        x => `在黑暗試煉中，將暗物質加成和暴怒力量加成的指數減少 <b>^${format(x)}</b>。<br class='line'>你會根據黑洞質量獲得符文。`,
        x => `在黑暗試煉中，將原子、原子力量和夸克加成的指數減少 <b>^${format(x)}</b>。<br class='line'>你會根據夸克獲得符文。`,
        x => `在黑暗試煉中，將相對粒子加成和膨脹質量公式的指數減少 <b>^${format(x)}</b>。<br class='line'>你會根據膨脹質量獲得符文。`,
        x => `在黑暗試煉中，將超新星資源加成的指數減少 <b>^${format(x[0])}</b>，並將超新星要求提升 <b>x${format(x[1])}</b>。<br class='line'>你會根據塌縮恆星獲得符文。`,
        x => `在黑暗試煉中，將重置底數的指數減少 <b>/${format(x)}</b>，並將所有級別的要求提升 <b>x${format(x)}</b>。<br class='line'>你會根據重置底數獲得符文。`,
    ],

    mass_glyph_gain: [
        ()=>player.mass.gte('ee39')?player.mass.log10().div(1e39).log(1.1).add(1).softcap(50,0.5,0).mul(glyphUpgEff(7)).mul(tmp.dark.glyph_mult).floor().toNumber():0,
        ()=>player.bh.mass.gte('e1.5e34')?player.bh.mass.log10().div(1.5e34).log(1.1).add(1).softcap(50,0.5,0).mul(tmp.dark.glyph_mult).floor().toNumber():0,
        ()=>player.atom.quarks.gte('e3e32')?player.atom.quarks.log10().div(3e32).log(1.1).add(1).softcap(50,0.5,0).mul(tmp.dark.glyph_mult).floor().toNumber():0,
        ()=>player.md.mass.gte('e1e21')?player.md.mass.log10().div(1e21).log(1.1).add(1).softcap(50,0.5,0).mul(tmp.dark.glyph_mult).floor().toNumber():0,
        ()=>player.stars.points.gte('e1.5e24')?player.stars.points.log10().div(1.5e24).log(1.1).add(1).softcap(50,0.5,0).mul(tmp.dark.glyph_mult).floor().toNumber():0,
        ()=>tmp.prestiges.base.gte(1e13)?tmp.prestiges.base.div(1e13).log(1.1).add(1).softcap(10,0.5,0).mul(tmp.dark.glyph_mult).floor().toNumber():0,
    ],

    upg_unl_length() {
        let x = 10

        if (tmp.matterUnl) x += 4

        return x
    },

    upg: [
        null,
        {
            max: 10,
            desc: `質量獲得量 ^1.5。`,
            cost(i) {
                i *= Math.max(1,i-4)**0.5
                return {0: Math.floor(6*i+5)}
            },
            eff(i) { return 1.5**i },
            effDesc: x=>"^"+format(x,2),
        },{
            max: 10,
            desc: `黑洞質量獲得量 ^1.5。`,
            cost(i) {
                i *= Math.max(1,i-4)**0.5
                return {0: Math.floor(6*i+10), 1: Math.floor(6*i+5)}
            },
            eff(i) { return 1.5**i },
            effDesc: x=>"^"+format(x,2),
        },{
            max: 5,
            desc: `奇異級等級增幅推遲 x1.25。`,
            cost(i) {
                return {1: 6*i+10, 2: 6*i+5}
            },
            eff(i) { return 1.25**i },
            effDesc: x=>"推遲 x"+format(x,2),
        },{
            max: 1,
            desc: `在黑暗試煉中，QC 模組 8 的階增幅削弱更弱。`,
            cost() { return {2: 15, 5: 5} },
        },{
            max: 10,
            desc: `原子獲得量 ^1.5。`,
            cost(i) {
                return {2: 75+5*i, 3: 5*i+5}
            },
            eff(i) { return 1.5**i },
            effDesc: x=>"^"+format(x,2),
        },{
            max: 100,
            desc: `暗束獲得量增至 3x。`,
            cost(i) {
                i *= Math.max(1,i-4)**0.5
                return {0: Math.floor(20+20*i), 1: Math.floor(20+20*i), 2: Math.floor(20+20*i)}
            },
            eff(i) { return 3**i },
            effDesc: x=>"x"+format(x,0),
        },{
            max: 1,
            desc: `西里爾符文獲得量 x1.5。`,
            cost() { return {5: 25} },
            eff(i) { return 1.5**i },
        },{
            max: 10,
            desc: `膨脹質量溢出推遲 ^10。`,
            cost(i) {
                i *= Math.max(1,i-4)**0.5
                return {3: Math.floor(35+5*i), 4: Math.floor(5*i+5)}
            },
            eff(i) { return 10**i },
            effDesc: x=>"^"+format(x,0),
        },{
            max: 5,
            desc: `恆星生產器強 ^1.5。`,
            cost(i) { return {1: 200+10*i, 2: 200+10*i, 5: 40+5*i} },
            eff(i) { return 1.5**i },
            effDesc: x=>"^"+format(x,2),
        },{
            max: 10,
            desc: `重置底數的指數增加 0.02。`,
            cost(i) {
                i *= Math.max(1,i-4)**0.5
                return {0: Math.floor(270+10*i), 3: Math.floor(150+10*i), 4: Math.floor(140+10*i)} 
            },
            eff(i) { return i/50 },
            effDesc: x=>"+"+format(x,2),
        },{
            max: 2,
            desc: `物質指數增加 0.1。`,
            cost(i) { return {5: 80+46*i} },
            eff(i) { return i/10 },
            effDesc: x=>"+"+format(x,1),
        },{
            max: 1,
            desc: `宇宙射線效果以極弱的指數速度提升。`,
            cost(i) { return {0: 487, 4: 271, 5: 121} },
        },{
            max: 1,
            desc: `綠色賦色子獲得量平方。`,
            cost(i) { return {0: 542, 2: 404} },
        },{
            max: 10,
            desc: `每個有色物質的指數提升 12.5%。`,
            cost(i) {
                let j = Math.ceil(10*i**1.2)
                return {0: 160+j, 1: 446+j, 2: 460+j, 3: 328+j, 4: 333+j, 5: 222+j}
            },
            eff(i) { return 1+i/8 },
            effDesc: x=>"^"+format(x,3),
        },
    ],
}

const MASS_GLYPHS_LEN = 6

const GLYPH_UPG_LEN = DARK_RUN.upg.length

function mgEff(i,def=1) { return tmp.dark.mass_glyph_eff[i]||def }

function glyphButton(i) {
    if (player.dark.run.gmode == 2) player.dark.run.glyphs[i] = 0
    else if (player.dark.run.active && tmp.dark.mass_glyph_gain[i] > 0) {
        player.dark.run.glyphs[i] += tmp.dark.mass_glyph_gain[i]
        darkRun()
    }
}

function darkRun() {
    DARK.doReset(true)

    player.dark.run.active = !player.dark.run.active
}

function isAffordGlyphCost(cost) {
    for (let c in cost) if (Math.max(player.dark.run.glyphs[c],tmp.dark.mg_passive[c]) < cost[c]) return false

    return true
}

function hasGlyphUpg(i) { return player.dark.run.upg[i]>0 }

function glyphUpgEff(i,def=1) { return tmp.glyph_upg_eff[i]||def; }

function buyGlyphUpgrade(i) {
    let upgs = player.dark.run.upg
    let ua = upgs[i]||0
    let u = DARK_RUN.upg[i]
    let max = u.max||Infinity
    let cost = u.cost(ua)

    if (isAffordGlyphCost(cost) && ua < max) {
        upgs[i] = upgs[i] ? upgs[i] + 1 : 1

        for (let c in cost) if (tmp.dark.mg_passive[c]<=0) player.dark.run.glyphs[c] -= cost[c]

        if (i==12) updateAtomTemp()
        updateDarkRunTemp()
    }
}

function updateDarkRunHTML() {
    let dra = player.dark.run.active
    let c16 = tmp.c16active
    let dtmp = tmp.dark

    tmp.el.dark_run_btn.setTxt(dra?"退出黑暗試煉":"開始黑暗試煉")
    tmp.el.mg_btn_mode.setTxt(["無上限", "按上限", "清空符文"][player.dark.run.gmode])
    tmp.el.mg_max_gain.setTxt(format(player.dark.run.gamount,0))
    for (let x = 0; x < MASS_GLYPHS_LEN; x++) {
        tmp.el["mass_glyph"+x].setHTML(
            c16 ? x == 5 ? 10 : 100 : player.dark.run.glyphs[x]
            + (dra ? " (+" + format(tmp.dark.mass_glyph_gain[x],0) + ")" : dtmp.mg_passive[x]>0 ? " ["+format(dtmp.mg_passive[x],0)+"]" : ""))
        tmp.el["mass_glyph_tooltip"+x].setTooltip("<h3>"+DARK_RUN.mass_glyph_name[x]+"</h3><br class='line'>"+DARK_RUN.mass_glyph_effDesc[x](tmp.dark.mass_glyph_eff[x]))
    }

    let gum = tmp.mass_glyph_msg

    let msg = ''
    if (gum > 0) {
        let u = DARK_RUN.upg[gum]
        let ua = player.dark.run.upg[gum]||0
        let max = u.max||Infinity

        let desc = "<span class='sky'>"+(typeof u.desc == "function" ? u.desc() : u.desc)+"</span>"

        if (c16 && gum == 14) desc = desc.corrupt()

        msg = "[等級 "+format(ua,0)+(isFinite(max)?" / "+format(max,0):"")+"]<br>"+desc+"<br>"

        if (ua<max) {
            let cr = "", cost = u.cost(ua), n = 0, cl = Object.keys(cost).length
            for (let c in cost) {
                cr += format(cost[c],0)+" 個"+DARK_RUN.mass_glyph_name[c]+(n+1<cl?"、":"")
                n++
            }
            msg +=  "<span>價格："+cr+"</span><br>"
        }
        
		if (u.effDesc !== undefined) msg += "<span class='green'>目前："+u.effDesc(tmp.glyph_upg_eff[gum])+"</span>"
    }
    tmp.el.glyph_upg_msg.setHTML(msg)

    for (let x = 1; x < GLYPH_UPG_LEN; x++) {
        let unl = x <= tmp.dark.glyph_upg_unls

        tmp.el['glyph_upg'+x].setDisplay(unl)

        if (!unl) continue

		let u = DARK_RUN.upg[x]
        let ua = player.dark.run.upg[x]||0
        let max = u.max||Infinity

		tmp.el['glyph_upg'+x].setClasses({img_btn: true, locked: !isAffordGlyphCost(u.cost(ua)) && ua < max, bought: ua >= max})
	}

    tmp.el.FSS_eff2.setHTML(
        player.dark.matters.final.gt(0)
        ? `你的 FSS 將符文質量獲得量提升 x${format(tmp.matters.FSS_eff[1],2)}`
        : ''
    )
}

function updateDarkRunTemp() {
    let dtmp = tmp.dark
    let dra = player.dark.run.active

    dtmp.glyph_upg_unls = DARK_RUN.upg_unl_length()

    dtmp.glyph_mult = dtmp.rayEff.glyph||1
    if (hasPrestige(2,5)) dtmp.glyph_mult *= prestigeEff(2,5,1)
    dtmp.glyph_mult *= tmp.matters.FSS_eff[1]
    
    let w = 1

    if (tmp.inf_unl) w /= theoremEff('time',3)

    dtmp.glyph_weak = w

    let dp = 0
    if (hasElement(7,1)) dp += 3

    for (let x = 0; x < MASS_GLYPHS_LEN; x++) {
        dtmp.mass_glyph_eff[x] = DARK_RUN.mass_glyph_eff(x)
        let gain = DARK_RUN.mass_glyph_gain[x]()
        let mg = Math.max(0,(dra ? gain : 0)-player.dark.run.glyphs[x])
        if (player.dark.run.gmode == 1) mg = Math.min(player.dark.run.gamount,mg)
        dtmp.mass_glyph_gain[x] = mg

        dtmp.mg_passive[x] = x < dp ? gain : 0
    }

    for (let x = 1; x < GLYPH_UPG_LEN; x++) {
        let u = DARK_RUN.upg[x]

        if (u.eff) tmp.glyph_upg_eff[x] = u.eff(player.dark.run.upg[x]||0)
    }
}

function setupDarkRunHTML() {
    let t = new Element('mass_glyph_table')
    let html = ""

    for (let x = 0; x < MASS_GLYPHS_LEN; x++) {
        html += `
        <div style="margin: 5px; width: 100px">
            <div id="mass_glyph_tooltip${x}" class="tooltip" style="margin-bottom: 5px;" onclick="glyphButton(${x})" tooltip-html="${DARK_RUN.mass_glyph_name[x]}"><img style="cursor: pointer" src="images/glyphs/glyph${x}.png"></div>
            <div id="mass_glyph${x}">0</div>
        </div>
        `
    }

    t.setHTML(html)

    // Glyph Upgrades

    t = new Element('glyph_upg_table')
    html = ""

    for (let x = 1; x < GLYPH_UPG_LEN; x++) {
        html += `
        <img id="glyph_upg${x}" onclick="buyGlyphUpgrade(${x})" src="images/glyphs/glyph_upg${x}.png" style="margin: 3px;" class="img_btn" onmouseover="tmp.mass_glyph_msg = ${x}" onmouseleave="tmp.mass_glyph_msg = 0">
        `
    }

    t.setHTML(html)
}