# Eyeterra

### Protecting vision shouldn't be just a vision.

[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB.svg?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![Uses TypeScript](https://img.shields.io/badge/Uses-TypeScript-3178C6.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Powered by Vite](https://img.shields.io/badge/Powered%20by-Vite-646CFF.svg?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Styled with Tailwind](https://img.shields.io/badge/Styled%20with-Tailwind-38B2AC.svg?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Backend: Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E.svg?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Privacy First](https://img.shields.io/badge/Privacy-LocalStorage%20First-4B8BBE.svg?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

## Vision & Mission

Eyeterra aims for a **privacy-first** and **accessibility-for-all** setup, so progress is stored always in your **localStorage**.

**Vision**: A world where eye-conscious habits are second nature and vision neglect is a thing of the past.

**Mission**: To build a practical, accessible, and engaging solution to combat the global rise in digital eye strain, myopia, and vision neglect caused by increased screen time and lack of awareness.

## About Eyeterra

I built Eyeterra to protect the well-being of our eyes. It was inspired by my family's eyes and my own, some fairs I've been to, as well as news and the media.

### How I built Eyeterra
**Day 1**: **Planning**. I outlined Eyeterra's purpose, functionality, and theme. Then I wrote documentation to outline my desired style (I chose soft neobrutalism after getting inspired by a fellow hacker's website, and terracotta for a sunny feel), what each feature does, how they are written/described, and its layout. 

**Day 2-3**: **The skeleton**. After breaking my documentation into phases, I programmed Eyeterra incrementally. The stack as follows:
- The header and the footer, with blank pages for all five pages
- Daily Habits, starting with the 20-20-20 timer, eye exercises, eye nutrition, workstation setup, before wiring them to the final score. The tips came last as I needed the finished structure to decide where to put it best.
- Awareness Hub. Starting with the Visual Impairment Simulator and its three slots. I remember deciding to put off Hyperopia before finding a way to invert Myopia's effect for the simulation. Then I experimented with different layouts for the Community Resources. The graphs came last. 
- Vision Tour, where I coded the entry page before adding each stop and wiring their outcomes to the results page. The feature that remembers the last stop the user left off was added some time later, after experiencing certain inconvenience (and dismay) from the lack of it.
- Eye Care was relatively straightforward. Google Maps was incorporated as well as a few general tips on when to visit an eye care professional.

**Day 4**: **Polishing**. I spent the day using Eyeterra firsthand to identify bugs, review technicalities, and implement new ideas or tweak layouts to improve user experience. Having the Eye Integrity Score to update live and not with every refresh was decided here, the data in Awareness Hub to animate, as well as improving the visibility dropdown toggles during combinations of Light/Dark Mode and Low/High Contrast.


All in all, I appreciate that Eyeterra's design achieved a degree of warmth instead of being cool or overly clinical.

## Features

### Daily Habits & Eye Integrity Score
- 20-20-20 timer to build eye-conscious breaks
- Eye exercises, nutrition guidance, and workstation setup tips
- Everything wired to a live-updating Eye Integrity score
- Progress stored always in your **localStorage** - privacy-first by design

### Awareness Hub
- Visual Impairment Simulator with three examples (one for you to experience with your own image) and up to 6 simulations
- Community resources and animated trend graphs

### 5-Stop Vision Tour
How well do we understand our sight?
- 5 different tests with the outcomes wired to a results page

### Eye Care & Live Map
- Google Maps integration marking optometrists and ophthalmology centres at any location
- General tips on when to visit an eye care professional

### A Themed Easter Egg
- Anonymous click tracking via Supabase powers one thing only: the **Neonmap** (spoiler: the click heatmap)

## License

SnackGlobe is licensed under the MIT License - please see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- **The localStorage API** for keeping every user's progress private and local
- **Google Maps** for live eye care location integration
- **Supabase** for anonymous click tracking (strictly for the Neonmap Easter egg)

Eyeterra wouldn't be here without them!

## Future Roadmap

- [ ] Enhanced accessibility features (font size, seizure safety, colour blind filters)
- [ ] Screen readers and voice navigation
- [ ] Improved localStorage tracking (such as a 7-day Eye Integrity graph)
- [ ] Add an "in-depth" mode to Vision Tour that tests implicit symptoms
- [ ] Integrate Gemini analysis for a specialised report card in Vision Tour

And many more through experiments, exposure, feedback, and tiny "aha!" moments

## 🎉 Show Your Support

If you find Eyeterra interesting, feel free to:
- ⭐ Star the repository
- 🍴 Fork it to explore
- 👀 Watch for updates
- 📢 Share it with others who spend too long staring at screens

---

> **Built with ❤️ for clearer tomorrows, one habit at a time.**
