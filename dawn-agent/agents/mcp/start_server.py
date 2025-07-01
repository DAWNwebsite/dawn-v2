#!/usr/bin/env python3
"""
Startup script for DAWN AI Study MCP Server
"""

import uvicorn
import logging
from server import create_fastapi_server

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("dawn-mcp-startup")

def main():
    """Main startup function"""
    logger.info("🚀 Starting DAWN AI Study MCP Server...")
    
    # Create FastAPI app
    app = create_fastapi_server()
    
    # Server configuration
    config = {
        "host": "0.0.0.0",
        "port": 8000,
        "log_level": "info",
        "reload": True,  # Enable auto-reload during development
    }
    
    logger.info(f"🌐 Server will be available at http://localhost:{config['port']}")
    logger.info(f"📚 API documentation at http://localhost:{config['port']}/docs")
    logger.info("🔧 Available endpoints:")
    logger.info("  - POST /api/assessment/adhd")
    logger.info("  - POST /api/assessment/dyslexia") 
    logger.info("  - POST /api/assessment/autism")
    logger.info("  - POST /api/profile/create")
    logger.info("  - GET /api/profile/{user_id}")
    logger.info("  - POST /api/content/adapt")
    logger.info("  - GET /api/health")
    
    # Start server
    uvicorn.run(app, **config)

if __name__ == "__main__":
    main() 