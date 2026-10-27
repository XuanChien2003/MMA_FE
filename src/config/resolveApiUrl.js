export function resolveApiUrl({
  override,
  hostUri,
  platform,
  webHostname,
  port = 9999,
}) {
  if (override?.trim()) {
    const value = override.trim().replace(/\/+$/, "");
    if (!/^https?:\/\/[^/\s]+(?::\d+)?(?:\/[^\s]*)?$/.test(value)) {
      throw new Error(
        "EXPO_PUBLIC_API_URL phải là địa chỉ http:// hoặc https:// hợp lệ.",
      );
    }
    return value;
  }
  const address = platform === "web" && webHostname ? webHostname : hostUri;
  const hostname = address
    ?.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "")
    .split("/")[0]
    .replace(/:\d+$/, "");
  if (
    !hostname ||
    /(?:exp\.direct|exp\.host|expo\.dev|expo\.app)$/.test(hostname)
  )
    return "";
  if (
    platform !== "web" &&
    /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/.test(hostname)
  )
    return "";
  return `http://${hostname}:${port}`;
}
