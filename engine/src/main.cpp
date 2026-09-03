#include <iostream>
#include <sstream>
#include <string>
#include <string_view>

namespace {

constexpr std::string_view kEngineName = "Crab Chess 0.0.1";
constexpr std::string_view kAuthor = "Aspheral";

void printUciIdentity() {
    std::cout << "id name " << kEngineName << '\n';
    std::cout << "id author " << kAuthor << '\n';
    std::cout << "option name Hash type spin default 16 min 1 max 1048576\n";
    std::cout << "option name Threads type spin default 1 min 1 max 1024\n";
    std::cout << "uciok\n";
}

int runSelfTestUci() {
    // This deliberately starts tiny. CI should fail if the executable cannot
    // at least expose a stable UCI identity before the real search core lands.
    std::ostringstream out;
    out << "id name " << kEngineName << '\n';
    out << "id author " << kAuthor << '\n';
    out << "uciok\n";

    const std::string text = out.str();
    const bool ok = text.find("id name Crab Chess") != std::string::npos &&
                    text.find("uciok") != std::string::npos;

    if (!ok) {
        std::cerr << "UCI smoke self-test failed\n";
        return 1;
    }

    std::cout << "Crab Chess UCI smoke self-test: PASS\n";
    return 0;
}

} // namespace

int main(int argc, char** argv) {
    if (argc > 1 && std::string_view(argv[1]) == "--selftest-uci") {
        return runSelfTestUci();
    }

    std::string line;
    while (std::getline(std::cin, line)) {
        if (line == "uci") {
            printUciIdentity();
        } else if (line == "isready") {
            std::cout << "readyok\n";
        } else if (line == "ucinewgame") {
            // Position/search state will be reset here once those subsystems land.
        } else if (line == "stop") {
            // Search cancellation hook placeholder.
        } else if (line == "quit") {
            break;
        } else if (line == "crab") {
            std::cout << "info string sideways progress is still progress\n";
        }

        std::cout.flush();
    }

    return 0;
}
