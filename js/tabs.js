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
        else tmp.stab[tmp.tab] = x
    },
    1: [
        { id: "主標籤" },
        { id: "統計" },
        { id: "升級", unl() { return player.rp.unl } },
        { id: "挑戰", unl() { return player.chal.unl } },
        { id: "原子", unl() { return player.atom.unl }, style: "atom" },
        { id: "超新星", unl() { return player.supernova.times.gte(1) || quUnl() }, style: "sn" },
		{ id: "量子", unl() { return quUnl() }, style: "qu" },
        { id: "選項" },
    ],
    2: {
        0: [
            { id: "質量" },
            { id: "黑洞", unl() { return player.bh.unl }, style: "bh" },
            { id: "原子生產器", unl() { return player.atom.unl }, style: "atom" },
            { id: "恆星", unl() { return STARS.unlocked() } },
			{ id: "不可描述的物質", unl() { return quUnl() } },
        ],
        1: [
            { id: "等級獎勵" },
            { id: "價格增幅", unl() { return tmp.scaling ? tmp.scaling.super.length>0 : false } },
        ],
        4: [
            { id: "粒子" },
            { id: "元素", unl() { return player.chal.comps[7].gte(16) || player.supernova.times.gte(1) } },
            { id: "質量膨脹", unl() { return MASS_DILATION.unlocked() }, style: "dilation" },
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
        ],
    },
}