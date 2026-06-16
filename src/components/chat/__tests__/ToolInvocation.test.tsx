import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocation, getToolMessage } from "../ToolInvocation";

afterEach(() => {
  cleanup();
});

// --- getToolMessage ---------------------------------------------------------

test("getToolMessage: str_replace_editor create names the file", () => {
  expect(
    getToolMessage("str_replace_editor", {
      command: "create",
      path: "/components/Card.jsx",
    })
  ).toBe("Creating Card.jsx");
});

test("getToolMessage: str_replace_editor str_replace says Editing", () => {
  expect(
    getToolMessage("str_replace_editor", {
      command: "str_replace",
      path: "/App.jsx",
    })
  ).toBe("Editing App.jsx");
});

test("getToolMessage: str_replace_editor insert says Editing", () => {
  expect(
    getToolMessage("str_replace_editor", {
      command: "insert",
      path: "/components/Button.tsx",
    })
  ).toBe("Editing Button.tsx");
});

test("getToolMessage: str_replace_editor view says Viewing", () => {
  expect(
    getToolMessage("str_replace_editor", {
      command: "view",
      path: "/components/Card.jsx",
    })
  ).toBe("Viewing Card.jsx");
});

test("getToolMessage: file_manager rename names both files", () => {
  expect(
    getToolMessage("file_manager", {
      command: "rename",
      path: "/components/Old.jsx",
      new_path: "/components/New.jsx",
    })
  ).toBe("Renaming Old.jsx to New.jsx");
});

test("getToolMessage: file_manager delete names the file", () => {
  expect(
    getToolMessage("file_manager", {
      command: "delete",
      path: "/components/Card.jsx",
    })
  ).toBe("Deleting Card.jsx");
});

test("getToolMessage: falls back gracefully when path is missing", () => {
  expect(
    getToolMessage("str_replace_editor", { command: "create" })
  ).toBe("Creating file");
});

test("getToolMessage: unknown tool falls back to the tool name", () => {
  expect(getToolMessage("some_other_tool", { path: "/x.js" })).toBe(
    "some_other_tool"
  );
});

test("getToolMessage: no longer surfaces the raw tool name for known tools", () => {
  const message = getToolMessage("str_replace_editor", {
    command: "create",
    path: "/components/Card.jsx",
  });
  expect(message).not.toContain("str_replace_editor");
});

// --- ToolInvocation component ------------------------------------------------

test("ToolInvocation renders the friendly message with the file name", () => {
  render(
    <ToolInvocation
      toolName="str_replace_editor"
      args={{ command: "create", path: "/components/Card.jsx" }}
      state="result"
      result="File created: /components/Card.jsx"
    />
  );

  expect(screen.getByText("Creating Card.jsx")).toBeDefined();
  expect(screen.queryByText("str_replace_editor")).toBeNull();
});

test("ToolInvocation shows completion dot when state is result", () => {
  const { container } = render(
    <ToolInvocation
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
      state="result"
      result="ok"
    />
  );

  // Green completion dot present, no spinner
  expect(container.querySelector(".bg-emerald-500")).not.toBeNull();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("ToolInvocation shows a spinner while the call is in progress", () => {
  const { container } = render(
    <ToolInvocation
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
      state="call"
    />
  );

  // Spinner present, no completion dot
  expect(container.querySelector(".animate-spin")).not.toBeNull();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});
