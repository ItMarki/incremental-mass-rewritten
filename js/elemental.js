const ELEMENTS = {
    map: `x_________________xvxx___________xxxxxxvxx___________xxxxxxvxxx_xxxxxxxxxxxxxxxvxxx_xxxxxxxxxxxxxxxvxxx1xxxxxxxxxxxxxxxvxxx2xxxxxxxxxxxxxxxv_v___3xxxxxxxxxxxxxx_v___4xxxxxxxxxxxxxx_`,
    la: [null,'*','**','*','**'],
    names: [
        null,
        'H','He','Li','Be','B','C','N','O','F','Ne',
        'Na','Mg','Al','Si','P','S','Cl','Ar','K','Ca',
        'Sc','Ti','V','Cr','Mn','Fe','Co','Ni','Cu','Zn',
        'Ga','Ge','As','Se','Br','Kr','Rb','Sr','Y','Zr',
        'Nb','Mo','Tc','Ru','Rh','Pd','Ag','Cd','In','Sn',
        'Sb','Te','I','Xe','Cs','Ba','La','Ce','Pr','Nd',
        'Pm','Sm','Eu','Gd','Tb','Dy','Ho','Er','Tm','Yb',
        'Lu','Hf','Ta','W','Re','Os','Ir','Pt','At','Hg',
        'Tl','Pb','Bi','Po','At','Rn','Fr','Ra','Ac','Th',
        'Pa','U','Np','Pu','Am','Cm','Bk','Cf','Es','Fm',
        'Md','No','Lr','Rf','Db','Sg','Bh','Hs','Mt','Ds',
        'Rg','Cn','Nh','Fl','Mc','Lv','Ts','Og'
    ],
    fullNames: [
        null,
        '氫','氦','鋰','鈹','硼','碳','氮','氧','氟','氖',
        '鈉','鎂','鋁','硅','磷','硫','氯','氬','鉀','鈣',
        '鈧','鈦','釩','鉻','錳','鐵','鈷','鎳','銅','鋅',
        '鎵','鍺','砷','硒','溴','氪','銣','鍶','釔','鋯',
        '鈮','鉬','鍀','釕','銠','鈀','銀','鎘','銦','錫', // 鍀 ~ 鎝
        '銻','碲','碘','氙','銫','鋇','鑭','鈰','鐠','釹',
        '鉕','釤','銪','釓','鋱','鏑','鈥','鉺','銩','鐿',
        '鑥','鉿','鉭','鎢','錸','鋨','銥','鉑','金','汞', // 鑥 ~ 鎦
        '鉈','鉛','鉍','釙','砹','氡','鈁','鐳','錒','釷', // 砹 ~ 砈; 鈁 ~ 鍅
        '鏷','鈾','鎿','鈈','鎇','鋦','錇','鐦','鎄','鐨', // 鎿 ~ 錼; 鈈 ~ 鈽; 鎇 ~ 鋂; 錇 ~ 鉳; 鐦 ~ 鉲; 鎄 ~ 鑀
        '鍆','鍩','鐒','鑪','𨧀（⿰金杜）','𨭎（⿰金喜）','𨨏（⿰金波）','𨭆（⿰金黑）','䥑（⿰金麥）','鐽',
        '錀','鎶','鉨','鈇','鏌','鉝','鿬（⿰石田）','鿫（⿹气奥）'
    ],
    canBuy(x) { return player.atom.quarks.gte(this.upgs[x].cost) && !hasElement(x) && (player.qu.rip.active ? true : x <= 86) },
    buyUpg(x) {
        if (this.canBuy(x)) {
            player.atom.quarks = player.atom.quarks.sub(this.upgs[x].cost)
            player.atom.elements.push(x)
        }
    },
    upgs: [
        null,
        {
            desc: `改善夸克獲得量公式。`,
            cost: E(5e8),
        },
        {
            desc: `困難挑戰增幅減弱 25%。`,
            cost: E(2.5e12),
        },
        {
            desc: `電子力量加強原子力量獲得量。`,
            cost: E(1e15),
            effect() {
                let x = player.atom?player.atom.powers[2].add(1).root(2):E(1)
                if (x.gte('e1e4')) x = expMult(x.div('e1e4'),0.9).mul('e1e4')
                return x
            },
            effDesc(x) { return format(x)+"x"+(x.gte('e1e4')?"<span class='soft'>（軟限制）</span>":"") },
        },
        {
            desc: `質子力量加強增強器力量。`,
            cost: E(2.5e16),
            effect() {
                let x = player.atom?player.atom.powers[0].max(1).log10().pow(0.8).div(50).add(1):E(1)
                return x
            },
            effDesc(x) { return "加強 "+format(x)+"x" },
        },
        {
            desc: `第 7 挑戰的效果翻倍。`,
            cost: E(1e18),
        },
        {
            desc: `每完成一次挑戰，夸克獲得量增加 1%。`,
            cost: E(5e18),
            effect() {
                let x = E(0)
                for (let i = 1; i <= CHALS.cols; i++) x = x.add(player.chal.comps[i].mul(i>4?2:1))
                if (player.atom.elements.includes(7)) x = x.mul(tmp.elements.effect[7])
                if (hasElement(87)) x = E(1.01).pow(x).root(3)
                else x = x.div(100).add(1).max(1)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `碳的效果乘以已購買元素數。`,
            cost: E(1e20),
            effect() {
                let x = E(player.atom.elements.length+1)
                if (hasElement(11) && !hasElement(87)) x = x.pow(2)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `C2 獎勵的軟限制減弱 75%。`,
            cost: E(1e21),
        },
        {
            desc: `層要求減弱 15%。`,
            cost: E(6.5e21),
        },
        {
            desc: `減弱第 3 和 4 挑戰的增幅。`,
            cost: E(1e24),
        },
        {
            desc: `將氮的倍數平方。`,
            cost: E(1e27),
        },
        {
            desc: `改善每個原子力量的獲得量的公式。`,
            cost: E(1e29),
        },
        {
            desc: `每完成一次 C7，C5 和 C6 的完成上限增加 2 次。`,
            cost: E(2.5e30),
            effect() {
                let x = player.chal.comps[7].mul(2)
                if (hasElement(79)) x = x.mul(tmp.qu.chroma_eff[2])
                return x
            },
            effDesc(x) { return "+"+format(x) },
        },
        {
            desc: `每秒獲得重置時獲得的夸克的 5%。`,
            cost: E(1e33),
        },
        {
            desc: `超級黑洞壓縮器和宇宙射線的價格增幅減弱 20%。`,
            cost: E(1e34),
        },
        {
            desc: `每購買一個元素，硅的效果增加 2%。`,
            cost: E(5e38),
            effect() {
                let x = player.atom.elements.length*0.02
                return Number(x)
            },
            effDesc(x) { return "+"+format(x*100)+"%" },
        },
        {
            desc: `原子獲得量 ^1.1。`,
            cost: E(1e40),
        },
        {
            desc: `你可以自動購買宇宙射線。宇宙射線極稍微加強時間速度效果。`,
            cost: E(1e44),
            effect() {
                let x = player.atom.gamma_ray.pow(0.35).mul(0.01).add(1)
                return x
            },
            effDesc(x) { return "^"+format(x) },
        },
        {
            desc: `改善中子的第二效果。`,
            cost: E(1e50),
        },
        {
            desc: `C7 完成上限增加 50 個。`,
            cost: E(1e53),
        },
        {
            desc: `解鎖質量膨脹。`,
            cost: E(1e56),
        },
        {
            desc: `時間速度稍微增加膨脹質量獲得量。`,
            cost: E(1e61),
            effect() {
                let x = E(1.25).pow(player.tickspeed.pow(0.55))
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `改善原子力量的效果。`,
            cost: E(1e65),
        },
        {
            desc: `每秒獲得你會獲得的原子的 100%。原子力量稍微提升相對粒子獲得量。`,
            cost: E(1e75),
            effect() {
                let x = player.atom.atomic.max(1).log10().add(1).pow(0.4)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `質量膨脹升級 1 的底數增加 1。`,
            cost: E(1e80),
        },
        {
            desc: `基於已購買的元素，困難挑戰的增幅更弱。`,
            cost: E(1e85),
            effect() {
                let x = E(0.99).pow(E(player.atom.elements.length).softcap(30,2/3,0)).max(0.5)
                return x
            },
            effDesc(x) { return "弱 "+format(E(1).sub(x).mul(100))+"%" },
        },
        {
            desc: `高級和極高級等級和時間速度增幅弱 25%。`,
            cost: E(1e90),
        },
        {
            desc: `膨脹質量時，質量獲得量 ^1.5。`,
            cost: E(1e97),
        },
        {
            desc: `質子力量的效果更強。`,
            cost: E(1e100),
        },
        {
            desc: `電子力量的效果更強。每種粒子每秒獲得夸克數量的 10%。`,
            cost: E(1e107),
        },
        {
            desc: `膨脹質量提升相對粒子獲得量。`,
            cost: E(1e130),
            effect() {
                let x = player.md.mass.add(1).pow(0.0125)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `膨脹質量獲得量指數增加 5%。`,
            cost: E(1e140),
        },
        {
            desc: `挑戰 8 的完成上限增加 50 次。`,
            cost: E(1e155),
        },
        {
            desc: `暴怒點數提升相對粒子獲得量。`,
            cost: E(1e175),
            effect() {
                let x = player.rp.points.max(1).log10().add(1).pow(0.75)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `黑洞的質量加成提升膨脹質量獲得量。`,
            cost: E(1e210),
            effect() {
                let x = player.bh.mass.max(1).log10().add(1).pow(0.8)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `解鎖恆星。`,
            cost: E(1e225),
        },
        {
            desc: `基於層數，超級階增幅更慢。`,
            cost: E(1e245),
            effect() {
                let x = E(0.9).pow(player.ranks.tetr.softcap(6,0.5,0))
                return x
            },
            effDesc(x) { return format(E(1).sub(x).mul(100))+"% weaker" },
        },
        {
            desc: `宇宙射線的免費時間速度適用於暴怒升級 7。`,
            cost: E(1e260),
            effect() {
                let x = tmp.atom?tmp.atom.atomicEff:E(0)
                if (hasElement(82)) x = x.mul(3)
                return x.div(6).floor()
            },
            effDesc(x) { return "暴怒升級 7 +"+format(x,0)+"" },
        },
        {
            desc: `移除挑戰 2 和 6 的效果的軟限制。`,
            cost: E(1e285),
        },
        {
            desc: `塌縮恆星提升膨脹質量獲得量。`,
            cost: E(1e303),
            effect() {
                let x = player.stars.points.add(1).pow(0.5)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `挑戰 7 的完成上限增加 50 次。`,
            cost: E('e315'),
        },
        {
            desc: `塌縮恆星提升夸克獲得量。`,
            cost: E('e325'),
            effect() {
                let x = player.stars.points.add(1).pow(1/3)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `如果已經購買某個質量膨脹升級，則可以自動購買它。它們不再花費膨脹質量。`,
            cost: E('e360'),
        },
        {
            desc: `大幅減弱層的要求。`,
            cost: E('e380'),
        },
        {
            desc: `塌縮恆星提升相對粒子獲得量。`,
            cost: E('e420'),
            effect() {
                let x = player.stars.points.add(1).pow(0.15).min(1e20)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `塌縮恆星的效果稍微加強黑洞的質量加成。`,
            cost: E('e510'),
            effect() {
                let x = tmp.stars?tmp.stars.effect.add(1).pow(0.02):E(1)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `夸克獲得量 ^1.05。`,
            cost: E('e610'),
        },
        {
            desc: `塌縮恆星的效果強 10%。`,
            cost: E('e800'),
        },
        {
            desc: `塌縮恆星加強最後一類恆星。`,
            cost: E('e1000'),
            effect() {
                let x = player.stars.points.add(1).log10().add(1).pow(1.1)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `恆星生產器 ^1.05。`,
            cost: E('e1750'),
        },
        {
            desc: `質量軟限制^2 弱 10%。`,
            cost: E('e2400'),
        },
        {
            desc: `黑洞質量稍微提升原子力量獲得量。`,
            cost: E('e2800'),
            effect() {
                let x = expMult(player.bh.mass.add(1),0.6)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `質量膨脹升級 6 強 75%。`,
            cost: E('e4600'),
        },
        {
            desc: `塌縮恆星稍微提升所有恆星資源。`,
            cost: E('e5200'),
            effect() {
                let x = player.mass.max(1).log10().root(2)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `高級/極高級黑洞壓縮器和宇宙射線的價格增幅弱 25%。`,
            cost: E('e1.6e4'),
        },
        {
            desc: `挑戰 8 的完成上限增加 200 次。`,
            cost: E('e2.2e4'),
        },
        {
            desc: `時間速度力量稍微加強恆星提升器的底數。`,
            cost: E('e3.6e4'),
            effect() {
                let x = tmp.tickspeedEffect?tmp.tickspeedEffect.step.max(1).log10().div(10).max(1):E(1)
                if (player.atom.elements.includes(66)) x = x.pow(2)
                return x.max(1)
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `基於階數，極高級等級和時間速度增幅更弱。`,
            cost: E('e5.7e4'),
            effect() {
                let x = E(0.975).pow(player.ranks.tier.pow(0.5))
                return x
            },
            effDesc(x) { return "弱 "+format(E(1).sub(x).mul(100))+"%" },
        },
        {
            desc: `黑洞質量公式的指數增加至 0.5。`,
            cost: E('e6.6e4'),
        },
        {
            desc: `挑戰 7 的完成上限增加 100 次。`,
            cost: E('e7.7e4'),
        },
        {
            desc: `軟限制生效後，粒子力獲得量乘以對應粒子數量的平方根。`,
            cost: E('e1.5e5'),
        },
        {
            desc: `每擁有一個超新星，極高級階推遲 3 階。`,
            cost: E('e2.5e5'),
            effect() {
                let x = player.supernova.times.mul(3)
                return x
            },
            effDesc(x) { return format(x,0)+" later" },
        },
        {
            desc: `非獎勵時間速度強 25x。`,
            cost: E('e3e5'),
        },
		{
            desc: `挑戰 3 - 4 和 8 的獎勵強 50%。`,
            cost: E('e5e5'),
        },
        {
            desc: `挑戰 7 和 8 的完成上限增加 200 次。`,
            cost: E('e8e5'),
        },
        {
            desc: `鑭的效果強一倍。`,
            cost: E('e1.1e6'),
        },
        {
            desc: `塌縮恆星提升夸克獲得量。`,
            cost: E('e1.7e6'),
            effect() {
                let x = player.stars.points.add(1)
                return x.softcap('e3e15',0.85,2)
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `元級時間速度推遲 2x。`,
            cost: E('e4.8e6'),
        },
        {
            desc: `五次層計入塌縮恆星的質量獲得量提升公式內。`,
            cost: E('e3.6e7'),
        },
        {
            desc: `挑戰 7 和 8 的完成上限增加 200 次。`,
            cost: E('e6.9e7'),
        },
        {
            desc: `超新星推遲黑洞公式的軟限制。`,
            cost: E('e1.6e8'),
            effect() {
                let x = player.supernova.times.add(1).root(4)
                return x
            },
            effDesc(x) { return "推遲 ^"+format(x) },
        },
        {
            desc: `層便宜 15%。`,
            cost: E('e5.75e8'),
        },
        {
            desc: `超新星增加挑戰 5、6 和 8 的完成上限。`,
            cost: E('e1.3e9'),
            effect() {
                let x = player.supernova.times.mul(5)
                if (hasElement(79)) x = x.mul(tmp.qu.chroma_eff[2])
                return x
            },
            effDesc(x) { return "+"+format(x,0) },
        },
        {
            desc: `超級層的增幅弱 25%。`,
            cost: E('e2.6e9'),
        },
        {
            desc: `從原子力量的效果中移除 2 個軟限制。`,
            cost: E('e3.9e9'),
        },
        {
            desc: `塌縮恆星的效果強 25%。`,
            cost: E('e3.75e10'),
        },
        {
            desc: `質量軟限制^3 弱 17.5%。`,
            cost: E('e4e11'),
        },
        {
            desc: `元級超新星的增幅弱 20%。`,
            cost: E('e3.4e12'),
        },
        {
            desc: `中子元素-0 影響鋁-13 和鉭-73。`,
            cost: E('e4.8e12'),
        },
        {
            desc: `增強器和時間速度強 10x。`,
            cost: E('e1.4e13'),
        },
        {
            desc: `增強器 ^1.1。`,
            cost: E('e2.8e13'),
        },
        {
            desc: `鍶-38 強 3x。`,
            cost: E('e4e13'),
        },
        {
            desc: `大幅增強質量膨脹升級 2。`,
            cost: E('e3e14'),
        },
        {
            desc: `基於宇宙射線的免費時間速度，減弱極高級前質量升級的價格增幅。`,
            cost: E('e7e14'),
            effect() {
                let x = tmp.atom?E(0.9).pow(tmp.atom.atomicEff.add(1).log10().pow(2/3)):E(1)
                return x
            },
            effDesc(x) { return "弱 "+formatReduction(x)},
        },
        {
            desc: `增強器的軟限制推遲 3x，弱 10%。`,
            cost: E('e7.5e15'),
        },
        {
            desc: `時間速度力量軟限制推遲^2，增幅弱 50%。`,
            cost: E('e2e16'),
        },
        {
            desc: `大幅增強碳-6 的效果，但是鈉-11 失效。`,
            cost: E('e150'),
        },
        {
            desc: `所有時間速度增幅推遲 100x（在應用第 8 量子挑戰模組後）。`,
            cost: E('e500'),
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
        {
            desc: `未定。`,
            cost: EINF,
        },
    ],
    /*
    {
        desc: `未定。`,
        cost: EINF,
        effect() {
            let x = E(1)
            return x
        },
        effDesc(x) { return format(x)+"x" },
    },
    */
    getUnlLength() {
        let u = 4

        if (quUnl()) u = 77+3
        else {
            if (player.supernova.times.gte(1)) u = 49+5
            else {
                if (player.chal.comps[8].gte(1)) u += 14
                if (hasElement(18)) u += 3
                if (MASS_DILATION.unlocked()) u += 15
                if (STARS.unlocked()) u += 18
            }
            if (player.supernova.post_10) u += 3
            if (player.supernova.fermions.unl) u += 10
            if (tmp.radiation.unl) u += 10
        }
        if (PRIM.unl()) u += 3
        if (hasTree('unl3')) u += 3
        if (player.qu.rip.first) u += 32

        return u
    },
}

function hasElement(x) { return player.atom.elements.includes(x) }

function setupElementsHTML() {
    let elements_table = new Element("elements_table")
	let table = "<div class='table_center'>"
    let num = 0
	for (let i = 0; i < ELEMENTS.map.length; i++) {
		let m = ELEMENTS.map[i]
        if (m=='v') table += '</div><div class="table_center">'
        else if (m=='_' || !isNaN(Number(m))) table += `<div ${ELEMENTS.la[m]!==undefined?`id='element_la_${m}'`:""} style="width: 50px; height: 50px">${ELEMENTS.la[m]!==undefined?"<br>"+ELEMENTS.la[m]:""}</div>`
        else if (m=='x') {
            num++
            table += ELEMENTS.upgs[num]===undefined?`<div style="width: 50px; height: 50px"></div>`
            :`<button class="elements" id="elementID_${num}" onclick="ELEMENTS.buyUpg(${num}); ssf[0]('${ELEMENTS.names[num]}')" onmouseover="tmp.elements.choosed = ${num}" onmouseleave="tmp.elements.choosed = 0"><div style="font-size: 12px;">${num}</div>${ELEMENTS.names[num]}</button>`
            if (num==57 || num==89) num += 14
            else if (num==71) num += 18
            else if (num==118) num = 57
        }
	}
    table += "</div>"
	elements_table.setHTML(table)
}

function updateElementsHTML() {
    let ch = tmp.elements.choosed
    tmp.el.elem_ch_div.setVisible(ch>0)
    if (ch) {
        tmp.el.elem_desc.setTxt("["+ELEMENTS.fullNames[ch]+"] "+ELEMENTS.upgs[ch].desc)
        tmp.el.elem_cost.setTxt(format(ELEMENTS.upgs[ch].cost,0))
        tmp.el.elem_eff.setHTML(ELEMENTS.upgs[ch].effDesc?"目前："+ELEMENTS.upgs[ch].effDesc(tmp.elements.effect[ch]):"")
    }
    tmp.el.element_la_1.setVisible(tmp.elements.unl_length>57)
    tmp.el.element_la_3.setVisible(tmp.elements.unl_length>57)
    tmp.el.element_la_2.setVisible(tmp.elements.unl_length>88)
    tmp.el.element_la_4.setVisible(tmp.elements.unl_length>88)
    for (let x = 1; x <= tmp.elements.upg_length; x++) {
        let upg = tmp.el['elementID_'+x]
        if (upg) {
            upg.setVisible(x <= tmp.elements.unl_length)
            if (x <= tmp.elements.unl_length) {
                 upg.setClasses({elements: true, locked: !ELEMENTS.canBuy(x), bought: hasElement(x), br: x > 86})
            }
        }
    }
}

function updateElementsTemp() {
    if (!tmp.elements) tmp.elements = {
        upg_length: ELEMENTS.upgs.length-1,
        choosed: 0,
    }
    if (!tmp.elements.effect) tmp.elements.effect = [null]
    for (let x = tmp.elements.upg_length; x >= 1; x--) if (ELEMENTS.upgs[x].effect) {
        tmp.elements.effect[x] = ELEMENTS.upgs[x].effect()
    }
    tmp.elements.unl_length = ELEMENTS.getUnlLength()
}