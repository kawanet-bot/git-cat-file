#!/usr/bin/env bash -v

# Build a throwaway repository whose commits are all SSH-signed, so the
# parser's handling of multi-line continuation headers (`gpgsig`,
# `mergetag`) can be exercised end-to-end against real `git`.
#
# This script never touches the developer's own signing key or git
# configuration:
#   * GIT_CONFIG_GLOBAL=/dev/null hides the host's ~/.gitconfig.
#   * A throwaway ed25519 key is generated inside repo/repo4/ and
#     referenced explicitly via `git -c user.signingkey=...`.
#
# Skip silently when `ssh-keygen` is unavailable. The hand-crafted
# fixtures in test/multi-line-header.test.ts already exercise the parser
# without any external dependency, so the suite stays green on minimal
# environments. See kawanet-labs/m4-labs-code#88.

if ! command -v ssh-keygen >/dev/null 2>&1; then
    echo "skip repo4-prepare: ssh-keygen not available" >&2
    exit 0
fi

export GIT_CONFIG_GLOBAL=/dev/null

cd $(dirname $0)/..
/bin/rm -fr repo/repo4
mkdir -p repo/repo4
cd repo/repo4

ssh-keygen -t ed25519 -f signing-key -N "" -C "git-cat-file test signing key"
chmod 600 signing-key

git init -b main
git config user.email "9765+kawanet@users.noreply.github.com"
git config user.name "git-cat-file"

SIGN=(
    -c commit.gpgsign=true
    -c tag.gpgsign=true
    -c gpg.format=ssh
    -c "user.signingkey=$PWD/signing-key.pub"
)

# (a) signed empty commit — exercises gpgsig with an empty body.
git "${SIGN[@]}" commit --allow-empty -m 'signed empty'

# (b) signed normal commit — exercises gpgsig with a non-empty body.
echo Foo > foo.txt
git add foo.txt
git "${SIGN[@]}" commit -m Foo

# (c) merge commit with a mergetag header — annotated tag merged back
# into main produces a `mergetag` block on the merge commit, which is
# the other multi-line continuation header that real git uses.
git checkout -b feature
git "${SIGN[@]}" commit --allow-empty -m 'feature commit'
git "${SIGN[@]}" tag -a v1 -m 'tag v1 message'
git checkout main
git "${SIGN[@]}" merge --no-ff v1 -m 'merge tag v1'

git log --format=reference | cat
