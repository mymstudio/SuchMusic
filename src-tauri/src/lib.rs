use base64::prelude::*;
use lofty::file::TaggedFileExt;
use lofty::picture::PictureType;
use lofty::tag::Accessor;
use serde::Serialize;
use std::path::Path; // 新增 base64 编码支持

// 扩展 AudioMetadata 结构体以包含图片数据
#[derive(Serialize)]
pub struct AudioMetadata {
    pub title: Option<String>,
    pub artist: Option<String>,
    pub album: Option<String>,
    pub year: Option<u32>,
    pub track: Option<u32>,
    pub genre: Option<String>,
    pub cover: Option<String>, // 用于保存 Base64 编码的图片数据
    pub lyrics: Option<Vec<String>>,
}

#[derive(Serialize)]
pub struct LyricMetadata {
    pub lyrics: Option<Vec<String>>,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn scan_music_files(path: &str) -> Result<Vec<String>, String> {
    let mut music_files = Vec::new();
    if Path::new(path).is_dir() {
        for entry in std::fs::read_dir(path).map_err(|e| e.to_string())? {
            let entry = entry.map_err(|e| e.to_string())?;
            let path = entry.path();

            if path.is_dir() {
                continue;
            }

            if let Some(ext) = path.extension() {
                let ext = ext.to_string_lossy().to_lowercase();
                if ["mp3", "wav", "flac", "ogg", "m4a"].contains(&ext.as_str()) {
                    music_files.push(path.to_string_lossy().into_owned());
                }
            }
        }
    }
    Ok(music_files)
}
use lofty::tag::{ItemKey, ItemValue}; // 新增导入

#[tauri::command]
async fn get_audio_metadata(path: &str) -> Result<AudioMetadata, String> {
    let tagged_file = lofty::read_from_path(path).map_err(|e| e.to_string())?;
    let tag = tagged_file.primary_tag().ok_or("No tag found")?;

    // 提取封面图并转换为 base64
    let cover_data = tag
        .pictures()
        .iter()
        .find(|p| p.pic_type() == PictureType::CoverFront)
        .and_then(|pic| {
            let mime = pic
                .mime_type()
                .map(|m| m.to_string())
                .unwrap_or("image/unknown".to_string());
            let data = pic.data();
            Some(format!(
                "data:{};base64,{}",
                mime,
                BASE64_STANDARD.encode(data)
            ))
        });

    // 使用 items() 遍历标签项获取歌词
    let lyrics = tag
        .items()
        .find(|item| item.key() == &ItemKey::Lyrics)
        .and_then(|item| match item.value() {
            ItemValue::Text(text) => Some(
                text.lines()
                    .filter(|line| !line.contains('{')) // 过滤掉包含"{"的行
                    .map(|s| s.to_string())
                    .collect(),
            ),
            _ => None,
        });
    Ok(AudioMetadata {
        title: tag.title().map(|s| s.to_string()),
        artist: tag.artist().map(|s| s.to_string()),
        album: tag.album().map(|s| s.to_string()),
        year: tag.year(),
        track: tag.track(),
        genre: tag.genre().map(|s| s.to_string()),
        lyrics: lyrics,
        cover: cover_data,
    })
}

use base64::encode;
use std::fs::File;
use std::io::Read;

#[tauri::command]
async fn get_blob_url(path: String) -> Result<String, String> {
    let mut file = File::open(path).map_err(|e| e.to_string())?;
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer).map_err(|e| e.to_string())?;
    let encoded = encode(&buffer);
    Ok(format!("data:audio/mpeg;base64,{}", encoded))
}

// ... existing code ...
#[tauri::command]
async fn download_music(url: String, save_path: String) -> Result<(), String> {
    use std::fs::File;
    use std::io::Write;
    use reqwest::Client;
    
    // 检查父目录权限
    let parent_dir = std::path::Path::new(&save_path)
        .parent()
        .ok_or("无法获取父目录".to_string())?;
        
    if !parent_dir.exists() {
        return Err("父目录不存在".to_string());
    }

    let client = Client::new();
    let response = client.get(&url)
        .send()
        .await
        .map_err(|e| format!("下载请求失败: {}", e))?;
    
    let mut file = File::create(&save_path)
        .map_err(|e| format!("无法创建文件: {}", e))?;
    
    let bytes = response.bytes()
        .await
        .map_err(|e| format!("获取数据失败: {}", e))?;
    
    file.write_all(&bytes)
        .map_err(|e| format!("写入文件失败: {}", e))?;
    
    Ok(())
}
// ... existing code ...
// ... existing code ...
#[tauri::command]
async fn check_directory_permission(path: String) -> Result<bool, String> {
    use std::fs;
    
    // 尝试创建测试文件来验证权限
    let test_file = format!("{}/test_permission.tmp", path);
    match fs::File::create(&test_file) {
        Ok(file) => {
            let _ = fs::remove_file(test_file);
            Ok(true)
        },
        Err(e) if e.kind() == std::io::ErrorKind::PermissionDenied => {
            Ok(false)
        },
        Err(e) => Err(format!("权限检查失败: {}", e))
    }
}

#[tauri::command]
async fn create_subdirectory(parentPath: String, dirName: String) -> Result<String, String> {
    use std::fs;
    use std::path::Path;
    
    let path = Path::new(&parentPath).join(dirName);
    if !path.exists() {
        fs::create_dir_all(&path)
            .map_err(|e| format!("创建目录失败: {}", e))?;
    }
    
    path.to_str()
        .ok_or("路径转换失败".to_string())
        .map(|s| s.to_string())
}
// ... existing code ...


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            create_subdirectory,
            check_directory_permission,
            get_blob_url,
            scan_music_files,
            get_audio_metadata,
            download_music
        ])
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}
