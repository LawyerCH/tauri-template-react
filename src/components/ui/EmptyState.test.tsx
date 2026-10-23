import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(<EmptyState title="还没有任务" description="输入一条任务即可开始。" />);

    expect(screen.getByText("还没有任务")).toBeInTheDocument();
    expect(screen.getByText("输入一条任务即可开始。")).toBeInTheDocument();
  });
});
