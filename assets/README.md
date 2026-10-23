# Assets folder

Apni photos yahan add karein. File names `js/config.js` mein diye gaye names se match hone chahiye.

## Photo slider
`assets/images/slider/` mein apni 3 ya zyada photos rakhein:
- `solar-home-1.jpg`
- `solar-rooftop-2.jpg`
- `solar-panels-3.jpg`

Agar aapke photo ke naam alag hain, `js/config.js` ke `sliderImages` array mein path update kar dein. Slider automatically 5 seconds mein photo change karega. Previous/next arrows aur dots bhi hain. Speed ke liye `sliderIntervalMs` change karein.

## Solutions cards
`assets/images/solutions/` mein:
- `residential.jpg`
- `commercial.jpg`
- `maintenance.jpg`

## Notes
- JPG, PNG, or WebP images use kar sakte hain; config mein correct extension/path likhein.
- Hero slider photos wide landscape (around 1600 × 900 px) hon to best result milega.
- Photos ko compress karke use karein, taaki website fast load ho.
- Abhi images placeholder names ke saath configured hain. Apni photos add karne par woh display hongi.
