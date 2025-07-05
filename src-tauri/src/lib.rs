use lofty::file::TaggedFileExt;
use std::path::Path;
use lofty::tag::Accessor;
use serde::Serialize;
use lofty::picture::{PictureType};
use base64::prelude::*; // 新增 base64 编码支持

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
#[tauri::command]
async fn get_audio_metadata(path: &str) -> Result<AudioMetadata, String> {
    let tagged_file = lofty::read_from_path(path).map_err(|e| e.to_string())?;
    let tag = tagged_file.primary_tag().ok_or("No tag found")?;

    // 提取封面图并转换为 base64
    // ... existing code ...
// ... existing code ...
let cover_data = tag.pictures()
    .iter()
    .find(|p| p.pic_type() == PictureType::CoverFront)
    .and_then(|pic| {
        let mime = pic.mime_type().map(|m| m.to_string()).unwrap_or("image/unknown".to_string());
        let data = pic.data();
        Some(format!("data:{};base64,{}", mime, BASE64_STANDARD.encode(data)))
    });
// ... existing code ...
// ... existing code ...

    Ok(AudioMetadata {
        title: tag.title().map(|s| s.to_string()),
        artist: tag.artist().map(|s| s.to_string()),
        album: tag.album().map(|s| s.to_string()),
        year: tag.year(),
        track: tag.track(),
        genre: tag.genre().map(|s| s.to_string()),
        cover: cover_data,
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, scan_music_files, get_audio_metadata])
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}