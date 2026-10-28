import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskCoachPage from "./TaskCoachPage";

// Put fetch back after every test, so a spy can't leak into the next one
afterEach(() => {
  vi.restoreAllMocks();
});

describe("TaskCoachPage", () => {
  it("shows the schema message and sends nothing when the task is too short", async () => {
    // Watch fetch without stopping it. If the form got past the schema,
    // handleMakePlan would call fetch and this spy would count it.
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const user = userEvent.setup();
    render(<TaskCoachPage />);

    await user.type(screen.getByLabelText("Your task"), "Study");
    await user.click(screen.getByRole("button", { name: "Make my plan" }));

    // The exact sentence from src/schemas/taskSchema.ts
    expect(
      await screen.findByText("Describe your task in at least 20 characters."),
    ).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});