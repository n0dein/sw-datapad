/* Lore + prompts for the SW5e Datapad.
 *
 * Rule for this file: everything here is non-mechanical flavor, and it is
 * limited to material from current canon (films, series, canon books/games).
 * Nothing here changes or replaces any SW5e rule; rules data lives in data.js.
 *
 * Aurebesh letter names/order follow Wookieepedia's canon Aurebesh entries.
 * Canon calls the SH letter "Sen" (the Legends-era name was "Shen").
 */
window.LORE = {
  aurabesh: [
    { n: 'Aurek', en: 'A' }, { n: 'Besh', en: 'B' }, { n: 'Cresh', en: 'C' },
    { n: 'Cherek', en: 'CH', di: true }, { n: 'Dorn', en: 'D' }, { n: 'Esk', en: 'E' },
    { n: 'Enth', en: 'Æ', di: true, type: 'ae' }, { n: 'Onith', en: 'EO', di: true },
    { n: 'Forn', en: 'F' }, { n: 'Grek', en: 'G' }, { n: 'Herf', en: 'H' },
    { n: 'Isk', en: 'I' }, { n: 'Jenth', en: 'J' }, { n: 'Krill', en: 'K' },
    { n: 'Krenth', en: 'KH', di: true }, { n: 'Leth', en: 'L' }, { n: 'Mern', en: 'M' },
    { n: 'Nern', en: 'N' }, { n: 'Nen', en: 'NG', di: true }, { n: 'Osk', en: 'O' },
    { n: 'Orenth', en: 'OO', di: true }, { n: 'Peth', en: 'P' }, { n: 'Qek', en: 'Q' },
    { n: 'Resh', en: 'R' }, { n: 'Senth', en: 'S' }, { n: 'Sen', en: 'SH', di: true },
    { n: 'Trill', en: 'T' }, { n: 'Thesh', en: 'TH', di: true }, { n: 'Usk', en: 'U' },
    { n: 'Vev', en: 'V' }, { n: 'Wesk', en: 'W' }, { n: 'Xesh', en: 'X' },
    { n: 'Yirt', en: 'Y' }, { n: 'Zerek', en: 'Z' }
  ],

  /* Words. Canon only: every entry here is current canon.
     Meanings follow Wookieepedia's Huttese and Mando'a articles and word pages. */
  glossary: [
    {"w": "Kriff", "lang": "Basic", "tags": ["Curse"], "cont": "canon", "mean": "All-purpose profanity.", "note": "Common forms: kriffing, kriffed, kriff off, kriff it."},
    {"w": "Kark", "lang": "Basic", "tags": ["Curse"], "cont": "canon", "mean": "A rough expletive, in the same family as kriff.", "note": "Common form: karking."},
    {"w": "Dank farrik", "lang": "Basic", "tags": ["Curse", "Exclamation"], "cont": "canon", "mean": "Exclamation of frustration; often shortened to \"dank.\"", "note": "Often shortened to \"dank.\""},
    {"w": "Stang", "lang": "Basic", "tags": ["Curse"], "cont": "canon", "mean": "A mild expletive of frustration.", "note": ""},
    {"w": "Karabast", "lang": "Lasat", "tags": ["Exclamation"], "cont": "canon", "mean": "A Lasat exclamation of surprise or frustration.", "note": ""},
    {"w": "Clanker", "lang": "Basic", "tags": ["Insult", "Droids"], "cont": "canon", "mean": "Derogatory slang for droids, most famously battle droids.", "note": "Named for the clanking of droid joints."},
    {"w": "Nerf herder", "lang": "Basic", "tags": ["Insult"], "cont": "canon", "mean": "A put-down; literally someone who herds nerfs.", "note": ""},
    {"w": "Womp rat", "lang": "Basic", "tags": ["Idiom", "Creature"], "cont": "canon", "mean": "A pest creature of Tatooine, also used in an idiom.", "note": "Also used in the saying \"more than one way to skin a womp rat.\""},
    {"w": "Poodoo", "lang": "Huttese", "tags": ["Curse"], "cont": "canon", "mean": "Huttese swear word; translates to \"fodder.\"", "note": "\"Bantha poodoo\" means \"bantha fodder.\""},
    {"w": "Sleemo", "lang": "Huttese", "tags": ["Insult"], "cont": "canon", "mean": "Slimeball; a low, untrustworthy person.", "note": ""},
    {"w": "Chuba", "lang": "Huttese", "tags": ["Greeting"], "cont": "canon", "mean": "\"Hey, you.\"", "note": ""},
    {"w": "H'chu apenkee", "lang": "Huttese", "tags": ["Greeting"], "cont": "canon", "mean": "\"Hello.\"", "note": ""},
    {"w": "Pateesa", "lang": "Huttese", "tags": ["Greeting"], "cont": "canon", "mean": "\"Friend.\"", "note": ""},
    {"w": "Mee jewz ju", "lang": "Huttese", "tags": ["Farewell"], "cont": "canon", "mean": "\"Goodbye.\"", "note": ""},
    {"w": "Moulee-rah", "lang": "Huttese", "tags": ["Money"], "cont": "canon", "mean": "\"Money.\"", "note": ""},
    {"w": "Boska", "lang": "Huttese", "tags": ["Command"], "cont": "canon", "mean": "\"Let's go.\"", "note": ""},
    {"w": "Bo", "lang": "Huttese", "tags": ["Numbers"], "cont": "canon", "mean": "\"One.\"", "note": ""},
    {"w": "Dopa", "lang": "Huttese", "tags": ["Numbers"], "cont": "canon", "mean": "\"Two.\"", "note": ""},
    {"w": "Echuta", "lang": "Huttese", "tags": ["Insult", "Greeting"], "cont": "canon", "mean": "Meaning varies by source.", "note": "Meaning shifts with context: \"hey\" in some uses, an insult in others."},
    {"w": "Fierfek", "lang": "Huttese", "tags": ["Curse"], "cont": "canon", "mean": "A curse word.", "note": "Best known as a clone commando curse."},
    {"w": "Sithspit", "lang": "Basic", "tags": ["Curse"], "cont": "canon", "mean": "A Corellian-flavored curse.", "note": ""},
    {"w": "Sha'kajir", "lang": "Mando'a", "tags": ["Command", "Mandalorian"], "cont": "canon", "mean": "Roughly \"cease fire.\"", "note": ""},
    {"w": "Arumorut", "lang": "Mando'a", "tags": ["Phrase", "Mandalorian"], "cont": "canon", "mean": "\"Home away from home.\"", "note": ""},
    {"w": "Dikutruni", "lang": "Mando'a", "tags": ["Phrase", "Mandalorian"], "cont": "canon", "mean": "\"Soul of the fool.\"", "note": ""},
    {"w": "Crik", "lang": "Basic", "tags": ["Curse"], "cont": "canon", "mean": "A swear word.", "note": "Forms: crikk, crikking."},
    {"w": "Crink", "lang": "Basic", "tags": ["Curse"], "cont": "canon", "mean": "An expletive.", "note": "Forms: crink it, crinking."},
    {"w": "Fark", "lang": "Basic", "tags": ["Curse"], "cont": "canon", "mean": "An expletive.", "note": ""},
    {"w": "Flark", "lang": "Basic", "tags": ["Curse"], "cont": "canon", "mean": "An expletive.", "note": ""},
    {"w": "Frag", "lang": "Basic", "tags": ["Curse"], "cont": "canon", "mean": "Slang for disappointment or rage; also an intensifier.", "note": "Forms: fragging, frag it, frag-head."},
    {"w": "Krik", "lang": "Basic", "tags": ["Curse"], "cont": "canon", "mean": "An intensifier.", "note": ""},
    {"w": "Krit", "lang": "Basic", "tags": ["Curse"], "cont": "canon", "mean": "An expletive.", "note": ""},
    {"w": "Pfassk", "lang": "Basic", "tags": ["Curse"], "cont": "canon", "mean": "An adaptable expletive.", "note": "Forms: pfassk it, thank pfassk."},
    {"w": "Varp", "lang": "Basic", "tags": ["Curse"], "cont": "canon", "mean": "Frustration or surprise; also an intensifier.", "note": "Forms: what the varp, varped."},
    {"w": "Void", "lang": "Basic", "tags": ["Curse"], "cont": "canon", "mean": "An expression of frustration.", "note": ""},
    {"w": "Scob", "lang": "Narkinian", "tags": ["Curse"], "cont": "canon", "mean": "An expletive used to denounce someone or something.", "note": "Form: scobbing."},
    {"w": "Shukking", "lang": "Basic", "tags": ["Curse"], "cont": "canon", "mean": "An expletive.", "note": ""},
    {"w": "Druk", "lang": "Basic", "tags": ["Curse", "Exclamation"], "cont": "canon", "mean": "An exclamation of frustration; also nonsense.", "note": "A drukhole is an unpleasant place."},
    {"w": "Schutta", "lang": "Basic", "tags": ["Curse", "Insult"], "cont": "canon", "mean": "A swear word or insult.", "note": ""},
    {"w": "Fratz", "lang": "Basic", "tags": ["Exclamation"], "cont": "canon", "mean": "An exclamation of frustration.", "note": ""},
    {"w": "Dosh", "lang": "Basic", "tags": ["Curse"], "cont": "canon", "mean": "An expletive of anger.", "note": "Also informal for currency."},
    {"w": "Frost", "lang": "Basic", "tags": ["Curse"], "cont": "canon", "mean": "A general-purpose expletive among native workers on Mokivj.", "note": ""},
    {"w": "Esehigi", "lang": "Basic", "tags": ["Curse"], "cont": "canon", "mean": "A curse from the Mokivj system.", "note": ""},
    {"w": "Maker", "lang": "Basic", "tags": ["Exclamation", "Droids"], "cont": "canon", "mean": "A droid's word for a creator, used like \"god.\"", "note": "As in C-3PO's \"thank the Maker.\""},
    {"w": "Blast", "lang": "Basic", "tags": ["Exclamation"], "cont": "canon", "mean": "An exclamation of frustration.", "note": "Forms: blast it, blaster bolts."},
    {"w": "Blasted", "lang": "Basic", "tags": ["Curse"], "cont": "canon", "mean": "An intensifier of annoyance.", "note": "As in \"get that blasted door open.\""},
    {"w": "Sands", "lang": "Basic", "tags": ["Exclamation"], "cont": "canon", "mean": "A general exclamation on Canto Bight.", "note": ""},
    {"w": "Stars", "lang": "Basic", "tags": ["Exclamation"], "cont": "canon", "mean": "A general exclamation of frustration or excitement.", "note": "Forms: oh stars, stars above."},
    {"w": "Sithspawn", "lang": "Basic", "tags": ["Exclamation", "Insult"], "cont": "canon", "mean": "An exclamation or insult.", "note": ""},
    {"w": "Snogwash", "lang": "Basic", "tags": ["Exclamation"], "cont": "canon", "mean": "An expression of disbelief in what someone said.", "note": ""},
    {"w": "Utinni", "lang": "Jawa", "tags": ["Exclamation"], "cont": "canon", "mean": "A Jawa call, roughly \"come here!\"", "note": ""},
    {"w": "Gasket-thrusters", "lang": "Basic", "tags": ["Exclamation"], "cont": "canon", "mean": "An exclamation of frustration.", "note": ""},
    {"w": "Vatstu", "lang": "Neimoidian", "tags": ["Curse"], "cont": "canon", "mean": "An expletive.", "note": ""},
    {"w": "Peedunky", "lang": "Huttese", "tags": ["Insult"], "cont": "canon", "mean": "Roughly \"punk.\"", "note": ""},
    {"w": "Kung", "lang": "Huttese", "tags": ["Insult"], "cont": "canon", "mean": "\"Scum.\"", "note": ""},
    {"w": "Skug", "lang": "Zygerrian", "tags": ["Insult"], "cont": "canon", "mean": "A common insult.", "note": ""},
    {"w": "Skughead", "lang": "Basic", "tags": ["Insult"], "cont": "canon", "mean": "An insult.", "note": ""},
    {"w": "Monong", "lang": "Basic", "tags": ["Insult"], "cont": "canon", "mean": "An insult aimed at Wookiees.", "note": ""},
    {"w": "Murglak", "lang": "Basic", "tags": ["Insult"], "cont": "canon", "mean": "An insult.", "note": ""},
    {"w": "Nerko", "lang": "Basic", "tags": ["Insult"], "cont": "canon", "mean": "An insult.", "note": ""},
    {"w": "Krinnan", "lang": "Basic", "tags": ["Insult"], "cont": "canon", "mean": "An insult.", "note": ""},
    {"w": "Fyrnock", "lang": "Basic", "tags": ["Insult"], "cont": "canon", "mean": "An insult.", "note": ""},
    {"w": "Bollychop", "lang": "Basic", "tags": ["Insult"], "cont": "canon", "mean": "An insult.", "note": ""},
    {"w": "Moof", "lang": "Basic", "tags": ["Insult"], "cont": "canon", "mean": "An insult.", "note": "Forms: moof brain, moof-milker."},
    {"w": "Fexsnatcher", "lang": "Basic", "tags": ["Insult"], "cont": "canon", "mean": "An insult.", "note": ""},
    {"w": "Purfmurker", "lang": "Basic", "tags": ["Insult"], "cont": "canon", "mean": "An insult.", "note": ""},
    {"w": "Rooknik", "lang": "Basic", "tags": ["Insult"], "cont": "canon", "mean": "An insult.", "note": ""},
    {"w": "Svaper", "lang": "Basic", "tags": ["Insult"], "cont": "canon", "mean": "An insult.", "note": ""},
    {"w": "Mudscuffer", "lang": "Basic", "tags": ["Insult"], "cont": "canon", "mean": "An insult.", "note": ""},
    {"w": "Drydak", "lang": "Basic", "tags": ["Insult"], "cont": "canon", "mean": "A stupid person.", "note": ""},
    {"w": "Gashead", "lang": "Basic", "tags": ["Insult"], "cont": "canon", "mean": "A stupid person.", "note": ""},
    {"w": "Snod", "lang": "Narkinian", "tags": ["Slang"], "cont": "canon", "mean": "Something of no value.", "note": "\"Care not a snod\" means not caring at all."},
    {"w": "Rankweed", "lang": "Basic", "tags": ["Insult"], "cont": "canon", "mean": "An insult for a traitor.", "note": ""},
    {"w": "Hutt spawn", "lang": "Basic", "tags": ["Insult"], "cont": "canon", "mean": "An insult.", "note": "Adjective: Hutt-spawned."},
    {"w": "Hydrosnake", "lang": "Basic", "tags": ["Insult"], "cont": "canon", "mean": "An insult.", "note": ""},
    {"w": "Laserbrain", "lang": "Basic", "tags": ["Insult"], "cont": "canon", "mean": "A foolish person.", "note": ""},
    {"w": "Chipbrain", "lang": "Basic", "tags": ["Insult", "Droids"], "cont": "canon", "mean": "An insult aimed at a droid.", "note": ""},
    {"w": "Bucketbrain", "lang": "Basic", "tags": ["Insult"], "cont": "canon", "mean": "An insult for stormtroopers, after their helmets.", "note": "Also: buckethead."},
    {"w": "Bolt bucket", "lang": "Basic", "tags": ["Insult", "Droids"], "cont": "canon", "mean": "A derogatory word for a droid.", "note": ""},
    {"w": "Tin bin", "lang": "Basic", "tags": ["Slang", "Droids"], "cont": "canon", "mean": "A term for droids.", "note": ""},
    {"w": "Tinnies", "lang": "Basic", "tags": ["Slang", "Clones", "Droids"], "cont": "canon", "mean": "Slang for droids, common among clone troopers.", "note": ""},
    {"w": "Meatbag", "lang": "Basic", "tags": ["Insult", "Droids"], "cont": "canon", "mean": "Slang droids sometimes use for organics.", "note": ""},
    {"w": "Organ sack", "lang": "Basic", "tags": ["Insult", "Droids"], "cont": "canon", "mean": "A droid's derogatory word for an organic.", "note": ""},
    {"w": "Metalhead", "lang": "Basic", "tags": ["Slang", "Droids"], "cont": "canon", "mean": "A droid.", "note": ""},
    {"w": "Bantha dung", "lang": "Basic", "tags": ["Insult"], "cont": "canon", "mean": "Something or someone worthy of contempt; also worthless.", "note": ""},
    {"w": "Bantha poodoo", "lang": "Huttese", "tags": ["Insult"], "cont": "canon", "mean": "Literally \"bantha fodder\": worthless; also nonsense.", "note": ""},
    {"w": "Krayt spit", "lang": "Basic", "tags": ["Insult"], "cont": "canon", "mean": "Nonsense, especially nonsense the speaker knows is nonsense.", "note": ""},
    {"w": "Shiny", "lang": "Basic", "tags": ["Slang", "Clones"], "cont": "canon", "mean": "Clone trooper slang for a rookie.", "note": ""},
    {"w": "Reg", "lang": "Basic", "tags": ["Slang", "Clones"], "cont": "canon", "mean": "Slang for a regular clone trooper.", "note": ""},
    {"w": "Popper", "lang": "Basic", "tags": ["Slang", "Clones"], "cont": "canon", "mean": "Clone trooper slang for a grenade.", "note": ""},
    {"w": "Rollies", "lang": "Basic", "tags": ["Slang", "Clones", "Droids"], "cont": "canon", "mean": "Clone slang for droidekas; also a BB-series astromech.", "note": ""},
    {"w": "Seppies", "lang": "Basic", "tags": ["Slang", "Clones"], "cont": "canon", "mean": "Slang for Separatists during the Clone Wars.", "note": ""},
    {"w": "Seps", "lang": "Basic", "tags": ["Slang", "Military"], "cont": "canon", "mean": "Slang for Separatists in the Imperial era.", "note": ""},
    {"w": "Killbox", "lang": "Basic", "tags": ["Military"], "cont": "canon", "mean": "A trap that leads a force into an ambush.", "note": ""},
    {"w": "Imp", "lang": "Basic", "tags": ["Slang", "Military"], "cont": "canon", "mean": "Slang for Imperial.", "note": ""},
    {"w": "Reb", "lang": "Basic", "tags": ["Slang", "Military"], "cont": "canon", "mean": "Imperial slang for members of the Rebel Alliance.", "note": ""},
    {"w": "Impstar", "lang": "Basic", "tags": ["Slang", "Military"], "cont": "canon", "mean": "TIE pilot slang for an Imperial Star Destroyer.", "note": ""},
    {"w": "Eyeball", "lang": "Basic", "tags": ["Slang", "Military"], "cont": "canon", "mean": "A TIE fighter, to the Rebellion and Resistance.", "note": ""},
    {"w": "Graysuit", "lang": "Basic", "tags": ["Slang", "Military"], "cont": "canon", "mean": "Stormtrooper slang for an Imperial officer.", "note": ""},
    {"w": "Bucket", "lang": "Basic", "tags": ["Slang", "Military"], "cont": "canon", "mean": "A stormtrooper helmet.", "note": ""},
    {"w": "Mounties", "lang": "Basic", "tags": ["Slang", "Military"], "cont": "canon", "mean": "Stormtroopers who ride mounts such as dewbacks.", "note": ""},
    {"w": "Brainscrape", "lang": "Basic", "tags": ["Military"], "cont": "canon", "mean": "The reconditioning of First Order stormtroopers.", "note": ""},
    {"w": "Spacer", "lang": "Basic", "tags": ["Slang"], "cont": "canon", "mean": "Someone who spends much of their life in space.", "note": ""},
    {"w": "Topsider", "lang": "Basic", "tags": ["Slang"], "cont": "canon", "mean": "Someone privileged to live on Coruscant's upper levels.", "note": ""},
    {"w": "Dirtball", "lang": "Basic", "tags": ["Slang"], "cont": "canon", "mean": "A planet one dislikes.", "note": ""},
    {"w": "Coreward", "lang": "Basic", "tags": ["Direction"], "cont": "canon", "mean": "Toward the galactic core.", "note": ""},
    {"w": "Rimward", "lang": "Basic", "tags": ["Direction"], "cont": "canon", "mean": "Toward the galactic rim, away from the core.", "note": ""},
    {"w": "Spinward", "lang": "Basic", "tags": ["Direction"], "cont": "canon", "mean": "The direction the galaxy rotates.", "note": ""},
    {"w": "Ronin", "lang": "Basic", "tags": ["Jedi"], "cont": "canon", "mean": "A Force sensitive who once belonged to the Jedi Order and now follows their own path.", "note": ""},
    {"w": "Saber-twirler", "lang": "Basic", "tags": ["Jedi", "Insult"], "cont": "canon", "mean": "A nickname for a Jedi.", "note": ""},
    {"w": "Force-botherer", "lang": "Basic", "tags": ["Jedi", "Insult"], "cont": "canon", "mean": "A teasing name for a Jedi.", "note": ""},
    {"w": "Youngling", "lang": "Basic", "tags": ["Jedi"], "cont": "canon", "mean": "A child, a term often used by the Jedi.", "note": ""},
    {"w": "Bombad", "lang": "Gungan", "tags": ["Slang"], "cont": "canon", "mean": "A superlative; really cool.", "note": ""},
    {"w": "Sync", "lang": "Basic", "tags": ["Slang"], "cont": "canon", "mean": "Younglings' slang for cool or fitting.", "note": ""},
    {"w": "Choobies", "lang": "Basic", "tags": ["Slang"], "cont": "canon", "mean": "Slang for courage and confidence.", "note": "Also a crude body term."},
    {"w": "Creds", "lang": "Basic", "tags": ["Money"], "cont": "canon", "mean": "Colloquial for credits.", "note": ""},
    {"w": "Decs", "lang": "Basic", "tags": ["Money"], "cont": "canon", "mean": "Colloquial for credits.", "note": ""},
    {"w": "Toolie", "lang": "Basic", "tags": ["Slang"], "cont": "canon", "mean": "A mechanic.", "note": ""},
    {"w": "Number-squinter", "lang": "Basic", "tags": ["Slang"], "cont": "canon", "mean": "A bureaucrat who counts for tax purposes.", "note": ""},
    {"w": "Goldenrod", "lang": "Basic", "tags": ["Slang", "Droids"], "cont": "canon", "mean": "A gold-plated protocol droid.", "note": ""},
    {"w": "Spice", "lang": "Basic", "tags": ["Slang"], "cont": "canon", "mean": "A dangerous narcotic mined on Kessel.", "note": ""},
    {"w": "Spicehead", "lang": "Basic", "tags": ["Slang"], "cont": "canon", "mean": "A spice addict.", "note": ""},
    {"w": "Pronto ronto", "lang": "Basic", "tags": ["Slang"], "cont": "canon", "mean": "Promptly, quickly.", "note": ""},
    {"w": "Spaced", "lang": "Basic", "tags": ["Slang"], "cont": "canon", "mean": "Dead or killed.", "note": ""},
    {"w": "Neurowashed", "lang": "Basic", "tags": ["Droids"], "cont": "canon", "mean": "Forcibly indoctrinated to believe something; used about droids.", "note": ""},
    {"w": "The Way", "lang": "Basic", "tags": ["Mandalorian"], "cont": "canon", "mean": "The Way of the Mandalore.", "note": ""},
    {"w": "Chobasa", "lang": "Basic", "tags": ["Greeting"], "cont": "canon", "mean": "A toast.", "note": "Reply: choba."},
    {"w": "Sagrona", "lang": "Basic", "tags": ["Greeting"], "cont": "canon", "mean": "A traditional Chandrilan toast.", "note": ""}
  ],

  /* Worlds that appear on screen in canon films and series. Not exhaustive.
     Every character can also write in any other world. */
  planets: [
    'Alderaan', 'Batuu', 'Bespin', 'Cantonica', 'Christophsis', 'Coruscant', 'Corellia',
    'Crait', 'Dagobah', 'Dathomir', 'Endor', 'Exegol', 'Felucia', 'Geonosis', 'Hoth',
    'Jakku', 'Jedha', 'Kamino', 'Kashyyyk', 'Kessel', 'Lothal', 'Malachor', 'Mandalore',
    'Mon Cala', 'Mustafar', 'Mygeeto', 'Naboo', 'Nevarro', 'Onderon', 'Ord Mantell',
    'Ryloth', 'Saleucami', 'Scarif', 'Takodana', 'Tatooine', 'Umbara', 'Utapau',
    'Yavin 4', 'Zeffo'
  ],

  /* Short Holopedia entries for each world. Facts are limited to what canon films and series show. */
  planetInfo: {
    "Alderaan": {
      "about": "A peaceful, mountainous Core World known for its culture, learning and the Organa family. The Death Star destroyed it.",
      "places": [
        "Aldera (capital)"
      ]
    },
    "Batuu": {
      "about": "A remote Outer Rim world of petrified forest spires, on the edge of Wild Space. A haven for smugglers and travelers.",
      "places": [
        "Black Spire Outpost",
        "Oga's Cantina",
        "Docking Bay 7"
      ]
    },
    "Bespin": {
      "about": "A gas giant where tibanna gas is mined from floating platforms in its breathable cloud layer.",
      "places": [
        "Cloud City"
      ]
    },
    "Cantonica": {
      "about": "A desert planet whose one luxury city draws the galaxy's wealthy and its war profiteers.",
      "places": [
        "Canto Bight"
      ]
    },
    "Christophsis": {
      "about": "A crystalline world and a Clone Wars battleground, with cities built from shining crystal.",
      "places": []
    },
    "Coruscant": {
      "about": "A planet-wide city and the galactic capital, layered from gleaming upper levels down to a dangerous underworld.",
      "places": [
        "Galactic Senate Building",
        "Jedi Temple",
        "Imperial Palace"
      ]
    },
    "Corellia": {
      "about": "A Core World famous for its shipyards. Han Solo grew up here.",
      "places": [
        "Coronet City",
        "Corellian Engineering Corporation shipyards"
      ]
    },
    "Crait": {
      "about": "A mineral world of white salt flats over red crystal, with an abandoned Rebel outpost.",
      "places": [
        "Old Rebel outpost",
        "The salt flats"
      ]
    },
    "Dagobah": {
      "about": "A fog-shrouded swamp world, remote and strong in the Force. Yoda spent his exile here.",
      "places": [
        "Yoda's hut",
        "The dark side cave"
      ]
    },
    "Dathomir": {
      "about": "A mystic, rugged world and the home of the Nightsisters and their powerful witch magic.",
      "places": [
        "Nightsister strongholds"
      ]
    },
    "Endor": {
      "about": "A forest moon of towering trees, home of the Ewoks. The second Death Star was built in its orbit.",
      "places": [
        "Bright Tree Village",
        "Imperial shield generator bunker"
      ]
    },
    "Exegol": {
      "about": "A hidden, storm-wracked Sith world in the Unknown Regions, where the Final Order fleet was built.",
      "places": [
        "The Sith citadel"
      ]
    },
    "Felucia": {
      "about": "A wild jungle world of giant fungi and dangerous creatures.",
      "places": []
    },
    "Geonosis": {
      "about": "A rocky red desert world of insectoid Geonosians, whose huge hives and droid factories shaped the Clone Wars.",
      "places": [
        "Petranaki arena",
        "Geonosian droid factories"
      ]
    },
    "Hoth": {
      "about": "A frozen ice planet of blizzards and wampas. It was home to the Rebel Alliance's Echo Base.",
      "places": [
        "Echo Base"
      ]
    },
    "Jakku": {
      "about": "A harsh desert world littered with the wrecks of a great battle, where scavengers scrape out a living.",
      "places": [
        "Niima Outpost",
        "The starship graveyard",
        "Tuanul village"
      ]
    },
    "Jedha": {
      "about": "A desert moon sacred to many faiths, rich in kyber crystals and later occupied by the Empire.",
      "places": [
        "Jedha City",
        "Temple of the Kyber"
      ]
    },
    "Kamino": {
      "about": "A stormy ocean world of stilt cities, where the Kaminoans cloned the Republic's army.",
      "places": [
        "Tipoca City"
      ]
    },
    "Kashyyyk": {
      "about": "The Wookiee homeworld, covered in giant wroshyr trees with villages built among the branches.",
      "places": [
        "Kachirho"
      ]
    },
    "Kessel": {
      "about": "A grim world of spice mines worked by slave labor, near the dangerous Kessel Run route.",
      "places": [
        "Spice mines",
        "The Kessel Run"
      ]
    },
    "Lothal": {
      "about": "An Outer Rim world of grassy plains and cities under Imperial rule, and the home of the Ghost crew's early rebellion.",
      "places": [
        "Capital City",
        "Tarkintown",
        "Jedi Temple"
      ]
    },
    "Malachor": {
      "about": "A scarred, dead world where a Sith temple stands and a great battle once raged.",
      "places": [
        "The Sith temple"
      ]
    },
    "Mandalore": {
      "about": "The homeworld of the Mandalorians, a once-green, now war-torn world of clans and warriors.",
      "places": [
        "Sundari (capital)"
      ]
    },
    "Mon Cala": {
      "about": "An ocean world shared by the Mon Calamari and the Quarren, known for its floating cities and shipbuilding.",
      "places": []
    },
    "Mustafar": {
      "about": "A volcanic world of rivers of lava, mined for rare minerals and the site of Anakin and Obi-Wan's duel.",
      "places": [
        "Separatist mining facility",
        "Fortress Vader"
      ]
    },
    "Mygeeto": {
      "about": "A frozen world of crystal spires and high-tech banking facilities.",
      "places": [
        "Banking Clan facility"
      ]
    },
    "Naboo": {
      "about": "A green Mid Rim world of rolling plains and lakes, home to both the Naboo and the underwater Gungans.",
      "places": [
        "Theed",
        "Otoh Gunga",
        "Varykino"
      ]
    },
    "Nevarro": {
      "about": "A volcanic Outer Rim world where the Bounty Hunters' Guild operated after the fall of the Empire.",
      "places": [
        "Nevarro City"
      ]
    },
    "Onderon": {
      "about": "A jungle world with a walled capital, caught in a civil war during the Clone Wars.",
      "places": [
        "Iziz"
      ]
    },
    "Ord Mantell": {
      "about": "A rough world of smugglers and bounty hunters.",
      "places": []
    },
    "Ryloth": {
      "about": "The Twi'lek homeworld, a dry, rocky world with a deadly day and freezing night side.",
      "places": [
        "Lessu"
      ]
    },
    "Saleucami": {
      "about": "A world that saw fighting during the Clone Wars.",
      "places": []
    },
    "Scarif": {
      "about": "A tropical Imperial world of white beaches, home to a hidden data vault.",
      "places": [
        "Citadel Tower",
        "The Imperial vault"
      ]
    },
    "Takodana": {
      "about": "A forested world of lakes and ruins, home to Maz Kanata's castle, a haven for travelers.",
      "places": [
        "Maz Kanata's castle"
      ]
    },
    "Tatooine": {
      "about": "A hot desert planet with twin suns, run by crime lords and settled by moisture farmers.",
      "places": [
        "Mos Eisley",
        "Mos Espa",
        "Jabba's palace"
      ]
    },
    "Umbara": {
      "about": "A dark, sunless world of the Umbarans, secretive and cold toward outsiders.",
      "places": []
    },
    "Utapau": {
      "about": "A world of vast sinkholes, with its cities built in the walls and its people living deep below the surface.",
      "places": [
        "Pau City"
      ]
    },
    "Yavin 4": {
      "about": "A jungle moon of a gas giant, covered in ancient Massassi temples and used as a Rebel base.",
      "places": [
        "Great Temple",
        "Massassi temples"
      ]
    },
    "Zeffo": {
      "about": "An ancient world of tombs and ruins of a lost civilization, tied to the Jedi.",
      "places": [
        "Zeffo tombs"
      ]
    }
  },

  /* Groups that appear in canon films and series. */
  factions: [
    'Galactic Republic', 'Jedi Order', 'Confederacy of Independent Systems', 'Galactic Empire',
    'Rebel Alliance', 'New Republic', 'First Order', 'Resistance', 'Hutt clans', 'Black Sun',
    'Crimson Dawn', 'Pyke Syndicate', "Bounty Hunters' Guild", 'Mandalorians',
    'Unaffiliated'
  ],

  eras: [
    'The High Republic', 'The Clone Wars', 'The Imperial era', 'The Galactic Civil War',
    'After the fall of the Empire', 'The First Order era'
  ],

  /* Story prompts. Answers are saved exactly as chosen/written. Nothing is
     suggested, scored, or fed back into the rules. */
  story: [
    {
      id: 'origin', title: 'Where you come from', blurb: 'Home, family, and the road out.',
      q: [
        { id: 'era', t: 'Which era do you live in?', opts: 'eras' },
        { id: 'world', t: 'Which world did you grow up on?', opts: 'worlds' },
        { id: 'raised', t: 'What was home like?', opts: [
          'A crowded city level', 'A quiet frontier settlement', 'Aboard a ship, always moving',
          'A temple, school, or enclave', 'A clan or tribe', 'A wealthy household',
          'A workshop, shipyard, or docks', 'Mostly on my own'
        ] },
        { id: 'family', t: 'Who raised you?', opts: [
          'Both parents', 'One parent', 'Grandparents or elders', 'A guardian or mentor',
          'Fellow orphans or a found family', 'An institution', 'Droids'
        ] },
        { id: 'left', t: 'Why did you leave?', opts: [
          'Work or a debt', 'A war reached my home', 'I was recruited', 'I was running from someone',
          'I was looking for someone', 'Curiosity', 'I was sent away', 'I never really left'
        ] }
      ]
    },
    {
      id: 'self', title: 'Who you are', blurb: 'Temperament and habits. Pick the closest answer, then add your own words.',
      q: [
        { id: 'conflict', t: 'When a fight starts, you usually…', opts: [
          'Step in first', 'Look for the exit', 'Talk it down', 'Wait and watch', 'Make it worse on purpose'
        ] },
        { id: 'stranger', t: 'A stranger asks for help and you are short on time. You…', opts: [
          'Stop and help', 'Help if it is cheap', 'Point them to someone else', 'Ask what is in it for you', 'Keep walking'
        ] },
        { id: 'plan', t: 'Your usual approach to a plan is…', opts: [
          'Plan every step', 'A rough plan, then improvise', 'No plan, trust your instincts', 'Let someone else plan'
        ] },
        { id: 'people', t: 'Around other people you are…', opts: [
          'The loud one', 'The listener', 'The joker', 'The professional', 'The one who keeps to the corner'
        ] },
        { id: 'trust', t: 'Trust is…', opts: [
          'Given freely', 'Earned slowly', 'Bought', 'Something you stopped offering'
        ] },
        { id: 'fear', t: 'What scares you most?', opts: [
          'Being alone', 'Losing control', 'Failing the people who rely on you', 'Being found out',
          'Becoming like someone you hate', 'Ending up forgotten'
        ] },
        { id: 'want', t: 'What do you want most?', opts: [
          'Credits and comfort', 'Freedom', 'Justice', 'Revenge', 'Belonging', 'Knowledge', 'Peace', 'Glory'
        ] }
      ]
    },
    {
      id: 'ties', title: 'Who you answer to', blurb: 'Allegiances, debts, and the people who matter.',
      q: [
        { id: 'faction', t: 'Which group, if any, do you answer to?', opts: 'factions' },
        { id: 'ally', t: 'Who is one person you would stand beside no matter what?', opts: null },
        { id: 'rival', t: 'Who is one person who wants you gone?', opts: null },
        { id: 'debt', t: 'What do you owe, and to whom?', opts: null }
      ]
    },
    {
      id: 'look', title: 'How you come across', blurb: 'What others notice first.',
      q: [
        { id: 'look', t: 'What do people notice about you first?', opts: null },
        { id: 'voice', t: 'How do you speak?', opts: [
          'Blunt and short', 'Warm and easy', 'Formal and careful', 'Fast and nervous',
          'Quiet and low', 'Loud and theatrical', 'Dry and sarcastic'
        ] },
        { id: 'habit', t: 'A habit or tell you cannot shake?', opts: null },
        { id: 'keepsake', t: 'What do you carry that matters more than it looks?', opts: null }
      ]
    },
    {
      id: 'arc', title: 'Where you are headed', blurb: 'Goals, secrets, and open questions for the table.',
      q: [
        { id: 'goal', t: 'Your goal for this campaign?', opts: null },
        { id: 'secret', t: 'A secret you keep?', opts: null },
        { id: 'line', t: 'A line you will not cross?', opts: null },
        { id: 'ask', t: 'One question you want your GM to answer for you?', opts: null }
      ]
    }
  ]
};
