# Council Trail: Chapter I, The Road to Nicaea

Council Trail is a retro trail game for a Catholic middle school. In Chapter I,
students travel to the Council of Nicaea in A.D. 325 from Rome, Alexandria,
Antioch or Jerusalem, by road or by sea, then help the bishops answer Arius.
A chapter takes about 15 to 25 minutes.

## Play it

Open `index.html` in a browser. There is nothing to install and no build step.

For iPads, put the whole folder on any static web host (GitHub Pages, Netlify,
or the school website) and share the link. In Safari, students can tap
Share > Add to Home Screen to play full screen. The game needs internet only
for its retro font; without it, it falls back to a plain monospace font.

The game saves on the iPad after every day, so students can close it and tap
"Continue the journey" next class. Sound is off until a student turns it on,
and every sound shows a caption.

## Edit the content

All the words are in `js/data.js`: the home cities and their characters, the
places, roads and sea lanes, the event cards, the news in each city, the
council dialogue, the three questions and the Creed. Change the text there; the
game code in `js/game.js` doesn't need to change.

## Art

All art is original and comes from the sprite generator in
`../council-trail-sprites`. After changing a sprite there, run:

    sh tools/sync-assets.sh

| Used for | Files |
|---|---|
| Players | `bishop_confessor` (Paphnutius, Potammon), `vitus`, `vincentius`, `eustathius_of_antioch`, `paul_of_neocaesarea`, `macarius_of_jerusalem` |
| Companions | `athanasius`, `vincentius` / `vitus`, `monk` |
| People met | `alexander_of_alexandria`, `emperor` (Constantine), `pope` (Sylvester), `arius`, `nicholas_of_myra`, `bishop`, `soldier` |
| Travel | `cart`, `ox`, `ship`, and scenery drawn in code (lighthouse, cities, mountains, river, sea, storms) |
| Places | `old_st_peters` (Rome), `nicaea_gate`, `council_hall`, `council_map_unlabeled` |
| Title | `chi_rho` |

## Test

- `index.html?screen=travel&see=rome&at=thessalonica` jumps straight to a
  screen. Screens: `sees`, `choose`, `intro`, `shop`, `travel`, `map`, `fork`,
  `place`, `event&id=storm`, `hall`, `quiz&n=1`, `end`. Add `&leg=myra&km=200`
  to be part-way along a leg, and `&storm=1` for a storm at sea.
- `tools/playtest.html` plays the whole chapter by itself and prints a log.
  Options: `?see=0..3` (Rome, Alexandria, Antioch, Jerusalem), `&route=sea` or
  `land` at forks, `&shop=1` to buy food at every market, `&resume=1` to reload
  part-way and test saving.

## Milestone 1 checklist

- [x] Title, map and travel screens, sized for an iPad held sideways
- [x] Party of the player bishop and the deacon Athanasius, with food, coins and days
- [x] One road with at least 5 event cards
- [x] Arrival at the gate of Nicaea, the council scene, and a 3-question decision
- [x] End screen with the opening lines of the Creed said at Mass
- [ ] Class playtest: most students finish within 25 minutes

## Milestone 2 checklist

- [x] Home city: Rome, Alexandria, Antioch or Jerusalem, each with its own road,
      start date and real people to play (the Pope's legates, confessor bishops,
      Eustathius, Macarius)
- [x] Land and sea routes: forks at Alexandria, Caesarea, Antioch and
      Thessalonica; ship fares, storms, calm seas; the Bosporus crossing
- [x] City stops: buy food, rest at the church guesthouse, hear the news
      about Arius
- [x] 23 event cards (15 random, 8 tied to places), and companions who fall
      ill and recover
- [x] Saving after each day, and optional sound with captions
