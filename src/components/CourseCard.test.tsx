import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CourseCard from "./CourseCard";
import type { Course } from "../types/index";

// One course, typed with your own Course interface, so a field that
// doesn't exist in Course is a compile error here too.
const course: Course = {
  code: "ITELECT4",
  title: "Web Systems and Technologies",
  units: 3,
  semester: "1st Semester",
};

describe("CourseCard", () => {
  it("shows the code, title, units and semester in the default variant", () => {
    render(<CourseCard course={course} />);

    expect(screen.getByText("ITELECT4")).toBeInTheDocument();
    expect(screen.getByText("Web Systems and Technologies")).toBeInTheDocument();
    expect(screen.getByText("3 units -- 1st Semester")).toBeInTheDocument();
  });

  it("hides the title when the variant is compact", () => {
    render(<CourseCard course={course} variant="compact" />);

    // The code and units line are still there...
    expect(screen.getByText("ITELECT4")).toBeInTheDocument();
    // ...but the title is gone. queryByText returns null instead of throwing.
    expect(
      screen.queryByText("Web Systems and Technologies"),
    ).not.toBeInTheDocument();
  });
});