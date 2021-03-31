<template>
  <div>
    <div
      v-if="tnmObj['3rd-pp']['partic' + type]"
      @mouseenter="mouseenter3rdpp(type)"
      @mouseleave="mouseleave3rdpp(type)"
      :class="classSelector(tnmObj['3rd-pp']['partic' + type], type)">
        {{ tnmObj['3rd-pp']['partic' + type].name + ' #' + tnmObj['3rd-pp']['partic' + type].id }}
        <v-btn
          color="info"
          v-show="tnmObj['3rd-pp']['partic' + type].detailsDisp"
          class="details-btn"
          x-small>表示</v-btn>
        <v-btn
          color="error"
          v-show="tnmObj['3rd-pp']['partic' + type].winDisp"
          class="win-btn"
          x-small
          @click="win3rd(type)">win!</v-btn>
        <v-btn v-show="tnmObj['3rd-pp']['partic' + type].xDisp" @click="cancel3rd()" small fab class="x-btn">×</v-btn>
        <input type="tel" class="point-input" v-model="tnmObj['3rd-pp']['partic' + type].point" />
    </div>
    <div v-else class="partic partic-null" />
  </div>
</template>

<script>
export default {
  name: 'match3rdpp',
  props: {
    tnmObj: {
      type: Object,
      required: true
    },
    type: {
      type: Number,
      required: true
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
    // 3位決定戦にマウスを当てたとき
    mouseenter3rdpp (type) {
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
    mouseleave3rdpp (type) {
      this.$delete(this.tnmObj['3rd-pp']['partic' + type], 'winDisp')
      this.$delete(this.tnmObj['3rd-pp']['partic' + type], 'xDisp')
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
    }
  }
}
</script>
