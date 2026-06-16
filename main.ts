import App from "./app";
async function main() {
    const app = new App();
    process.on("exit", async () => {
        await app.terminate();
    });

    try {
        await app.init();
    } catch (error) {
        console.error("Critical error during app initialization:", error);
        process.exit(1);
    }
}

main();