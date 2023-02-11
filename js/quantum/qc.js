const QCs = {
    active() { return player.qu.qc.active || player.qu.rip.active || CHALS.inChal(14) || CHALS.inChal(15) || tmp.c16active || player.dark.run.active },
    getMod(x) { return CHALS.inChal(15) ? [10,5,10,10,10,10,10,10][x] : tmp.c16active || player.dark.run.active ? 8 : CHALS.inChal(14) ? 5 : player.qu.rip.active ? BIG_RIP_QC[x] : player.qu.qc.mods[x] },
    incMod(x,i) { if (!this.active()) player.qu.qc.mods[x] = Math.min(Math.max(player.qu.qc.mods[x]+i,0),10) },
    enter() {
        if (!player.qu.qc.active) {
            let is_zero = true
            for (let x = 0; x < QCs_len; x++) if (this.getMod(x)>0) {
                is_zero = false
                break
            }
            if (is_zero) return
        }
        if (player.qu.qc.active) CONFIRMS_FUNCTION.enterQC()
        else createConfirm("你確定要進入量子挑戰嗎？這樣做會強制執行重置！",'qc',CONFIRMS_FUNCTION.enterQC)
    },
    names: ["「黑矮星」","「時間異常」","「迅速增幅」","「熔融互動」","「神奇催化劑」","「往日挑戰」","「空間膨脹」","「極速增幅」"],
    ctn: [
        {
            eff(i) {
                return [1-0.03*i,2/(i+2)]
            },
            effDesc(x) { return `所有恆星資源 <b>^${format(x[0])}</b>。<br>恆星生產器強度 <b>^${format(x[1])}</b>。` },
        },{
            eff(i) {
                let x = E(2).pow(i**2)
                return x
            },
            effDesc(x) { return `量子前全局運行速度 <b>/${format(x,0)}</b>。` },
        },{
            eff(i) {
                let x = i**1.5*0.15+1
                return x
            },
            effDesc(x) { return `所有費米子的要求提升 <b>x${format(x)}</b>。` },
        },{
            eff(i) {
                let x = 0.9**(i**1.25)
                return x
            },
            effDesc(x) { return `玻色子和輻射資源的加成 <b>^${format(x)}</b>。` },
        },{
            eff(i) {
                let x = 0.8**(i**1.25)
                return x
            },
            effDesc(x) { return `超新星前資源的加成 <b>^${format(x)}</b>，所有恆星資源除外。` },
        },{
            eff(i) {
                let x = 1.2**i
                return x
            },
            effDesc(x) { return `量子前挑戰的要求提升 <b>x${format(x)}</b>。` },
        },{
            eff(i) {
                if (hasElement(163)) i /= 2
                let x = i**1.5/2+1
                return x
            },
            effDesc(x) { return `質量膨脹懲罰 <b>^${format(x)}</b>。` },
        },{
            eff(i) {
                if (hasElement(98) && player.qu.rip.active) i *= 0.8
                let x = [1-0.05*i,i/10+1]
                return x
            },
            effDesc(x) { return `量子前增幅的開始 <b>^${format(x[0])}</b>。<br>量子前增幅加強 <b>${format(x[1]*100)}%</b>。` },
        },
    ],
}

const QCs_len = 8

function addQCPresetAs() {
    if (player.qu.qc.presets.length >= 5) {
        addNotify("由於預設組合已到達最大數量，你不能新建預設組合")
        return
    }

    let copied_mods = []
    for (let x = 0; x < QCs_len; x++) copied_mods.push(player.qu.qc.mods[x])
    player.qu.qc.presets.push({
        p_name: "新建預設組合",
        mods: copied_mods,
    })
    updateQCModPresets()
}

function saveQCPreset(x) {
    let copied_mods = []
    for (let x = 0; x < QCs_len; x++) copied_mods.push(player.qu.qc.mods[x])
    player.qu.qc.presets[x].mods = copied_mods
    addNotify("已保存預設組合")
    updateQCModPresets()
}

function loadQCPreset(x) {
    if (QCs.active()) return
    player.qu.qc.mods = player.qu.qc.presets[x].mods
    addNotify("已加載預設組合")
    updateQCModPresets()
}

function renameQCPreset(x) {
    createPrompt("輸入預設組合名稱",'renamePreset',renamed=>{
        player.qu.qc.presets[x].p_name = renamed
        addNotify("已重命名預設組合")
        updateQCModPresets()
    })
}

function deleteQCPreset(x) {
    createConfirm("你確定要刪除預設組合嗎？",'removePreset',()=>{
        let represets = []
        for (let y = 0; y < player.qu.qc.presets.length; y++) if (x != y) represets.push(player.qu.qc.presets[y])
        player.qu.qc.presets = represets
        addNotify("已刪除預設組合")

        updateQCModPresets()
    })
}

function setupQCHTML() {
    let new_table = new Element("QC_table")
	let table = ""
	for (let x = 0; x < QCs_len; x++) {
        table += `
        <div style="margin: 5px;">
        <div style="margin: 5px" id='qc_tooltip${x}' class="tooltip" tooltip-html="${QCs.names[x]}"><img style="cursor: pointer" src="images/qcm${x}.png"></div>
        <div><span id="qcm_mod${x}">0</span>/10</div>
        <div id="qcm_btns${x}"><button onclick="QCs.incMod(${x},-1)">-</button><button onclick="QCs.incMod(${x},1)">+</button></div>
        </div>
        `
    }
	new_table.setHTML(table)
}

function updateQCModPresets() {
    let table = ""
    for (let x = 0; x < player.qu.qc.presets.length; x++) {
        let p = player.qu.qc.presets[x]
        table += `
        <div class="table_center" style="align-items: center;">
        <div style="margin: 5px; width: 150px; text-align: left">${p.p_name}</div>
        <div style="margin: 5px; width: 500px" class="table_center">
        `
        for (let y = 0; y < QCs_len; y++) {
            table += `
            <div style="margin: 5px; align-items: center;" class="table_center">
            <div style="margin-right: 3px; width: 20px; text-align: right;">${p.mods[y]}</div><div class="tooltip" tooltip-html="${QCs.names[y]}"><img style="width: 25px; height: 25px" src="images/qcm${y}.png"></div>
            </div>
            `
        }
        table += `</div>
        <div style="margin: 5px">
        <button class="btn" onclick="saveQCPreset(${x})">保存</button>
        <button class="btn" onclick="loadQCPreset(${x})">加載</button>
        <button class="btn" onclick="renameQCPreset(${x})">重命名</button>
        <button class="btn" onclick="deleteQCPreset(${x})">刪除</button>
        </div>
        </div>`
    }
    tmp.el.QC_Presets_table.setHTML(table)
    setupTooltips()
}

function updateQCTemp() {
    tmp.qu.qc_s_b = E(2)
    if (hasTree("qf4")) tmp.qu.qc_s_b = tmp.qu.qc_s_b.add(.5)
    if (hasPrestige(0,2)) tmp.qu.qc_s_b = tmp.qu.qc_s_b.add(.5)
    if (hasTree("qc3")) tmp.qu.qc_s_b = tmp.qu.qc_s_b.add(treeEff('qc3',0))
    if (hasElement(146)) tmp.qu.qc_s_b = tmp.qu.qc_s_b.add(elemEffect(146,0))
    
    tmp.qu.qc_s_eff = tmp.qu.qc_s_b.pow(player.qu.qc.shard)

    let s = 0
    let bs = 0
    for (let x = 0; x < QCs_len; x++) {
        let m = QCs.getMod(x)
        s += m
        tmp.qu.qc_eff[x] = QCs.ctn[x].eff(m)
        if (hasTree('qc2') && m >= 10) bs++
    }
    tmp.qu.qc_s = s
    tmp.qu.qc_s_bouns = bs
}

function updateQCHTML() {
    tmp.el.qc_shard.setTxt(player.qu.qc.shard+(tmp.qu.qc_s+tmp.qu.qc_s_bouns!=player.qu.qc.shard?(` (${tmp.qu.qc_s+tmp.qu.qc_s_bouns>=player.qu.qc.shard?"+":""}${tmp.qu.qc_s+tmp.qu.qc_s_bouns-player.qu.qc.shard})`):""))
    tmp.el.qc_shard_b.setTxt(tmp.qu.qc_s_b.format(1))
    tmp.el.qc_shard_eff.setTxt(tmp.qu.qc_s_eff.format(1))

    for (let x = 0; x < 2; x++) {
        tmp.el["qc_tab"+x].setDisplay(tmp.qc_tab == x)
    }
    if (tmp.qc_tab == 0) {
        tmp.el.qc_btn.setDisplay(!(player.qu.rip.active || tmp.c16active || player.dark.run.active))
        tmp.el.qc_btn.setTxt((QCs.active()?"退出":"進入") + "量子挑戰")
        for (let x = 0; x < QCs_len; x++) {
            tmp.el["qcm_mod"+x].setTxt(QCs.getMod(x))
            tmp.el["qcm_btns"+x].setDisplay(!QCs.active())

            tmp.el['qc_tooltip'+x].setTooltip(
                `
                <h3>${QCs.names[x]}</h3>
                <br class='line'>
                ${QCs.ctn[x].effDesc(tmp.qu.qc_eff[x])}
                `
            )
        }
    }
}