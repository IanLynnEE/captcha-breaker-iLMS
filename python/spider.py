import os
import sys
import requests


def get_index():
    filelist = sorted(os.listdir('../images'))
    last_filename = filelist[-1].split('.')[0]
    return int(last_filename) + 1

def download_img(index): 
    imgsrc = 'https://lms.nthu.edu.tw/sys/lib/class/csecimg.php?width=80&height=26&characters=4'
    with open(f'../images/{index:06}.jpeg', 'wb') as f:
        f.write(requests.get(imgsrc).content)
    return

def main():
    i = get_index()
    for j in range(int(sys.argv[1])):
        download_img(i+j)
    return

if __name__ == '__main__':
    main()

