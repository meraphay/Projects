import serial
import pygame
import math
import time
from collections import deque

# Serial setup
ser = serial.Serial('/dev/ttyUSB1', 9600, timeout=1)
time.sleep(2)

# Pygame setup
pygame.init()
WIDTH, HEIGHT = 900, 650
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Live Ultrasonic Radar")
clock = pygame.time.Clock()

# Radar center
C_X = WIDTH // 2
C_Y = HEIGHT - int(HEIGHT * 0.074)
MAX_RANGE_CM = 40
PIX_SCALE = (HEIGHT - HEIGHT * 0.1666) * 0.025

# State variables
iAngle = 0
iDistance = 0
angle_history = deque(maxlen=200)
distance_smooth = deque(maxlen=5)

running = True
data_updated = False

def draw_radar():
    color = (98, 245, 31)
    for factor in [0.06, 0.27, 0.48, 0.69]:
        rad = WIDTH - WIDTH * factor
        pygame.draw.arc(screen, color,
                        [C_X - rad / 2, C_Y - rad / 2, rad, rad],
                        math.pi, 2 * math.pi, 2)
    for deg in [0, 30, 60, 90, 120, 150]:
        rad = math.radians(deg)
        x = C_X + math.cos(rad) * (WIDTH / 2)
        y = C_Y - math.sin(rad) * (WIDTH / 2)
        pygame.draw.line(screen, color, (C_X, C_Y), (x, y), 2)

def draw_sweep():
    if data_updated:
        rad = math.radians(iAngle)
        length = (HEIGHT - HEIGHT * 0.12)
        x = C_X + math.cos(rad) * length
        y = C_Y - math.sin(rad) * length
        pygame.draw.line(screen, (0, 255, 0), (C_X, C_Y), (x, y), 8)

def draw_object():
    if iDistance < MAX_RANGE_CM:
        rad = math.radians(iAngle)
        dist_px = iDistance * PIX_SCALE
        x = C_X + math.cos(rad) * dist_px
        y = C_Y - math.sin(rad) * dist_px
        pygame.draw.circle(screen, (255, 10, 10), (int(x), int(y)), 5)

def draw_trail():
    for ang, dist in angle_history:
        if dist < MAX_RANGE_CM:
            rad = math.radians(ang)
            dist_px = dist * PIX_SCALE
            x = C_X + math.cos(rad) * dist_px
            y = C_Y - math.sin(rad) * dist_px
            pygame.draw.circle(screen, (0, 180, 0), (int(x), int(y)), 3)

def draw_text():
    font = pygame.font.SysFont(None, 28)
    pygame.draw.rect(screen, (0, 0, 0), [0, HEIGHT - 35, WIDTH, 35])
    screen.blit(font.render("ELECTRICAL MANDIR", True, (98, 245, 31)), (20, HEIGHT - 30))
    screen.blit(font.render(f"Angle: {iAngle}°", True, (98, 245, 31)), (WIDTH // 2 - 70, HEIGHT - 30))
    screen.blit(font.render(f"Distance: {iDistance} cm", True, (98, 245, 31)), (WIDTH - 200, HEIGHT - 30))

# --- Main Loop ---
while running:
    clock.tick(30)
    screen.fill((0, 0, 0))
    data_updated = False

    for e in pygame.event.get():
        if e.type == pygame.QUIT:
            running = False

    while ser.in_waiting:
        try:
            data = ser.read_until(b'.').decode().strip().rstrip('.')
            if ',' in data:
                a, d = data.split(',')
                iAngle = int(a)
                iDistance = int(d)
                distance_smooth.append(iDistance)
                iDistance = int(sum(distance_smooth) / len(distance_smooth))  # smooth it
                angle_history.append((iAngle, iDistance))
                data_updated = True
        except Exception:
            pass

    draw_radar()
    draw_trail()
    draw_sweep()
    draw_object()
    draw_text()
    pygame.display.flip()

ser.close()
pygame.quit()
