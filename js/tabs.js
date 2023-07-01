const TABS = {
    choose(x, stab=false) {
        if (!stab) {
            if (x==5) tmp.sn_tab = tmp.tab
            tmp.tab = x
            if (x!=5) {
                tmp.sn_tab = tmp.tab
                tree_update = true
            }
        }
        else {
            tmp.stab[tmp.tab] = x
        }
    },
    1: [
        { id: "主標籤", icon: "pajamas:weight" },
        { id: "統計", icon: "material-symbols:query-stats" },
        { id: "升級", icon: "carbon:upgrade", unl() { return player.rp.unl } },
        { id: "挑戰", icon: "material-symbols:star", unl() { return player.chal.unl } },
        { id: "原子", icon: "eos-icons:atom-electron", color: "cyan", unl() { return player.atom.unl }, style: "atom" },
        { id: "超新星", icon: "material-symbols:explosion-outline", color: "magenta", unl() { return player.supernova.times.gte(1) || quUnl() }, style: "sn" },
        { id: "量子", icon: "material-symbols:grid-4x4-rounded", color: "lightgreen", unl() { return quUnl() }, style: "qu" },
        { id: "暗界", icon: "ic:baseline-remove-red-eye", color: "grey", unl() { return player.dark.unl }, style: "dark" },
        { id: "無限", icon: "game-icons:infinity", color: "orange", unl() { return tmp.inf_unl }, style: "inf" },
        { id: "選項", icon: "mdi:gear" },
    ],
    2: {
        0: [
            { id: "質量" },
            { id: "黑洞", unl() { return player.bh.unl }, style: "bh" },
            { id: "原子生產器", unl() { return player.atom.unl }, style: "atom" },
            { id: "恆星", unl() { return STARS.unlocked() }, style: "sn" },
            { id: "不可描述的物質", unl() { return quUnl() }, style: "qu" },
            { id: "平行維度", unl() { return hasInfUpgrade(9) }, style: "inf" },
        ],
        1: [
            { id: "等級獎勵" },
            { id: "價格增幅", unl() { return tmp.scaling ? tmp.scaling.super.length>0 : false } },
            { id: "重置獎勵", unl() { return hasUpgrade("br",9) } },
            { id: "超·級別獎勵", unl() { return tmp.brUnl } },
            { id: "升華獎勵", unl() { return tmp.ascensions_unl } },
        ],
        3: [
            { id: "挑戰" },
            { id: "量子挑戰（QC）", unl() { return hasTree("unl3") }, style: "qu" },
            //{ id: "大撕裂", unl() { return hasTree("unl4") }, style: "qu" },
        ],
        4: [
            { id: "粒子" },
            { id: "元素", unl() { return player.chal.comps[7].gte(16) || player.supernova.times.gte(1) } },
            { id: "質量膨脹", unl() { return MASS_DILATION.unlocked() }, style: "dilation" },
            { id: "打破膨脹", unl() { return hasUpgrade("br",9) }, style: "break_dilation" },
            { id: "奇異原子", unl() { return tmp.eaUnl } },
        ],
        5: [
            { id: "中子樹" },
            { id: "玻色子", unl() { return player.supernova.post_10 } },
            { id: "費米子", unl() { return player.supernova.fermions.unl } },
			{ id: "輻射", unl() { return tmp.radiation.unl } },
        ],
        6: [
            { id: "賦色子" },
            { id: "量子里程碑" },
            { id: "自動量子化", unl() { return tmp.qu.mil_reached[6] } },
            { id: "原始素", unl() { return PRIM.unl() } },
            { id: "熵", unl() { return player.qu.en.unl } },
        ],
        7: [
            { id: "黑暗效果" },
            { id: "黑暗試煉", unl() { return tmp.darkRunUnlocked } },
            { id: "有色物質", unl() { return tmp.matterUnl } },
            { id: "腐化", unl() { return player.dark.c16.first } },
        ],
        8: [
            { id: "核心" },
            { id: "核心效果" },
            { id: "無限升級", style: "inf" },
            { id: "腐化之星", unl() { return tmp.CS_unl } },
        ],
        9: [
            { id: "選項" },
            { id: "隱藏資源" },
        ],
    },
}