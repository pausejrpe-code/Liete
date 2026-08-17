from pathlib import Path
import math

from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, Color
from reportlab.lib.utils import ImageReader


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "Liete_Guia_Essencial_de_Marca_v0.9.pdf"
FONT_DIR = ROOT / "assets" / "fonts"

W, H = 960, 540
M = 54

COLORS = {
    "travessia": HexColor("#005F73"),
    "noite": HexColor("#12333D"),
    "broto": HexColor("#2FA36B"),
    "sol": HexColor("#F4C95D"),
    "coral": HexColor("#E76F51"),
    "areia": HexColor("#F7F2E7"),
    "bruma": HexColor("#DCEFF2"),
    "grafite": HexColor("#202A2E"),
    "pedra": HexColor("#4B5A5F"),
    "nuvem": HexColor("#FFFFFF"),
}


def register_fonts():
    pdfmetrics.registerFont(TTFont("Bricolage", str(FONT_DIR / "BricolageGrotesque.ttf")))
    pdfmetrics.registerFont(TTFont("SourceSans", str(FONT_DIR / "SourceSans3.ttf")))


def font(c, name, size, color=None):
    c.setFont(name, size)
    if color is not None:
        c.setFillColor(color)


def text(c, x, y, value, name="SourceSans", size=12, color=None):
    font(c, name, size, color or COLORS["grafite"])
    c.drawString(x, y, value)


def right_text(c, x, y, value, name="SourceSans", size=10, color=None):
    font(c, name, size, color or COLORS["grafite"])
    c.drawRightString(x, y, value)


def wrap_text(value, max_width, name, size):
    words = value.split()
    lines, current = [], ""
    for word in words:
        candidate = word if not current else current + " " + word
        if pdfmetrics.stringWidth(candidate, name, size) <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def paragraph(c, x, y, value, width, name="SourceSans", size=12, leading=None,
              color=None, max_lines=None):
    leading = leading or size * 1.25
    lines = wrap_text(value, width, name, size)
    if max_lines:
        lines = lines[:max_lines]
    font(c, name, size, color or COLORS["grafite"])
    for i, line in enumerate(lines):
        c.drawString(x, y - i * leading, line)
    return y - len(lines) * leading


def round_rect(c, x, y, w, h, fill, radius=14, stroke=None, width=1):
    c.saveState()
    c.setFillColor(fill)
    if stroke:
        c.setStrokeColor(stroke)
        c.setLineWidth(width)
    else:
        c.setStrokeColor(fill)
    c.roundRect(x, y, w, h, radius, fill=1, stroke=1 if stroke else 0)
    c.restoreState()


def pill(c, x, y, label, fill, text_color, width=None):
    size = 9
    width = width or pdfmetrics.stringWidth(label, "SourceSans", size) + 24
    round_rect(c, x, y, width, 24, fill, 12)
    font(c, "SourceSans", size, text_color)
    c.drawCentredString(x + width / 2, y + 7.4, label.upper())
    return width


def path_line(c, points, color, width=3, dotted=False):
    c.saveState()
    c.setStrokeColor(color)
    c.setLineWidth(width)
    c.setLineCap(1)
    c.setLineJoin(1)
    if dotted:
        c.setDash(2, 7)
    p = c.beginPath()
    p.moveTo(*points[0])
    if len(points) == 4:
        p.curveTo(*points[1], *points[2], *points[3])
    else:
        for pt in points[1:]:
            p.lineTo(*pt)
    c.drawPath(p, stroke=1, fill=0)
    c.restoreState()


def dot(c, x, y, r, fill, ring=None):
    c.saveState()
    c.setFillColor(fill)
    c.circle(x, y, r, fill=1, stroke=0)
    if ring:
        c.setStrokeColor(ring)
        c.setLineWidth(2)
        c.circle(x, y, r + 5, fill=0, stroke=1)
    c.restoreState()


def page_header(c, index, section, dark=False):
    primary = COLORS["nuvem"] if dark else COLORS["travessia"]
    secondary = Color(1, 1, 1, 0.65) if dark else COLORS["pedra"]
    text(c, M, H - 34, "LIETE", "Bricolage", 10, primary)
    text(c, M + 54, H - 34, section.upper(), "SourceSans", 8.5, secondary)
    right_text(c, W - M, H - 34, f"0{index} / 06", "SourceSans", 8.5, secondary)


def page_footer(c, dark=False, note="Guia essencial de marca - versão 0.9"):
    color = Color(1, 1, 1, 0.55) if dark else COLORS["pedra"]
    text(c, M, 25, note, "SourceSans", 7.5, color)
    right_text(c, W - M, 25, "Marca gráfica em desenvolvimento", "SourceSans", 7.5, color)


def title(c, kicker, headline, sub=None, dark=False, x=M, y=450, width=760):
    kicker_color = COLORS["sol"] if dark else COLORS["coral"]
    body_color = COLORS["nuvem"] if dark else COLORS["grafite"]
    pill(c, x, y + 24, kicker, kicker_color, COLORS["grafite"])
    lines = wrap_text(headline, width, "Bricolage", 38)
    font(c, "Bricolage", 38, body_color)
    for i, line in enumerate(lines):
        c.drawString(x, y - i * 42, line)
    bottom = y - len(lines) * 42
    if sub:
        paragraph(c, x, bottom - 5, sub, width, "SourceSans", 12.5, 17,
                  Color(1, 1, 1, 0.72) if dark else COLORS["pedra"])
    return bottom


def draw_compass(c, cx, cy, r):
    c.saveState()
    c.setStrokeColor(Color(1, 1, 1, 0.18))
    c.setLineWidth(1)
    c.circle(cx, cy, r, fill=0, stroke=1)
    c.circle(cx, cy, r * .55, fill=0, stroke=1)
    for a in (0, 90, 180, 270):
        rad = math.radians(a)
        c.line(cx + math.cos(rad) * r * .55, cy + math.sin(rad) * r * .55,
               cx + math.cos(rad) * r, cy + math.sin(rad) * r)
    c.restoreState()


def cover(c):
    c.setFillColor(COLORS["areia"])
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # Editorial left field
    text(c, M, H - 54, "GUIA ESSENCIAL DE MARCA", "SourceSans", 9, COLORS["travessia"])
    text(c, M, 359, "Liete", "Bricolage", 72, COLORS["noite"])
    text(c, M, 317, "Natureza ao seu alcance.", "Bricolage", 25, COLORS["travessia"])
    paragraph(c, M, 270,
              "Uma marca que abre caminhos para viver a natureza e transforma iniciativa em possibilidade de renda.",
              390, "SourceSans", 14, 19, COLORS["pedra"])
    pill(c, M, 152, "ESTRATÉGIA + EXPRESSÃO", COLORS["bruma"], COLORS["travessia"], 166)
    text(c, M, 116, "Versão 0.9  |  Julho de 2026", "SourceSans", 9, COLORS["pedra"])

    # Open path landscape
    c.setFillColor(COLORS["travessia"])
    c.roundRect(540, 44, 366, 452, 24, fill=1, stroke=0)
    c.setFillColor(COLORS["bruma"])
    p = c.beginPath()
    p.moveTo(540, 190)
    p.curveTo(620, 260, 680, 233, 744, 310)
    p.curveTo(805, 384, 855, 341, 906, 396)
    p.lineTo(906, 44)
    p.lineTo(540, 44)
    p.close()
    c.drawPath(p, fill=1, stroke=0)
    c.setFillColor(COLORS["broto"])
    p = c.beginPath()
    p.moveTo(540, 114)
    p.curveTo(632, 191, 699, 151, 771, 224)
    p.curveTo(823, 277, 866, 246, 906, 275)
    p.lineTo(906, 44)
    p.lineTo(540, 44)
    p.close()
    c.drawPath(p, fill=1, stroke=0)
    path_line(c, [(575, 84), (638, 207), (734, 133), (868, 438)], COLORS["sol"], 5)
    dot(c, 575, 84, 7, COLORS["coral"], COLORS["nuvem"])
    dot(c, 868, 438, 7, COLORS["sol"], COLORS["nuvem"])
    text(c, 570, 465, "CAMINHOS ABERTOS", "SourceSans", 9, COLORS["nuvem"])
    page_footer(c, note="Documento de direção - não substitui o desenvolvimento do logotipo")
    c.showPage()


def strategy(c):
    c.setFillColor(COLORS["nuvem"])
    c.rect(0, 0, W, H, fill=1, stroke=0)
    page_header(c, 2, "Estratégia")
    title(c, "ESSÊNCIA", "Abrir caminhos para viver e fazer acontecer.",
          "A Liete aproxima desejo de natureza, capacidade de organização e oportunidade de crescimento.",
          y=422, width=790)

    card_y, card_h, gap = 180, 136, 14
    card_w = (W - 2 * M - 2 * gap) / 3
    cards = [
        ("01", "PROPÓSITO", "Mais pessoas vivendo a natureza. Mais organizadores transformando iniciativa em renda.", COLORS["bruma"]),
        ("02", "POSICIONAMENTO", "A plataforma que conecta viajantes a experiências criadas por organizadores independentes.", COLORS["areia"]),
        ("03", "PROMESSA", "Natureza acessível para quem quer viver. Alcance e autonomia para quem faz acontecer.", HexColor("#E7F4ED")),
    ]
    for i, (num, label, body, fill_color) in enumerate(cards):
        x = M + i * (card_w + gap)
        round_rect(c, x, card_y, card_w, card_h, fill_color, 16)
        text(c, x + 18, card_y + 104, num, "Bricolage", 20, COLORS["travessia"])
        text(c, x + 18, card_y + 81, label, "SourceSans", 8.5, COLORS["pedra"])
        paragraph(c, x + 18, card_y + 55, body, card_w - 36, "SourceSans", 11.5, 14, COLORS["grafite"])

    pill(c, M, 122, "VIAJANTE", COLORS["travessia"], COLORS["nuvem"], 76)
    text(c, M + 88, 130, "classes C e D: acesso, confiança e pertencimento", "SourceSans", 10.5, COLORS["pedra"])
    pill(c, 492, 122, "ORGANIZADOR", COLORS["coral"], COLORS["nuvem"], 104)
    text(c, 608, 130, "alcance, autonomia, profissionalização e renda", "SourceSans", 10.5, COLORS["pedra"])
    page_footer(c)
    c.showPage()


def personality(c):
    c.setFillColor(COLORS["noite"])
    c.rect(0, 0, W, H, fill=1, stroke=0)
    page_header(c, 3, "Personalidade e voz", dark=True)
    title(c, "PERSONALIDADE", "Explorar com proximidade. Criar com cuidado.",
          "A paixão pela natureza é a energia que une os quatro arquétipos da marca.",
          dark=True, y=423, width=720)

    draw_compass(c, 770, 230, 156)
    archetypes = [
        ("EXPLORADOR", "abre novos caminhos", 770, 367, COLORS["sol"]),
        ("CRIADOR", "transforma iniciativa", 892, 230, COLORS["coral"]),
        ("CUIDADOR", "protege a experiência", 770, 94, COLORS["broto"]),
        ("CARA COMUM", "fala de igual para igual", 648, 230, COLORS["bruma"]),
    ]
    for label, body, x, y, col in archetypes:
        dot(c, x, y, 8, col)
        font(c, "SourceSans", 8.5, COLORS["nuvem"])
        c.drawCentredString(x, y - 24, label)
        font(c, "SourceSans", 7.5, Color(1, 1, 1, .62))
        c.drawCentredString(x, y - 37, body)

    round_rect(c, M, 94, 485, 180, Color(1, 1, 1, .07), 18, Color(1, 1, 1, .12))
    text(c, M + 22, 244, "A VOZ LIETE É", "SourceSans", 8.5, COLORS["sol"])
    traits = ["próxima", "acolhedora", "clara", "entusiasmada", "responsável", "brasileira"]
    x, y = M + 22, 204
    for i, t in enumerate(traits):
        w = pdfmetrics.stringWidth(t, "Bricolage", 18) + 28
        round_rect(c, x, y, w, 34, Color(1, 1, 1, .08), 17)
        text(c, x + 14, y + 10, t, "Bricolage", 18, COLORS["nuvem"])
        x += w + 9
        if i == 2:
            x, y = M + 22, 156

    text(c, M, 68, "Mensagem principal", "SourceSans", 8.5, Color(1, 1, 1, .55))
    text(c, M + 106, 65, "Novos caminhos para quem vive e para quem faz acontecer.",
         "Bricolage", 16, COLORS["nuvem"])
    page_footer(c, dark=True)
    c.showPage()


def creative_direction(c):
    c.setFillColor(COLORS["areia"])
    c.rect(0, 0, W, H, fill=1, stroke=0)
    page_header(c, 4, "Direção criativa")
    title(c, "CAMINHOS ABERTOS", "Metamorfose. Movimento. Avanço.",
          "O sistema visual nasce de trajetos que começam pequenos, encontram pessoas e ganham novos destinos.",
          y=420, width=720)

    # Continuous route as the visual spine
    path_line(c, [(70, 239), (258, 332), (510, 120), (886, 281)], COLORS["travessia"], 5)
    path_line(c, [(886, 281), (902, 301), (910, 325), (915, 351)], COLORS["coral"], 5, dotted=True)
    for x, y, col in [(112, 261, COLORS["broto"]), (420, 209, COLORS["sol"]), (694, 191, COLORS["coral"]), (886, 281, COLORS["travessia"])]:
        dot(c, x, y, 7, col, COLORS["nuvem"])

    round_rect(c, M, 72, 410, 118, COLORS["nuvem"], 16)
    text(c, M + 20, 160, "DIREÇÃO DO “E-GIRINO”", "SourceSans", 9, COLORS["travessia"])
    paragraph(c, M + 20, 135,
              "O “e” final deve ser lido primeiro como letra e, só depois, revelar a metáfora do girino. A cauda pode ecoar o Caminho Liete e sugerir progressão da esquerda para a direita.",
              370, "SourceSans", 11, 14, COLORS["grafite"])

    round_rect(c, 486, 72, 420, 118, COLORS["noite"], 16)
    text(c, 506, 160, "CRITÉRIOS ESSENCIAIS", "SourceSans", 9, COLORS["sol"])
    paragraph(c, 506, 135,
              "Abstrato, adulto, simples e legível. Sem olhos ou rosto. Evitar aparência de espermatozoide, peixe, gota, vírgula, embrião ou mascote infantil.",
              380, "SourceSans", 11, 14, COLORS["nuvem"])
    page_footer(c, note="Direção estratégica - não representa o desenho final do logotipo")
    c.showPage()


def visual_system(c):
    c.setFillColor(COLORS["nuvem"])
    c.rect(0, 0, W, H, fill=1, stroke=0)
    page_header(c, 5, "Sistema visual")
    title(c, "FUNDAMENTOS", "Personalidade para inspirar. Clareza para funcionar.", y=423, width=780)

    # Palette block
    text(c, M, 316, "PALETA", "SourceSans", 9, COLORS["pedra"])
    swatches = [
        ("Travessia", "#005F73", COLORS["travessia"], 118),
        ("Noite", "#12333D", COLORS["noite"], 88),
        ("Broto", "#2FA36B", COLORS["broto"], 88),
        ("Sol", "#F4C95D", COLORS["sol"], 76),
        ("Encontro", "#E76F51", COLORS["coral"], 92),
        ("Areia", "#F7F2E7", COLORS["areia"], 90),
        ("Bruma", "#DCEFF2", COLORS["bruma"], 90),
    ]
    x = M
    for label, code, col, sw in swatches:
        c.setFillColor(col)
        c.roundRect(x, 244, sw, 52, 8, fill=1, stroke=0)
        name_color = COLORS["nuvem"] if label in ("Travessia", "Noite", "Broto", "Encontro") else COLORS["grafite"]
        text(c, x + 8, 271, label, "SourceSans", 8.5, name_color)
        text(c, x + 8, 255, code, "SourceSans", 7.5, name_color)
        x += sw + 8

    # Usage ratio bar
    text(c, M, 218, "USO RECOMENDADO", "SourceSans", 7.5, COLORS["pedra"])
    ratios = [(60, COLORS["areia"]), (20, COLORS["travessia"]), (10, COLORS["noite"]),
              (5, COLORS["broto"]), (3, COLORS["sol"]), (2, COLORS["coral"])]
    x, bar_w = M, 430
    for pct, col in ratios:
        w = bar_w * pct / 100
        c.setFillColor(col)
        c.rect(x, 198, w, 10, fill=1, stroke=0)
        x += w
    text(c, M + 443, 197, "60% respiro  |  20% azul  |  20% acentos", "SourceSans", 8, COLORS["pedra"])

    # Typography area
    round_rect(c, M, 62, 852, 112, COLORS["areia"], 16)
    text(c, M + 20, 145, "TIPOGRAFIA", "SourceSans", 9, COLORS["pedra"])
    text(c, M + 20, 96, "Bricolage Grotesque", "Bricolage", 29, COLORS["noite"])
    text(c, M + 350, 121, "Títulos, campanhas e expressão de marca", "SourceSans", 9.5, COLORS["pedra"])
    text(c, M + 350, 88, "Source Sans 3", "SourceSans", 21, COLORS["travessia"])
    text(c, M + 525, 88, "Textos, interfaces e informação", "SourceSans", 9.5, COLORS["pedra"])
    page_footer(c, note="Fontes sob SIL Open Font License 1.1")
    c.showPage()


def scene_card(c, x, y, w, h, sky, land, accent, label):
    c.saveState()
    p = c.beginPath()
    p.roundRect(x, y, w, h, 14)
    c.clipPath(p, stroke=0, fill=0)
    c.setFillColor(sky)
    c.rect(x, y, w, h, fill=1, stroke=0)
    c.setFillColor(land)
    m = c.beginPath()
    m.moveTo(x, y)
    m.lineTo(x, y + h * .36)
    m.curveTo(x + w * .25, y + h * .72, x + w * .54, y + h * .30, x + w, y + h * .57)
    m.lineTo(x + w, y)
    m.close()
    c.drawPath(m, fill=1, stroke=0)
    path_line(c, [(x + 18, y + 8), (x + w * .38, y + h * .54), (x + w * .68, y + h * .30), (x + w - 15, y + h - 15)], accent, 3)
    # Human presence as abstract, non-logo silhouettes
    dot(c, x + w * .35, y + h * .42, 4, COLORS["grafite"])
    dot(c, x + w * .43, y + h * .39, 4, COLORS["grafite"])
    c.restoreState()
    text(c, x + 12, y + 12, label, "SourceSans", 8, COLORS["nuvem"])


def expression(c):
    c.setFillColor(COLORS["areia"])
    c.rect(0, 0, W, H, fill=1, stroke=0)
    page_header(c, 6, "Expressão da marca")
    title(c, "SISTEMA EM AÇÃO", "Gente real. Natureza viva. Caminhos possíveis.", y=423, width=790)

    # Visual direction cards
    scene_card(c, M, 222, 228, 126, COLORS["travessia"], COLORS["broto"], COLORS["sol"], "40% EXPERIÊNCIA")
    scene_card(c, M + 242, 222, 228, 126, COLORS["bruma"], COLORS["travessia"], COLORS["coral"], "25% QUEM FAZ ACONTECER")
    scene_card(c, M + 484, 222, 228, 126, COLORS["sol"], COLORS["coral"], COLORS["travessia"], "20% JORNADA E PREPARO")
    round_rect(c, M + 726, 222, 180, 126, COLORS["noite"], 14)
    text(c, M + 744, 317, "15% NATUREZA", "SourceSans", 8, COLORS["sol"])
    paragraph(c, M + 744, 290,
              "Luz natural, olhar próximo e diversidade real. Evitar luxo, radicalização e paisagens vazias.",
              144, "SourceSans", 10, 13, COLORS["nuvem"])

    # Three system rules
    rules = [
        ("GRAFISMOS", "Linhas contínuas, pontos de encontro e portais abertos. Traço pontilhado indica futuro ou planejamento.", COLORS["travessia"]),
        ("ÍCONES", "Phosphor Icons, grade 24 x 24. Regular por padrão; Bold para seleção; Duotone apenas em onboarding.", COLORS["broto"]),
        ("COMPOSIÇÃO", "Grid de 12 colunas no desktop e 4 no mobile. Espaçamento em múltiplos de 8 e alinhamento à esquerda.", COLORS["coral"]),
    ]
    gap = 14
    cw = (W - 2 * M - 2 * gap) / 3
    for i, (label, body, col) in enumerate(rules):
        x = M + i * (cw + gap)
        round_rect(c, x, 74, cw, 124, COLORS["nuvem"], 14)
        dot(c, x + 19, 172, 5, col)
        text(c, x + 34, 168, label, "SourceSans", 9, COLORS["grafite"])
        paragraph(c, x + 18, 140, body, cw - 36, "SourceSans", 10.5, 13.5, COLORS["pedra"])

    page_footer(c, note="Síntese: inspirar descoberta, facilitar acesso e ampliar possibilidades")
    c.showPage()


def build():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    register_fonts()
    c = canvas.Canvas(str(OUT), pagesize=(W, H), pageCompression=1)
    c.setTitle("Liete - Guia Essencial de Marca v0.9")
    c.setAuthor("Liete")
    c.setSubject("Estratégia e direção de marca")
    cover(c)
    strategy(c)
    personality(c)
    creative_direction(c)
    visual_system(c)
    expression(c)
    c.save()
    print(OUT)


if __name__ == "__main__":
    build()
