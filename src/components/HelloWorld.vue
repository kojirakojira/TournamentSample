<template>
  <v-container>
    <v-row>
      <v-col>
        テスト入力欄
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        参加数
      </v-col>
      <v-col>
        <input type=tel v-model="inputCount" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        1:個人 or 2:チーム
      </v-col>
      <v-col>
        <input type=tel v-model="inputRctType" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="test">反映ボタン</v-btn>
      </v-col>
    </v-row>
    <!-- <TournamentEdit :tnmObj="tnmObj" ref="tnmEdit" /> -->
    <TnmGenerate v-if="dispFlg" :partics="partics" :rct-type="rctType" />
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to Vuetify
        </h1>

        <p class="subheading font-weight-regular">
          For help and collaboration with other Vuetify developers,
          <br>please join our online
          <a
            href="https://community.vuetifyjs.com"
            target="_blank"
          >Discord Community</a>
        </p>
      </v-col>

      <v-col
        class="mb-5"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
          What's next?
        </h2>

        <v-row justify="center">
          <a
            v-for="(next, i) in whatsNext"
            :key="i"
            :href="next.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ next.text }}
          </a>
        </v-row>
      </v-col>

      <v-col
        class="mb-5"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
          Important Links
        </h2>

        <v-row justify="center">
          <a
            v-for="(link, i) in importantLinks"
            :key="i"
            :href="link.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ link.text }}
          </a>
        </v-row>
      </v-col>

      <v-col
        class="mb-5"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
          Ecosystem
        </h2>

        <v-row justify="center">
          <a
            v-for="(eco, i) in ecosystem"
            :key="i"
            :href="eco.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ eco.text }}
          </a>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import TournamentEdit from '@/components/tournament/TournamentEdit'
import TnmGenerate from '@/components/tournament/TnmGenerate'
export default {
  name: 'HelloWorld',
  components: {
    // TournamentEdit,
    TnmGenerate
  },
  beforeMount () {
    const tnmInfo = '{"r1":[{"mid":"1-1","partic1":{"id":"33","name":"あいうえお","win":0,"point":2},"partic2":{"id":"36","name":"あいうえお5","win":0,"point":""}},{"mid":"1-2","partic1":{"id":"33","name":"かきくけこ","win":0,"point":""},"partic2":{"id":"36","name":"かきくけこ5","win":0,"point":""}},{"mid":"1-3","partic1":{"id":"33","name":"さしすせそ","win":0,"point":""},"partic2":{"id":"36","name":"さしすせそ5","win":0,"point":""}},{"mid":"1-4","partic1":{"id":"33","name":"たちつてと","win":0,"point":""},"partic2":{"id":"36","name":"たちつてと5","win":0,"point":""}},{"mid":"1-5","partic1":{"id":"33","name":"なにぬねの","win":0,"point":""},"partic2":{"id":"36","name":"なにぬねの5","win":0,"point":""}},{"mid":"1-6","partic1":{"id":"33","name":"はひふへほ","win":0,"point":""},"partic2":{"id":"36","name":"はひふへほ5","win":0,"point":""}},{"mid":"1-7","partic1":{"id":"33","name":"まもむめも","win":0,"point":""},"partic2":{"id":"36","name":"まもむめも5","win":0,"point":""}},{"mid":"1-8","partic1":{"id":"33","name":"やゆよああ","win":0,"point":""},"partic2":{"id":"36","name":"やゆよああ5","win":0,"point":""}},{"mid":"1-9","partic1":{"id":"33","name":"らりるれろ","win":0,"point":""},"partic2":{"id":"36","name":"らりるれろ5","win":0,"point":""}},{"mid":"1-10","partic1":{"id":"33","name":"わをんああ","win":0,"point":""},"partic2":{"id":"36","name":"わをんああ5","win":0,"point":""}},{"mid":"1-11","partic1":{"id":"33","name":"あいうえお2","win":0,"point":""},"partic2":{"id":"36","name":"あいうえお6","win":0,"point":""}},{"mid":"1-12","partic1":{"id":"33","name":"かきくけこ2","win":0,"point":""},"partic2":{"id":"36","name":"かきくけこ6","win":0,"point":""}},{"mid":"1-13","partic1":{"id":"33","name":"さしすせそ2","win":0,"point":""},"partic2":{"id":"36","name":"さしすせそ6","win":0,"point":""}},{"mid":"1-14","partic1":{"id":"33","name":"たちつてと2","win":0,"point":""},"partic2":{"id":"36","name":"たちつてと6","win":0,"point":""}},{"mid":"1-15","partic1":{"id":"33","name":"なにぬねの2","win":0,"point":""},"partic2":{"id":"36","name":"なにぬねの6","win":0,"point":""}},{"mid":"1-16","partic1":{"id":"33","name":"はひふへほ2","win":0,"point":""},"partic2":{"id":"36","name":"はひふへほ6","win":0,"point":""}},{"mid":"1-17","partic1":{"id":"33","name":"まみむめも2","win":0,"point":""},"partic2":{"id":"36","name":"まみむめも6","win":0,"point":""}},{"mid":"1-18","partic1":{"id":"33","name":"やゆよああ2","win":0,"point":""},"partic2":{"id":"36","name":"やゆよああ6","win":0,"point":""}},{"mid":"1-19","partic1":{"id":"33","name":"らりるれろ2","win":0,"point":""},"partic2":{"id":"36","name":"らりるれろ6","win":0,"point":""}},{"mid":"1-20","partic1":{"id":"33","name":"わをんああ2","win":0,"point":""},"partic2":{"id":"36","name":"わをんああ6","win":0,"point":""}},{"mid":"1-21","partic1":{"id":"33","name":"あいうえお3","win":0,"point":""},"partic2":{"id":"36","name":"あいうえお7","win":0,"point":""}},{"mid":"1-22","partic1":{"id":"33","name":"かきくけこ3","win":0,"point":""},"partic2":{"id":"36","name":"かきくけこ7","win":0,"point":""}},{"mid":"1-23","partic1":{"id":"33","name":"さしすせそ3","win":0,"point":""},"partic2":{"id":"36","name":"さしすせそ7","win":0,"point":""}},{"mid":"1-24","partic1":{"id":"33","name":"たちつてと3","win":0,"point":""},"partic2":{"id":"36","name":"たちつてと7","win":0,"point":""}},{"mid":"1-25","partic1":{"id":"33","name":"なにぬねの3","win":0,"point":""},"partic2":{"id":"36","name":"なにぬねの7","win":0,"point":""}},{"mid":"1-26","partic1":{"id":"33","name":"はひふへほ3","win":0,"point":""},"partic2":{"id":"36","name":"はひふへほ7","win":0,"point":""}},{"mid":"1-27","partic1":{"id":"33","name":"まみむめも3","win":0,"point":""},"partic2":{"id":"36","name":"まみむめも7","win":0,"point":""}},{"mid":"1-28","partic1":{"id":"33","name":"やゆよああ3","win":0,"point":""},"partic2":{"id":"36","name":"やゆよああ7","win":0,"point":""}},{"mid":"1-29","partic1":{"id":"33","name":"らりるれろ3","win":0,"point":""},"partic2":{"id":"36","name":"らりるれろ7","win":0,"point":""}},{"mid":"1-30","partic1":{"id":"33","name":"わをんああ3","win":0,"point":""},"partic2":{"id":"36","name":"わをんああ7","win":0,"point":""}},{"mid":"1-31","partic1":{"id":"33","name":"あいうえお4","win":0,"point":""},"partic2":{"id":"36","name":"あいうえお8","win":0,"point":""}},{"mid":"1-32","partic1":{"id":"33","name":"かきくけこ4","win":0,"point":""},"partic2":{"id":"36","name":"かきくけこ8","win":0,"point":""}}],"r2":[{"mid":"2-1","partic1":null,"partic2":null},{"mid":"2-2","partic1":null,"partic2":null},{"mid":"2-3","partic1":null,"partic2":null},{"mid":"2-4","partic1":null,"partic2":null},{"mid":"2-5","partic1":null,"partic2":null},{"mid":"2-6","partic1":null,"partic2":null},{"mid":"2-7","partic1":null,"partic2":null},{"mid":"2-8","partic1":null,"partic2":null},{"mid":"2-9","partic1":null,"partic2":null},{"mid":"2-10","partic1":null,"partic2":null},{"mid":"2-11","partic1":null,"partic2":null},{"mid":"2-12","partic1":null,"partic2":null},{"mid":"2-13","partic1":null,"partic2":null},{"mid":"2-14","partic1":null,"partic2":null},{"mid":"2-15","partic1":null,"partic2":null},{"mid":"2-16","partic1":null,"partic2":null}],"r3":[{"mid":"3-1","partic1":null,"partic2":null},{"mid":"3-2","partic1":null,"partic2":null},{"mid":"3-3","partic1":null,"partic2":null},{"mid":"3-4","partic1":null,"partic2":null},{"mid":"3-5","partic1":null,"partic2":null},{"mid":"3-6","partic1":null,"partic2":null},{"mid":"3-7","partic1":null,"partic2":null},{"mid":"3-8","partic1":null,"partic2":null}],"r4":[{"mid":"4-1","partic1":null,"partic2":null},{"mid":"4-2","partic1":null,"partic2":null},{"mid":"4-3","partic1":null,"partic2":null},{"mid":"4-4","partic1":null,"partic2":null}],"r5":[{"mid":"5-1","partic1":null,"partic2":null},{"mid":"5-2","partic1":null,"partic2":null}],"r6":[{"mid":"6-1","partic1":null,"partic2":null}],"3rd-pp":{"mid":"3rd-1","partic1":null,"partic2":null},"time":{"r1":"3/28 3:50","r2":"3/29 3:50","r3":"3/30 3:50","r4":"3/31 3:50","r5":"4/1 3:50","r6":"4/2 3:50","r7":"4/3 3:50"},"point":true}'
    this.tnmObj = JSON.parse(tnmInfo)
    const partics = []
    for (let i = 0; i < this.count; i++) {
      partics.push({
        id: i + 1,
        name: 'テストデータ' + (i * 1 + 1),
        thumbnail: ''
      })
    }
    this.partics.push(...partics)
  },
  data: () => ({
    ecosystem: [
      {
        text: 'vuetify-loader',
        href: 'https://github.com/vuetifyjs/vuetify-loader'
      },
      {
        text: 'github',
        href: 'https://github.com/vuetifyjs/vuetify'
      },
      {
        text: 'awesome-vuetify',
        href: 'https://github.com/vuetifyjs/awesome-vuetify'
      }
    ],
    importantLinks: [
      {
        text: 'Documentation',
        href: 'https://vuetifyjs.com'
      },
      {
        text: 'Chat',
        href: 'https://community.vuetifyjs.com'
      },
      {
        text: 'Made with Vuetify',
        href: 'https://madewithvuejs.com/vuetify'
      },
      {
        text: 'Twitter',
        href: 'https://twitter.com/vuetifyjs'
      },
      {
        text: 'Articles',
        href: 'https://medium.com/vuetify'
      }
    ],
    whatsNext: [
      {
        text: 'Explore components',
        href: 'https://vuetifyjs.com/components/api-explorer'
      },
      {
        text: 'Select a layout',
        href: 'https://vuetifyjs.com/getting-started/pre-made-layouts'
      },
      {
        text: 'Frequently Asked Questions',
        href: 'https://vuetifyjs.com/getting-started/frequently-asked-questions'
      }
    ],
    tnmObj: {},
    partics: [],

    count: 16,
    rctType: 1,
    dispFlg: true,

    inputCount: 16,
    inputRctType: 1
  }),
  methods: {
    test () {
      this.count = this.inputCount * 1
      this.rctType = this.inputRctType * 1
      this.dispFlg = false
      this.partics = []
      const partics = []
      for (let i = 0; i < this.count; i++) {
        partics.push({
          id: i + 1,
          name: 'テストデータ' + (i * 1 + 1),
          thumbnail: ''
        })
      }
      this.partics.push(...partics)
      this.dispFlg = true
    }
  }
}
</script>
