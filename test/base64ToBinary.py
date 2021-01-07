import base64
import numpy as np
import cv2
import matplotlib.pyplot as plt

from PIL import Image
import io

path = './'
filename = 'base64Sample.txt'

with open(path+filename,'r') as f:
    b64_string = f.read()

image = base64.b64decode(b64_string)       

img = Image.open(io.BytesIO(image))

img.show()
im = np.array(img)

plt.imshow(im, cmap='gray')
plt.show()

