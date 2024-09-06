import os
from flask import send_file
import random

randomGifIndex = -1

def get_loading_gif(app):
    global randomGifIndex
    try:
        gifs_dir_path = os.path.join(
            app.config['FRONTEND_FROM_BACKEND'],
            app.config['FRONTEND_SOURCE_FOLDER_NAME'],
            app.config['FRONTEND_PAGES_FOLDER_NAME'],
            app.config['FRONTEND_LOADING_GIFS_FOLDER_NAME']
        )
        gif_files = [f for f in os.listdir(gifs_dir_path) if f.endswith('.gif')]
        if not gif_files:
            raise FileNotFoundError("No GIF files found in the directory")
        if randomGifIndex == -1:
            randomGifIndex = random.randint(0, len(gif_files) - 1)
        gif_path = os.path.join(gifs_dir_path, gif_files[randomGifIndex])
        return send_file(gif_path, mimetype='image/gif')
    except Exception as e:
        app.logger.error(f"Error in get_loading_gif: {str(e)}")
        return str(e), 500
