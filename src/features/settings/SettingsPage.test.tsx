import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

let autoStartEnabled = false;
const enable = vi.fn(async () => {
  autoStartEnabled = true;
});
const disable = vi.fn(async () => {
  autoStartEnabled = false;
});
const isEnabled = vi.fn(async () => autoStartEnabled);

vi.mock("@/lib/env", () => ({ APP_VERSION: "0.1.0", isTauri: () => true }));
vi.mock("@tauri-apps/plugin-autostart", () => ({ enable, disable, isEnabled }));
vi.mock("@tauri-apps/plugin-opener", () => ({ openUrl: vi.fn() }));

const { SettingsPage } = await import("./SettingsPage");
const { useSettings } = await import("@/lib/settings/store");

beforeEach(() => {
  autoStartEnabled = false;
  useSettings.setState({ theme: "light", language: "zh-CN", notifications: true, autoStart: false });
  vi.clearAllMocks();
});

describe("SettingsPage 系统集成", () => {
  it("点开机自启开关会立即翻转并调用 enable()", async () => {
    render(<SettingsPage />);

    const switches = screen.getAllByRole("switch");
    const autoStartSwitch = switches[switches.length - 1];
    expect(autoStartSwitch).toHaveAttribute("aria-checked", "false");

    await userEvent.click(autoStartSwitch!);

    expect(enable).toHaveBeenCalledOnce();
    expect(autoStartSwitch).toHaveAttribute("aria-checked", "true");
  });
});
