import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const path = join(root, 'data/events.json')
const events = JSON.parse(readFileSync(path, 'utf8'))

const updates = {
  1: {
    notes: "Stop by the Siebel Center for Design for Reading Day! Pick up free energy drinks (Celsius, Monster, VitaCoco), cosmetic samples from Hero and Colourpop, catch the mini horses from 1-2pm, get creative at the crafting station in The Shop, and compete in games with prizes.",
    link: "https://designcenter.illinois.edu/stories/student-stories/reading-day-recap"
  },
  2: {
    notes: "The ECE Department hosts a Reading Day celebration in the ECEB Atrium. Grab JJ sandwiches, sweet treats, and ECE swag, hang out with UIPD therapy dogs (2-3pm), and unwind at the crafting tables. Open to all — not just ECE students. Food and swag while supplies last.",
    link: "https://calendars.illinois.edu/detail/172?eventId=33551478"
  },
  3: {
    notes: "The College of Fine & Applied Arts brings Finals Fest to Krannert Art Museum. There is a coffee bar, snacks, art-making activities, and study tables with outlets spread through the museum galleries — a calm, inspiring place to get through reading day. Sponsored by the College of FAA, Ricker Library, and Krannert Art Museum.",
    link: "https://calendars.illinois.edu/detail/7?eventId=33548754"
  },
  4: {
    notes: "Part of the Library De-Stress Fest. The Funk ACES Library has coloring sheets, the World's Largest Puzzle, whiteboard questions, animal cams, and an emoji wall going all day. Free coffee & tea on the 2nd Floor (11am-noon), and Wildlife Ambassador Animals at 2-3pm.",
    link: "https://calendars.illinois.edu/detail/7?eventId=33541596"
  },
  6: {
    notes: "Every Thursday the Asian American Studies building opens its cozy Reading Room to all students. Pull up a seat, enjoy free hot drinks and snacks while supplies last, and take a real break from finals prep.",
    link: "https://calendars.illinois.edu/detail/7?eventId=33525801"
  },
  7: {
    notes: "The Women's Resources Center hosts an all-day crafternoon with returning fan-favorite projects from this year. Drop in to decompress, make something, or just say hi. Free tea, coffee, and snacks provided. Perfect study break any time between 9am and 5pm.",
    link: "https://calendars.illinois.edu/detail/7?eventId=33550715"
  },
  8: {
    notes: "Gender & Women's Studies sends off reading day with free books in every genre — feminist theory, poetry, memoir, textbooks, contemporary fiction, cookbooks, and more. Plus mini care packages to fuel your finals. Bring a book to donate or just come take one. Student award announcements at 11am.",
    link: "https://calendars.illinois.edu/detail/7?eventId=33550822"
  },
  12: {
    notes: "University YMCA hosts a free outdoor picnic on the lawn. Grab a plate and take a real break outside before finals hit. Drop in any time between noon and 2pm.",
    link: null
  },
  13: {
    notes: "Grainger Library runs one of the biggest De-Stress Fest stops on campus. The IDEA Lab (basement) has study spaces, board games, VR, coloring, fidget toys, and nature videos all day. Snacks drop every 2 hours outside the lab starting at noon. Evening workshops include bullet journaling, mosaic lanterns DIY, and Cricut bookmarks. McKinley Stress Management Team visits 4:15-5:15pm.",
    link: "https://calendars.illinois.edu/detail/7?eventId=33541596"
  },
  14: {
    notes: "The Main Library De-Stress Fest runs 10:30am to 9pm. Catch therapy mini-horses in the Gallery (10:30am-noon), make buttons, do guided drawing, work on recycled book page greeting cards, and grab snacks at four different time slots. The Orange Room has all-day coloring, board games, Play-Doh, and the World's Largest Puzzle. Writers Workshop and Scholarly Commons are also on hand.",
    link: "https://calendars.illinois.edu/detail/7?eventId=33541596"
  },
}

events.forEach(ev => {
  if (updates[ev.id]) {
    ev.notes = updates[ev.id].notes
    if (updates[ev.id].link) ev.link = updates[ev.id].link
  }
})

writeFileSync(path, JSON.stringify(events, null, 2))
console.log('Done:')
events.forEach(ev => console.log(` [${ev.id}] ${ev.location} ${ev.link ? '-> ' + ev.link : ''}`))
