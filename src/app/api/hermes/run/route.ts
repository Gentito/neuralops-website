import { spawn } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Local Hermes CLI. Override with HERMES_BIN for non-default installs. */
const HERMES_BIN =
  process.env.HERMES_BIN ?? path.join(os.homedir(), ".local", "bin", "hermes");

const MAX_TASK_LENGTH = 8000;

type Payload = {
  agentName?: unknown;
  agentSlug?: unknown;
  division?: unknown;
  task?: unknown;
};

/**
 * Ask Hermes to route through the agency-agents-router plugin and load the
 * requested specialist before working the task. Routing stays lazy — the full
 * roster is never preloaded.
 */
function buildPrompt(agent: {
  name: string;
  slug: string;
  division: string;
  task: string;
}): string {
  return [
    "You are running inside the NeuralOps agent dashboard and act as the harness for The Agency roster.",
    "Use the agency-agents-router plugin. Call agency_agents_load for the specialist below, then complete the task in that specialist's voice and method.",
    "Do not preload the full roster — load only this specialist.",
    "",
    `Specialist: ${agent.name}`,
    `Slug: ${agent.slug}`,
    `Division: ${agent.division}`,
    "",
    "Task:",
    agent.task
  ].join("\n");
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Payload | null;

  const task = typeof body?.task === "string" ? body.task.trim() : "";
  const agentName = typeof body?.agentName === "string" ? body.agentName : "";
  const agentSlug = typeof body?.agentSlug === "string" ? body.agentSlug : "";
  const division = typeof body?.division === "string" ? body.division : "";

  if (!agentSlug || !agentName) {
    return NextResponse.json({ error: "Missing agent." }, { status: 400 });
  }
  if (!task) {
    return NextResponse.json({ error: "Describe a task to run." }, { status: 400 });
  }
  if (task.length > MAX_TASK_LENGTH) {
    return NextResponse.json(
      { error: `Task is too long (max ${MAX_TASK_LENGTH} characters).` },
      { status: 400 }
    );
  }

  const prompt = buildPrompt({ name: agentName, slug: agentSlug, division, task });

  const child = spawn(
    /* turbopackIgnore: true */ HERMES_BIN,
    ["chat", "--oneshot", "--query-file", "-", "--format", "stream-json"],
    { stdio: ["pipe", "pipe", "pipe"], env: process.env }
  );

  // The prompt goes over stdin, so nothing is shell-interpreted.
  child.stdin.write(prompt);
  child.stdin.end();

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let finished = false;
      let sawResult = false;
      let stderr = "";

      const enqueue = (value: unknown) =>
        controller.enqueue(encoder.encode(`${JSON.stringify(value)}\n`));

      const finish = () => {
        if (finished) return;
        finished = true;
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };

      child.stdout.on("data", (chunk: Buffer) => {
        if (chunk.toString().includes('"type":"result"')) sawResult = true;
        controller.enqueue(new Uint8Array(chunk));
      });

      child.stderr.on("data", (chunk: Buffer) => {
        stderr += chunk.toString();
      });

      child.on("error", (error: NodeJS.ErrnoException) => {
        enqueue({
          type: "result",
          exit_code: 1,
          error:
            error.code === "ENOENT"
              ? `Hermes CLI not found at ${HERMES_BIN}. Install it or set HERMES_BIN.`
              : `Could not start Hermes: ${error.message}`
        });
        finish();
      });

      child.on("close", (code) => {
        if (code !== 0 && !sawResult) {
          const detail = stderr.trim().slice(0, 4000);
          enqueue({
            type: "result",
            exit_code: code ?? 1,
            error: detail || `Hermes exited with code ${code}.`
          });
        }
        finish();
      });

      req.signal.addEventListener("abort", () => {
        child.kill("SIGTERM");
        finish();
      });
    },
    cancel() {
      child.kill("SIGTERM");
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no"
    }
  });
}
