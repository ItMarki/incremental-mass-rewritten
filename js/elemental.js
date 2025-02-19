const ELEMENTS = {
    map: [
        `x_________________xvxx___________xxxxxxvxx___________xxxxxxvxx_xxxxxxxxxxxxxxxxvxx_xxxxxxxxxxxxxxxxvxx1xxxxxxxxxxxxxxxxvxx2xxxxxxxxxxxxxxxxv_v__3xxxxxxxxxxxxxx__v__4xxxxxxxxxxxxxx__`,
    ],
    la: [null,'*','**','*','**'],
    exp: [0,118,218,362,558,814,1138],
    max_hsize: [19],
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
        '鈉','鎂','鋁','矽','磷','硫','氯','氬','鉀','鈣',
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
        if (tmp.c16active && isElemCorrupted(x)) return false
        let u = this.upgs[x]
        let res = u.inf ? player.inf.points : u.dark ? player.dark.shadow : player.atom.quarks
        return res.gte(u.cost) && !hasElement(x) && (hasInfUpgrade(6) && x <= 218 || player.qu.rip.active || !BR_ELEM.includes(x)) && (tmp.c16active || !C16_ELEM.includes(x)) && !tmp.elements.cannot.includes(x) && !(CHALS.inChal(14) && x < 118)
    },
    buyUpg(x) {
        if (this.canBuy(x)) {
            let u = this.upgs[x]

            if (u.inf) player.inf.points = player.inf.points.sub(u.cost)
            else if (u.dark) player.dark.shadow = player.dark.shadow.sub(u.cost)
            else player.atom.quarks = player.atom.quarks.sub(u.cost)
            player.atom.elements.push(x)

            if (x==230) {
                updateTheoremCore()
                updateTheoremInv()
            }

            if (x==251) {
                tmp.tab=8
                tmp.stab[8]=3
            }

            if (x==262) {
                tmp.tab=0
                tmp.stab[0]=0
                tmp.rank_tab=1
            }

            tmp.pass = 2
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
                return overflow(x.softcap(1e45,0.1,0),'e60000',0.5).min('ee6')
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
                let x
                if (hasElement(276)) {
                    x = E(1)
                    for (let i = 1; i <= CHALS.cols; i++) x = x.mul(player.chal.comps[i].add(1))
                    if (hasElement(7)) x = x.pow(elemEffect(7))
                    x = x.overflow('e1000',1/3)
                } else {
                    x = E(0)
                    for (let i = 1; i <= CHALS.cols; i++) x = x.add(player.chal.comps[i].mul(i>4?2:1))
                    if (hasElement(7)) x = x.mul(elemEffect(7))
                    if (hasElement(87)) x = E(1.01).pow(x).root(3)
                    else x = x.div(100).add(1).max(1)
                }
                return x
            },
            effDesc(x) { return hasElement(276) ? "^"+format(x) : formatMult(x) },
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
            desc: `每購買一個元素，矽的效果增加 2%。`,
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
                let x = overflow(hasElement(129) ? player.build.cosmic_ray.amt.pow(0.5).mul(0.02).add(1) : player.build.cosmic_ray.amt.pow(0.35).mul(0.01).add(1),1000,0.5)
                if (hasElement(18,1)) x = x.pow(muElemEff(18))
                return x
            },
            effDesc(x) { return "^"+format(x) },
        },
        {
            desc: `加強第 2 個中子效果。`,
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
                let x = E(1.25).pow(player.build.tickspeed.amt.pow(0.55))
                return x.min('ee11000')
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
            desc: `已購買的元素減弱困難挑戰的增幅。`,
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
                return overflow(x.softcap('ee27',0.95,2),"ee110",0.25)
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
            desc: `暴怒力量提升相對粒子獲得量。`,
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
            desc: `層減弱超級階增幅。`,
            cost: E(1e245),
            effect() {
                let x = E(0.9).pow(player.ranks.tetr.softcap(6,0.5,0))
                return x
            },
            effDesc(x) { return "弱 "+ format(E(1).sub(x).mul(100))+"%" },
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
            desc: `移除挑戰 2 和 6 的效果軟上限。`,
            cost: E(1e285),
        },
        {
            desc: `塌縮恆星提升膨脹質量獲得量。`,
            cost: E(1e303),
            effect() {
                let x = player.stars.points.add(1).pow(0.5)
                let y = hasPrestige(0,190)?player.stars.points.add(1).log10().add(1).log10().add(1):E(1)
                return [x.softcap('e4e66',0.95,2).min('eee3'),y]
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

                return x.min('ee3000')
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
                let x = BUILDINGS.eff('tickspeed','power').max(1).log10().div(10).max(1)
                if (hasElement(66)) x = x.pow(2)
                return x
            },
            effDesc(x) { return format(x)+"x" },
        },
        {
            desc: `階減弱極高級等級和時間速度增幅。`,
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
                let x
                x = hasElement(236) ? Decimal.pow(1.1,player.stars.points.add(1).log10().add(1).log10()) : overflow(player.stars.points.add(1).softcap('e3e15',0.85,2),'ee100',0.5)
                return x
            },
            effDesc(x) { return hasElement(236) ? "^"+format(x) : format(x)+"x" },
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
            desc: `宇宙射線的免費時間速度減弱極高級前質量升級的價格增幅。`,
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
                let s = player.supernova.times.overflow(1e8,0.5)
                if (!player.qu.rip.active) s = s.root(1.5)
                let x = E(1.1).pow(s)
                return x.softcap(player.qu.rip.active?'1e130':'1e308',0.01,0).min('e2e4')
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
                return x.min(1e4)
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
            desc: `每個粒子能量的第 1 個效果獲得過強指數提升。`,
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
                let x = tmp.prestiges.base.add(1).root(3)
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
            desc: `挑戰 7 的效果以 10% 的比率增加挑戰 9-12 的完成次數。`,
            cost: E("e9e24"),
            effect() {
                if (hasPrestige(2,25)) return E(0)
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
                let x = Decimal.pow(1.1,player.supernova.times.overflow(1e75,0.1).softcap(2e5,0.25,0))
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
            desc: `加強第 2 個暗影效果。進入暗界時保留第 118 個或以前的大撕裂元素。`,
            cost: E("1e27"),
        },{
            dark: true,
            desc: `解鎖挑戰 14。`,
            cost: E("1e32"),
        },{
            desc: `重置底數提升暗束獲得量。`,
            cost: E("e1.7e31"),
            effect() {
                let pb = tmp.prestiges.base
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
            desc: `夸克提升暗束獲得量。`,
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
                let x = Decimal.max(1,tmp.prestiges.baseExp.pow(1.5))
                return overflow(x,400,0.5)
            },
            effDesc(x) { return "^"+format(x)+x.softcapHTML(400) },
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
            desc: `第 2 個深淵之漬效果也適用於質量軟上限^7-8。這些上限弱 20%。`,
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
            cost: E("e2e69"),
        },{
            desc: `空間膨脹稍微更弱。`,
            cost: E("e4.7e70"),
        },{
            br: true,
            desc: `大幅增強 [m1] 的效果。`,
            cost: E("e4.20e69"), // nice
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
            desc: `第 5 個暗影效果稍微提升熵上限。`,
            cost: E("1e141"),
            effect() {
                let e = tmp.dark.shadowEff.en||E(1)
                let x = expMult(e,0.5)
                return x
            },
            effDesc(x) { return "x"+format(x) },
        },{
            desc: `元級等級的起點推遲奇異級等級增幅。`,
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
                return x.overflow('ee5',0.5,0)
            },
            effDesc(x) { return "x"+format(x) },
        },{
            desc: `第 1 個鈾砹混合體效果推遲超級五級階和六級階增幅。`,
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
                if (tmp.c16active) x = overflow(x,10,.5)
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
            desc: `第 1 個 Z0 玻色子效果稍微加強時間速度力量。`,
            cost: E("e3.5e92"),
            effect() {
                let x = tmp.bosons.effect.z_boson[0].add(1).log10().add(1).log10().add(1)
                return x
            },
            effDesc(x) { return "^"+format(x) },
        },{
            dark: true,
            desc: `暗物質每次到達一個數量級^2，所有有色物質的獲得量提升 10%。解鎖更多主升級。`,
            cost: E(1e303),
            effect() {
                let x = Decimal.pow(1.1,player.bh.dm.add(1).log10().add(1).log10())
                return x
            },
            effDesc(x) { return "x"+format(x) },
        },{
            desc: `第 1 個鈾砹混合體效果推遲奇異級等級和元級階，效率為 ^0.5。`,
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
            desc: `第 1 個粒子力量效果更強。`,
            cost: E("e1.6e94"),
        },{
            desc: `解鎖加速器，時間速度會提供指數加成，但是氬-18 和 150 號元素失效（在挑戰 15 裏除外）。`,
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
            desc: `解鎖加強增強器的第 4 個質量升級。`,
            cost: E("1e4.9e98"),
        },{
            desc: `提升器加強自己。`,
            cost: E("e4e99"),
            effect() {
                let m = player.build.mass_2.amt
                let x = m.add(10).log10().pow(0.8);

                if (hasElement(228)) x = x.mul(Decimal.pow(1.1,m.max(1).log10()))

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
                let x = player.build.mass_4.amt.pow(1.5).add(10).log10()

				return x
            },
            effDesc(x) { return "x"+format(x) },
        },{
            br: true,
            desc: `暗物質提升有色物質指數。`,
            cost: E("1e1.69e100"),
            effect() {
                let x = player.bh.dm.add(1).log10().add(1).log10().add(1).log10().div(10)

				return x
            },
            effDesc(x) { return "+^"+format(x) },
        },{
            br: true,
            desc: `第 2 個鈾砹混合體效果適用於六級階增幅，效果也更強。`,
            cost: E("1e1.67e103"),
        },{
            desc: `解鎖超·級別。`,
            cost: E('e2e111'),
        },{
            desc: `提重器加強自己。`,
            cost: E('e1.4e112'),
            effect() {
                let m = player.build.mass_1.amt
                let x = m.add(10).log10().pow(0.8);

                if (hasElement(245)) x = x.mul(Decimal.pow(1.1,m.max(1).log10()))

				return x
            },
            effDesc(x) { return "^"+format(x) },
        },{
            dark: true,
            desc: `FSS 推遲增強器溢出。`,
            cost: E('e710'),
            effect() {
                let x = player.dark.matters.final.pow(.8).add(2).pow(player.dark.matters.final)

				return x
            },
            effDesc(x) { return "推遲 x"+format(x) },
        },{
            br: true,
            desc: `元級等級稍微影響元級四級層的增幅起點，並加強 155 號元素。`,
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
            desc: `稍微加強 178 號元素。`,
            cost: E('e4.9e130'),
        },{
            dark: true,
            desc: `FSS 要求減少 20%。`,
            cost: E('1e1480'),
        },{
            desc: `解鎖挑戰 16。`,
            cost: E('e7e134'),
        },{
            desc: `進一步加強 [m1]。`,
            cost: E('e3e333'),
        },{
            dark: true,
            desc: `進一步加強打破膨脹升級 7。`,
            cost: E('e400000'),
        },{
            c16: true,
            desc: `超·級別的下一種級別的要求減少 5%。`,
            cost: E('e1e20'),
        },{
            inf: true,
            desc: `定理等級的軟上限推遲 +5 個。`,
            cost: E('1e13'),
        },{
            c16: true,
            desc: `改善腐化碎片獲得量的公式。`,
            cost: E('e1e23'),
        },{
            desc: `進一步加強第 45 個榮譽的效果。`,
            cost: E('e3e380'),
        },{
            inf: true,
            desc: `無限定理提升平行擠壓器力量。MCF 不再重置任何東西。`,
            cost: E('1e14'),
            effect() {
                let x = player.inf.theorem.div(20)
                return x
            },
            effDesc(x) { return "+"+format(x,2) },
        },{
            dark: true,
            desc: `FSS 提升量子碎片的底數。`,
            cost: E('e640000'),
            effect() {
                let x = player.dark.matters.final.div(10)
                if (hasElement(28,1)) x = x.pow(3)
                return x.add(1)
            },
            effDesc(x) { return "^"+format(x,1) },
        },{
            c16: true,
            desc: `有色物質指數在挑戰 16 外提升有色物質獲得量（該效果在挑戰 16 中有所不同）。`,
            cost: E('e1e25'),
            effect() {
                let x = tmp.matters.exponent.add(1).log10().div(20)
                if (tmp.c16active) x = x.mul(5)
                return x.add(1)
            },
            effDesc(x) { return (tmp.c16active?'':'指數')+"^"+format(x) },
        },{
            desc: `大幅加強 203 號元素。`,
            cost: E('ee448'),
        },{
            dark: true,
            desc: `將挑戰 16 的完成上限提升至 100 次。無限時保留挑戰 16 完成次數。`,
            cost: E('e810000'),
        },{
            inf: true,
            desc: `你可以將任何定理分解為碎片，它們會提供加成。`,
            cost: E('5e17'),
        },{
            c16: true,
            desc: `黑洞質量推遲質量溢出^1-2。`,
            cost: E('e1e26'),
            effect() {
                let x = player.bh.mass.add(10).log10().root(20)
                if (hasBeyondRank(6,12)) x = x.pow(3)
                return x
            },
            effDesc(x) { return "推遲 ^"+format(x) },
        },{
            inf: true,
            desc: `每秒獲得在挑戰 16 的最佳黑洞質量所對應的腐化碎片數量的 100%。`,
            cost: E('1.25e19'),
        },{
            desc: `超級平行擠壓器推遲 +25 個。`,
            cost: E('ee505'),
        },{
            dark: true,
            desc: `移除第 7 個深淵之漬獎勵的軟上限。`,
            cost: E('e1800000'),
        },{
            inf: true,
            desc: `每秒獲得無限時的最佳無限點數的 1%。定理等級的軟上限再次推遲 +5 個。`,
            cost: E('5e22'),
        },{
            desc: `鈥-67 的效果改為指數加成。`,
            cost: E('ee613'),
        },{
            c16: true,
            desc: `[ct5] 稍微更強。`,
            cost: E('e5e34'),
        },{
            dark: true,
            desc: `第 8 個深淵之漬獎勵更強。`,
            cost: E('e6e6'),
        },{
            inf: true,
            desc: `如果變為無限時你不選擇任何定理，所有可選擇的定理會分解為所對應碎片的 25%。`,
            cost: E('1e24'),
        },{
            inf: true,
            desc: `解鎖挑戰 17。`,
            cost: E('1e25'),
        },{
            c16: true,
            desc: `[ct10] 效果翻倍。`,
            cost: E('ee38'),
        },{
            desc: `如果目前定理等級大於任何核心定理的等級，則自動將該定理的等級改為目前定理等級。變為無限時保留 FVM。`,
            cost: E('ee888'),
        },{
            dark: true,
            desc: `移除五級層的所有增幅。第 1 個鈾砹混合體效果適用於等級，但它的效果會改變。`,
            cost: E('e9.2e6'),
        },{
            desc: `無限定理提升維度質量獲得量。它的公式稍微更好。`,
            cost: E('ee1155'),
            effect() {
                let x = hasElement(273) ? Decimal.pow(10,player.inf.theorem.pow(2)) : player.inf.theorem.add(1).tetrate(1.75)

                return x
            },
            effDesc(x) { return formatMult(x) },
        },{
            desc: `大幅增強 209 號元素。`,
            cost: E('ee1291'),
        },{
            dark: true,
            desc: `每擁有 2 個無限定理，超級 FSS 推遲 +1 個。`,
            cost: E('e4.15e7'),
            effect() {
                let x = player.inf.theorem.div(2).floor()
                return x
            },
            effDesc(x) { return "推遲 +"+format(x,0)+' 個' },
        },{
            c16: true,
            desc: `第 1 個 FSS 獎勵在挑戰 16 中稍微更強。`,
            cost: E('e2e55'),
        },{
            desc: `熵倍數不會推遲起點，而會減少價格。`,
            cost: E('ee1680'),
        },{
            dark: true,
            desc: `第 10 個深淵之漬獎勵的第 1 個軟上限稍微更弱。`,
            cost: E('e8.1e7'),
        },{
            desc: `W+ 玻色子提供指數加成。`,
            cost: E('ee2081'),
        },{
            inf: true,
            desc: `解鎖腐化恆星。`,
            cost: E('e35'),
        },{
            desc: `黑洞質量溢出^2 的指數 ^1.5。`,
            cost: E('ee2256'),
        },{
            inf: true,
            desc: `每秒獲得核心中定理能形成的碎片的 1%。`,
            cost: E('e41'),
        },{
            c16: true,
            desc: `移除 162 號元素的腐化。`,
            cost: E('e1e77'),
        },{
            dark: true,
            desc: `挑戰 17 的完成次數推遲超級平行擠壓器。`,
            cost: E('e1.9e8'),
            effect() {
                let x = (player.chal.comps[17]||E(0)).pow(2).div(4).floor()
                return x
            },
            effDesc(x) { return "推遲 +"+format(x,0)+' 個' },
        },{
            c16: true,
            desc: `加強有色物質的生產公式。`,
            cost: E('e1e92'),
        },{
            desc: `褪色物質推遲質量溢出^2。`,
            cost: E('e3e3003'),
            effect() {
                let x = overflow(tmp.matters.upg[12].eff.max(1),'ee3',0.5).root(4)
                if (tmp.c16active) x = x.log10().add(1)
                return x
            },
            effDesc(x) { return "推遲 ^"+format(x) },
        },{
            inf: true,
            desc: `解鎖挑戰 18。`,
            cost: E('e45'),
        },{
            desc: `加速器效果的軟上限稍微更弱。`,
            cost: E('ee6366'),
        },{
            dark: true,
            desc: `第 8 個深淵之漬獎勵在挑戰 16 中有效。`,
            cost: E('e1.3e10'),
        },{
            c16: true,
            desc: `挑戰 16 的完成上限增加 100 次。`,
            cost: E('ee219'),
        },{
            inf: true,
            desc: `解鎖星系重置。`,
            cost: E('e59'),
        },{
            desc: `無限前全局運行速度稍微影響星系重置資源。`,
            cost: E('ee7676'),
            effect() {
                let x = tmp.preInfGlobalSpeed.max(1).root(2)
                return x
            },
            effDesc(x) { return formatMult(x) },
        },{
            c16: true,
            desc: `重置質量的效果稍微影響增強器溢出^1-2。`,
            cost: E('ee294'),
            effect() {
                let x = GPEffect(1,E(1)).root(2)
                return x
            },
            effDesc(x) { return '弱 '+formatReduction(x) },
        },{
            inf: true,
            desc: `自動更新獲得的最佳無限點數。`,
            cost: E('e65'),
        },{
            dark: true,
            desc: `深淵之漬的第 10 個獎勵的妊神星稍微更弱。`,
            cost: E('e1.7e10'),
        },{
            c16: true,
            desc: `解鎖英勇，並自動購買升華。`,
            cost: E('ee347'),
        },{
            desc: `大幅加強牛頓、霍金和道爾頓定理.`,
            cost: E('ee7773'),
        },{
            c16: true,
            desc: `牛頓的第 5 種獎勵影響黑洞移除^2，但該效果在挑戰 16 中稍微更弱。`,
            cost: E('ee1745'),
            effect() {
                let x = theoremEff('mass',4)
                if (tmp.c16active) x = x.max(1).log10().add(1)
                return x
            },
            effDesc(x) { return "^"+format(x)+' later' },
        },{
            desc: `解鎖第 5 列主升級。`,
            cost: E('ee10333'),
        },{
            dark: true,
            desc: `挑戰 16 的完成上限增加 300 次。`,
            cost: E('e2.5e10'),
        },{
            inf: true,
            desc: `每擁有一個無限定理，元得分的軟上限推遲 x1.05。`,
            cost: E('1e94'),
            effect() {
                let x = Decimal.pow(1.05,player.inf.theorem)
                return x
            },
            effDesc(x) { return '推遲 '+formatMult(x) },
        },{
            desc: `244 號元素的公式更好。`,
            cost: E('ee17600'),
        },{
            dark: true,
            desc: `第 4 個暗影獎勵稍微影響超新星生產量。`,
            cost: E('e1.67e11'),
            effect() {
                let x = tmp.dark.shadowEff.sn||E(1)
                x = x.root(3)
                return x
            },
            effDesc(x) { return formatMult(x) },
        },{
            c16: true,
            desc: `超級 FVM 增幅弱 50%。`,
            cost: E('ee3500'),
        },{
            desc: `再次大幅加強碳-6 的效果。`,
            cost: E('ee19800'),
        },{
            c16: true,
            desc: `你可以在挑戰 16 外購買 FVM。`,
            cost: E('ee6170'),
        },{
            desc: `額外宇宙弦稍微加強自己的力量。`,
            cost: E('ee23500'),
            effect() {
                let x = tmp.build.cosmic_string.bonus.add(1).pow(0.75)
                return x
            },
            effDesc(x) { return "^"+format(x) },
        },{
            dark: true,
            desc: `塌縮恆星對超新星生產量的效果底數稍微更強。`,
            cost: E('e1.13e12'),
        },{
            inf: true,
            desc: `解鎖挑戰 19。`,
            cost: E('1e110'),
        },{
            desc: `超新星次數稍微提升星系重置的資源獲得量。`,
            cost: E('ee25400'),
            effect() {
                let x = expMult(player.supernova.times.add(1),0.5)
                return x
            },
            effDesc(x) { return formatMult(x) },
        },{
            c16: true,
            desc: `腐化碎片總數提升無限點數獲得量。`,
            cost: E('ee6700'),
            effect() {
                let x = player.dark.c16.totalS.add(10).log10()
                return x
            },
            effDesc(x) { return formatMult(x) },
        },{
            desc: `平行擠壓器效果升至 3x。`,
            cost: E('ee46000'),
        },{
            dark: true,
            desc: `FSS 提升升華底數的指數。`,
            cost: E('e3.24e12'),
            effect() {
                let x = player.dark.matters.final.root(2).div(100)
                return x
            },
            effDesc(x) { return "+"+format(x) },
        },{
            desc: `超級星系重置推遲 +1 個。`,
            cost: E('ee59000'),
        },{
            desc: `挑戰 16 的完成上限增加 500 次。`,
            cost: E('ee64600'),
        },{
            dark: true,
            desc: `褪色物質推遲等級塌縮。`,
            cost: E('e6.5e12'),
            effect() {
                let x = player.dark.matters.amt[12].add(1e10).log10().log10().pow(4/3)
                return x
            },
            effDesc(x) { return formatMult(x)+" later" },
        },{
            c16: true,
            desc: `挑戰 5 的獎勵效果翻倍。`,
            cost: E('ee23700'),
        },{
            desc: `維度質量的效果更強。`,
            cost: E('ee83000'),
        },{
            inf: true,
            desc: `解鎖挑戰 20。`,
            cost: E(Number.MAX_VALUE),
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

        if (tmp.inf_unl) u = 218
        else {
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
        }

        if (tmp.brokenInf) u += 12
        if (tmp.tfUnl) u += 12
        if (tmp.ascensions_unl) u += 9
        if (tmp.CS_unl) u += 7
        if (tmp.c18reward) u += 12
        if (tmp.fifthRowUnl) u += 20

        return u
    },
}

const MAX_ELEM_TIERS = 3

const BR_ELEM = (()=>{
    let x = []
    for (let i in ELEMENTS.upgs) if (i>86&&i<=118 || i>0&&ELEMENTS.upgs[i].br) x.push(Number(i))
    return x
})()

const C16_ELEM = (()=>{
    let x = []
    for (let i in ELEMENTS.upgs) if (i>0&&ELEMENTS.upgs[i].c16) x.push(Number(i))
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
    return x + " 號元素"
}

function WE(a,b) { return 2*(a**2-(a-b)**2) }

for (let x = 1; x <= MAX_ELEM_TIERS; x++) {
    let [ts,te] = [ELEMENTS.exp[x-1],ELEMENTS.exp[x]]

    if (x > 1) {
        ELEMENTS.max_hsize[x-1] = 11 + 4*x

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

    // Muonic Elements

    for (let y = ts+1; y <= te; y++) {
        if (!MUONIC_ELEM.upgs[y]) MUONIC_ELEM.upgs.push({
            desc: `待定。`,
            cost: EINF,
        })
    }
}

function isElemCorrupted(x,layer=0) { return layer == 0 && !tmp.elements.deCorrupt.includes(x) && CORRUPTED_ELEMENTS.includes(x) }

function hasElement(x,layer=0) { return player.atom[["elements","muonic_el"][layer]].includes(x) && !(tmp.c16active && isElemCorrupted(x)) }

function elemEffect(x,def=1) { return tmp.elements.effect[x]||def }

function buyElement(x,layer=player.atom.elemLayer) {
    if (layer == 0) ELEMENTS.buyUpg(x)
    else if (layer == 1) MUONIC_ELEM.buyUpg(x)
}

function setupElementsHTML() {
    let elements_table = new Element("elements_table")
	let table = ""
    let num = 0
    for (let k = 1; k <= MAX_ELEM_TIERS; k++) {
        let hs = `style="width: ${50*ELEMENTS.max_hsize[k-1]}px; margin: auto"`
        let n = 0, p = (k+3)**2*2, xs = ELEMENTS.exp[k-1], xe = ELEMENTS.exp[k]
        table += `<div id='elemTier${k}_div'><div ${hs}><div class='table_center'>`
        for (let i = 0; i < ELEMENTS.map[k-1].length; i++) {
            let m = ELEMENTS.map[k-1][i]
            if (m=='v') table += `</div><div class="table_center">`
            else if (m=='_' || !isNaN(Number(m))) table += `<div ${ELEMENTS.la[m]!==undefined&&k==1?`id='element_la_${m}'`:""} style="width: 50px; height: 50px">${ELEMENTS.la[m]!==undefined?"<br>"+ELEMENTS.la[m]:""}</div>`
            else if (m=='x') {
                num++
                table += ELEMENTS.upgs[num]===undefined?`<div style="width: 50px; height: 50px"></div>`
                :`<button class="elements ${num == 118 ? 'final' : ''}" id="elementID_${num}" onclick="buyElement(${num}); ssf[0]('${ELEMENTS.names[num]}')" onmouseover="tmp.elements.choosed = ${num}" onmouseleave="tmp.elements.choosed = 0">
                <div style="font-size: 12px;">${num}</div><sup class="muon-symbol"></sup>${ELEMENTS.names[num]}
                </button>`
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
        table += "</div></div></div>"
    }
	elements_table.setHTML(table)

    let elem_tier = new Element("elemTierDiv")
    table = ""

    for (let i = 1; i <= MAX_ELEM_TIERS; i++) {
        table += `
        <button class="btn" id="elemTier_btn${i}" onclick="player.atom.elemTier[player.atom.elemLayer] = ${i}">
            第 ${i} 階<br>
            <span style="font-size: 10px">[${ELEMENTS.exp[i-1]+1} - ${ELEMENTS.exp[i]}]</span>
        </button>
        `
    }

    elem_tier.setHTML(table)
}

function updateElementsHTML() {
    let tElem = tmp.elements, c16 = tmp.c16active
    let et = player.atom.elemTier, elayer = player.atom.elemLayer
    let infU7 = hasInfUpgrade(6)

    tmp.el.elemLayer.setDisplay(tmp.eaUnl)
    tmp.el.elemLayer.setHTML("元素層："+["普通","緲子"][elayer])

    tmp.el.elemTierDiv.setDisplay(tElem.max_tier[elayer]>1)

    let elem_const = [ELEMENTS,MUONIC_ELEM][elayer]

    let ch = tElem.choosed
    tmp.el.elem_ch_div.setVisible(ch>0)
    if (ch) {
        let eu = elem_const.upgs[ch]
        let res = [eu.inf?" 個無限點數":eu.dark?" 個暗影":" 個夸克",eu.cs?" 個腐化恆星":" 個奇異原子"][elayer]
        let eff = tElem[["effect","mu_effect"][elayer]]

        tmp.el.elem_desc.setHTML("<b>["+["","緲子"][elayer]+ELEMENTS.fullNames[ch]+"]</b> "+eu.desc)
        tmp.el.elem_desc.setClasses({sky: true, corrupted_text2: c16 && isElemCorrupted(ch,elayer)})
        tmp.el.elem_cost.setTxt(format(eu.cost,0)+res+(eu.c16?"（挑戰 16）":!infU7&&BR_ELEM.includes(ch)?"（大撕裂）":"")+(player.qu.rip.active&&tElem.cannot.includes(ch)?"（不能在大撕裂中購買）":""))
        tmp.el.elem_eff.setHTML(eu.effDesc?"目前："+eu.effDesc(eff[ch]):"")
    }

    for (let t = 1; t <= MAX_ELEM_TIERS; t++) {
        let unl = et[elayer] == t
        tmp.el["elemTier"+t+"_div"].setDisplay(unl)
        if (unl) {
            let unllen = tElem.unl_length[elayer]

            if (t == 1) {
                tmp.el.element_la_1.setVisible(unllen>56)
                tmp.el.element_la_3.setVisible(unllen>56)
                tmp.el.element_la_2.setVisible(unllen>88)
                tmp.el.element_la_4.setVisible(unllen>88)
            }

            let len = t > 1 ? tElem.te : tElem.upg_length

            for (let x = tElem.ts+1; x <= len; x++) {
                let upg = tmp.el['elementID_'+x]
                if (upg) {
                    let unl2 = x <= unllen
                    upg.setVisible(unl2)
                    if (unl2) {
                        let eu = elem_const.upgs[x]
                        upg.setClasses(
                            c16 && isElemCorrupted(x,elayer)
                            ?{elements: true, locked: true, corrupted: true}
                            :{elements: true, locked: !elem_const.canBuy(x), bought: hasElement(x,elayer), muon: elayer == 1, br: !infU7 && elayer == 0 && BR_ELEM.includes(x), final: elayer == 0 && x == 118, dark: elayer == 0 && eu.dark, c16: elayer == 0 && eu.c16, inf: elayer == 0 && eu.inf, cs: elayer == 1 && eu.cs}
                        )
                    }
                }
            }
        }

        tmp.el["elemTier_btn"+t].setDisplay(t <= tElem.max_tier[elayer])
    }
}

function updateElementsTemp() {
    let tElem = tmp.elements
    let et = player.atom.elemTier, elayer = player.atom.elemLayer

    tElem.ts = ELEMENTS.exp[et[elayer]-1]
    tElem.te = ELEMENTS.exp[et[elayer]]
    tElem.tt = tElem.te - tElem.ts

    let decor = []
    if (hasElement(10,1)) decor.push(187)
    if (hasCharger(9)) decor.push(40,64,67,150,199,200,204)
    if (hasElement(254)) decor.push(162)
    tElem.deCorrupt = decor

    let cannot = []
    if (player.qu.rip.active) {
        if (!hasElement(121)) cannot.push(58)
        if (!hasElement(126)) cannot.push(74)
    }
    tElem.cannot = cannot

    if (!tElem.upg_length) tElem.upg_length = ELEMENTS.upgs.length-1
    for (let x = tElem.upg_length; x >= 1; x--) if (ELEMENTS.upgs[x].effect) {
        tElem.effect[x] = ELEMENTS.upgs[x].effect()
    }

    tElem.unl_length = [ELEMENTS.getUnlLength(),MUONIC_ELEM.getUnlLength()]

    tElem.max_tier = [1,1]
    if (player.dark.unl) tElem.max_tier[0]++
    if (tmp.brokenInf) tElem.max_tier[0]++
}