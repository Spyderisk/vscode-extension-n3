import { spawn } from "child_process";
import { Server } from "net";

var argv = require('minimist')(process.argv.slice(2));

console.log("Starting LSP")
const lspserver = spawn("node", ["server/out/server.js", "--", "--stdio"]);
console.log("Started LSP")

const netserver = new Server((con) => {
    while (true) {
        const req: string = con.read()

        if (req.length > 0) {
            // Client request, send it!
            console.log(`Request: ${req}`)
            lspserver.stdin.write(req)
        }

        if (lspserver.stdout.readableLength > 0) {
            // Server response, send it back!
            const resp = lspserver.stdout.read()
            console.log(`Response: ${resp}`)
            con.write(resp)
        } 
    }
})

console.log(argv)

const host: string = argv["host"];

const [ip, port] = host.split(':')

console.log("Starting server!")

netserver.listen(Number.parseInt(port))