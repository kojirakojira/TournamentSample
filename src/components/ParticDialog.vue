<template>
  <v-card>
    <v-card-title class="primary">
      <v-btn icon dark @click="close">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <div style="margin-left:5px; color:white;">
        参加者情報
      </div>
    </v-card-title>
    <v-card-text>
      <div style="width: 100%">
        <v-container>
          <div class="subtitle-1">
            <v-row>
                <v-col>
                    {{ id }}
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    {{ name }}
                </v-col>
            </v-row>
          </div>
        </v-container>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>

export default {
  name: 'ParticDialog',
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  watch: {
    userId () {
      // 再度別の情報でダイアログが開かれた場合、情報を更新する
      this.isLoading = true
      this.get()
      this.isLoading = false
    }
  },
  mounted () {
    this.get()
  },
  methods: {
    get () {
    //   this.isLoginUser = this.userId === this.loginUserId
    //   if (this.userId) {
    //     await axios
    //       .get(process.env.VUE_APP_API_URL + '/api/userAccount', {
    //         headers: {
    //           Authorization: this.$store.getters.jwt
    //         },
    //         params: {
    //           userId: this.userId,
    //           loginUserId: this.loginUserId
    //         }
    //       })
    //       .then((res) => {
    //         this.user = res.data

    //         this.user.followFlg = res.data.followFlg
    //         this.isLoading = false
    //       })
    //       .catch((err) => {
    //         if (err.response.status !== 401) {
    //           alert('何らかのエラーが発生しました。')
    //           this.$router.push({ name: 'home' })
    //         }
    //         this.tokenExpired(err)
    //       })
    //   } else {
    //     alert('不正な操作が行われました。')
    //     this.$router.push({ name: 'home' })
    //   }
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
