/** @type {import('tailwindcss').Config} */
function generateSize(cssNames, sizeList) {
  let obj = {}
  cssNames.forEach(cssName => {
    obj[cssName] = {}
    sizeList.forEach(size => {
      obj[cssName][size] = `${size}px`
    })
  })
  return obj
}

export default {
  darkMode: ['class'],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue}"],
  theme: {
    extend: {
      ...generateSize([
        'padding',
        'margin',
        'fontSize',
      ],
        (new Array(60).fill('')).map((value, idx) => idx + 5)
      ),
      ...generateSize([
        'fontSize',
      ],
        (new Array(35).fill('')).map((value, idx) => idx + 12)
      ),
      ...generateSize([
        'maxWidth',
        'minWidth',
        'flexBasis',
        'width',
        'maxHeight',
        'minHeight',
        'height'
      ], [
        ...(new Array(500).fill('')).map((value, idx) => idx + 10),
        1200,
        1080,
        1300,
      ]
      ),
      fontFamily:{
        'mst': 'Montserrat-Regular',
        'mst-m': 'Montserrat-Medium',
        'mst-b': 'Montserrat-SemiBold'
      },
      colors: {
        active: "#93C528",
        'dark-text-color':'#9598AE',
        'dark-title-color': '#ffffff',
        'dark-component-bg': '#1E1F25',
      },
      borderRadius:{
        'component':'10px',
      },
      opcity: {
        'component': 0.6
      },
      zIndex: {
        '5': 5
      }
    }
  },
  plugins: []
}
