<template>
    <v-row>
      <v-col style="overflow: hidden;">
        <div
          v-touch-events:swipe.left="onSwipeLeft"
          v-touch-events:swipe.right="onSwipeRight"
          id="zentai"
          style="transform:translate3d(0px, 0px, 0px);">
          <div v-for="r of log2" :key="r">
            <div :class="rounds[r - 1]">
              <div class="header">{{ headers[r - 1] }}</div>
              <div class="matches">
                  <div v-for="(m, idx) in tnmObj['r' + r]" :key="idx" :class="r === log2 ? 'match' : 'match match-c'">
                      <div class="match-number">
                          {{ m.mid | midFilter }}
                      </div>
                      <div class="partics">
                        <!-- 参加者1 -->
                        <div v-if="m.partic1" :class="classSelector(m.partic1, 1)">
                            {{ m.partic1.name + ' #' + m.partic1.id }}
                            <div class="point">
                                {{ m.partic1.point }}
                            </div>
                        </div>
                        <div v-else class="partic partic-null" />
                        <!-- 参加者2 -->
                        <div v-if="m.partic2" :class="classSelector(m.partic2, 2)">
                            {{ m.partic2.name + ' #' + m.partic2.id }}
                            <div class="point">
                                {{ m.partic2.point }}
                            </div>
                        </div>
                        <div v-else class="partic partic-null" />
                        <!-- partic-win-cトーナメント表の線を表示するためのclass -->
                        <div :class="winClassSelector(r, m)" />
                      </div>
                  </div>
                  <div v-if="r === log2 && pp3rdFlg" id="pp-3rd">
                      <div class="match-number">
                          3rd
                      </div>
                      <div class="partics">
                          <div
                            v-if="tnmObj['3rd-pp'].partic1"
                            :class="classSelector(tnmObj['3rd-pp'].partic1, 1)">
                              {{ tnmObj['3rd-pp'].partic1.name + ' #' + tnmObj['3rd-pp'].partic1.id }}
                              <div class="point">
                                  {{ tnmObj['3rd-pp'].partic1.point }}
                              </div>
                          </div>
                          <div
                            v-if="tnmObj['3rd-pp'].partic1"
                            :class="classSelector(tnmObj['3rd-pp'].partic2, 2)">
                              {{ tnmObj['3rd-pp'].partic2.name + ' #' + tnmObj['3rd-pp'].partic1.id }}
                              <div class="point">
                                  {{ tnmObj['3rd-pp'].partic2.point }}
                              </div>
                          </div>
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
  name: 'Tournament',
  data () {
    return {
      pp3rdFlg: false,
      position: 0,
      roundWidth: 0,
      rounds: [],
      particCount: 64,
      now: 1, // 何回戦目までスライドした状態か

      log2: 1, // 何回戦まであるか
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
    this.log2 = Math.ceil(Math.log2(this.particCount))
    for (let i = 0; i < this.log2; i++) {
      this.rounds.push('round-' + (i * 1 + 1))

      // ヘッダ生成
      this.headers.push(this.createHeader(this.tnmObj.time, i))
    }

    // round-nのクラスを生成する
    this.createStyle()

    this.$nextTick(() => {
      const zentai = document.getElementById('zentai')
      this.roundWidth = (zentai.clientWidth / this.log2)
    })

    this.pp3rdFlg = !!this.tnmObj['3rd-pp']
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
      if (i === this.log2 - 2) {
        header = '準決勝'
      } else if (i === this.log2 - 1) {
        header = '決勝'
      }
      return header + time
    },
    // cssをヘッダに追加しておく
    createStyle () {
      for (let i = 1; i < this.log2; i++) {
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
      if (this.now === this.log2) {
        return
      }
      const zentai = document.getElementById('zentai')
      this.position -= (zentai.clientWidth / this.log2)
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
      for (let i = this.now; i < this.log2; i++) {
        this.rounds.splice(i, 1, 'round-' + (c++))
      }
      this.now++
    },
    // 右にスワイプしたとき
    onSwipeRight () {
      if (this.now === 1) {
        return
      }
      const zentai = document.getElementById('zentai')
      this.position += (zentai.clientWidth / this.log2)
      zentai.style.transform = 'translate3d(' + this.position + 'px, 0px, 0px)'
      this.now--
      // クラスを切り替える
      for (let i = this.now; i < this.log2; i++) {
        this.rounds.splice(i, 1, 'round-' + (this.rounds[i].slice(-1) * 1 + 1))
      }
      // heightを変える
      this.heightArr.pop()
      zentai.style.height = this.heightArr.slice(-1)
    },
    getTnmObj () {
      return JSON.stringify(this.tnmObj)
    }
  }
}
// class Match {
//   constructor (mid, rid, partic1, partic2) {
//     this.roundId = rid
//     this.matchId = mid
//     this.partic1 = partic1
//     this.partic2 = partic2
//   }
// }
// class Partic {
//   constructor (idx, id, name, w) {
//     this.index = idx
//     this.id = id
//     this.name = name
//     this.wins = w
//   }
// }
</script>

<style>
@import '../assets/tournament.css';
</style>
