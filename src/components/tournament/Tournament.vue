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
                        <div v-if="m.partic1" :class="classSelector(m.partic1, 1)">
                            {{ m.partic1.name + ' #' + m.partic1.id }}
                            <div v-if="point" class="point">
                                {{ m.partic1.point }}
                            </div>
                        </div>
                        <div v-else class="partic partic-null" />
                        <!-- 参加者2 -->
                        <div v-if="m.partic2" :class="classSelector(m.partic2, 2)">
                            {{ m.partic2.name + ' #' + m.partic2.id }}
                            <div v-if="point" class="point">
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
                              <div v-if="point" class="point">
                                  {{ tnmObj['3rd-pp'].partic1.point }}
                              </div>
                          </div>
                          <div v-else class="partic partic-null" />
                          <div
                            v-if="tnmObj['3rd-pp'].partic1"
                            :class="classSelector(tnmObj['3rd-pp'].partic2, 2)">
                              {{ tnmObj['3rd-pp'].partic2.name + ' #' + tnmObj['3rd-pp'].partic1.id }}
                              <div v-if="point" class="point">
                                  {{ tnmObj['3rd-pp'].partic2.point }}
                              </div>
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
  </div>
</template>

<script>
import TournamentUtils from '@/components/tournament/TournamentUtils'
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
  mixins: [TournamentUtils],
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
      this.roundWidth = (zentai.clientWidth / this.log2)
    })

    this.pp3rdFlg = !!this.tnmObj['3rd-pp']
  },
  methods: {
    classSelector (partic, type) {
      if (partic.win) {
        return 'partic partic-win' + type
      } else {
        return 'partic partic-lose' + type
      }
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
@import './tournament.css';
</style>
