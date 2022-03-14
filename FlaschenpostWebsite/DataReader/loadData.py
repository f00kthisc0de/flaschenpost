from PIL import Image

schaedenSave = input("Geben Sie den Pfad der .SAVE Datei an: ")

import pygame, math

imgFile = "../Website/assets/bully.png"
img = Image.open(imgFile)
w,h=img.size

lineWidth = 3
sDurchmesser = 10
positionen = list()
with open(schaedenSave, "r") as f:
    lines = f.read().split('\n')
    for li in lines:
        tempSplit = li.split(';')
        lineSplit = tempSplit[0].split(':')
        isEllipse = False
        tempPos = list()
        for pos in lineSplit:
            temp = pos.split(',')
            if (len(temp) == 1):
                isEllipse = True
                tempPos.append(int(temp[0]))
            else:
                tempPos.append(float(temp[0])*w)
                tempPos.append(float(temp[1])*h)
        positionen.append(tempPos)

pygame.init()
screen = pygame.display.set_mode((w,h))
pygame.display.set_caption('Flaschenpost Website Data Reader')
clock = pygame.time.Clock()
bg = pygame.image.load(imgFile)

while True:
    screen.blit(bg, (0, 0))

    for p in positionen:
        if (len(p) == 2):
            x1 = math.cos(   math.pi /4) * (sDurchmesser/2) + p[0]
            y1 = math.sin(   math.pi /4) * (sDurchmesser/2) + p[1]
            x2 = math.cos((5*math.pi)/4) * (sDurchmesser/2) + p[0]
            y2 = math.sin((5*math.pi)/4) * (sDurchmesser/2) + p[1]
            x3 = math.cos((3*math.pi)/4) * (sDurchmesser/2) + p[0]
            y3 = math.sin((3*math.pi)/4) * (sDurchmesser/2) + p[1]
            x4 = math.cos((7*math.pi)/4) * (sDurchmesser/2) + p[0]
            y4 = math.sin((7*math.pi)/4) * (sDurchmesser/2) + p[1]
            pygame.draw.line(screen,(255,0,0),(x1,y1),(x2,y2),width=lineWidth)
            pygame.draw.line(screen,(255,0,0),(x3,y3),(x4,y4),width=lineWidth)
        elif (len(p) == 3):
            pygame.draw.circle(screen,(255,0,0),(p[0],p[1]),p[2]/2,width=lineWidth)
        elif (len(p) == 4):
            pygame.draw.line(screen,(255,0,0),(p[0],p[1]),(p[2],p[3]),width=lineWidth)

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            quit()
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_ESCAPE:
                pygame.quit()
                quit()

    pygame.display.update()
    clock.tick(60)
