import { celestrakCache } from "../../../../server/celestrak-cache";
import { isGroupId } from "../../../../server/groups";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ group: string }> }) {
  const { group } = await params;
  if (!isGroupId(group)) {
    return Response.json({ error: "Groupe inconnu" }, { status: 404 });
  }

  try {
    const data = await celestrakCache.get(group);
    return Response.json({ ...data, source: "CelesTrak" });
  } catch {
    return Response.json({ error: "Données orbitales indisponibles pour le moment" }, { status: 503 });
  }
}
