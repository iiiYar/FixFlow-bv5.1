import sys
import os

print("جارٍ تشغيل التطبيق...")
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
import logging
import sys

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

app = create_app()

if __name__ == '__main__':
    try:
        ssl_context = ('cert.pem', 'key.pem')
        app.run(debug=True, port=5000, host='0.0.0.0', ssl_context=ssl_context)
    except Exception as e:
        logging.error(f"خطأ في تشغيل التطبيق: {e}", exc_info=True)
        print(f"حدث خطأ: {e}")
        sys.exit(1)
    