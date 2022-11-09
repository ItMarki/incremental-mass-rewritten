const BIG_RIP = {
    rip() {
        if (!player.qu.rip.active && player.confirms.br) createConfirm(`你確定要將維度大撕裂嗎？
        當你將維度大撕裂時，熵獎勵失效，所有原始素效果都弱 50%（Ε 粒子則失效），[qu2, qu10] 樹升級失效，而且你困在模組為 [10,2,10,10,5,0,2,10] 的量子挑戰中。
        你在大撕裂中會基於你的質量獲得死亡碎片。
        你可以在大撕裂中解鎖各種升級。`,'br',CONFIRMS_FUNCTION.bigRip)
        else CONFIRMS_FUNCTION.bigRip()
    },
    gain() {
        let x = player.mass.add(1).log10().div(2e5).max(0)
        if (x.lt(1)) return E(0)
        if (hasTree('br1')) x = x.mul(treeEff('br1'))
        if (hasElement(90)) x = x.mul(tmp.elements.effect[90]||1)
        if (hasElement(94)) x = x.mul(tmp.elements.effect[94]||1)
        if (hasPrestige(0,2)) x = x.mul(4)
        if (player.md.break.upgs[6].gte(1)) x = x.mul(tmp.bd.upgs[6].eff?tmp.bd.upgs[6].eff[1]:1)
        if (hasUpgrade('br',13)) x = x.mul(upgEffect(4,13))
        return x.floor()
    },
}

const BIG_RIP_QC = [10,2,10,10,5,0,2,10]

function updateBigRipTemp() {
    tmp.rip.gain = BIG_RIP.gain()
}