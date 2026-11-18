import { requireOwner } from "@/lib/auth/server";
import { repository } from "@/lib/private-planner/database";
import { createHandlers } from "@/lib/private-planner/handlers";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const { GET, POST } = createHandlers(requireOwner, repository);
