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
        { id: "主要" },
        { id: "統計" },
        { id: "升級", unl() { return player.rp.unl } },
        { id: "挑戰", unl() { return player.chal.unl } },
        { id: "原子", unl() { return player.atom.unl }, style: "atom" },
        { id: "超新星", unl() { return player.supernova.times.gte(1) } },
        { id: "選項" },
    ],
    2: {
        0: [
            { id: "質量" },
            { id: "黑洞", unl() { return player.bh.unl }, style: "bh" },
            { id: "原子生產器", unl() { return player.atom.unl }, style: "atom" },
            { id: "恆星", unl() { return STARS.unlocked() } },
        ],
        1: [
            { id: "級獎勵" },
            { id: "價格增幅", unl() { return tmp.scaling ? tmp.scaling.super.length>0 : false } },
        ],
        4: [
            { id: "粒子" },
            { id: "元素", unl() { return player.chal.comps[7].gte(16) || player.supernova.times.gte(1) } },
            { id: "質量品質", unl() { return MASS_DILATION.unlocked() }, style: "dilation" },
        ],
        5: [
            { id: "中子樹" },
            { id: "玻色子", unl() { return player.supernova.post_10 } },
            { id: "費米子", unl() { return player.supernova.fermions.unl } },
        ],
    },
}