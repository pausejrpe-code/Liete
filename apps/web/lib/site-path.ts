const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(path: string) {
  if (!path.startsWith("/")) {
    throw new Error(`Site paths must start with "/": ${path}`);
  }

  return `${basePath}${path}`;
}
