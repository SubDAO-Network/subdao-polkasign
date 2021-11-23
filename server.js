const express = require("express")
const next = require("next")
const proxyMiddleware = require("http-proxy-middleware")

const devProxy = {
    "/query": {
        target: "http://43.133.174.232:8080", // 端口自己配置合适的
        pathRewrite: {
            "^/query": "/query"
        },
        changeOrigin: true
    }
}

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== "production"
const app = next({
    dev
})
const handle = app.getRequestHandler()
app.prepare()
    .then(() => {
        const server = express()

        if (dev && devProxy) {
            Object.keys(devProxy).forEach(function(context) {
                server.use(proxyMiddleware.createProxyMiddleware(context, devProxy[context]))
            })
        }

        server.all("*", (req, res) => {
            handle(req, res)
        })

        server.listen(port, err => {
            if (err) {
                throw err
            }
            console.log(`> Ready on http://localhost:${port}`)
        })
    })
    .catch(err => {
        console.log("An error occurred, unable to start the server")
        console.log(err)
    })
