import serial
import pygame
import math
import time
from collections import deque

# --- Serial Setup ---
ser = serial.Serial('/dev/ttyUSB0', 9600, timeout=1)
time.sleep(2)

# --- Pygame Setup ---
pygame.init()
WIDTH, HEIGHT = 1100, 500
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Ultrasonic Radar System")
clock = pygame.time.Clock()

# --- Radar Settings ---
CENTER_X = WIDTH // 2
CENTER_Y = HEIGHT - 60
MAX_RANGE_CM = 35
PIXEL_SCALE = (HEIGHT - 150) / MAX_RANGE_CM

# --- Visual State ---
angle = 0
distance = 0
angle_history = deque(maxlen=200)
distance_filter = deque(maxlen=5)
data_updated = False

# --- Colors ---
GREEN = (98, 245, 31)
DARK_GREEN = (0, 100, 0)
RED = (255, 40, 40)
BRIGHT_RED = (255, 80, 80)
BG_COLOR = (0, 0, 0)

# --- Drawing Functions ---
def draw_grid():
    font = pygame.font.SysFont("consolas", 16)
    
    for r in range(5, MAX_RANGE_CM + 1, 5):
        pygame.draw.circle(screen, GREEN, (CENTER_X, CENTER_Y), int(r * PIXEL_SCALE), 1)
        label = font.render(f"{r} cm", True, GREEN)
        screen.blit(label, (CENTER_X + r * PIXEL_SCALE - 25, CENTER_Y - 20))

    for a in range(0, 181, 30):
        rad = math.radians(a)
        x = CENTER_X + math.cos(rad) * MAX_RANGE_CM * PIXEL_SCALE
        y = CENTER_Y - math.sin(rad) * MAX_RANGE_CM * PIXEL_SCALE
        pygame.draw.line(screen, DARK_GREEN, (CENTER_X, CENTER_Y), (x, y), 1)

        label = font.render(f"{a}°", True, GREEN)
        label_x = x + 10 if a < 90 else x - 35 if a > 90 else x - 15
        label_y = y - 20 if a != 0 and a != 180 else y
        screen.blit(label, (label_x, label_y))

def draw_sweep():
    rad = math.radians(angle)
    x = CENTER_X + math.cos(rad) * MAX_RANGE_CM * PIXEL_SCALE
    y = CENTER_Y - math.sin(rad) * MAX_RANGE_CM * PIXEL_SCALE
    pygame.draw.line(screen, GREEN, (CENTER_X, CENTER_Y), (x, y), 3)

def draw_detected_object():
    if distance <= MAX_RANGE_CM:
        rad = math.radians(angle)
        dist_px = distance * PIXEL_SCALE
        x = CENTER_X + math.cos(rad) * dist_px
        y = CENTER_Y - math.sin(rad) * dist_px
        color = BRIGHT_RED if distance < 35 else RED
        pygame.draw.circle(screen, color, (int(x), int(y)), 6)

def draw_trail():
    for i, (a, d) in enumerate(angle_history):
        if d <= MAX_RANGE_CM:
            rad = math.radians(a)
            dist_px = d * PIXEL_SCALE
            x = CENTER_X + math.cos(rad) * dist_px
            y = CENTER_Y - math.sin(rad) * dist_px
            color = (0, min(255, 180 + i), 0)
            pygame.draw.circle(screen, color, (int(x), int(y)), 3)

def draw_info_panel():
    pygame.draw.rect(screen, (0, 0, 0), (0, HEIGHT - 40, WIDTH, 40))
    pygame.draw.line(screen, GREEN, (0, HEIGHT - 40), (WIDTH, HEIGHT - 40), 2)
    font = pygame.font.SysFont("consolas", 20)
    screen.blit(font.render("ULTRASONIC RADAR SYSTEM", True, GREEN), (20, HEIGHT - 30))
    screen.blit(font.render(f"Angle: {angle:03}°", True, GREEN), (WIDTH // 2 - 80, HEIGHT - 30))
    screen.blit(font.render(f"Distance: {distance:02} cm", True, GREEN), (WIDTH - 200, HEIGHT - 30))

# --- Main Loop ---
running = True
while running:
    clock.tick(30)
    screen.fill(BG_COLOR)
    data_updated = False

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    while ser.in_waiting:
        try:
            data = ser.read_until(b'.').decode().strip().rstrip('.')
            if ',' in data:
                a_str, d_str = data.split(',')
                angle = int(a_str)
                dist = int(d_str)
                if 0 <= angle <= 180 and 2 <= dist <= 400:
                    distance_filter.append(dist)
                    distance = int(sum(distance_filter) / len(distance_filter))
                    angle_history.append((angle, distance))
                    data_updated = True
        except Exception:
            continue

    draw_grid()
    draw_trail()
    if data_updated:
        draw_sweep()
        draw_detected_object()
    draw_info_panel()

    pygame.display.flip()

# --- Exit Cleanly ---
ser.close()
pygame.quit()
