import serial
import pygame
import math
import time

# --- Serial setup ---
ser = serial.Serial('/dev/ttyUSB1', 9600, timeout=1)
time.sleep(2)

# --- Pygame setup (Smaller screen) ---
pygame.init()
WIDTH, HEIGHT = 800, 500  # smaller resolution
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
data = ""
data_updated = False  # <<< Track fresh data
running = True

# --- Helper Drawing Functions ---
def draw_radar():
    color = (98, 245, 31)
    for factor in [0.0625, 0.27, 0.479, 0.687]:
        rad = WIDTH - WIDTH * factor
        pygame.draw.arc(screen, color,
                        [C_X - rad / 2, C_Y - rad / 2, rad, rad],
                        math.pi, 2 * math.pi, 2)
    for deg in [0, 30, 60, 90, 120, 150]:
        rad = math.radians(deg)
        x = C_X + math.cos(rad) * (WIDTH / 2)
        y = C_Y - math.sin(rad) * (WIDTH / 2)
        pygame.draw.line(screen, color, (C_X, C_Y), (x, y), 2)

def draw_line():
    if data_updated:  # <<< only draw line if new angle just arrived
        rad = math.radians(iAngle)
        length = (HEIGHT - HEIGHT * 0.12)
        x = C_X + math.cos(rad) * length
        y = C_Y - math.sin(rad) * length
        pygame.draw.line(screen, (30, 250, 60), (C_X, C_Y), (x, y), 9)

def draw_object():
    if iDistance < MAX_RANGE_CM:
        rad = math.radians(iAngle)
        dist_px = iDistance * PIX_SCALE
        x1 = C_X + math.cos(rad) * dist_px
        y1 = C_Y - math.sin(rad) * dist_px
        x2 = C_X + math.cos(rad) * (WIDTH - WIDTH * 0.505)
        y2 = C_Y - math.sin(rad) * (WIDTH - WIDTH * 0.505)
        pygame.draw.line(screen, (255, 10, 10), (x1, y1), (x2, y2), 9)

def draw_text():
    font1 = pygame.font.SysFont(None, 30)
    font2 = pygame.font.SysFont(None, 20)
    noObject = "Out of Range" if iDistance > MAX_RANGE_CM else "In Range"

    pygame.draw.rect(screen, (0, 0, 0),
                     [0, HEIGHT - HEIGHT * 0.0648, WIDTH, HEIGHT * 0.0648])
    screen.blit(font1.render("ELECTRICAL MANDIR", True, (98, 245, 31)), (WIDTH * 0.05, HEIGHT * 0.95))
    screen.blit(font1.render(f"Angle: {iAngle}", True, (98, 245, 31)), (WIDTH * 0.42, HEIGHT * 0.95))
    screen.blit(font1.render(f"Distance: {iDistance} cm", True, (98, 245, 31)), (WIDTH * 0.65, HEIGHT * 0.95))

    for idx, cm in enumerate([10, 20, 30, 40]):
        x = WIDTH - WIDTH * (0.3854 - idx * 0.1044)
        screen.blit(font2.render(f"{cm}cm", True, (98, 245, 31)), (x, HEIGHT * 0.9167))

    for idx, deg in enumerate([30, 60, 90, 120, 150]):
        rad = math.radians(deg)
        x = C_X + math.cos(rad) * (WIDTH / 2)
        y = C_Y - math.sin(rad) * (WIDTH / 2)
        screen.blit(font2.render(str(deg), True, (98, 245, 60)), (x, y))

# --- Main Loop ---
while running:
    clock.tick(30)
    screen.fill((0, 0, 0))
    data_updated = False  # <<< reset at every frame

    for e in pygame.event.get():
        if e.type == pygame.QUIT:
            running = False

    while ser.in_waiting:
        try:
            data = ser.read_until(b'.').decode().strip().rstrip('.')
            if ',' in data:
                a, d = data.split(',')
                iAngle, iDistance = int(a), int(d)
                data_updated = True  # <<< Mark fresh data
        except Exception:
            pass

    draw_radar()
    draw_line()
    draw_object()
    draw_text()
    pygame.display.flip()

# Cleanup
ser.close()
pygame.quit()
