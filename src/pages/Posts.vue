<template>
    <div>
        <h1>Post List</h1>
        <li v-for="post in posts" :key='post.id'>{{ post.title }}</li>
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
export default {
    data() {
        return {
            // posts: []
        }
    },
    computed: {
        ...mapState(['posts'])
    },
    async serverPrefetch() {
        return await this.getPosts()
    },
    methods: {
        ...mapActions(['getPosts'])
    }
}
</script>