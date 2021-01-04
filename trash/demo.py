import sys
import cv2
from matplotlib import pyplot as plt
import pytesseract

config_1 = r'-c tessedit_char_whitelist=0123456789 --psm 7'

filename = sys.argv[1]
img = cv2.imread(filename)


mask_bgr = cv2.inRange(img, (30,0,0), (160,90,70))
invert_mask_bgr = cv2.bitwise_not(mask_bgr)
text = pytesseract.image_to_string(invert_mask_bgr, config=config_1)
print(text.strip())

hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
mask_hsv = cv2.inRange(hsv, (100,110,0), (130,250,150))
invert_mask_hsv = cv2.bitwise_not(mask_hsv)
text = pytesseract.image_to_string(invert_mask_hsv, config=config_1)
print(text.strip())

fig, axes = plt.subplots(3,1)
axes[0].imshow( cv2.cvtColor(img, cv2.COLOR_BGR2RGB) )
axes[1].imshow(invert_mask_bgr, cmap='gray')
axes[2].imshow(invert_mask_hsv, cmap='gray')
for ax in axes: ax.axis('off')
plt.show()
