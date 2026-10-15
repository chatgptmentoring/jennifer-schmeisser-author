/* ==========================================================================
   SPARKLE KNOWLEDGE BASE (demo)
   Built from "When the Blueprint Burned" by Jennifer A. Schmeisser.
   The demo brain matches questions to topics below, then answers with
   guidance, stories, free resources, and (gently) the book.
   Pattern syntax: "word" matches word stems (diagnos → diagnosis/diagnosed);
   "word$" matches the whole word only.
   ========================================================================== */
window.SPARKLE_KB = (function () {

  /* ---------------- Stories (short versions, Jennifer's voice) ---------------- */
  const stories = {
    "diagnosis-day": {
      title: "“Merry Christmas. He's on the spectrum.”", chapter: "Chapter 1 · Diagnosis Day", tone: "heart", chip: "Tell me about diagnosis day",
      keys: [["diagnosis day", 4], ["merry christmas", 4], ["library story", 4]],
      paras: [
        "Weeks before Ryan's evaluation, I told his dad I was going to the library and I wasn't coming home until I figured it out. I came back with three words: ADHD, OCD… and maybe autism.",
        "Everyone said wait. <em>Boys are late bloomers.</em> My gut said run.",
        "At the appointment, the psychologist turned to me and asked what I thought. I told him. He nodded, and then he said it: <em>“Merry Christmas. He's on the autism spectrum.”</em> Three for three. I have never wanted so badly to be wrong.",
        "His dad and I stopped for coffee afterward and just sat there, cups cooling in our hands, crying quiet tears. That was the moment the blueprint burned. What I didn't know yet: we were about to build something much, much better."
      ]
    },
    "wedding-ring": {
      title: "The Vanishing Wedding Ring", chapter: "Chapter 3", tone: "funny", chip: "Tell me the wedding ring story 💍",
      keys: [["wedding ring", 5], ["ring story", 5], ["air vent", 4], ["vents$", 3], ["heat register", 4]],
      paras: [
        "When Ryan was a toddler, things vanished. Remotes. Keys. Puzzle pieces. And then my wedding ring. I took it off for two seconds to wash dishes, and it was gone.",
        "I checked the toilet (his favorite water feature at the time), grieved it, and bought a plain band.",
        "Seven years later (<em>seven!</em>) we were moving, and Ryan's grandpa was pulling off the old vent covers when I heard him holler in that thick southern Ohio drawl: <em>“Hey! I found me a wedding ring!”</em>",
        "Dusty, dirty, definitely mine. It had been nestled in the family-room heat register the whole time. I put it right back on, dirt and all. Lesson learned: in our house, things don't disappear. They just wait."
      ]
    },
    "cucumbers": {
      title: "Cucumber vs. Zucchini", chapter: "Chapter 3", tone: "funny", chip: "Tell me the cucumber story 🥒",
      keys: [["cucumber", 5], ["zucchini", 4]],
      paras: [
        "Ryan always grabbed two zucchinis at the store, because zucchini meant MUFFINS. One day he grabbed two <em>cucumbers</em> instead and clutched them in a death grip.",
        "We felt them together. (“Bumpy,” I said.) We smelled them. I lined up the real zucchinis like evidence in a courtroom. Logic was presented. Data was shared.",
        "But sensory truth doesn't always bow to logic. So we bought four “zucchinis.” Two of them just happened to be cucumbers.",
        "Sometimes the lesson isn't “this is a zucchini.” Sometimes the lesson is “you are safe, and learning can wait until another day.”"
      ]
    },
    "bathroom-christmas": {
      title: "The Christmas We Spent in the Bathroom", chapter: "Chapter 4", tone: "funny", chip: "Tell me the bathroom Christmas story 🎄",
      keys: [["toilet paper tree", 5], ["bathroom christmas", 5], ["christmas in the bathroom", 5]],
      paras: [
        "Some families roast chestnuts. The winter Ryan was five, we spent two solid weeks of Christmas break in the bathroom, potty training.",
        "Timers every thirty minutes. <em>Ding.</em> Same steps, same calm, every single time. We even put a little artificial tree in there, decorated with toilet paper, to keep the holiday spirit alive in the bunker.",
        "Around the middle of the break, it clicked. No parade, no M&amp;Ms raining from the sky, just a calm “you did it.”",
        "We emerged pale, exhausted, and smelling faintly of bleach… and he was trained. Success doesn't need to be loud to be real."
      ]
    },
    "magic-mountain": {
      title: "Boot Camp at Magic Mountain", chapter: "Chapter 5", tone: "heart", chip: "Tell me the Magic Mountain story",
      keys: [["magic mountain", 5]],
      paras: [
        "Ryan screamed in the preschool parking lot. The lights, the slamming doors, the noise were all too much. I couldn't bubble-wrap the planet, so I made a terrifying choice: I took him to Magic Mountain, the loudest, brightest indoor play place around. It smelled like socks and pizza.",
        "He screamed like he was being stabbed. Parents gave me <em>The Look</em>. I felt like a monster. But I kept going, slowly, lovingly, and watching him closely.",
        "Six weeks later, the screaming became whimpering, and the whimpering became curiosity. Today? He <em>loves</em> trampoline parks.",
        "Every child is different, and this was what worked for Ryan. Sometimes, though, we all need a little behavioral umph to get started."
      ]
    },
    "megan": {
      title: "Megan Mandela", chapter: "Chapter 5", tone: "heart", chip: "Tell me about Megan",
      keys: [["megan", 4], ["dewalt", 5], ["power drill", 5]],
      paras: [
        "My daughter Megan was never afraid of “different.” As a toddler she'd walk right up to a child in a wheelchair, not to stare, but to ask, <em>“Does it go fast?”</em> My friends called her “Megan Mandela.”",
        "She became Ryan's translator. She taught him emotions by making silly faces for photos, and prepositions by hanging upside down on the swing set yelling, <em>“I am UNDER!”</em>",
        "While other girls asked for dolls, she asked for a DeWalt power drill for Christmas, and later took it to Appalachia to build houses.",
        "Ryan needed me to be his warrior. Megan needed me to be her witness."
      ]
    },
    "larabars": {
      title: "The Larabar Heist", chapter: "Chapter 6", tone: "funny", chip: "Tell me the Larabar story 🏃",
      keys: [["larabar", 5], ["shoplift", 5]],
      paras: [
        "In a very busy store, Ryan and I were negotiating over Larabars. He wanted five. I was negotiating for fewer.",
        "Ryan decided the negotiation was over. He grabbed the whole box and ran out the automatic doors toward the parking lot.",
        "Split-second choice: let him run into traffic, or… shoplift. We shoplifted. I caught him, drove home guilt-ridden, handed him a bar and a glass of milk, and called the store.",
        "The manager laughed. <em>“I know exactly who you are. Just bring the UPC to customer service next time.”</em> Crisis averted, and rated G."
      ]
    },
    "mens-room": {
      title: "The Men's Room Chronicles", chapter: "Chapter 6", tone: "funny", chip: "Tell me the men's room story 🚻",
      keys: [["men's room", 5], ["mens room", 5], ["urinal", 5], ["wheee", 5]],
      paras: [
        "I have spent years of my life loitering outside men's restrooms. Once at the movies, standing guard, I heard Ryan's voice echoing off the tile: <em>“WHEEEEEEEE!”</em>",
        "A concession worker leaned over: <em>“Ma'am? The women's restroom is on the other side.”</em> I gave her my best too-tired-to-explain smile. “I know. I'm waiting for my son. He has autism.”",
        "(My son-in-law later reported that Ryan uses <em>all</em> the urinals, a little at each one. “I'm almost impressed,” he said. Talent is talent.)"
      ]
    },
    "checkout": {
      title: "“Could you make him be quiet?”", chapter: "Chapter 6", tone: "heart", chip: "Tell me that story",
      keys: [["make him be quiet", 5], ["checkout story", 5]],
      paras: [
        "At the grocery checkout, while I was helping Ryan “beep the lines,” a stranger leaned over and asked, <em>“Could you make him be quiet and hurry up?”</em>",
        "I took a deep breath. <em>“I sure wish I could make him be quiet and hurry up. You're right. But how boring would the world be if God made all His children the same?”</em>",
        "The entire checkout went silent. Kindness over biting back. Every single time."
      ]
    },
    "dentist": {
      title: "Dr. Mike and the Bitewing X-Rays", chapter: "Chapter 6", tone: "heart", chip: "Tell me the dentist story 🦷",
      keys: [["dentist story", 5], ["dr mike", 5], ["x-ray", 4], ["xray", 4]],
      paras: [
        "Dentist visits started around age four as a weekly Wednesday adventure. Week one: sit in the chair on my lap. Week two: sit in the chair alone, get praised, leave. Week three: the dentist just counted his teeth.",
        "Months of tiny steps. Fast-forward to age 32: Ryan had his first-ever bitewing X-rays with Dr. Mike, a saint of a man. A bit loud? Yes. Zero aggression.",
        "I sent those X-rays to family and friends. I really did."
      ]
    },
    "hangman": {
      title: "Hangman in the Hearing Room", chapter: "Chapter 7", tone: "funny", chip: "Tell me the Hangman story ✏️",
      keys: [["hangman", 5], ["legal pad", 5], ["hearing story", 5]],
      paras: [
        "During my 2½-year fight for Ryan's education rights, I sat in a hearing, sworn in on a Bible, being questioned about my parenting. The tension was so thick you could choke on it.",
        "So his dad and I quietly started playing Hangman on a yellow legal pad. The lawyers thought we were taking furious notes. Nope. We were guessing a six-letter word for “musical instrument.”",
        "They could question us, but they couldn't break our bond with our son. (And yes, we won.)"
      ]
    },
    "australia": {
      title: "Someone in Australia", chapter: "Chapter 7", tone: "heart", chip: "Tell me the Australia story 🌏",
      keys: [["australia", 5]],
      paras: [
        "After our case settled, I made the case number available, with every name redacted, so other parents could see how the system worked.",
        "One day the Department of Education called: <em>“We're going to need to shut down your website.”</em> I said, “I don't have a website.” Pause. <em>“Someone from Australia just requested the files.”</em>",
        "Australia! That's when I realized this wasn't just about Ryan. Somewhere, our struggle was helping another family. That's why I'm here, and why I want you to know you are not alone."
      ]
    },
    "artistic": {
      title: "“Is He Artistic?”", chapter: "Chapter 8", tone: "funny", chip: "Tell me the “artistic” story 🎨",
      keys: [["artistic", 5]],
      paras: [
        "I can't tell you how many times a well-meaning stranger has whispered, <em>“Oh, is he artistic?”</em>",
        "“No,” I'd say, with a pause and a smile. “He's <em>autistic</em>. But he draws a mean stick figure, so maybe both.”",
        "Humor helps. If you don't laugh sometimes, the labels swallow the whole story."
      ]
    },
    "german-doctor": {
      title: "The German Doctor", chapter: "Chapter 11", tone: "heart", chip: "Tell me about the German doctor 🩺",
      keys: [["german doctor", 6], ["hematologist", 5], ["white blood", 5]],
      paras: [
        "For a decade, my white blood cell count ran high. I wasn't “sick.” I was just running a full-time job, a part-time job, Ryan's care, and a school-board fight on fumes.",
        "A gruff German hematologist with zero bedside manner looked me dead in the eye: <em>“Jennifer, do you want to live a long, healthy life so you can care for Ryan?”</em> “Yes, of course.” <em>“Well, you won't. Not like this.”</em>",
        "I cried because he was mean. I cried because he was right. So I started with ten minutes: a chair in the corner, a blanket, a cup of coffee, and nothing else.",
        "Six months later my doctor stared at my bloodwork, confused. “Your counts are normal. What did you do?” The chair. The blanket. The books. The boundaries."
      ]
    },
    "jeopardy": {
      title: "The Jeopardy! Challenge", chapter: "Chapter 12", tone: "funny", chip: "Tell me the Jeopardy! story 📺",
      keys: [["jeopardy", 5], ["alex trebek", 5]],
      paras: [
        "When Ryan moved into his own apartment, I went home to a silent house and panicked. For thirty years my body had been tuned to his frequency.",
        "So I sat down to watch <em>Jeopardy!</em> Thirty minutes. Simple. I couldn't do it. I literally set a timer: “Jennifer, you will sit in this chair. You will not get up.”",
        "My daughter calls me B.F. Skinner because I behavior-planned my way through parenting. Now I had to behavior-plan <em>myself</em>. Sit. Stay. Watch Alex Trebek.",
        "Fifteen minutes in, I hadn't collapsed or folded a single towel. I had… relaxed."
      ]
    },
    "hot-coffee": {
      title: "The Bathroom Revelation", chapter: "Chapter 12", tone: "funny", chip: "Tell me the bathroom revelation story ☕",
      keys: [["bathroom revelation", 5], ["hot coffee", 4]],
      paras: [
        "A few weeks after Ryan moved out, I went to the bathroom. Closed the door. Washed my hands. Walked out, and stopped dead in my tracks.",
        "I had just gone to the bathroom <em>alone</em>. No knocking. No juice requests. No notes slid under the door in permanent marker.",
        "Then I took a shower at human speed, washing all the body parts instead of rushing, and it felt almost criminal. That's when I started learning to be Jennifer again, not just “Ryan's Mom.”"
      ]
    },
    "oatmeal": {
      title: "Oatmeal and Mom Magic", chapter: "Chapter 14", tone: "heart", chip: "Tell me the oatmeal story 🥣",
      keys: [["oatmeal", 5]],
      paras: [
        "Ryan had a podiatrist appointment at 3 p.m. I asked his morning helper not to mention it, because in Ryan's brain “doctor + mommy” means “Mommy is coming RIGHT NOW.”",
        "By 6:30 a.m. he was pacing: <em>“Mommy, in a minute?”</em> I was running late for work, but I always pick Ryan. I drove over, made him a bowl of oatmeal, and sat down with him.",
        "Poof. Calm as a cucumber. His helper said, “You are magic.” “No,” I told her. “I just love him so hard it hurts.”",
        "Sometimes the best intervention isn't clinical. It's oatmeal with Mom."
      ]
    },
    "milk-all-gone": {
      title: "Milk All Gone", chapter: "Chapter 15", tone: "funny", chip: "Tell me the “Milk All Gone” story 🥛",
      keys: [["milk all gone", 6], ["camelbak", 6], ["almond milk", 3], ["milk story", 5]],
      paras: [
        "Ryan's OCD latched onto “milk all gone.” He'd pour one glass from a brand-new carton of almond milk, then race to the sink like the final stretch of the Boston Marathon and dump the rest. <em>Splash.</em> “All gone.”",
        "My grocery budget went straight down the drain. So I got sneaky: I poured new cartons into opaque CamelBak bottles (Mom's weird smoothie cups, as far as he knew), and he didn't even blink.",
        "Then I left one carton out with exactly one glass plus a splash. He poured, drank, sprinted, and dumped two ounces. “All gone.” Peace.",
        "It was never about the milk. It was about closure."
      ]
    },
    "tandem-bike": {
      title: "Letting Go of the Brakes", chapter: "Chapter 16", tone: "funny", chip: "Tell me the tandem bike story 🚲",
      keys: [["tandem", 5], ["bike", 4], ["bicycle", 4]],
      paras: [
        "Thanks to an amazing adaptive sports program, Ryan took his first real bike ride on a side-by-side tandem. After some protesting and serious side-eye, he settled in.",
        "I chatted about the colors of the leaves and the dogs we passed, and before he knew it, he was pedaling.",
        "Then we hit a sharp curve. Ryan looked over with a glint in his eye (<em>I'm onto you, Mom</em>), went <em>“errrt,”</em> and slammed the brakes on purpose. We nearly veered off the path.",
        "He threw his head back and cackled. Turns out, he was in control all along."
      ]
    },
    "duck": {
      title: "Duck!", chapter: "Chapter 17", tone: "funny", chip: "Tell me the duck story 🦆",
      keys: [["duck", 5], ["quack", 5]],
      paras: [
        "We were walking outside and a low tree branch hung over the sidewalk. “Duck under the branch,” I told Ryan.",
        "He stopped. Looked at me. Looked at the branch. Squatted down… and <em>quacked</em>.",
        "He wasn't wrong! Same word, different duck. I am STILL laughing about that one."
      ]
    },
    "bacon-eggs": {
      title: "The Bacon & Eggs Breakthrough", chapter: "Chapter 17", tone: "heart", chip: "Tell me the bacon & eggs story 🥓",
      keys: [["bacon and eggs", 6], ["bacon eggs", 6], ["breakfast story", 5], ["orange juice", 4]],
      paras: [
        "In a loud, clanky restaurant one Sunday, Ryan, who usually speaks two or three words at a time, used his AAC “talker” to say a full paragraph: <em>“I want to go eat breakfast. I want bacon, eggs, and orange juice with a straw.”</em>",
        "He navigated it all himself: Places, then Food, then Drinks. He even found the straw icon.",
        "The waitress was busy. She didn't catch it. He never got the orange juice. But me? I was floating.",
        "To the rest of the world, it was a breakfast order. To me, it was the Super Bowl."
      ]
    },
    "shark": {
      title: "Play the Shark", chapter: "Chapter 17", tone: "heart", chip: "Tell me the shark story 🦈",
      keys: [["shark", 5], ["pool story", 5]],
      paras: [
        "At the pool, I lift my hand to my forehead like a Parrot Head scanning the horizon and yell, <em>“I'm a shark!”</em> Then off I go, chasing Ryan across the water while he shrieks and kicks with pure delight.",
        "When he stops to look at me (<em>really</em> look at me), his face opens wide, ear to ear, as if we've been apart for years instead of minutes.",
        "To be loved like that makes me feel almost mythical. Like a unicorn. Never, ever forget to play the shark."
      ]
    },
    "flour-fight": {
      title: "Sarah Is in the Oven", chapter: "Chapter 10", tone: "funny", chip: "Tell me the flour fight story 🧁",
      keys: [["flour fight", 6], ["water balloon", 5], ["sarah in the oven", 6]],
      paras: [
        "Two teenage girls ambushed Megan's dad with water balloons when he came home in his dress clothes. Ryan ran into the kitchen: <em>“I need ammo!”</em>",
        "Ryan and I happened to be baking, so Dad grabbed the whole bag of flour and ran outside. Next thing I knew, Megan's friend Sarah walked in looking like a blinking, flour-covered clown.",
        "Then her mom called. I braced for judgment. <em>“Hi, this is Sarah's mom. Just letting you know we've put Sarah in the oven. She's been floured, I seasoned her, and she'll be ready to eat soon.”</em>",
        "Sometimes, in autism and in life, no rules is the best rule."
      ]
    },
    "gf-gas": {
      title: "The Great Gluten-Free Gas Experiment", chapter: "Chapter 2", tone: "funny", chip: "Tell me the gluten-free story 💨",
      keys: [["gas$", 4], ["fart", 5], ["pew", 5], ["elimination diet", 4]],
      paras: [
        "Back before gluten-free was a trendy grocery aisle, we tried an elimination diet. Translation: lethal, Olympic-medal-worthy gas.",
        "We cracked the minivan windows in the dead of an Ohio winter just to survive the drive home. At the store, Ryan would let one rip and proudly announce, <em>“Pew! You stink!”</em>, pointing at me. As they say, the smeller is the feller.",
        "Eventually we figured it out (goodbye gluten, goodbye casein), and I learned that sometimes kindness is just holding your tongue (and your nose) while you figure things out."
      ]
    }
  };

  /* ---------------- Free resources ---------------- */
  const resources = {
    "brain-foods": { title: "10 Favorite Brain Foods", desc: "Free PDF · avocado to dark chocolate", href: "assets/downloads/10-Favorite-Brain-Foods.pdf" },
    "brain-boosters": { title: "Brain Boosters & Calcium-Rich Recipes", desc: "Free PDF · superfood add-ons + recipes", href: "assets/downloads/Brain-Boosters-and-Calcium-Rich-Recipes.pdf" },
    "love-your-brain": { title: "10 Ways to Love Your Brain", desc: "Free printable · daily brain-care habits", href: "assets/downloads/10-Ways-to-Love-Your-Brain.pdf" },
    "vitamin-d-magnesium": { title: "Vitamin D & Magnesium Timing Guide", desc: "Free printable · check with your doctor first", href: "assets/downloads/Vitamin-D-and-Magnesium-Timing-Guide.pdf" },
    "accountability": { title: "The 8-Week Accountability Challenge", desc: "Free workbook · one small challenge a week", href: "assets/downloads/8-Week-Accountability-Challenge-Workbook.pdf" }
  };

  const DEFAULT_CHIPS = ["We just got a diagnosis", "I'm running on empty", "Meltdowns in public", "IEP meeting tips", "Tell me a funny story", "What's the book about?", "Book Jennifer to speak"];

  /* ---------------- Topics (intents) ---------------- */
  const intents = [

    /* ----- Conversation basics ----- */
    {
      id: "greet", noCta: true,
      patterns: [["hi$", 2], ["hello", 2], ["hey$", 2], ["hiya", 2], ["howdy", 2], ["good morning", 2], ["good afternoon", 2], ["good evening", 2], ["yo$", 1]],
      reply: {
        text: ["Hi there! 💛 I'm so glad you stopped by. Whether you're in the thick of it, just curious, or planning an event, you're in the right place.", "What would be most helpful right now?"],
        chips: DEFAULT_CHIPS
      }
    },
    {
      id: "thanks", patterns: [["thank", 3], ["thx$", 3], ["appreciate", 3], ["that helped", 3], ["this helped", 3], ["helpful", 2], ["you're sweet", 3], ["love this", 2]],
      reply: {
        text: ["You are so welcome. 💛 And remember what Jennifer would tell you: <strong>you are seen, you are strong, and you are not alone.</strong>", "Is there anything else on your heart today?"],
        chips: ["Tell me a funny story", "Free resources", "What's the book about?"]
      }
    },
    {
      id: "bye", noCta: true, patterns: [["bye", 3], ["goodbye", 3], ["good night", 3], ["goodnight", 3], ["see you", 2], ["gotta go", 3], ["talk later", 3]],
      reply: {
        text: ["Take care, friend. 🌙 Before you go: drink a glass of water, and if you can, claim ten minutes for yourself tomorrow morning. Coffee hot. Phone down.", "And never, ever forget to play the shark. 🦈"],
        chips: ["What's the book about?"]
      }
    },
    {
      id: "no", noCta: true, patterns: [["no$", 2], ["nope", 2], ["not now", 3], ["maybe later", 3], ["no thanks", 3], ["no thank you", 3]],
      reply: {
        text: ["No problem at all. We go at your pace here. 💛 What else can I help with?"],
        chips: DEFAULT_CHIPS
      }
    },
    {
      id: "whoami", noCta: true,
      patterns: [["are you real", 4], ["are you ai", 4], ["are you a bot", 4], ["are you a robot", 4], ["are you jennifer", 5], ["is this jennifer", 5], ["who are you", 4], ["what are you", 4], ["are you human", 4], ["real person", 5], ["a person$", 3], ["how do you work", 4], ["how were you", 3], ["chatgpt", 3], ["trained", 2], ["sparkle$", 2], ["your name", 3]],
      reply: {
        text: ["I'm <strong>Sparkle</strong> 🦄, an AI companion built from Jennifer's memoir, <em>When the Blueprint Burned</em>. I'm not Jennifer herself (she's probably reheating her coffee for the third time), but I've learned from her stories, her Sparkle &amp; Sanity tips, and her voice.",
          "Heads up: this is a <strong>demo version</strong>. The finished Sparkle will be trained on the full manuscript, so it'll know even more. I'm not a doctor, lawyer, or therapist, just a friend with a really good book."],
        links: [["Contact the real Jennifer", "contact.html", "#i-mail"]],
        chips: ["What's the book about?", "Who is Jennifer?", "Tell me a story"]
      }
    },

    /* ----- Site, book, author ----- */
    {
      id: "about_jennifer", noCta: false,
      patterns: [["who is jennifer", 5], ["about jennifer", 5], ["about the author", 5], ["the author", 3], ["jennifer$", 2], ["her story", 6], ["jennifer's story", 7], ["jennifers story", 7], ["jennifers background", 7], ["about jennifers", 6], ["her background", 4], ["tell me about her", 4], ["who wrote", 4], ["bio$", 3], ["credentials", 3], ["qualif", 3], ["about you", 2]],
      reply: {
        text: ["Jennifer A. Schmeisser is an author, speaker, and advocate, and the self-proclaimed <strong>Supreme Ruler of All Things Ryan</strong>. 👑",
          "She grew up the youngest of six in a home shaped by alcoholism and decided early that she wanted <em>harmony</em>. Then her son Ryan was diagnosed with autism (plus OCD and ADHD), and the blueprint burned. She went on to win a 2½-year legal battle for his education rights, build the “Mama Bear Protocol” to keep him safe as an adult, and, after a gruff German doctor scared her straight, learn to sit still for ten whole minutes.",
          "She's also trained in integrative health through Duke, an ICF-credentialed coach, a former Girl Scout leader, and mom to Megan, Ryan, and a golden rescue named Ginger."],
        quote: ["He taught me that “normal” is just a setting on the dryer.", "Jennifer on Ryan"],
        links: [["Read Jennifer's story", "about.html", "#i-heart"]],
        chips: ["What's the book about?", "Tell me about Ryan", "Book Jennifer to speak"]
      }
    },
    {
      id: "ryan", chapter: "Chapter 17",
      patterns: [["ryan", 3], ["ry guy", 5], ["her son", 3], ["how old is", 2], ["how is he now", 4]],
      reply: {
        text: ["Ryan is in his thirties now, six-foot-one, a water baby, a movie-scene memorizer, and the reigning DJ of kitchen dance parties (<em>Brick House</em>, obviously).",
          "He lives in his own apartment with a team of helpers, and he still has Sunday Fundays with Mom. He communicates in a few words at a time and with his AAC “talker,” and he loves with zero fine print. If you're loved by Ryan, you're loved 100%.",
          "Jennifer says she has a long list of questions saved for their someday-chats in heaven, because she knows his thoughts are big, beautiful, important ones."],
        offer: "duck", offerLine: "Want to hear one of my favorite Ryan moments? It involves a tree branch… and a quack.",
        chips: ["Tell me about Megan", "Adult independence tips"]
      }
    },
    {
      id: "unicorn", chapter: "the Introduction",
      patterns: [["why unicorn", 5], ["unicorn mama", 4], ["unicorn$", 3], ["what is a unicorn", 5]],
      reply: {
        text: ["Why “Unicorn”? Because this life is rare. Unique. And to the outside world, it sometimes looks like a myth. 🦄",
          "Being a Unicorn Mama (or caregiver, or dad, or grandma) means deciding to find the magic in the mess: glitter in your hair (sometimes literal), a horn on your head when you need to protect your child, and a heart stretched wide open to a love most people will never fully understand."],
        quote: ["In his world, I am something rare and magical. To be loved like that makes me feel almost mythical, like a unicorn.", "Chapter 17"],
        chips: ["What's the book about?", "Tell me the shark story"]
      }
    },
    {
      id: "book_info", book: "This is the one. Seventeen chapters of real life, plus the Unicorn Survival Toolkit.",
      patterns: [["the book", 3], ["about the book", 5], ["book about", 5], ["memoir", 4], ["chapters", 3], ["table of contents", 5], ["what's inside", 4], ["whats inside", 4], ["blueprint", 3], ["your book", 4], ["her book", 4], ["title", 2], ["when the blueprint", 5]],
      reply: {
        text: ["<em>When the Blueprint Burned: A Unicorn Mama Memoir of Neurodiversity, Strength, Joy &amp; Humor</em> is Jennifer's story of raising Ryan from diagnosis day through adulthood. It's honest, laugh-out-loud funny, and deeply practical.",
          "It's organized in five parts:"],
        bullets: ["<strong>The Blueprint Burns</strong>: diagnosis, grief, and a whole new map", "<strong>The Warrior Phase</strong>: meltdowns, IEP battles, and the Mama Bear Protocol", "<strong>The Caregiver's Mirror</strong>: burnout, sleep, and the 10-Minute Rescue", "<strong>The Unicorn Life</strong>: workarounds, adventures, and tiny joys", "<strong>The Unicorn Survival Toolkit</strong>: checklists, recipes, and a lullaby"],
        after: ["Every chapter ends with a <strong>Sparkle Tip</strong>, a <strong>Sanity Tip</strong>, and a <strong>Micro-Mission</strong> you can do today."],
        chips: ["Read me an excerpt", "Tell me a story from it", "Where can I buy it?"]
      }
    },
    {
      id: "audience", chapter: "the Foreword",
      book: "Written for every kind of caregiver, and a wonderful gift for the ones in your life.",
      patterns: [["who is the book for", 7], ["who is it for", 6], ["is this book for", 7], ["is the book for", 7], ["is it for me", 6], ["for dads", 6], ["dads$", 4], ["dad$", 3], ["father", 4], ["single dad", 6], ["not a mom", 6], ["i'm a dad", 6], ["i am a dad", 6], ["aging parent", 6], ["elderly parent", 6], ["dementia", 5], ["caregiver for my", 5], ["professionals", 3]],
      reply: {
        text: ["Absolutely. 💛 Jennifer writes as a “Unicorn Mama,” but the very first page of the book says this:"],
        quote: ["This book is for the mothers, fathers, daughters, sons, and partners who love someone with needs the world cannot always see. Whether you are caring for a child, an aging parent, or someone you love deeply, this space is for you.", "Foreword"],
        after: ["Dads, grandparents, siblings, teachers, therapists, and caregivers of every kind will find themselves in these pages, along with practical tools for the long haul."],
        chips: ["What's the book about?", "Read me an excerpt", "I'm running on empty"]
      }
    },
    {
      id: "excerpt", book: "That's just the opening. The whole book reads like this.",
      patterns: [["excerpt", 5], ["read me", 4], ["sample", 3], ["first chapter", 4], ["sneak peek", 5], ["preview", 3], ["introduction", 3]],
      reply: {
        text: ["Of course! Here's how the book opens, from the Introduction:"],
        storyCard: { title: "Welcome to the Club No One Applied For", chapter: "Introduction", paras: ["I didn't sign up for this. Neither did you. And yet, here we are.", "This life is hard to explain to people who haven't lived it. If you haven't worn the backpack, you don't know the weight.", "But if you've walked even a few miles on this road, you get it. You know the secret language. You know silence isn't always peaceful. Sometimes it's terrifying. You know that a good poop can be cause for a full-blown family celebration.", "So pour yourself a cup of coffee. (You'll probably have to microwave it three times before you finish it, and that's okay.) Welcome to the club. We've been waiting for you."] },
        links: [["Read more on the book page", "book.html#excerpt", "#i-book"]],
        chips: ["Tell me a funny story", "Where can I buy it?"]
      }
    },
    {
      id: "buy", book: "Tap below to get it, or to be first in line on launch day.",
      patterns: [["buy", 5], ["purchase", 5], ["order$", 3], ["amazon", 5], ["price", 4], ["how much", 3], ["where can i get", 5], ["where can i find the book", 5], ["kindle", 5], ["paperback", 5], ["hardcover", 5], ["audiobook", 5], ["get a copy", 5], ["get the book", 5], ["signed copy", 5], ["available", 2], ["release", 3], ["launch", 3], ["bulk", 4], ["book club", 4]],
      reply: function (ctx, cfg) {
        const live = cfg && cfg.book && cfg.book.amazonUrl;
        return {
          text: live
            ? ["Yay! 🎉 <em>When the Blueprint Burned</em> is available on Amazon now. Grab your copy (and maybe one for the friend who always answers at 2 a.m.)."]
            : ["<em>When the Blueprint Burned</em> is coming soon to <strong>Amazon</strong>! 🎉 Jennifer is putting the finishing touches on it now.", "Want to be first to know? Tap <strong>Notify me</strong> and you'll get the link on launch day."],
          after: ["Ordering for a support group, conference, or book club? Jennifer can help with bulk copies."],
          notify: !live,
          links: [["Ask about bulk copies", "contact.html?topic=bulk", "#i-users"]],
          chips: ["What's the book about?", "Read me an excerpt", "Free resources"]
        };
      }
    },
    {
      id: "speaking", noCta: true,
      patterns: [["speak", 4], ["speaker", 5], ["keynote", 5], ["conference", 4], ["event", 3], ["workshop", 4], ["panel", 4], ["podcast", 4], ["interview", 4], ["book jennifer", 6], ["hire", 3], ["presentation", 4], ["talk at", 5], ["booking", 4], ["fee$", 3], ["fees$", 3], ["honorarium", 4], ["retreat", 3], ["church group", 3], ["one-sheet", 5], ["one sheet", 5]],
      reply: {
        text: ["Oh, you'd be in for a treat. 🎤 Jennifer brings stories that make audiences laugh until they cry, plus tools they'll use on Monday. Her signature topics:"],
        bullets: ["<strong>When the Blueprint Burns</strong>: finding joy in the life you didn't plan (signature keynote)", "<strong>The Supreme Ruler</strong>: fearless advocacy, IEPs, and the 125% Rule", "<strong>You Are Not a Renewable Resource</strong>: the 10-Minute Rescue for caregivers", "<strong>The Mama Bear Protocol</strong>: safeguarding vulnerable loved ones", "<strong>Special Abilities</strong>: words build worlds (inclusion)", "<strong>Ask, Seek, Knock</strong>: faith in the valley"],
        after: ["She offers keynotes, workshops, panels, virtual events, and podcast interviews. She's based in Ohio and travels nationwide. Fees depend on format and travel, so the inquiry form is the best place to start."],
        links: [["See topics & formats", "speaking.html", "#i-mic"], ["Send a speaking inquiry", "speaking.html#inquire", "#i-calendar"], ["Download the speaker one-sheet", "assets/downloads/Jennifer-Schmeisser-Speaker-One-Sheet.pdf", "#i-download"]],
        chips: ["Who is Jennifer?", "What's the book about?"]
      }
    },
    {
      id: "contact", noCta: true,
      patterns: [["contact", 5], ["email", 4], ["reach her", 5], ["reach jennifer", 5], ["get in touch", 5], ["phone", 3], ["message jennifer", 5], ["facebook", 4], ["instagram", 4], ["linkedin", 4], ["threads$", 4], ["social media", 4], ["follow her", 4], ["follow jennifer", 4], ["talk to jennifer", 5], ["talk to her", 4], ["media", 2]],
      reply: function (ctx, cfg) {
        const s = (cfg && cfg.socials) || {};
        const links = [["Contact page", "contact.html", "#i-mail"]];
        if (cfg && cfg.email) links.unshift(["Email " + cfg.email, "mailto:" + cfg.email, "#i-mail"]);
        if (s.facebook) links.push(["Facebook", s.facebook, "#i-facebook"]);
        if (s.linkedin) links.push(["LinkedIn", s.linkedin, "#i-linkedin"]);
        if (s.instagram) links.push(["Instagram", s.instagram, "#i-instagram"]);
        if (s.threads) links.push(["Threads", s.threads, "#i-threads"]);
        return {
          text: ["Jennifer would love to hear from you! 💌 She reads every message personally. Here's where to find her:"],
          links: links,
          chips: ["Book Jennifer to speak", "What's the book about?"]
        };
      }
    },
    {
      id: "resources",
      patterns: [["free", 2], ["free resource", 6], ["free stuff", 5], ["anything free", 5], ["resource", 4], ["download", 4], ["handout", 4], ["printable", 4], ["worksheet", 4], ["pdf$", 4], ["freebie", 5], ["gift", 2], ["which free resource", 6], ["guide", 2]],
      reply: {
        text: ["Here are Jennifer's free printables, little gifts for weary hearts. 🎁 Tap any one to download it:"],
        resourcesAll: true,
        after: ["Psst… the <em>full</em> Unicorn Survival Toolkit (the Mama Bear Safety Checklist, the Save Your Sanity Menu, and five Ryan-approved smoothies) lives inside the book."],
        book: "The guides are the how. The book is the why, with the stories behind every tip.",
        links: [["See all free resources", "resources.html", "#i-gift"]],
        chips: ["Help me sleep better", "I want healthier habits", "I'm running on empty"]
      }
    },
    {
      id: "nav", noCta: true,
      patterns: [["where is", 2], ["where do i", 2], ["take me", 4], ["go to", 3], ["navigate", 4], ["menu$", 3], ["page$", 2], ["website", 3], ["find my way", 4], ["home page", 4], ["homepage", 4], ["site map", 5], ["sitemap", 5], ["what can i do here", 5], ["what can you do", 5], ["help$", 2]],
      reply: {
        text: ["Happy to be your tour guide! 🧭 Here's everything on the site:"],
        links: [["The Book: When the Blueprint Burned", "book.html", "#i-book"], ["About Jennifer", "about.html", "#i-heart"], ["Speaking", "speaking.html", "#i-mic"], ["Free Resources", "resources.html", "#i-gift"], ["Contact", "contact.html", "#i-mail"], ["Home", "index.html", "#i-compass"]],
        after: ["Or just ask me anything: guidance, stories, or where to find something. I'm all ears (and a horn). 🦄"],
        chips: DEFAULT_CHIPS
      }
    },

    /* ----- Guidance topics ----- */
    {
      id: "diagnosis", chapter: "Chapters 1 & 2",
      patterns: [["diagnos", 5], ["just found out", 5], ["newly", 3], ["evaluation", 3], ["evaluated", 3], ["on the spectrum", 4], ["signs of autism", 5], ["early signs", 5], ["think my child", 4], ["think my son", 4], ["think my daughter", 4], ["not talking", 3], ["speech delay", 3], ["late talker", 4], ["pdd", 4], ["where do i start", 3], ["where to start", 3], ["autism$", 2], ["autistic", 2], ["asd$", 3], ["toddler", 2], ["isnt talking", 4], ["isn't talking", 4], ["not talking yet", 5], ["year old", 2], ["lines up toys", 3]],
      reply: {
        text: ["Oh, friend. Take a breath. 💛 Jennifer remembers the doctor's lips moving and not hearing a single word. That moment after the diagnosis? <strong>You don't have to understand it. You don't have to fix it. You just have to breathe and be.</strong>", "A few things from her early days:"],
        bullets: ["Grab a Post-it and write: <strong>“We're still okay.”</strong> Stick it where you'll see it.", "Avoid Googling at 2 a.m. That WebMD wormhole ends with you diagnosing your child (and yourself) with 14 new conditions.", "Your grief is normal. You aren't grieving your child. You're grieving the life you pictured.", "Trust your gut. Everyone told Jennifer to wait. Her gut said run, and her gut was right. <strong>You are the expert on your child.</strong>", "Find the “new win”: one thing your child did today that's a victory for <em>them</em>, not the chart. Celebrate it, literally."],
        offer: "diagnosis-day", offerLine: "Would it help to hear about Jennifer's diagnosis day? It's the moment the blueprint burned.",
        chips: ["How do I handle the grief?", "IEP meeting tips", "Sensory overload"]
      }
    },
    {
      id: "grief", chapter: "Chapter 2",
      patterns: [["grief", 5], ["griev", 5], ["guilt", 4], ["guilty", 4], ["mourn", 5], ["sad$", 3], ["sadness", 3], ["not the life", 4], ["crying", 3], ["cry$", 3], ["heartbroken", 5], ["devastated", 5], ["lost the dream", 5], ["unfair", 3], ["depressed", 2], ["hopeless", 3], ["angry", 2]],
      reply: {
        text: ["Let's be really clear about something, because the guilt around this is heavy enough to crush a person: <strong>you are not grieving your child. Never your child.</strong> You're grieving the version of their life you thought was guaranteed: the easy milestones, the “normal” script.", "That grief isn't about a lack of love. As Jennifer puts it, it's about a <em>surplus of fear</em>."],
        bullets: ["It's okay to grieve the life you imagined while fiercely loving the life you have. Humans cry. Then we wipe our faces and make dinner.", "When someone says “everything happens for a reason,” you have full permission to smile politely… and then go scream into a pillow.", "You don't have to be grateful for the struggle today. You just have to survive it."],
        quote: ["The world didn't end. It just shifted, and somehow, you're going to learn how to walk beautifully in this new gravity.", "A Letter to Myself Back Then"],
        offer: "wedding-ring", offerLine: "Can I tell you about the wedding ring that vanished for seven years? It's a story about things we think are lost forever.",
        chips: ["I feel so alone", "Faith & hard days", "Tell me something funny"]
      }
    },
    {
      id: "lonely", chapter: "the Introduction",
      patterns: [["alone", 4], ["lonely", 5], ["isolated", 5], ["no one understands", 6], ["nobody understands", 6], ["nobody gets it", 6], ["no friends", 4], ["family doesn't understand", 6], ["friends disappeared", 6], ["no support", 4], ["no help", 3]],
      reply: {
        text: ["Welcome to the club no one applied for. 💛 And I mean that in the warmest way, because once you're in it, you're never really alone.", "If you haven't worn the backpack, you don't know the weight. That's why it can feel so lonely: most people around you have never carried it. But there are so many of us who have."],
        bullets: ["Look for <strong>empathy, not sympathy</strong>. Sympathy says “I'm glad I'm not you.” Empathy says “I see you.” Find the people who say the second one.", "Text one friend who gets it, even just: <em>“Hard day. Rockstar kid. Rockstar me.”</em>", "Find your people: parent groups, adaptive programs, faith communities. Jennifer found hers on old-school listservs before social media existed.", "Ask for help before you're drowning. It's Jennifer's biggest regret: not asking sooner."],
        offer: "australia", offerLine: "Can I share the moment Jennifer realized just how far-reaching this community is? It involves a phone call about… Australia.",
        chips: ["I'm running on empty", "Faith & hard days", "Tell me something uplifting"]
      }
    },
    {
      id: "supporter", chapter: "Chapter 8",
      book: "The book is a beautiful way to understand what your loved one is living, and it makes a meaningful gift.",
      patterns: [["grandmother", 6], ["grandma", 6], ["grandparent", 6], ["grandpa", 6], ["grandfather", 6], ["grandson", 6], ["granddaughter", 6], ["aunt$", 5], ["uncle$", 5], ["my friend has", 5], ["friend's son", 6], ["friend's daughter", 6], ["friend's child", 6], ["how can i help", 5], ["how do i support", 6], ["support a friend", 6], ["support my", 4], ["coworker", 4], ["neighbor", 3], ["what should i say", 5], ["what not to say", 6]],
      reply: {
        text: ["What a gift you are. 💛 Jennifer will tell you the people who made the biggest difference weren't the ones with perfect words. They were the ones who <strong>showed up</strong>. A few ideas from the book:"],
        bullets: ["<strong>Offer empathy, not sympathy.</strong> Skip the head tilt and the “you poor thing.” Try: <em>“I see you. You're doing an amazing job.”</em>", "<strong>Retire a couple of phrases:</strong> “God only gives you what you can handle” and “everything happens for a reason.” (Jennifer has feelings about these.)", "<strong>Offer something specific.</strong> “Can I take the siblings for ice cream on Saturday?” beats “Let me know if you need anything.”", "<strong>Learn their child's world:</strong> what calms them, what overwhelms them, what makes them laugh. Be curious, like Megan asking, <em>“Does it go fast?”</em>", "<strong>Answer the 2 a.m. call.</strong> Jennifer's dedication thanks the friends who always did."],
        chips: ["Words like “special needs”", "Siblings", "Tell me a story"]
      }
    },
    {
      id: "meltdown", chapter: "Chapter 6",
      patterns: [["meltdown", 6], ["melt down", 6], ["melts down", 6], ["tantrum", 5], ["public", 3], ["grocery", 4], ["store$", 3], ["stores$", 3], ["target$", 3], ["walmart", 3], ["restaurant", 3], ["staring", 4], ["stare", 4], ["judg", 4], ["embarrass", 5], ["outing", 4], ["errand", 4], ["aisle", 4], ["scream", 3], ["out in public", 5]],
      reply: {
        text: ["Oh friend, welcome to Aisle 10. Jennifer has logged more hours there than most cashiers. 💛", "First, a mindset shift: <strong>meltdowns always have a trigger</strong> (an “antecedent”). Figuring it out is equal parts detective work and desperate prayer: the buzzing lights, the shiny floor, hunger, a change in plans. Then:"],
        bullets: ["<strong>Pack a “Go Bag”:</strong> a fully charged iPad, noise-canceling headphones, and the emergency snack you only use in a crisis. When the meltdown starts, don't negotiate. Deploy the assets.", "<strong>Use a visual schedule:</strong> write the plan on paper, a dry-erase board, or the back of a receipt. 1. Post office 2. Park 3. Bank 4. Make pizza. Always end with the thing they want most.", "<strong>Say it without shame:</strong> “He has a hard time with noise.” You belong in that store, too.", "<strong>Become unembarrassable.</strong> Shame is a luxury. Let them stare. You are busy loving your child."],
        offer: "checkout", offerLine: "Want to hear what Jennifer said when a stranger asked her to “make him be quiet and hurry up”?",
        chips: ["Sensory overload", "My child gets aggressive", "Tell me a funny story"]
      }
    },
    {
      id: "aggression", chapter: "Chapters 6 & 10",
      patterns: [["aggress", 6], ["hit$", 4], ["hits$", 4], ["hitting", 5], ["punch", 5], ["bite$", 4], ["biting", 5], ["bites$", 4], ["kick", 3], ["violent", 5], ["self-injur", 6], ["self injur", 6], ["head bang", 6], ["headbang", 6], ["banging his head", 6], ["hurts himself", 6], ["hurts herself", 6], ["hurting himself", 6], ["hurting herself", 6], ["hurts others", 6]],
      reply: {
        text: ["This one is so hard, and Jennifer doesn't sugarcoat it. Ryan is a 6'1\" man who can still react like a three-year-old when things go sideways, with the strength of a linebacker. There have been police calls, a black eye on a helper, and many deep breaths. 💛", "What she's learned:"],
        bullets: ["<strong>Behavior is communication.</strong> Ryan hit out of fear and confusion, not malice, like the day his helper pulled into a KFC instead of driving home for pizza. Look for the antecedent: what changed?", "<strong>Stay calm and predictable.</strong> With Ryan, if Jennifer escalated, he escalated. A steady voice beats a stern one.", "<strong>Learn the warning signals.</strong> Ryan has a sharp “meow” that means <em>I'm dysregulated and don't have the words</em>. Your child likely has a signal too.", "<strong>Reinforce the calm.</strong> DRO (Differential Reinforcement of Other behavior) means catching them being good and rewarding it heavily.", "<strong>Plan ahead for safety.</strong> Jennifer has even briefed her local police, just in case."],
        after: ["Please lean on a behavior specialist (BCBA) or your care team here. If anyone is in immediate danger, call 911."],
        chips: ["Meltdowns in public", "Caregiver safety", "I'm running on empty"]
      }
    },
    {
      id: "sensory", chapter: "Chapters 2 & 5",
      patterns: [["sensory", 6], ["rocking", 5], ["rocks$", 3], ["rock back", 5], ["spin", 4], ["noise", 4], ["loud", 4], ["lights", 3], ["overstimulat", 6], ["weighted", 5], ["occupational therap", 5], ["ot$", 3], ["stim", 4], ["flapping", 5], ["flaps", 4], ["texture", 4], ["clothes", 2], ["headphones", 3], ["trampoline", 4], ["too much", 2], ["touch", 2]],
      reply: {
        text: ["Here's the truth no one told Jennifer at first: Ryan's rocking wasn't there to drive her crazy (even though some days it felt like it). <strong>He was regulating his own nervous system</strong> to find calm in a world that was too fast, too loud, and too demanding."],
        bullets: ["<strong>See regulation, not misbehavior.</strong> Rocking, spinning, and flapping are often a body doing its best.", "<strong>Explore OT tools:</strong> brushing protocols, weighted blankets, deep pressure, rhythmic movement. Jennifer once thought those were “overkill.” She was wrong. They were necessary.", "<strong>Movement is magic:</strong> trampolines and swings (vestibular input) helped Ryan “collect his thoughts” when words couldn't.", "<strong>Name the sense out loud:</strong> “Bumpy.” “Loud.” “Shiny.” It helps the world make sense.", "<strong>Translate for others:</strong> “He's not being rude. He's regulating his body so he can stay in this room with us.”"],
        offer: "cucumbers", offerLine: "Want to hear the cucumber story? It's the moment Jennifer learned that sensory truth doesn't always bow to logic.",
        chips: ["Meltdowns in public", "OCD & repetitive behaviors", "Help me sleep better"]
      }
    },
    {
      id: "ocd", chapter: "Chapters 3 & 15",
      patterns: [["ocd$", 6], ["obsess", 5], ["compuls", 6], ["ritual", 2], ["repetitive", 5], ["all gone", 6], ["dumping", 5], ["dumps", 4], ["emptying", 5], ["empties", 5], ["lining up", 5], ["lines up", 5], ["line things up", 5], ["same thing over", 5], ["change in routine", 5], ["routine change", 5], ["rigid", 4], ["fixat", 5], ["hoard", 4], ["stash", 4], ["hides things", 5], ["flushing", 4]],
      reply: {
        text: ["OCD is a shape-shifter, and Jennifer's house has hosted it as a very loud roommate for years. The biggest lesson she learned: <strong>look under the behavior.</strong> It's rarely about the thing itself. Often it's about closure, order, or safety."],
        bullets: ["<strong>Meet them halfway.</strong> You don't always have to eliminate a behavior. Let them have the ritual, but on your terms.", "<strong>Camouflage is key.</strong> Put the snacks in Tupperware and the milk in opaque bottles. Hide the visual trigger, and you often switch off the alarm.", "<strong>Minimalism as survival.</strong> Five shirts, three pants, one drawer per person, four forks. Less to dump means more peace (and fewer forks fished out of the trash).", "<strong>Stay neutral.</strong> Negative attention is still attention. A calm, no-words reset works better than a reaction.", "<strong>Pivot, don't just block.</strong> Love tearing paper? Here's the designated junk-mail bin."],
        offer: "milk-all-gone", offerLine: "Can I tell you how Jennifer outsmarted a $6 carton of almond milk? It's one of her favorite wins.",
        chips: ["Sensory overload", "Tell me the wedding ring story", "Meltdowns in public"]
      }
    },
    {
      id: "iep", chapter: "Chapter 7",
      patterns: [["iep", 6], ["ieps$", 6], ["504", 5], ["school", 4], ["teacher", 3], ["idea$", 1], ["fape", 6], ["lre$", 6], ["special education", 5], ["special ed", 5], ["advoca", 4], ["district", 4], ["classroom", 4], ["kindergarten", 3], ["preschool", 3], ["principal", 4], ["accommodation", 4], ["services", 2], ["due process", 6]],
      reply: {
        text: ["An IEP meeting can feel less like a collaboration and more like an FBI interrogation. 📋 Jennifer has been there, through a 2½-year legal battle, and she won. Her best advice:"],
        bullets: ["<strong>Bring your binder, your courage, and your sense of humor.</strong> Especially the humor.", "<strong>Use the 125% Rule.</strong> The system almost always negotiates downward. If your child truly needs 100% of a service, ask for 125%, then stay quiet while the room “finds the middle.” It usually lands right where it belongs.", "<strong>Learn the language:</strong> IDEA, FAPE (Free Appropriate Public Education), LRE (Least Restrictive Environment). Knowing the acronyms changes how you're heard.", "<strong>Stay calm to stay credible.</strong> You can be furious in the parking lot. Inside the room, be steel.", "<strong>Show up unannounced.</strong> Visit at lunch. Arrive early for pickup. Your presence is protection.", "<strong>You are the expert on your child.</strong> You're the only one at that table whose paycheck is love, not policy."],
        after: ["(Sparkle isn't a lawyer, so for legal questions, reach out to a special-education advocate or attorney in your state.)"],
        offer: "hangman", offerLine: "Want to hear how Jennifer survived being sworn in and questioned about her parenting? Two words: yellow legal pad.",
        chips: ["Words like “special needs”", "Caregiver safety", "Adult independence"]
      }
    },
    {
      id: "language", chapter: "Chapter 8",
      patterns: [["special needs", 6], ["label", 4], ["disabled", 4], ["disability", 3], ["handicap", 5], ["words matter", 5], ["terminology", 5], ["what to call", 5], ["special abilities", 6], ["differently abled", 6], ["person first", 6], ["identity first", 6], ["say autistic", 5], ["pity", 5], ["sympathy", 5], ["empathy", 4]],
      reply: {
        text: ["Words build worlds. 🌍 Jennifer used to feel a gut punch at “special needs.” Not because Ryan isn't special (he's extraordinary), but because the phrase seemed to whisper what he <em>couldn't</em> do instead of shouting what he could.", "So she reframes: <strong>“special abilities.”</strong> (Families use lots of different words, and that's okay. Choose the ones that honor your person.)"],
        bullets: ["<strong>The kaleidoscope vs. the straw:</strong> most of us see the world through a straw. Ryan sees it through a kaleidoscope: bright, intense, shifting, and beautiful. Our job isn't to take the kaleidoscope away. It's to be the tour guide.", "<strong>Empathy over sympathy:</strong> sympathy says “I'm glad I'm not you.” Empathy says “I see you.”", "<strong>Make a “Can-Do” list:</strong> write three things your child does better than anyone, and stick it on your mirror."],
        quote: ["When you stop acting like your child is a problem to be solved, the world stops treating them like one.", "Chapter 8"],
        offer: "artistic", offerLine: "Want a laugh? There's a little story about strangers asking, “Is he artistic?”",
        chips: ["Meltdowns in public", "Tell me about Ryan"]
      }
    },
    {
      id: "potty", chapter: "Chapter 4",
      patterns: [["potty", 6], ["toilet train", 6], ["toilet-train", 6], ["bathroom training", 6], ["diaper", 4], ["pull-up", 4], ["pullup", 4], ["poop", 3], ["accidents", 3]],
      reply: {
        text: ["With a neurotypical child, potty training is a milestone you knock out in a long weekend. With autism, Jennifer says, <strong>it's not a milestone. It's a system.</strong> 🚽"],
        bullets: ["<strong>Pick a calm stretch.</strong> She used two uninterrupted weeks of Christmas break, with no school and no therapies.", "<strong>Timers, every 30 minutes.</strong> <em>Ding</em> means go to the bathroom. Same steps, every time.", "<strong>Calm, logical outcomes.</strong> No yelling, no lectures. Clean up and reset the timer.", "<strong>“First non-preferred, then preferred.”</strong> This formula became the family framework for everything: first ten minutes of a new movie, <em>then</em> Robin Hood.", "<strong>Find your child's currency.</strong> If it's M&amp;Ms, use them. No shame in the bribery game."],
        after: ["Jennifer is honest that the structured behavioral approach she used (from Ivar Lovaas) is controversial today. Her middle ground: use what respects your child and makes sense for <em>their</em> brain, and talk it through with your child's care team."],
        offer: "bathroom-christmas", offerLine: "Want to hear about the Christmas they spent in the bathroom, toilet-paper tree and all?",
        chips: ["Thoughts on ABA?", "Celebrating small wins"]
      }
    },
    {
      id: "aba", chapter: "Chapter 4",
      patterns: [["aba$", 6], ["applied behavior", 6], ["behavior therap", 5], ["lovaas", 6], ["bcba", 5], ["behavioral", 3], ["behavior plan", 4]],
      reply: {
        text: ["Jennifer takes an honest middle-ground view here. She knows ABA (and especially Ivar Lovaas's early work) is controversial in the autism community, and she says so plainly in the book."],
        bullets: ["<strong>At its best,</strong> she sees ABA as a <em>translation tool</em>, helping a child understand how the world works in a language their nervous system can process. Not a personality transplant.", "<strong>What worked for Ryan</strong> was structure, predictability, and calm consistency. She used it to <em>teach</em> him, not to control him.", "<strong>DRO</strong> (catch them being good and reward it heavily) helped build self-control without punishment.", "<strong>It was hard on her, too.</strong> She's a jabber-jaws by nature and had to learn to fade her voice so Ryan could communicate without Mom's constant narration."],
        after: ["Every family's path is different. Choose providers who respect your child's dignity, and stay at the head of the table."],
        chips: ["Potty training", "Communication & AAC", "IEP meeting tips"]
      }
    },
    {
      id: "siblings", chapter: "Chapter 5",
      patterns: [["sibling", 6], ["sister", 4], ["brother", 4], ["daughter", 3], ["other child", 5], ["other kid", 5], ["other children", 5], ["glass child", 6], ["neurotypical child", 4], ["typical child", 4], ["twins", 2]],
      reply: {
        text: ["Siblings of kids with extra needs are sometimes called <strong>“Glass Children,”</strong> because people look right through them to see the child in crisis. Jennifer was fiercely determined not to let that happen to her daughter, Megan. 💛"],
        bullets: ["<strong>They need you, not Disney.</strong> Ten to fifteen minutes of undivided attention, like ice cream or a walk, refills their cup more than a big trip.", "<strong>Leave the autism talk at the door.</strong> No therapy talk, no venting. Just be in <em>their</em> world.", "<strong>Let them be kids, not second parents.</strong> Megan needed to be a kid, not a witness or a helper. Jennifer filled the house with her friends and sleepovers.", "<strong>Balance doesn't mean equal.</strong> One child needs the volume turned down. The other needs intentional attention <em>because</em> they don't demand it."],
        offer: "megan", offerLine: "Want to meet Megan? She's the kid who asked for a power drill for Christmas.",
        chips: ["Marriage & partnership", "I'm running on empty"]
      }
    },
    {
      id: "marriage", chapter: "Chapter 10",
      patterns: [["marriage", 6], ["married", 4], ["divorce", 6], ["husband", 5], ["wife$", 5], ["spouse", 5], ["partner", 4], ["relationship", 4], ["co-parent", 5], ["coparent", 5], ["my ex$", 5], ["ex-husband", 5]],
      reply: {
        text: ["Jennifer gets asked this one quietly, a lot: <em>“Did autism cause your divorce?”</em> Short answer: no. Longer answer: if a marriage is a Jenga tower, autism was the hyperactive toddler pulling out the blocks. The real culprit was the slow erosion that happens when the big things go unspoken. 💛"],
        bullets: ["<strong>The 5-Minute Check-In:</strong> talk to your partner for five minutes about anything <em>but</em> the kids, the schedule, or money. A show. A meme. A dream. (Single? Call a friend.)", "<strong>Takeout is cheaper than therapy.</strong> Lower the bar. Buy the pizza.", "<strong>Talk about the hard stuff</strong> before it calcifies into silence.", "<strong>Give each other grace.</strong> And if the tower falls? You can build something new. Stronger. Different. Yours.", "<strong>The “three good things” rule:</strong> when the past comes up, remember three good moments, too. They belong to you."],
        after: ["(There's a <em>very</em> Jennifer twist at the end of that chapter. Let's just say it involves a thank-you card. You'll have to read it. 😉)"],
        offer: "flour-fight", offerLine: "Want a happy family memory from those years? Picture water balloons, a whole bag of flour, and a very funny phone call.",
        chips: ["I'm running on empty", "Siblings", "Faith & hard days"]
      }
    },
    {
      id: "burnout", chapter: "Chapters 11 & 13", resource: "accountability",
      patterns: [["burnout", 6], ["burned out", 6], ["burnt out", 6], ["exhausted", 6], ["exhaustion", 6], ["tired", 4], ["running on empty", 6], ["overwhelm", 4], ["self care", 5], ["self-care", 5], ["selfcare", 5], ["me time", 5], ["no time for myself", 6], ["stressed", 5], ["stress", 4], ["can't do this", 6], ["cant do this", 6], ["drowning", 5], ["at my limit", 6], ["need a break", 5], ["anxious", 3], ["anxiety", 3], ["caregiver fatigue", 6], ["respite", 5], ["no energy", 5], ["running on fumes", 6], ["empty cup", 5], ["no time", 4], ["free time", 4], ["all too much", 5]],
      reply: {
        text: ["Oh, friend. I see you. 💛 And I'm going to say what a gruff German doctor once said to Jennifer: <strong>you are not a renewable resource.</strong> You're a battery, and if you never plug yourself in, you'll run out.", "Your kids don't need a martyr. They need you <em>alive</em>. Start ridiculously small:"],
        bullets: ["<strong>The 10-Minute Rescue:</strong> wake up ten minutes before the house. Sit in a chair with a warm drink. Don't unload the dishwasher. Don't check Instagram. Just breathe.", "<strong>Box breathing:</strong> in for 4, hold for 4, out for 4, pause for 4. It flips your body from fight-or-flight to rest-and-digest.", "<strong>The 8 PM Shutdown:</strong> when the alarm goes off, the “Office of Mom” is closed. No forms, no emails, no Googling therapies.", "<strong>Habit stacking:</strong> while the coffee brews, write down three things you're grateful for.", "<strong>Hand off the backpack</strong> whenever you can, even for an hour. Guilt-free."],
        offer: "german-doctor", offerLine: "Can I tell you about the German doctor who changed Jennifer's life (and her bloodwork) in six months?",
        extraChips: ["Do a 1-minute breathing reset with me"],
        chips: ["Help me sleep better", "Free resources"]
      }
    },
    {
      id: "breathe", noCta: true,
      patterns: [["breath", 5], ["breathing", 6], ["calm down", 5], ["panic", 5], ["panicking", 6], ["help me relax", 6], ["relax", 3], ["breathing reset", 7], ["calm me", 5], ["box breathing", 7]],
      reply: {
        text: ["Let's do it together. 🌬️ Follow the circle: breathe in as it grows, hold, then breathe out as it shrinks. Four rounds. That's it. The world will not end in this minute."],
        breathe: true,
        chips: ["That helped", "I'm running on empty", "Tell me something funny"]
      }
    },
    {
      id: "sleep", chapter: "Chapter 12", resource: "vitamin-d-magnesium",
      patterns: [["sleep", 6], ["insomnia", 6], ["night waking", 6], ["wakes up at night", 6], ["awake at", 4], ["bedtime", 5], ["up all night", 6], ["can't sleep", 6], ["cant sleep", 6], ["nap$", 3], ["melatonin", 4], ["2 am", 3], ["3 am", 3], ["2am", 4], ["3am", 4], ["wakes up", 4], ["every night", 3]],
      reply: {
        text: ["First, solidarity: Ryan didn't sleep through the night (meaning five-plus hours) until he was <strong>19 years old</strong>. Not 19 months. 19 <em>years</em>. For reelz. 😴 So if you're surviving on two-hour stretches, please know that's not a personal failing. It's a marathon with a 50-pound backpack.", "Here's what finally changed Jennifer's own sleep (from about 5 hours to an average of 7:12, Garmin-verified):"],
        bullets: ["<strong>The 8 PM shutdown:</strong> screens off at least an hour before bed. The Office of Mom is closed.", "<strong>An 8:45 PM alarm</strong> to lay out tomorrow's clothes and put on pajamas. Your body learns that “sleep clothes” means wind down.", "<strong>No phone until after the gym</strong> (or about 7 a.m.). No inviting 14 people into your bedroom first thing.", "<strong>Kitchen closes at 7 PM</strong> so your gut can rest too. Bonus: no stress-snacking.", "<strong>Make a sleep cave:</strong> dark, quiet, cool. Blackout curtains and white noise if needed."],
        after: ["For kids with chronic sleep challenges, loop in your pediatrician. Sleep issues are common and worth addressing."],
        offer: "jeopardy", offerLine: "Want to hear how Jennifer had to re-learn how to relax, with a timer and an episode of Jeopardy!?",
        chips: ["I'm running on empty", "Vitamins & supplements"]
      }
    },
    {
      id: "safety", chapter: "Chapter 9 and Resource A",
      book: "Chapter 9 and Resource A walk through the full Mama Bear Protocol. Jennifer calls it the hardest chapter she ever wrote, and it includes a content note.",
      patterns: [["safety", 5], ["safe$", 3], ["abuse", 6], ["abused", 6], ["neglect", 6], ["bruise", 6], ["caregiver", 2], ["staff", 3], ["aide$", 3], ["aides$", 3], ["helper", 2], ["provider", 2], ["camera", 5], ["protect", 4], ["supported living", 4], ["background check", 5], ["mistreat", 6], ["babysitter", 4], ["sitter$", 4], ["trust the staff", 5], ["mama bear", 5]],
      reply: {
        text: ["This is the topic closest to Jennifer's heart, and the one she wrote with the most tears. She learned, painfully, that <strong>abuse and neglect thrive in secrecy</strong>, so she turned her grief into prevention: <em>The Mama Bear Protocol.</em> 🛡️", "There's no blame and no shaming here. Only awareness, prevention, and love:"],
        bullets: ["<strong>The Pop-In Rule:</strong> show up unannounced and vary your times. Check the perimeter too, including the garage and the yard.", "<strong>Cameras</strong> at the exits and in the bedroom when someone is paid to care for your loved one at home. If a provider refuses cameras, find a new provider.", "<strong>Sacred spaces:</strong> no one in the bathroom with them, and no one in their bedroom unless they ask for help.", "<strong>Body checks</strong> at every staff change. Photograph any mark with a timestamp and report it right away. That protects them, and you.", "<strong>Engage the nosy neighbors.</strong> Make sure they know your loved one and have your number.", "<strong>Trust your gut.</strong> It's better to be “overprotective” than right and too late."],
        after: ["<strong>If someone is in danger right now, call 911.</strong> To report suspected abuse of a child in the U.S., you can call the Childhelp hotline at 1-800-422-4453. For a vulnerable adult, contact your local Adult Protective Services."],
        chips: ["Adult independence", "Building a care team", "I'm running on empty"]
      }
    },
    {
      id: "adult", chapter: "Chapters 12 & 14",
      patterns: [["adult", 4], ["grown up", 4], ["grown son", 5], ["grown daughter", 5], ["independen", 5], ["transition", 4], ["housing", 5], ["waitlist", 6], ["wait list", 6], ["waiting list", 6], ["moving out", 5], ["move out", 5], ["apartment", 4], ["future", 3], ["when i'm gone", 6], ["when i die", 6], ["guardianship", 6], ["aging out", 6], ["age out", 6], ["residential", 5], ["day program", 5], ["life skills", 5], ["group home", 5]],
      reply: {
        text: ["This is where Jennifer's three decades really shine. Ryan is in his thirties now, living in his own apartment with support staff, and thriving in creating his best life. Getting there took patience, paperwork, and a whole lot of misplaced forks. 🏡"],
        bullets: ["<strong>Get on the waitlists NOW.</strong> Even if your child is ten. Even if you think “I'll never do that.” Jennifer's wait for 24/7 residential support was <em>two years</em>. Better to have the option and say no than to be in crisis with nowhere to turn.", "<strong>Teach independence through messy chores:</strong> feeding the dog, checking the mailbox, putting away dishes. It takes longer than doing it yourself, and it's worth every crooked bed.", "<strong>Handing over the reins isn't taking your hands off the wheel.</strong> Keep showing up unannounced.", "<strong>Build the village, train the village, and sometimes fire the village.</strong> Cherish the angels (like Dr. K and Dr. Mike) who see your child's humanity.", "<strong>Expect your own big feelings</strong> when the house goes quiet. Jennifer panicked at the silence before she learned to breathe in it."],
        after: ["Her giant dream? An integrated community where seniors, adults with disabilities, caregivers, and typical families live side by side. Imagine the cookouts."],
        offer: "oatmeal", offerLine: "Want to see what “being the Supreme Ruler” looks like on a hard morning? There's a bowl of oatmeal involved.",
        chips: ["Caregiver safety", "When the house gets quiet", "Help me sleep better"]
      }
    },
    {
      id: "quiet_house", chapter: "Chapter 12",
      patterns: [["empty nest", 6], ["house is quiet", 6], ["house gets quiet", 6], ["quiet house", 6], ["who am i now", 6], ["lost my identity", 6], ["identity", 3], ["what now", 3], ["myself again", 5], ["so quiet", 5], ["quiet now", 5], ["moved out", 4]],
      reply: {
        text: ["When Ryan moved out, Jennifer stood in her silent living room and… panicked. For thirty years her body had been tuned to his frequency: listening for his breathing, the thump of a meltdown, the fridge at 2 a.m. Now? Silence. 🤍", "It took time to decelerate, to drink coffee while it was actually hot and shower at human speed. And slowly, she learned to be <em>Jennifer</em> again, not just “Ryan's Mom.”"],
        bullets: ["Expect your nervous system to need time. Stillness isn't a threat, even if it feels like one.", "Reclaim one tiny sensory pleasure a day: hot coffee, a long shower, a book.", "Ask yourself: what did I used to love before I had to fight the world? (For Jennifer, it was reading. She finished 65 books last year!)", "You are allowed to grow outside your caregiver identity. In fact, you need to."],
        offer: "hot-coffee", offerLine: "Want to hear about Jennifer's “bathroom revelation”? It's funnier than it sounds.",
        chips: ["Faith & hard days", "I want healthier habits"]
      }
    },
    {
      id: "village", chapter: "Chapter 14",
      patterns: [["care team", 5], ["building a care team", 6], ["village", 5], ["therapist", 3], ["find good", 4], ["bad provider", 5], ["fire the", 4], ["hire help", 5], ["agency", 4], ["case manager", 4]],
      reply: {
        text: ["People love to say “it takes a village.” Jennifer's version: <strong>you have to build the village, train the village, and sometimes fire the village.</strong> 👑 (She calls herself the Supreme Ruler of All Things Ryan, with a smile, but she means it.)"],
        bullets: ["<strong>Value experts, but keep the steering wheel.</strong> Listen, research, ask questions. Sometimes agree, sometimes say no.", "<strong>Watch the bigger picture.</strong> If a professional seems anxious, impatient, or dismissive, don't force it. Pack up and find a new one.", "<strong>Find the angels.</strong> Jennifer waited almost a year for a podiatrist who turned out to be nervous around Ryan, so she moved on and found Dr. K, “a genuine angel.”", "<strong>Partner with the good ones.</strong> Share what works. Bring donuts on your pop-ins.", "<strong>Show up.</strong> You can't celebrate what you don't know, and you can't fix what you don't see."],
        offer: "oatmeal", offerLine: "Want a sweet example of partnering with the village? It starts at 6:30 a.m. with “Mommy, in a minute?”",
        chips: ["Caregiver safety", "Doctor & dentist visits"]
      }
    },
    {
      id: "faith", chapter: "Chapter 13",
      patterns: [["god$", 5], ["faith", 6], ["pray", 5], ["prayer", 6], ["church", 5], ["jesus", 6], ["christ", 4], ["psalm", 6], ["bible", 5], ["spiritual", 5], ["why me", 5], ["catholic", 5], ["scripture", 5], ["everything happens for a reason", 6], ["only what you can handle", 6], ["handle$", 1]],
      reply: {
        text: ["If faith is part of your life, Jennifer has a lot of heart for you here. 🙏 She'll tell you honestly: she got angry at God. She yelled. She questioned. She sat in silence waiting for answers that didn't come when she wanted them to. <strong>And still, He stayed.</strong>", "She doesn't believe “God only gives you what you can handle.” God never promised a life without struggle. But He doesn't abandon us in it. He helps us get over it, under it, around it, and through it."],
        bullets: ["She reads <strong>Psalm 23</strong> as if it were written for the weary caregiver: <em>“He makes me lie down in green pastures”</em> (even if He has to send a gruff German doctor to do it).", "<strong>Isaiah 43:1</strong>: He knows your name. <strong>1 Peter 2:9</strong>: you are chosen.", "<strong>Ask, seek, knock:</strong> faith isn't passive. Sometimes the hardest part isn't hearing the knock. It's opening the door."],
        quote: ["No matter how small your candle feels, it has not gone out.", "Chapter 2"],
        chips: ["I feel so alone", "I'm running on empty", "Tell me something uplifting"]
      }
    },
    {
      id: "food", chapter: "Chapter 2 and Resource C", resource: "brain-boosters",
      patterns: [["diet", 5], ["gluten", 6], ["casein", 6], ["gfcf", 6], ["dairy", 4], ["gut$", 5], ["gut health", 6], ["picky", 5], ["eating", 4], ["food", 4], ["nutrition", 5], ["smoothie", 6], ["recipe", 5], ["meal", 3], ["cook", 3], ["snack", 3], ["muffin", 4], ["constipat", 5], ["digest", 5], ["stomach", 4], ["tummy", 4], ["healthy eating", 6], ["clean eating", 6]],
      reply: {
        text: ["Jennifer learned fast that autism isn't just about the brain. It's about the whole body. When Ryan's digestion was a mess, his behaviors were a mess (and the gas was <em>lethal</em>). Cleaning up the family's diet changed their lives. 🥑"],
        bullets: ["<strong>Go slow and get help.</strong> Their elimination diet started with three foods, adding one at a time, alongside a nutritionist. Jennifer was stressing over riboflavin while other moms stressed over stocking stuffers.", "<strong>Cut the C.R.A.P.:</strong> Chemicals, Refined sugar and flour, Artificial sweeteners and colors, and Preservatives.", "<strong>Hide the greens in chocolate.</strong> Avocado, banana, cocoa, and spinach make a smoothie kids actually drink.", "<strong>Batch and freeze.</strong> Zucchini muffins, sliced and frozen four at a time, became Ryan's favorite “sammich.”", "<strong>Pick your food battles.</strong> Some nights, takeout wins. Unicorn families do it differently."],
        after: ["Always check with your child's doctor before big diet changes."],
        offer: "gf-gas", offerLine: "Want the (hilarious) story of the Great Gluten-Free Gas Experiment? Fair warning: it involves cracking minivan windows in an Ohio winter.",
        chips: ["Brain foods", "Free resources"]
      }
    },
    {
      id: "brain", chapter: "Chapter 13", resource: "brain-foods",
      patterns: [["brain", 5], ["memory", 4], ["focus", 4], ["concentrat", 5], ["brain fog", 6], ["foggy", 5], ["mental clarity", 6], ["turmeric", 6], ["blueberr", 5], ["omega", 4], ["cognitive", 5]],
      reply: {
        text: ["Love your brain and it'll love you back! 🧠 From Jennifer's wellness toolkit, here are 10 quick ways to care for it:"],
        bullets: ["Eat a brain-friendly diet heavy on veggies, and <strong>drink your water</strong>", "Kill the ANTs (automatic negative thoughts), because your mind is always eavesdropping on your self-talk", "Move your body to boost blood flow", "Get your brain nutrients (omega-3s, B vitamins)", "Find a positive peer group (“if you're the smartest one in the room, you're in the wrong room!”)", "Keep a clean, organized environment", "Catch your Zzz's", "Protect your head: seatbelts and helmets", "Keep learning something new", "Manage stress, because chronic stress is hard on the brain"],
        after: ["Jennifer's own morning ritual is turmeric tea: turmeric, a pinch of pepper (to help absorb it), honey, coconut oil, and hot water. ☕"],
        extraResource: "love-your-brain",
        chips: ["Healthy eating & gut", "I want healthier habits"]
      }
    },
    {
      id: "habits", chapter: "Chapter 13", resource: "accountability",
      patterns: [["habit", 6], ["goal", 5], ["accountab", 6], ["journal", 6], ["morning routine", 6], ["motivation", 5], ["consisten", 4], ["new year", 4], ["discipline", 4], ["mindful", 5], ["meditat", 6], ["gratitude", 5], ["hydrat", 5], ["drink more water", 6], ["water$", 3], ["healthier", 4], ["exercise", 4], ["gym", 3], ["routine", 2]],
      reply: {
        text: ["Small hinges swing big doors. 🚪 Jennifer's whole health turnaround started with just ten minutes in a chair. Here's how she builds habits that actually stick, even when life is chaos:"],
        bullets: ["<strong>Habit stacking:</strong> don't carve out a new 30-minute block (you don't have it). Stack the new habit onto something you already do, like three gratitudes while the coffee brews or ten deep breaths before you start the car.", "<strong>Make SMART goals:</strong> specific, measurable, attainable, relevant, timely. Set an <em>action</em> goal (“I'll walk 20 minutes, 3x a week”) and an <em>outcome</em> goal (“I'll feel more energized in a month”).", "<strong>Find the emotion behind the mindless habit.</strong> Opening the cupboard when you're not hungry? Try five deep breaths instead.", "<strong>Five minutes of journaling:</strong> three gratitudes, two things you're proud of, one thing to improve.", "<strong>Hydrate:</strong> 64 ounces a day. (Coffee doesn't count. Sorry.)"],
        chips: ["Brain foods", "Help me sleep better", "I'm running on empty"]
      }
    },
    {
      id: "supplements", chapter: "Chapter 12", resource: "vitamin-d-magnesium",
      patterns: [["vitamin", 6], ["magnesium", 6], ["supplement", 6], ["vitamin d", 7], ["calcium", 4], ["multivitamin", 6]],
      reply: {
        text: ["Great question. Jennifer has a one-page guide on exactly this! 🌞🌙 The short version:"],
        bullets: ["<strong>Vitamin D</strong> is fat-soluble, so take it with a meal that has healthy fats (avocado, nuts, olive oil, salmon), ideally in the morning or around noon.", "<strong>Magnesium</strong> has a calming effect, so many people take it in the evening, with food to avoid tummy upset.", "<strong>They're a good pair:</strong> magnesium supports vitamin D's work in the body.", "<strong>Pill vs. powder:</strong> both work. Powders (like magnesium glycinate or citrate) can be gentler on the stomach."],
        after: ["<strong>Important:</strong> I'm not a doctor, and neither is Jennifer. Please check with your healthcare provider before starting supplements, especially for children or anyone on medication."],
        chips: ["Help me sleep better", "Brain foods"]
      }
    },
    {
      id: "communication", chapter: "Chapters 2 & 17",
      patterns: [["nonverbal", 6], ["non-verbal", 6], ["non verbal", 6], ["aac$", 6], ["talker", 5], ["speech", 4], ["communicat", 5], ["sign language", 6], ["language delay", 6], ["can't talk", 5], ["doesn't talk", 5], ["doesn't speak", 5], ["doesnt speak", 5], ["doesnt talk", 5], ["can't speak", 5], ["cant speak", 5], ["minimally verbal", 6], ["meow", 6], ["first words", 4], ["words$", 2], ["picture schedule", 5], ["visual schedule", 5]],
      reply: {
        text: ["Before language, Ryan communicated with his body. Dragging Jennifer to the fridge was his sentence for “I'm hungry.” Every form of communication counts. 💬"],
        bullets: ["<strong>Pair signs with words.</strong> Jennifer taught simple signs (hungry, more, thank you) paired carefully with spoken words. Slowly the movements met his mouth, then came sounds, then words.", "<strong>Embrace AAC.</strong> At 31, Ryan used his “talker” to say a full paragraph for the first time. It's never too late.", "<strong>Treat them as smart and capable.</strong> Visual schedules (on paper, a dry-erase board, or the back of a receipt) show how much more they understand than people give them credit for.", "<strong>Behavior is communication.</strong> Ryan's sharp “meow” means <em>I'm dysregulated and don't have the words</em>. Learn your child's signals.", "<strong>Fade your voice.</strong> Jennifer had to stop narrating everything so Ryan could communicate with the world without her."],
        offer: "bacon-eggs", offerLine: "Can I tell you about the bacon-and-eggs breakthrough? To the world it was a breakfast order. To Jennifer, it was the Super Bowl.",
        chips: ["Celebrating small wins", "Meltdowns in public"]
      }
    },
    {
      id: "doctors", chapter: "Chapters 6 & 14",
      patterns: [["doctor", 4], ["dentist", 6], ["dental", 6], ["appointment", 5], ["pediatrician", 5], ["podiatrist", 6], ["haircut", 6], ["hospital", 4], ["er$", 2], ["check-up", 5], ["checkup", 5], ["blood draw", 6], ["medical visit", 6], ["teeth", 4]],
      reply: {
        text: ["Doctor and dentist visits can be their own special kind of adventure. Jennifer's approach: <strong>tiny steps, the right people, and smart timing.</strong> 🩺"],
        bullets: ["<strong>Desensitize in baby steps.</strong> Ryan's dentist visits started as weekly Wednesdays: sit in the chair, then count teeth, and months later a cleaning.", "<strong>Keep a steady rhythm.</strong> Ryan does cleanings every three months, because longer gaps made his behaviors spiral.", "<strong>Watch your timing.</strong> If announcing an appointment early causes anxiety, don't. Jennifer asks helpers not to mention them until it's time.", "<strong>Find the angels.</strong> If a provider is anxious or dismissive, move on. Keep looking for your Dr. Mike or Dr. K.", "<strong>Celebrate like it's the Olympics.</strong> Jennifer sent Ryan's first bitewing X-rays to family and friends. Proudly."],
        offer: "dentist", offerLine: "Want to hear the dentist story? It took about 28 years and one saint of a man named Dr. Mike.",
        chips: ["Building a care team", "Celebrating small wins"]
      }
    },
    {
      id: "medical", noCta: true,
      patterns: [["medication", 6], ["meds$", 6], ["medicine", 5], ["dosage", 6], ["dose", 5], ["prescri", 6], ["cure", 5], ["treatment", 4], ["side effect", 6], ["psychiatrist", 5], ["vaccin", 6]],
      reply: {
        text: ["That's an important question, and it deserves a real medical professional. I'm an AI book companion, not a doctor, so I won't give medical advice. 💛", "What I <em>can</em> share is Jennifer's approach: she researched medications that were recommended, asked lots of questions, and sometimes said no. Experts are essential, but <strong>you stay at the head of the table</strong>. Bring your questions (and your binder) to your child's doctor."],
        chips: ["Building a care team", "IEP meeting tips", "I'm running on empty"]
      }
    },
    {
      id: "joy", chapter: "Chapter 17",
      patterns: [["joy", 5], ["celebrate", 5], ["win$", 4], ["wins$", 4], ["victory", 5], ["victories", 5], ["milestone", 5], ["progress", 4], ["small things", 4], ["small wins", 6], ["proud", 4], ["good news", 5], ["positive", 3], ["happy", 3], ["uplifting", 5], ["hope$", 3], ["hopeful", 4], ["fun$", 3], ["activities", 4], ["adaptive sports", 6], ["playing", 3], ["games", 3]],
      reply: {
        text: ["Now we're talking! 🎉 <strong>Tiny joys ARE huge victories.</strong> Don't let anyone else define what a milestone looks like for your family. If it feels like a victory to you, it is a victory. Celebrate it loudly."],
        bullets: ["<strong>The “Weird Win” celebration:</strong> used a utensil? Tolerated a loud noise? Pooped in the right place? Text a friend: <em>“I am a rockstar and so is my kid.”</em>", "<strong>Rig the deck.</strong> Jennifer tucks extra Jacks into the Slapjack pile so Ryan gets more chances to win. The goal of play is connection and joy.", "<strong>Say yes to an adventure.</strong> Adaptive sports programs, tandem bikes, adaptive dance class (yes, Jennifer does the Chicken Dance). Even four minutes counts.", "<strong>Thank the kind ones.</strong> A patient waitress, a smiling cashier. Tell them. It rewards the good in the world."],
        offer: "shark", offerLine: "Want to hear about Jennifer's favorite game of all? It's called “Play the Shark.”",
        chips: ["Tell me a funny story", "What's the book about?"]
      }
    },
    {
      id: "holidays", chapter: "Chapters 4 & 15",
      patterns: [["holiday", 6], ["christmas", 5], ["thanksgiving", 6], ["birthday", 5], ["party", 4], ["family gathering", 6], ["relatives", 5], ["vacation", 5], ["travel", 4], ["easter", 5], ["halloween", 5]],
      reply: {
        text: ["For years, holidays felt more like recovery than celebration: loud music, itchy clothes, unpredictable relatives, and Jennifer sweating through her festive sweater. 🎄 So the family threw the expectations out the window."],
        bullets: ["<strong>Pajamas are the official holiday uniform.</strong> No itchy sleeves, no stiff shoes.", "<strong>Make your own menu,</strong> whatever your child tolerates and whatever makes you feel like family.", "<strong>Write a visual schedule</strong> for the day, and end with the thing they love most.", "<strong>No pressure to entertain.</strong> Swap everyone else's expectations for your own peace.", "<strong>Have an exit plan,</strong> and use it without apology."],
        offer: "bathroom-christmas", offerLine: "Want to hear about the most unusual Christmas tradition ever? There's a tree… decorated with toilet paper.",
        chips: ["Meltdowns in public", "Sensory overload"]
      }
    },
    {
      id: "pets", chapter: "Chapter 17",
      patterns: [["dog", 4], ["ginger", 5], ["zoe$", 5], ["pet$", 4], ["pets$", 4], ["golden retriever", 6], ["puppy", 4]],
      reply: {
        text: ["The family's animals are the silent witnesses to all the magic! 🐕 First there was <strong>Zoe</strong>, a beautiful, patient, forgiving retriever. (Jennifer was once recognized at church as “Zoe's mom from the dog park.”)", "Now there's <strong>Ginger</strong>, a golden rescue who arrived afraid of everything: the TV, music, even the American flag. Today she's Ryan's buddy. Dogs have a way of learning courage by watching love."],
        chips: ["Tell me about Ryan", "Tell me a funny story"]
      }
    }
  ];

  /* ---------------- Special replies ---------------- */
  const crisis = {
    noCta: true,
    text: ["I'm really glad you told me. 💛 What you're feeling matters, and you deserve support from a real person right now."],
    crisisCard: true,
    after: ["You don't have to carry this alone. Jennifer's words for you tonight: <em>no matter how small your candle feels, it has not gone out.</em>"],
    chips: ["Do a 1-minute breathing reset with me"]
  };

  const fallback = [
    {
      text: ["Hmm, I'm not sure I caught that. I'm still a <strong>demo</strong> version of Sparkle, so I don't know everything yet. 🦄 The finished version will be trained on Jennifer's full manuscript.", "Here's what I'm best at right now:"],
      bullets: ["Practical guidance on things like diagnosis, meltdowns, IEPs, sensory needs, sleep, and burnout", "Stories from the book (funny or heartfelt, your pick)", "Free resources, the book, speaking, and how to reach Jennifer"],
      chips: DEFAULT_CHIPS
    },
    {
      text: ["I want to give you a good answer, and I don't quite have one for that yet. 💛 Could you try asking it another way? Or pick one of these:"],
      chips: ["Tell me a funny story", "I'm running on empty", "What's the book about?", "Contact Jennifer"]
    }
  ];

  const welcome = {
    noCta: true,
    text: ["Hi friend! I'm <strong>Sparkle</strong> 🦄, the AI book companion for Jennifer's memoir, <em>When the Blueprint Burned</em>.",
      "I've soaked up every page, so I can share practical ideas from her 30+ years raising Ryan, tell you a story or two (some involve air vents), point you to free resources, or help you find your way around. <strong>What's on your heart today?</strong>"],
    chips: DEFAULT_CHIPS
  };

  const bookNotes = [
    "Loved that? There are dozens more stories like it in the book, told in Jennifer's own voice.",
    "That's the short version. The full story, with all the good details, is in the book.",
    "Want more where that came from? The book is full of them, from the air vents to the trampoline park."
  ];

  return { stories, resources, intents, crisis, fallback, welcome, bookNotes, DEFAULT_CHIPS };
})();
