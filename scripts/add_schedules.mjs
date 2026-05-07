import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const path = join(dirname(fileURLToPath(import.meta.url)), '..', 'data/events.json')
const events = JSON.parse(readFileSync(path, 'utf8'))

const schedules = {
  4: [ // Funk Library
    { time: 'All day',        items: ['Coloring sheets', 'World\'s Largest Puzzle', 'Whiteboard questions', 'Animal cams', 'Emoji wall'] },
    { time: '11 AM – 12 PM',  items: ['Free coffee & tea · 2nd Floor'] },
    { time: '2 – 3 PM',       items: ['Wildlife Ambassador Animals · 2nd Floor'] },
  ],
  13: [ // Grainger Library
    { time: 'All day',        items: ['Study spaces (reservation req.)', 'Board games', 'VR game room', 'Coloring & fidget toys', 'Nature videos · IDEA Lab basement'] },
    { time: '12 – 1:30 PM',   items: ['Board games · Commons Rm 233/235'] },
    { time: '12 PM onwards',  items: ['Snacks every 2 hrs outside IDEA Lab (12, 2, 4, 6, 8 PM)'] },
    { time: '3 – 9 PM',       items: ['Collage boards, button making, crochet bookmarks, canvas painting · 2nd Floor'] },
    { time: '4 – 6 PM',       items: ['Writers Workshop · 1st Floor'] },
    { time: '4:15 – 5:15 PM', items: ['McKinley Stress Management · Visualization Theatre'] },
  ],
  14: [ // Main Library
    { time: 'All day',        items: ['Coloring, animal cams, board games, poetry prescriptions · Orange Room'] },
    { time: '10:30 AM – 12 PM', items: ['Mini therapy horses · Library Gallery'] },
    { time: '11 AM – 12 PM',  items: ['Research consultations · Orange Room'] },
    { time: '12 – 1 PM',      items: ['Make-A-Button · Orange Room', '🍕 Free snacks'] },
    { time: '1 – 2 PM',       items: ['Citation help + creative brainstorm', 'Green screen photo booth · Gallery', 'Guided drawing · Room 106'] },
    { time: '2 – 3 PM',       items: ['Recycled book page greeting cards', 'Green screen photo booth · Gallery'] },
    { time: '3 – 4 PM',       items: ['Paper snowflakes · Orange Room', '🍕 Free snacks'] },
    { time: '4 – 5 PM',       items: ['Make-A-Button · Orange Room'] },
    { time: '5 – 6 PM',       items: ['Guided drawing · Room 106'] },
    { time: '6 – 7 PM',       items: ['Recycled book page cards · Orange Room', '🍕 Free snacks'] },
    { time: '7 – 8 PM',       items: ['🍩 Donuts! · Orange Room'] },
    { time: '8 – 9 PM',       items: ['Paper snowflakes · Orange Room', '🍕 Free snacks'] },
  ],
}

events.forEach(ev => {
  if (schedules[ev.id]) ev.schedule = schedules[ev.id]
})

writeFileSync(path, JSON.stringify(events, null, 2))
console.log('Schedules added to events 4, 13, 14')
