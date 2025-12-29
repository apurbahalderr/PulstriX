import torch
from torchvision.models import resnet50, ResNet50_Weights
import os

def download():
    print("Downloading ResNet50 model...")
    
    weights = ResNet50_Weights.DEFAULT
    resnet50(weights=weights)
    print("Model downloaded successfully.")

if __name__ == "__main__":
    download()
