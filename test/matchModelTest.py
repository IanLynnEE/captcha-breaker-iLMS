import os
import cv2

# Get the standard image for each digit.
def get_std():
    std = {}
    for i in range(1, 10):
        filename = f'./labeled/{i}00001.png'
        std[i] = cv2.imread(filename, cv2.IMREAD_GRAYSCALE)
        print(std[i])
    return std


def pixel_per_col(nine_img_dict):
    import numpy as np
    from matplotlib import pyplot as plt
    for i in range(1,10): 
        img = nine_img_dict[i]
        x = np.count_nonzero(img, axis=0)
        print(i, ':', x)
        plt.plot(x, label=str(i))
    plt.legend()
    plt.show()
    return


def match_score(sample, target): 
    AND = cv2.bitwise_and(sample, target)
    XOR = cv2.bitwise_xor(sample, target)
    OR = cv2.bitwise_or(sample, target)
    ORXOR = cv2.bitwise_xor(OR, target)

    w = 1 - (cv2.countNonZero(target) / 312)
    return {'match': cv2.countNonZero(AND) * w, 
            'diff': cv2.countNonZero(XOR) * w,
            'notCover': cv2.countNonZero(ORXOR) * w
           }


if __name__ == '__main__':
    path = './labeled/'
    std = get_std()
    for filename in sorted(os.listdir(path)):
        sample = cv2.imread(path+filename, cv2.IMREAD_GRAYSCALE)
        print(f'For {filename}')
        for i in range(1,10):
            print(' compare to', i, match_score(sample, std[i]))
    
    pixel_per_col(std) 
