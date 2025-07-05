import { defineStore } from 'pinia';
import axios from 'axios';
export const useSearchStore = defineStore('search', {
    state: () => ({
        topAlbums: [],
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

                const response = await axios.get('https://ncm.nekogan.com/cloudsearch', {
                    params: {
                        keywords: this.query,
                    },
                });
                console.log(response.data.result); // 查看真实数据结构
                this.topAlbums = response.data.result.songs;
            } catch (err) {
                this.error = err;
                console.error(err);
            } finally {
                this.loading = false;
            }
        },
    },
});