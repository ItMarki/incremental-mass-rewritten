const ASCENSIONS = {
    names: ['ascension','transcension'],
    fullNames: ["升華",'超越'],
    resetName: ['升華','超越'],
    baseExponent() {
        let x = E(0)

        if (hasElement(44,1)) x = x.add(muElemEff(44,0))

        x = x.add(1)

        return x
    },
    base() {
        let x = E(1)

        for (let i = 0; i < PRESTIGES.names.length; i++) {
            let r = player.prestiges[i]
            x = x.mul(r.add(1).ln().add(1))
        }

        return x.sub(1)
    },
    req(i) {
        let x = EINF, fp = this.fp(i), y = player.ascensions[i]
        switch (i) {
            case 0:
                x = Decimal.pow(1.1,y.div(fp).pow(1.1)).mul(1600)
                break;
            case 1:
                    x = y.div(fp).pow(1.1).mul(2).add(6)
                    break;
            default:
                x = EINF
                break;
        }
        return x.ceil()
    },
    bulk(i) {
        let x = E(0), y = i==0?tmp.ascensions.base:player.ascensions[i-1], fp = this.fp(i)
        switch (i) {
            case 0:
                if (y.gte(1600)) x = y.div(1600).max(1).log(1.1).max(0).root(1.1).mul(fp).add(1)
                break;
            case 1:
                    if (y.gte(6)) x = y.sub(6).div(2).root(1.1).mul(fp).add(1)
                    break;
            default:
                x = E(0)
                break;
        }
        return x.floor()
    },
    fp(i) {
        let fp = 1
        return fp
    },
    unl: [
        ()=>true,
        ()=>tmp.c18reward,
    ],
    noReset: [
        ()=>false,
        ()=>false,
    ],
    autoUnl: [
        ()=>false,
        ()=>false,
    ],
    autoSwitch(x) { player.auto_asc[x] = !player.auto_asc[x] },
    rewards: [
        {
            1: `時間速度和各質量升級的加成（除了過強器）會以乘法疊加效果。道爾頓定理更強。`,
            2: `元費米子推遲 ^2。`,
            3: `大撕裂升級 19 效果翻倍，並移除不穩定黑洞效果的溢出。`,
            4: `每擁有一個升華，K 介子和 π 介子獲得量提升至 5 倍。`,
            7: `移除膨脹質量的溢出。`,
            13: `移除原子力量的溢出。`,
            15: `移除奇異級等級、奇異級階，以及超級和高級六級層。`,
        },{
            1: `重置底數的指數翻倍。大撕裂升級 19 會影響聲望。`,
            2: `超級無限定理弱 10%。`,
            3: `超級和高級過強器推遲 +50 個。`,
            4: `元級重置等級推遲 2x。`,
        },
    ],
    rewardEff: [
        {
            4: [
                ()=>{
                    let x = Decimal.pow(5,player.ascensions[0])

                    return x
                },
                x=>formatMult(x),
            ],
        },{

        },
    ],
    reset(i, bulk = false) {
        let b = this.bulk(i)
        if (i==0?tmp.ascensions.base.gte(tmp.ascensions.req[i]):player.ascensions[i-1].gte(tmp.ascensions.req[i])) if (!bulk || b.gt(player.ascensions[i]) ) {
            if (bulk) player.ascensions[i] = b
            else player.ascensions[i] = player.ascensions[i].add(1)

            if (!this.noReset[i]()) {
                for (let j = i-1; j >= 0; j--) {
                    player.ascensions[j] = E(0)
                }
                INF.doReset()
            }

            updateRanksTemp()
        }
    },
}

function hasAscension(i,x) { return player.ascensions[i].gte(x) }
function ascensionEff(i,x,def=1) { return tmp.ascensions.eff[i][x]||def }

function setupAscensionsHTML() {
    let new_table = new Element("asc_table")
	table = ""
	for (let x = 0; x < ASCENSIONS.names.length; x++) {
		table += `<div style="width: 300px" id="asc_div_${x}">
			<button id="asc_auto_${x}" class="btn" style="width: 80px;" onclick="ASCENSIONS.autoSwitch(${x})">關閉</button>
			第 <h4 id="asc_amt_${x}">X</h4> 個<span id="asc_scale_${x}""></span>${ASCENSIONS.fullNames[x]} <br><br>
			<button onclick="ASCENSIONS.reset(${x})" class="btn reset" id="asc_${x}">
				${ASCENSIONS.resetName[x]}（強制執行無限重置），但你會${ASCENSIONS.fullNames[x]}。<span id="asc_desc_${x}"></span><br>
				要求：<span id="asc_req_${x}">X</span>
			</button>
		</div>`
	}
	new_table.setHTML(table)

    new_table = new Element("asc_rewards_table")
	table = ""
	for (let x = 0; x < ASCENSIONS.names.length; x++) {
		table += `<div id="asc_reward_div_${x}">`
		let keys = Object.keys(ASCENSIONS.rewards[x])
		for (let y = 0; y < keys.length; y++) {
			table += `<span id="asc_reward_${x}_${y}"><b>第 ${keys[y]} 個${ASCENSIONS.fullNames[x]}：</b> ${ASCENSIONS.rewards[x][keys[y]]}${ASCENSIONS.rewardEff[x][keys[y]]?`目前：<span id='asc_eff_${x}_${y}'></span>`:""}</span><br>`
		}
		table += `</div>`
	}
	new_table.setHTML(table)
}

function updateAscensionsHTML() {
    tmp.el.asc_base.setHTML(`${tmp.ascensions.baseMul.format(0)}<sup>${format(tmp.ascensions.baseExp)}</sup> = ${tmp.ascensions.base.format(0)}`)

    for (let x = 0; x < ASCENSIONS.names.length; x++) {
        let unl = ASCENSIONS.unl[x]?ASCENSIONS.unl[x]():true
        tmp.el["asc_div_"+x].setDisplay(unl)
        if (unl) {
            let p = player.ascensions[x] || E(0)
            let keys = Object.keys(ASCENSIONS.rewards[x])
            let desc = ""
            for (let i = 0; i < keys.length; i++) {
                if (p.lt(keys[i]) && (tmp.chal13comp || p.lte(Infinity))) {
                    desc = `在第 ${format(keys[i],0)} 個${ASCENSIONS.fullNames[x]}，${ASCENSIONS.rewards[x][keys[i]]}`
                    break
                }
            }
            tmp.el["asc_scale_"+x].setTxt(getScalingName("ascension"+x))
            tmp.el["asc_amt_"+x].setTxt(format(p,0))
            tmp.el["asc_"+x].setClasses({btn: true, reset: true, locked: x==0?tmp.ascensions.base.lt(tmp.ascensions.req[x]):player.ascensions[x-1].lt(tmp.ascensions.req[x])})
            tmp.el["asc_desc_"+x].setTxt(desc)
            tmp.el["asc_req_"+x].setTxt(x==0?"升華底數到達 "+format(tmp.ascensions.req[x],0):"第 "+format(tmp.ascensions.req[x],0)+" 個"+ASCENSIONS.fullNames[x-1])
            tmp.el["asc_auto_"+x].setDisplay(ASCENSIONS.autoUnl[x]())
            tmp.el["asc_auto_"+x].setTxt(player.auto_pres[x]?"開啟":"關閉")
        }
    }
}

function updateAscensionsTemp() {
    tmp.ascensions.baseMul = ASCENSIONS.base()
    tmp.ascensions.baseExp = ASCENSIONS.baseExponent()
    tmp.ascensions.base = tmp.ascensions.baseMul.pow(tmp.ascensions.baseExp)
    for (let x = 0; x < ASCENSIONS.names.length; x++) {
        tmp.ascensions.req[x] = ASCENSIONS.req(x)
        for (let y in ASCENSIONS.rewardEff[x]) {
            if (ASCENSIONS.rewardEff[x][y]) tmp.ascensions.eff[x][y] = ASCENSIONS.rewardEff[x][y][0]()
        }
    }
}

function updateAscensionsRewardHTML() {
	let c16 = tmp.c16active
	// tmp.el["asc_reward_name"].setTxt(ASCENSIONS.fullNames[player.asc_reward])
	for (let x = 0; x < ASCENSIONS.names.length; x++) {
		tmp.el["asc_reward_div_"+x].setDisplay(player.asc_reward == x)
		if (player.asc_reward == x) {
			let keys = Object.keys(ASCENSIONS.rewards[x])
			for (let y = 0; y < keys.length; y++) {
				let unl = player.ascensions[x].gte(keys[y])
				tmp.el["asc_reward_"+x+"_"+y].setDisplay(unl)
				if (unl) {
					tmp.el["asc_reward_"+x+"_"+y].setClasses({corrupted_text2: false})
					if (tmp.el["asc_eff_"+x+"_"+y]) {
						let eff = ASCENSIONS.rewardEff[x][keys[y]]
						tmp.el["asc_eff_"+x+"_"+y].setHTML(eff[1](tmp.ascensions.eff[x][keys[y]]))
					}
				}
			}
		}
	}
}