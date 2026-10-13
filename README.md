# Eyeterra — Protecting Vision Shouldn't Be Just A Vision

## Inspiration
I built Eyeterra to protect the well-being of our eyes. It was inspired by my family's eyes and my own, some fairs I've been to, as well as news and the media.

## What Eyeterra does
Eyeterra solves a real world problem — building a practical, accessible, and engaging solution to combat the global rise in digital eye strain, myopia, and vision neglect caused by increased screen time and lack of awareness.

**Eyeterra v1.0** covers four main features:

1. A meter to build eye-conscious habits while tracking your daily Eye Integrity score
2. An awareness zone where users can understand different eye conditions through experience, trends, and get to know other sources that inspired Eyeterra's ambition
3. A 5-stop vision tour — how well do we understand our sight?
4. A live map integration that marks optometrists and ophthalmology centres at any given location

Eyeterra aims for a **privacy-first** and **accessibility-for-all** setup, so progress is stored always in your **localStorage**. Supabase is used for the anonymous click tracking strictly for a themed Easter egg: the Neonmap (spoiler: the click heatmap).

## How I built Eyeterra
**Day 1**: **Planning**. I outlined Eyeterra's purpose, functionality, and theme. Then I wrote a documentation to outline my desired style (I chose soft neobrutalism after getting inspired by one project, and teracotta for a sunny feel), what each feature does, how are they written/described, and its layout. 

**Day 2-3**: **The skeleton**. After breaking my documentation to phases, I programmed Eyeterra incrementally. The blocks go as such:
- The header and the footer, with blank pages for all five pages
- Daily Habits, starting with the 20-20-20 timer, eye exercises, eye nutrition, workstation setup, before wiring them to the final score. The tips came last as I needed the finished structure to decide where to put it best.
- Awareness Hub. Starting with the Visual Impairment Simulator and its three slots. I remember deciding to put of Hyperopia before finding a way to inverse Myopia's effect for the simulation. Then I experimented with different layouts for the Community Resources. The graphs came last. 
- Vision Tour, where I coded the entry page before adding each stop and wiring their outcomes to the results page. The feature that remembers the last stop the user left off was added some time later, after experiencing certain inconvinience (and dismay) from the lack of it.
- Eye Care was relatively straightforward. Google Maps was incorporated as well as a few tips on when to visit an eye care professional.

**Day 4**: **Polishing**. I spent the day using Eyeterra firsthand to identify bugs, review technicalities, and implement new ideas or variables that would improve user experience. Having the Eye Integrity Score to update live and not with every refresh was decided here, the data in Awareness Hub to animate, as well as improving the visibility dropdown toggles during combinations of Light/Dark Mode and Low/High Contrast.


All in all, I appreciate that Eyeterra's design achieved a degree of warmth instead of being cool or overly clinical.

## What's next for Eyeterra
Upcoming features in the list:

[] Enhanced accessibility features (font size, seizure safety, colour blind filters)

[] Screen readers and voice navigation

[] Improved localStorage tracking (such as a 7-day Eye Integrity graph)

[] Add an "in-depth" mode to Vision Tour that tests implicit symptoms

[] Integrate Gemini analysis for a specialised report card in Vision Tour

And many more that will come through experiments, exposure, feedback, and tiny "aha!" moments

## Deployment

Eyeterra deploys to **GitHub Pages** via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). 

## Contributing
Eyeterra is open-source on GitHub as a non-profit and FOSS website to encourage community interaction. It's also to ensure that it remains helpful and relevant to all users. Needless to say, I'm actively hearing out opinions from various users, so protecting our eyes will no longer be that tough. 

To anyone reading this, don't hesitate to tell me your thoughts, suggestions, or even your struggles with eye strain. Your voice helps us all see more clearly.

Thanks for reaching here, enjoy your day!
