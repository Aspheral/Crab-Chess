# Crab Chess project build wrapper
#
# Crab Chess is GPLv3 software derived from the Stockfish 18 code base.
# The engine's inherited build system remains in engine/src/Makefile; this
# project-owned wrapper is the canonical entry point for Crab-specific build
# policy and experimentally accepted compiler optimizations.

ARCH ?= native
COMP ?= gcc
JOBS ?= 2
CRAB_CLANG_INLINE ?= yes

# Preserve caller-provided extra flags, then layer accepted Crab flags on top.
USER_EXTRACXXFLAGS := $(EXTRACXXFLAGS)
CRAB_EXTRACXXFLAGS := $(USER_EXTRACXXFLAGS)

# EXP-0001: raise LLVM's inlining threshold for optimized Clang builds.
# This is intentionally compiler-only: it must preserve Crab's deterministic
# search signature while improving throughput. Set CRAB_CLANG_INLINE=no to
# produce the paired control build.
ifeq ($(COMP),clang)
ifeq ($(CRAB_CLANG_INLINE),yes)
CRAB_EXTRACXXFLAGS += -Xclang -mllvm -Xclang -inline-threshold=500
endif
endif

ENGINE_MAKE := $(MAKE) -C engine/src
ENGINE_ARGS := ARCH=$(ARCH) COMP=$(COMP) EXTRACXXFLAGS="$(strip $(CRAB_EXTRACXXFLAGS))"

ifneq ($(sanitize),)
ENGINE_ARGS += sanitize="$(sanitize)"
endif
ifneq ($(debug),)
ENGINE_ARGS += debug=$(debug)
endif
ifneq ($(optimize),)
ENGINE_ARGS += optimize=$(optimize)
endif

.PHONY: all build baseline-build candidate-build profile-build bench clean help print-config

all: build

build:
	$(ENGINE_MAKE) -j$(JOBS) build $(ENGINE_ARGS)

# Explicit paired targets make performance experiments reproducible.
baseline-build:
	$(MAKE) build ARCH=$(ARCH) COMP=$(COMP) JOBS=$(JOBS) CRAB_CLANG_INLINE=no

candidate-build:
	$(MAKE) build ARCH=$(ARCH) COMP=$(COMP) JOBS=$(JOBS) CRAB_CLANG_INLINE=yes

profile-build:
	$(ENGINE_MAKE) -j$(JOBS) profile-build $(ENGINE_ARGS)

bench: build
	./engine/src/crab bench

clean:
	$(ENGINE_MAKE) clean

print-config:
	@echo "Crab build configuration"
	@echo "  ARCH=$(ARCH)"
	@echo "  COMP=$(COMP)"
	@echo "  CRAB_CLANG_INLINE=$(CRAB_CLANG_INLINE)"
	@echo "  EXTRACXXFLAGS=$(strip $(CRAB_EXTRACXXFLAGS))"

help:
	@echo "Crab Chess build wrapper"
	@echo ""
	@echo "  make build ARCH=x86-64 COMP=gcc"
	@echo "  make build ARCH=x86-64 COMP=clang"
	@echo "  make baseline-build ARCH=x86-64 COMP=clang"
	@echo "  make candidate-build ARCH=x86-64 COMP=clang"
	@echo "  make bench ARCH=x86-64 COMP=clang"
	@echo "  make clean"
	@echo ""
	@echo "Set CRAB_CLANG_INLINE=no to disable EXP-0001 for A/B testing."
