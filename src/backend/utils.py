import json
import os
from typing import Dict

current_dir = os.path.dirname(os.path.abspath(__file__))

def load_config() -> Dict:
    """Load and return the configuration from config.json file."""
    
    with open(os.path.join(current_dir, 'config.json'), 'r') as config_file:
        return json.load(config_file)