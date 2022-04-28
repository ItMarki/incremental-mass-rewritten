const ENTROPY = {
    ids: ['eth','hr'],
    switch(x) {
        let i = this.ids[x]
        player.qu.en[i][0] = !player.qu.en[i][0]
        if (!player.qu.en[i][0]) {
            player.qu.en[i][3] = 0
            player.qu.en[i][2] = player.qu.en[i][2].max(player.qu.en[i][1])
            player.qu.en[i][1] = E(0)
        }
    },
    gain() {
        let x = tmp.en.eff.eth
        return x
    },
    cap() {
        let x = tmp.en.eff.hr
        return x
    },
    evaGain(i) {
        let x = E(1).mul(player.qu.en[this.ids[i]][3]+1).mul(getEnRewardEff(2))
        return x
    },
    evaEff(i) {
        let x
        let y = player.qu.en[this.ids[i]][2].max(0)
        if (i==0) {
            x = y.div(2)
        } else if (i==1) {
            x = y.pow(2).mul(10)
        }
        return x
    },
    rewards: [
        {
            title: "熵倍數",

            start: E(100),
            inc: E(10),

            eff(i) {
                let x = i.div(2).add(1).root(3)
                return x
            },
            desc(x) { return `元級時間速度、黑洞壓縮器和宇宙射線推遲 <b>${x.format()}x</b>。` },
        },{
            title: "熵加速",

            start: E(1000),
            inc: E(20),

            eff(i) {
                let x = i.pow(0.5).div(5).add(1)
                return x
            },
            desc(x) { return `原子力量效果的指數強 <b>${formatPercent(x.sub(1))}</b>。` },
        },{
            title: "熵蒸發",

            start: E(1000),
            inc: E(10),

            eff(i) {
                let x = E(3).pow(i)
                return x
            },
            desc(x) { return `蒸發資源的獲得量快 <b>${x.format(1)}x</b>。` },
        },{
            title: "熵轉換",

            start: E(10000),
            inc: E(2),

            eff(i) {
                let x = i.div(QCs.active()?100:5).softcap(2,0.5,0)
                let y = tmp.tickspeedEffect?tmp.tickspeedEffect.step.pow(x):E(1)
                return [x,y]
            },
            desc(x) { return `時間速度對黑洞壓縮器和宇宙射線力量給予 <b>^${x[0].format(2)}</b> 的加成。<br>目前：<b>${x[1].format()}x</b>` },
        },{
            title: "熵加成",

            start: E(250000),
            inc: E(2),

            eff(i) {
                let x = i.div(20).add(1)
                return x
            },
            desc(x) { return `額外質量升級、時間速度、黑洞壓縮器和宇宙射線 <b>x${x.format(2)}</b>。` },
        },

        /*
        {
            title: "Entropic Placeholder",
            start: E(100),
            inc: E(10),
            eff(i) {
                let x = E(1)
                return x
            },
            desc(x) { return `Placeholder.` },
        },
        */
    ],
    nextReward(i) {
        let rc = this.rewards[i]
        let r = player.qu.en.rewards[i]

        if (rc.scale) r = r.scale(rc.scale.s, rc.scale.p)
        let x = rc.inc.pow(r).mul(rc.start)
        return x
    },
    getRewards(i) {
        let rc = this.rewards[i]
        let en = player.qu.en.amt

        let x = E(0)
        if (en.gte(rc.start)) {
            x = en.div(rc.start).max(1).log(rc.inc)
            if (rc.scale) x = x.scale(rc.scale.s, rc.scale.p, true)
            x = x.add(1).floor()
        }
        return x
    },
}

function getEnRewardEff(x,def=1) { return tmp.en.rewards_eff[x] ?? E(def) }

function calcEntropy(dt, dt_offline) {
    if (player.qu.en.eth[0]) {
        player.qu.en.eth[3] += dt
        player.qu.en.eth[1] = player.qu.en.eth[1].add(tmp.en.gain.eth.mul(dt))
        let s = player.supernova.radiation.hz.div(player.supernova.radiation.hz.pow(dt).pow(player.qu.en.eth[3]**(2/3))).sub(1)
        if (s.lt(1)) ENTROPY.switch(0)
        else player.supernova.radiation.hz = s
    }
    if (player.qu.en.hr[0]) {
        player.qu.en.hr[3] += dt
        player.qu.en.hr[1] = player.qu.en.hr[1].add(tmp.en.gain.hr.mul(dt))
        let s = player.bh.mass.div(player.bh.mass.pow(dt).pow(player.qu.en.hr[3]**(2/3))).sub(1)
        if (s.lt(1)) ENTROPY.switch(1)
        else player.bh.mass = s
    }
    player.qu.en.amt = player.qu.en.amt.add(tmp.en.gain.amt.mul(dt)).min(tmp.en.cap)
    for (let x = 0; x < ENTROPY.rewards.length; x++) player.qu.en.rewards[x] = player.qu.en.rewards[x].max(tmp.en.rewards[x])
}

function updateEntropyTemp() {
    for (let x = 0; x < ENTROPY.rewards.length; x++) {
        let rc = ENTROPY.rewards[x]
        tmp.en.rewards[x] = ENTROPY.getRewards(x)
        tmp.en.rewards_eff[x] = rc.eff(player.qu.en.rewards[x])
    }
    for (let x = 0; x < 2; x++) {
        let id = ENTROPY.ids[x]
        tmp.en.gain[id] = ENTROPY.evaGain(x)
        tmp.en.eff[id] = ENTROPY.evaEff(x)
    }
    tmp.en.gain.amt = ENTROPY.gain()
    tmp.en.cap = ENTROPY.cap()
}

function updateEntropyHTML() {
    tmp.el.enEva1.setTxt(player.supernova.radiation.hz.format())
    tmp.el.enEva2.setTxt(formatMass(player.bh.mass))

    tmp.el.enAmt1.setTxt(player.qu.en.eth[2].format())
    tmp.el.enAmt2.setTxt(player.qu.en.amt.format(1) + " / " + tmp.en.cap.format(1))
    tmp.el.enAmt3.setTxt(player.qu.en.hr[2].format())

    tmp.el.enGain.setTxt(player.qu.en.amt.formatGain(tmp.en.gain.amt))

    tmp.el.enEff1.setTxt(tmp.en.eff.eth.format(1))
    tmp.el.enEff2.setTxt(tmp.en.eff.hr.format(1))

    tmp.el.evaBtn1.setHTML(
        player.qu.en.eth[0]
        ? `停止蒸發以獲得<br>${player.qu.en.eth[1].format()}<br>最佳焓`
        : `將你的頻率蒸發以獲得焓`
    )
    tmp.el.evaBtn2.setHTML(
        player.qu.en.hr[0]
        ? `停止蒸發以獲得<br>${player.qu.en.hr[1].format()}<br>最佳霍金輻射`
        : `將你的黑洞質量蒸發以獲得霍金輻射`
    )

    for (let x = 0; x < ENTROPY.rewards.length; x++) {
        let rc = ENTROPY.rewards[x]
        tmp.el["en_reward"+x].setTxt(player.qu.en.rewards[x].format(0))
        tmp.el["en_reward_next"+x].setTxt(ENTROPY.nextReward(x).format())
        tmp.el["en_reward_eff"+x].setHTML(rc.desc(getEnRewardEff(x)))
    }
}

function setupEntropyHTML() {
    let table = new Element("en_table")
    let html = ""
    for (let x = 0; x < ENTROPY.rewards.length; x++) {
        let rc = ENTROPY.rewards[x]
        html += `
        <div class="en_reward_div">
            <div style="text-align: left; width: 312px;">
                <b class="en_sub_reward">${rc.title}：</b><span id="en_reward${x}">0</span><br>
                <b class="en_sub_reward">下一個在：</b><span id="en_reward_next${x}">0</span>
            </div>
            <div class="en_reward">
                <span id="en_reward_eff${x}"></span>
            </div>
        </div>
        `
    }
    table.setHTML(html)
} 