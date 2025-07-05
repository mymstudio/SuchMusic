// src/stores/audio.ts
import { defineStore } from 'pinia';

export const useAudioStore = defineStore('audio', {
    state: () => ({
        audioContext: null as AudioContext | null,
        currentSource: null as AudioBufferSourceNode | null,
        analyser: null as AnalyserNode | null,
        gainNode: null as GainNode | null,
        buffers: {} as Record<string, AudioBuffer>, // 缓存已加载的音频
        isPlaying: false,
        volume: 1.0, // 音量 0~1
        currentSongUrl: null as string | null,
        currentMetadata: null as MediaMetadata | null,
        currentTime: 0,
        duration: 0,
        hiddenAudio: null as HTMLAudioElement | null,

        buffer: null as AudioBuffer | null,
    }),
    actions: {

        setMediaSessionMetadata(title: string, artist: string, album: string, artworkUrl: string) {
            if ('mediaSession' in navigator) {
                this.currentMetadata = new MediaMetadata({
                    title,
                    artist,
                    album,
                    artwork: [
                        { src: artworkUrl, sizes: '512x512', type: 'image/png' },
                    ],
                });

                navigator.mediaSession.metadata = this.currentMetadata;
            }
        },
        initialize() {
            if (this.audioContext) {
                try {
                    if (this.audioContext.state !== 'closed') {
                        this.audioContext.close();
                    }
                } catch (e) {
                    console.warn('关闭旧 AudioContext 失败:', e);
                }
            }

            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);
            this.gainNode.gain.value = 0.5;
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.analyser.connect(this.gainNode);
        },

        async fetchAndDecodeAudio(url: string): Promise<AudioBuffer> {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            return await this.audioContext.decodeAudioData(arrayBuffer);
        },

        async playAudio(url: string, hiddenAudioElement?: HTMLAudioElement) {
            this.initialize();

            try {
                let buffer = this.buffers[url];
                if (!buffer) {
                    const arrayBuffer = await (await fetch(url)).arrayBuffer();
                    buffer = await this.audioContext.decodeAudioData(arrayBuffer);
                    this.buffers[url] = buffer;
                }

                this.duration = buffer.duration;
                this.isPlaying = true;
                this.currentSongUrl = url;

                const source = this.audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(this.analyser!);
                source.connect(this.gainNode!);

                source.start(0);
                this.currentSource = source;

                // 同步更新隐藏的 <audio> 元素（如果存在）
                if (hiddenAudioElement) {
                    hiddenAudioElement.volume = 0; // 设置音量为 0
                    hiddenAudioElement.src = url;
                    await hiddenAudioElement.play(); // 触发 mediaSession 显示
                }

                // 设置 action handler
                if ('mediaSession' in navigator) {
                    navigator.mediaSession.setActionHandler('play', () => {
                        this.togglePlayPause();
                        if (hiddenAudioElement) hiddenAudioElement.play();
                    });

                    navigator.mediaSession.setActionHandler('pause', () => {
                        this.pause();
                        if (hiddenAudioElement) hiddenAudioElement.pause();
                    });

                }

                // 手动更新时间
                this.startUpdatingTime();

                // 监听播放结束
                source.onended = () => {
                    this.isPlaying = false;
                    this.currentTime = 0;
                    if (hiddenAudioElement) hiddenAudioElement.pause();
                };

            } catch (err) {
                console.error('❌ 加载或播放失败:', err);
                this.isPlaying = false;
                if (hiddenAudioElement) hiddenAudioElement.pause();
            }
        },

        startUpdatingTime() {
            const startTime = this.audioContext.currentTime;

            const update = () => {
                if (this.isPlaying && this.currentSource) {
                    this.currentTime = this.audioContext.currentTime - startTime;
                }

                if (this.isPlaying) {
                    requestAnimationFrame(update);
                }
            };

            update();
        },

        togglePlayPause() {
            if (this.isPlaying) {
                this.pause();
            } else {
                if (this.currentSource && this.audioContext) {
                    // 重新启动 AudioContext（有些浏览器会在暂停后挂起）
                    this.audioContext.resume().then(() => {
                        // 从当前时间继续播放
                        const startTime = this.audioContext.currentTime - this.currentTime;
                        const source = this.audioContext.createBufferSource();
                        source.buffer = this.buffer;
                        source.connect(this.analyser!);
                        source.connect(this.gainNode!);

                        source.start(0, this.currentTime); // 从当前进度继续播放
                        this.currentSource = source;

                        this.isPlaying = true;
                        this.startUpdatingTime();
                    });
                } else if (this.currentSongUrl) {
                    // 如果没有 source，则正常播放新歌曲
                    this.playAudio(this.currentSongUrl);
                }
            }
        },

        pause() {
            if (this.currentSource) {
                this.currentSource.stop(); // 停止当前播放
                this.currentSource.disconnect();
                //this.currentSource = null;
                this.isPlaying = false;

                if (hiddenAudioElement && !hiddenAudioElement.ended) {
                    hiddenAudioElement.pause();
                }
            }
        },

        setVolume(volume: number) {
            this.volume = Math.max(0, Math.min(1, volume));
            if (this.gainNode) {
                this.gainNode.gain.value = this.volume;
            }
        },

        seekTo(time: number) {
            if (!this.buffer) return;

            if (this.currentSource) {
                this.currentSource.stop(); // 停止当前播放
                this.currentSource.disconnect();
            }

            const source = this.audioContext.createBufferSource();
            source.buffer = this.buffer;
            source.connect(this.analyser!);
            source.connect(this.gainNode!);

            // 设置播放起点
            source.start(0, time);
            this.currentSource = source;

            // 更新时间
            const startTime = this.audioContext.currentTime;
            const offsetTime = time;

            const update = () => {
                if (this.isPlaying) {
                    this.currentTime = this.audioContext.currentTime - startTime + offsetTime;
                    requestAnimationFrame(update);
                }
            };
            update();
        },
    },
});