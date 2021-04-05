<template>
  <div>
    <v-row>
      <v-col class="headline">
        <v-icon>
          mdi-clipboard-edit
        </v-icon>
        トーナメント表設定
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div>
          <v-container>
            <v-row>
              <v-col class="gen-title">
                {{ `現在の参加${rctType === 1 ? '者': 'チーム'}数` }}
              </v-col>
              <v-col>
                {{ partics.length }}
              </v-col>
            </v-row>
            <v-row>
              <v-col class="gen-title">
                トーナメント表生成タイプ
              </v-col>
              <v-col>
                <v-switch
                  v-model="randFlg"
                  :label="randFlg ? 'ランダム' : '手動のみ'"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col class="gen-title">
                ポイント表示
                <v-icon small>
                  mdi-help-circle
                </v-icon>
              </v-col>
              <v-col>
                <v-switch
                  v-model="pointFlg"
                  :label="pointFlg ? '表示する' : '表示しない'"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col class="gen-title">
                3位決定戦
              </v-col>
              <v-col>
                <v-switch
                  v-model="pp3rdFlg"
                  :label="pp3rdFlg ? '3位決定戦あり' : '3位決定戦なし'"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col align="center">
                <v-btn
                  rounded
                  color="success"
                  min-width="50%"
                  @click="generate"
                >
                  トーナメント表生成！
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-col>
    </v-row>
    <div v-if="tnmObj">
      <v-row>
        <v-col class="grey lighten-5">
          <v-btn
            rounded
            small
            color="success"
            @click="particsDispFlg = !particsDispFlg"
          >
            {{ `参加${rctType === 1 ? '者': 'チーム'}情報を表示する` }}
          </v-btn>
        </v-col>
      </v-row>
      <transition name="fade">
      <v-row v-show="particsDispFlg">
        <v-col align="center" class="grey lighten-5">
            <v-card>
              <v-card-title>
                {{ `参加${rctType === 1 ? '者': 'チーム'}情報` }}
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="headers"
                  :items="partics"
                  :search="search"
                  :items-per-page="5"
                  item-key="id"
                  disable-sort
                  no-data-text="データがありません。"
                  no-results-text="該当するデータがありません。"
                >
                  <template v-slot:[`item.thumbnail`]="{ item }">
                    <v-img class="user-thumbnail" :src="item.thumbnail.replace('_normal', '')" />
                  </template>
                  <template v-slot:[`item.name`]="{ item }">
                    <a class="link" @click="dispParticInfo(item.id)">{{ item.name }}</a>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
        </v-col>
      </v-row>
      </transition>
      <v-row>
        <v-col>
          <TournamentGenerate :tnm-obj="tnmObj" :drop-down-list="dropDownList" :rand-flg="randFlg" ref="tnmGen" />
        </v-col>
      </v-row>
      <v-row>
        <v-col align="center">
          <v-btn
            rounded
            color="success"
            min-width="50%"
            @click="complete"
          >
            作成完了！
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          {{ output }}
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import TournamentGenerate from '@/components/tournament/TournamentGenerate'
export default {
  name: 'TnmGenerate',
  components: {
    TournamentGenerate
  },
  data () {
    return {
      randFlg: true,
      pointFlg: true,
      pp3rdFlg: true,

      dropDownList: [],
      tnmObj: '',

      search: '',
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'サムネイル', value: 'thumbnail' },
        { text: '名前', value: 'name' }
      ],
      particsDispFlg: false,
      output: ''
    }
  },
  props: {
    partics: {
      type: Array,
      required: true
    },
    rctType: {
      type: Number,
      required: true
    }
  },
  methods: {
    generate () {
      // 初期化
      this.dropDownList = []
      this.tnmObj = null

      this.$nextTick(() => {
        // ドロップダウンメニュー用の配列を作成
        for (const p of this.partics) {
          const partic = new Partic()
          partic.id = p.id
          partic.name = p.name
          this.dropDownList.push(partic)
        }
        if (this.randFlg) {
        // ランダム
          this.dropDownList = this.randSort(this.dropDownList)
        }

        // TnmInfoを生成する
        const tnmInfo = this.createTnmInfo()

        // 参加者をトーナメント表に当て込む
        this.tnmObj = tnmInfo
      })
    },
    randSort (arr) {
      let a = arr.length

      // シャッフルアルゴリズム
      while (a) {
        const j = Math.floor(Math.random() * a)
        const t = arr[--a]
        arr[a] = arr[j]
        arr[j] = t
      }
      return arr
    },
    createTnmInfo () {
      const c = this.dropDownList.length
      const log2 = Math.ceil(Math.log2(c))

      const tnmInfo = {}
      // rn
      const times = {}
      for (let n = 0; n < log2; n++) {
        tnmInfo[`r${n * 1 + 1}`] = this.createMatches(n, log2)

        // time
        times[`r${n * 1 + 1}`] = ''
      }
      tnmInfo.time = times

      // シードアルゴリズム
      const delArr = this.seed(c)
      for (const n in tnmInfo.r1) {
        for (const m of delArr) {
          if (n * 2 === m - 1) {
            // 参加者1を使用しなくする
            tnmInfo.r1[n].partic1.id = 'del'
          }
          if (n * 2 + 1 === m - 1) {
            // 参加者を使用しなくする
            tnmInfo.r1[n].partic2.id = 'del'
          }
        }
      }
      // 参加者をround1に追加
      if (this.randFlg) {
        let ac = 0
        for (const n of tnmInfo.r1) {
          for (let i = 1; i <= 2; i++) {
            if (n[`partic${i}`].id !== 'del') {
              n[`partic${i}`].id = this.dropDownList[ac].id
              n[`partic${i}`].name = this.dropDownList[ac].name
              ac++
            }
          }
        }
      }
      // pp3rd
      if (this.pp3rdFlg) {
        tnmInfo['3rd-pp'] = new Match(
          '3rd',
          null,
          null
        )
      }
      // point
      tnmInfo.point = this.pointFlg

      return tnmInfo
    },
    /**
     * @param n - ラウンド数 - 1
     * @param log2 - 全ラウンド数
     */
    createMatches (n, log2) {
      const matches = []
      // 1ラウンド当たりのマッチ数
      const matchCount = 2 ** (log2 - n) / 2
      for (let i = 0; i < matchCount; i++) {
        matches.push(new Match(
          (n * 1 + 1) + '-' + (i * 1 + 1),
          n === 0 ? new Partic() : null,
          n === 0 ? new Partic() : null
        ))
      }
      return matches
    },
    /**
     * シードで使用しなくなる参加者枠のindexを返却する
     * @param c - 参加者(チーム)数
     * @returns {array} - シードで使用しなくなるindexの配列(indexは1始まりでカウント)
     */
    seed (c) {
      const po2 = 2 ** Math.ceil(Math.log2(c))
      // シードによって不要になるID(+1)の配列
      const delArr = []
      let i = 0
      let lc = 0
      // eslint-disable-next-line no-labels
      loop:
      while (true) {
        const rad = 2 ** i
        let absArr = []
        let a = 0
        for (let n = 0; n < rad; n++) {
          if (lc >= po2 - c) {
            // シード分を配列に追加し終わったらループを抜ける
            // eslint-disable-next-line no-labels
            break loop
          }
          const center = po2 / 2
          const arrLen = delArr.length
          let flg = false
          const id = po2 - (po2 / rad * n)
          // IDが既に配列に追加されている場合は次に進む
          for (let m = 0; m < arrLen; m++) {
            if (delArr[m] === id && !absArr.includes(center - id)) {
              flg = true
              break
            }
          }
          if (!flg) {
            if (a % 2 === 1 && center <= id) {
              // 奇数かつ1つ目の山の場合
              const mt = center - (id - center)
              delArr.push(mt)
              // 中央値との差を配列に追加する
              absArr.push(id - center)
            } else if (absArr.includes(center - id)) {
              // 2つ目の山の場合
              const mt = center + (center - id)
              delArr.push(mt)
            } else {
              // それ以外
              delArr.push(id)
            }
            a++
            lc++
          }
        }
        i++
        absArr = []
      }
      return delArr
    },
    complete () {
      this.output = this.$refs.tnmGen.getTnmObj()
    },
    dispParticInfo () {

    }
  }
}
class Match {
  constructor (mid, partic1, partic2) {
    this.mid = mid
    this.partic1 = partic1
    this.partic2 = partic2
  }
}
class Partic {
  constructor () {
    this.id = null
    this.name = null
    this.win = 0
    this.point = ''
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.gen-title {
  display: flex;
  align-items: center;
}
</style>
