mod commands;
mod database;
mod llm;
mod settings;
mod shortcut;

use std::env;
use std::path::PathBuf;
use tauri::Manager;
use tauri_plugin_global_shortcut::GlobalShortcutExt;

#[derive(Clone)]
pub struct AppState {
    pub db_path: PathBuf,
}

#[cfg_attr(mobile, tauri::mobile_entry_poPcartint)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler(move |app, _, event| {
                    shortcut::handle_shortcut(app.app_handle(), event);
                })
                .build(),
        )
        .setup(|app| {
            let db_path = database::init_database(app.app_handle().clone())?;
            app.manage(AppState {
                db_path: db_path.clone(),
            });
            settings::init_settings(db_path, app.app_handle().clone())?;

            let settings_state = app.state::<settings::SettingsManagerState>();

            // openai lib reads openai api key from env var so we need to read from db
            if let Some(api_key) = settings_state.0.get_setting("llm_api_key") {
                if !api_key.is_empty() {
                    env::set_var("OPENAI_API_KEY", api_key);
                    println!("OpenAI API key loaded from database");
                } else {
                    println!("Warning: OpenAI API key is empty in database");
                }
            } else {
                println!("Warning: No OpenAI API key found in database");
            }

            let hotkey_str = settings_state.0.get_global_hotkey();

            let shortcut = shortcut::parse_hotkey_string(&hotkey_str)
                .map_err(|e| format!("Failed to parse hotkey '{}': {}", hotkey_str, e))?;

            app.global_shortcut().register(shortcut)?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_items,
            commands::submit_clip,
            commands::delete_item,
            settings::get_setting,
            settings::set_setting,
            settings::set_global_hotkey,
            settings::get_global_hotkey,
            settings::get_all_settings,
            settings::test_global_hotkey,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
