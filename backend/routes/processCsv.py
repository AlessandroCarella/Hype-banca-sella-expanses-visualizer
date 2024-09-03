from flask import request, jsonify

from routes.modules.preProcessData import preProcessData

def process_file(app):
    data = request.json
    filepath = data.get('filepath')
    if not filepath:
        return jsonify({"error": "No filepath provided"}), 400
    
    try:
        result = preProcessData(filepath, app)
        return jsonify({"message": "File processed successfully", "result": result}), 200
    except KeyError as e:
        return jsonify({"error": f"Error processing file: the key {str(e)} is not in the uploaded file. Please check the file and upload one from the bank."}), 500
    except Exception as e:
        return jsonify({"error": f"Error processing file: {str(e)}; {str(e.__class__)}"}), 500
