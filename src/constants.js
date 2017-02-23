var MODE = {
  vanilla: 'black & white',
  colorful: 'colorful',
  color_title: 'color title',
};

var NOINDEX = -1;

var POP = 'Pop Songs';
var POETRY = 'Poetry';

var CANNED_SONGS = [
  {slug: 'buddyholly', artist: 'Weezer', title: 'Buddy Holly', group: POP},
  {slug: 'barbiegirl', artist: 'Aqua', title: 'Barbie Girl', group: POP},
  {slug: 'judas', artist: 'Lady Gaga', title: 'Judas', group: POP},
  {slug: 'plan', artist: 'They Might Be Giants', title: 'No-one Knows My Plan', group: POP},
  {slug: 'spiderwebs', artist: 'No Doubt', title: 'Spiderwebs', group: POP},
  {slug: 'thelamb', artist: 'William Blake', title: 'The Lamb', group: POETRY},
  {slug: 'thetyger', artist: 'William Blake', title: 'The Tyger', group: POETRY},
  {slug: 'peaches', artist: 'The Presidents of the United States of America', title: 'Peaches', group: POP},
  {slug: 'lovefool', artist: 'The Cardigans', title: 'Lovefool', group: POP},
  {slug: 'sugarsugar', artist: 'The Archies', title: 'Sugar Sugar', group: POP},
  {slug: 'ibleed', artist: 'The Pixies', title: 'I Bleed', group: POP},
  {slug: 'ribs', artist: 'Lorde', title: 'Ribs', group: POP},
  {slug: 'hardestbutton', artist: 'The White Stripes', title: 'The Hardest Button To Button', group: POP},
  {slug: 'cheapthrills', artist: 'Sia', title: 'Cheap Thrills', group: POP},
  {slug: 'anthems', artist: 'bss', title: 'anthems', group: POP},
  {slug: 'debaser', artist: 'pixies', title: 'Debaser', group: POP},
  {slug: 'team', artist: 'Lorde', title: 'Team', group: POP},
  {slug: 'wouldntitbenice', artist: 'The Beach Boys', title: "Wouldn't It Be Nice?", group: POP},
  {slug: 'whatsup', artist: '4 Non-Blondes', title: "What's Up?", group: POP},
  
  {slug: 'test', artist: 'colinmorris', title: 'test', group: 'Test'},
  
  {slug: 'praiseyou', artist: 'fbslim', title: 'Praise You', group: POP},
  {slug: 'badgirls', artist: 'M.I.A.', title: 'Bad Girls', group: POP},
  {slug: 'royals', artist: 'Lorde', title: 'Royals', group: POP},
  {slug: 'whereismymind', artist: 'Pixies', title: 'Where', group: POP},
  {slug: 'chandelier', artist: 'Sia', title: 'Chandelier', group: POP},
  {slug: 'sexotheque', artist: 'La Roux', title: 'Sexotheque', group: POP},
  
  {slug: 'badromance', artist: 'Lady Gaga', title: 'Bad Romance', group: POP},
  {slug: 'cgyoomh', artist: 'Kylie Minogue', title: "Can't Get You Out Of My Head", group: POP},
  {slug: 'humps', artist: 'The Black-eyed Peas', title: 'My Humps', group: POP},
  {slug: 'theechoinggreen', artist: 'William Blake', title: 'The Echoing Green', group: POETRY},
  {slug: 'thepasture', artist: 'Robert Frost', title: 'The Pasture', group: POETRY},
  {slug: 'gottobereal', artist: 'Cheryl Lynn', title: 'Got To Be Real', group: POP},
  {slug: 'mysharona', artist: 'The Knack', title: 'My Sharona', group: POP},
  {slug: 'stuckin', artist: 'that guy', title: 'Stuck In The Middle With You', group: POP},
  {slug: 'killvmaim', artist: 'Grimes', title: 'Kill v Maim', group: POP},
  {slug: 'whenafelon', artist: 'Gilbert & Sullivan', title: "When A Felon's Not Engaged In His Employment", group: POP},
  {slug: 'majorgeneral', artist: 'Gilbert & Sullivan', title: "The Major-General's Song", group: POP},
  {slug: 'whenitrains', artist: 'They Might Be Giants', title: 'When It Rains It Snows', group: POP},
  
  //{slug: '', artist: '', title: ''},
];

var DEFAULT_SONG = 'buddyholly';
//var DEFAULT_SONG = 'test';

export {NOINDEX, CANNED_SONGS, DEFAULT_SONG, MODE};
