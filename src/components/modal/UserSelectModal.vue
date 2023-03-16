<template>
  <a-modal v-model="userModalVisible">
    <ul class="user-modal-ul">
      <li
        v-for="item in members"
        :key="item.key"
        @click="chooseUser(item)"
      >{{ item.name }}</li>
    </ul>
  </a-modal>
</template>
<script>
export default {
  name: 'userSelectModal',
  data() {
    return {
      userModalVisible: false,
      chosedUser: []
    }
  },
  props: {
    members: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    chooseUser(item) {
      this.chosedUser = []
      this.chosedUser.push(item)
      this.$emit('ok', Array.from(new Set(this.chosedUser)))
      this.userModalVisible = false
    },
    onOpen() {
      this.userModalVisible = true
    }
  } 
}
</script>
<style lang="scss" scoped>
  
</style>