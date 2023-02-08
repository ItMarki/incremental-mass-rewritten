const ELEMENTS = {
    map: [
        `x_________________xvxx___________xxxxxxvxx___________xxxxxxvxx_xxxxxxxxxxxxxxxxvxx_xxxxxxxxxxxxxxxxvxx1xxxxxxxxxxxxxxxxvxx2xxxxxxxxxxxxxxxxv_v__3xxxxxxxxxxxxxx__v__4xxxxxxxxxxxxxx__`,
    ],
    la: [null,'*','**','*','**'],
    exp: [0,118,218,362,558,814,1138],
    names: [
        null,
        'H','He','Li','Be','B','C','N','O','F','Ne',
        'Na','Mg','Al','Si','P','S','Cl','Ar','K','Ca',
        'Sc','Ti','V','Cr','Mn','Fe','Co','Ni','Cu','Zn',
        'Ga','Ge','As','Se','Br','Kr','Rb','Sr','Y','Zr',
        'Nb','Mo','Tc','Ru','Rh','Pd','Ag','Cd','In','Sn',
        'Sb','Te','I','Xe','Cs','Ba','La','Ce','Pr','Nd',
        'Pm','Sm','Eu','Gd','Tb','Dy','Ho','Er','Tm','Yb',
        'Lu','Hf','Ta','W','Re','Os','Ir','Pt','Au','Hg',
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
        '錀','鎶','鉨','鈇','鏌','鉝','鿬（⿰石田）','鿫（⿹气奧）'
    ],
    canBuy(x) {
        let res = this.upgs[x].dark ? player.dark.shadow : player.atom.quarks
        return res.gte(this.upgs[x].cost) && !hasElement(x) && (player.qu.rip.active ? true : !BR_ELEM.includes(x)) && !tmp.elements.cannot.includes(x) && !(CHALS.inChal(14) && x < 118)
    },
    buyUpg(x) {
        if (this.canBuy(x)) {
            if (this.upgs[x].dark) player.dark.shadow = player.dark.shadow.sub(this.upgs[x].cost)
            else player.atom.quarks = player.atom.quarks.sub(this.upgs[x].cost)
            player.atom.elements.push(x)

            tmp.pass = false
        }
    },
    upgs: [
        null,
        {
            desc: `加強夸克獲得量公式。`,
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
                let x
                if (hasPrestige(0,867)) {
                    x = player.atom?player.atom.powers[2].add(1).log10().add(1).log10().add(1).pow(1.5):E(1)
                } else {
                    x = player.atom?player.atom.powers[2].add(1).root(2):E(1)
                    if (x.gte('e1e4')) x = expMult(x.div('e1e4'),0.9).mul('e1e4')
                    x = overflow(x,'ee100',0.25).min('ee101')
                }

                return x
            },
            effDesc(x) { return hasPrestige(0,867) ? '^'+format(x) : format(x)+"x"+softcapHTML(x,'ee4') },
        },
        {
            desc: `質子力量加強增強器力量。`,
            cost: E(2.5e16),
            effect() {
                let x = player.atom?player.atom.powers[0].max(1).log10().pow(0.8).div(50).add(1):E(1)
                return x.softcap(1e45,0.1,0)
            },
            effDesc(x) { return "加強 "+format(x)+"x" },
        },
        {
            desc: `挑戰 7 的效果翻倍。`,
            cost: E(1e18),
        },
        {
            desc: `每完成一次挑戰，夸克獲得量增加 1%。`,
            cost: E(5e18),
            effect() {
                let x = E(0)
                for (let i = 1; i <= CHALS.cols; i++) x = x.add(player.chal.comps[i].mul(i>4?2:1))
                if (hasElement(7)) x = x.mul(tmp.elements.effect[7])
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
            desc: `挑戰 2 獎勵的軟上限減弱 75%。`,
            cost: E(1e21),
        },
        {
            desc: `層要求減弱 15%。`,
            cost: E(6.5e21),
        },
        {
            desc: `減弱挑戰 3 和 4 的增幅。`,
            cost: E(1e24),
        },
        {
            desc: `將氮的倍數平方。`,
            cost: E(1e27),
        },
        {
            desc: `加強每個原子力量的獲得量的公式。`,
            cost: E(1e29),
        },
        {
            desc: `每完成一次挑戰 7，挑戰 5 和 6 的完成上限增加 2 次。`,
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
                let x = hasElement(129) ? player.atom.gamma_ray.pow(0.5).mul(0.02).add(1) : player.atom.gamma_ray.pow(0.35).mul(0.01).add(1)
                return overflow(x,1000,0.5)
            },
            effDesc(x) { return "^"+format(x) },
        },
        {
            desc: `加強中子的第二個效果。`,
            cost: E(1e50),
        },
        {
            desc: `挑戰 7 的完成上限增加 50 次。`,
            cost: E(1e53),
        },
        {
            desc: `解鎖質量膨脹。`,
            cost: E(1e56),
        },
        {
            desc: `時間速度稍微提升膨脹質量獲得量。`,
            cost: E(1e61),
            effect() {
                let x = E(1.25).pow(player.tickspeed.pow(0.55))
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `加強原子力量的效果。`,
            cost: E(1e65),
        },
        {
            desc: `每秒獲得你會獲得的原子的 100%。原子力量稍微提升相對粒子獲得量。`,
            cost: E(1e75),
            effect() {
                let x = hasPrestige(0,40) ? player.atom.atomic.max(1).log10().add(1).log10().add(1).root(2) : player.atom.atomic.max(1).log10().add(1).pow(0.4)
                return x
            },
            effDesc(x) { return hasPrestige(0,40) ? "^"+format(x) : format(x)+"x" },
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
                return x.softcap('ee27',0.95,2)
            },
            effDesc(x) { return format(x)+"x"+x.softcapHTML('ee27') },
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
            desc: `從挑戰 2 和 6 的效果中移除軟上限。`,
            cost: E(1e285),
        },
        {
            desc: `塌縮恆星提升膨脹質量獲得量。`,
            cost: E(1e303),
            effect() {
                let x = player.stars.points.add(1).pow(0.5)
                let y = hasPrestige(0,190)?player.stars.points.add(1).log10().add(1).log10().add(1):E(1)
                return [x.softcap('e4e66',0.95,2),y]
            },
            effDesc(x) { return format(x[0])+"x"+(hasPrestige(0,190)?", ^"+format(x[1]):"") },
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

                x = overflow(x,'ee112',0.5)

                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `如果你已經購買某個質量膨脹升級，你就可以自動購買它。它們不再花費膨脹質量。`,
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
            desc: `質量軟上限^2 弱 10%。`,
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
                if (hasElement(66)) x = x.pow(2)
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
            desc: `應用軟上限後，粒子力獲得量乘以對應粒子數量的平方根。`,
            cost: E('e1.5e5'),
        },
        {
            desc: `每擁有一個超新星，極高級階推遲 3 階。`,
            cost: E('e2.5e5'),
            effect() {
                let x = player.supernova.times.mul(3)
                return x
            },
            effDesc(x) { return "推遲 " + format(x,0)+" 階" },
        },
        {
            desc: `非獎勵時間速度強 25x。`,
            cost: E('e3e5'),
        },
		{
            desc: `挑戰 3、4 和 8 的獎勵強 50%。`,
            cost: E('e5e5'),
        },
        {
            desc: `挑戰 7 和 8 的完成上限增加 200 次。`,
            cost: E('e8e5'),
        },
        {
            desc: `鑭的效果翻倍。`,
            cost: E('e1.1e6'),
        },
        {
            desc: `塌縮恆星提升夸克獲得量。`,
            cost: E('e1.7e6'),
            effect() {
                let x = player.stars.points.add(1)
                return overflow(x.softcap('e3e15',0.85,2),'ee100',0.5)
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
            desc: `超新星推遲黑洞公式的軟上限。`,
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
            desc: `從原子力量的效果中移除 2 個軟上限。`,
            cost: E('e3.9e9'),
        },
        {
            desc: `塌縮恆星的效果強 25%。`,
            cost: E('e3.75e10'),
        },
        {
            desc: `質量軟上限^3 弱 17.5%。`,
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
            desc: `增強器的軟上限推遲 3x，弱 10%。`,
            cost: E('e7.5e15'),
        },
        {
            desc: `時間速度力量軟上限推遲^2，增幅弱 50%。`,
            cost: E('e2e16'),
        },
        {
            desc: `大幅增強碳-6 的效果，但是鈉-11 失效。`,
            cost: E('e150'),
        },
        {
            desc: `所有時間速度增幅推遲 100x（在應用 QC 模組 8 後）。`,
            cost: E('e500'),
        },
        {
            desc: `黑洞質量效果稍微加強自己。`,
            cost: E('e1100'),
            effect() {
                let x = player.bh.mass.add(1).log10().add(1).log10().mul(1.25).add(1).pow(hasElement(201)||player.qu.rip.active?2:0.4)
                //if (player.qu.rip.active) x = x.softcap(100,0.1,0)
                return x
            },
            effDesc(x) { return "^"+x.format() },
        },
        {
            desc: `膨脹質量提升死亡碎片獲得量。`,
            cost: E('e1300'),
            effect() {
                let x = player.md.mass.add(1).log10().add(1).pow(0.5)
                return x
            },
            effDesc(x) { return "x"+x.format() },
        },
        {
            desc: `熵加速和加成的削弱弱 10%。`,
            cost: E('e2700'),
        },
        {
            desc: `超難挑戰增幅弱 25%。`,
            cost: E('e4800'),
        },
        {
            desc: `質量的指數每多一個數量級^2，熵獲得量增加 66.7%。`,
            cost: E('e29500'),
            effect() {
                let x = E(5/3).pow(player.mass.add(1).log10().add(1).log10())
                return x
            },
            effDesc(x) { return "x"+x.format() },
        },
        {
            desc: `每變成一次超新星，死亡碎片獲得量增加 10%。`,
            cost: E("e32000"),
            effect() {
                let s = player.supernova.times
                if (!player.qu.rip.active) s = s.root(1.5)
                let x = E(1.1).pow(s)
                return x
            },
            effDesc(x) { return "x"+x.format() },
        },
        {
            desc: `Ε 粒子在大撕裂中有效，但效果弱 90%。`,
            cost: E("e34500"),
        },
        {
            desc: `熵轉換受到的削弱弱 10%。`,
            cost: E('e202000'),
        },
        {
            desc: `熵蒸發的底數增加 1。`,
            cost: E('e8.5e6'),
        },
        {
            desc: `QC 模組 8 在大撕裂中弱 20%。`,
            cost: E('e1.2e7'),
        },
        {
            desc: `從光子升級 3 中移除軟上限^3，而且軟上限^2 更弱。`,
            cost: E('e2.15e7'),
        },
        {
            desc: `五級層對重置底數給予指數加成。`,
            cost: E('e2.5e7'),
            effect() {
                let pent = player.ranks.pent
                let x = hasElement(195) ? pent.softcap(2e5,0.25,0).root(1.5).div(400) : pent.root(2).div(1e3)
                return x.toNumber()
            },
            effDesc(x) { return "+^"+format(x) },
        },
        {
            desc: `大幅增強藍圖粒子。`,
            cost: E('e3.5e7'),
        },
        {
            desc: `時間速度力量的軟上限推遲 ^100。`,
            cost: E('e111111111'),
        },
        {
            desc: `榮耀加快量子前全局運行速度。`,
            cost: E('e5e8'),
            effect() {
                let b = E(2)
                if (player.prestiges[0].gte(70)) b = b.add(player.prestiges[1])
                let x = b.pow(player.prestiges[1])
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `挑戰 9-12 的完成上限增加 200 次。`,
            cost: E('e1.2e9'),
        },
        {
            desc: `每個粒子能量的第一個效果獲得過強指數提升。`,
            cost: E('e2.2e9'),
        },
        {
            desc: `熵蒸發^2 和濃縮^2 增幅弱 15%。`,
            cost: E('e7.25e9'),
        },
        {
            desc: `Β 粒子效果翻倍。`,
            cost: E('e1.45e10'),
        },
        {
            desc: `等級到五級層的所有增幅弱 10%（在大撕裂中則是 2%）。`,
            cost: E('e1.6e10'),
        },
        {
            desc: `熵倍數在大撕裂中有效。`,
            cost: E('e3e10'),
        },
        {
            desc: `質量軟上限^4 弱 50%（在大撕裂中則是 20%）。`,
            cost: E('e6e10'),
        },
        {
            desc: `中子星對原子獲得量給予指數加成。`,
            cost: E('e7.5e10'),
            effect() {
                let x = player.supernova.stars.add(1).log10().add(1).log10().add(1).root(3)
                return x
            },
            effDesc(x) { return "^"+format(x) },
        },
        {
            desc: `[sn4] 的效果增加 2。`,
            cost: E('e3e12'),
        },
        {
            desc: `加強 [bs2] 的公式。`,
            cost: E('e4e12'),
        },
        {
            desc: `加強熵倍數的公式。`,
            cost: E('e1.2e13'),
        },
        {
            desc: `質量膨脹升級強 5%。`,
            cost: E("e7e13"),
        },
        {
            desc: `重置底數提升相對能量獲得量。`,
            cost: E('e1e14'),
            effect() {
                let x = (tmp.prestiges.base||E(1)).add(1).root(3)
                return x
            },
            effDesc(x) { return "x"+format(x) },
        },
        {
            desc: `在應用「^5」前的所有軟上限後，質量獲得量獲得 ^10 的加成。`,
            cost: E("e5e16"),
        },
        {
            desc: `解鎖<span id="final_118">暗界</span>，你可以化身黑暗。`,
            cost: E("e1.7e17"),
        },
        {
            dark: true,
            desc: `量子前全局運行速度以對數比率提升暗影獲得量。`,
            cost: E("500"),
            effect() {
                let s = tmp.preQUGlobalSpeed||E(1)
                let x = hasPrestige(0,110) ? expMult(s,0.4) : s.max(1).log10().add(1)
                return x
            },
            effDesc(x) { return "x"+format(x) },
        },{
            dark: true,
            desc: `超難和魔王挑戰增幅弱 50%。`,
            cost: E("5000"),
        },{
            dark: true,
            desc: `你可以在大撕裂中購買鈰-58。`,
            cost: E("25000"),
        },{
            dark: true,
            desc: `你可以自動完成挑戰 9-11。開始大撕裂或量子挑戰時保留挑戰 12 的完成次數。`,
            cost: E("1e6"),
        },{
            br: true,
            desc: `你可以自動購買打破膨脹升級。它們不再花費相對質量。`,
            cost: E("ee19"),
        },{
            dark: true,
            desc: `進入暗界時保留量子樹。`,
            cost: E("1e7"),
        },{
            desc: `挑戰 7 的效果以 10% 比率增加挑戰 9-12 的完成次數。`,
            cost: E("e9e24"),
            effect() {
                let c = tmp.chal?tmp.chal.eff[7]:E(0)
                let x = c.div(10).ceil()
                return x
            },
            effDesc(x) { return "+"+format(x,0) },
        },{
            dark: true,
            desc: `你可以在大撕裂中購買鎢-74。`,
            cost: E("1e8"),
        },{
            dark: true,
            desc: `開始時解鎖打破膨脹。相對能量獲得量增加 10%。`,
            cost: E("1e9"),
        },{
            dark: true,
            desc: `你不在大撕裂中也可以購買原子升級 13-15。`,
            cost: E("1e11"),
        },{
            br: true,
            desc: `大幅增強氬-18，它可以增強黑洞壓縮器和宇宙射線力量。`,
            cost: E("e1.7e20"),
        },{
            br: true,
            desc: `熵增幅和熵輻射在大撕裂中有效。`,
            cost: E("e3e20"),
        },{
            dark: true,
            desc: `你可以自動完成挑戰 12。`,
            cost: E("e12"),
        },{
            dark: true,
            desc: `解鎖挑戰 13。你可以自動購買大撕裂升級。`,
            cost: E("e13"),
        },{
            desc: `加強挑戰 3、4 和 8 的效果。`,
            cost: E("e6.5e27"),
        },{
            desc: `超級重置等級和榮耀增幅弱 5%。`,
            cost: E("e1.5e29"),
        },{
            br: true,
            desc: `死亡碎片提升暗影獲得量。`,
            cost: E("e2.5e25"),
            effect() {
                let x = player.qu.rip.amt.add(1).log10().add(1)
                return x
            },
            effDesc(x) { return "x"+format(x,1) },
        },{
            dark: true,
            desc: `你不在大撕裂中也可以獲得相對能量。進入任何暗界挑戰時，你可以保留非生活質素部分的量子樹。`,
            cost: E("1e18"),
        },{
            desc: `超級和高級宇宙弦增幅弱 25%。`,
            cost: E("ee30"),
        },{
            br: true,
            desc: `超新星提升藍圖粒子獲得量。`,
            cost: E("e8.6e26"),
            effect() {
                let x = Decimal.pow(1.1,player.supernova.times.softcap(2e5,0.25,0))
                return x
            },
            effDesc(x) { return "x"+format(x,1) },
        },{
            dark: true,
            desc: `每秒獲得你會獲得的量子化的 100%。超新星提升量子化次數。`,
            cost: E("2e22"),
            effect() {
                let x = player.supernova.times.pow(1.25).add(1)
                return x
            },
            effDesc(x) { return "x"+format(x,1) },
        },{
            br: true,
            desc: `移除 10 次量子化里程碑的效果上限。`,
            cost: E("e2e27"),
        },{
            desc: `暗束獲得量 10x。`,
            cost: E("e1.5e30"),
        },{
            dark: true,
            desc: `移除 [奇] 和 [微中子] 的上限。`,
            cost: E("2e26"),
        },{
            dark: true,
            desc: `加強暗影的第二個效果。進入暗界時保留第 118 個或以前的大撕裂元素。`,
            cost: E("1e27"),
        },{
            dark: true,
            desc: `解鎖挑戰 14。`,
            cost: E("1e32"),
        },{
            desc: `重置底數提升暗束獲得量。`,
            cost: E("e1.7e31"),
            effect() {
                let pb = tmp.prestiges.base||E(1)
                let x = hasPrestige(0,218) ? Decimal.pow(10,pb.add(1).log10().root(2)) : pb.add(1).log10().add(1)
                return x.softcap(1e12,0.25,0)
            },
            effDesc(x) { return "x"+format(x)+softcapHTML(x,1e12) },
        },{
            br: true,
            desc: `已購買元素數量增加量子碎片的底數。`,
            cost: E("ee30"),
            effect() {
                let x = player.atom.elements.length/100
                return x
            },
            effDesc(x) { return "+"+format(x,2) },
        },{
            dark: true,
            desc: `你可以在大撕裂外獲得死亡碎片。你可以自動購買宇宙弦。`,
            cost: E("1e40"),
        },{
            br: true,
            desc: `大撕裂升級 7 在大撕裂外有效。`,
            cost: E("e2.6e30"),
        },{
            desc: `增強器效果的軟上限稍微更弱。`,
            cost: E("e4e45"),
        },{
            desc: `增強器效果的軟上限再次稍微更弱。時間速度的效果大幅增強。`,
            cost: E("ee54"),
        },{
            dark: true,
            desc: `挑戰 13 的完成上限增加 75 次。`,
            cost: E("1e68"),
        },{
            desc: `基於夸克，暗束獲得量提升。`,
            cost: E("e3.6e61"),
            effect() {
                let x = player.atom.quarks.add(1).log10().add(1).log10().add(1).pow(1.5)
                return x
            },
            effDesc(x) { return "x"+format(x) },
        },{
            br: true,
            desc: `重置底數指數提升深淵之漬獲得量。`,
            cost: E("e6e47"),
            effect() {
                let x = Math.max(1,tmp.prestiges.baseExp**1.5)
                return x
            },
            effDesc(x) { return "^"+format(x) },
        },{
            desc: `高級重置等級、層和五級層增幅弱 10%。`,
            cost: E("e5e64"),
        },{
            br: true,
            desc: `元級等級稍微影響元級階的增幅門檻。`,
            cost: E("e1.3e49"),
            effect() {
                let x = tmp.radiation.bs.eff[14].max(1).log10().add(1)
                if (hasElement(211)) x = x.pow(3)
                return x
            },
            effDesc(x) { return "推遲 x"+format(x) },
        },{
            dark: true,
            desc: `移除 [頂] 和 [緲微中子] 的階上限。`,
            cost: E("1e80"),
        },{
            dark: true,
            desc: `移除 [緲微中子] 的效果上限，如果它的效果大於 33%，則它會更強。`,
            cost: E("1e84"),
        },{
            br: true,
            desc: `元級時間速度增幅推遲 ^2。`,
            cost: E("e2.5e53"),
        },{
            desc: `深淵之漬的第二個效果也適用於質量軟上限^7-8。這些上限弱 20%。`,
            cost: E("e2.2e69"),
        },{
            br: true,
            desc: `增強器力量的軟上限更弱。`,
            cost: E("e2.9e61"),
        },{
            dark: true,
            desc: `解鎖黑暗試煉。進入暗界時保留 Og-118。`,
            cost: E("1e96"),
        },{
            desc: `塌縮恆星升級提供稍弱的指數倍數。它也可以影響黑洞質量獲得量，但是鈀-46、鎘-48、銩-69 和鋨-76 失效。`,
            cost: E("e4.20e69"), // nice
        },{
            desc: `空間膨脹稍微更弱。`,
            cost: E("e4.7e70"),
        },{
            br: true,
            desc: `大幅增強 [m1] 的效果。`,
            cost: E("e4.20e69"), // nice x2
        },{
            br: true,
            desc: `大幅增強 [rp1] 的效果。`,
            cost: E("e6.3e69"),
        },{
            br: true,
            desc: `再次大幅增強 [bh1] 的效果。`,
            cost: E("e2.27e70"),
        },{
            desc: `六級層和榮譽的要求稍微更弱。`,
            cost: E("e1.08e72"),
        },{
            dark: true,
            desc: `解鎖挑戰 15。`,
            cost: E("1e106"),
        },{
            desc: `移除兩個粒子力量的軟上限。`,
            cost: E("e2.35e72"),
        },{
            br: true,
            desc: `再次加強塌縮恆星的效果。`,
            cost: E("e1.7e72"),
        },{
            dark: true,
            desc: `挑戰 13 和 14 完成上限增加 100 次。`,
            cost: E("1e108"),
        },{
            br: true,
            desc: `移除 Ε 粒子的費米子獎勵的上限。`,
            cost: E("e1.24e73"),
        },{
            desc: `移除 [底] 的階上限。`,
            cost: E("e1.45e78"),
        },{
            desc: `中子元素-0 稍微影響超新星挑戰。`,
            cost: E("e1.51e78"),
        },{
            br: true,
            desc: `超級和高級重置等級增幅推遲 30 個。`,
            cost: E("e1.39e75"),
        },{
            desc: `超新星提升暗束獲得量。`,
            cost: E("e4.8e78"),
            effect() {
                let x = player.supernova.times.add(1).root(2)
                return x
            },
            effDesc(x) { return "x"+format(x) },
        },{
            dark: true,
            desc: `暗影的第五個效果稍微提升熵上限。`,
            cost: E("1e141"),
            effect() {
                let e = tmp.dark.shadowEff.en||E(1)
                let x = expMult(e,0.5)
                return x
            },
            effDesc(x) { return "x"+format(x) },
        },{
            desc: `基於元級等級的起點，奇異級等級增幅推遲。`,
            cost: E("e4.8e79"),
            effect() {
                if (!tmp.scaling_start.meta || !tmp.scaling_start.meta.rank) return E(1)
                let x = tmp.scaling_start.meta.rank.add(1).log10().add(1)
                if (hasElement(216)) x = x.pow(2)
                return x
            },
            effDesc(x) { return "推遲 x"+format(x) },
        },{
            br: true,
            desc: `每擁有一個重置等級，熵上限提升 25%。熵蒸發^2 稍微更弱。`,
            cost: E("e4.4e76"),
            effect() {
                let x = Decimal.pow(1.25,player.prestiges[0])
                return x
            },
            effDesc(x) { return "x"+format(x) },
        },{
            br: true,
            desc: `首 12 個挑戰的增幅弱 30%。`,
            cost: E("e2e77"),
        },{
            desc: `元級階推遲 x10。`,
            cost: E("e1.2e84"),
        },{
            desc: `應用軟上限後，塌縮恆星獲得量 ^10。`,
            cost: E("e3.2e84"),
        },{
            br: true,
            desc: `熵提升暗束獲得量。`,
            cost: E("e9.5e80"),
            effect() {
                let x = Decimal.pow(1.1,player.qu.en.amt.add(1).log10().pow(.9))
                return x
            },
            effDesc(x) { return "x"+format(x) },
        },{
            desc: `鈾砹混合體的第一個效果推遲超級五級階和六級階增幅。`,
            cost: E("e3e85"),
            effect() {
                let x = tmp.qu.chroma_eff[1][0].max(1).log10().div(2).add(1)
                return x
            },
            effDesc(x) { return "x"+format(x) },
        },{
            dark: true,
            desc: `熵的上限變為溢出軟上限。`,
            cost: E("e200"),
        },{
            br: true,
            desc: `挑戰 13-15 的完成上限增加 100 次。`,
            cost: E("e7.3e86"),
        },{
            desc: `重置底數推遲黑洞溢出。`,
            cost: E("e2e90"),
            effect() {
                let x = Decimal.pow(2,tmp.prestiges.base.max(1).log10().root(2))
                return x
            },
            effDesc(x) { return "推遲 ^"+format(x) },
        },{
            dark: true,
            desc: `解鎖有色物質。`,
            cost: E(1e250),
        },{
            br: true,
            desc: `暗物質提升深淵之漬獲得量。極高級質量升級推遲 ^1.5。`,
            cost: E("e8.8e89"),
            effect() {
                let x = player.bh.dm.add(1).log10().add(1)
                return x
            },
            effDesc(x) { return "x"+format(x) },
        },{
            desc: `賦色子獲得量 ^1.1。`,
            cost: E("e1.8e91"),
        },{
            desc: `Z0 玻色子的第一個效果稍微加強時間速度力量。`,
            cost: E("e3.5e92"),
            effect() {
                let x = tmp.bosons.effect.z_boson[0].add(1).log10().add(1).log10().add(1)
                return x
            },
            effDesc(x) { return "^"+format(x) },
        },{
            dark: true,
            desc: `暗物質每次到達一個 OoM^2，所有有色物質的獲得量提升 10%。解鎖更多主升級。`,
            cost: E(1e303),
            effect() {
                let x = Decimal.pow(1.1,player.bh.dm.add(1).log10().add(1).log10())
                return x
            },
            effDesc(x) { return "x"+format(x) },
        },{
            desc: `鈾砹混合體的第一個效果推遲奇異級等級和元級階，效率為 ^0.5。`,
            cost: E("e3.3e93"),
            effect() {
                let x = tmp.qu.chroma_eff[1][0].max(1).root(2)
                return x
            },
            effDesc(x) { return "推遲 x"+format(x) },
        },{
            dark: true,
            desc: `進入黑暗時保留級別。超級和高級重置等級推遲 x2。`,
            cost: E('e360'),
        },{
            desc: `鐨-100 稍微更強。你可以自動購買所有有色物質的升級。`,
            cost: E("e1.2e94"),
        },{
            br: true,
            desc: `挑戰 13-14 的完成上限增加 200 次。`,
            cost: E("e7.7e92"),
        },{
            dark: true,
            desc: `奇異級等級和極高級重置等級增幅弱 10%。`,
            cost: E('e435'),
        },{
            desc: `粒子力量的第一個效果更強。`,
            cost: E("e1.6e94"),
        },{
            desc: `解鎖加速器，時間速度會提供指數加成，但是氬-18 和第 150 個元素失效（在挑戰 15 裏除外）。`,
            cost: E("e8.6e95"),
        },{
            br: true,
            desc: `挑戰 15 的效果影響黑洞溢出的起點。`,
            cost: E("1e2.6e97"),
        },{
            desc: `黑洞效果對質量提供指數加成。錒-89 在大撕裂外更強。`,
            cost: E("e3.65e99"),
        },{
            br: true,
            desc: `解鎖加強增強器的第四個質量升級。`,
            cost: E("1e4.9e98"),
        },{
            desc: `提升器加強自己。`,
            cost: E("e4e99"),
            effect() {
                let x = (player.massUpg[2]||E(0)).add(10).log10().pow(0.8);

				return x
            },
            effDesc(x) { return "^"+format(x) },
        },{
            dark: true,
            desc: `光子和膠子升級 1 和 3 提供指數加成。進入黑暗時保留大撕裂升級。`,
            cost: E('e605'),
        },{
            desc: `過強器稍微提升加速器力量。`,
            cost: E("e4.2e101"),
            effect() {
                let x = (player.massUpg[4]||E(1)).pow(1.5).add(10).log10()

				return x
            },
            effDesc(x) { return "x"+format(x) },
        },{
            br: true,
            desc: `暗物質提升有色物質指數。`,
            cost: E("1e1.69e100"),
            effect() {
                let x = player.bh.dm.add(1).log10().add(1).log10().add(1).log10().div(10)

				return x.toNumber()
            },
            effDesc(x) { return "+^"+format(x) },
        },{
            br: true,
            desc: `鈾砹混合體的第二個效果使用於六級階增幅，效果也更強。`,
            cost: E("1e1.67e103"),
        },{
            desc: `解鎖超·級別。`,
            cost: E('e2e111'),
        },{
            desc: `提重器加強自己。`,
            cost: E('e1.4e112'),
            effect() {
                let x = (player.massUpg[1]||E(0)).add(10).log10().pow(0.8);

				return x
            },
            effDesc(x) { return "^"+format(x) },
        },{
            dark: true,
            desc: `FSS 推遲增強器溢出。`,
            cost: E('e710'),
            effect() {
                let x = E(2+player.dark.matters.final**.8).pow(player.dark.matters.final)

				return x
            },
            effDesc(x) { return "推遲 x"+format(x) },
        },{
            br: true,
            desc: `元級等級稍微影響元級四級層的增幅門檻，並加強第 155 個元素。`,
            cost: E("1e5e110"),
            effect() {
                let x = tmp.radiation.bs.eff[14].max(1).log10().add(1)
                return x
            },
            effDesc(x) { return "推遲 x"+format(x) },
        },{
            br: true,
            desc: `奇異級超新星增幅弱 25%。`,
            cost: E("1e1.6e117"),
        },{
            dark: true,
            desc: `[底] 的效果更好，而且沒有上限。光子升級 4 提供指數加成。`,
            cost: E('e1024'),
        },{
            desc: `大幅增強熵倍數。`,
            cost: E('e2.6e127'),
        },{
            br: true,
            desc: `熵蒸發^2 和熵濃縮^2 增幅弱 15%。`,
            cost: E('e3.1e123'),
        },{
            desc: `稍微加強第 178 個元素。`,
            cost: E('e4.9e130'),
        },{
            dark: true,
            desc: `天樞碎片要求減少 20%。`,
            cost: E('1e1480'),
        },{
            desc: `解鎖挑戰 16。（尚未開發）`,
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

        if (player.dark.unl) u = 118+14
        else {
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
            if (player.qu.rip.first) u += 9
            if (hasUpgrade("br",9)) u += 23 // 23
        }
        if (tmp.chal13comp) u += 10 + 2
        if (tmp.chal14comp) u += 6 + 11
        if (tmp.chal15comp) u += 16 + 4
        if (tmp.darkRunUnlocked) u += 7
        if (tmp.matterUnl) u += 14
        if (tmp.mass4Unl) u += 6
        if (tmp.brUnl) u += 10

        return u
    },
}

const MAX_ELEM_TIERS = 2

const BR_ELEM = (()=>{
    let x = []
    for (let i in ELEMENTS.upgs) if (i>86&&i<=118 || i>0&&ELEMENTS.upgs[i].br) x.push(Number(i))
    return x
})()

function getElementId(x) {
    let log = Math.floor(Math.log10(x))
    let list = ["n", "u", "b", "t", "q", "p", "h", "s", "o", "e"]
    let r = ""
    for (var i = log; i >= 0; i--) {
        let n = Math.floor(x / Math.pow(10, i)) % 10
        if (r == "") r = list[n].toUpperCase()
        else r += list[n]
    }
    return r
}

function getElementName(x) {
    if (x <= 118) return ELEMENTS.fullNames[x]
    return "第 " + x + " 個元素"
}

function WE(a,b) { return 2*(a**2-(a-b)**2) }

for (let x = 2; x <= MAX_ELEM_TIERS; x++) {
    let [ts,te] = [ELEMENTS.exp[x-1],ELEMENTS.exp[x]]

    let m = 'xx1xxxxxxxxxxxxxxxxvxx2xxxxxxxxxxxxxxxxv_v'

    for (let y = x; y >= 1; y--) {
        let k = 10 + 4 * y
        m += "1"+'x'.repeat(k)+"v"
        m += "2"+'x'.repeat(k)
        if (y > 1) m += "v_v"
    }

    for (let y = ts+1; y <= te; y++) {
        ELEMENTS.names.push(getElementId(y))
        ELEMENTS.fullNames.push(getElementName(y))
        if (!ELEMENTS.upgs[y]) ELEMENTS.upgs.push({
            desc: `待定。`,
            cost: EINF,
        })
    }

    ELEMENTS.map.push(m)
}

function hasElement(x) { return player.atom.elements.includes(x) }

function elemEffect(x,def=1) { return tmp.elements.effect[x]||def }

function setupElementsHTML() {
    let elements_table = new Element("elements_table")
	let table = ""
    let num = 0
    for (let k = 1; k <= MAX_ELEM_TIERS; k++) {
        let n = 0, p = (k+3)**2*2, xs = ELEMENTS.exp[k-1], xe = ELEMENTS.exp[k]
        table += `<div id='elemTier${k}_div'><div class='table_center'>`
        for (let i = 0; i < ELEMENTS.map[k-1].length; i++) {
            let m = ELEMENTS.map[k-1][i]
            if (m=='v') table += '</div><div class="table_center">'
            else if (m=='_' || !isNaN(Number(m))) table += `<div ${ELEMENTS.la[m]!==undefined&&k==1?`id='element_la_${m}'`:""} style="width: 50px; height: 50px">${ELEMENTS.la[m]!==undefined?"<br>"+ELEMENTS.la[m]:""}</div>`
            else if (m=='x') {
                num++
                table += ELEMENTS.upgs[num]===undefined?`<div style="width: 50px; height: 50px"></div>`
                :`<button class="elements ${num == 118 ? 'final' : ''}" id="elementID_${num}" onclick="ELEMENTS.buyUpg(${num}); ssf[0]('${ELEMENTS.names[num]}')" onmouseover="tmp.elements.choosed = ${num}" onmouseleave="tmp.elements.choosed = 0"><div style="font-size: 12px;">${num}</div>${ELEMENTS.names[num]}</button>`
                if (k == 1) {
                    if (num==56 || num==88) num += 14
                    else if (num==70) num += 18
                    else if (num==118) num = 56
                    else if (num==102) num = 118
                } else {
                    //console.log(num,p)
                    if (n == 0) {
                        if (num == xs + 2 || num == xs + p + 2) num += p - 18
                        else if (num == xe) {
                            num = xs + 2
                            n++
                        }
                    } else {
                        if (num == xs + WE(k+3,n) + 2) num = xs + p + WE(k+3,n-1) + 2
                        else if (num == xe - 16) num = xe
                        else if (num == xs + p + WE(k+3,n) + 2) {
                            num = xs + WE(k+3,n) + 2
                            n++
                        }
                    }
                }
            }
        }
        table += "</div></div>"
    }
	elements_table.setHTML(table)
}

function updateElementsHTML() {
    let tElem = tmp.elements

    tmp.el.elemTierDiv.setDisplay(player.dark.unl)
    tmp.el.elemTier.setHTML("元素第 "+player.atom.elemTier + " 階")

    let ch = tElem.choosed
    tmp.el.elem_ch_div.setVisible(ch>0)
    if (ch) {
        let eu = ELEMENTS.upgs[ch]
        let res = eu.dark?" 個暗影":" 個夸克"

        tmp.el.elem_desc.setHTML("<b>["+ELEMENTS.fullNames[ch]+"]</b> "+eu.desc)
        tmp.el.elem_cost.setTxt(format(eu.cost,0)+res+(BR_ELEM.includes(ch)?"（大撕裂）":"")+(player.qu.rip.active&&tElem.cannot.includes(ch)?"（不能在大撕裂中購買）":""))
        tmp.el.elem_eff.setHTML(eu.effDesc?"目前："+eu.effDesc(tElem.effect[ch]):"")
    }

    for (let x = 1; x <= MAX_ELEM_TIERS; x++) {
        let unl = player.atom.elemTier == x
        tmp.el["elemTier"+x+"_div"].setDisplay(unl)
        if (unl) {
            if (x == 1) {
                tmp.el.element_la_1.setVisible(tElem.unl_length>56)
                tmp.el.element_la_3.setVisible(tElem.unl_length>56)
                tmp.el.element_la_2.setVisible(tElem.unl_length>88)
                tmp.el.element_la_4.setVisible(tElem.unl_length>88)
            }

            let len = x > 1 ? tElem.te : tElem.upg_length

            for (let x = tElem.ts+1; x <= len; x++) {
                let upg = tmp.el['elementID_'+x]
                if (upg) {
                    let unl2 = x <= tElem.unl_length
                    upg.setVisible(unl2)
                    if (unl2) {
                        let eu = ELEMENTS.upgs[x]
                        upg.setClasses({elements: true, locked: !ELEMENTS.canBuy(x), bought: hasElement(x), br: BR_ELEM.includes(x), final: x == 118, dark: eu.dark})
                    }
                }
            }
        }
    }
}

function updateElementsTemp() {
    tmp.elements.ts = ELEMENTS.exp[player.atom.elemTier-1]
    tmp.elements.te = ELEMENTS.exp[player.atom.elemTier]
    tmp.elements.tt = tmp.elements.te - tmp.elements.ts

    let cannot = []
    if (player.qu.rip.active) {
        if (!hasElement(121)) cannot.push(58)
        if (!hasElement(126)) cannot.push(74)
    }
    tmp.elements.cannot = cannot

    if (!tmp.elements.upg_length) tmp.elements.upg_length = ELEMENTS.upgs.length-1
    for (let x = tmp.elements.upg_length; x >= 1; x--) if (ELEMENTS.upgs[x].effect) {
        tmp.elements.effect[x] = ELEMENTS.upgs[x].effect()
    }
    tmp.elements.unl_length = ELEMENTS.getUnlLength()
}