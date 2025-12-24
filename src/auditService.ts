export async function runAuditApi(url: string) {
  const res = await fetch("http://localhost:5000/api/audit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    throw new Error("Audit failed");
  }

  return res.json();
}
