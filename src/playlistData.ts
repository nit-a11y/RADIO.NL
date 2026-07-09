export interface Track {
  id: string; // generated client-side or retrieved from YouTube
  title: string;
  artist: string;
  searchQuery: string;
}

export interface Act {
  number: number;
  name: string;
  emoji: string;
  tracks: Track[];
}

export const playlistData: Act[] = [
  {
    number: 1,
    name: "Classic Rock & Hard Rock",
    emoji: "🎸",
    tracks: [
      { id: "", title: "T.N.T.", artist: "AC/DC", searchQuery: "AC/DC - T.N.T." },
      { id: "", title: "Fly Away From Here", artist: "Aerosmith", searchQuery: "Aerosmith - Fly Away From Here" },
      { id: "", title: "Paranoid", artist: "Black Sabbath", searchQuery: "Black Sabbath - Paranoid" },
      { id: "", title: "Always", artist: "Bon Jovi", searchQuery: "Bon Jovi - Always" },
      { id: "", title: "It’s My Life", artist: "Bon Jovi", searchQuery: "Bon Jovi - It’s My Life" },
      { id: "", title: "Livin' On A Prayer", artist: "Bon Jovi", searchQuery: "Bon Jovi - Livin' On A Prayer" },
      { id: "", title: "Misunderstood", artist: "Bon Jovi", searchQuery: "Bon Jovi - Misunderstood" },
      { id: "", title: "Total Eclipse of the Heart", artist: "Bonnie Tyler", searchQuery: "Bonnie Tyler - Total Eclipse of the Heart" },
      { id: "", title: "Sultans of Swing", artist: "Dire Straits", searchQuery: "Dire Straits - Sultans of Swing" },
      { id: "", title: "Hotel California", artist: "Eagles", searchQuery: "Eagles - Hotel California" },
      { id: "", title: "November Rain", artist: "Guns N' Roses", searchQuery: "Guns N' Roses - November Rain" },
      { id: "", title: "Sweet Child O’ Mine", artist: "Guns N' Roses", searchQuery: "Guns N' Roses - Sweet Child O’ Mine" },
      { id: "", title: "Welcome to the Jungle", artist: "Guns N' Roses", searchQuery: "Guns N' Roses - Welcome to the Jungle" },
      { id: "", title: "Carry On Wayward Son", artist: "Kansas", searchQuery: "Kansas - Carry On Wayward Son" },
      { id: "", title: "I Was Made For Lovin' You", artist: "Kiss", searchQuery: "Kiss - I Was Made For Lovin' You" },
      { id: "", title: "Black Dog", artist: "Led Zeppelin", searchQuery: "Led Zeppelin - Black Dog" },
      { id: "", title: "Love Hurts", artist: "Nazareth", searchQuery: "Nazareth - Love Hurts" },
      { id: "", title: "Eye Of The Tiger", artist: "Survivor", searchQuery: "Survivor - Eye Of The Tiger" }
    ]
  },
  {
    number: 2,
    name: "Heavy Metal, Power & Progressive Metal",
    emoji: "⚡",
    tracks: [
      { id: "", title: "Stand Away", artist: "Angra", searchQuery: "Angra - Stand Away" },
      { id: "", title: "Through the Fire and Flames", artist: "DragonForce", searchQuery: "DragonForce - Through the Fire and Flames" },
      { id: "", title: "The Reason of Your Conviction", artist: "Hangar", searchQuery: "Hangar - The Reason of Your Conviction" },
      { id: "", title: "Fear of the Dark", artist: "Iron Maiden", searchQuery: "Iron Maiden - Fear of the Dark" },
      { id: "", title: "Master of Puppets", artist: "Metallica", searchQuery: "Metallica - Master of Puppets" }
    ]
  },
  {
    number: 3,
    name: "Nu Metal, Alternative Metal & Post-Hardcore",
    emoji: "🖤",
    tracks: [
      { id: "", title: "The Kill", artist: "30 Seconds To Mars", searchQuery: "30 Seconds To Mars - The Kill" },
      { id: "", title: "Hand of Blood", artist: "Bullet For My Valentine", searchQuery: "Bullet For My Valentine - Hand of Blood" },
      { id: "", title: "Tears Don't Fall", artist: "Bullet For My Valentine", searchQuery: "Bullet For My Valentine - Tears Don't Fall" },
      { id: "", title: "Bodies", artist: "Drowning Pool", searchQuery: "Drowning Pool - Bodies" },
      { id: "", title: "Bring Me to Life", artist: "Evanescence", searchQuery: "Evanescence - Bring Me to Life" },
      { id: "", title: "God Is A Weapon", artist: "Falling In Reverse", searchQuery: "Falling In Reverse - God Is A Weapon" },
      { id: "", title: "Ronald", artist: "Falling In Reverse", searchQuery: "Falling In Reverse - Ronald" },
      { id: "", title: "Watch the World Burn", artist: "Falling In Reverse", searchQuery: "Falling In Reverse - Watch the World Burn" },
      { id: "", title: "Freak on a Leash", artist: "Korn", searchQuery: "Korn - Freak on a Leash" },
      { id: "", title: "Given Up", artist: "Linkin Park", searchQuery: "Linkin Park - Given Up" },
      { id: "", title: "In The End", artist: "Linkin Park", searchQuery: "Linkin Park - In The End" },
      { id: "", title: "Numb", artist: "Linkin Park", searchQuery: "Linkin Park - Numb" },
      { id: "", title: "What I’ve Done", artist: "Linkin Park", searchQuery: "Linkin Park - What I’ve Done" },
      { id: "", title: "Killing in the Name", artist: "Rage Against The Machine", searchQuery: "Rage Against The Machine - Killing in the Name" },
      { id: "", title: "Duality", artist: "Slipknot", searchQuery: "Slipknot - Duality" },
      { id: "", title: "Aerials", artist: "System of a Down", searchQuery: "System of a Down - Aerials" },
      { id: "", title: "B.Y.O.B.", artist: "System of a Down", searchQuery: "System of a Down - B.Y.O.B." },
      { id: "", title: "Chop Suey!", artist: "System of a Down", searchQuery: "System of a Down - Chop Suey!" },
      { id: "", title: "Sugar", artist: "System of a Down", searchQuery: "System of a Down - Sugar" },
      { id: "", title: "Toxicity", artist: "System of a Down", searchQuery: "System of a Down - Toxicity" }
    ]
  },
  {
    number: 4,
    name: "Extreme Metal, Industrial & Folk Metal",
    emoji: "☠️",
    tracks: [
      { id: "", title: "Keine Lust", artist: "Rammstein", searchQuery: "Rammstein - Keine Lust" },
      { id: "", title: "Bratva", artist: "Slaughter To Prevail", searchQuery: "Slaughter To Prevail - Bratva" },
      { id: "", title: "Wolf Totem", artist: "The Hu", searchQuery: "The Hu - Wolf Totem" },
      { id: "", title: "In Waves", artist: "Trivium", searchQuery: "Trivium - In Waves" }
    ]
  },
  {
    number: 5,
    name: "Grunge, Indie & Alternative Rock",
    emoji: "🛸",
    tracks: [
      { id: "", title: "505", artist: "Arctic Monkeys", searchQuery: "Arctic Monkeys - 505" },
      { id: "", title: "Like a Stone", artist: "Audioslave", searchQuery: "Audioslave - Like a Stone" },
      { id: "", title: "One Last Breath", artist: "Creed", searchQuery: "Creed - One Last Breath" },
      { id: "", title: "Clint Eastwood", artist: "Gorillaz", searchQuery: "Gorillaz - Clint Eastwood" },
      { id: "", title: "Dare", artist: "Gorillaz", searchQuery: "Gorillaz - Dare" },
      { id: "", title: "Feel Good Inc.", artist: "Gorillaz", searchQuery: "Gorillaz - Feel Good Inc." },
      { id: "", title: "19-2000", artist: "Gorillaz", searchQuery: "Gorillaz - 19-2000" },
      { id: "", title: "Evil", artist: "Interpol", searchQuery: "Interpol - Evil" },
      { id: "", title: "Beggin'", artist: "Måneskin", searchQuery: "Måneskin - Beggin'" },
      { id: "", title: "Hysteria", artist: "Muse", searchQuery: "Muse - Hysteria" },
      { id: "", title: "Come as You Are", artist: "Nirvana", searchQuery: "Nirvana - Come as You Are" },
      { id: "", title: "Smells Like Teen Spirit", artist: "Nirvana", searchQuery: "Nirvana - Smells Like Teen Spirit" },
      { id: "", title: "Wonderwall", artist: "Oasis", searchQuery: "Oasis - Wonderwall" },
      { id: "", title: "Bohemian Rhapsody", artist: "Queen", searchQuery: "Queen - Bohemian Rhapsody" },
      { id: "", title: "Creep", artist: "Radiohead", searchQuery: "Radiohead - Creep" },
      { id: "", title: "Californication", artist: "Red Hot Chili Peppers", searchQuery: "Red Hot Chili Peppers - Californication" },
      { id: "", title: "Can't Stop", artist: "Red Hot Chili Peppers", searchQuery: "Red Hot Chili Peppers - Can't Stop" },
      { id: "", title: "Iris", artist: "The Goo Goo Dolls", searchQuery: "The Goo Goo Dolls - Iris" },
      { id: "", title: "New Year's Day", artist: "U2", searchQuery: "U2 - New Year's Day" }
    ]
  },
  {
    number: 6,
    name: "Pop Punk & Emo",
    emoji: "🛹",
    tracks: [
      { id: "", title: "Wish You Were Here", artist: "Avril Lavigne", searchQuery: "Avril Lavigne - Wish You Were Here" },
      { id: "", title: "First Date", artist: "Blink-182", searchQuery: "Blink-182 - First Date" },
      { id: "", title: "I Miss You", artist: "Blink-182", searchQuery: "Blink-182 - I Miss You" },
      { id: "", title: "Centuries", artist: "Fall Out Boy", searchQuery: "Fall Out Boy - Centuries" },
      { id: "", title: "Can't Repeat", artist: "The Offspring", searchQuery: "The Offspring - Can't Repeat" }
    ]
  },
  {
    number: 7,
    name: "Rock Nacional & Pop Rock BR",
    emoji: "🇧🇷",
    tracks: [
      { id: "", title: "Só Por Uma Noite", artist: "Charlie Brown Jr.", searchQuery: "Charlie Brown Jr. - Só Por Uma Noite" },
      { id: "", title: "Zóio de Lula", artist: "Charlie Brown Jr.", searchQuery: "Charlie Brown Jr. - Zóio de Lula" },
      { id: "", title: "Um Minuto Para o Fim do Mundo", artist: "CPM 22", searchQuery: "CPM 22 - Um Minuto Para o Fim do Mundo" },
      { id: "", title: "Ela é Demais", artist: "Detonautas", searchQuery: "Detonautas - Ela é Demais" },
      { id: "", title: "1x0 Eu", artist: "Dibob", searchQuery: "Dibob - 1x0 Eu" },
      { id: "", title: "Sigo o Som", artist: "Forfun", searchQuery: "Forfun - Sigo o Som" },
      { id: "", title: "Pais e Filhos", artist: "Legião Urbana", searchQuery: "Legião Urbana - Pais e Filhos" },
      { id: "", title: "1408", artist: "Mamonas Assassinas", searchQuery: "Mamonas Assassinas - 1406" }, // searchQuery set to famous 1406
      { id: "", title: "Razões e Emoções", artist: "NX Zero", searchQuery: "NX Zero - Razões e Emoções" },
      { id: "", title: "Admirável Chip Novo", artist: "Pitty", searchQuery: "Pitty - Admirável Chip Novo" },
      { id: "", title: "Me Adora", artist: "Pitty", searchQuery: "Pitty - Me Adora" },
      { id: "", title: "A Mais Pedida", artist: "Raimundos", searchQuery: "Raimundos - A Mais Pedida" },
      { id: "", title: "Mulher de Fases", artist: "Raimundos", searchQuery: "Raimundos - Mulher de Fases" },
      { id: "", title: "Medo da Chuva", artist: "Raul Seixas", searchQuery: "Raul Seixas - Medo da Chuva" }
    ]
  },
  {
    number: 8,
    name: "Rock Cristão Nacional",
    emoji: "🙏",
    tracks: [
      { id: "", title: "Depois da Guerra", artist: "Oficina G3", searchQuery: "Oficina G3 - Depois da Guerra" },
      { id: "", title: "Meus Próprios Meios", artist: "Oficina G3", searchQuery: "Oficina G3 - Meus Próprios Meios" }
    ]
  }
];
