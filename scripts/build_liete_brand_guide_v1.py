from pathlib import Path
import math

from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, Color
from reportlab.lib.utils import ImageReader


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "Liete_Guia_Essencial_de_Marca_v1.0.pdf"
FONT_DIR = ROOT / "assets" / "fonts"
BRAND_DIR = ROOT / "assets" / "brand"
LOGO = str(BRAND_DIR / "liete-logo.png")
ICON = str(BRAND_DIR / "liete-icon.png")

W, H = 960, 540
M = 52

C = {
    "green50": HexColor("#F2FFF7"),
    "green100": HexColor("#CCFFDF"),
    "green300": HexColor("#66FFA9"),
    "green500": HexColor("#00FF6F"),
    "green700": HexColor("#009943"),
    "green900": HexColor("#003316"),
    "pink50": HexColor("#FFF2F9"),
    "pink100": HexColor("#FFD6E9"),
    "pink300": HexColor("#FF66B6"),
    "pink500": HexColor("#FF0090"),
    "pink700": HexColor("#B30065"),
    "pink900": HexColor("#66003A"),
    "black": HexColor("#111111"),
    "gray": HexColor("#666666"),
    "gray2": HexColor("#A7A7A7"),
    "gray3": HexColor("#E8E8E8"),
    "white": HexColor("#FFFFFF"),
}


def register_fonts():
    pdfmetrics.registerFont(TTFont("Bricolage", str(FONT_DIR / "BricolageGrotesque.ttf")))
    pdfmetrics.registerFont(TTFont("SourceSans", str(FONT_DIR / "SourceSans3.ttf")))


def set_font(c, family, size, color):
    c.setFont(family, size)
    c.setFillColor(color)


def txt(c, x, y, value, family="SourceSans", size=11, color=None):
    set_font(c, family, size, color or C["black"])
    c.drawString(x, y, value)


def txt_right(c, x, y, value, family="SourceSans", size=9, color=None):
    set_font(c, family, size, color or C["black"])
    c.drawRightString(x, y, value)


def wrap(value, width, family, size):
    lines, current = [], ""
    for word in value.split():
        test = word if not current else current + " " + word
        if pdfmetrics.stringWidth(test, family, size) <= width:
            current = test
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def para(c, x, y, value, width, family="SourceSans", size=11, leading=None,
         color=None, max_lines=None):
    leading = leading or size * 1.25
    lines = wrap(value, width, family, size)
    if max_lines:
        lines = lines[:max_lines]
    set_font(c, family, size, color or C["black"])
    for i, line in enumerate(lines):
        c.drawString(x, y - i * leading, line)
    return y - len(lines) * leading


def rr(c, x, y, w, h, fill, radius=14, stroke=None, sw=1):
    c.saveState()
    c.setFillColor(fill)
    if stroke:
        c.setStrokeColor(stroke)
        c.setLineWidth(sw)
    else:
        c.setStrokeColor(fill)
    c.roundRect(x, y, w, h, radius, fill=1, stroke=1 if stroke else 0)
    c.restoreState()


def line(c, x1, y1, x2, y2, color, sw=1, dash=None):
    c.saveState()
    c.setStrokeColor(color)
    c.setLineWidth(sw)
    c.setLineCap(1)
    if dash:
        c.setDash(*dash)
    c.line(x1, y1, x2, y2)
    c.restoreState()


def circle(c, x, y, r, fill, stroke=None, sw=1):
    c.saveState()
    c.setFillColor(fill)
    if stroke:
        c.setStrokeColor(stroke)
        c.setLineWidth(sw)
    c.circle(x, y, r, fill=1, stroke=1 if stroke else 0)
    c.restoreState()


def pill(c, x, y, label, fill, color, width=None, h=24, size=8.5):
    width = width or pdfmetrics.stringWidth(label, "SourceSans", size) + 22
    rr(c, x, y, width, h, fill, h / 2)
    set_font(c, "SourceSans", size, color)
    c.drawCentredString(x + width / 2, y + (h - size) / 2 + 1.5, label.upper())
    return width


def draw_wordmark(c, x, y, w, h, clip=True):
    """Draw the supplied wordmark while keying out its original green field."""
    # Source black-art bounds: x 924..2626, y(top) 506..1041 on 3548 x 1662.
    scale = min(w / 1702.0, h / 535.0)
    draw_w, draw_h = 3548 * scale, 1662 * scale
    draw_x = x - 924 * scale
    draw_y = y - 621 * scale
    c.saveState()
    if clip:
        p = c.beginPath()
        p.rect(x, y, w, h)
        c.clipPath(p, stroke=0, fill=0)
    c.drawImage(LOGO, draw_x, draw_y, draw_w, draw_h,
                preserveAspectRatio=False,
                mask=[8, 8, 241, 241, 126, 126])
    c.restoreState()


def draw_icon(c, x, y, size):
    c.drawImage(ICON, x, y, size, size, preserveAspectRatio=True, mask="auto")


def header(c, page, section, dark=False):
    main = C["white"] if dark else C["black"]
    sub = Color(1, 1, 1, .58) if dark else C["gray"]
    if dark:
        rr(c, M, H - 44, 68, 25, C["green500"], 8)
        draw_wordmark(c, M + 6, H - 38, 56, 17)
    else:
        draw_wordmark(c, M, H - 38, 58, 19)
    txt(c, M + 76, H - 34, section.upper(), "SourceSans", 8, sub)
    txt_right(c, W - M, H - 34, f"0{page} / 06", "SourceSans", 8, sub)


def footer(c, dark=False, left="Guia essencial de marca - versão 1.0"):
    col = Color(1, 1, 1, .52) if dark else C["gray2"]
    txt(c, M, 24, left, "SourceSans", 7.2, col)
    txt_right(c, W - M, 24, "Liete - Caminhos Abertos", "SourceSans", 7.2, col)


def heading(c, kicker, title, subtitle=None, y=440, width=820, dark=False):
    pill(c, M, y + 19, kicker, C["pink500"], C["black"])
    col = C["white"] if dark else C["black"]
    lines = wrap(title, width, "Bricolage", 35)
    set_font(c, "Bricolage", 35, col)
    for i, item in enumerate(lines):
        c.drawString(M, y - i * 39, item)
    bottom = y - len(lines) * 39
    if subtitle:
        para(c, M, bottom - 6, subtitle, width, "SourceSans", 11.5, 15,
             Color(1, 1, 1, .66) if dark else C["gray"])
    return bottom


def path_curve(c, points, color, sw=3, dotted=False):
    c.saveState()
    c.setStrokeColor(color)
    c.setLineWidth(sw)
    c.setLineCap(1)
    if dotted:
        c.setDash(2, 7)
    p = c.beginPath()
    p.moveTo(points[0][0], points[0][1])
    p.curveTo(points[1][0], points[1][1], points[2][0], points[2][1], points[3][0], points[3][1])
    c.drawPath(p, fill=0, stroke=1)
    c.restoreState()


def cover(c):
    c.setFillColor(C["green500"])
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # Brand path, contained and high energy.
    path_curve(c, [(585, 34), (672, 180), (765, 120), (908, 410)], C["pink500"], 8)
    circle(c, 586, 34, 8, C["black"], C["white"], 2)
    circle(c, 908, 410, 8, C["pink500"], C["black"], 2)

    txt(c, M, H - 54, "GUIA ESSENCIAL DE MARCA", "SourceSans", 9, C["black"])
    draw_wordmark(c, M, 302, 420, 132)
    txt(c, M, 263, "Natureza ao seu alcance.", "Bricolage", 24, C["black"])
    para(c, M, 219,
         "Uma marca que abre caminhos para viver a natureza e transforma iniciativa em possibilidade de renda.",
         400, "SourceSans", 13, 18, C["black"])

    rr(c, 662, 66, 210, 210, C["black"], 34)
    draw_icon(c, 696, 100, 142)
    pill(c, M, 116, "ESTRATÉGIA + EXPRESSÃO + PRODUTO", C["black"], C["green500"], 218)
    txt(c, M, 82, "Versão 1.0  |  Julho de 2026", "SourceSans", 9, C["black"])
    txt(c, M, 24, "Logo e ícone fornecidos pela marca", "SourceSans", 7.2, C["black"])
    txt_right(c, W - M, 24, "Aplicações conceituais", "SourceSans", 7.2, C["black"])
    c.showPage()


def strategy(c):
    c.setFillColor(C["white"])
    c.rect(0, 0, W, H, fill=1, stroke=0)
    header(c, 2, "Estratégia")
    heading(c, "ESSÊNCIA", "Abrir caminhos para viver e fazer acontecer.",
            "A Liete aproxima desejo de natureza, capacidade de organização e oportunidade de crescimento.",
            y=418, width=820)

    y, h, gap = 176, 139, 14
    w = (W - 2 * M - 2 * gap) / 3
    cards = [
        ("01", "PROPÓSITO", "Mais pessoas vivendo a natureza. Mais organizadores transformando iniciativa em renda.", C["green50"]),
        ("02", "POSICIONAMENTO", "A plataforma que conecta viajantes a experiências criadas por organizadores independentes.", C["green100"]),
        ("03", "PROMESSA", "Natureza acessível para quem quer viver. Alcance e autonomia para quem faz acontecer.", C["pink50"]),
    ]
    for i, (num, label, body, fill) in enumerate(cards):
        x = M + i * (w + gap)
        rr(c, x, y, w, h, fill, 18)
        txt(c, x + 18, y + 104, num, "Bricolage", 22, C["black"])
        txt(c, x + 18, y + 80, label, "SourceSans", 8.5, C["gray"])
        para(c, x + 18, y + 55, body, w - 36, "SourceSans", 11, 14, C["black"])

    pill(c, M, 118, "VIAJANTE", C["green500"], C["black"], 78)
    txt(c, M + 91, 126, "classes C e D: acesso, confiança e pertencimento", "SourceSans", 10, C["gray"])
    pill(c, 508, 118, "ORGANIZADOR", C["black"], C["green500"], 105)
    txt(c, 626, 126, "alcance, autonomia e renda", "SourceSans", 10, C["gray"])
    footer(c)
    c.showPage()


def personality(c):
    c.setFillColor(C["black"])
    c.rect(0, 0, W, H, fill=1, stroke=0)
    header(c, 3, "Personalidade e voz", dark=True)
    heading(c, "PERSONALIDADE", "Explorar com proximidade. Criar com cuidado.",
            "Paixão pela natureza é a energia que liga a marca a quem vive e a quem faz acontecer.",
            y=418, width=730, dark=True)

    draw_icon(c, 806, 360, 90)
    rr(c, M, 102, 516, 190, Color(1, 1, 1, .06), 20, Color(1, 1, 1, .12))
    txt(c, M + 22, 262, "A VOZ LIETE É", "SourceSans", 8.5, C["green500"])
    traits = ["próxima", "acolhedora", "clara", "entusiasmada", "responsável", "brasileira"]
    x, y = M + 22, 216
    for i, label in enumerate(traits):
        tw = pdfmetrics.stringWidth(label, "Bricolage", 17) + 28
        rr(c, x, y, tw, 34, Color(1, 1, 1, .08), 17)
        txt(c, x + 14, y + 10, label, "Bricolage", 17, C["white"])
        x += tw + 10
        if i == 2:
            x, y = M + 22, 168

    # Archetype constellation
    cx, cy = 760, 205
    circle(c, cx, cy, 80, C["black"], Color(1, 1, 1, .18), 1)
    archetypes = [
        ("EXPLORADOR", cx, cy + 96, C["green500"]),
        ("CRIADOR", cx + 112, cy, C["pink500"]),
        ("CUIDADOR", cx, cy - 96, C["green300"]),
        ("CARA COMUM", cx - 112, cy, C["pink300"]),
    ]
    for label, x, y, col in archetypes:
        circle(c, x, y, 7, col)
        set_font(c, "SourceSans", 7.5, C["white"])
        c.drawCentredString(x, y - 21, label)

    txt(c, M, 68, "Mensagem principal", "SourceSans", 8.5, Color(1, 1, 1, .48))
    txt(c, M + 110, 65, "Novos caminhos para quem vive e para quem faz acontecer.", "Bricolage", 15, C["green500"])
    footer(c, dark=True)
    c.showPage()


def palette_row(c, x, y, label, items):
    txt(c, x, y + 56, label, "SourceSans", 8.5, C["gray"])
    sw = 58
    for i, (step, hex_value, color) in enumerate(items):
        sx = x + i * (sw + 7)
        rr(c, sx, y, sw, 45, color, 8, C["gray3"] if step in ("50", "100") else None)
        text_color = C["black"] if step in ("50", "100", "300", "500") else C["white"]
        txt(c, sx + 7, y + 25, step, "SourceSans", 7.5, text_color)
        txt(c, sx + 7, y + 10, hex_value, "SourceSans", 6.5, text_color)


def visual_system(c):
    c.setFillColor(C["white"])
    c.rect(0, 0, W, H, fill=1, stroke=0)
    header(c, 4, "Sistema visual")
    heading(c, "FUNDAMENTOS", "Uma cor conduz. A outra acende.",
            "O verde domina a experiência; o rosa marca encontros, foco e transformação.",
            y=418, width=760)

    greens = [("50", "#F2FFF7", C["green50"]), ("100", "#CCFFDF", C["green100"]),
              ("300", "#66FFA9", C["green300"]), ("500", "#00FF6F", C["green500"]),
              ("700", "#009943", C["green700"]), ("900", "#003316", C["green900"])]
    pinks = [("50", "#FFF2F9", C["pink50"]), ("100", "#FFD6E9", C["pink100"]),
             ("300", "#FF66B6", C["pink300"]), ("500", "#FF0090", C["pink500"]),
             ("700", "#B30065", C["pink700"]), ("900", "#66003A", C["pink900"])]
    palette_row(c, M, 257, "VERDE CAMINHO - PRINCIPAL", greens)
    palette_row(c, M, 185, "ROSA ENCONTRO - CONTRASTE", pinks)

    rr(c, 458, 179, 448, 129, C["black"], 18)
    txt(c, 478, 286, "ASSINATURA E ÍCONE", "SourceSans", 8.5, C["green500"])
    rr(c, 478, 216, 244, 60, C["green500"], 12)
    draw_wordmark(c, 492, 228, 216, 38)
    draw_icon(c, 786, 204, 78)
    txt(c, 478, 197, "Usar sobre verde, branco ou preto com contraste preservado.", "SourceSans", 8, C["white"])

    rr(c, M, 72, 852, 82, C["green50"], 16)
    txt(c, M + 20, 127, "TIPOGRAFIA", "SourceSans", 8.5, C["gray"])
    txt(c, M + 20, 91, "Bricolage Grotesque", "Bricolage", 24, C["black"])
    txt(c, M + 325, 104, "Títulos e expressão", "SourceSans", 9, C["gray"])
    txt(c, M + 475, 91, "Source Sans 3", "SourceSans", 19, C["green700"])
    txt(c, M + 642, 91, "Textos e interface", "SourceSans", 9, C["gray"])
    footer(c, left="Sistema bicromático - digital first")
    c.showPage()


def ui_text(c, x, y, value, size=7, color=None, family="SourceSans"):
    txt(c, x, y, value, family, size, color or C["black"])


def ui_button(c, x, y, w, label, fill=None, outline=False):
    fill = fill or C["green500"]
    rr(c, x, y, w, 25, C["white"] if outline else fill, 12,
       C["black"] if outline else None)
    set_font(c, "SourceSans", 7, C["black"])
    c.drawCentredString(x + w / 2, y + 8.5, label)


def landscape_thumb(c, x, y, w, h, variant=0):
    bg = [C["green100"], C["green300"], C["pink100"]][variant % 3]
    fg = [C["green700"], C["green900"], C["pink700"]][variant % 3]
    c.saveState()
    p = c.beginPath()
    p.roundRect(x, y, w, h, 8)
    c.clipPath(p, stroke=0, fill=0)
    c.setFillColor(bg)
    c.rect(x, y, w, h, fill=1, stroke=0)
    c.setFillColor(fg)
    p = c.beginPath()
    p.moveTo(x, y)
    p.lineTo(x, y + h * .25)
    p.curveTo(x + w * .24, y + h * .74, x + w * .58, y + h * .32, x + w, y + h * .63)
    p.lineTo(x + w, y)
    p.close()
    c.drawPath(p, fill=1, stroke=0)
    path_curve(c, [(x + 8, y + 4), (x + w * .35, y + h * .50), (x + w * .65, y + h * .18), (x + w - 7, y + h - 6)],
               C["pink500"] if variant != 2 else C["green500"], 2)
    c.restoreState()


def browser_shell(c, x, y, w, h):
    rr(c, x, y, w, h, C["white"], 14, C["gray3"])
    rr(c, x, y + h - 26, w, 26, C["black"], 14)
    c.setFillColor(C["black"])
    c.rect(x, y + h - 26, w, 13, fill=1, stroke=0)
    for i, col in enumerate((C["pink500"], C["green500"], C["white"])):
        circle(c, x + 14 + i * 12, y + h - 13, 3, col)


def phone_shell(c, x, y, w, h):
    rr(c, x, y, w, h, C["black"], 22)
    rr(c, x + 6, y + 6, w - 12, h - 12, C["white"], 17)
    rr(c, x + w / 2 - 19, y + h - 13, 38, 4, C["black"], 2)


def traveler_mockups(c):
    c.setFillColor(C["green50"])
    c.rect(0, 0, W, H, fill=1, stroke=0)
    header(c, 5, "Mockup - viajante")
    heading(c, "EXPERIÊNCIA", "Descobrir deve parecer simples e possível.",
            "Exemplos conceituais de busca, descoberta e decisão.", y=422, width=760)

    # Desktop discovery
    bx, by, bw, bh = 52, 66, 596, 305
    browser_shell(c, bx, by, bw, bh)
    draw_wordmark(c, bx + 18, by + bh - 54, 54, 17)
    ui_text(c, bx + 92, by + bh - 48, "Explorar", 7, C["black"])
    ui_text(c, bx + 132, by + bh - 48, "Minhas viagens", 7, C["gray"])
    ui_button(c, bx + bw - 98, by + bh - 60, 76, "Entrar", C["green500"])

    ui_text(c, bx + 20, by + bh - 91, "Qual caminho combina com você?", 15, C["black"], "Bricolage")
    rr(c, bx + 20, by + bh - 128, 360, 27, C["white"], 13, C["gray3"])
    ui_text(c, bx + 35, by + bh - 119, "Busque por destino ou experiência", 7, C["gray"])
    ui_button(c, bx + 390, by + bh - 128, 78, "Buscar", C["green500"])
    pill(c, bx + 478, by + bh - 127, "PERTO DE MIM", C["pink100"], C["black"], 90, 25, 7)

    labels = [("Serra do Mar", "a partir de R$ 189"), ("Cachoeiras", "a partir de R$ 129"), ("Trilha e céu", "a partir de R$ 159")]
    card_w = 173
    for i, (name, price) in enumerate(labels):
        cx = bx + 20 + i * (card_w + 14)
        rr(c, cx, by + 24, card_w, 126, C["white"], 12, C["gray3"])
        landscape_thumb(c, cx + 7, by + 72, card_w - 14, 70, i)
        ui_text(c, cx + 10, by + 56, name, 8, C["black"], "Bricolage")
        ui_text(c, cx + 10, by + 39, price, 6.7, C["gray"])
        circle(c, cx + card_w - 18, by + 42, 8, C["green500"])
        line(c, cx + card_w - 21, by + 42, cx + card_w - 16, by + 42, C["black"], 1.4)

    # Mobile detail
    px, py, pw, ph = 694, 54, 202, 334
    phone_shell(c, px, py, pw, ph)
    rr(c, px + 6, py + ph - 95, pw - 12, 78, C["green100"], 17)
    landscape_thumb(c, px + 12, py + ph - 90, pw - 24, 68, 0)
    draw_icon(c, px + 18, py + ph - 46, 25)
    ui_text(c, px + 18, py + 205, "Travessia da Serra", 11, C["black"], "Bricolage")
    ui_text(c, px + 18, py + 190, "1 dia  |  nível moderado", 6.5, C["gray"])
    pill(c, px + 18, py + 157, "NATUREZA DE PERTO", C["pink100"], C["black"], 102, 21, 6.5)
    ui_text(c, px + 18, py + 133, "Organizado por Marina", 7, C["black"])
    ui_text(c, px + 18, py + 114, "Transporte e ingresso inclusos", 6.5, C["gray"])
    ui_text(c, px + 18, py + 84, "R$ 189", 12, C["black"], "Bricolage")
    ui_button(c, px + 18, py + 39, pw - 36, "Quero viver essa experiência", C["green500"])
    footer(c, left="Mockups conceituais - não representam produto final")
    c.showPage()


def metric_card(c, x, y, w, label, value, trend=None, accent=None):
    rr(c, x, y, w, 62, C["white"], 10, C["gray3"])
    ui_text(c, x + 12, y + 42, label, 6.5, C["gray"])
    ui_text(c, x + 12, y + 17, value, 15, C["black"], "Bricolage")
    if trend:
        pill(c, x + w - 60, y + 18, trend, accent or C["green100"], C["black"], 48, 20, 6)


def organizer_mockups(c):
    c.setFillColor(C["black"])
    c.rect(0, 0, W, H, fill=1, stroke=0)
    header(c, 6, "Mockup - organizador", dark=True)
    heading(c, "FERRAMENTAS", "Fazer acontecer. Ganhar alcance. Crescer.",
            "Exemplos conceituais de gestão, desempenho e criação de experiências.",
            y=422, width=770, dark=True)

    bx, by, bw, bh = 52, 59, 856, 307
    rr(c, bx, by, bw, bh, C["white"], 16)
    # Sidebar
    rr(c, bx, by, 146, bh, C["green500"], 16)
    c.setFillColor(C["green500"])
    c.rect(bx + 130, by, 16, bh, fill=1, stroke=0)
    draw_wordmark(c, bx + 20, by + bh - 54, 90, 28)
    items = ["Visão geral", "Experiências", "Reservas", "Público", "Financeiro"]
    for i, item in enumerate(items):
        iy = by + bh - 102 - i * 38
        if i == 0:
            rr(c, bx + 12, iy - 9, 120, 28, C["black"], 14)
            ui_text(c, bx + 27, iy, item, 7, C["green500"])
        else:
            ui_text(c, bx + 27, iy, item, 7, C["black"])
    draw_icon(c, bx + 18, by + 17, 34)
    ui_text(c, bx + 60, by + 29, "Perfil", 7, C["black"])

    mx = bx + 168
    ui_text(c, mx, by + bh - 43, "Bom dia, Marina.", 16, C["black"], "Bricolage")
    ui_text(c, mx, by + bh - 61, "Seu negócio está abrindo novos caminhos.", 7, C["gray"])
    ui_button(c, bx + bw - 154, by + bh - 62, 126, "+ Criar experiência", C["green500"])

    metric_card(c, mx, by + 155, 146, "RECEITA DO MÊS", "R$ 8.420", "+18%", C["green100"])
    metric_card(c, mx + 158, by + 155, 146, "NOVAS RESERVAS", "46", "+12", C["pink100"])
    metric_card(c, mx + 316, by + 155, 146, "ALCANCE", "12,8 mil", "+31%", C["green100"])

    rr(c, mx, by + 24, 462, 112, C["green50"], 12)
    ui_text(c, mx + 14, by + 116, "PRÓXIMAS EXPERIÊNCIAS", 6.5, C["gray"])
    rows = [("Travessia da Serra", "22 pessoas", "Sáb, 26 jul"),
            ("Cachoeiras do Vale", "17 pessoas", "Dom, 03 ago"),
            ("Céu e montanha", "9 pessoas", "Sáb, 16 ago")]
    for i, (name, people, date) in enumerate(rows):
        ry = by + 89 - i * 29
        circle(c, mx + 16, ry + 2, 5, C["pink500"] if i == 1 else C["green500"])
        ui_text(c, mx + 29, ry, name, 7, C["black"])
        ui_text(c, mx + 212, ry, people, 6.5, C["gray"])
        ui_text(c, mx + 330, ry, date, 6.5, C["gray"])
        if i < 2:
            line(c, mx + 14, ry - 10, mx + 446, ry - 10, C["gray3"], .7)

    # Compact creation stepper
    fx = bx + bw - 199
    rr(c, fx, by + 24, 171, 112, C["black"], 12)
    ui_text(c, fx + 14, by + 116, "PUBLICAR EXPERIÊNCIA", 6.5, C["green500"])
    steps = [("1", "Informações", True), ("2", "Roteiro", True), ("3", "Preço", False)]
    for i, (num, label, done) in enumerate(steps):
        sy = by + 88 - i * 27
        circle(c, fx + 18, sy + 2, 7, C["green500"] if done else C["pink500"])
        set_font(c, "SourceSans", 6, C["black"])
        c.drawCentredString(fx + 18, sy, num)
        ui_text(c, fx + 32, sy, label, 7, C["white"])
    footer(c, dark=True, left="Mockups conceituais - fluxos a validar com produto")
    c.showPage()


def build():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    register_fonts()
    c = canvas.Canvas(str(OUT), pagesize=(W, H), pageCompression=1)
    c.setTitle("Liete - Guia Essencial de Marca v1.0")
    c.setAuthor("Liete")
    c.setSubject("Estratégia, identidade e aplicações conceituais")
    cover(c)
    strategy(c)
    personality(c)
    visual_system(c)
    traveler_mockups(c)
    organizer_mockups(c)
    c.save()
    print(OUT)


if __name__ == "__main__":
    build()
