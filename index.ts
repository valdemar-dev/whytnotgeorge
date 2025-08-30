import { compile } from "elegance-js/build"

compile({
    environment: "development",
    outputDirectory: ".elegance",
    pagesDirectory: "./pages",
    hotReload: {
        port: 3001,
        hostname: "localhost",
    },
    server: {
        runServer: true,
        port: 3000,
    },
})