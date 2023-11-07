import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as fs from 'fs'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
  ],
  server: {
    //端口号
    host: '0.0.0.0',
    port: 3003,
    https: {
      key: fs.readFileSync(`${__dirname}/example-key.pem`),
      cert: fs.readFileSync(`${__dirname}/example.pem`),
    },
  }
})
