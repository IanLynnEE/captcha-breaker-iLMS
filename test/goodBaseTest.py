import cv2
import numpy as np
from matplotlib import pyplot as plt

path = '../labeled/'
im300013 = cv2.imread(path+'300013.jpeg', cv2.IMREAD_GRAYSCALE)
im300014 = cv2.imread(path+'300014.jpeg', cv2.IMREAD_GRAYSCALE)
im300015 = cv2.imread(path+'300015.jpeg', cv2.IMREAD_GRAYSCALE)

OR1 = cv2.bitwise_or(im300013, im300014)
OR2 = cv2.bitwise_or(im300014, im300015)

plt.imshow(OR1, cmap='gray')
plt.show()
plt.imshow(OR2, cmap='gray')
plt.show()
plt.imshow(OR1, cmap='gray')
plt.show()

