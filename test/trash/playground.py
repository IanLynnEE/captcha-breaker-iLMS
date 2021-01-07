import cv2
from PIL import Image
import pytesseract

from pytictoc import TicToc

# im1 and im2 need to be same height or width
def get_concat_h(im1, im2):
    dst = Image.new('RGB', (im1.width + im2.width, im1.height))
    dst.paste(im1, (0, 0))
    dst.paste(im2, (im1.width, 0))
    return dst
def get_concat_v(im1, im2):
    dst = Image.new('RGB', (im1.width, im1.height + im2.height))
    dst.paste(im1, (0, 0))
    dst.paste(im2, (0, im1.height))
    return dst

def pil_inRange_invert(img, low, high):
    w, h = img.size
    bins = Image.new('L', (w,h), 255)
    for i in range(w):
        for j in range(h):
            if img.getpixel((i,j)) > low and img.getpixel((i,j)) < high:
                bins.putpixel((i,j), 0)
    return bins



# ---------------------------------------------------------------------- #

filename = 'test4.jpeg'
img = cv2.imread(filename)
result = Image.open(filename)
t = TicToc()

t.tic()
pil_img = pil_inRange_invert(result, (0,0,30), (70,90,160))
t.toc(restart=True)
text = pytesseract.image_to_string(pil_img, config='outputbase digits')
t.toc()
print(text.strip())
result = get_concat_v(result, pil_img)

t.tic()
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
mask = cv2.inRange(hsv, (100,110,0), (130,250,150))
pil_img = Image.fromarray( cv2.bitwise_not(mask) )
t.toc(restart=True)
text = pytesseract.image_to_string(pil_img, config='outputbase digits')
t.toc()
print(text.strip())

get_concat_v(result, pil_img).show()
