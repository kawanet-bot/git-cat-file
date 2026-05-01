SRC := $(wildcard ../lib/*.ts ../types/*.ts)

PKG_DST := ../dist/package.json
MJS_DST := ../dist/git-cat-file.mjs
CJS_DST := ../dist/git-cat-file.cjs

MJS_CONFIG := ./rollup-mjs.config.ts
CJS_CONFIG := ./rollup-cjs.config.ts

# Each bundle should stay around 26 KB (lib/ + the two `dependencies` we
# externalise). Anything noticeably larger means an accidental bundling of
# Node built-ins or a transitive dep — fail the build so it cannot slip in.
MAX_BYTES := 30000

# CLI entry points under bin/*.ts are executed directly by Node via the
# built-in TypeScript type-stripping (Node >= 22). They do not need to be
# bundled, so they are not part of $(ALL).
ALL := $(MJS_DST) $(CJS_DST) $(PKG_DST)

####

all: $(ALL)

$(PKG_DST):
	@mkdir -p $(dir $@)
	echo '{"type":"commonjs"}' > $@
	@ls -l $@
	@echo ""

$(MJS_DST): $(MJS_CONFIG) $(SRC)
	@mkdir -p $(dir $@)
	../node_modules/.bin/rollup -c $<
	@test "$$(wc -c < $@)" -le $(MAX_BYTES) || { echo "ERROR: $@ exceeds $(MAX_BYTES) byte cap" >&2; exit 1; }
	@ls -l $@
	@echo ""

$(CJS_DST): $(CJS_CONFIG) $(SRC)
	@mkdir -p $(dir $@)
	../node_modules/.bin/rollup -c $<
	@test "$$(wc -c < $@)" -le $(MAX_BYTES) || { echo "ERROR: $@ exceeds $(MAX_BYTES) byte cap" >&2; exit 1; }
	@ls -l $@
	@echo ""

####

# Build, type-check, and run the full test matrix:
# 1. shell-based round-trip tests (invoke `node bin/<cli>.ts ...`)
# 2. node:test mocha-replacement under test/*.test.ts
test: all
	../node_modules/.bin/tsc --noEmit
	cd .. && rm -rf repo/ && sh test/repo1-prepare.sh && sh test/repo2-prepare.sh && sh test/repo3-prepare.sh
	cd .. && sh test/repo1-test.sh && sh test/repo2-test.sh && sh test/repo3-test.sh
	cd .. && node --test test/*.test.ts

clean:
	/bin/rm -fr $(ALL)

.PHONY: all clean test
