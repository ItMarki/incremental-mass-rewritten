const QCs = {
    active() { return player.qu.qc.active },
    getMod(x) { return player.qu.qc.mods[x] },
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
        if (player.qu.qc.active ? true : confirm("你確定要進入量子挑戰嗎？這樣做會強制執行重置！")) {
            player.qu.qc.active = !player.qu.qc.active
            QUANTUM.doReset(player.qu.qc.active)
        }
    },
    names: ["「黑矮星」","「時間異象」","「迅速升階」","「熔融互動」","「神奇催化劑」","「往日挑戰」","「空間膨脹」","「極速增幅」"],
    ctn: [
        {
            eff(i) {
                return [1-0.03*i,2/(i+2)]
            },
            effDesc(x) { return `所有恆星資源 ^${format(x[0])}。<br>恆星生產器強度 ^${format(x[1])}。` },
        },{
            eff(i) {
                let x = E(2).pow(i**2)
                return x
            },
            effDesc(x) { return `量子前運行速度 /${format(x,0)}。` },
        },{
            eff(i) {
                let x = i**1.5*0.15+1
                return x
            },
            effDesc(x) { return `所有費米子的要求提升 x${format(x)}。` },
        },{
            eff(i) {
                let x = 0.9**(i**1.25)
                return x
            },
            effDesc(x) { return `玻色子和輻射資源的加成 ^${format(x)}。` },
        },{
            eff(i) {
                let x = 0.8**(i**1.25)
                return x
            },
            effDesc(x) { return `超新星前資源的加成 ^${format(x)}，所有恆星資源除外。` },
        },{
            eff(i) {
                let x = 1.2**i
                return x
            },
            effDesc(x) { return `量子前挑戰的要求提升 x${format(x)}。` },
        },{
            eff(i) {
                let x = i**1.5/2+1
                return x
            },
            effDesc(x) { return `質量膨脹懲罰 ^${format(x)}。` },
        },{
            eff(i) {
                let x = [1-0.05*i,i/10+1]
                return x
            },
            effDesc(x) { return `量子前增幅的開始 ^${format(x[0])}。<br>量子前增幅加強 ${format(x[1]*100)}%。` },
        },
    ],
}

const QCs_len = 8

function addQCPresetAs() {
    let copied_mods = []
    for (let x = 0; x < QCs_len; x++) copied_mods.push(player.qu.qc.mods[x])
    player.qu.qc.presets.push({
        p_name: "新預設模組",
        mods: copied_mods,
    })
    updateQCModPresets()
}

function saveQCPreset(x) {
    let copied_mods = []
    for (let x = 0; x < QCs_len; x++) copied_mods.push(player.qu.qc.mods[x])
    player.qu.qc.presets[x].mods = copied_mods
    addNotify("已保存預設模組")
    updateQCModPresets()
}

function loadQCPreset(x) {
    player.qu.qc.mods = player.qu.qc.presets[x].mods
    addNotify("已加載預設模組")
    updateQCModPresets()
}

function renameQCPreset(x) {
    let renamed = prompt("輸入預設模組名稱")
    player.qu.qc.presets[x].p_name = renamed
    addNotify("已重命名預設模組")
    updateQCModPresets()
}

function deleteQCPreset(x) {
    if (confirm("你確定要刪除預設模組嗎？")) {
        let represets = []
        for (let y = 0; y < player.qu.qc.presets.length; y++) if (x != y) represets.push(player.qu.qc.presets[y])
        player.qu.qc.presets = represets
    }
    addNotify("已刪除預設模組")
    updateQCModPresets()
}

function setupQCHTML() {
    let new_table = new Element("QC_table")
	let table = ""
	for (let x = 0; x < QCs_len; x++) {
        table += `
        <div style="margin: 5px;">
        <div style="margin: 5px" tooltip="${QCs.names[x]}"><img onclick="tmp.qc_ch = ${x}" style="cursor: pointer" src="images/qcm_test.png"></div>
        <div><span id="qcm_mod${x}">0</span>/10</div>
        <div id="qcm_btns${x}"><button onclick="QCs.incMod(${x},-1); tmp.qc_ch = ${x}">-</button><button onclick="QCs.incMod(${x},1); tmp.qc_ch = ${x}">+</button></div>
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
            <div style="margin-right: 3px; width: 20px; text-align: right;">${p.mods[y]}</div><div tooltip="${QCs.names[y]}"><img style="width: 25px; height: 25px" src="images/qcm_test.png"></div>
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
}

function updateQCTemp() {
    tmp.qu.qc_s_b = E(2)
    tmp.qu.qc_s_eff = tmp.qu.qc_s_b.pow(player.qu.qc.shard)

    let s = 0
    for (let x = 0; x < QCs_len; x++) {
        s += QCs.getMod(x)
        tmp.qu.qc_eff[x] = QCs.ctn[x].eff(QCs.getMod(x))
    }
    tmp.qu.qc_s = s
}

function updateQCHTML() {
    tmp.el.qc_shard.setTxt(player.qu.qc.shard+(tmp.qu.qc_s!=player.qu.qc.shard?(` (${tmp.qu.qc_s>=player.qu.qc.shard?"+":""}${tmp.qu.qc_s-player.qu.qc.shard})`):""))
    tmp.el.qc_shard_b.setTxt(tmp.qu.qc_s_b.format(1))
    tmp.el.qc_shard_eff.setTxt(tmp.qu.qc_s_eff.format(1))

    for (let x = 0; x < 2; x++) {
        tmp.el["qc_tab"+x].setDisplay(tmp.qc_tab == x)
    }
    if (tmp.qc_tab == 0) {
        tmp.el.qc_btn.setTxt((QCs.active()?"退出":"進入") + "量子挑戰")
        for (let x = 0; x < QCs_len; x++) {
            tmp.el["qcm_mod"+x].setTxt(QCs.getMod(x))
            tmp.el["qcm_btns"+x].setDisplay(!QCs.active())
        }
        tmp.el.qc_desc_div.setDisplay(tmp.qc_ch >= 0)
        if (tmp.qc_ch >= 0) {
            let x = tmp.qc_ch
            tmp.el.qc_ch_title.setTxt(`[${x+1}] ${QCs.names[x]} [${QCs.getMod(x)}/10]`)
            tmp.el.qc_ch_desc.setHTML(QCs.ctn[x].effDesc(tmp.qu.qc_eff[x]))
        }
    }
}