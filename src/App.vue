 <template>
     <div id="app">
        <ul>
            <li><router-link to='/about'>about</router-link></li>
            <li><router-link to='/'>home</router-link></li>
        </ul>
        <router-view></router-view>
     </div>
 </template>

 <script>
 export default {
     name: 'App',
     data() {
         return {
             message: 'edu'
         }
     },
     methods: {
         onClick() {
             console.log('Hello World!')
         }
     }
 }
 </script>