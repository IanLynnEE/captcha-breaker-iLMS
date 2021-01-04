import os
import cv2

# Get the standard image for each digit.
def get_std():
    std = {}
    for i in range(1, 10):
        filename = f'../labeled/{i}00001.jpeg'
        std[i] = cv2.imread(filename, cv2.IMREAD_GRAYSCALE)
    return std


def match_score(img1, img2): 
    AND = cv2.bitwise_and(img1, img2)
    XOR = cv2.bitwise_xor(img1, img2)
    return {'match': cv2.countNonZero(AND), 'diff': cv2.countNonZero(XOR)}


if __name__ == '__main__':
    path = '../labeled/'
    std = get_std()
    for filename in sorted(os.listdir(path)):
        sample = cv2.imread(path+filename, cv2.IMREAD_GRAYSCALE)
        print(f'For {filename}')
        for i in range(1,10):
            print(' compare to', i, match_score(sample, std[i]))
        
