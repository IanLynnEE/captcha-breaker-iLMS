import os

import cv2

# This program will not consider duplicated images.
# So, change Imagedir if you need.
Labeldir = '../labeled/'
Imagedir = '../images/'
Index = {}
Low = (30, 0, 0)
High = (160, 90, 70)
Cut = [18, 30, 42, 54, 66]


# Find what should be the filename
def get_index():
    global Labeldir, Index

    for i in range(1,10):
        Index[i] = 0

    filelist = sorted(os.listdir(Labeldir))
    for filename in filelist:
        label = int(filename[0])
        Index[label] = int(filename[1:].split('.')[0])
    return


# Save the image base on the key
def save_single(key, single):
    global Labeldir, Index
    note = Index[key] + 1
    filename = f'{key}{note:05}.png'
    cv2.imwrite(Labeldir+filename, single)
    Index[key] += 1
    return


# Create a opencv window which listen to your input,
# and store the image for given input.
def main():
    global Imagedir, Low, High, Cut

    print('Press esc on the opencv window to end the program.')
    cv2.namedWindow('Labeling', cv2.WINDOW_NORMAL)
    cv2.resizeWindow('Labeling', 520, 240)

    get_index()
    print('Index :', Index)
    for filename in os.listdir(Imagedir):
        img = cv2.imread(Imagedir+filename)
        mask = cv2.inRange(img, Low, High)
        for j in range(1, len(Cut)):
            single = mask[:, Cut[j-1] : Cut[j] ]
            cv2.imshow('Labeling', single)
            cv2.resizeWindow('Labeling', 520, 240)
            key = cv2.waitKey(0)
            if key == 27:
                return
            save_single(int(chr(key)), single)
    return


if __name__ == '__main__':
    main()
    print('Index :', Index)
