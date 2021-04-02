<template>
  <div>
    <v-row>
      <v-col class="headline">
        <v-icon>
          mdi-tournament
        </v-icon>
        トーナメント表
      </v-col>
    </v-row>
    <v-row>
      <v-col style="overflow: hidden;">
        <div
          v-touch-events:start="start"
          v-touch-events:end="end"
          @touchstart="start"
          @touchend="end"
          @touchmove="move"
          id="zentai"
          style="transform:translate3d(0px, 0px, 0px);">
          <div v-for="r of log2" :key="r">
            <div :class="rounds[r - 1]">
              <div class="header">{{ createHeader(tnmObj.time, r) }}</div>
              <div class="matches">
                  <div v-for="(m, idx) in tnmObj['r' + r]" :key="idx" :class="r === log2 ? 'match' : 'match match-c'">
                      <div class="match-number">
                          {{ m.mid | midFilter }}
                      </div>
                      <div class="partics">
                        <!-- 参加者1 -->
                        <Partic
                          :match="m"
                          :round="r"
                          :index="idx"
                          :type="1"
                          :tnm-obj="tnmObj"
                          :pp3rd-flg="pp3rdFlg"
                          :log2="log2"
                          :point="point"
                          @dialog="openDialog" />
                        <!-- 参加者2 -->
                        <Partic
                          :match="m"
                          :round="r"
                          :index="idx"
                          :type="2"
                          :tnm-obj="tnmObj"
                          :pp3rd-flg="pp3rdFlg"
                          :log2="log2"
                          :point="point"
                          @dialog="openDialog" />
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
                        <Partic3rdpp :tnm-obj="tnmObj" :type="1" :point="point" />
                        <!-- 参加者2 -->
                        <Partic3rdpp :tnm-obj="tnmObj" :type="2" :point="point" />
                      </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      <v-dialog
        v-if="current"
        v-model="dialogFlg"
        fullscreen
        scrollable
        transition="dialog-bottom-transition"
      >
        <ParticDialog :id="current.id" :name="current.name" @close="dialogFlg = false" />
      </v-dialog>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="headline">
        <v-icon>
          mdi-calendar-clock
        </v-icon>
        表示スケジュール変更
      </v-col>
    </v-row>
    <v-row>
      <v-col style="padding-top:0px;">
        <v-container style="padding-top:0px;">
          <v-row v-for="r of log2" :key="r">
            <v-col cols="3" md="3" lg="3" xl="3" class="time-input">
              {{ createHeader(null, r) }}
            </v-col>
            <v-col cols="9" md="8" lg="5" xl="5" class="time-input">
              <v-text-field
                v-model="tnmObj.time['r' + r]"
                mix-width="60%"
                label="時間を入力"
                single-line
                hide-details
                autocomplete="off"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Partic from '@/components/tournament/Partic'
import Partic3rdpp from '@/components/tournament/Partic3rdpp'
import ParticDialog from '@/components/tournament/ParticDialog'
import TournamentUtils from '@/components/tournament/TournamentUtils'
export default {
  name: 'TournamentEdit',
  components: {
    Partic,
    Partic3rdpp,
    ParticDialog
  },
  mixins: [TournamentUtils],
  data () {
    return {
      pp3rdFlg: false,
      position: 0,
      rounds: [],
      particCount: 64,
      now: 1, // 何回戦目までスライドした状態か

      log2: 1, // 何回戦まであるか
      heightArr: [],

      // ダイアログ
      current: null,
      dialogFlg: false,

      startEvent: null,
      moveEvent: null
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
    },
    point: {
      type: Boolean,
      default: false
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
    getTnmObj () {
      return JSON.stringify(this.tnmObj)
    }
  }
}
</script>

<style>
@import './tournament.css';
.time-input {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  display: flex;
  align-items:flex-end;
}
</style>
