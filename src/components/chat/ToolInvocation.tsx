"use client";

import { Loader2 } from "lucide-react";

interface ToolInvocationProps {
  toolName: string;
  args?: any;
  state?: string;
  result?: unknown;
}

function getFileName(path?: unknown): string | null {
  if (typeof path !== "string" || path.length === 0) return null;
  const parts = path.split("/").filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1] : null;
}

/**
 * Translate a raw tool invocation into a short, human-friendly status message
 * that names the file being acted on (e.g. "Creating Card.jsx").
 */
export function getToolMessage(toolName: string, args?: any): string {
  const fileName = getFileName(args?.path);

  if (toolName === "str_replace_editor") {
    switch (args?.command) {
      case "create":
        return fileName ? `Creating ${fileName}` : "Creating file";
      case "str_replace":
      case "insert":
        return fileName ? `Editing ${fileName}` : "Editing file";
      case "view":
        return fileName ? `Viewing ${fileName}` : "Viewing file";
      default:
        return fileName ? `Modifying ${fileName}` : "Modifying file";
    }
  }

  if (toolName === "file_manager") {
    const newFileName = getFileName(args?.new_path);
    switch (args?.command) {
      case "rename":
        return fileName && newFileName
          ? `Renaming ${fileName} to ${newFileName}`
          : "Renaming file";
      case "delete":
        return fileName ? `Deleting ${fileName}` : "Deleting file";
      default:
        return fileName ? `Updating ${fileName}` : "Managing files";
    }
  }

  return toolName;
}

export function ToolInvocation({
  toolName,
  args,
  state,
  result,
}: ToolInvocationProps) {
  const message = getToolMessage(toolName, args);
  const isComplete = state === "result" && result !== undefined;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isComplete ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{message}</span>
    </div>
  );
}
