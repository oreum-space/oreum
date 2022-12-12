import UiInputColorRgbModel from './UiInputColorRgbModel.vue'
import UiInputColorHslModel from './UiInputColorHslModel.vue'
import UiInputColorHsvModel from './UiInputColorHsvModel.vue'
import UiInputColorCmyModel from './UiInputColorCmyModel.vue'

export const COLOR_MODELS = ['HEX', 'RGB', 'CMY', 'HSL', 'HSV'] as const
export type ColorModel = typeof COLOR_MODELS[number]

export type ValueOnly<T> = Omit<T, 'model' | 'value'>

type ColorValueHEXRaw = {
  model: 'HEX',
  r: number, // 0 - 255
  g: number, // 0 - 255
  b: number, // 0 - 255
}

export type ColorValueHEX = {
  value: `#${string}`
} & ColorValueHEXRaw

type ColorValueRGBRaw = {
  model: 'RGB',
  r: number, // 0 - 255
  g: number, // 0 - 255
  b: number, // 0 - 255
}

export type ColorValueRGB = {
  value: `rgb(${number}, ${number}, ${number})` | `rgba(${number}, ${number}, ${number}, ${string})`
} & ColorValueRGBRaw

type ColorValueCMYRaw = {
  model: 'CMY',
  c: number, // 0 - 1
  m: number, // 0 - 1
  y: number, // 0 - 1
}

export type ColorValueCMY = {
  value: `cmy(${string}, ${string}, ${string})` | `cmya(${string}, ${string}, ${string}, ${string})`
} & ColorValueCMYRaw

type ColorValueHSLRaw = {
  model: 'HSL',
  h: number, // 0 - 359.(9)
  s: number, // 0 - 100
  l: number, // 0 - 100
}

export type ColorValueHSL = {
  value: `hsl(${number}deg ${number}% ${number}%)` | `hsl(${number}deg ${number}% ${number}%${string})`
} & ColorValueHSLRaw

type ColorValueHSVRaw = {
  model: 'HSV',
  h: number, // 0 - 359.(9)
  s: number, // 0 - 100
  v: number, // 0 - 100
}

export type ColorValueHSV = {
  value: `hsv(${number}deg ${number}% ${number}%)` | `hsv(${number}deg ${number}% ${number}%${string})`
} & ColorValueHSVRaw

export type ColorValue = ColorValueHEX | ColorValueRGB | ColorValueCMY | ColorValueHSL | ColorValueHSV

export type ColorValueRaw = ColorValueHEXRaw | ColorValueRGBRaw | ColorValueCMYRaw | ColorValueHSLRaw | ColorValueHSVRaw

export type ColorValueRGBLike = Omit<ColorValueHEX | ColorValueRGB, 'value' | 'model'>

type ColorModelComponent = typeof UiInputColorRgbModel
  | typeof UiInputColorHslModel
  | typeof UiInputColorHsvModel
  | typeof UiInputColorCmyModel

export function getColorModelComponent (colorModel: ColorModel): ColorModelComponent {
  if (colorModel === 'HSL') {
    return UiInputColorHslModel
  }
  if (colorModel === 'HSV') {
    return UiInputColorHsvModel
  }
  if (colorModel === 'CMY') {
    return UiInputColorCmyModel
  }
  return UiInputColorRgbModel
}

function _toHEX (v: number): string {
  return v.toString(16).padStart(2, '0')
}

export function valueHEXValue ({ r, g, b }: ValueOnly<ColorValueHEX>, alpha?: number): ColorValueHEX['value'] {
  return `#${ (_toHEX(r) + _toHEX(g) + _toHEX(b) + (alpha === undefined ? '' : _toHEX(alpha))).toUpperCase() }`
}

export function valueRGBValue ({ r, g, b }: ValueOnly<ColorValueRGB>, alpha?: number): ColorValueRGB['value'] {
  return alpha === undefined
    ? `rgb(${ r }, ${ g }, ${ b })`
    : `rgba(${ r }, ${ g }, ${ b }, ${ alpha.toFixed(3) })`
}

export function valueCMYValue ({ c, m, y }: ValueOnly<ColorValueCMY>, alpha?: number): ColorValueCMY['value'] {
  return alpha === undefined
    ? `cmy(${ c.toFixed(3) }, ${ m.toFixed(3) }, ${ y.toFixed(3) })`
    : `cmy(${ c.toFixed(3) }, ${ m.toFixed(3) }, ${ y.toFixed(3) }, ${ alpha.toFixed(3) })`
}

export function valueHSLValue ({ h, s, l }: ValueOnly<ColorValueHSL>, alpha?: number): ColorValueHSL['value'] {
  return alpha === undefined
    ? `hsl(${h}deg ${s}% ${l}%)`
    : `hsl(${h}deg ${s}% ${l}% / ${alpha.toFixed(3)}%)`
}

export function valueHSVValue ({ h, s, v }: ValueOnly<ColorValueHSV>, alpha?: number): ColorValueHSV['value'] {
  return alpha === undefined
    ? `hsv(${h}deg ${s}% ${v}%)`
    : `hsv(${h}deg ${s}% ${v}% / ${alpha.toFixed(3)}%)`
}

export function rgbToHsl ({ r, g, b }: ColorValueRGBLike, alpha?: number, _h?: number): ColorValueHSL {
  const
    rAbs = r / 255,
    gAbs = g / 255,
    bAbs = b / 255,
    l = Math.max(rAbs, gAbs, bAbs),
    s = l - Math.min(rAbs, gAbs, bAbs),
    h = s
      ? l === rAbs
        ? (gAbs - bAbs) / s
        : l === gAbs
          ? 2 + (bAbs - rAbs) / s
          : 4 + (rAbs - gAbs) / s
        : (_h ? _h / 60 : 0)

  const hsl: ColorValueHSL = {
    model: COLOR_MODELS[3],
    h: 60 * h < 0 ? 60 * h + 360 : 60 * h,
    s: _rgbToHsvP(100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0)),
    l: _rgbToHsvP(100 * ((2 * l - s)) / 2),
    value: 'hsl(0deg 0% 0%)'
  }

  hsl.h = Math.round(hsl.h)
  hsl.value = valueHSLValue(hsl)

  return hsl
}

function _hslToRgbK (n: number, h: number): number {
  return (n + h / 30) % 12
}

function _hslToRgbF (n: number, h: number, l: number, a: number): number {
  return l - a * Math.max(-1, Math.min(_hslToRgbK(n, h) - 3, Math.min(9 - _hslToRgbK(n, h), 1)))
}

export function hslToRgb ({ h, s, l }: ColorValueHSL): ColorValueRGBLike {
  const
    sAbs = s / 100,
    lAbs = l / 100,
    a = sAbs * Math.min(lAbs, 1 - lAbs)

  return {
    r: Math.round(255 * _hslToRgbF(0, h, lAbs, a)),
    g: Math.round(255 * _hslToRgbF(8, h, lAbs, a)),
    b: Math.round(255 * _hslToRgbF(4, h, lAbs, a))
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.hslToRgb = hslToRgb

function _rgbToHsvC (hsv: ColorValueHSV, c: number, d: number): number {
  return (hsv.v - c) / 6 / d + 1 / 2
}

function _rgbToHsvP (n: number): number {
  return Math.round(n * 100) / 100
}

export function rgbToHsv ({ r, g, b }: ColorValueRGBLike, alpha?: number, _h?: number): ColorValueHSV {
  const
    rAbs = r / 255,
    gAbs = g / 255,
    bAbs = b / 255,
    hsv: ColorValueHSV = {
      model: COLOR_MODELS[4],
      h: 0,
      s: 0,
      v: Math.max(rAbs, gAbs, bAbs),
      value: 'hsv(0deg 0% 0%)'
    },
    d = hsv.v - Math.min(rAbs, gAbs, bAbs)

  if (d === 0) {
    hsv.s = 0
    hsv.h = _h ? _h / 360 : 0
  } else {
    hsv.s = d / hsv.v

    const
      _r = _rgbToHsvC(hsv, rAbs, d),
      _g = _rgbToHsvC(hsv, gAbs, d),
      _b = _rgbToHsvC(hsv, bAbs, d)

    if (rAbs === hsv.v) {
      hsv.h = _b - _g
    } else if (gAbs === hsv.v) {
      hsv.h = (1 / 3) + _r - _b
    } else if (bAbs === hsv.v) {
      hsv.h = (2 / 3) + _g - _r
    }

    if (hsv.h < 0) {
      hsv.h += 1
    } else if (hsv.h >= 1) {
      hsv.h -= 1
    }
  }

  hsv.h = Math.round(hsv.h * 360)
  hsv.s = _rgbToHsvP(hsv.s * 100)
  hsv.v = _rgbToHsvP(hsv.v * 100)
  hsv.value = valueHSVValue(hsv, alpha)

  return hsv
}

export function hsvToRgb (hsv: ColorValueHSV): ColorValueRGBLike {
  const
    h = hsv.h / 360,
    s = hsv.s / 100,
    v = hsv.v / 100

  const
    i = Math.floor(h * 6),
    f = h * 6 - i,
    p = v * (1 - s),
    q = v * (1 - f * s),
    t = v * (1 - (1 - f) * s)

  let r, g, b

  switch (i % 6) {
    case 0: r = v; g = t; b = p; break
    case 1: r = q; g = v; b = p; break
    case 2: r = p; g = v; b = t; break
    case 3: r = p; g = q; b = v; break
    case 4: r = t; g = p; b = v; break
    case 5: r = v; g = p; b = q; break
    default: r = 0; g = 0; b = 0; break
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}