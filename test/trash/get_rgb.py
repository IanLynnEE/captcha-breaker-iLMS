import sys
import cv2
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image

IM = 0
R = []
G = []
B = []

def onclick(event):
    global IM, R, G, B
    X, Y = int(event.xdata), int(event.ydata)
    r,g,b = IM[Y,X,:]
    R.append(r)
    G.append(g)
    B.append(b)
    IM[Y, X, :] = 255
    plt.cla()
    # plt.clf()
    # plt.gca()
    plt.imshow(IM)
    plt.gcf().canvas.draw()

fig = plt.figure()
cid = plt.gcf().canvas.mpl_connect('button_press_event', onclick)

IM = cv2.imread(sys.argv[1])
IM = cv2.cvtColor(IM, cv2.COLOR_BGR2RGB)
plt.imshow(IM)
plt.show()

print('R :', sorted(R))
print('G :', sorted(G))
print('B :', sorted(B))


