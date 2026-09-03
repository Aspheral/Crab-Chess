cmake_minimum_required(VERSION 3.21)

project(CrabChess VERSION 0.0.1 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

option(CRAB_ENABLE_SANITIZERS "Enable AddressSanitizer and UndefinedBehaviorSanitizer" OFF)

add_executable(crab
    engine/src/main.cpp
)

target_compile_features(crab PRIVATE cxx_std_20)

target_compile_options(crab PRIVATE
    $<$<CXX_COMPILER_ID:GNU,Clang>:-Wall;-Wextra;-Wpedantic;-Wconversion;-Wshadow>
    $<$<CXX_COMPILER_ID:MSVC>:/W4;/permissive->
)

if(CRAB_ENABLE_SANITIZERS AND CMAKE_CXX_COMPILER_ID MATCHES "GNU|Clang")
    target_compile_options(crab PRIVATE -fsanitize=address,undefined -fno-omit-frame-pointer)
    target_link_options(crab PRIVATE -fsanitize=address,undefined)
endif()

enable_testing()
add_test(NAME crab_uci_smoke COMMAND crab --selftest-uci)
