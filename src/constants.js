var MODE = {
  vanilla: 'black & white',
  colorful: 'colorful',
  color_title: 'color title',
};

var NOINDEX = -1;

var CANNED_SONGS = [
  {slug: 'buddyholly', artist: 'Weezer', title: 'Buddy Holly'},
  {slug: 'barbiegirl', artist: 'Aqua', title: 'Barbie Girl'},
  {slug: 'judas', artist: 'Lady Gaga', title: 'Judas'},
  {slug: 'plan', artist: 'They Might Be Giants', title: 'No-one Knows My Plan'},
  {slug: 'spiderwebs', artist: 'No Doubt', title: 'Spiderwebs'},
  {slug: 'thelamb', artist: 'William Blake', title: 'The Lamb'},
  {slug: 'thetyger', artist: 'William Blake', title: 'The Tyger'},
  {slug: 'peaches', artist: 'The Presidents of the United States of America', title: 'Peaches'},
  {slug: 'lovefool', artist: 'The Cardigans', title: 'Lovefool'},
  {slug: 'sugarsugar', artist: 'The Archies', title: 'Sugar Sugar'},
  {slug: 'ibleed', artist: 'The Pixies', title: 'I Bleed'},
  {slug: 'ribs', artist: 'Lorde', title: 'Ribs'},
  {slug: 'hardestbutton', artist: 'The White Stripes', title: 'The Hardest Button To Button'},
  {slug: 'cheapthrills', artist: 'Sia', title: 'Cheap Thrills'},
  {slug: 'anthems', artist: 'bss', title: 'anthems'},
  {slug: 'debaser', artist: 'pixies', title: 'Debaser'},
  {slug: 'team', artist: 'Lorde', title: 'Team'},
  {slug: 'wouldntitbenice', artist: 'The Beach Boys', title: "Wouldn't It Be Nice?"},
  {slug: 'whatsup', artist: '4 Non-Blondes', title: "What's Up?"},
  
  {slug: 'test', artist: 'colinmorris', title: 'test'},
  
  {slug: 'praiseyou', artist: 'fbslim', title: 'Praise You'},
  {slug: 'badgirls', artist: 'M.I.A.', title: 'Bad Girls'},
  {slug: 'royals', artist: 'Lorde', title: 'Royals'},
  {slug: 'whereismymind', artist: 'Pixies', title: 'Where'},
  {slug: 'chandelier', artist: 'Sia', title: 'Chandelier'},
  {slug: 'sexotheque', artist: 'La Roux', title: 'Sexotheque'},
  
  {slug: 'badromance', artist: 'Lady Gaga', title: 'Bad Romance'},
  {slug: 'cgyoomh', artist: 'Kylie Minogue', title: "Can't Get You Out Of My Head"},
  {slug: 'humps', artist: 'The Black-eyed Peas', title: 'My Humps'},
  {slug: 'theechoinggreen', artist: 'William Blake', title: 'The Echoing Green'},
  {slug: 'thepasture', artist: 'Robert Frost', title: 'The Pasture'},
  {slug: 'gottobereal', artist: 'Cheryl Lynn', title: 'Got To Be Real'},
  {slug: 'mysharona', artist: 'The Knack', title: 'My Sharona'},
  {slug: 'stuckin', artist: 'that guy', title: 'Stuck In The Middle With You'},
  {slug: 'killvmaim', artist: 'Grimes', title: 'Kill v Maim'},
  {slug: 'whenafelon', artist: 'Gilbert & Sullivan', title: "When A Felon's Not Engaged In His Employment"},
  {slug: 'majorgeneral', artist: 'Gilbert & Sullivan', title: "The Major-General's Song"},
  {slug: 'whenitrains', artist: 'They Might Be Giants', title: 'When It Rains It Snows'},
  
  //{slug: '', artist: '', title: ''},
];

var DEFAULT_SONG = 'buddyholly';
//var DEFAULT_SONG = 'test';

export {NOINDEX, CANNED_SONGS, DEFAULT_SONG, MODE};
