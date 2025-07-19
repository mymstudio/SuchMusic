window.source = {
  id: "Such",
  name: "Such",
  version: "1.1.1",
  author: "Such开发组",
  url: "Such",
  source: ["wyy"],
  initialization: function () {
    return true;
  },
  search: async function (source, keyword, page, page_size) {
    if (this.notify) {
        this.notify('info', `正在搜索: ${keyword}`)
      }
    var data = await fetch(
      "https://www.lihouse.xyz/coco_widget/music_resource/info?key=" +
        keyword +
        "&page=" +
        page +
        "&limit=" +
        page_size
    );
    if (!data.ok) {
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
