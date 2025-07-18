import { defineStore } from 'pinia';
import axios from 'axios';
export const useSearchStore = defineStore('search', {
    state: () => ({
        topAlbums: [],
        songs: [],
        loading: false,
        error: null,
        query: '',
    }),
    actions: {
        async fetchTopAlbums(keywords) {
            this.loading = true;
            this.query = keywords
            this.error = null;
            console.log(this.query)
            try {

                const response = await axios.get('https://zm.armoe.cn/cloudsearch', {
                    params: {
                        keywords: this.query,
                    },
                });
                console.log(response.data.result); // 查看真实数据结构
                this.songs = response.data.result.songs;
            } catch (err) {
                this.error = err;
                console.error(err);
            } finally {
                this.loading = false;
            }
        },
        async fetchTopAlbumsA(keywords) {
            this.loading = true;
            this.query = keywords
            this.error = null;
            console.log(this.query)
            try {

                const response = await axios.get('https://zm.armoe.cn/top/album?offset=0&limit=30', {
                    params: {
                        keywords: this.query,
                    },
                });
                console.log(response.data.weekData); // 查看真实数据结构
                this.topAlbums = response.data.weekData;
            } catch (err) {
                this.error = err;
                console.error(err);
            } finally {
                this.loading = false;
            }
        },
    },
});