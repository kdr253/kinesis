import zipfile
import os

def create_deployment_package():
    with zipfile.ZipFile('deployment.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk('.'):
            # Skip unwanted directories
            dirs[:] = [d for d in dirs if d not in ['__pycache__', '.git', 'venv']]
            
            for file in files:
                if not file.endswith(('.pyc', '.env')):
                    file_path = os.path.join(root, file)
                    zipf.write(file_path, file_path)
    
    print("deployment.zip created successfully")

if __name__ == "__main__":
    create_deployment_package()