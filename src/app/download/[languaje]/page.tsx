import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { redirect } from "next/navigation";

export default async function page({
  params,
}: {
  params: { languaje: string };
}) {
  const pdfUrl = await fetchQuery(api.pdfFiles.getpdfFile, {
    languaje: params.languaje,
  });
  if (!pdfUrl) {
    return <p>nada que mostrar</p>;
  }

  return redirect(pdfUrl);
}
