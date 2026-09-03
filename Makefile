# Crab Chess project build wrapper
#
# Crab Chess is GPLv3 software derived from the Stockfish 18 code base.
# The inherited optimized engine build system remains in engine/src/Makefile.
# This wrapper gives Crab one stable project-level entry point for CI,
# experiments, local development, and future accepted build policy.

ARCH ?= native
COMP ?= gcc
JOBS ?= 2

ENGINE_MAKE := $(MAKE) -C engine/src
ENGINE_ARGS := ARCH=$(ARCH) COMP=$(COMP) EXTRACXXFLAGS="$(EXTRACXXFLAGS)" EXTRALDFLAGS="$(EXTRALDFLAGS)"

ifneq ($(sanitize),)
ENGINE_ARGS += sanitize="$(sanitize)"
endif
ifneq ($(debug),)
ENGINE_ARGS += debug=$(debug)
endif
ifneq ($(optimize),)
ENGINE_ARGS += optimize=$(optimize)
endif

.PHONY: all build profile-build bench clean help print-config

all: build

build:
	$(ENGINE_MAKE) -j$(JOBS) build $(ENGINE_ARGS)

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
	@echo "  EXTRACXXFLAGS=$(EXTRACXXFLAGS)"
	@echo "  EXTRALDFLAGS=$(EXTRALDFLAGS)"

help:
	@echo "Crab Chess build wrapper"
	@echo ""
	@echo "  make build ARCH=x86-64 COMP=gcc"
	@echo "  make build ARCH=x86-64-avx2 COMP=clang"
	@echo "  make profile-build ARCH=native COMP=gcc"
	@echo "  make bench ARCH=x86-64 COMP=gcc"
	@echo "  make clean"
	@echo ""
	@echo "Use EXTRACXXFLAGS/EXTRALDFLAGS to isolate compiler experiments without modifying the inherited engine Makefile."
