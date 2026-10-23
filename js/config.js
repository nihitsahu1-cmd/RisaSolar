/*
  RISA ENERGY SITE CONFIG
  Update business details and image paths here. Keep this file separate from HTML/CSS.
  Replace the sample image paths with your own photos inside assets/images/.
*/
window.SOLAR_DATA = {
  brand: "Risa Energy Pvt. Ltd.",
  tagline: "Powering a brighter tomorrow",
  phoneDisplay: "+91 94505 09659",
  phoneLink: "+919450509659",
  whatsappNumber: "919450509659",
  email: "hello@risaenergy.example",
  serviceArea: "Prayagraj & nearby areas",
  address: "10/C 4A Madhavpur Patti, Naini, Prayagraj - 211008, U.P.",

  // Photo slider: add images to assets/images/slider/ and list each path below.
  // The first image is used if you have not added any other photos yet.
  sliderImages: [
    { src: "assets/hero1.jpg", alt: "Solar panels on a modern home" },
    { src: "assets/hero2.jpg", alt: "Rooftop solar installation" },
    { src: "assets/hero3.jpg", alt: "Solar panels in sunlight" }
  ],

  // These photos are shown in the Solutions cards.
  solutionImages: {
    residential: "assets/images/solutions/residential.jpg",
    commercial: "assets/images/solutions/commercial.jpg",
    maintenance: "assets/images/solutions/maintenance.jpg"
  },

  // Optional project gallery photos. Add or remove entries as needed.
  galleryImages: [
    { src: "assets/instal1.jpg", alt: "Technicians installing rooftop solar panels", label: "Rooftop Installation" },
    { src: "assets/instal2.jpg", alt: "Solar installation team fitting rooftop panels", label: "Solar Panel Installation" },
    { src: "assets/instal3.jpg", alt: "Technicians positioning a solar panel at a home", label: "Residential Installation" },
    { src: "assets/instal4.jpg", alt: "Completed rooftop solar panel array", label: "Solar Project" },
    { src: "assets/instal5.jpg", alt: "Residential rooftop with an installed solar panel array", label: "Rooftop Solar System" },
    { src: "assets/instal6.jpg", alt: "Solar technicians working on a panel installation", label: "Installation in Progress" }
  ],

  sliderIntervalMs: 5000
};
