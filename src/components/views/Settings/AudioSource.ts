import { ref } from 'vue'

/**
 * 音源插件标准接口
 * @author 酶游明
 * @version 1.0.0
 */
export interface AudioSourcePlugin {
    id: string;
    name: string;
    version: string;
    author: string;
    url?: string;
    source: string[]; // 支持的音源平台，如 ["wyy", "qq"]
    initialization: () => boolean | Promise<boolean>;
    search: (source: string, keyword: string, page: number, pageSize: number) => Promise<{
        code: boolean;
        data?: any[];
        error?: string;
        msg?: string; // 新增msg字段
    }>;
    getMusicUrl: (source: string, musicId: string) => Promise<{
        code: boolean;
        music_id?: string;
        music_name?: string;
        music_url?: string;
        music_author?: string | string[];
        music_pic?: string;
        music_album?: string;
        music_lrc?: string;
        music_translationlrc?: string;
        error?: string;
    }>;
    notify?: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string, duration?: number, sourcename?: string) => void;
}


// 修改音频源管理为全局状态
export const audioSources = ref<AudioSourcePlugin[]>(JSON.parse(localStorage.getItem('audioSources') || '[]'))
export const activeSourceId = ref<string>(localStorage.getItem('activeSourceId') || 'default')

// 修改读取方法// ... existing code ...

export const loadAudioSources = () => {
    const stored = localStorage.getItem('audioSources');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            // 重建函数
            audioSources.value = parsed.map((source: any) => {
                const newSource = {
                    ...source,
                    initialization: eval(`(${source.initialization})`),
                    search: eval(`(${source.search})`),
                    getMusicUrl: eval(`(${source.getMusicUrl})`)
                };
                // 重新初始化音源
                newSource.initialization();
                return newSource;
            });
        } catch (e) {
            console.error('音源加载失败:', e);
        }
    }
}

export const addAudioSource = (source: AudioSourcePlugin) => {
    if (!audioSources.value.some(s => s.id === source.id)) {
        // 初始化音源
        source.initialization();

        audioSources.value.push(source);
        // 使用特殊方式存储到localStorage
        localStorage.setItem('audioSources', JSON.stringify(audioSources.value, (key, value) => {
            return typeof value === 'function' ? value.toString() : value;
        }));
        loadAudioSources();
    }
}
// ... existing code ...

/**
 * 音源解析器
 */
export class AudioSourceParser {
    /**
     * 从文件内容解析音源插件
     * @param fileContent .js 文件内容
     * @returns 解析后的音源插件对象
     * @throws 如果解析失败或格式不符合要求，抛出错误
     */
    private static async parseFromJsContent(content: string, notification: any): Promise<AudioSourcePlugin> {
        return new Promise((resolve, reject) => {
            try {
                // 创建临时script标签执行JS代码
                const script = document.createElement('script')
                script.text = content
                document.body.appendChild(script)

                // 检查是否定义了window.source
                if (!(window as any).source) {
                    throw new Error('音源文件必须定义window.source对象')
                }

                const source = (window as any).source
                this.validateSource(source)

                // 保存原始方法
                const originalSearch = source.search;
                const originalGetMusicUrl = source.getMusicUrl;

                // 注入通知方法并包装原始方法
                source.notify = (type: string, title: string, message: string) => {
                    notification?.[type]({
                        title,
                        content: message,
                        duration: 3000
                    })
                }

                // 包装搜索方法
                source.search = async (...args: any[]) => {
                    try {
                        const result = await originalSearch.apply(source, args);
                        source.notify?.('success', '搜索成功', `成功搜索到${result.data?.length || 0}条结果`);
                        return result;
                    } catch (error) {
                        source.notify?.('error', '搜索失败', error.message);
                        throw error;
                    }
                }

                // 包装获取音乐URL方法
                source.getMusicUrl = async (...args: any[]) => {
                    try {
                        const result = await originalGetMusicUrl.apply(source, args);
                        source.notify?.('success', '获取成功', `成功获取音乐URL: ${result.music_url}`);
                        return result;
                    } catch (error) {
                        source.notify?.('error', '获取失败', error.message);
                        throw error;
                    }
                }

                // 移除临时script
                document.body.removeChild(script)

                // 初始化音源
                const initResult = source.initialization()
                if (initResult instanceof Promise) {
                    initResult.then(result => {
                        if (!result) throw new Error('音源初始化失败')
                        resolve(source)
                    }).catch(reject)
                } else if (!initResult) {
                    throw new Error('音源初始化失败')
                } else {
                    resolve(source)
                }
            } catch (error) {
                reject(error)
            }
        })
    }
    /**
     * 验证音源对象是否符合标准格式
     */
    private static validateSource(source: any): asserts source is AudioSourcePlugin {
        const requiredFields = ['id', 'name', 'version', 'author', 'source', 'initialization', 'search', 'getMusicUrl'];
        for (const field of requiredFields) {
            if (!(field in source)) {
                throw new Error(`音源格式错误：缺少必填字段 "${field}"`);
            }
        }

        // 检查方法是否为函数
        const requiredMethods = ['initialization', 'search', 'getMusicUrl'];
        for (const method of requiredMethods) {
            if (typeof source[method] !== 'function') {
                throw new Error(`音源格式错误："${method}" 必须是函数`);
            }
        }

        // 检查 source 是否为数组
        if (!Array.isArray(source.source)) {
            throw new Error('音源格式错误："source" 必须是字符串数组');
        }
    }

    /**
     * 从文件对象异步解析音源
     */
    static async parseFromFile(file: File, notification?: any): Promise<AudioSourcePlugin> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target?.result as string;
                    const source = this.parseFromJsContent(content, notification || {
                        success: (options: any) => console.log('成功:', options),
                        error: (options: any) => console.error('错误:', options),
                        info: (options: any) => console.info('信息:', options),
                        warning: (options: any) => console.warn('警告:', options)
                    });
                    resolve(source);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => {
                reject(new Error('文件读取失败'));
            };
            reader.readAsText(file);
        });
    }
}