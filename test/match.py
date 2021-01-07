import os
import cv2
import numpy as np
import base64

# Get the standard image for each digit.
def get_std():
    std = [None] * 10
    std[0] = np.zeros((26,12), np.uint8)
    for i in range(1, 10):
        filename = f'./labeled/{i}00001.png'
        std[i] = cv2.imread(filename, cv2.IMREAD_GRAYSCALE)
    return std


def print_std_in_base64(std):
    retval, buffer = cv2.imencode( '.png', np.hstack(std), cv2.IMWRITE_PNG_BILEVEL )
    print( base64.b64encode(buffer) )
    return


def match_score(sample, target): 
    AND = cv2.bitwise_and(sample, target)
    XOR = cv2.bitwise_xor(sample, target)
    
    w = 1 - (cv2.countNonZero(target) / 312)
    return cv2.countNonZero(AND) * w - cv2.countNonZero(XOR) * w


if __name__ == '__main__':
    path = './labeled/'
    std = get_std()
    for filename in sorted(os.listdir(path)):
        sample = cv2.imread(path+filename, cv2.IMREAD_GRAYSCALE)
        print(f'For {filename}', end=' ')
        max_score = match_score(sample, std[1])
        number = 1
        for i in range(1,10):
            if match_score(sample, std[i]) > max_score:
                max_score = match_score(sample, std[i])
                number = i
        if number != int(filename[0]):
            print('select_num', number, 'ERROR!')
        else:
            print('select_num', number)        
    
    print_std_in_base64(std)
