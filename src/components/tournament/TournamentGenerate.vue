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
          v-touch-events:swipe.left="onSwipeLeft"
          v-touch-events:swipe.right="onSwipeRight"
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
                      <div v-if="r === 1" class="partics">
                        <!-- 参加者1 -->
                        <div v-if="!m.partic1 || m.partic1.id !== 'del'" class="partic partic-lose1">
                            <v-select
                                v-model="m.partic1"
                                :items="mPartics"
                                item-text="name"
                                item-value="id"
                                item-disabled="disabled"
                                label="選択してください。"
                                return-object
                                single-line
                                dense
                                clearable
                                @change="change"
                            >
                              <template v-slot:selection = "data">
                                {{ data.item.name }} #{{ data.item.id }}
                              </template>
                              <template v-slot:item = "data">
                                {{ data.item.name }} #{{ data.item.id }}
                              </template>
                            </v-select>
                        </div>
                        <div v-else class="partic partic-null" />
                        <!-- 参加者2 -->
                        <div v-if="!m.partic2 || m.partic2.id !== 'del'" class="partic partic-lose2">
                            <v-select
                                v-model="m.partic2"
                                :items="mPartics"
                                item-text="name"
                                item-value="id"
                                item-disabled="disabled"
                                label="選択してください。"
                                return-object
                                single-line
                                dense
                                clearable
                                @change="change"
                            >
                              <template v-slot:selection = "data">
                                {{ data.item.name }} #{{ data.item.id }}
                              </template>
                              <template v-slot:item = "data">
                                {{ data.item.name }} #{{ data.item.id }}
                              </template>
                            </v-select>
                        </div>
                        <div v-else class="partic partic-null" />
                      </div>
                      <div v-else class="partics">
                        <!-- 参加者1 -->
                        <div v-if="m.partic1" :class="classSelector(m.partic1, 1)">
                            {{ m.partic1.name + ' #' + m.partic1.id }}
                            <div v-if="tnmObj.point" class="point">
                                {{ m.partic1.point }}
                            </div>
                        </div>
                        <div v-else class="partic partic-null" />
                        <!-- 参加者2 -->
                        <div v-if="m.partic2" :class="classSelector(m.partic2, 2)">
                            {{ m.partic2.name + ' #' + m.partic2.id }}
                            <div v-if="tnmObj.point" class="point">
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
                              <div v-if="tnmObj.point" class="point">
                                  {{ tnmObj['3rd-pp'].partic1.point }}
                              </div>
                          </div>
                          <div v-else class="partic partic-null" />
                          <div
                            v-if="tnmObj['3rd-pp'].partic1"
                            :class="classSelector(tnmObj['3rd-pp'].partic2, 2)">
                              {{ tnmObj['3rd-pp'].partic2.name + ' #' + tnmObj['3rd-pp'].partic1.id }}
                              <div v-if="tnmObj.point" class="point">
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
      headers: [],

      mPartics: [],
      bTnmObj: [] // 変更検知用のラウンド1オブジェクト
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
    dropDownList: {
      type: Array,
      required: true
    },
    randFlg: {
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

    // トーナメント表生成オリジナル処理
    this.mPartics = Array.from(this.dropDownList)
    this.mPartics.sort((a, b) => {
      let comparison = 0
      if (a.id > b.id) {
        comparison = 1
      } else if (a.id < b.id) {
        comparison = -1
      }
      return comparison
    })
    this.mPartics.forEach(p => { p.disabled = this.randFlg })
    this.bTnmObjR1 = JSON.parse(JSON.stringify(this.tnmObj.r1))
  },
  methods: {
    change (v) {
      if (!v) {
        this.clear()
      } else {
        v.disabled = true
      }
      this.bTnmObjR1 = JSON.parse(JSON.stringify(this.tnmObj.r1))
    },
    clear () {
      let id
      // clearボタン押下での変更点を見つける
      for (const m in this.tnmObj.r1) {
        for (let i = 1; i <= 2; i++) {
          if (!this.tnmObj.r1[m][`partic${i}`] && this.bTnmObjR1[m][`partic${i}`]) {
            id = this.bTnmObjR1[m][`partic${i}`].id
            break
          }
        }
      }
      // clearを押したidを活性化
      this.mPartics.forEach(p => {
        if (p.id === id) {
          p.disabled = false
        }
      })
    },
    getTnmObj () {
      const tnmObj = JSON.parse(JSON.stringify(this.tnmObj))
      for (const m of tnmObj.r1) {
        for (let i = 1; i <= 2; i++) {
          if (!m[`partic${i}`] || !m[`partic${i}`].id) {
            alert('未入力の参加者が存在します。')
            return
          }
          delete m[`partic${i}`].disabled
          if (m[`partic${i}`].id === 'del') m[`partic${i}`] = null
        }
      }
      return tnmObj
    }
  }
}
</script>

<style>
@import './tournament.css';
.v-select__selection--comma {
    margin: 0px !important;
    font-size: 12px;
}
.partics .v-text-field * {
    margin: 0px !important;
    font-size: 12px;
}
.partics .v-select__slot * {
    position: initial !important;
}
.partics .v-select__selections * {
    padding-top: 0px !important;
    padding-bottom: 0px !important;
}
.v-select-list > .v-list-item {
    font-size: 12px;
}
</style>
