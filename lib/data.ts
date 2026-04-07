export type Locale = "en" | "uz" | "ru";

export interface Location {
  id: string;
  slug: string;
  category: string;
  region: string;
  /**
   * Path to the cover image.
   * Convention: /images/locations/[slug]/cover.jpg
   * Drop the real photo at that path inside /public to replace the placeholder.
   */
  coverImage: string;
  lat: number;
  lng: number;
  youtubeUrl: string;
  youtubeVrUrl: string;
  /** Direct Google Maps link — if set, used instead of coordinate-based URL */
  googleMapsUrl?: string;
  /** Direct Yandex Maps link — if set, used instead of coordinate-based URL */
  yandexMapsUrl?: string;
  /** Direct directions link (optional) */
  directionsUrl?: string;
  didYouKnow: Record<Locale, string>;
  translations: Record<
    Locale,
    {
      name: string;
      shortDescription: string;
      fullDescription: string;
    }
  >;
  /**
   * Gallery image paths.
   * Convention: /images/locations/[slug]/gallery-1.jpg, gallery-2.jpg …
   * Drop real photos at those paths inside /public.
   */
  images: string[];
  tags: string[];
}

export const locations: Location[] = [
  // ─── 1. Registan Square ─────────────────────────────────────────────────────
  {
    id: "1",
    slug: "registan-square",
    category: "historical",
    region: "Samarkand",
    coverImage: "/images/locations/registan-square/cover.jpg",
    lat: 39.6547,
    lng: 66.9758,
    youtubeUrl: "https://www.youtube.com/watch?v=PLACEHOLDER_REGISTAN",
    youtubeVrUrl: "https://www.youtube.com/watch?v=PLACEHOLDER_REGISTAN_VR",
    didYouKnow: {
      en: "The word 'Registan' means 'Sandy Place' in Persian. It once served as a public square where royal proclamations were read, executions took place, and the great trade caravans of the Silk Road assembled.",
      uz: "'Registon' so'zi forscha 'Qumli Joy' degan ma'noni anglatadi. Bu yerda qirollik farmoyishlari e'lon qilingan, ijro etilgan va Ipak yo'lining ulkan karvonlari to'plangan.",
      ru: "Слово 'Регистан' означает 'Песчаное место' на персидском языке. Здесь зачитывались королевские указы, совершались казни и собирались великие торговые караваны Шёлкового пути.",
    },
    translations: {
      en: {
        name: "Registan Square",
        shortDescription:
          "The iconic heart of ancient Samarkand, adorned with three magnificent madrasahs.",
        fullDescription:
          "Registan Square is one of the most breathtaking public squares in the world. Located in the heart of the ancient city of Samarkand, it is framed by three magnificent madrasahs: Ulugh Beg Madrasah (1420), Sher-Dor Madrasah (1636), and Tilya-Kori Madrasah (1660). The ensemble is a UNESCO World Heritage Site and represents the pinnacle of Timurid architecture, featuring stunning mosaic tilework, soaring minarets, and golden domes that glow at sunset.\n\nEach of the three madrasahs surrounding the square has its own distinctive character. The Ulugh Beg Madrasah, the oldest of the three, was built by the astronomer-king Ulugh Beg and once housed one of the finest Islamic universities in the world. The Sher-Dor Madrasah, meaning 'Having Tigers', is notable for its portal featuring two lions (or tigers) chasing deer — an unusual motif for Islamic architecture. The Tilya-Kori Madrasah, whose name means 'Gilded', features an interior mosque decorated with gold leaf that dazzles visitors to this day.",
      },
      uz: {
        name: "Registon Maydoni",
        shortDescription:
          "Uchta muhtasham madrasasi bilan bezatilgan qadimiy Samarqandning ramziy markazi.",
        fullDescription:
          "Registon maydoni dunyodagi eng hayratlanarli jamoat maydonlaridan biridir. Samarqandning qadimiy shahar markazida joylashgan bo'lib, uchta muhtasham madrasadan iborat: Ulug'bek madrasasi (1420), Sherdor madrasasi (1636) va Tillakori madrasasi (1660). Majmua YuNESKO Jahon merosi ro'yxatiga kiritilgan bo'lib, Temuriylar me'morchiligining cho'qqisini ifodalaydi.\n\nMaydoni o'rab turgan uchta madrasaning har biri o'ziga xos xususiyatga ega. Uchtalasidan eng qadimiysi bo'lgan Ulug'bek madrasasi astronom-podshoh Ulug'bek tomonidan qurilgan va bir vaqtlar dunyodagi eng yaxshi islom universitetlaridan biriga uy bo'lgan. 'Sherlarga ega' ma'nosini anglatuvchi Sherdor madrasasi ikkita sher (yoki yo'lbars) kiyikni quvayotganini tasvirlovchi portal bilan ajralib turadi. 'Oltin bilan qoplangan' ma'nosini anglatuvchi Tillakori madrasasida bugungi kunda ham tashrif buyuruvchilarni lol qoldiradigan oltin barg bilan bezatilgan ichki masjid mavjud.",
      },
      ru: {
        name: "Площадь Регистан",
        shortDescription:
          "Знаковое сердце древнего Самарканда, украшенное тремя великолепными медресе.",
        fullDescription:
          "Площадь Регистан — одна из самых захватывающих общественных площадей мира. Расположенная в сердце древнего города Самарканда, она обрамлена тремя великолепными медресе: медресе Улугбека (1420), медресе Шер-Дор (1636) и медресе Тилля-Кари (1660). Ансамбль включён в список Всемирного наследия ЮНЕСКО и представляет вершину тимуридской архитектуры.\n\nКаждое из трёх медресе, окружающих площадь, имеет свой неповторимый характер. Медресе Улугбека, самое старое из трёх, было построено царём-астрономом Улугбеком и некогда было одним из лучших исламских университетов мира. Медресе Шер-Дор, что означает 'Имеющее тигров', примечательно своим порталом с двумя львами (или тиграми), преследующими оленей — необычный мотив для исламской архитектуры. Медресе Тилля-Кари, название которого означает 'Позолоченное', отличается внутренней мечетью, украшенной сусальным золотом.",
      },
    },
    images: [
      "/images/locations/registan-square/cover.jpg",
      "/images/locations/registan-square/gallery-1.jpg",
      "/images/locations/registan-square/gallery-2.jpg",
      "/images/locations/registan-square/gallery-3.jpg",
    ],
    tags: ["UNESCO", "Timurid", "Madrasah", "Architecture", "Silk Road"],
  },

  // ─── 2. Shah-i-Zinda ────────────────────────────────────────────────────────
  {
    id: "2",
    slug: "shah-i-zinda",
    category: "mausoleum",
    region: "Samarkand",
    coverImage: "/images/locations/shah-i-zinda/cover.jpg",
    lat: 39.6681,
    lng: 66.9897,
    youtubeUrl: "https://www.youtube.com/watch?v=PLACEHOLDER_SHAHIZINDA",
    youtubeVrUrl: "https://www.youtube.com/watch?v=PLACEHOLDER_SHAHIZINDA_VR",
    didYouKnow: {
      en: "Shah-i-Zinda is believed to be the burial place of Qusam ibn Abbas, a cousin of Prophet Muhammad, who is said to have brought Islam to Samarkand in the 7th century. According to legend, he never died but lives on in a well beneath the site.",
      uz: "Shoh-i-Zinda Payg'ambar Muhammadning amakivachchasi Qusam ibn Abbosning dafn joyi deb ishoniladi. Rivoyatlarga ko'ra, u hech qachon o'lmagan, balki makon ostidagi quduqda davom etmoqda.",
      ru: "Считается, что Шах-и-Зинда является местом захоронения Кусама ибн Аббаса, двоюродного брата Пророка Мухаммада, который, по преданию, принёс ислам в Самарканд в VII веке. По легенде, он никогда не умирал, но продолжает жить в колодце под этим местом.",
    },
    translations: {
      en: {
        name: "Shah-i-Zinda Necropolis",
        shortDescription:
          "A stunning avenue of mausoleums with vibrant turquoise tile work spanning a thousand years.",
        fullDescription:
          "Shah-i-Zinda, meaning 'The Living King', is an extraordinary necropolis located in the northeastern part of Samarkand. It consists of a series of mausoleums and other ritual buildings arranged in a magnificent avenue. Built over a period of nearly a thousand years (11th–19th centuries), the ensemble showcases some of the finest examples of decorative tilework in Central Asia, with brilliant turquoise, cobalt, and gold mosaics adorning every surface.\n\nThe necropolis contains approximately 20 mausoleums, many built for the relatives and courtiers of Timur the Great. The site is considered deeply sacred by Muslims, who have made pilgrimages here for centuries. The street of mausoleums is divided into three groups: the lower, middle, and upper sections, each from a different historical period. The tilework here is considered among the most spectacular in the Islamic world, with intricate geometric and floral patterns glowing in every shade of blue.",
      },
      uz: {
        name: "Shoh-i-Zinda Yodgorlik Majmuasi",
        shortDescription:
          "Ming yil davomida qurilgan, ajoyib moviy kafel bezaklari bilan to'la maqbaralar xiyoboni.",
        fullDescription:
          "Shoh-i-Zinda, ya'ni 'Tirik Shoh', Samarqandning shimoli-sharqiy qismida joylashgan noyob yodgorlik majmuasidir. U muhtasham xiyobon bo'ylab joylashgan bir qator maqbara va boshqa marosim binolaridan iborat. Deyarli ming yil davomida (XI–XIX asrlar) qurilgan majmua Markaziy Osiyodagi eng nozik bezak ishlari namunalarini o'z ichiga oladi.\n\nYodgorlik majmuasi taxminan 20 ta maqbarani o'z ichiga oladi, ko'pchiligi Buyuk Temurning qarindoshlari va saray amaldorlari uchun qurilgan. Bu joy musulmonlar tomonidan muqaddas joy sifatida qadrlangan bo'lib, asrlar davomida ziyoratgohga aylangan. Maqbaralar ko'chasi uch guruhga bo'lingan: quyi, o'rta va yuqori bo'limlar, ularning har biri turli tarixiy davrga tegishli.",
      },
      ru: {
        name: "Некрополь Шах-и-Зинда",
        shortDescription:
          "Потрясающая аллея мавзолеев с яркой бирюзовой плиточной работой, охватывающей тысячу лет.",
        fullDescription:
          "Шах-и-Зинда, что означает 'Живой царь', — это необыкновенный некрополь, расположенный в северо-восточной части Самарканда. Он состоит из серии мавзолеев и других ритуальных сооружений, выстроенных в великолепную аллею. Построенный на протяжении почти тысячи лет (XI–XIX века), ансамбль демонстрирует одни из лучших образцов декоративной плиточной работы в Центральной Азии.\n\nНекрополь содержит около 20 мавзолеев, многие из которых построены для родственников и придворных Тимура Великого. Это место считается глубоко священным для мусульман, которые совершают сюда паломничества на протяжении веков. Улица мавзолеев делится на три группы: нижнюю, среднюю и верхнюю секции, каждая из разных исторических периодов.",
      },
    },
    images: [
      "/images/locations/shah-i-zinda/cover.jpg",
      "/images/locations/shah-i-zinda/gallery-1.jpg",
      "/images/locations/shah-i-zinda/gallery-2.jpg",
    ],
    tags: ["Necropolis", "Mausoleum", "Tilework", "UNESCO", "Sacred"],
  },

  // ─── 3. Kalon Minaret ───────────────────────────────────────────────────────
  {
    id: "3",
    slug: "kalon-minaret",
    category: "architecture",
    region: "Bukhara",
    coverImage: "/images/locations/kalon-minaret/cover.jpg",
    lat: 39.7745,
    lng: 64.4166,
    youtubeUrl: "https://www.youtube.com/watch?v=PLACEHOLDER_KALON",
    youtubeVrUrl: "https://www.youtube.com/watch?v=PLACEHOLDER_KALON_VR",
    didYouKnow: {
      en: "The Kalon Minaret served not only as a call-to-prayer tower but also as a lighthouse for caravans crossing the desert at night. Criminals were reportedly executed by being thrown from its top — earning it the grim nickname 'Tower of Death'.",
      uz: "Kalon minorasi nafaqat azon aytish minorasi, balki tunda cho'lni kesib o'tayotgan karvonlar uchun mayoq vazifasini ham bajargan. Rivoyatlarga ko'ra, jinoyatchilar uning tepasidan otib jazolangan — bu unga 'O'lim Minorasi' degan dahshatli laqab bergan.",
      ru: "Минарет Калян служил не только башней для призыва к молитве, но и маяком для ночных торговых караванов, пересекавших пустыню. По преданию, преступников казнили, сбрасывая их с вершины — за это он получил мрачное прозвище 'Башня смерти'.",
    },
    translations: {
      en: {
        name: "Kalon Minaret",
        shortDescription:
          "The Great Minaret of Bukhara — a 900-year-old tower that even Genghis Khan spared.",
        fullDescription:
          "The Kalon Minaret, meaning 'The Great' in Tajik, is one of the most remarkable monuments in Central Asia. Built in 1127 by the Karakhanid ruler Arslan Khan, this 47-meter-tall tower of fired brick has stood for nearly 900 years. It is said that when Genghis Khan entered Bukhara in 1220, he was so impressed by the minaret that he ordered it to be spared from destruction. The minaret is decorated with 14 different ornamental bands of terracotta brickwork.\n\nThe tower tapers slightly from its massive circular base, which is 9 meters in diameter, to its lantern-like top decorated with a cornice of kite-shaped brickwork. The interior contains a helical staircase with 104 steps leading to the top, where the muezzin would traditionally call the faithful to prayer. Together with the Kalon Mosque and Mir-i-Arab Madrasa, it forms the Po-i-Kalyan complex, one of Bukhara's greatest architectural ensembles.",
      },
      uz: {
        name: "Kalon Minorasi",
        shortDescription:
          "Buxoroning Buyuk Minorasi — Chingizxon ham avaylab qoldirgan 900 yillik minora.",
        fullDescription:
          "Tojik tilida 'Buyuk' ma'nosini anglatuvchi Kalon minorasi Markaziy Osiyodagi eng ajoyib yodgorliklardan biridir. 1127-yilda Qoraxoniylar hukmdori Arslon Xon tomonidan qurilgan bu 47 metrlik pishiq g'isht minora deyarli 900 yil davomida saqlanib kelmoqda. Rivoyatlarga ko'ra, 1220-yilda Buxoroga kirgan Chingizxon minora ko'rkiga hayratlanib, uni buzmaslikni buyurgan.\n\nMinora diametri 9 metr bo'lgan ulkan aylana asosidan uning chiroqdon shaklidagi tepasigacha biroz torayib boradi. Ichida 104 zinapoya bo'lgan spiral zinapoya bor bo'lib, u tepaga olib boradi. Kalon masjidi va Mir-i-Arab madrasasi bilan birga u Poi-Kalon majmuasini tashkil etadi.",
      },
      ru: {
        name: "Минарет Калян",
        shortDescription:
          "Великий минарет Бухары — 900-летняя башня, которую пощадил даже Чингисхан.",
        fullDescription:
          "Минарет Калян, что означает 'Великий' на таджикском, является одним из самых замечательных памятников Центральной Азии. Построенный в 1127 году правителем Карахандов Арсланом Ханом, эта 47-метровая башня из обожжённого кирпича простояла почти 900 лет. Говорят, что когда Чингисхан вошёл в Бухару в 1220 году, он был так впечатлён минаретом, что приказал пощадить его от разрушения.\n\nБашня немного сужается от основания диаметром 9 метров до своей фонарной верхушки. Внутри находится спиральная лестница со 104 ступенями, ведущими к вершине. Вместе с мечетью Калян и медресе Мир-и-Араб он образует комплекс Пои-Калян — один из величайших архитектурных ансамблей Бухары.",
      },
    },
    images: [
      "/images/locations/kalon-minaret/cover.jpg",
      "/images/locations/kalon-minaret/gallery-1.jpg",
      "/images/locations/kalon-minaret/gallery-2.jpg",
    ],
    tags: ["Minaret", "Karakhanid", "Architecture", "Medieval", "UNESCO"],
  },

  // ─── 4. Ark Fortress ────────────────────────────────────────────────────────
  {
    id: "4",
    slug: "ark-fortress",
    category: "historical",
    region: "Bukhara",
    coverImage: "/images/locations/ark-fortress/cover.jpg",
    lat: 39.7762,
    lng: 64.4119,
    youtubeUrl: "https://www.youtube.com/watch?v=PLACEHOLDER_ARK",
    youtubeVrUrl: "https://www.youtube.com/watch?v=PLACEHOLDER_ARK_VR",
    didYouKnow: {
      en: "The Ark of Bukhara held a legendary collection of 45,000 books in its royal library — one of the greatest in the medieval Islamic world. The great philosopher and physician Avicenna (Ibn Sina) studied here in the early 11th century.",
      uz: "Buxoro Arkida qirollik kutubxonasida 45 000 kitobdan iborat afsonaviy to'plam saqlangan — bu o'rta asrlardagi islom dunyosidagi eng buyuklardan biri. Buyuk faylasuf va tabib Avitsenna (Ibn Sino) XI asrning boshlarida shu yerda tahsil olgan.",
      ru: "В Арке Бухары хранилась легендарная коллекция из 45 000 книг в королевской библиотеке — одной из величайших в средневековом исламском мире. Великий философ и врач Авиценна (Ибн Сина) учился здесь в начале XI века.",
    },
    translations: {
      en: {
        name: "Ark Fortress",
        shortDescription:
          "The ancient citadel of Bukhara — a city within a city, home to rulers for centuries.",
        fullDescription:
          "The Ark of Bukhara is a massive fortress that has been the residence of the Bukharan rulers since the 5th century. The citadel stands on an artificial platform about 20 meters high and covers an area of around 4 hectares. Over the centuries, it served as a royal palace, government seat, treasury, military garrison, and prison. Today it houses a museum with exhibits covering the history of Bukhara.\n\nThe Ark's history stretches back over 2,500 years, making it one of the oldest continuously inhabited fortresses in Central Asia. The complex consists of multiple buildings including the throne room, the reception hall, stables, the treasury, a mint, and private residential quarters. Although much of the interior was damaged during the Russian Bolshevik assault in 1920 and partially dismantled for building materials, much of the outer walls still stand, and the restored sections offer a vivid glimpse into the life of the Bukharan khans.",
      },
      uz: {
        name: "Ark Qal'asi",
        shortDescription:
          "Buxoroning qadimiy qal'asi — asrlar davomida hukmdorlar makoni bo'lgan shahar ichidagi shahar.",
        fullDescription:
          "Buxoro Arki miloddan avvalgi V asrdan beri Buxoro hukmdorlarining qarorgohi bo'lib kelgan ulkan qal'adir. Qal'a taxminan 20 metr balandlikdagi sun'iy platformada joylashgan bo'lib, taxminan 4 gektar maydonni egallaydi. Asrlar davomida u qirollik saroyi, hukumat markazi, g'azna, harbiy garnizon va qamoqxona sifatida xizmat qilgan.\n\nArkning tarixi 2500 yildan ortiq bo'lib, uni Markaziy Osiyodagi eng qadimiy va uzluksiz yashagan qal'alardan biriga aylantiradi. Majmua taxt zali, qabul zali, otxona, g'azna, zarbxona va shaxsiy turar-joy binolarini o'z ichiga oladi.",
      },
      ru: {
        name: "Крепость Арк",
        shortDescription:
          "Древняя цитадель Бухары — город в городе, резиденция правителей на протяжении веков.",
        fullDescription:
          "Арк Бухары — это массивная крепость, которая с V века служила резиденцией бухарских правителей. Цитадель стоит на искусственной платформе высотой около 20 метров и занимает площадь около 4 гектаров. На протяжении веков она служила королевским дворцом, правительственным центром, казначейством, военным гарнизоном и тюрьмой.\n\nИстория Арка насчитывает более 2500 лет, что делает его одной из старейших непрерывно обитаемых крепостей Центральной Азии. Комплекс состоит из нескольких зданий, включая тронный зал, зал приёмов, конюшни, казначейство, монетный двор и частные жилые покои.",
      },
    },
    images: [
      "/images/locations/ark-fortress/cover.jpg",
      "/images/locations/ark-fortress/gallery-1.jpg",
      "/images/locations/ark-fortress/gallery-2.jpg",
    ],
    tags: ["Fortress", "Citadel", "Palace", "Museum", "History"],
  },

  // ─── 5. Itchan Kala (Khiva) ─────────────────────────────────────────────────
  {
    id: "5",
    slug: "itchan-kala",
    category: "historical",
    region: "Khiva",
    coverImage: "/images/locations/itchan-kala/cover.jpg",
    lat: 41.3783,
    lng: 60.3622,
    youtubeUrl: "https://www.youtube.com/watch?v=PLACEHOLDER_KHIVA",
    youtubeVrUrl: "https://www.youtube.com/watch?v=PLACEHOLDER_KHIVA_VR",
    didYouKnow: {
      en: "Itchan Kala contains 51 historic monuments and 250 old houses. The city was so well preserved that Soviet authorities considered it a 'museum city' and relocated many of its residents in the 1970s to better preserve the ancient buildings.",
      uz: "Ichan Qal'ada 51 ta tarixiy yodgorlik va 250 ta qadimiy uy mavjud. Shahar shunchalik yaxshi saqlanib qolganki, sovet hokimiyati uni 'muzey-shahar' deb atagan va 1970-yillarda qadimiy binolarni yaxshiroq saqlash uchun ko'plab aholini ko'chirgan.",
      ru: "Ичан-Кала содержит 51 исторический памятник и 250 старых домов. Город был так хорошо сохранён, что советские власти считали его 'городом-музеем' и в 1970-х годах переселили многих его жителей для лучшей сохранности древних зданий.",
    },
    translations: {
      en: {
        name: "Itchan Kala — Old City of Khiva",
        shortDescription:
          "A perfectly preserved medieval walled city, the only one of its kind in Central Asia.",
        fullDescription:
          "Itchan Kala is the walled inner town of the old Khiva oasis, located in the Khorezm region of Uzbekistan. It was the last resting place before the desert crossing to Iran and became one of the most important trade and cultural centres of the region. Listed as a UNESCO World Heritage Site since 1990, Itchan Kala contains over 50 historic monuments and 250 old houses, many dating from the 18th and 19th centuries.\n\nThe city is enclosed by well-preserved mud brick walls that are 6 meters high and 2,200 meters long. Inside, the old city looks almost exactly as it did centuries ago, with winding alleyways, ornate mosques, towering minarets and richly-decorated madrasahs. Among its most notable structures are the Kalta Minor — an unfinished minaret that would have been the tallest in Central Asia — and the Juma Mosque, whose hypostyle hall is supported by 213 carved wooden columns.",
      },
      uz: {
        name: "Ichan Qal'a — Xiva Eski Shahri",
        shortDescription:
          "Markaziy Osiyoda o'ziga xos, mukammal saqlanib qolgan o'rta asrlardagi devorli shahar.",
        fullDescription:
          "Ichan Qal'a O'zbekistonning Xorazm viloyatida joylashgan qadimiy Xiva vohasining devorli ichki shahridir. U Eronga cho'l orqali o'tishdan oldin so'nggi dam olish joyi bo'lib, mintaqaning eng muhim savdo va madaniy markazlaridan biriga aylangan. 1990 yildan beri YuNESKO Jahon merosi ro'yxatiga kiritilgan Ichan Qal'ada 50 dan ortiq tarixiy yodgorlik va 250 dan ortiq qadimiy uy mavjud.\n\nShahar 6 metr balandlikda va 2200 metr uzunligida yaxshi saqlanib qolgan loy g'isht devorlar bilan o'ralgan. Ichkarida eski shahar asrlar avvalgiday ko'rinadi: buralgan tor ko'chalar, naqshinkor masjidlar, baland minoralar va boy bezatilgan madrasalar. Eng mashhur inshootlar orasida eng baland Markaziy Osiyo minorasi bo'lishi kerak edi, ammo yarim qurilgan Kalta Minor va 213 o'yma yog'och ustunlarga tayanadigan Juma masjidi bor.",
      },
      ru: {
        name: "Ичан-Кала — Старый город Хивы",
        shortDescription:
          "Идеально сохранившийся средневековый укреплённый город, единственный в своём роде в Центральной Азии.",
        fullDescription:
          "Ичан-Кала — это укреплённый внутренний город старого хивинского оазиса, расположенный в Хорезмской области Узбекистана. Он был последним местом отдыха перед пустынным переходом в Иран и стал одним из важнейших торговых и культурных центров региона. Включённый в список Всемирного наследия ЮНЕСКО с 1990 года, Ичан-Кала содержит более 50 исторических памятников и 250 старых домов.\n\nГород окружён хорошо сохранившимися стенами из необожжённого кирпича высотой 6 метров и длиной 2200 метров. Внутри старый город выглядит почти так же, как и столетия назад, с извилистыми переулками, пышными мечетями, высокими минаретами и богато украшенными медресе.",
      },
    },
    images: [
      "/images/locations/itchan-kala/cover.jpg",
      "/images/locations/itchan-kala/gallery-1.jpg",
      "/images/locations/itchan-kala/gallery-2.jpg",
    ],
    tags: ["UNESCO", "Walled City", "Medieval", "Khorezm", "Silk Road"],
  },

  // ─── 6. Chorsu Bazaar ───────────────────────────────────────────────────────
  {
    id: "6",
    slug: "chorsu-bazaar",
    category: "bazaar",
    region: "Tashkent",
    coverImage: "/images/locations/chorsu-bazaar/cover.jpg",
    lat: 41.3264,
    lng: 69.2313,
    youtubeUrl: "https://www.youtube.com/watch?v=PLACEHOLDER_CHORSU",
    youtubeVrUrl: "https://www.youtube.com/watch?v=PLACEHOLDER_CHORSU_VR",
    didYouKnow: {
      en: "Chorsu Bazaar has been a trading hub for over 2,000 years, operating continuously since the ancient Silk Road era. The market's distinctive turquoise dome, built in the Soviet era, was designed to evoke the great domed bazaars of medieval Central Asia.",
      uz: "Chorsu bozori 2000 yildan ortiq vaqt davomida savdo markazi bo'lib kelmoqda va qadimgi Ipak yo'li davridan beri uzluksiz faoliyat yuritmoqda. Sovet davrida qurilgan bozorning noyob moviy gumbazi O'rta asrlardagi Markaziy Osiyoning buyuk gumbazli bozorlarini eslatish uchun yaratilgan.",
      ru: "Базар Чорсу является торговым центром на протяжении более 2000 лет, работая непрерывно с эпохи Великого Шёлкового пути. Характерный бирюзовый купол рынка, построенный в советское время, был спроектирован так, чтобы вызывать ассоциации с великими купольными базарами средневековой Центральной Азии.",
    },
    translations: {
      en: {
        name: "Chorsu Bazaar",
        shortDescription:
          "Tashkent's vibrant ancient bazaar beneath a distinctive blue dome — a feast for all senses.",
        fullDescription:
          "Chorsu Bazaar is one of the oldest and largest markets in Central Asia, located in the heart of Tashkent's old city. The name 'Chorsu' means 'four roads' in Persian, reflecting its historic role as a crossroads market. The market is covered by a distinctive large blue dome and spreads across several floors and outdoor sections.\n\nVisitors can find fresh produce, spices, dried fruits, nuts, handmade crafts, silk, and traditional Uzbek foods. The spice section alone is a visual wonder, with mountains of cumin, coriander, saffron, dried chilies, and dozens of spice blends piled into colorful pyramids. The bazaar is a living museum of Uzbek culture, where traditional recipes, craftsmanship, and merchants' customs have changed little over the centuries. It remains one of the most vibrant and authentic markets in all of Central Asia.",
      },
      uz: {
        name: "Chorsu Bozori",
        shortDescription:
          "Noyob ko'k gumbaz ostidagi Toshkentning jonli qadimiy bozori — barcha sezgilar uchun bayram.",
        fullDescription:
          "Chorsu bozori Markaziy Osiyodagi eng qadimiy va eng katta bozorlardan biri bo'lib, Toshkentning eski shahar markazida joylashgan. Fors tilida 'to'rt yo'l' ma'nosini anglatuvchi 'Chorsu' nomi uning tarixiy chorrahada joylashgan bozor sifatidagi rolini aks ettiradi. Bozor noyob katta ko'k gumbaz bilan qoplangan va bir necha qavat va ochiq bo'limlar bo'ylab tarqalgan.\n\nTashrif buyuruvchilar yangi mahsulotlar, ziravorlar, quritilgan mevalar, yong'oqlar, qo'lda yasalgan buyumlar, ipak va an'anaviy o'zbek taomlarini topishadi. Ziravorlar bo'limi o'zi bir ko'rgazma — kimyon, koriander, za'faron, quritilgan qalampir va o'nlab ziravorlar aralashmalari rang-barang piramidalar shaklida to'kilgan. Bozor o'zbek madaniyatining tirik muzeyi hisoblanadi.",
      },
      ru: {
        name: "Базар Чорсу",
        shortDescription:
          "Оживлённый древний базар Ташкента под характерным синим куполом — праздник для всех чувств.",
        fullDescription:
          "Чорсу — один из старейших и крупнейших рынков Центральной Азии, расположенный в сердце старого города Ташкента. Название 'Чорсу' означает 'четыре дороги' на персидском, отражая его историческую роль рынка на перекрёстке. Рынок покрыт характерным большим синим куполом и простирается на нескольких этажах и открытых секциях.\n\nПосетители могут найти свежие продукты, специи, сухофрукты, орехи, изделия ручной работы, шёлк и традиционные узбекские блюда. Один только отдел специй является визуальным чудом — горы зиры, кориандра, шафрана, сушёного перца и десятков смесей специй, сложенных в красочные пирамиды.",
      },
    },
    images: [
      "/images/locations/chorsu-bazaar/cover.jpg",
      "/images/locations/chorsu-bazaar/gallery-1.jpg",
      "/images/locations/chorsu-bazaar/gallery-2.jpg",
    ],
    tags: ["Bazaar", "Market", "Culture", "Food", "Silk Road"],
  },

  // ─── 7. Amir Timur Museum ───────────────────────────────────────────────────
  {
    id: "7",
    slug: "amir-timur-museum",
    category: "museum",
    region: "Tashkent",
    coverImage: "/images/locations/amir-timur-museum/cover.jpg",
    lat: 41.2995,
    lng: 69.2401,
    youtubeUrl: "https://www.youtube.com/watch?v=PLACEHOLDER_TIMUR_MUSEUM",
    youtubeVrUrl:
      "https://www.youtube.com/watch?v=PLACEHOLDER_TIMUR_MUSEUM_VR",
    didYouKnow: {
      en: "Amir Timur (Tamerlane) built an empire stretching from Turkey to India and from Russia to the Arabian Sea — the largest in the world at the time. Despite being one of history's most feared conquerors, he was also a great patron of art, science, and architecture.",
      uz: "Amir Temur Turkiyadan Hindistonga, Rossiyadan Arab dengizigacha cho'zilgan imperiya qurdi — o'sha paytdagi dunyodagi eng kattasi. Tarixning eng dahshatli bosqinchilaridan biri bo'lishiga qaramay, u san'at, fan va me'morchilikning buyuk homiysi ham bo'lgan.",
      ru: "Амир Тимур (Тамерлан) построил империю, простиравшуюся от Турции до Индии и от России до Аравийского моря — крупнейшую в мире в то время. Несмотря на то, что он был одним из самых грозных завоевателей в истории, он также был великим покровителем искусства, науки и архитектуры.",
    },
    translations: {
      en: {
        name: "Amir Timur Museum",
        shortDescription:
          "A stunning domed museum dedicated to Timur the Great — conqueror, statesman, and patron of the arts.",
        fullDescription:
          "The Amir Timur Museum in Tashkent is one of the most architecturally striking museums in Central Asia. Built in 1996 to mark the 660th anniversary of the birth of Timur (Tamerlane), the museum is topped by a magnificent turquoise and gold dome that dominates the city's skyline. The museum is surrounded by a beautifully landscaped park in the centre of Tashkent.\n\nInside, the museum displays an extensive collection of artifacts, manuscripts, weapons, armour, and artwork from the Timurid era. Exhibits trace Timur's military campaigns, his court life in Samarkand, the golden age of science and arts he fostered, and his lasting legacy on Central Asian and world history. Detailed dioramas recreate great battles and royal ceremonies. The museum also holds rare copies of the Timurname — the official biography of Timur — and illuminated manuscripts from his court's library.",
      },
      uz: {
        name: "Amir Temur Muzeyi",
        shortDescription:
          "Buyuk Temurga bag'ishlangan ajoyib gumbazli muzey — fotih, davlat arbobi va san'at homiysi.",
        fullDescription:
          "Toshkentdagi Amir Temur muzeyi Markaziy Osiyodagi eng me'moriy jihatdan ta'sirchan muzeylardan biridir. 1996 yilda Temur (Tamerlan) tavalludining 660 yilligini nishonlash munosabatida qurilgan muzey shahardagi ko'k va oltin rangdagi muhtasham gumbaz bilan ajralib turadi. Muzey Toshkent markazida chiroyli manzarali bog' bilan o'ralgan.\n\nIchkarida muzey Temuriy davriga mansub ko'plab artefaktlar, qo'lyozmalar, qurollar, zirh va san'at asarlarini namoyish etadi. Ko'rgazmalar Temurning harbiy yurishlari, Samarqanddagi saroy hayoti, u rivojlantirgan fan va san'atning oltin asrini va uning Markaziy Osiyo va jahon tarixiga doimiy ta'sirini izohlaydi.",
      },
      ru: {
        name: "Музей Амира Тимура",
        shortDescription:
          "Потрясающий купольный музей, посвящённый Тимуру Великому — завоевателю, государственному деятелю и меценату.",
        fullDescription:
          "Музей Амира Тимура в Ташкенте является одним из самых архитектурно впечатляющих музеев Центральной Азии. Построенный в 1996 году к 660-летию со дня рождения Тимура (Тамерлана), музей увенчан великолепным бирюзово-золотым куполом, доминирующим над городским силуэтом. Музей окружён красиво озеленённым парком в центре Ташкента.\n\nВнутри музей представляет обширную коллекцию артефактов, рукописей, оружия, доспехов и произведений искусства эпохи Тимуридов. Экспонаты прослеживают военные походы Тимура, его придворную жизнь в Самарканде, золотой век науки и искусств, который он содействовал, и его непреходящее наследие.",
      },
    },
    images: [
      "/images/locations/amir-timur-museum/cover.jpg",
      "/images/locations/amir-timur-museum/gallery-1.jpg",
      "/images/locations/amir-timur-museum/gallery-2.jpg",
    ],
    tags: ["Museum", "Timurid", "History", "Tashkent", "Culture"],
  },

  // ─── 8. Ulugh Beg Observatory ───────────────────────────────────────────────
  {
    id: "8",
    slug: "ulugh-beg-observatory",
    category: "historical",
    region: "Samarkand",
    coverImage: "/images/locations/ulugh-beg-observatory/cover.jpg",
    lat: 39.6753,
    lng: 67.0144,
    youtubeUrl: "https://www.youtube.com/watch?v=PLACEHOLDER_ULUGHBEG",
    youtubeVrUrl: "https://www.youtube.com/watch?v=PLACEHOLDER_ULUGHBEG_VR",
    didYouKnow: {
      en: "Using only naked-eye observations and his massive arc instrument, Ulugh Beg calculated the length of the stellar year in 1437 with an error of only 58 seconds — accuracy not matched until the invention of the telescope 200 years later.",
      uz: "Ulug'bek faqat ko'z bilan kuzatish va uning ulkan yoy asbobidan foydalanib, 1437 yilda yulduzli yilning uzunligini atigi 58 soniya xato bilan hisoblab chiqdi — bu aniqlik teleskop ixtiro etilgunga qadar 200 yil davomida tengsiz bo'lib qoldi.",
      ru: "Используя только наблюдения невооружённым глазом и свой массивный дуговой инструмент, Улугбек в 1437 году вычислил длину звёздного года с погрешностью всего 58 секунд — точность, которой не достигали до изобретения телескопа 200 лет спустя.",
    },
    translations: {
      en: {
        name: "Ulugh Beg Observatory",
        shortDescription:
          "The ruins of a 15th-century astronomical marvel — where a king charted the stars with stunning precision.",
        fullDescription:
          "The Ulugh Beg Observatory was one of the finest astronomical observatories of the medieval Islamic world, built between 1424 and 1428 by the Timurid astronomer-king Ulugh Beg in Samarkand. Ulugh Beg was a grandson of Timur the Great and ruled Samarkand as a scholar-prince who prioritized science and learning over conquest.\n\nThe original observatory was a circular three-storey structure, approximately 46 meters in diameter and 30 meters tall. Its most important instrument was a massive sextant (arc) built into the hillside, with a radius of 40 meters — one of the largest astronomical instruments ever built. Using it, Ulugh Beg and his team of astronomers compiled the Zij-i Sultani, a star catalogue containing the precise positions of 1,018 stars — the most accurate in the world at the time. Only the underground portion of the sextant remains today, along with a museum dedicated to Ulugh Beg's life and scientific achievements.",
      },
      uz: {
        name: "Ulug'bek Rasadxonasi",
        shortDescription:
          "XV asrga oid astronomik mo'jizaning xarobalari — qirol yulduzlarni ajoyib aniqlik bilan xaritalagan joy.",
        fullDescription:
          "Ulug'bek rasadxonasi o'rta asrlardagi islom dunyosining eng yaxshi astronomik rasadxonalaridan biri bo'lib, Samarqandda Temuriy astronom-podshoh Ulug'bek tomonidan 1424–1428 yillar orasida qurilgan. Ulug'bek Buyuk Temurning nabirasi bo'lib, Samarqandni zabt etish o'rniga fan va bilimga ustuvorlik bergan olim-shahzoda sifatida boshqargan.\n\nDastlabki rasadxona taxminan 46 metr diametrli va 30 metr balandlikdagi uch qavatli aylana inshoot edi. Eng muhim asbob 40 metr radiusli ulkan sekstant edi — qurilgan eng katta astronomik asboblardan biri. Undan foydalanib, Ulug'bek va uning astronomlar jamoasi 1018 ta yulduzning aniq joylashuvini o'z ichiga olgan yulduzlar katalogini — Zij-i Sultoniyni tuzishdi.",
      },
      ru: {
        name: "Обсерватория Улугбека",
        shortDescription:
          "Руины астрономического чуда XV века — место, где царь составлял карту звёзд с поразительной точностью.",
        fullDescription:
          "Обсерватория Улугбека была одной из лучших астрономических обсерваторий средневекового исламского мира, построенной между 1424 и 1428 годами тимуридским царём-астрономом Улугбеком в Самарканде. Улугбек был внуком Тимура Великого и правил Самаркандом как учёный-принц, который ставил науку и знания выше завоеваний.\n\nПервоначальная обсерватория представляла собой круглое трёхэтажное сооружение диаметром около 46 метров и высотой 30 метров. Её важнейшим инструментом был массивный секстант (дуга), вмонтированный в склон холма с радиусом 40 метров — один из крупнейших астрономических инструментов, когда-либо построенных.",
      },
    },
    images: [
      "/images/locations/ulugh-beg-observatory/cover.jpg",
      "/images/locations/ulugh-beg-observatory/gallery-1.jpg",
      "/images/locations/ulugh-beg-observatory/gallery-2.jpg",
    ],
    tags: ["Observatory", "Astronomy", "Timurid", "Science", "Medieval"],
  },

  // ─── 9. Po-i-Kalyan Complex ─────────────────────────────────────────────────
  {
    id: "9",
    slug: "poi-kalyan-complex",
    category: "architecture",
    region: "Bukhara",
    coverImage: "/images/locations/poi-kalyan-complex/cover.jpg",
    lat: 39.7747,
    lng: 64.4164,
    youtubeUrl: "https://www.youtube.com/watch?v=PLACEHOLDER_POIKALYAN",
    youtubeVrUrl: "https://www.youtube.com/watch?v=PLACEHOLDER_POIKALYAN_VR",
    didYouKnow: {
      en: "The Mir-i-Arab Madrasa within the Po-i-Kalyan complex was one of the only two Islamic seminaries allowed to operate in the entire Soviet Union. It continued teaching Islamic scholars throughout the Soviet era, producing graduates who preserved Central Asian Islamic scholarship.",
      uz: "Poi-Kalon majmuasidagi Mir-i-Arab madrasasi butun Sovet Ittifoqida ishlashga ruxsat etilgan ikkita islom diniy seminariyasidan biri edi. U Sovet davrida islom olimlarini o'qitishda davom etdi va Markaziy Osiyo islom ilmini saqlagan bitiruvchilarni tayyorladi.",
      ru: "Медресе Мир-и-Араб в комплексе Пои-Калян было одним из двух исламских семинарий, которым разрешали работать во всём Советском Союзе. Оно продолжало готовить исламских учёных на протяжении советской эпохи, выпуская выпускников, сохранивших центральноазиатскую исламскую науку.",
    },
    translations: {
      en: {
        name: "Po-i-Kalyan Complex",
        shortDescription:
          "Bukhara's sacred heart — a magnificent ensemble of mosque, minaret, and madrasa spanning 900 years.",
        fullDescription:
          "The Po-i-Kalyan complex, meaning 'Below the Great' (referring to the Kalon Minaret), is the religious and architectural heart of Bukhara. The ensemble consists of three major monuments: the Kalon Minaret (1127), the Kalon Mosque (16th century), and the Mir-i-Arab Madrasa (1535).\n\nThe Kalon Mosque is one of the largest mosques in Central Asia, able to accommodate up to 10,000 worshippers. Its vast rectangular courtyard is surrounded by 288 arched bays, and the main iwan (portal) is decorated with brilliant blue and white tilework. Facing it across the square is the Mir-i-Arab Madrasa, whose blue-tiled domes are among the most beautiful in all of Islam. The madrasa was built by the Shaybanid Khan Ubaydallah with the ransom paid for 3,000 Persian captives. Together, these three structures create one of the most harmonious and awe-inspiring architectural ensembles in the Islamic world.",
      },
      uz: {
        name: "Poi-Kalon Majmuasi",
        shortDescription:
          "Buxoroning muqaddas qalbi — 900 yilni qamrab oluvchi masjid, minora va madrasaning muhtasham majmuasi.",
        fullDescription:
          "Poi-Kalon majmuasi (ya'ni 'Buyuk narsa tagida') Buxoroning diniy va me'moriy qalbidir. Majmua uchta asosiy yodgorlikdan iborat: Kalon minorasi (1127), Kalon masjidi (XVI asr) va Mir-i-Arab madrasasi (1535).\n\nKalon masjidi Markaziy Osiyodagi eng katta masjidlardan biri bo'lib, 10 000 ta ibodat qiluvchiga sig'adi. Uning katta to'rtburchak hovlisi 288 ta yoysimon kataklardan iborat. Maydonga qaragan Mir-i-Arab madrasasi ko'k koshinli gumbazlari bilan islomning eng go'zal me'moriy yodgorliklaridan biriga kiradi. Bu uch inshoot birgalikda islom dunyosidagi eng uyg'un va hayratlanarli me'moriy majmualardan birini yaratadi.",
      },
      ru: {
        name: "Комплекс Пои-Калян",
        shortDescription:
          "Священное сердце Бухары — великолепный ансамбль мечети, минарета и медресе, охватывающий 900 лет истории.",
        fullDescription:
          "Комплекс Пои-Калян, что означает 'Под великим' (имея в виду минарет Калян), является религиозным и архитектурным сердцем Бухары. Ансамбль состоит из трёх крупных памятников: минарета Калян (1127), мечети Калян (XVI в.) и медресе Мир-и-Араб (1535).\n\nМечеть Калян — одна из крупнейших мечетей Центральной Азии, вмещающая до 10 000 молящихся. Её обширный прямоугольный двор окружён 288 арочными нишами. Напротив на площади расположено медресе Мир-и-Араб, чьи синие купола являются одними из красивейших во всём исламском мире.",
      },
    },
    images: [
      "/images/locations/poi-kalyan-complex/cover.jpg",
      "/images/locations/poi-kalyan-complex/gallery-1.jpg",
      "/images/locations/poi-kalyan-complex/gallery-2.jpg",
    ],
    tags: ["Mosque", "Architecture", "Madrasa", "Bukhara", "UNESCO"],
  },

  // ─── 10. Tashkent TV Tower ──────────────────────────────────────────────────
  {
    id: "10",
    slug: "tashkent-tv-tower",
    category: "architecture",
    region: "Tashkent",
    coverImage: "/images/locations/tashkent-tv-tower/cover.jpg",
    lat: 41.3333,
    lng: 69.2875,
    youtubeUrl: "https://www.youtube.com/watch?v=PLACEHOLDER_TVTOWER",
    youtubeVrUrl: "https://www.youtube.com/watch?v=PLACEHOLDER_TVTOWER_VR",
    didYouKnow: {
      en: "The Tashkent TV Tower was built to withstand earthquakes of magnitude 9 on the Richter scale — an essential feature, as Tashkent was almost entirely destroyed by a devastating 7.5-magnitude earthquake in 1966, just 10 years before the tower's construction began.",
      uz: "Toshkent teleminorasi Richter shkalasi bo'yicha 9 ball kuchidagi zilzilalarga bardosh berish uchun qurilgan — bu zaruriy xususiyat edi, chunki Toshkent 1966 yilda, minora qurilishidan 10 yil oldin, 7,5 ball kuchidagi halokatli zilzilada deyarli butunlay vayron qilingan edi.",
      ru: "Ташкентская телебашня была построена так, чтобы выдерживать землетрясения магнитудой 9 по шкале Рихтера — это существенная особенность, поскольку Ташкент был почти полностью разрушен опустошительным землетрясением магнитудой 7,5 в 1966 году, за 10 лет до начала строительства башни.",
    },
    translations: {
      en: {
        name: "Tashkent TV Tower",
        shortDescription:
          "Central Asia's tallest structure — a Soviet-era icon offering panoramic views over Tashkent.",
        fullDescription:
          "The Tashkent Television Tower is a 375-meter telecommunications tower and the tallest structure in Central Asia. Completed in 1985, the tower was a major feat of Soviet engineering and remains an iconic part of Tashkent's skyline. The tower is built on a unique 10-legged base designed to withstand powerful earthquakes.\n\nThe tower features an observation deck and a rotating restaurant at 100 meters above ground, offering breathtaking 360-degree panoramic views over the entire city of Tashkent. On clear days, visitors can see far into the surrounding plains and even glimpse the distant mountains. The tower has been illuminated with colourful LED lights since a major renovation in the 2010s, making it a striking nighttime landmark visible from across the city. The surrounding Tashkent Tower Park offers gardens, water features, and a pleasant area for an evening stroll.",
      },
      uz: {
        name: "Toshkent Teleminorasi",
        shortDescription:
          "Markaziy Osiyoning eng baland inshоoti — Toshkent ustidan panoramik ko'rinishlar taklif etuvchi sovet davri belgisi.",
        fullDescription:
          "Toshkent teleminorasi 375 metrli telekommunikatsiya minorasi bo'lib, Markaziy Osiyodagi eng baland inshootdir. 1985 yilda yakunlangan minora sovet muhandisligining muhim yutuqlaridan biri bo'lib, Toshkent ko'rinishining ikonik qismiga aylanib qolmoqda. Minora kuchli zilzilalarga bardosh berish uchun mo'ljallangan noyob 10 oyoqli poydevorga qurilgan.\n\nMinorada yerdan 100 metr balandlikda kuzatuv maydoni va aylanuvchi restoran mavjud bo'lib, butun Toshkent shahri ustidan 360 daraja panoramik ko'rinishlar taklif etadi. Tiniq kunlarda tashrif buyuruvchilar uzoq tekisliklarga va hatto uzoq tog'larga qaray olishadi.",
      },
      ru: {
        name: "Ташкентская Телебашня",
        shortDescription:
          "Самое высокое сооружение Центральной Азии — советская икона, предлагающая панорамный вид на Ташкент.",
        fullDescription:
          "Ташкентская телевизионная башня — это 375-метровая телекоммуникационная башня и самое высокое сооружение в Центральной Азии. Завершённая в 1985 году, башня стала крупным достижением советской инженерии и остаётся культовой частью силуэта Ташкента. Башня построена на уникальном 10-опорном основании, разработанном для противостояния мощным землетрясениям.\n\nВ башне есть смотровая площадка и вращающийся ресторан на высоте 100 метров над землёй, предлагающие захватывающий панорамный вид на весь Ташкент. В ясные дни посетители могут видеть далеко в окружающие равнины и даже различить далёкие горы.",
      },
    },
    images: [
      "/images/locations/tashkent-tv-tower/cover.jpg",
      "/images/locations/tashkent-tv-tower/gallery-1.jpg",
      "/images/locations/tashkent-tv-tower/gallery-2.jpg",
    ],
    tags: ["Tower", "Soviet", "Architecture", "Panorama", "Tashkent"],
  },
];

// ─── Utility Functions ───────────────────────────────────────────────────────

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find((loc) => loc.slug === slug);
}

export function getLocationsByCategory(category: string): Location[] {
  if (category === "all") return locations;
  return locations.filter((loc) => loc.category === category);
}

export function searchLocations(query: string, locale: Locale): Location[] {
  const q = query.toLowerCase();
  return locations.filter((loc) => {
    const t = loc.translations[locale];
    return (
      t.name.toLowerCase().includes(q) ||
      t.shortDescription.toLowerCase().includes(q) ||
      loc.region.toLowerCase().includes(q) ||
      loc.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });
}

export function getFeaturedLocations(count: number = 6): Location[] {
  return locations.slice(0, count);
}

export function getRelatedLocations(
  locationId: string,
  category: string,
  region: string,
  limit: number = 3
): Location[] {
  return locations
    .filter(
      (l) =>
        l.id !== locationId &&
        (l.category === category || l.region === region)
    )
    .slice(0, limit);
}

export const ALL_CATEGORIES = [
  "historical",
  "nature",
  "architecture",
  "museum",
  "bazaar",
  "mosque",
  "mausoleum",
] as const;

export type Category = (typeof ALL_CATEGORIES)[number];
