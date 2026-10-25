use std::sync::Mutex;

use serde_json::Value;
use tauri::{
    AppHandle, Emitter, Manager, RunEvent, WindowEvent,
    menu::{Menu, MenuItem, PredefinedMenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
};
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_log::log;

const TRAY_ID: &str = "main-tray";
const LOCALE_ZH: &str = include_str!("../../src/locales/zh-CN.json");
const LOCALE_EN: &str = include_str!("../../src/locales/en.json");

static TRAY_LOCALE: Mutex<&'static str> = Mutex::new("zh-CN");

fn locale_table(lang: &str) -> &'static str {
    if lang == "en" { LOCALE_EN } else { LOCALE_ZH }
}

fn translate(lang: &str, key: &str) -> String {
    let parsed: Value = serde_json::from_str(locale_table(lang)).unwrap_or(Value::Null);
    let mut cursor = &parsed;
    for segment in key.split('.') {
        cursor = match cursor.get(segment) {
            Some(next) => next,
            None => return key.to_string(),
        };
    }
    cursor
        .as_str()
        .map(str::to_string)
        .unwrap_or_else(|| key.to_string())
}

fn current_lang() -> &'static str {
    *TRAY_LOCALE
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner())
}

fn show_main(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.unminimize();
        let _ = window.show();
        let _ = window.set_focus();
    }
}

fn tray_menu(app: &AppHandle, lang: &str) -> tauri::Result<Menu<tauri::Wry>> {
    let show = MenuItem::with_id(
        app,
        "show",
        translate(lang, "tray.show"),
        true,
        None::<&str>,
    )?;
    let settings = MenuItem::with_id(
        app,
        "settings",
        translate(lang, "tray.settings"),
        true,
        None::<&str>,
    )?;
    let quit = MenuItem::with_id(
        app,
        "quit",
        translate(lang, "tray.quit"),
        true,
        None::<&str>,
    )?;
    let separator = PredefinedMenuItem::separator(app)?;

    Menu::with_items(app, &[&show, &settings, &separator, &quit])
}

fn replace_tray_menu(app: &AppHandle, lang: &str) -> Result<(), String> {
    let menu = tray_menu(app, lang).map_err(|error| error.to_string())?;
    let tray = app.tray_by_id(TRAY_ID).ok_or("tray is not ready")?;
    tray.set_menu(Some(menu)).map_err(|error| error.to_string())
}

#[tauri::command]
fn set_locale(app: AppHandle, lang: String) -> Result<(), String> {
    let next = if lang == "en" { "en" } else { "zh-CN" };
    {
        let mut current = TRAY_LOCALE
            .lock()
            .map_err(|_| "locale lock poisoned".to_string())?;
        *current = next;
    }
    replace_tray_menu(&app, next)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
            show_main(app);
        }))
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            None,
        ))
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(
            tauri_plugin_log::Builder::new()
                .level(log::LevelFilter::Info)
                .build(),
        )
        .setup(|app| {
            let menu = tray_menu(app.handle(), current_lang())?;
            let mut builder = TrayIconBuilder::with_id(TRAY_ID)
                .menu(&menu)
                .show_menu_on_left_click(false)
                .icon_as_template(cfg!(target_os = "macos"))
                .tooltip("Tauri Template")
                .on_menu_event(|app, event| match event.id().as_ref() {
                    "show" => show_main(app),
                    "settings" => {
                        show_main(app);
                        let _ = app.emit("navigate", "/settings");
                    }
                    "quit" => app.exit(0),
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        show_main(tray.app_handle());
                    }
                });

            if let Some(icon) = app.default_window_icon() {
                builder = builder.icon(icon.clone());
            }

            builder.build(app)?;
            log::info!("app started, tray ready");
            Ok(())
        })
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                let _ = window.hide();
            }
        })
        .invoke_handler(tauri::generate_handler![set_locale])
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(|app_handle, event| {
        #[cfg(target_os = "macos")]
        if let RunEvent::Reopen { .. } = event {
            show_main(app_handle);
        }
        #[cfg(not(target_os = "macos"))]
        {
            let _ = (app_handle, event);
        }
    });
}

#[cfg(test)]
mod tests {
    use super::translate;

    #[test]
    fn reads_tray_labels_from_shared_locales() {
        assert_eq!(translate("zh-CN", "tray.show"), "显示主窗口");
        assert_eq!(translate("en", "tray.show"), "Show Main Window");
    }

    #[test]
    fn falls_back_to_key_when_missing() {
        assert_eq!(translate("en", "tray.missing"), "tray.missing");
    }
}
