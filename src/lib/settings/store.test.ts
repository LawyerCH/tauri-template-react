import { beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS, useSettings } from "./store";

describe("settings store", () => {
  beforeEach(() => {
    useSettings.getState().reset();
  });

  it("starts from defaults", () => {
    expect(useSettings.getState().theme).toBe(DEFAULT_SETTINGS.theme);
    expect(useSettings.getState().language).toBe(DEFAULT_SETTINGS.language);
  });

  it("updates theme", () => {
    useSettings.getState().setTheme("dark");
    expect(useSettings.getState().theme).toBe("dark");
  });

  it("updates language", () => {
    useSettings.getState().setLanguage("en");
    expect(useSettings.getState().language).toBe("en");
  });
});
