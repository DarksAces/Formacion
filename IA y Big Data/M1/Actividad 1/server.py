#!/usr/bin/env python3
"""
AM: Project Protocol - Servidor Local de Desenvolupament i Demostració
Executa un servidor HTTP local per carregar els mòduls ES6 sense problemes de CORS.

Ús:
    python server.py
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000

class CustomHTTPHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Permetre CORS i desactivar memòria cau durant el desenvolupament
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def run_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    handler = CustomHTTPHandler
    
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        url = f"http://localhost:{PORT}/index.html"
        print("=" * 65)
        print(f" AM: PROJECT PROTOCOL - SERVIDOR LOCAL D'IA AGÈNTICA")
        print("=" * 65)
        print(f" Servidor actiu a: {url}")
        print(" Prem Ctrl+C per aturar el servidor.")
        print("=" * 65)
        
        try:
            webbrowser.open(url)
        except Exception:
            pass
            
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n Servidor aturat correctament.")
            sys.exit(0)

if __name__ == '__main__':
    run_server()
