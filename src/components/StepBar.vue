<template>
  <div
    class="contents"
    :style="'max-width:' + width + 'px; max-height:' + 60 + 'px;'"
  >
    <div class="svg-wrapper">
      <client-only>
        <svg
          :width="width"
          :height="width / 10"
          :viewBox="'0 0 ' + width + ' 60'"
        >
          <circle
            v-for="(s, index) in steps"
            :key="`first-${index}`"
            :cx="getPoint(index)"
            cy="20"
            r="10"
            :fill="s"
          />
          <line
            v-for="index of borderCount"
            :key="`second-${index}`"
            :x1="(baseWidth * (index - 1)) + oneMargin + 10"
            y1="20"
            :x2="(baseWidth * index) + oneMargin - 10"
            y2="20"
            :stroke="steps[index]"
            stroke-width="3px"
          />
          <text
            v-for="(sn, index) in stepNames"
            :key="`third-${index}`"
            :x="getPoint(index)"
            :y="45"
            font-size="12"
            font-weight="bold"
            text-anchor="middle"
          >
            {{ sn }}
          </text>
        </svg>
      </client-only>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StepBar',
  props: {
    step: {
      type: Number,
      required: true
    },
    stepNames: {
      type: Array,
      required: true
    },
    width: {
      type: Number,
      default: 800
    },
    margin: {
      type: Number,
      default: 150
    }
  },
  data () {
    return {
      circleCount: 0,

      baseWidth: 0,
      steps: [],
      borderCount: 0,
      glay: '#ccc',
      blue: 'blue',
      oneMargin: 0
    }
  },
  beforeMount () {
    this.drow()
  },
  beforeUpdate () {
    this.steps = []
    this.drow()
  },
  methods: {
    getPoint (index) {
      return (this.baseWidth * index) + this.oneMargin
    },
    drow () {
      this.circleCount = this.stepNames.length
      // circleCountを元にBoolean型の配列を作成する
      for (let i = 0; i < this.circleCount; i++) {
        if (this.step - 1 < i) {
          this.steps.push(this.glay)
        } else {
          this.steps.push(this.blue)
        }
      }

      // 文字の分左右にゆとりをもたせる
      this.baseWidth = (this.width - this.margin) / (this.circleCount - 1)
      this.borderCount = this.circleCount - 1

      this.oneMargin = this.margin / 2
    }
  }
}
</script>

<style scoped>
.contents {
    margin: auto;
}
.svg-wrapper {
    position: relative;
    width: 100%;
    padding-top: 100%;
}
.svg-wrapper svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 10%;
}
</style>
