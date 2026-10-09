// Chapter I content: the roads to Nicaea, A.D. 325.
// Teachers can edit any wording here without touching game.js.
// Distances are in kilometres along the Roman roads and sea lanes (approximate).
// In any text, {hero} and {companion} are replaced by the names in this game.

window.CHAPTER = {
  title: 'The Road to Nicaea',
  year: 325,
  councilDate: { month: 5, day: 20 },   // the council opened on May 20, 325
  startCoins: 120,
  foodPrice: 2,                         // coins per day of food at home; dearer far away

  // ---------------------------------------------------------------- home cities
  // Each see starts on its own date, so every road is a close race to May 20.
  sees: [
    {
      id: 'rome', name: 'Rome', art: 'pope', start: 'rome', startDate: { month: 3, day: 28 },
      blurb: 'Travel for Pope Sylvester, over the mountains of Greece. About 1,900 km.',
      companion: { name: 'Vincentius', art: 'vincentius' },
      heroes: [
        { name: 'Vitus', art: 'vitus', title: 'Priest of Rome',
          bio: 'One of two priests Pope Sylvester is sending to Nicaea to speak for the Church of Rome.',
          companion: { name: 'Vincentius', art: 'vincentius' } },
        { name: 'Vincentius', art: 'vincentius', title: 'Priest of Rome',
          bio: "The other of the Pope's two legates. He carries the Pope's letter to the bishops.",
          companion: { name: 'Vitus', art: 'vitus' } },
      ],
      intro: [
        { who: 'pope', text: 'My sons, Emperor Constantine has called every bishop to a great council at Nicaea, far to the East. I am too old to make the journey.' },
        { who: 'pope', text: 'Go in my place. Hold fast to the faith of Peter and Paul, and sign nothing that denies that the Son is truly God.' },
        { who: 'companion', text: 'We will not fail you, Holy Father. The council opens on May 20, so we must leave at once!' },
      ],
    },
    {
      id: 'alexandria', name: 'Alexandria', art: 'alexander', start: 'alexandria', startDate: { month: 3, day: 18 },
      blurb: 'Bring the young deacon Athanasius through Palestine and Syria. About 2,100 km by land.',
      companion: { name: 'Athanasius', art: 'athanasius' },
      heroes: [
        { name: 'Paphnutius', art: 'player', title: 'Bishop in Upper Egypt',
          bio: 'A monk who became a bishop. He lost an eye for the faith in the last great persecution, and the Emperor himself honoured his scars.' },
        { name: 'Potammon', art: 'player', title: 'Bishop of Heraclea in Egypt',
          bio: 'A brave confessor who also lost an eye in the persecution under Emperor Maximinus. He was a loyal friend of Bishop Alexander.' },
      ],
      intro: [
        { who: 'alexander', text: 'Brother, great news! Emperor Constantine has called every bishop in the world to a council at Nicaea.' },
        { who: 'alexander', text: 'My priest Arius teaches that the Son of God is a creature, made by the Father. The whole Church must answer him.' },
        { who: 'alexander', text: 'I sail ahead with the bishops of Egypt. Bring my young deacon Athanasius, and be in Nicaea before the council opens on May 20.' },
        { who: 'companion', text: 'I am ready, Father. I have packed my books! And some bread. Mostly books.' },
      ],
    },
    {
      id: 'antioch', name: 'Antioch', art: 'eustathius', start: 'antioch', startDate: { month: 4, day: 15 },
      blurb: 'The shortest road, but it climbs the Taurus Mountains. About 1,000 km.',
      companion: { name: 'Brother Simon', art: 'monk' },
      heroes: [
        { name: 'Eustathius', art: 'eustathius', title: 'Bishop of Antioch',
          bio: 'A learned bishop and a strong defender of the faith. Some old writers say he gave the speech welcoming the Emperor to the council.' },
        { name: 'Paul', art: 'paul', title: 'Bishop of Neocaesarea',
          bio: 'In the persecution his hands were burned with hot irons, and he can no longer use them. The bishops will honour him at Nicaea.' },
      ],
      intro: [
        { who: 'messenger', text: 'A letter from the Emperor! All bishops are to meet at Nicaea in Bithynia. The council opens on May 20.' },
        { who: 'companion', text: 'This spring the bishops meeting here in Antioch already condemned the teaching of Arius. Now the whole Church will decide!' },
      ],
    },
    {
      id: 'jerusalem', name: 'Jerusalem', art: 'macarius', start: 'jerusalem', startDate: { month: 3, day: 29 },
      blurb: 'Leave the Holy City by the coast road, or sail from Caesarea. About 1,600 km.',
      companion: { name: 'Deacon Mark', art: 'monk' },
      heroes: [
        { name: 'Macarius', art: 'macarius', title: 'Bishop of Jerusalem',
          bio: 'Bishop of the Holy City. He dreams of uncovering the tomb of Jesus, which lies buried under a pagan temple.' },
      ],
      intro: [
        { who: 'messenger', text: 'A letter from the Emperor! All bishops are to meet at Nicaea in Bithynia. The council opens on May 20.' },
        { who: 'companion', text: 'Nicaea is far to the north, Father. We can take the coast road, or find a ship at Caesarea.' },
      ],
    },
  ],

  // ---------------------------------------------------------------- places
  // `label` places the name on the map: above (default), below, left, right,
  // below-left or above-left. `minor` places are named only when they are next.
  // `scenery`: what the travel scene shows there. `news`: what people are saying.
  places: {
    rome: { name: 'Rome', lat: 41.9, lon: 12.5, market: true, scenery: 'basilica',
      text: 'Rome, where Sts. Peter and Paul gave their lives for Christ. Constantine is building a great church over the tomb of St. Peter.',
      news: 'Pope Sylvester is too old for the long journey, so he is sending two priests to speak for the Church of Rome.' },
    brundisium: { name: 'Brundisium', lat: 40.64, lon: 17.94, market: true, scenery: 'city',
      text: "Brundisium is the end of the Appian Way, the \"Queen of Roads\". From here ships cross the Adriatic Sea to Greece.",
      news: 'Sailors say ships full of bishops are crossing every sea toward Nicaea.' },
    dyrrachium: { name: 'Dyrrachium', lat: 41.32, lon: 19.45, scenery: 'city',
      text: 'Dyrrachium is the start of the Via Egnatia, the great road that crosses the mountains of Macedonia to the East.' },
    thessalonica: { name: 'Thessalonica', lat: 40.63, lon: 22.94, label: 'below', market: true, scenery: 'city',
      text: 'St. Paul preached here and wrote two letters to the Thessalonians, among the oldest books of the New Testament.',
      news: 'Merchants from Alexandria say the quarrel about Arius has split families and even sailors into two sides.' },
    philippi: { name: 'Philippi', lat: 41.01, lon: 24.28, scenery: 'city',
      text: 'At Philippi, St. Paul baptised Lydia, the first Christian in Europe (Acts 16).' },
    byzantium: { name: 'Byzantium', lat: 41.01, lon: 28.97, market: true, scenery: 'city', event: 'bosporus',
      text: 'Byzantium guards the Bosporus, the strait between Europe and Asia. In five years Constantine will rebuild it as his new capital, Constantinople.',
      news: 'Everyone is talking about the Emperor. Only last year he defeated his rival Licinius near here and became sole ruler of the Empire.' },
    chalcedon: { name: 'Chalcedon', lat: 40.99, lon: 29.03, minor: true, label: 'right', scenery: 'city',
      text: 'Chalcedon faces Byzantium across the water. One day, in 451, another great council will meet here.' },
    nicomedia: { name: 'Nicomedia', lat: 40.77, lon: 29.92, label: 'right', market: true, scenery: 'city', event: 'eusebius_nicomedia',
      text: "Nicomedia is the Emperor's eastern capital. Here, in 303, Emperor Diocletian began the Great Persecution by tearing down the church.",
      news: "Bishop Eusebius of Nicomedia is Arius's most powerful friend, and he is close to the Emperor's family." },
    hellespont: { name: 'Hellespont', lat: 40.2, lon: 26.5, label: 'below', scenery: 'sea',
      text: "The Hellespont is the narrow strait between Europe and Asia. Nearby is Troas, where St. Paul saw a vision of a man calling, \"Come over to Macedonia and help us!\" (Acts 16:9)." },
    rhodes: { name: 'Rhodes', lat: 36.43, lon: 28.22, label: 'left', market: true, scenery: 'city',
      text: "Rhodes once had a giant bronze statue of the sun god, the Colossus, until an earthquake threw it down. St. Paul's ship stopped here (Acts 21:1)." },
    myra: { name: 'Myra', lat: 36.26, lon: 29.98, label: 'right', market: true, scenery: 'city', event: 'nicholas',
      text: 'Myra is the city of Bishop Nicholas, famous for his kindness to the poor. St. Paul changed ships here on his way to Rome (Acts 27:5-6).',
      news: 'People say Bishop Nicholas has already left for Nicaea, and that he is ready to stand up to Arius!' },
    alexandria: { name: 'Alexandria', lat: 31.2, lon: 29.9, market: true, scenery: 'pharos',
      text: 'Alexandria is the second city of the Empire, with its great lighthouse, the Pharos, and its famous library. St. Mark the Evangelist brought the Gospel here.',
      news: 'About a hundred bishops of Egypt and Libya met here with Bishop Alexander and removed Arius from his church.' },
    pelusium: { name: 'Pelusium', lat: 31.04, lon: 32.55, label: 'below', scenery: 'city',
      text: 'Pelusium guards the road out of Egypt. Every traveller to the East passes through its gate.' },
    gaza: { name: 'Gaza', lat: 31.5, lon: 34.45, market: true, scenery: 'city',
      text: 'Gaza is a busy port on the edge of the desert, where caravans arrive with spices and incense.' },
    jerusalem: { name: 'Jerusalem', lat: 31.78, lon: 35.23, label: 'below', market: true, scenery: 'city',
      text: 'Jerusalem, the Holy City, where Jesus died and rose again. The Romans rebuilt it as a pagan city, and a temple now covers the tomb of Christ.',
      news: 'The bishops of Palestine are divided: some of them, like Eusebius of Caesarea, have welcomed Arius.' },
    caesarea: { name: 'Caesarea', lat: 32.5, lon: 34.9, market: true, scenery: 'city', event: 'eusebius',
      text: 'Caesarea, built by King Herod, is where St. Peter baptised the centurion Cornelius, the first non-Jewish Christian (Acts 10).',
      news: 'After he was sent away from Alexandria, Arius stayed in Palestine, and several bishops here wrote letters supporting him.' },
    antioch: { name: 'Antioch', lat: 36.2, lon: 36.16, label: 'below-left', market: true, scenery: 'city', event: 'arius_songs',
      text: 'In Antioch the disciples were first called "Christians" (Acts 11:26). St. Peter led the Church here before going to Rome.',
      news: "Earlier this year a council of bishops here condemned Arius's teaching. They chose Eustathius, a strong defender of the faith, as bishop." },
    seleucia: { name: 'Seleucia', lat: 36.12, lon: 35.92, minor: true, label: 'above-left', market: true, scenery: 'city',
      text: 'Seleucia is the harbour of Antioch. St. Paul and St. Barnabas sailed from here on their first missionary journey (Acts 13:4).' },
    tarsus: { name: 'Tarsus', lat: 36.92, lon: 34.9, label: 'left', market: true, scenery: 'city',
      text: 'Tarsus is the hometown of St. Paul the Apostle. Ahead rise the Taurus Mountains.' },
    gates: { name: 'Cilician Gates', lat: 37.28, lon: 34.8, minor: true, scenery: 'pass', event: 'bandits',
      text: 'The Cilician Gates are a narrow pass through the Taurus Mountains. Armies, merchants and robbers all use this road.' },
    tyana: { name: 'Tyana', lat: 37.83, lon: 34.6, scenery: 'city',
      text: 'Tyana is in Cappadocia, a land of high plains and strange rock towers. Great saints will come from here, like St. Gregory of Nyssa.' },
    ancyra: { name: 'Ancyra', lat: 39.93, lon: 32.86, market: true, scenery: 'city',
      text: 'Ancyra is the capital of Galatia; St. Paul wrote his Letter to the Galatians to Christians in this region.',
      news: 'The council was first going to meet here, but the Emperor moved it to Nicaea, near his palace and with a gentler climate.' },
    sangarius: { name: 'Sangarius River', lat: 40.1, lon: 30.2, minor: true, label: 'below', scenery: 'river', event: 'river',
      text: 'The Sangarius River runs high and muddy with spring rain.' },
    nicaea: { name: 'Nicaea', lat: 40.43, lon: 29.72, label: 'left', scenery: 'gate',
      text: 'Nicaea sits on a quiet lake, ringed by strong walls. Its name means "Victory".' },
  },

  // ---------------------------------------------------------------- roads and sea lanes
  // `via`: bends before the destination, so the map line follows the real route.
  // `fare`: coins for the voyage. `choice`: the button text where roads fork.
  // `by`: how the fork button describes a road that leads to a ship.
  legs: [
    { from: 'rome', to: 'brundisium', mode: 'land', km: 560,
      via: [[41.29, 13.25], [41.08, 14.25], [41.13, 14.78], [40.96, 15.82], [40.47, 17.24]] },
    { from: 'brundisium', to: 'dyrrachium', mode: 'sea', km: 150, fare: 10 },
    { from: 'dyrrachium', to: 'thessalonica', mode: 'land', km: 380, via: [[41.11, 20.8], [41.03, 21.33], [40.8, 22.05]] },
    { from: 'thessalonica', to: 'philippi', mode: 'land', km: 170, via: [[40.82, 23.85]],
      choice: 'Keep to the Via Egnatia by land' },
    { from: 'thessalonica', to: 'hellespont', mode: 'sea', km: 380, fare: 20, via: [[40.0, 23.0], [39.85, 24.5], [40.0, 25.6]],
      choice: 'Sail across the Aegean Sea' },
    { from: 'philippi', to: 'byzantium', mode: 'land', km: 430, via: [[40.93, 25.85], [40.92, 26.4], [40.97, 27.95]] },
    { from: 'byzantium', to: 'chalcedon', mode: 'sea', km: 3 },
    { from: 'chalcedon', to: 'nicomedia', mode: 'land', km: 100, via: [[40.82, 29.3]] },
    { from: 'hellespont', to: 'nicomedia', mode: 'sea', km: 300, via: [[40.4, 26.7], [40.65, 27.7], [40.85, 28.7], [40.75, 29.4]] },
    { from: 'nicomedia', to: 'nicaea', mode: 'land', km: 80 },

    { from: 'alexandria', to: 'pelusium', mode: 'land', km: 230, via: [[31.1, 30.5], [30.95, 31.3]],
      choice: 'Take the coast road through Palestine and Syria' },
    { from: 'alexandria', to: 'myra', mode: 'sea', km: 650, fare: 40, via: [[33.6, 29.95]],
      choice: 'Sail north on an Alexandrian grain ship' },
    { from: 'pelusium', to: 'gaza', mode: 'land', km: 220, via: [[31.13, 33.82]] },
    { from: 'gaza', to: 'caesarea', mode: 'land', km: 130, via: [[32.05, 34.8]] },
    { from: 'jerusalem', to: 'caesarea', mode: 'land', km: 110, via: [[31.95, 35.0]] },
    { from: 'caesarea', to: 'antioch', mode: 'land', km: 470,
      via: [[32.92, 35.12], [33.27, 35.27], [33.9, 35.56], [34.43, 35.9], [35.52, 35.86]],
      choice: 'Continue up the coast road to Antioch' },
    { from: 'caesarea', to: 'myra', mode: 'sea', km: 750, fare: 40, via: [[33.3, 32.5], [35.6, 31.0]],
      choice: "Sail from Caesarea's harbour" },
    { from: 'antioch', to: 'tarsus', mode: 'land', km: 200, via: [[36.75, 36.25], [36.96, 35.62]],
      choice: 'Take the road over the Taurus Mountains' },
    { from: 'antioch', to: 'seleucia', mode: 'land', km: 30, by: 'sea',
      choice: 'Go down to the port of Seleucia and sail' },
    { from: 'seleucia', to: 'myra', mode: 'sea', km: 650, fare: 35, via: [[36.0, 34.3], [36.0, 33.0], [35.9, 31.5]] },
    { from: 'tarsus', to: 'gates', mode: 'land', km: 80 },
    { from: 'gates', to: 'tyana', mode: 'land', km: 90 },
    { from: 'tyana', to: 'ancyra', mode: 'land', km: 280, via: [[38.37, 34.03]] },
    { from: 'ancyra', to: 'sangarius', mode: 'land', km: 200, via: [[39.78, 30.52]] },
    { from: 'sangarius', to: 'nicaea', mode: 'land', km: 180 },
    { from: 'myra', to: 'rhodes', mode: 'sea', km: 200, via: [[36.05, 29.5]] },
    { from: 'rhodes', to: 'hellespont', mode: 'sea', km: 480,
      via: [[36.95, 27.6], [37.55, 26.85], [38.45, 26.4], [39.25, 25.85], [39.85, 26.05], [40.05, 26.2]] },
  ],

  // Events that happen on a set day of every journey.
  dayEvents: { 3: 'emperor_letter' },

  // ---------------------------------------------------------------- events at places
  // Choices may need coins (`cost`), roll a `chance` (with a `fail` outcome), and
  // have effects: food, coins, days, health (everyone), companion (their health),
  // post (imperial post), ill: { who: 'player' | 'companion', name, days }.
  events: {
    emperor_letter: {
      title: "The Emperor's Letter",
      sprite: 'emperor',
      speaker: 'Emperor Constantine (by letter)',
      text: 'A soldier rides up with a letter from Emperor Constantine: every bishop travelling to the council may use the imperial post, the Empire\'s own system of fresh horses and rest stations. And it is free!',
      fact: 'The Roman "cursus publicus" was like a government express service. Constantine opened it to the bishops so that even poor ones could reach Nicaea.',
      choices: [
        { label: 'Travel by the imperial post', effect: { post: true }, result: 'Fresh horses at every station! On land you will now travel much faster.' },
      ],
    },
    eusebius: {
      title: 'The Historian of Caesarea',
      sprite: 'bishop',
      speaker: 'Bishop Eusebius of Caesarea',
      text: 'Bishop Eusebius welcomes you. He is the greatest scholar of the age and is writing a history of the whole Church. He is a little friendly toward Arius, which worries {companion}.',
      fact: 'Eusebius wrote the first "History of the Church". Much of what we know about the early Christians comes from him.',
      choices: [
        { label: 'Accept his hospitality', effect: { food: 5, health: 10 }, result: 'A good meal and a soft bed. Eusebius gives you bread for the road.' },
        { label: 'Ask about the council', effect: {}, result: 'Eusebius says: "I will bring the old creed of my church in Caesarea. Perhaps all can agree on it." The bishops will start from creeds like his, and make them clearer.' },
      ],
    },
    arius_songs: {
      title: 'Songs in the Street',
      sprite: 'arius',
      speaker: 'Arius (in a popular song)',
      text: "In the market, sailors and millers are singing catchy songs: \"There was a time when the Son was not!\" They are verses from Arius's book, the Thalia.",
      fact: 'Arius set his teaching to popular tunes so that ordinary people would learn it. The question reached every street, not just the bishops.',
      choices: [
        { label: 'Ask {companion} what is wrong with it', effect: {}, result: '{companion} says: "If the Son once did not exist, He is a creature. But St. John writes, In the beginning was the Word, and the Word was God. The Son has always been, with the Father."' },
        { label: 'Sing a psalm instead', effect: { health: 5 }, result: 'Your party sings Psalm 2: "You are my Son; today I have begotten you." Spirits rise.' },
      ],
    },
    bandits: {
      title: 'Robbers in the Pass',
      sprite: 'soldier',
      speaker: 'A soldier at the fort',
      text: 'At the fort below the pass, a soldier warns you: "Robbers have been attacking travellers in the Gates. I can send two men with you, for a fee."',
      choices: [
        { label: 'Pay for an escort (15 coins)', cost: 15, effect: { coins: -15 }, result: 'The soldiers walk beside you. No robber dares come near.' },
        { label: 'Slip through at dawn', chance: 0.5,
          effect: {}, result: 'You pass quietly through the mist. Not a robber in sight!',
          fail: { effect: { food: -12, coins: -10 }, result: 'Robbers! They take food and coins, but {companion} keeps the books safe.' } },
      ],
    },
    river: {
      title: 'Crossing the Sangarius',
      sprite: 'ox',
      speaker: 'The river crossing',
      text: 'The river is wide and fast. A ferryman waits on the bank. How will you cross?',
      choices: [
        { label: 'Ford the river', chance: 0.6,
          effect: {}, result: 'The ox pulls hard, and the cart rolls safely up the far bank.',
          fail: { effect: { food: -8, days: 1 }, result: 'The cart tips in the current! You save it, but lose food and a day drying everything out.' } },
        { label: 'Take the ferry (6 coins)', cost: 6, effect: { coins: -6 }, result: 'The ferryman poles you across safely.' },
        { label: 'Wait a day for the water to drop', effect: { days: 1 }, result: 'The next morning the river is lower, and you cross easily.' },
      ],
    },
    bosporus: {
      title: 'Crossing the Bosporus',
      sprite: 'ship',
      speaker: 'The ferry to Asia',
      text: 'The strait is only a short sail wide, but the current is strong. Boatmen shout prices from the shore.',
      fact: 'Here Europe and Asia are less than a mile apart. Constantine chose this spot for his new capital because it controls the road and the sea between East and West.',
      choices: [
        { label: 'Hire a boatman (2 coins)', cost: 2, effect: { coins: -2 }, result: 'The boatman rows hard against the current and lands you at Chalcedon.' },
        { label: 'Wait for the church boat (free)', effect: { days: 1 }, result: 'The next day the local Christians ferry a group of bishops across, and you go with them.' },
      ],
    },
    eusebius_nicomedia: {
      title: "Arius's Powerful Friend",
      sprite: 'bishop',
      speaker: 'Bishop Eusebius of Nicomedia',
      text: 'Bishop Eusebius of Nicomedia invites you to dinner. "Surely Arius is right," he says. "A son must come after his father. Why make such a fuss?"',
      fact: 'Eusebius of Nicomedia was the strongest supporter of Arius. He was related to the Emperor\'s family, which made him very powerful.',
      choices: [
        { label: 'Answer him from Scripture', effect: {}, result: 'You reply: "Jesus said, I and the Father are one (John 10:30). God is not like a human father. His Son is eternal, like Him." Eusebius frowns and changes the subject.' },
        { label: 'Politely leave early', effect: { health: 5 }, result: 'You thank him for the dinner and get a good night\'s sleep instead.' },
      ],
    },
    nicholas: {
      title: 'The Kind Bishop of Myra',
      sprite: 'nicholas',
      speaker: 'The Church of Myra',
      text: 'Bishop Nicholas has already left for Nicaea, but his people welcome you as he would. "Our bishop gives everything away," they laugh. "Take some bread for the voyage!"',
      fact: 'One famous story says Nicholas secretly tossed bags of gold through a poor man\'s window so his three daughters could marry. That story is why St. Nicholas became Santa Claus.',
      choices: [
        { label: 'Accept their gift', effect: { food: 6 }, result: 'You leave Myra with full bags and a happy heart.' },
        { label: 'Give some coins for the poor (5)', cost: 5, effect: { coins: -5, health: 10 }, result: 'You give alms in honour of Bishop Nicholas. Everyone feels joyful.' },
      ],
    },
  },

  // ---------------------------------------------------------------- random events
  // `when.mode`: land or sea. `when.lands`: only in these landscapes.
  // `when.post`: only after the Emperor's letter.
  randomEvents: [
    {
      id: 'axle', title: 'A Broken Axle', sprite: 'cart', speaker: 'Your cart', when: { mode: 'land' },
      text: 'CRACK! The cart hits a stone and the axle splits.',
      choices: [
        { label: 'Pay a wheelwright (10 coins)', cost: 10, effect: { coins: -10, days: 1 }, result: 'The wheelwright fixes it in a day.' },
        { label: 'Repair it yourselves', effect: { days: 3 }, result: 'It takes three days of sawing and tying, but the cart rolls again.' },
      ],
    },
    {
      id: 'monk', title: 'A Monk of the Desert', sprite: 'monk', speaker: 'An old monk', when: { mode: 'land', lands: ['desert'] },
      text: 'An old monk walks out of the desert. He is a disciple of Abba Antony, the father of all monks.',
      fact: 'Thousands of monks lived in the Egyptian desert, praying day and night. Later St. Antony himself came to Alexandria to stand with Athanasius against Arius.',
      choices: [
        { label: 'Share your bread with him', effect: { food: -3, health: 15 }, result: 'He blesses each of you. Everyone feels stronger.' },
        { label: 'Ask him for advice', effect: {}, result: '"Pray as you walk," he says, "and do not quarrel on the road."' },
      ],
    },
    {
      id: 'fever', title: 'Fever!', sprite: 'companion', speaker: '{companion}',
      text: '{companion} is shivering with fever. "I can keep going," comes the whisper, but the face is pale.',
      fact: 'Fevers were common on long journeys. Churches ran guesthouses where pilgrims and sick travellers were cared for, one of the first kinds of hospital.',
      choices: [
        { label: 'Rest for two days', effect: { days: 2, ill: { who: 'companion', name: 'a fever', days: 2 } }, result: 'Two days of rest and broth. The fever is already easing.' },
        { label: 'Keep going slowly', effect: { ill: { who: 'companion', name: 'a fever', days: 6 } }, result: 'You press on. {companion} will be weak until the fever passes.' },
      ],
    },
    {
      id: 'bad_water', title: 'Bad Water', sprite: 'player', speaker: '{hero}', when: { mode: 'land' },
      text: 'You drank from a muddy well, and now your stomach is churning.',
      choices: [
        { label: 'Rest at a village for a day', effect: { days: 1, ill: { who: 'player', name: 'a stomach sickness', days: 2 } }, result: 'A village woman brings you mint tea. You will feel better soon.' },
        { label: 'Grit your teeth and travel on', effect: { ill: { who: 'player', name: 'a stomach sickness', days: 5 } }, result: 'Every bump of the cart hurts. Next time, boil the water!' },
      ],
    },
    {
      id: 'bishops', title: 'Fellow Travellers', sprite: 'bishop', speaker: 'Bishops on the road', when: { mode: 'land' },
      text: 'You meet a group of bishops also heading to Nicaea. Some carry scars from the persecution.',
      fact: 'About 300 bishops came to Nicaea. Tradition gives the number 318, like the 318 servants of Abraham (Genesis 14:14).',
      choices: [
        { label: 'Travel together for a while', effect: { health: 10 }, result: 'The miles pass quickly with good company and prayer.' },
        { label: 'Trade with them', effect: { food: 4, coins: -4 }, result: 'You buy some of their food for 4 coins.' },
      ],
    },
    {
      id: 'milestone', title: 'A Worn Milestone', sprite: 'cart', speaker: 'A fork in the road', when: { mode: 'land' },
      text: 'The road splits. The Roman milestone here is so worn you cannot read it.',
      fact: 'Romans set a milestone at every mile (1,000 paces) along their roads, telling the distance to the next city.',
      choices: [
        { label: 'Take the left road', chance: 0.5, effect: {}, result: 'A shepherd confirms you chose well.',
          fail: { effect: { days: 2 }, result: 'Wrong way! You lose two days turning back.' } },
        { label: 'Take the right road', chance: 0.5, effect: {}, result: 'The next milestone shows you are on the right road.',
          fail: { effect: { days: 2 }, result: 'This road leads to a village. Two days lost.' } },
      ],
    },
    {
      id: 'patrol', title: 'Soldiers on the Road', sprite: 'soldier', speaker: 'A Roman patrol', when: { mode: 'land', post: true },
      text: 'A patrol of soldiers stops your cart. Their officer reads your letter from the Emperor and salutes.',
      fact: "Only a few years before, soldiers arrested Christians. Now Constantine's soldiers protected bishops on their way to the council.",
      choices: [
        { label: 'Thank them and move on', effect: { health: 5 }, result: 'Times have changed! You give thanks to God for the peace of the Church.' },
      ],
    },
    {
      id: 'shrine', title: "A Martyr's Tomb", sprite: 'player', speaker: 'By the roadside', when: { mode: 'land' },
      text: 'Beside the road stands a small chapel over the tomb of a local martyr, killed for Christ in the persecution. Pilgrims are praying there.',
      fact: 'Christians honoured the martyrs by praying at their tombs and celebrating Mass there on the day they died, their "heavenly birthday".',
      choices: [
        { label: 'Stop and pray', effect: { days: 1, health: 15 }, result: 'You pray for the martyr\'s help on your journey. Everyone feels at peace.' },
        { label: 'Bow your head and keep going', effect: { health: 3 }, result: 'You say a quick prayer as you pass.' },
      ],
    },
    {
      id: 'lame_ox', title: 'A Lame Ox', sprite: 'ox', speaker: 'Your ox', when: { mode: 'land', post: false },
      text: 'Your ox is limping. A stone is stuck in its hoof.',
      choices: [
        { label: 'Rest the ox for two days', effect: { days: 2 }, result: 'The hoof heals and the ox is ready to go.' },
        { label: 'Trade for a fresh ox (12 coins)', cost: 12, effect: { coins: -12 }, result: 'A farmer trades you a strong young ox.' },
      ],
    },
    {
      id: 'storm', title: 'Storm at Sea!', sprite: 'ship', speaker: 'The captain', when: { mode: 'sea' }, storm: true,
      text: 'Black clouds roll in. The waves crash over the deck and the captain shouts orders.',
      fact: 'St. Paul was shipwrecked in a storm like this on his way to Rome. The sailors threw the cargo overboard to save the ship (Acts 27).',
      choices: [
        { label: 'Throw cargo overboard (10 food)', effect: { food: -10 }, result: 'The lighter ship rides the waves. You are safe, but hungry.' },
        { label: 'Hold on and pray', chance: 0.5, effect: { health: -5 }, result: 'The storm passes as fast as it came. Thanks be to God!',
          fail: { effect: { days: 3, health: -15 }, result: 'The storm drives the ship far off course. Three days lost, and everyone is battered.' } },
      ],
    },
    {
      id: 'becalmed', title: 'No Wind', sprite: 'ship', speaker: 'The captain', when: { mode: 'sea' },
      text: 'The sail hangs limp. The sea is as flat as glass, and the sun beats down.',
      choices: [
        { label: 'Wait and pray for wind', effect: { days: 2 }, result: 'Two days later a fresh breeze fills the sail.' },
        { label: 'Help the sailors row', effect: { days: 1, health: -10 }, result: 'Your hands are blistered, but you reach the wind by evening.' },
      ],
    },
    {
      id: 'seasick', title: 'Seasick', sprite: 'companion', speaker: '{companion}', when: { mode: 'sea' },
      text: '{companion} has turned green and is leaning over the side of the ship.',
      choices: [
        { label: 'Bring water and bread', effect: { ill: { who: 'companion', name: 'seasickness', days: 2 } }, result: 'A little food and a lot of fresh air. It will pass.' },
        { label: 'Tell a funny story', effect: { ill: { who: 'companion', name: 'seasickness', days: 3 } }, result: 'It helps a little. Mostly the laughing makes it worse.' },
      ],
    },
    {
      id: 'dolphins', title: 'Dolphins!', sprite: 'ship', speaker: 'On deck', when: { mode: 'sea' },
      text: 'A crowd of dolphins races beside the ship, leaping through the waves.',
      fact: 'Early Christians often drew fish. The Greek word for fish, ICHTHYS, spells "Jesus Christ, God\'s Son, Saviour" with its first letters.',
      choices: [
        { label: 'Watch them play', effect: { health: 10 }, result: 'Everyone on board cheers. What a sight!' },
      ],
    },
    {
      id: 'island', title: 'Fresh Water', sprite: 'ship', speaker: 'The captain', when: { mode: 'sea' },
      text: 'The ship stops at a small island to fill its water jars. Fishermen are selling their catch.',
      choices: [
        { label: 'Buy fish (4 coins)', cost: 4, effect: { coins: -4, food: 5 }, result: 'Fresh fish for supper, and some salted for later.' },
        { label: 'Stretch your legs on shore', effect: { health: 5 }, result: 'Solid ground feels wonderful.' },
      ],
    },
    {
      id: 'sailors', title: "The Sailors' Gods", sprite: 'ship', speaker: 'The crew', when: { mode: 'sea' },
      text: 'Before setting sail, the sailors pour wine into the sea for Poseidon, god of the sea. One of them asks you, "Who is your God?"',
      fact: 'In 325 most people in the Empire were still pagans. Christianity had been legal for only twelve years.',
      choices: [
        { label: 'Tell him about Jesus', effect: { health: 5 }, result: 'He listens all evening. "Tell me more tomorrow," he says.' },
        { label: 'Pray quietly for the crew', effect: {}, result: 'You pray for a safe voyage for everyone on board.' },
      ],
    },
  ],

  // ---------------------------------------------------------------- the council
  // The council, shown in the hall. `who: 'narrator'` lines are the game telling the
  // story; every other line is that person speaking. `action` plays a small scene:
  // enter (the Emperor walks in), forward:<who> (steps to the front), slap,
  // cheer (the bishops rejoice), exit:<who> (walks out of the hall).
  council: [
    { who: 'narrator', text: 'About 300 bishops fill the great hall of the palace. Many still carry scars from the persecution, which ended only twelve years ago.' },
    { who: 'narrator', action: 'enter', text: 'Trumpets sound! Emperor Constantine walks in, dressed in purple and gold, and the bishops rise to their feet.' },
    { who: 'emperor', text: 'Division in the Church is worse than any war. I beg you, my friends, settle this question in peace.' },
    { who: 'legates', text: 'We bring the greetings of Pope Sylvester, who is too old to make the journey. We speak for the Church of Rome.' },
    { who: 'narrator', action: 'forward:arius', text: 'Old Bishop Hosius of Cordoba helps lead the council. He calls Arius forward to explain his teaching.' },
    { who: 'arius', text: 'God the Father alone has no beginning. The Son was made by the Father before the world began. There was a time when the Son was not!' },
    { who: 'alexander', text: 'Then the Son would be a creature, and Christians would be worshipping a creature! No: the Son is eternal, as the Father is eternal.' },
    { who: 'athanasius', text: 'If the Son were not truly God, He could not save us. Only God can make us sharers in the life of God.' },
    { who: 'narrator', legend: true, action: 'slap', text: 'Legend says Bishop Nicholas of Myra grew so angry that he walked over and slapped Arius! The story was written down centuries later, so it may not have happened, but people loved to tell it.' },
    { who: 'narrator', text: 'Now the bishops must decide. Help them answer three questions.' },
  ],

  quiz: [
    {
      q: 'Arius says, "There was a time when the Son was not." What does the Church believe?',
      options: [
        { text: 'The Son is eternal: He has always existed with the Father.', correct: true },
        { text: 'The Son was the first and greatest creature God made.' },
        { text: 'Jesus was a good man who became God later.' },
      ],
      why: 'The Son is "born of the Father before all ages". There was never a time when the Father was without His Son.',
    },
    {
      q: "Arius's friends would agree to any Bible phrase and then explain it their own way. Which word did the council choose to make the meaning clear?",
      options: [
        { text: '"Consubstantial" (homoousios): one in being with the Father.', correct: true },
        { text: '"Similar" (homoios): like the Father in some ways.' },
        { text: '"Made" (poiema): created by the Father.' },
      ],
      why: '"Homoousios" means the Son is the same divine being as the Father. At Mass we say He is "consubstantial with the Father".',
    },
    {
      q: 'Which Bible verse shows best that the Son is truly God?',
      options: [
        { text: '"In the beginning was the Word, and the Word was with God, and the Word was God." (John 1:1)', correct: true },
        { text: '"The Lord created me at the beginning of his work." (Proverbs 8:22)' },
        { text: '"Jesus grew in wisdom and in stature." (Luke 2:52)' },
      ],
      why: 'Arius used Proverbs 8:22, but it speaks of Wisdom in poetry. St. John says plainly that the Word, the Son, is God.',
    },
  ],

  // After the questions, back in the hall.
  outcome: [
    { who: 'narrator', action: 'cheer', text: 'Almost every bishop signs the Creed. Only two refuse.' },
    { who: 'narrator', action: 'exit:arius', text: 'Arius will not sign, so the Emperor sends him into exile.' },
    { who: 'emperor', text: 'And from now on, all Christians will celebrate Easter together, on the same Sunday!' },
  ],

  creed: [
    'I believe in one God, the Father almighty, maker of heaven and earth, of all things visible and invisible.',
    'I believe in one Lord Jesus Christ, the Only Begotten Son of God, born of the Father before all ages.',
    'God from God, Light from Light, true God from true God, begotten, not made, consubstantial with the Father; through him all things were made.',
  ],
};
