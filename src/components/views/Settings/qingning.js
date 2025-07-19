window.source = {
  id: "Qingning",
  name: "青柠音源",
  version: "1.0.0",
  author: "酶游明",
  url: "Qingning",
  source: ["qq", "wyy"],
  initialization: function () {
    if (this.notify) {
      this.notify('warning', '（自定义消息）青柠音源初始化中...','请稍等')
    }
    return true;
  },
  search: async function (source, keyword, page, page_size) {
    var data = await fetch(
      "https://www.lihouse.xyz/coco_widget/music_resource/info?key=" +
      keyword +
      "&page=" +
      page +
      "&limit=" +
      page_size
    );
    if (!data.ok) {
      if (this.notify) {
        this.notify('error', '搜索失败: ' + error.message, 5000, source.name)
      }
      return { code: false, error: "请求错误" };
    }
    data = await data.json();
    console.log(data);
    if (data.status) {
      const a = [];
      const promises = data.song_data.map(async (item) => {
        try {
          const detailRes = await fetch(
            `https://coco.codemao.cn/http-widget-proxy/https://music.163.com/api/song/detail?ids=[${item.id}]`
          );
          const detailData = await detailRes.json();
          const hdCover = detailData.songs[0].album.picUrl + "?param=1080y1080";
          return {
            music_name: item.name,
            music_author: item.artist.join(","),
            music_pic: hdCover,
            music_album: item.album,
            music_id: item.id,
          };
        } catch (error) {
          console.error("获取高清封面失败:", error);
          return {
            music_name: item.name,
            music_author: item.artist.join(","),
            music_pic: item.pic,
            music_album: item.album,
            music_id: item.id,
          };
        }
      });
      const results = await Promise.all(promises);
      return { code: true, data: results };
    } else {
      if (this.notify) {
        this.notify('error', '搜索失败: ' + error.message, 5000, source.name)
      }
      return { code: false, error: "请求错误" };
    }
  },
  getMusicUrl: async function (source, music_id) {
    var data = await fetch(
      "https://www.lihouse.xyz/coco_widget/music_resource/id/" + music_id
    );
    if (!data.ok) {
      return { code: false, error: "请求错误" };
    }
    data = await data.json();
    if (data.status) {
      try {
        const detailRes = await fetch(
          `https://coco.codemao.cn/http-widget-proxy/https://music.163.com/api/song/detail?ids=[${music_id}]`
        );
        const detailData = await detailRes.json();
        const hdCover = detailData.songs[0].album.picUrl + "?param=1080y1080";
        return {
          code: true,
          music_id: data.song_data.id,
          music_name: data.song_data.name,
          music_url: data.song_data.url,
          music_author: data.song_data.artist,
          music_pic: hdCover,
          music_album: data.song_data.album,
          music_lrc: data.song_data.lyric,
          music_translationlrc: "",
        };
      } catch (error) {
        console.error("获取高清封面失败:", error);
        return {
          code: true,
          music_id: data.song_data.id,
          music_name: data.song_data.name,
          music_url: data.song_data.url,
          music_author: data.song_data.artist,
          music_pic: data.song_data.pic,
          music_album: data.song_data.album,
          music_lrc: data.song_data.lyric,
          music_translationlrc: "",
        };
      }
    } else {
      return { code: false, error: "请求错误" };
    }
  },
};
