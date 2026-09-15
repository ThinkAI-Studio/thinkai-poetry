import math
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUTPUT_DIR = "public/floral"
os.makedirs(OUTPUT_DIR, exist_ok=True)

SCALE = 8  # Render at 8x scale (760x728 for 95x91) for sub-pixel anti-aliasing and soft blending

def create_canvas(w, h):
    return Image.new("RGBA", (w * SCALE, h * SCALE), (0, 0, 0, 0))

def save_scaled(img, filename, target_w, target_h):
    # Downscale with high quality Lanczos resampling
    final_img = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    path = os.path.join(OUTPUT_DIR, filename)
    final_img.save(path, "PNG", optimize=True)
    print(f"Generated: {path} ({target_w}x{target_h})")

# Helper: compute smooth bezier curve points
def bezier_curve(p0, p1, p2, p3, n_points=30):
    t = np.linspace(0, 1, n_points)[:, None]
    curve = (1-t)**3 * p0 + 3*(1-t)**2 * t * p1 + 3*(1-t) * t**2 * p2 + t**3 * p3
    return [(float(pt[0]), float(pt[1])) for pt in curve]

# -------------------------------------------------------------------------
# SUMMER BOTANICALS (MÙA HẠ)
# -------------------------------------------------------------------------

def gen_summer_lotus_pink():
    # 95x91 Lotus Flower (Orthographic flat top-down watercolor)
    W, H = 95, 91
    img = create_canvas(W, H)
    draw = ImageDraw.Draw(img)
    cx, cy = (W * SCALE) / 2, (H * SCALE) / 2

    # Outer 8 cupped, rounded lotus petals (not sharp triangles!)
    for i in range(8):
        ang = i * (math.pi / 4)
        poly = [(cx, cy)]
        r_len = 39 * SCALE
        w_spread = 15 * SCALE

        # Left contour of petal (smooth curved bell)
        p0 = np.array([cx, cy])
        p1 = np.array([cx + r_len*0.35*math.cos(ang) - w_spread*0.8*math.sin(ang),
                       cy + r_len*0.35*math.sin(ang) + w_spread*0.8*math.cos(ang)])
        p2 = np.array([cx + r_len*0.85*math.cos(ang) - w_spread*0.9*math.sin(ang),
                       cy + r_len*0.85*math.sin(ang) + w_spread*0.9*math.cos(ang)])
        # Tip is gently rounded with a slight organic taper
        tip = np.array([cx + r_len*math.cos(ang), cy + r_len*math.sin(ang)])
        
        left_pts = bezier_curve(p0, p1, p2, tip, 20)

        # Right contour of petal
        p3 = tip
        p4 = np.array([cx + r_len*0.85*math.cos(ang) + w_spread*0.9*math.sin(ang),
                       cy + r_len*0.85*math.sin(ang) - w_spread*0.9*math.cos(ang)])
        p5 = np.array([cx + r_len*0.35*math.cos(ang) + w_spread*0.8*math.sin(ang),
                       cy + r_len*0.35*math.sin(ang) - w_spread*0.8*math.cos(ang)])
        p6 = np.array([cx, cy])
        right_pts = bezier_curve(p3, p4, p5, p6, 20)

        poly = left_pts + right_pts[1:]
        draw.polygon(poly, fill=(251, 207, 232, 130)) # Soft lotus rose blush

    # Inner 8 offset petals (Lighter rose blush, alpha 145)
    for i in range(8):
        ang = i * (math.pi / 4) + (math.pi / 8)
        r_len = 31 * SCALE
        w_spread = 12 * SCALE

        p0 = np.array([cx, cy])
        p1 = np.array([cx + r_len*0.35*math.cos(ang) - w_spread*0.8*math.sin(ang),
                       cy + r_len*0.35*math.sin(ang) + w_spread*0.8*math.cos(ang)])
        p2 = np.array([cx + r_len*0.85*math.cos(ang) - w_spread*0.9*math.sin(ang),
                       cy + r_len*0.85*math.sin(ang) + w_spread*0.9*math.cos(ang)])
        tip = np.array([cx + r_len*math.cos(ang), cy + r_len*math.sin(ang)])
        left_pts = bezier_curve(p0, p1, p2, tip, 18)

        p3 = tip
        p4 = np.array([cx + r_len*0.85*math.cos(ang) + w_spread*0.9*math.sin(ang),
                       cy + r_len*0.85*math.sin(ang) - w_spread*0.9*math.cos(ang)])
        p5 = np.array([cx + r_len*0.35*math.cos(ang) + w_spread*0.8*math.sin(ang),
                       cy + r_len*0.35*math.sin(ang) - w_spread*0.8*math.cos(ang)])
        p6 = np.array([cx, cy])
        right_pts = bezier_curve(p3, p4, p5, p6, 18)

        poly = left_pts + right_pts[1:]
        draw.polygon(poly, fill=(254, 235, 243, 150))

    # Core: Sora Lattice style scalloped wavy ring (10 lobes)
    core_pts = []
    n_lobes = 10
    base_r = 10.5 * SCALE
    amp = 1.6 * SCALE
    for ang in np.linspace(0, 2*math.pi, 80):
        r = base_r + amp * math.cos(n_lobes * ang)
        core_pts.append((cx + r*math.cos(ang), cy + r*math.sin(ang)))
    draw.polygon(core_pts, fill=(251, 191, 36, 195))

    # Inner stamen button
    inner_r = 6.5 * SCALE
    draw.ellipse([cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r], fill=(245, 158, 11, 215))

    # 5-star suture lines in center
    for i in range(5):
        ang = i * (2*math.pi / 5) - math.pi/2
        ex = cx + (inner_r - 1*SCALE) * math.cos(ang)
        ey = cy + (inner_r - 1*SCALE) * math.sin(ang)
        draw.line([(cx, cy), (ex, ey)], fill=(217, 119, 6, 210), width=int(1.2 * SCALE))

    save_scaled(img, "summer-lotus-pink.png", W, H)


def gen_summer_flower_yellow():
    # 95x91 Summer Sun Flower / Hoàng Yến (6 cupped rounded petals)
    W, H = 95, 91
    img = create_canvas(W, H)
    draw = ImageDraw.Draw(img)
    cx, cy = (W * SCALE) / 2, (H * SCALE) / 2

    for i in range(6):
        ang = i * (math.pi / 3)
        r_len = 39 * SCALE
        w_spread = 16 * SCALE

        p0 = np.array([cx, cy])
        p1 = np.array([cx + r_len*0.3*math.cos(ang) - w_spread*0.8*math.sin(ang),
                       cy + r_len*0.3*math.sin(ang) + w_spread*0.8*math.cos(ang)])
        p2 = np.array([cx + r_len*0.8*math.cos(ang) - w_spread*0.9*math.sin(ang),
                       cy + r_len*0.8*math.sin(ang) + w_spread*0.9*math.cos(ang)])
        tip = np.array([cx + r_len*math.cos(ang), cy + r_len*math.sin(ang)])
        left_pts = bezier_curve(p0, p1, p2, tip, 20)

        p3 = tip
        p4 = np.array([cx + r_len*0.8*math.cos(ang) + w_spread*0.9*math.sin(ang),
                       cy + r_len*0.8*math.sin(ang) - w_spread*0.9*math.cos(ang)])
        p5 = np.array([cx + r_len*0.3*math.cos(ang) + w_spread*0.8*math.sin(ang),
                       cy + r_len*0.3*math.sin(ang) - w_spread*0.8*math.cos(ang)])
        p6 = np.array([cx, cy])
        right_pts = bezier_curve(p3, p4, p5, p6, 20)

        poly = left_pts + right_pts[1:]
        draw.polygon(poly, fill=(254, 240, 138, 132))

    # Core: Scalloped wavy amber stamen ring
    core_pts = []
    base_r = 11.5 * SCALE
    amp = 1.8 * SCALE
    for ang in np.linspace(0, 2*math.pi, 72):
        r = base_r + amp * math.cos(8 * ang)
        core_pts.append((cx + r*math.cos(ang), cy + r*math.sin(ang)))
    draw.polygon(core_pts, fill=(251, 191, 36, 195))

    inner_r = 7.2 * SCALE
    draw.ellipse([cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r], fill=(217, 119, 6, 215))

    for i in range(6):
        ang = i * (math.pi / 3)
        ex = cx + (inner_r - 1*SCALE) * math.cos(ang)
        ey = cy + (inner_r - 1*SCALE) * math.sin(ang)
        draw.line([(cx, cy), (ex, ey)], fill=(180, 83, 9, 210), width=int(1.2 * SCALE))

    save_scaled(img, "summer-flower-yellow.png", W, H)


def gen_summer_leaf_1():
    # 90x90 Lotus Pad (Soft organic circular leaf with natural curved notch)
    W, H = 90, 90
    img = create_canvas(W, H)
    draw = ImageDraw.Draw(img)
    cx, cy = (W * SCALE) / 2, (H * SCALE) / 2
    r_base = 38 * SCALE

    # Organic round boundary with subtle wave
    poly = []
    for deg in np.linspace(25, 335, 120):
        rad = math.radians(deg - 90)
        # Subtle organic wobble
        r = r_base + 1.2 * SCALE * math.sin(deg * 0.1)
        poly.append((cx + r * math.cos(rad), cy + r * math.sin(rad)))
    
    # Smooth curved notch into center
    notch_center = np.array([cx, cy + 4 * SCALE])
    p_right = np.array([cx + (r_base-2*SCALE)*math.cos(math.radians(25-90)), cy + (r_base-2*SCALE)*math.sin(math.radians(25-90))])
    p_left = np.array([cx + (r_base-2*SCALE)*math.cos(math.radians(335-90)), cy + (r_base-2*SCALE)*math.sin(math.radians(335-90))])
    
    notch_pts = bezier_curve(p_left, notch_center, notch_center, p_right, 20)
    poly = poly + notch_pts

    draw.polygon(poly, fill=(167, 243, 208, 130)) # Celadon / jade green

    # 6 soft curved radiating veins
    for ang_deg in [45, 95, 145, 195, 245, 295]:
        rad = math.radians(ang_deg)
        x2 = cx + (r_base - 5 * SCALE) * math.cos(rad)
        y2 = cy + 4 * SCALE + (r_base - 5 * SCALE) * math.sin(rad)
        # Curved vein
        mid_x = (cx + x2)/2 + 2*SCALE*math.sin(rad)
        mid_y = (cy + 4*SCALE + y2)/2 - 2*SCALE*math.cos(rad)
        pts = bezier_curve(np.array([cx, cy + 4*SCALE]), np.array([mid_x, mid_y]), np.array([mid_x, mid_y]), np.array([x2, y2]), 15)
        draw.line(pts, fill=(52, 211, 153, 185), width=int(1.3 * SCALE))

    # Center stem knot
    draw.ellipse([cx - 3 * SCALE, cy + 1 * SCALE, cx + 3 * SCALE, cy + 7 * SCALE], fill=(16, 185, 129, 210))

    save_scaled(img, "summer-leaf-1.png", W, H)


def gen_summer_leaf_2():
    # 90x90 Willow Leaf (Graceful curved lanceolate leaf like leaf-1.png)
    W, H = 90, 90
    img = create_canvas(W, H)
    draw = ImageDraw.Draw(img)

    p0 = np.array([20 * SCALE, 82 * SCALE])
    p1 = np.array([30 * SCALE, 50 * SCALE])
    p2 = np.array([55 * SCALE, 25 * SCALE])
    tip = np.array([72 * SCALE, 14 * SCALE])
    left_pts = bezier_curve(p0, p1, p2, tip, 30)

    p3 = tip
    p4 = np.array([66 * SCALE, 38 * SCALE])
    p5 = np.array([46 * SCALE, 68 * SCALE])
    p6 = p0
    right_pts = bezier_curve(p3, p4, p5, p6, 30)

    poly = left_pts + right_pts[1:]
    draw.polygon(poly, fill=(110, 231, 183, 132))

    # Midrib vein
    v_p1 = np.array([38 * SCALE, 52 * SCALE])
    v_p2 = np.array([58 * SCALE, 28 * SCALE])
    vein_pts = bezier_curve(p0, v_p1, v_p2, tip, 25)
    draw.line(vein_pts, fill=(5, 150, 105, 192), width=int(1.5 * SCALE))

    save_scaled(img, "summer-leaf-2.png", W, H)


# -------------------------------------------------------------------------
# AUTUMN BOTANICALS (MÙA THU)
# -------------------------------------------------------------------------

def gen_autumn_momiji_pink():
    # 95x91 Japanese Momiji Maple (Curved, organic 7-lobed silhouette, NOT a ninja star!)
    W, H = 95, 91
    img = create_canvas(W, H)
    draw = ImageDraw.Draw(img)
    cx, cy = (W * SCALE) / 2, (H * SCALE) * 0.52

    # Lobe directions (7 natural angles)
    angles_deg = [-135, -95, -50, 0, 50, 95, 135]
    lengths = [29, 36, 40, 43, 40, 36, 29]

    poly = [(cx, cy + 8 * SCALE)]
    for ang_deg, length in zip(angles_deg, lengths):
        rad = math.radians(ang_deg - 90)
        # Left side of lobe
        rad_l = math.radians(ang_deg - 14 - 90)
        poly.append((cx + length*0.6*SCALE*math.cos(rad_l), cy + length*0.6*SCALE*math.sin(rad_l)))
        # Rounded tip of lobe
        tip_x = cx + length * SCALE * math.cos(rad)
        tip_y = cy + length * SCALE * math.sin(rad)
        poly.append((tip_x, tip_y))
        # Right side of lobe
        rad_r = math.radians(ang_deg + 14 - 90)
        poly.append((cx + length*0.6*SCALE*math.cos(rad_r), cy + length*0.6*SCALE*math.sin(rad_r)))

    poly.append((cx, cy + 8 * SCALE))
    draw.polygon(poly, fill=(253, 164, 175, 135)) # Coral rose blush

    # Plump organic center
    draw.ellipse([cx - 15*SCALE, cy - 11*SCALE, cx + 15*SCALE, cy + 11*SCALE], fill=(253, 164, 175, 135))

    # Radiating veins to lobes
    for ang_deg, length in zip(angles_deg, lengths):
        rad = math.radians(ang_deg - 90)
        tip_x = cx + (length - 3) * SCALE * math.cos(rad)
        tip_y = cy + (length - 3) * SCALE * math.sin(rad)
        draw.line([(cx, cy), (tip_x, tip_y)], fill=(225, 29, 72, 192), width=int(1.3 * SCALE))

    # Petiole stem
    draw.line([(cx, cy), (cx, cy + 18 * SCALE)], fill=(190, 18, 60, 210), width=int(1.8 * SCALE))

    save_scaled(img, "autumn-momiji-pink.png", W, H)


def gen_autumn_flower_yellow():
    # 95x91 Autumn Chrysanthemum (Hoàng Cúc cupped petals, layered watercolor)
    W, H = 95, 91
    img = create_canvas(W, H)
    draw = ImageDraw.Draw(img)
    cx, cy = (W * SCALE) / 2, (H * SCALE) / 2

    # Outer 12 rounded petals
    for i in range(12):
        ang = i * (math.pi / 6)
        r_len = 39 * SCALE
        w_spread = 11 * SCALE

        p0 = np.array([cx, cy])
        p1 = np.array([cx + r_len*0.3*math.cos(ang) - w_spread*0.8*math.sin(ang),
                       cy + r_len*0.3*math.sin(ang) + w_spread*0.8*math.cos(ang)])
        p2 = np.array([cx + r_len*0.8*math.cos(ang) - w_spread*0.9*math.sin(ang),
                       cy + r_len*0.8*math.sin(ang) + w_spread*0.9*math.cos(ang)])
        tip = np.array([cx + r_len*math.cos(ang), cy + r_len*math.sin(ang)])
        left_pts = bezier_curve(p0, p1, p2, tip, 16)

        p3 = tip
        p4 = np.array([cx + r_len*0.8*math.cos(ang) + w_spread*0.9*math.sin(ang),
                       cy + r_len*0.8*math.sin(ang) - w_spread*0.9*math.cos(ang)])
        p5 = np.array([cx + r_len*0.3*math.cos(ang) + w_spread*0.8*math.sin(ang),
                       cy + r_len*0.3*math.sin(ang) - w_spread*0.8*math.cos(ang)])
        p6 = np.array([cx, cy])
        right_pts = bezier_curve(p3, p4, p5, p6, 16)

        draw.polygon(left_pts + right_pts[1:], fill=(253, 230, 138, 130))

    # Inner 12 offset petals
    for i in range(12):
        ang = i * (math.pi / 6) + (math.pi / 12)
        r_len = 28 * SCALE
        w_spread = 8.5 * SCALE

        p0 = np.array([cx, cy])
        p1 = np.array([cx + r_len*0.3*math.cos(ang) - w_spread*0.8*math.sin(ang),
                       cy + r_len*0.3*math.sin(ang) + w_spread*0.8*math.cos(ang)])
        p2 = np.array([cx + r_len*0.8*math.cos(ang) - w_spread*0.9*math.sin(ang),
                       cy + r_len*0.8*math.sin(ang) + w_spread*0.9*math.cos(ang)])
        tip = np.array([cx + r_len*math.cos(ang), cy + r_len*math.sin(ang)])
        left_pts = bezier_curve(p0, p1, p2, tip, 14)

        p3 = tip
        p4 = np.array([cx + r_len*0.8*math.cos(ang) + w_spread*0.9*math.sin(ang),
                       cy + r_len*0.8*math.sin(ang) - w_spread*0.9*math.cos(ang)])
        p5 = np.array([cx + r_len*0.3*math.cos(ang) + w_spread*0.8*math.sin(ang),
                       cy + r_len*0.3*math.sin(ang) - w_spread*0.8*math.cos(ang)])
        p6 = np.array([cx, cy])
        right_pts = bezier_curve(p3, p4, p5, p6, 14)

        draw.polygon(left_pts + right_pts[1:], fill=(254, 240, 138, 150))

    # Core button
    core_pts = []
    base_r = 10 * SCALE
    amp = 1.5 * SCALE
    for ang in np.linspace(0, 2*math.pi, 60):
        r = base_r + amp * math.cos(10 * ang)
        core_pts.append((cx + r*math.cos(ang), cy + r*math.sin(ang)))
    draw.polygon(core_pts, fill=(217, 119, 6, 195))

    inner_r = 6 * SCALE
    draw.ellipse([cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r], fill=(180, 83, 9, 215))

    save_scaled(img, "autumn-flower-yellow.png", W, H)


def gen_autumn_leaf_1():
    # 90x90 Ginkgo Biloba Leaf (Fan shaped with scalloped wavy top edge)
    W, H = 90, 90
    img = create_canvas(W, H)
    draw = ImageDraw.Draw(img)
    cx, cy = (W * SCALE) / 2, (H * SCALE) * 0.65

    r = 44 * SCALE
    poly = [(cx, cy)]
    for deg in np.linspace(-65, 65, 60):
        rad = math.radians(deg - 90)
        # Wavy edge
        wobble = 1.4 * SCALE * math.sin(deg * 0.35)
        # Central notch
        notch = 0.85 if abs(deg) < 9 else 1.0
        r_cur = (r + wobble) * notch
        poly.append((cx + r_cur * math.cos(rad), cy + r_cur * math.sin(rad)))
    poly.append((cx, cy))

    draw.polygon(poly, fill=(253, 224, 71, 132)) # Golden ginkgo yellow

    # Fan ribs
    for deg in np.linspace(-56, 56, 13):
        rad = math.radians(deg - 90)
        notch = 0.82 if abs(deg) < 9 else 0.94
        r_cur = r * notch
        x2 = cx + r_cur * math.cos(rad)
        y2 = cy + r_cur * math.sin(rad)
        draw.line([(cx, cy), (x2, y2)], fill=(202, 138, 4, 192), width=int(1.2 * SCALE))

    # Stem
    draw.line([(cx, cy), (cx, cy + 18 * SCALE)], fill=(161, 98, 7, 210), width=int(1.8 * SCALE))

    save_scaled(img, "autumn-leaf-1.png", W, H)


def gen_autumn_leaf_2():
    # 90x90 Amber Oak Leaf (Curving warm autumn leaf)
    W, H = 90, 90
    img = create_canvas(W, H)
    draw = ImageDraw.Draw(img)
    cx, cy = (W * SCALE) / 2, (H * SCALE) / 2

    poly = []
    for t in np.linspace(0, 1, 60):
        ang = t * 2 * math.pi
        r = (35 + 5 * math.sin(5 * ang)) * SCALE
        x = cx + r * math.cos(ang) * 0.72 - (8 * SCALE * math.sin(t * math.pi))
        y = cy + r * math.sin(ang)
        poly.append((x, y))

    draw.polygon(poly, fill=(253, 186, 116, 132))

    vein_pts = []
    for t in np.linspace(0, 1, 30):
        y = (cy - 34 * SCALE) + (68 * SCALE * t)
        x = cx - (7 * SCALE * math.sin(t * math.pi))
        vein_pts.append((x, y))
    draw.line(vein_pts, fill=(234, 88, 12, 192), width=int(1.4 * SCALE))

    save_scaled(img, "autumn-leaf-2.png", W, H)


# -------------------------------------------------------------------------
# WINTER BOTANICALS (MÙA ĐÔNG)
# -------------------------------------------------------------------------

def gen_winter_camellia_pink():
    # 95x91 Winter Camellia (Layered rounded cupped petals, NOT a hexagon!)
    W, H = 95, 91
    img = create_canvas(W, H)
    draw = ImageDraw.Draw(img)
    cx, cy = (W * SCALE) / 2, (H * SCALE) / 2

    # Outer 6 cupped, rounded petals (overlapping like Sora Lattice pink flower)
    for i in range(6):
        ang = i * (math.pi / 3)
        r_len = 39 * SCALE
        w_spread = 19 * SCALE

        p0 = np.array([cx, cy])
        p1 = np.array([cx + r_len*0.35*math.cos(ang) - w_spread*0.8*math.sin(ang),
                       cy + r_len*0.35*math.sin(ang) + w_spread*0.8*math.cos(ang)])
        p2 = np.array([cx + r_len*0.85*math.cos(ang) - w_spread*0.9*math.sin(ang),
                       cy + r_len*0.85*math.sin(ang) + w_spread*0.9*math.cos(ang)])
        tip = np.array([cx + r_len*math.cos(ang), cy + r_len*math.sin(ang)])
        left_pts = bezier_curve(p0, p1, p2, tip, 20)

        p3 = tip
        p4 = np.array([cx + r_len*0.85*math.cos(ang) + w_spread*0.9*math.sin(ang),
                       cy + r_len*0.85*math.sin(ang) - w_spread*0.9*math.cos(ang)])
        p5 = np.array([cx + r_len*0.35*math.cos(ang) + w_spread*0.8*math.sin(ang),
                       cy + r_len*0.35*math.sin(ang) - w_spread*0.8*math.cos(ang)])
        p6 = np.array([cx, cy])
        right_pts = bezier_curve(p3, p4, p5, p6, 20)

        draw.polygon(left_pts + right_pts[1:], fill=(251, 113, 133, 132)) # Winter berry rose

    # Inner 6 offset petals
    for i in range(6):
        ang = i * (math.pi / 3) + (math.pi / 6)
        r_len = 29 * SCALE
        w_spread = 14 * SCALE

        p0 = np.array([cx, cy])
        p1 = np.array([cx + r_len*0.35*math.cos(ang) - w_spread*0.8*math.sin(ang),
                       cy + r_len*0.35*math.sin(ang) + w_spread*0.8*math.cos(ang)])
        p2 = np.array([cx + r_len*0.85*math.cos(ang) - w_spread*0.9*math.sin(ang),
                       cy + r_len*0.85*math.sin(ang) + w_spread*0.9*math.cos(ang)])
        tip = np.array([cx + r_len*math.cos(ang), cy + r_len*math.sin(ang)])
        left_pts = bezier_curve(p0, p1, p2, tip, 16)

        p3 = tip
        p4 = np.array([cx + r_len*0.85*math.cos(ang) + w_spread*0.9*math.sin(ang),
                       cy + r_len*0.85*math.sin(ang) - w_spread*0.9*math.cos(ang)])
        p5 = np.array([cx + r_len*0.35*math.cos(ang) + w_spread*0.8*math.sin(ang),
                       cy + r_len*0.35*math.sin(ang) - w_spread*0.8*math.cos(ang)])
        p6 = np.array([cx, cy])
        right_pts = bezier_curve(p3, p4, p5, p6, 16)

        draw.polygon(left_pts + right_pts[1:], fill=(254, 205, 211, 150))

    # Core: Scalloped golden stamen ring
    core_pts = []
    base_r = 10 * SCALE
    amp = 1.5 * SCALE
    for ang in np.linspace(0, 2*math.pi, 60):
        r = base_r + amp * math.cos(8 * ang)
        core_pts.append((cx + r*math.cos(ang), cy + r*math.sin(ang)))
    draw.polygon(core_pts, fill=(254, 240, 138, 195))

    inner_r = 6 * SCALE
    draw.ellipse([cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r], fill=(234, 179, 8, 215))

    save_scaled(img, "winter-camellia-pink.png", W, H)


def gen_winter_flower_white():
    # 95x91 Snow Plum / White Ice Plum (5 rounded cupped ice petals)
    W, H = 95, 91
    img = create_canvas(W, H)
    draw = ImageDraw.Draw(img)
    cx, cy = (W * SCALE) / 2, (H * SCALE) / 2

    for i in range(5):
        ang = i * (2 * math.pi / 5) - (math.pi / 2)
        r_len = 39 * SCALE
        w_spread = 16 * SCALE

        p0 = np.array([cx, cy])
        p1 = np.array([cx + r_len*0.35*math.cos(ang) - w_spread*0.8*math.sin(ang),
                       cy + r_len*0.35*math.sin(ang) + w_spread*0.8*math.cos(ang)])
        p2 = np.array([cx + r_len*0.85*math.cos(ang) - w_spread*0.9*math.sin(ang),
                       cy + r_len*0.85*math.sin(ang) + w_spread*0.9*math.cos(ang)])
        tip = np.array([cx + r_len*math.cos(ang), cy + r_len*math.sin(ang)])
        left_pts = bezier_curve(p0, p1, p2, tip, 20)

        p3 = tip
        p4 = np.array([cx + r_len*0.85*math.cos(ang) + w_spread*0.9*math.sin(ang),
                       cy + r_len*0.85*math.sin(ang) - w_spread*0.9*math.cos(ang)])
        p5 = np.array([cx + r_len*0.35*math.cos(ang) + w_spread*0.8*math.sin(ang),
                       cy + r_len*0.35*math.sin(ang) - w_spread*0.8*math.cos(ang)])
        p6 = np.array([cx, cy])
        right_pts = bezier_curve(p3, p4, p5, p6, 20)

        draw.polygon(left_pts + right_pts[1:], fill=(240, 249, 255, 142)) # Frosted ice white

    # Core: Frozen blue ice stamen disk
    core_pts = []
    base_r = 10 * SCALE
    amp = 1.5 * SCALE
    for ang in np.linspace(0, 2*math.pi, 50):
        r = base_r + amp * math.cos(5 * ang)
        core_pts.append((cx + r*math.cos(ang), cy + r*math.sin(ang)))
    draw.polygon(core_pts, fill=(186, 230, 253, 195))

    inner_r = 6 * SCALE
    draw.ellipse([cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r], fill=(56, 189, 248, 215))

    for i in range(10):
        ang = i * (math.pi / 5)
        x2 = cx + (core_r := 10*SCALE - 1*SCALE) * math.cos(ang)
        y2 = cy + (core_r) * math.sin(ang)
        draw.line([(cx, cy), (x2, y2)], fill=(2, 132, 199, 210), width=int(1.2 * SCALE))

    save_scaled(img, "winter-flower-white.png", W, H)


def gen_winter_leaf_1():
    # 90x90 Frosted Pine Sprig (Organic soft curved needles with snow tips)
    W, H = 90, 90
    img = create_canvas(W, H)
    draw = ImageDraw.Draw(img)
    cx, cy = (W * SCALE) / 2, (H * SCALE) * 0.65

    stem_pts = [(cx, cy + 18 * SCALE), (cx, cy - 36 * SCALE)]
    draw.line(stem_pts, fill=(2, 132, 199, 195), width=int(2.4 * SCALE))

    # Curved pairs of pine needles
    for y_pos in np.linspace(cy + 12 * SCALE, cy - 30 * SCALE, 8):
        for side in [-1, 1]:
            tip_x = cx + side * (27 * SCALE)
            tip_y = y_pos - (10 * SCALE)
            mid_x = cx + side * (14 * SCALE)
            mid_y = y_pos - (4 * SCALE)
            pts = bezier_curve(np.array([cx, y_pos]), np.array([mid_x, mid_y]), np.array([mid_x, mid_y]), np.array([tip_x, tip_y]), 12)
            draw.line(pts, fill=(186, 230, 253, 150), width=int(2.0 * SCALE))
            draw.ellipse([tip_x - 1.5 * SCALE, tip_y - 1.5 * SCALE, tip_x + 1.5 * SCALE, tip_y + 1.5 * SCALE], fill=(255, 255, 255, 210))

    save_scaled(img, "winter-leaf-1.png", W, H)


def gen_winter_leaf_2():
    # 90x90 Crystalline Snowflake (Delicate 6-axis crystal with feathered joints)
    W, H = 90, 90
    img = create_canvas(W, H)
    draw = ImageDraw.Draw(img)
    cx, cy = (W * SCALE) / 2, (H * SCALE) / 2

    for i in range(6):
        ang = i * (math.pi / 3)
        r_main = 38 * SCALE
        x_end = cx + r_main * math.cos(ang)
        y_end = cy + r_main * math.sin(ang)
        draw.line([(cx, cy), (x_end, y_end)], fill=(255, 255, 255, 150), width=int(2.2 * SCALE))

        for b_r in [19 * SCALE, 29 * SCALE]:
            bx = cx + b_r * math.cos(ang)
            by = cy + b_r * math.sin(ang)
            branch_len = 9 * SCALE
            for sign in [-1, 1]:
                b_ang = ang + sign * (math.pi / 4)
                ex = bx + branch_len * math.cos(b_ang)
                ey = by + branch_len * math.sin(b_ang)
                draw.line([(bx, by), (ex, ey)], fill=(224, 242, 254, 160), width=int(1.6 * SCALE))

    draw.ellipse([cx - 5 * SCALE, cy - 5 * SCALE, cx + 5 * SCALE, cy + 5 * SCALE], fill=(56, 189, 248, 205))

    save_scaled(img, "winter-leaf-2.png", W, H)


if __name__ == "__main__":
    print("Generating refined Sora Lattice watercolor botanical PNG assets...")
    gen_summer_lotus_pink()
    gen_summer_flower_yellow()
    gen_summer_leaf_1()
    gen_summer_leaf_2()

    gen_autumn_momiji_pink()
    gen_autumn_flower_yellow()
    gen_autumn_leaf_1()
    gen_autumn_leaf_2()

    gen_winter_camellia_pink()
    gen_winter_flower_white()
    gen_winter_leaf_1()
    gen_winter_leaf_2()
    print("All 12 refined Sora Lattice assets successfully generated!")
