from http.server import SimpleHTTPRequestHandler, HTTPServer

server_ip = "192.168.1.246"   # Listen on all network interfaces
server_port = 9000

server = HTTPServer((server_ip, server_port), SimpleHTTPRequestHandler)
print(f"Serving on http://{server_ip}:{server_port}")
print("Press Ctrl+C to stop the server")

server.serve_forever()
