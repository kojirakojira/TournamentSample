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
                        <Match :match="m" :round="r" :index="idx" :type="1" :tnm-obj="tnmObj" :pp3rd-flg="pp3rdFlg" :log2="log2" />
                        <!-- 参加者2 -->
                        <Match :match="m" :round="r" :index="idx" :type="2" :tnm-obj="tnmObj" :pp3rd-flg="pp3rdFlg" :log2="log2" />
                        <!-- partic-win-cトーナメント表の線を表示するためのclass -->
                        <div :class="winClassSelector(r, m)" />
                      </div>
                  </div>
                  <!-- 3位決定戦 -->
                  <div v-if="r === log2 && pp3rdFlg" id="pp-3rd">
                      <div class="match-number">
                          3rd
                      </div>
                      <div class="partics">
                        <!-- 参加者1 -->
                        <Match3rdpp :tnm-obj="tnmObj" :type="1" />
                        <!-- 参加者2 -->
                        <Match3rdpp :tnm-obj="tnmObj" :type="2" />
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
import Match from '@/components/Match'
import Match3rdpp from '@/components/Match3rdpp'
export default {
  name: 'TournamentEdit',
  components: {
    Match,
    Match3rdpp
  },
  data () {
    return {
      pp3rdFlg: false,
      position: 0,
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
      // 1回戦が一番左に表示されているとき、スライドでtransitionアニメーションを発生させるため
      const zentai = document.getElementById('zentai')
      zentai.style.height = zentai.clientHeight + 'px'
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

      this.heightArr.push(zentai.clientHeight)
      // heightを変える(基準値は254pxとする)
      let height = 0
      if (zentai.clientHeight / 2 + 36 > 254) {
        // トーナメント表全体のheight / 2 + ヘッダー部分
        height = zentai.clientHeight / 2 + 36
      } else {
        // 決勝のheight
        const final = document.querySelector('.' + this.rounds[this.rounds.length - 1])
        height = final.clientHeight
      }
      zentai.style.height = height + 'px'
      // this.heightArr.push(height + 'px')

      // クラスを切り替える
      let c = 1
      for (let i = this.now; i < this.log2; i++) {
        this.rounds.splice(i, 1, 'round-' + (c++))
      }
      if (this.now - 1 >= 0) {
        this.rounds.splice((this.now - 1), 1, 'round-0')
      }
      this.now++

      // 表示位置を計算
      const zentaiHeight = zentai.clientHeight
      const yOffset = window.pageYOffset
      const tnmTop = zentai.getBoundingClientRect().top + yOffset
      // 対応する表示位置の割合
      const per = (yOffset - tnmTop) / zentaiHeight
      if (per > 0) {
        window.scrollTo(0, height * per + tnmTop)
      }
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
      if (this.now - 1 >= 0) {
        this.rounds.splice((this.now - 1), 1, 'round-1')
      }
      // heightを変える
      const height = this.heightArr.slice(-1)
      zentai.style.height = height + 'px'
      this.heightArr.pop()

      // 表示位置を計算
      const zentaiHeight = zentai.clientHeight
      const yOffset = window.pageYOffset
      const tnmTop = zentai.getBoundingClientRect().top + yOffset
      // 対応する表示位置の割合
      const per = (yOffset - tnmTop) / zentaiHeight
      if (per > 0) {
        const func = () => {
          // transition後に移動
          window.scrollTo(0, height * per + tnmTop)
        }
        setTimeout(func, 1000)
      }
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

<style>
@import '../assets/tournament.css';
</style>
