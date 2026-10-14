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

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

LOCAL_PORTRAITS = {
    '/ted.jpg': ['assets/ted.jpg', 'assets/ted_portrait_1791904506064.jpg', 'ted.jpg', 'ted_portrait_1791904506064.jpg'],
    '/gorrister.jpg': ['assets/gorrister.jpg', 'assets/gorrister_portrait_1791904533430.jpg', 'gorrister.jpg', 'gorrister_portrait_1791904533430.jpg'],
    '/ellen.jpg': ['assets/ellen.jpg', 'assets/ellen_portrait_1791904554883.jpg', 'ellen.jpg', 'ellen_portrait_1791904554883.jpg'],
    '/nimdok.jpg': ['assets/nimdok.jpg', 'assets/nimdok_portrait_1791904585998.jpg', 'nimdok.jpg', 'nimdok_portrait_1791904585998.jpg'],
    '/am.jpg': ['assets/am.jpg', 'assets/am_core_portrait_1791904607307.jpg', 'am.jpg', 'am_core_portrait_1791904607307.jpg'],
    '/masa.jpg': ['assets/masa.jpg', 'masa.jpg'],
}

class CustomHTTPHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        clean_path = self.path.split('?')[0]
        
        # 1. Resolució directa del mapa canònic
        if clean_path in LOCAL_PORTRAITS:
            for candidate in LOCAL_PORTRAITS[clean_path]:
                candidate_path = os.path.join(BASE_DIR, candidate)
                if os.path.exists(candidate_path):
                    return self._serve_binary_file(candidate_path, 'image/jpeg')

        # 2. Resolució flexible per a assets/ vs arrel
        if clean_path.startswith('/assets/'):
            base_filename = clean_path.replace('/assets/', '')
            # Prova a assets/, després a l'arrel
            for candidate in [os.path.join('assets', base_filename), base_filename]:
                full_path = os.path.join(BASE_DIR, candidate)
                if os.path.exists(full_path):
                    return self._serve_binary_file(full_path, 'image/jpeg')
        
        super().do_GET()

    def _serve_binary_file(self, file_path, content_type):
        try:
            with open(file_path, 'rb') as f:
                content = f.read()
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(len(content)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Cache-Control', 'public, max-age=86400')
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            print(f"Error servint {file_path}: {e}")
            self.send_error(500, f"Error reading file: {e}")

    def end_headers(self):
        # Permetre CORS i desactivar memòria cau durant el desenvolupament
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def run_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    handler = CustomHTTPHandler
    
    # Allow address reuse immediately
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("", PORT), handler) as httpd:
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
