#!/usr/bin/env bash
# Install a pinned secrets scanner release (linux x64).
# The archive must match the SHA-256 pinned in .github/scanner-versions.env, not only the
# release's own checksums file, so a replaced release asset fails the install.
# In CI the binary goes to $RUNNER_TEMP/bin and onto PATH. Locally it goes to
# $SCANNER_BIN_DIR (default ~/.local/bin).
# Usage: install-scanner.sh <gitleaks|betterleaks> <version> <sha256>
set -euo pipefail

tool="$1"
version="$2"
sha256="$3"

case "$tool" in
  gitleaks | betterleaks) ;;
  *) echo "unknown scanner: $tool" >&2; exit 2 ;;
esac

if [ -n "${RUNNER_TEMP:-}" ]; then
  work="${RUNNER_TEMP}/scanner-${tool}"
  bin="${SCANNER_BIN_DIR:-${RUNNER_TEMP}/bin}"
else
  work="$(mktemp -d)"
  trap 'rm -rf "$work"' EXIT
  bin="${SCANNER_BIN_DIR:-${HOME}/.local/bin}"
fi
mkdir -p "$work" "$bin"

archive="${tool}_${version}_linux_x64.tar.gz"
url="https://github.com/${tool}/${tool}/releases/download/v${version}/${archive}"

curl -fsSL --retry 3 -o "$work/$archive" "$url"
echo "${sha256}  ${work}/${archive}" | sha256sum -c -
tar -xzf "$work/$archive" -C "$work" "$tool"
install -m 0755 "$work/$tool" "$bin/$tool"

if [ -n "${GITHUB_PATH:-}" ]; then
  echo "$bin" >> "$GITHUB_PATH"
fi
"$bin/$tool" version
