<template>
  <div>
    <div
      v-if="match['partic' + type]"
      @mouseenter="mouseenterPartic(round, index, type)"
      @mouseleave="mouseleavePartic(round, index, type)"
      :class="classSelector(match['partic' + type], type)">
        {{ match['partic' + type].name + ' #' + match['partic' + type].id }}
        <v-btn
          color="error"
          v-show="match['partic' + type].winDisp"
          class="win-btn"
          x-small
          @click="win(round, index, type)">win!</v-btn>
        <v-btn
          color="info"
          v-show="match['partic' + type].detailsDisp"
          class="details-btn"
          x-small
          @click="disp(type)">表示</v-btn>
        <v-btn v-show="match['partic' + type].xDisp" small fab class="x-btn" @click="cancel(round, index, type)">×</v-btn>
        <input v-if="point" type="tel" class="point-input" v-model="match['partic' + type].point" />
    </div>
    <div v-else class="partic partic-null" />
  </div>
</template>

<script>
export default {
  name: 'Partic',
  props: {
    match: {
      type: Object,
      required: true
    },
    round: {
      type: Number,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    type: {
      type: Number,
      required: true
    },
    tnmObj: {
      type: Object,
      required: true
    },
    pp3rdFlg: {
      type: Boolean,
      required: true
    },
    log2: {
      type: Number,
      required: true
    },
    point: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    classSelector (partic, type) {
      if (partic.win) {
        return 'partic partic-win' + type
      } else {
        return 'partic partic-lose' + type
      }
    },
    // 参加者にマウスを当てたとき
    mouseenterPartic (r, idx, type) {
      // 次のラウンドの位置を求める
      const x = r * 1 + 1
      const y = Math.ceil((idx * 1 + 1) / 2)
      const partic = (idx * 1 + 1) / 2 !== y ? 'partic1' : 'partic2'

      // 決勝またはそのラウンドの勝者が決まっていない場合
      let winFlg = false
      let xFlg = false
      const m = this.tnmObj['r' + r][idx]
      if (this.log2 === r) {
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

      // Android版firefoxでparticラベルタップでwin()が実行される不具合の対応。
      const func = () => {
        // 「表示」を表示
        this.$set(this.tnmObj['r' + r][idx]['partic' + type], 'detailsDisp', true)

        if (winFlg) {
          // 「win!」を表示させる
          this.$set(this.tnmObj['r' + r][idx]['partic' + type], 'winDisp', true)
        }
        if (xFlg) {
          // 「x」を表示させる
          this.$set(this.tnmObj['r' + r][idx]['partic' + type], 'xDisp', true)
        }
      }
      setTimeout(func, 0)
    },
    // 参加者からマウスを離したとき
    mouseleavePartic (r, idx, type) {
      // 「表示」を削除する
      this.$delete(this.tnmObj['r' + r][idx]['partic' + type], 'detailsDisp')
      // 「win!」を削除する
      this.$delete(this.tnmObj['r' + r][idx]['partic' + type], 'winDisp')
      // 「x」を削除する
      this.$delete(this.tnmObj['r' + r][idx]['partic' + type], 'xDisp')
    },
    win (r, idx, type) {
      this.$set(this.tnmObj['r' + r][idx]['partic' + type], 'win', 1)

      // 次のラウンドの位置を求める
      const x = r * 1 + 1
      const y = Math.ceil((idx * 1 + 1) / 2)
      const partic = (idx * 1 + 1) / 2 !== y ? 'partic1' : 'partic2'

      // 次のラウンドにセット
      if (r !== this.log2) {
        const obj = {
          id: this.tnmObj['r' + r][idx]['partic' + type].id,
          name: this.tnmObj['r' + r][idx]['partic' + type].name,
          win: 0,
          point: ''
        }
        this.$set(this.tnmObj['r' + x][y - 1], partic, obj)

        // 準決勝の場合は3位決定戦にも追加
        if (this.pp3rdFlg && r === this.log2 - 1) {
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
      // 表示を消す
      this.mouseleavePartic(r, idx, type)
    },
    // 進めたparticを取り消す、そうでない場合はそのラウンドのユーザを取り消す
    cancel (r, idx, type) {
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
        if (this.pp3rdFlg && r === this.log2) {
          this.$set(this.tnmObj['3rd-pp'], ['partic' + type], null)
        }
      }
    },
    disp (type) {
      this.$emit('dialog', this.match['partic' + type])
    }
  }
}
</script>
