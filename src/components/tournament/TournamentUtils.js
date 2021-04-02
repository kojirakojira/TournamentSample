export default {
  methods: {
    // ヘッダ部分の生成
    createHeader (timeArr, i) {
      let header = i + '回戦'
      if (i === this.log2 - 1) {
        header = '準決勝'
      } else if (i === this.log2) {
        header = '決勝'
      }
      if (timeArr && timeArr['r' + i]) {
        header += '(' + timeArr['r' + i] + ')'
      }
      return header
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
        style += 'position:absolute;z-index:0;width:10px;left:-23px;border-bottom:3px solid white;'
        style += 'border-top:3px solid white;border-right:3px solid white;transition-duration: 0.6s;}'
        newStyle.innerHTML = style
        document.getElementsByTagName('head').item(0).appendChild(newStyle)

        // partic1が勝った場合の線のstyle
        newStyle = document.createElement('style')
        style = '.round-' + round + ' .matches .match .partic-win1:before {'
        style += 'content:"";position:absolute;z-index: 1;'
        style += 'height:' + Math.floor(height / 2) + 'px;'
        style += 'top:' + top + 'px;'
        style += 'left:-50px;width:10px;border-top:3px solid gold;border-right:3px solid gold;transition-duration: 0.6s;'
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
    openDialog (partic) {
      this.current = partic
      this.dialogFlg = true
    },
    start (e) {
      this.startEvent = e
    },
    end (e) {
      let x
      let y
      if (e.type === 'mouseup') {
        // クリックの場合
        x = e.clientX - this.startEvent.clientX
        y = e.clientY - this.startEvent.clientY
      } else {
        // タップの場合
        if (!this.moveEvent) return
        x = this.moveEvent.touches[0].clientX - this.startEvent.touches[0].clientX
        y = this.moveEvent.touches[0].clientY - this.startEvent.touches[0].clientY
        this.moveEvent = null
      }
      // スワイプ判定
      if (Math.abs(y) < 100) {
        if (x > 50) {
          this.onSwipeRight()
        } else if (x < -50) {
          this.onSwipeLeft()
        }
      }
    },
    move (e) {
      this.moveEvent = e
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
}
