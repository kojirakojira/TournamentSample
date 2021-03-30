<template>
    <v-row>
      <v-col style="overflow: hidden;">
        <div
          v-touch-events:swipe.left="onSwipeLeft"
          v-touch-events:swipe.right="onSwipeRight"
          id="zentai"
          style="transform:translate3d(0px, 0px, 0px);">
          <div v-for="r of log" :key="r">
            <div :class="rounds[r - 1]">
              <div class="header">{{ headers[r - 1] }}</div>
              <div class="matches">
                  <div v-for="(m, idx) in tnmObj['r' + r]" :key="idx" :class="r === log ? 'match' : 'match match-c'">
                      <div class="match-number">
                          {{ m.mid | midFilter }}
                      </div>
                      <div class="partics">
                        <!-- 参加者1 -->
                        <div
                          v-if="m.partic1"
                          @mouseover="mouseoverPartic(r, idx, 1)"
                          @mouseout="mouseoutPartic(r, idx, 1)"
                          :class="classSelector(m.partic1, 1)">
                            {{ m.partic1.name + ' #' + m.partic1.id }}
                            <v-btn
                              color="error"
                              v-show="m.partic1.winDisp"
                              class="win-btn"
                              x-small
                              @click="win(r, idx, 1)">win!</v-btn>
                            <v-btn v-show="m.partic1.xDisp" small fab class="x-btn" @click="cancel(r, idx, 1)">×</v-btn>
                            <input type="tel" class="point-input" v-model="m.partic1.point" />
                        </div>
                        <div v-else class="partic partic-null" />
                        <!-- 参加者2 -->
                        <div
                          v-if="m.partic2"
                          @mouseover="mouseoverPartic(r, idx, 2)"
                          @mouseout="mouseoutPartic(r, idx, 2)"
                          :class="classSelector(m.partic2, 2)">
                            {{ m.partic2.name + ' #' + m.partic2.id }}
                            <v-btn
                              color="error"
                              v-show="m.partic2.winDisp"
                              class="win-btn"
                              x-small
                              @click="win(r, idx, 2)">win!</v-btn>
                            <v-btn v-show="m.partic2.xDisp" small fab class="x-btn" @click="cancel(r, idx, 2)">×</v-btn>
                            <input class="point-input" v-model="m.partic2.point" />
                        </div>
                        <div v-else class="partic partic-null" />
                        <!-- partic-win-cトーナメント表の線を表示するためのclass -->
                        <div :class="winClassSelector(r, m)" />
                      </div>
                  </div>
                  <!-- 3位決定戦 -->
                  <div v-if="r === log && pp3rdFlg" id="pp-3rd">
                      <div class="match-number">
                          3rd
                      </div>
                      <div class="partics">
                        <div
                          v-if="tnmObj['3rd-pp'].partic1"
                          @mouseover="mouseover3rdpp(1)"
                          @mouseout="mouseout3rdpp(1)"
                          :class="classSelector(tnmObj['3rd-pp'].partic1, 1)">
                            {{ tnmObj['3rd-pp'].partic1.name + ' #' + tnmObj['3rd-pp'].partic1.id }}
                            <v-btn
                              color="error"
                              v-show="tnmObj['3rd-pp'].partic1.winDisp"
                              class="win-btn"
                              x-small
                              @click="win3rd(1)">win!</v-btn>
                            <v-btn v-show="tnmObj['3rd-pp'].partic1.xDisp" @click="cancel3rd()" small fab class="x-btn">×</v-btn>
                            <input class="point-input" v-model="tnmObj['3rd-pp'].partic1.point" />
                        </div>
                        <div v-else class="partic partic-null" />
                        <div
                          v-if="tnmObj['3rd-pp'].partic2"
                          @mouseover="mouseover3rdpp(2)"
                          @mouseout="mouseout3rdpp(2)"
                          :class="classSelector(tnmObj['3rd-pp'].partic2, 2)">
                            {{ tnmObj['3rd-pp'].partic2.name + ' #' + tnmObj['3rd-pp'].partic2.id }}
                            <v-btn
                              color="error"
                              v-show="tnmObj['3rd-pp'].partic2.winDisp"
                              class="win-btn"
                              x-small
                              @click="win3rd(2)">win!</v-btn>
                            <v-btn v-show="tnmObj['3rd-pp'].partic2.xDisp" @click="cancel3rd()" small fab class="x-btn">×</v-btn>
                            <input class="point-input" type="tel" v-model="tnmObj['3rd-pp'].partic2.point" />
                        </div>
                        <div v-else class="partic partic-null" />
                      </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
</template>

<script>
export default {
  name: 'TournamentEdit',
  data () {
    return {
      pp3rdFlg: false,
      position: 0,
      rounds: [],
      particCount: 64,
      now: 1, // 何回戦目までスライドした状態か

      log: 1, // 何回戦まであるか
      heightArr: [],
      headers: []
    }
  },
  filters: {
    midFilter (mid) {
      return mid.slice(mid.indexOf('-') + 1, mid.length)
    }
  },
  props: {
    tnmObj: {
      type: Object,
      required: true
    }
  },
  async mounted () {
    await this.$nextTick()

    if (!this.tnmObj) {
      alert('参加者が存在しません。')
      return
    }

    // 参加者数
    this.particCount = this.countPartics(this.tnmObj)

    if (this.particCount < 4) {
      alert('参加者数が規定人数(4人)を満たしていません。')
      return
    }

    // 何回戦まで必要かを求める
    this.log = Math.ceil(Math.log2(this.particCount))
    for (let i = 0; i < this.log; i++) {
      this.rounds.push('round-' + (i * 1 + 1))

      // ヘッダ生成
      this.headers.push(this.createHeader(this.tnmObj.time, i))
    }

    // round-nのクラスを生成する
    this.createStyle()

    this.$nextTick(() => {
      // 1回戦が一番左に表示されているとき、スライドでtransitionアニメーションを発生させるため
      const zentai = document.getElementById('zentai')
      zentai.style.height = zentai.clientHeight + 'px'
    })

    this.pp3rdFlg = this.tnmObj['3rd-pp']
  },
  methods: {
    // ヘッダ部分の生成
    createHeader (timeArr, i) {
      let time = ''
      if (timeArr && timeArr.length !== 0) {
        if (timeArr['r' + (i + 1)]) {
          // ヘッダに時間を付ける
          time = '(' + timeArr['r' + (i + 1)] + ')'
        }
      }
      let header = (i * 1 + 1) + '回戦'
      if (i === this.log - 2) {
        header = '準決勝'
      } else if (i === this.log - 1) {
        header = '決勝'
      }
      return header + time
    },
    // cssをヘッダに追加しておく
    createStyle () {
      for (let i = 1; i < this.log; i++) {
        const round = i * 1 + 1
        // matchesのmargin-topを設定
        let newStyle = document.createElement('style')
        let style = '.round-' + round + ' .matches {'
        // 66 = 24 + 6 + 24 + 12
        // -21 = 6 - 24 - 3
        const marginTop = 66 * 2 ** (i - 1) - 21
        style += 'margin-top:' + marginTop + 'px;}'
        newStyle.innerHTML = style
        document.getElementsByTagName('head').item(0).appendChild(newStyle)

        // matchのmargin-bottomを設定
        newStyle = document.createElement('style')
        style = '.round-' + round + ' .matches > .match.match-c {'
        style += 'margin-bottom:' + (marginTop * 2 - 12) + 'px;}'
        newStyle.innerHTML = style
        document.getElementsByTagName('head').item(0).appendChild(newStyle)

        // 一番下のmatchはmargin-bottom:0px
        newStyle = document.createElement('style')
        style = '.round-' + round + ' .matches .match:last-child { margin-bottom: 0px; }'
        newStyle.innerHTML = style
        document.getElementsByTagName('head').item(0).appendChild(newStyle)

        // 表の']'を生成
        newStyle = document.createElement('style')
        // 27 = 24 + 3
        // 33 = -6 - 24 - 3
        const top = 27 - 33 * 2 ** (i - 1)
        const height = (top * -1 + 27) * 2 + 3
        style = '.round-' + round + ' .matches .partics:after {'
        style += 'content: "";'
        style += 'top:' + top + 'px;'
        style += 'height:' + height + 'px;'
        style += 'position:absolute;z-index:0;width:10px;left:-23px;border-bottom:3px solid white;border-top:3px solid white;border-right:3px solid white;}'
        newStyle.innerHTML = style
        document.getElementsByTagName('head').item(0).appendChild(newStyle)

        // partic1が勝った場合の線のstyle
        newStyle = document.createElement('style')
        style = '.round-' + round + ' .matches .match .partic-win1:before {'
        style += 'content:"";position:absolute;z-index: 1;'
        style += 'height:' + Math.floor(height / 2) + 'px;'
        style += 'top:' + top + 'px;'
        style += 'left:-50px;width:10px;border-top:3px solid gold;border-right:3px solid gold;'
        newStyle.innerHTML = style
        document.getElementsByTagName('head').item(0).appendChild(newStyle)

        // partic2が勝った場合の線のstyle
        newStyle = document.createElement('style')
        style = '.round-' + round + ' .matches .match .partic-win2:before {'
        style += 'content:"";position:absolute;z-index: 1;'
        style += 'height:' + Math.floor(height / 2) + 'px;'
        style += 'top:-1px;'
        style += 'left:-50px;width:10px;border-bottom:3px solid gold;border-right:3px solid gold;'
        newStyle.innerHTML = style
        document.getElementsByTagName('head').item(0).appendChild(newStyle)

        // partic-win-cのstyle
        newStyle = document.createElement('style')
        style = '.round-' + round + ' .matches .match .partic-win-c:before {content:"";position:absolute;'
        style += 'z-index:1;height:35px;top:-6px;left:-15px;width:10px;border-bottom:3px solid gold;'
        newStyle.innerHTML = style
        document.getElementsByTagName('head').item(0).appendChild(newStyle)
      }
    },
    // 参加者数を数える
    countPartics (tnmObj) {
      const r1 = tnmObj.r1
      let count = 0
      // 1回戦のマッチ数分ループ
      for (const i in r1) {
        if (r1[i].partic1) {
          count++
        }
        if (r1[i].partic2) {
          count++
        }
      }
      return count
    },
    classSelector (partic, type) {
      if (partic.win) {
        return 'partic partic-win' + type
      } else {
        return 'partic partic-lose' + type
      }
    },
    winClassSelector (r, m) {
      if (r !== 1 && m.partic1 && m.partic2 && (m.partic1.win || m.partic2.win)) {
        return 'partic-win-c'
      } else {
        return ''
      }
    },
    // 左にスワイプにしたとき
    onSwipeLeft () {
      if (this.now === this.log) {
        return
      }
      const zentai = document.getElementById('zentai')
      this.position -= (zentai.clientWidth / this.log)
      zentai.style.transform = 'translate3d(' + this.position + 'px, 0px, 0px)'

      // heightを変える(基準値は254pxとする)
      let height = 0
      if (zentai.clientHeight / 2 + 36 > 254) {
        // トーナメント表全体のheight / 2 + ヘッダー部分
        height = zentai.clientHeight / 2 + 36 + 'px'
      } else {
        // 決勝のheight
        const final = document.querySelector('.' + this.rounds[this.rounds.length - 1])
        height = final.clientHeight + 'px'
      }
      zentai.style.height = height
      this.heightArr.push(height)

      // クラスを切り替える
      let c = 1
      for (let i = this.now; i < this.log; i++) {
        this.rounds.splice(i, 1, 'round-' + (c++))
      }
      if (this.now - 1 >= 0) {
        this.rounds.splice((this.now - 1), 1, 'round-0')
      }
      this.now++
    },
    // 右にスワイプしたとき
    onSwipeRight () {
      if (this.now === 1) {
        return
      }
      const zentai = document.getElementById('zentai')
      this.position += (zentai.clientWidth / this.log)
      zentai.style.transform = 'translate3d(' + this.position + 'px, 0px, 0px)'
      this.now--
      // クラスを切り替える
      for (let i = this.now; i < this.log; i++) {
        this.rounds.splice(i, 1, 'round-' + (this.rounds[i].slice(-1) * 1 + 1))
      }
      if (this.now - 1 >= 0) {
        this.rounds.splice((this.now - 1), 1, 'round-1')
      }
      // heightを変える
      this.heightArr.pop()
      zentai.style.height = this.heightArr.slice(-1)
    },
    // 参加者にマウスを当てたとき
    mouseoverPartic (r, idx, type) {
      // 次のラウンドの位置を求める
      const x = r * 1 + 1
      const y = Math.ceil((idx * 1 + 1) / 2)
      const partic = (idx * 1 + 1) / 2 !== y ? 'partic1' : 'partic2'

      // 決勝またはそのラウンドの勝者が決まっていない場合
      let winFlg = false
      let xFlg = false
      const m = this.tnmObj['r' + r][idx]
      if (this.log === r) {
      // 決勝
        if (m['partic' + type]) {
          xFlg = true
        }
        if (m.partic1 && m.partic2 && !(m.partic1.win || m.partic2.win)) {
          winFlg = true
        }
      } else {
        // 決勝以外
        if (!this.tnmObj['r' + x][y - 1][partic]) {
          // 次のラウンドにparticが存在していない場合
          if (r === 1 || (this.tnmObj['r' + r][idx].partic1 && this.tnmObj['r' + r][idx].partic2)) {
            winFlg = true
          }
          // 1回戦の場合はxボタン非表示
          xFlg = r !== 1
        }
      }

      if (winFlg) {
        // 「win!」を表示させる
        this.$set(this.tnmObj['r' + r][idx]['partic' + type], 'winDisp', true)
      }
      if (xFlg) {
        // 「x」を表示させる
        this.$set(this.tnmObj['r' + r][idx]['partic' + type], 'xDisp', true)
      }
    },
    // 参加者からマウスを離したとき
    mouseoutPartic (r, idx, type) {
      // 「win!」を削除する
      this.$delete(this.tnmObj['r' + r][idx]['partic' + type], 'winDisp')
      // 「x」を削除する
      this.$delete(this.tnmObj['r' + r][idx]['partic' + type], 'xDisp')
    },
    // 3位決定戦にマウスを当てたとき
    mouseover3rdpp (type) {
      const m = this.tnmObj['3rd-pp']
      if (m.partic1 && m.partic2) {
        if (!(m.partic1.win || m.partic2.win)) {
          this.$set(this.tnmObj['3rd-pp']['partic' + type], 'winDisp', true)
        } else {
          this.$set(this.tnmObj['3rd-pp']['partic' + type], 'xDisp', true)
        }
      }
    },
    // 3位決定戦からマウスを離したとき
    mouseout3rdpp (type) {
      this.$delete(this.tnmObj['3rd-pp']['partic' + type], 'winDisp')
      this.$delete(this.tnmObj['3rd-pp']['partic' + type], 'xDisp')
    },
    win (r, idx, type) {
      if (!this.tnmObj['r' + r][idx]['partic' + type].winDisp) {
        return
      }

      this.$set(this.tnmObj['r' + r][idx]['partic' + type], 'win', 1)

      // 次のラウンドの位置を求める
      const x = r * 1 + 1
      const y = Math.ceil((idx * 1 + 1) / 2)
      const partic = (idx * 1 + 1) / 2 !== y ? 'partic1' : 'partic2'

      // 次のラウンドにセット
      if (r !== this.log) {
        const obj = {
          id: this.tnmObj['r' + r][idx]['partic' + type].id,
          name: this.tnmObj['r' + r][idx]['partic' + type].name,
          win: 0,
          point: ''
        }
        this.$set(this.tnmObj['r' + x][y - 1], partic, obj)

        // 準決勝の場合は3位決定戦にも追加
        if (this.pp3rdFlg && r === this.log - 1) {
          const opp = type === 1 ? 2 : 1
          const oppObj = {
            id: this.tnmObj['r' + r][idx]['partic' + opp].id,
            name: this.tnmObj['r' + r][idx]['partic' + opp].name,
            win: 0,
            point: ''
          }
          this.$set(this.tnmObj['3rd-pp'], 'partic' + (idx * 1 + 1), oppObj)
        }
      }
    },
    // 進めたparticを取り消す、そうでない場合はそのラウンドのユーザを取り消す
    cancel (r, idx, type) {
      if (!this.tnmObj['r' + r][idx]['partic' + type].xDisp) {
        return
      }
      const m = this.tnmObj['r' + r][idx]
      if (m.partic1 && m.partic2 && (m.partic1.win || m.partic2.win)) {
        // winを確定していた場合はwinを取り消す
        this.$set(this.tnmObj['r' + r][idx].partic1, 'win', 0)
        this.$set(this.tnmObj['r' + r][idx].partic2, 'win', 0)
      } else {
        // winが確定していない場合はparticを取り消す
        this.$set(this.tnmObj['r' + r][idx], ['partic' + type], null)
        // 1回戦前のマッチIDを求め、勝ち状態を削除
        let prMatch = (idx * 1 + 1) * 2
        prMatch = type === 1 ? prMatch - 2 : prMatch - 1
        this.$set(this.tnmObj['r' + (r - 1)][prMatch].partic1, 'win', 0)
        this.$set(this.tnmObj['r' + (r - 1)][prMatch].partic2, 'win', 0)

        // 決勝かつ3位決定戦ありの場合
        if (this.pp3rdFlg && r === this.log) {
          this.$set(this.tnmObj['3rd-pp'], ['partic' + type], null)
        }
      }
    },
    win3rd (type) {
      const m = this.tnmObj['3rd-pp']
      if (m.partic1 && m.partic2 && !(m.partic1.win || m.partic2.win)) {
        this.$set(this.tnmObj['3rd-pp']['partic' + type], 'win', 1)
      }
    },
    cancel3rd () {
      this.$set(this.tnmObj['3rd-pp'].partic1, 'win', 0)
      this.$set(this.tnmObj['3rd-pp'].partic2, 'win', 0)
    },
    getTnmObj () {
      return JSON.stringify(this.tnmObj)
    }
  }
}
// class Match {
//   constructor (mid, partic1, partic2) {
//     this.matchId = mid
//     this.partic1 = partic1
//     this.partic2 = partic2
//   }
// }
// class Partic {
//   constructor (id, name, w, p) {
//     this.id = id
//     this.name = name
//     this.win = w
//     this.point = p
//   }
// }
</script>

<style scoped>
#zentai {
    cursor: move;
    box-sizing: border-box;
    user-select: none;
    display: inline-flex;
    background-color: black;
    width: max-content;
    position: relative;
    transition-duration: 1s;
    overflow: hidden;
}
.header {
    padding-left: 6px;
    padding-right: 6px;
    margin: 6px;
    background-color: white;
    text-align: center;
}
.matches {
    width: 260px;
    margin-left: 12px;
    margin-right: 12px;
    position: relative;
    transition-duration: 0.6s;
}
.match {
    margin-top: 12px;
    margin-bottom: 12px;
    position: relative;
    transition-duration: 0.6s;
}
.match-number {
    position: absolute;
    background-color: white;
    height: 54px;
    line-height: 54px;
    text-align: center;
    font-weight: bold;
    width: 24px;
    font-size: 0.8em;
}
.partics {
    margin-left: 21px;
    font-size: 0.8em;
}
.partic {
    cursor: pointer;
}
.partic-win1 {
    padding-left: 3px;
    padding-right: 6px;
    margin: 6px;
    height: 24px;
    line-height: 24px;
    position: relative;
    background-color: gold;
}
.partic-lose1 {
    padding-left: 3px;
    padding-right: 6px;
    margin: 6px;
    height: 24px;
    line-height: 24px;
    position: relative;
    background-color: gray;
}
.partic-win2 {
    padding-left: 3px;
    padding-right: 6px;
    margin: 6px;
    height: 24px;
    line-height: 24px;
    position: relative;
    background-color: gold;
}
.partic-lose2 {
    padding-left: 3px;
    padding-right: 6px;
    margin: 6px;
    height: 24px;
    line-height: 24px;
    position: relative;
    background-color: gray;
}
.partic-null {
    content: 'null';
    padding-left: 3px;
    padding-right: 6px;
    margin: 6px;
    height: 24px;
    line-height: 24px;
    position: relative;
    background-color: gray;
}
.point {
    background-color: white;
    position: absolute;
    z-index: 1;
    padding: 0px;
    text-align: center;
    width: 24px;
    top: 0px;
    right: 0px;
    font-weight: bold;
}
/** 動的な部分 */
/* .round-2 .matches .match:after {
    content: "";
    top: -6px;
    border-bottom:3px solid white;
    height: 66px;
    position: absolute;
    z-index: 0;
    width: 10px;
    left: -23px;
    border-top: 3px solid white;
    border-right: 3px solid white;
} */
/* .matches .partic-win1:before {
    content: "";
    position: absolute;
    z-index: 1;
    height: 34px;
    top: -6px;
    left: -50px;
    width: 10px;
    border-top: 3px solid gold;
    border-right: 3px solid gold;
}
.matches .partic-win2:before {
    content: "";
    position: absolute;
    z-index: 1;
    height: 34px;
    top: -1px;
    left: -50px;
    width: 10px;
    border-bottom: 3px solid gold;
    border-right: 3px solid gold;
} */
/* .matches .partic-win-c:before {
    content: "";
    position: absolute;
    z-index: 1;
    height: 35px;
    top: -6px;
    left: -15px;
    width: 10px;
    border-bottom: 3px solid gold;
} */
#pp-3rd {
    margin-top: 30px;
}
.point-input {
    background-color: white;
    position: absolute;
    z-index: 1;
    padding: 0px;
    text-align: center;
    width: 24px;
    top: 0px;
    right: 0px;
    font-weight: bold;
}
.win-btn {
  padding: 0px !important;
  position: absolute;
  z-index: 3;
  top: 2px;
  right: 56px;
}
.x-btn {
  width: 16px !important;
  height: 16px !important;
  position: absolute;
  z-index: 2px;
  top: 4px;
  right: 33px;
}
</style>
