import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ============================================================
  // Admin user — change email to your Google account email
  // ============================================================
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: Role.ADMIN },
    create: {
      email: adminEmail,
      name: 'Platform Admin',
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Admin user ensured: ${adminEmail}`);

  // ============================================================
  // UZBEKISTAN
  // ============================================================
  const uzbekistan = await prisma.country.upsert({
    where: { slug: 'uzbekistan' },
    update: {},
    create: {
      slug: 'uzbekistan',
      flagEmoji: '🇺🇿',
      featured: true,
      coverImage:
        'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
      translations: {
        create: [
          {
            locale: 'en',
            name: 'Uzbekistan',
            description:
              "Uzbekistan is a landlocked country in Central Asia known for its ancient Silk Road cities. Home to stunning Islamic architecture, vibrant bazaars, and millennia of history, it's one of the most captivating destinations in the world.",
          },
          {
            locale: 'ru',
            name: 'Узбекистан',
            description:
              'Узбекистан — страна в Центральной Азии, известная своими древними городами Шёлкового пути. Родина потрясающей исламской архитектуры, ярких базаров и тысячелетней истории.',
          },
          {
            locale: 'uz',
            name: "O'zbekiston",
            description:
              "O'zbekiston — Markaziy Osiyodagi quruqlikka o'ralgan davlat bo'lib, qadimgi Ipak yo'li shaharlari bilan mashhur. Ajoyib islom me'morchiligi, jonli bozorlar va ming yillik tarix vatani.",
          },
        ],
      },
    },
  });

  // ---- SAMARKAND ----
  const samarkand = await prisma.city.upsert({
    where: { slug: 'samarkand' },
    update: {},
    create: {
      slug: 'samarkand',
      countryId: uzbekistan.id,
      featured: true,
      coverImage:
        'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
      translations: {
        create: [
          {
            locale: 'en',
            name: 'Samarkand',
            description:
              'One of the oldest inhabited cities in Central Asia and a jewel of the Silk Road, Samarkand dazzles with its stunning blue-tiled domes and grand mausoleums.',
          },
          {
            locale: 'ru',
            name: 'Самарканд',
            description:
              'Один из древнейших городов Центральной Азии и жемчужина Шёлкового пути, Самарканд поражает своими потрясающими голубыми куполами и величественными мавзолеями.',
          },
          {
            locale: 'uz',
            name: 'Samarqand',
            description:
              "Markaziy Osiyoning eng qadimiy shaharlaridan biri va Ipak yo'lining gavhari bo'lgan Samarqand o'zining ajoyib ko'k kashtali gumbazlari va ulug'vor maqbaralari bilan hayratga soladi.",
          },
        ],
      },
    },
  });

  // Registan Square
  const registan = await prisma.place.upsert({
    where: { slug: 'registan-square-samarkand' },
    update: {},
    create: {
      slug: 'registan-square-samarkand',
      cityId: samarkand.id,
      category: 'monument',
      featured: true,
      coverImage:
        'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
      latitude: 39.6542,
      longitude: 66.9758,
      mapEmbedUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.3!2d66.9758!3d39.6542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f4d19107640da13%3A0x6fb6b2c37e1d3a1f!2sRegistan!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s',
      translations: {
        create: [
          {
            locale: 'en',
            title: 'Registan Square',
            shortDescription:
              "The heart of ancient Samarkand, Registan Square is one of the most magnificent public squares in the world, surrounded by three grand madrasahs adorned with intricate tilework.",
            fullDescription:
              "Registan Square is the historical center of Samarkand and one of the finest ensembles of Islamic architecture in Central Asia. The name Registan means 'sandy place' in Persian, and the square served as the commercial hub of the ancient Silk Road city.\n\nThe ensemble consists of three magnificent madrasahs (Islamic schools): the Ulugh Beg Madrasah (1420), the Sher-Dor Madrasah (1636), and the Tilya-Kori Madrasah (1660). Each features soaring portals, mosaic-covered facades, twin minarets, and inner courtyards once filled with scholars from across the Islamic world.\n\nThe Ulugh Beg Madrasah, built by the astronomer-king Ulugh Beg, was once one of the finest centers of learning in the Islamic world. The Sher-Dor ('having tigers') Madrasah is famous for its unusual mosaic depicting lions chasing deer, a rare departure from the Islamic prohibition on depicting living creatures. The Tilya-Kori ('gilded') Madrasah features a stunning gilded mosque interior.\n\nThe square was inscribed on the UNESCO World Heritage List as part of the Historic Centre of Samarkand in 2001. It is undoubtedly the crown jewel of Uzbekistan's architectural heritage and a must-visit for anyone traveling the Silk Road.",
          },
          {
            locale: 'ru',
            title: 'Площадь Регистан',
            shortDescription:
              'Сердце древнего Самарканда, площадь Регистан — одна из величайших площадей мира, окружённая тремя грандиозными медресе с изысканной мозаичной отделкой.',
            fullDescription:
              'Площадь Регистан — исторический центр Самарканда и один из лучших ансамблей исламской архитектуры в Центральной Азии. В переводе с персидского «Регистан» означает «песчаное место», а площадь служила торговым центром древнего города Шёлкового пути.\n\nАнсамбль состоит из трёх великолепных медресе: медресе Улугбека (1420), медресе Шердор (1636) и медресе Тилля-Кари (1660). Каждое из них украшено высокими порталами, мозаичными фасадами, парными минаретами и внутренними дворами.\n\nПлощадь была включена в список Всемирного наследия ЮНЕСКО в 2001 году.',
          },
          {
            locale: 'uz',
            title: 'Registon maydoni',
            shortDescription:
              "Qadimiy Samarqandning yuragi bo'lgan Registon maydoni dunyoning eng ulug'vor jamoat maydonlaridan biri bo'lib, nozik mozaika ishlari bilan bezatilgan uchta katta madrasa bilan o'ralgan.",
            fullDescription:
              "Registon maydoni Samarqandning tarixiy markazi va Markaziy Osiyadagi islom me'morchiligining eng yaxshi ansambllari ularidan biridir. Forscha 'Registon' so'zi 'qumli joy' degan ma'noni anglatadi.\n\nAnsambli uchta ulug'vor madrasadan iborat: Ulug'bek madrasasi (1420), Sherdor madrasasi (1636) va Tillya-Kori madrasasi (1660). Har biri baland peshtoqlar, mozaika qoplangan fasadlar, juft minoralar va ichki hovlilar bilan bezatilgan.\n\nMaydon 2001 yilda YuNESKO Jahon merosi ro'yxatiga kiritilgan.",
          },
        ],
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
            caption: 'Registan Square panoramic view',
            sortOrder: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=1200&q=80',
            caption: 'Tilya-Kori Madrasah golden interior',
            sortOrder: 1,
          },
          {
            url: 'https://images.unsplash.com/photo-1563191911-e65a1b2a8756?auto=format&fit=crop&w=1200&q=80',
            caption: 'Sher-Dor Madrasah facade',
            sortOrder: 2,
          },
        ],
      },
      videos: {
        create: [
          {
            youtubeId: 'IiBrKBmTaow',
            title: 'Registan Square Virtual Tour',
          },
        ],
      },
    },
  });

  // Gur-e-Amir
  await prisma.place.upsert({
    where: { slug: 'gur-e-amir-samarkand' },
    update: {},
    create: {
      slug: 'gur-e-amir-samarkand',
      cityId: samarkand.id,
      category: 'mausoleum',
      featured: false,
      coverImage:
        'https://images.unsplash.com/photo-1600100397608-f0e32f410c06?auto=format&fit=crop&w=800&q=80',
      latitude: 39.6498,
      longitude: 66.9725,
      mapEmbedUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1496!2d66.9725!3d39.6498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDM4JzU5LjMiTiA2NsKwNTgnMjEuMCJF!5e0!3m2!1sen!2s!4v1620000000000',
      translations: {
        create: [
          {
            locale: 'en',
            title: 'Gur-e-Amir Mausoleum',
            shortDescription:
              "The magnificent mausoleum of Timur (Tamerlane), featuring a stunning ribbed azure dome and considered the model for later Mughal architecture including the Taj Mahal.",
            fullDescription:
              "Gur-e-Amir ('Tomb of the King' in Persian) is the mausoleum of the Central Asian conqueror Timur (Tamerlane), and is considered one of the finest examples of medieval Islamic architecture. Built in 1404 in Samarkand, it served as the model for later Mughal architecture, including the Taj Mahal in India.\n\nThe mausoleum is renowned for its fluted azure dome, which rises above a cylindrical drum decorated with Quranic inscriptions. The interior is covered with onyx, jasper, and marble, and features elaborate stalactite vaulting. The tombs within include those of Timur himself, his sons, grandsons (including the astronomer Ulugh Beg), and his spiritual advisor.\n\nTimur's sarcophagus is made of dark green jade — the largest piece of jade in the world at the time. According to legend, when Soviet archaeologist Mikhail Gerasimov opened the tomb in 1941, it triggered a curse that led to World War II.",
          },
          {
            locale: 'ru',
            title: 'Мавзолей Гур-Эмир',
            shortDescription:
              'Великолепный мавзолей Тимура (Тамерлана) со впечатляющим рубчатым лазурным куполом, считающийся прообразом позднейшей архитектуры Великих Моголов, включая Тадж-Махал.',
            fullDescription:
              'Гур-Эмир («Гробница государя» на персидском) — мавзолей среднеазиатского завоевателя Тимура (Тамерлана), считающийся одним из лучших образцов средневековой исламской архитектуры. Построен в 1404 году в Самарканде и послужил образцом для позднейшей архитектуры Великих Моголов, включая Тадж-Махал.\n\nМавзолей знаменит своим ребристым лазурным куполом. Интерьер украшен ониксом, яшмой и мрамором.',
          },
          {
            locale: 'uz',
            title: 'Gʻuri Amir maqbarasi',
            shortDescription:
              "Temur (Tamerlane) ning ulug'vor maqbarasi, ajoyib qovurgʻasimon lazur gumbazi bilan mashhur bo'lib, keyinchalik Muʻgʻal me'morchiligining, jumladan Taj Mahalni namunasi hisoblanadi.",
            fullDescription:
              "Gʻuri Amir (forscha 'Podshoh qabri') — Markaziy Osiyo fotihi Temurning maqbarasi bo'lib, o'rta asr islom me'morchiligining eng yaxshi namunalaridan biri hisoblanadi. 1404 yilda Samarqandda qurilgan bu maqbara keyinchalik Muʻgʻal me'morchiligining, jumladan Hindistondagi Taj Mahalni namunasiga aylandi.\n\nMaqbara silindrsimon barabangi va Qur'on yozuvlari bilan bezatilgan atirgul gumbazi bilan mashhur.",
          },
        ],
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1600100397608-f0e32f410c06?auto=format&fit=crop&w=1200&q=80',
            caption: 'Gur-e-Amir Mausoleum exterior',
            sortOrder: 0,
          },
        ],
      },
      videos: {
        create: [{ youtubeId: 'jNr-sSo4AZ0', title: 'Gur-e-Amir Virtual Tour' }],
      },
    },
  });

  // Shah-i-Zinda
  await prisma.place.upsert({
    where: { slug: 'shah-i-zinda-samarkand' },
    update: {},
    create: {
      slug: 'shah-i-zinda-samarkand',
      cityId: samarkand.id,
      category: 'necropolis',
      coverImage:
        'https://images.unsplash.com/photo-1563191911-e65a1b2a8756?auto=format&fit=crop&w=800&q=80',
      latitude: 39.6675,
      longitude: 66.9803,
      translations: {
        create: [
          {
            locale: 'en',
            title: 'Shah-i-Zinda Necropolis',
            shortDescription:
              'A stunning avenue of mausoleums and mosques dating from the 9th to 19th centuries, famous for its extraordinary tilework in vivid blues and turquoises.',
            fullDescription:
              "Shah-i-Zinda ('Living King' in Persian) is one of the most extraordinary sacred ensembles in the Islamic world. This necropolis contains an alley of mausoleums built over nine centuries, from the 9th to the 19th century.\n\nThe complex is believed to contain the tomb of Kusam ibn Abbas, a cousin of the Prophet Muhammad who is said to have brought Islam to the region in the 7th century. Pilgrims have visited his shrine for over a millennium.\n\nThe mausoleums are covered with some of the finest tilework in Central Asia — intricate geometric patterns, arabesques, and calligraphy in stunning shades of cobalt blue, turquoise, and white. The craftsmanship represents the pinnacle of Timurid-era decorative arts.\n\nVisiting Shah-i-Zinda at dawn or dusk, when the light plays on the glazed tiles, is an unforgettable experience.",
          },
          {
            locale: 'ru',
            title: 'Некрополь Шах-и-Зинда',
            shortDescription:
              'Потрясающий проспект мавзолеев и мечетей IX–XIX веков, знаменитый великолепной плиткой в ярко-синих и бирюзовых тонах.',
            fullDescription:
              'Шах-и-Зинда («Живой царь» по-персидски) — один из самых замечательных священных ансамблей исламского мира. Некрополь содержит аллею мавзолеев, строившихся на протяжении девяти веков.\n\nКомплекс, по преданию, хранит гробницу Кусама ибн Аббаса, двоюродного брата Пророка Мухаммада. Мавзолеи покрыты одними из лучших изразцов в Центральной Азии.',
          },
          {
            locale: 'uz',
            title: 'Shohi Zinda nekropoli',
            shortDescription:
              "9-19-asr maqbaralari va masjidlarining ajoyib xiyoboni, o'zining yorqin ko'k va moviy rangdagi g'ayrioddiy kashtachilik ishlari bilan mashhur.",
            fullDescription:
              "Shohi Zinda (forscha 'Tirik Shoh') islom olamidagi eng g'ayrioddiy muqaddas majmualardan biridir. Bu nekropol to'qqiz asr davomida qurilgan maqbaralar xiyobonini o'z ichiga oladi.\n\nMajmua Payg'ambar Muhammadning amakivachchasi Qusam ibn Abbosning qabrini saqlaydigan joy deb ishoniladi. Maqbaralar Markaziy Osiyodagi eng yaxshi kashtachilik ishlari bilan qoplangan.",
          },
        ],
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1563191911-e65a1b2a8756?auto=format&fit=crop&w=1200&q=80',
            caption: 'Shah-i-Zinda tilework',
            sortOrder: 0,
          },
        ],
      },
      videos: {
        create: [{ youtubeId: 'RlYM6Tr0Bv4', title: 'Shah-i-Zinda Walking Tour' }],
      },
    },
  });

  // ---- BUKHARA ----
  const bukhara = await prisma.city.upsert({
    where: { slug: 'bukhara' },
    update: {},
    create: {
      slug: 'bukhara',
      countryId: uzbekistan.id,
      featured: true,
      coverImage:
        'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?auto=format&fit=crop&w=800&q=80',
      translations: {
        create: [
          {
            locale: 'en',
            name: 'Bukhara',
            description:
              'One of the best-preserved medieval cities in Central Asia, Bukhara has over 140 protected monuments spanning 2,500 years of history, earning it the title "Pearl of the East."',
          },
          {
            locale: 'ru',
            name: 'Бухара',
            description:
              'Один из лучших сохранившихся средневековых городов Центральной Азии, Бухара насчитывает более 140 охраняемых памятников и 2500 лет истории, заслужив титул «Жемчужина Востока».',
          },
          {
            locale: 'uz',
            name: 'Buxoro',
            description:
              "Markaziy Osiyodagi eng yaxshi saqlanib qolgan o'rta asr shaharlaridan biri bo'lgan Buxoro 2500 yillik tarixga ega 140 dan ortiq muhofaza etilgan obidaga ega bo'lib, \"Sharq durdonasi\" unvoniga sazovor bo'lgan.",
          },
        ],
      },
    },
  });

  await prisma.place.upsert({
    where: { slug: 'kalon-minaret-bukhara' },
    update: {},
    create: {
      slug: 'kalon-minaret-bukhara',
      cityId: bukhara.id,
      category: 'mosque',
      featured: true,
      coverImage:
        'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?auto=format&fit=crop&w=800&q=80',
      latitude: 39.7747,
      longitude: 64.4165,
      translations: {
        create: [
          {
            locale: 'en',
            title: 'Kalon Minaret & Mosque',
            shortDescription:
              "Built in 1127, the Kalon ('Grand') Minaret stands 47 meters tall and was once the tallest structure in Central Asia, dominating Bukhara's skyline for nearly 900 years.",
            fullDescription:
              "The Kalon Minaret (Po-i-Kalan Minaret) is the most recognizable landmark of Bukhara and one of the finest examples of early Islamic architecture in Central Asia. Built in 1127 by the Karakhanid ruler Arslan Khan, it stands 47 meters (154 feet) tall and served as both a call-to-prayer tower and a lighthouse for caravans crossing the Kyzylkum Desert.\n\nThe minaret features 14 distinct decorative bands of brickwork, each with unique geometric patterns — a masterpiece of medieval bricklaying. According to legend, Genghis Khan was so impressed by the minaret's height and beauty that he ordered it spared when he destroyed the rest of Bukhara in 1220.\n\nAdjacent to the minaret stands the Kalon Mosque, rebuilt in the 16th century under the Shaybanid dynasty, which could accommodate 12,000 worshippers in its vast courtyard. Together with the Mir-i-Arab Madrasah across the square, they form one of the most impressive religious ensembles in Central Asia.",
          },
          {
            locale: 'ru',
            title: 'Минарет и мечеть Калон',
            shortDescription:
              'Построенный в 1127 году минарет Калон («Большой») высотой 47 метров был когда-то самым высоким сооружением Центральной Азии.',
            fullDescription:
              'Минарет Калон — самая узнаваемая достопримечательность Бухары и один из лучших примеров ранней исламской архитектуры в Центральной Азии. Построен в 1127 году при Арслан-хане Карахани, имеет высоту 47 метров. По легенде, Чингисхан был настолько впечатлён красотой минарета, что приказал пощадить его при разрушении Бухары в 1220 году.',
          },
          {
            locale: 'uz',
            title: "Kalon minorasi va masjidi",
            shortDescription:
              "1127 yilda qurilgan Kalon ('Ulug') minorasi 47 metr balandlikda bo'lib, bir paytlar Markaziy Osiyodagi eng baland inshoot edi.",
            fullDescription:
              "Kalon minorasi Buxoroning eng taniqli landmarki va Markaziy Osiyodagi erta islom me'morchiligining eng yaxshi namunalaridan biridir. 1127 yilda Qoraxoniylar hukmdori Arslon Xon tomonidan qurilgan, u 47 metr balandlikda turadi. Rivoyatga ko'ra, Chingizxon 1220 yilda Buxoroni vayron qilganda minoraning go'zalligi uni hayratga soldi va u o'z joyida qoldirishni buyurdi.",
          },
        ],
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?auto=format&fit=crop&w=1200&q=80',
            caption: 'Kalon Minaret at sunset',
            sortOrder: 0,
          },
        ],
      },
      videos: {
        create: [{ youtubeId: 'jX9XvzWR0fE', title: 'Bukhara Walking Tour' }],
      },
    },
  });

  await prisma.place.upsert({
    where: { slug: 'ark-fortress-bukhara' },
    update: {},
    create: {
      slug: 'ark-fortress-bukhara',
      cityId: bukhara.id,
      category: 'fortress',
      coverImage:
        'https://images.unsplash.com/photo-1509027572446-af8401acfdc3?auto=format&fit=crop&w=800&q=80',
      latitude: 39.7756,
      longitude: 64.4093,
      translations: {
        create: [
          {
            locale: 'en',
            title: 'Ark Fortress',
            shortDescription:
              "A massive citadel that served as the royal residence and administrative center of Bukhara's emirs for over 1,400 years, dominating the city's skyline.",
            fullDescription:
              "The Ark of Bukhara is an enormous fortress that served as the royal palace and administrative center of the Bukharan state. The first structures on this site date back to at least the 5th century CE, though the current fortress was extensively rebuilt over the centuries.\n\nAt its peak, the Ark contained palaces, mosques, stables, workshops, a treasury, and a prison. The last Emir of Bukhara, Alim Khan, fled the fortress in 1920 when Bolshevik forces took the city.\n\nToday, the Ark houses a museum with artifacts from the Khanate of Bukhara, including ceremonial weapons, coins, clothing, and documents. The views from the fortress walls over the old city are spectacular.",
          },
          {
            locale: 'ru',
            title: 'Крепость Арк',
            shortDescription:
              'Огромная цитадель, служившая королевской резиденцией и административным центром бухарских эмиров более 1400 лет.',
            fullDescription:
              'Арк Бухары — огромная крепость, служившая королевским дворцом и административным центром Бухарского государства. Первые постройки на этом месте датируются как минимум V веком нашей эры. В 1920 году последний эмир Алим Хан бежал из крепости, когда большевики взяли город.',
          },
          {
            locale: 'uz',
            title: 'Ark qal\'asi',
            shortDescription:
              "1400 yildan ortiq muddatga Buxoro amirlarining qirollik rezidentsiyasi va ma'muriy markazi sifatida xizmat qilgan ulkan qal'a.",
            fullDescription:
              "Buxoro Arki qirollik saroyi va Buxoro davlatining ma'muriy markazi bo'lib xizmat qilgan ulkan qal'adir. Bu joydagi birinchi inshootlar kamida milodiy 5-asrga borib taqaladi. 1920 yilda bolsheviklar shaharni olganda so'nggi amir Olim Xon qal'adan qochib ketdi.",
          },
        ],
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1509027572446-af8401acfdc3?auto=format&fit=crop&w=1200&q=80',
            caption: 'Ark Fortress entrance gate',
            sortOrder: 0,
          },
        ],
      },
      videos: {
        create: [{ youtubeId: 'dQw4w9WgXcQ', title: 'Ark Fortress Tour' }],
      },
    },
  });

  // ---- KHIVA ----
  const khiva = await prisma.city.upsert({
    where: { slug: 'khiva' },
    update: {},
    create: {
      slug: 'khiva',
      countryId: uzbekistan.id,
      featured: true,
      coverImage:
        'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=800&q=80',
      translations: {
        create: [
          {
            locale: 'en',
            name: 'Khiva',
            description:
              "Khiva's walled inner city, Itchan Kala, is a perfectly preserved open-air museum and UNESCO World Heritage Site, offering an unparalleled glimpse into medieval Silk Road life.",
          },
          {
            locale: 'ru',
            name: 'Хива',
            description:
              'Огороженный внутренний город Хивы — Ичан-Кала — является прекрасно сохранившимся музеем под открытым небом и объектом Всемирного наследия ЮНЕСКО.',
          },
          {
            locale: 'uz',
            name: 'Xiva',
            description:
              "Xivaning devorli ichki shahri — Ichan-qal'a — O'rta asrlarning Ipak yo'li hayotiga tengsiz ko'rinish taqdim etuvchi YuNESKO Jahon merosi ob'ektidir.",
          },
        ],
      },
    },
  });

  await prisma.place.upsert({
    where: { slug: 'itchan-kala-khiva' },
    update: {},
    create: {
      slug: 'itchan-kala-khiva',
      cityId: khiva.id,
      category: 'walled-city',
      featured: true,
      coverImage:
        'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=800&q=80',
      latitude: 41.378,
      longitude: 60.3593,
      translations: {
        create: [
          {
            locale: 'en',
            title: 'Itchan Kala — The Walled City',
            shortDescription:
              'The inner walled city of Khiva, an extraordinary open-air museum containing over 50 historic monuments, 250 old houses, and 2,000 years of continuous habitation.',
            fullDescription:
              "Itchan Kala ('Inner Town') is the walled inner city of Khiva, the best-preserved example of a medieval Central Asian city in the world. Surrounded by 10-meter-high mud brick walls, the entire city was declared a UNESCO World Heritage Site in 1990.\n\nWithin the walls, visitors can explore an extraordinary collection of mosques, madrasahs, mausoleums, palaces, caravanserais, and bazaars — all within a compact, walkable area. Notable monuments include the Kalta Minor (the 'Short Minaret'), the Juma Mosque with its forest of 218 wooden columns, the Tash-Hauli Palace, and the Islam Khoja Minaret.\n\nThe city has been continuously inhabited for over 2,000 years and was an important oasis on the Silk Road. Walking through its narrow lanes, past turquoise-tiled facades and ancient mud-brick buildings, feels like stepping back in time to the medieval Islamic world.",
          },
          {
            locale: 'ru',
            title: 'Ичан-Кала — Огороженный город',
            shortDescription:
              'Укреплённый внутренний город Хивы — удивительный музей под открытым небом с более чем 50 историческими памятниками и 2000-летней историей.',
            fullDescription:
              'Ичан-Кала («Внутренний город») — укреплённый внутренний город Хивы, лучший в мире пример средневекового центральноазиатского города. В 1990 году весь город был объявлен объектом Всемирного наследия ЮНЕСКО.\n\nВ стенах можно исследовать мечети, медресе, мавзолеи, дворцы и базары. Среди достопримечательностей — Кальта Минор, мечеть Джума с лесом из 218 деревянных колонн.',
          },
          {
            locale: 'uz',
            title: "Ichan-qal'a — Devorli shahar",
            shortDescription:
              "Xivaning devorli ichki shahri — 50 dan ortiq tarixiy obida va 2000 yillik tarixga ega g'ayrioddiy ochiq muzey.",
            fullDescription:
              "Ichan-qal'a ('Ichki shahar') — Xivaning devorli ichki shahri, dunyodagi o'rta asr Markaziy Osiyo shahrining eng yaxshi saqlanib qolgan namunasi. 1990 yilda butun shahar YuNESKO Jahon merosi ob'ekti deb e'lon qilindi.\n\nDevorlar ichida masjidlar, madrasalar, maqbaralar, saroylar va bozorlarni kashf etish mumkin. Diqqatga sazovor joylar orasida Kalta Minor, 218 ta yog'och ustun orali Jome masjidi kiradi.",
          },
        ],
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=1200&q=80',
            caption: 'Itchan Kala at dusk',
            sortOrder: 0,
          },
        ],
      },
      videos: {
        create: [{ youtubeId: 'jNr-sSo4AZ0', title: 'Khiva Itchan Kala Virtual Tour' }],
      },
    },
  });

  // ---- TASHKENT ----
  const tashkent = await prisma.city.upsert({
    where: { slug: 'tashkent' },
    update: {},
    create: {
      slug: 'tashkent',
      countryId: uzbekistan.id,
      featured: false,
      coverImage:
        'https://images.unsplash.com/photo-1573155993874-d5d48af862ba?auto=format&fit=crop&w=800&q=80',
      translations: {
        create: [
          {
            locale: 'en',
            name: 'Tashkent',
            description:
              "Uzbekistan's vibrant capital, blending Soviet-era grandeur with modern ambition and ancient bazaar culture, featuring wide boulevards, metro stations as art, and world-class museums.",
          },
          {
            locale: 'ru',
            name: 'Ташкент',
            description:
              'Шумная столица Узбекистана, сочетающая советское величие с современными амбициями и древней базарной культурой.',
          },
          {
            locale: 'uz',
            name: 'Toshkent',
            description:
              "O'zbekistonning poytaxti bo'lib, sovet davri ulug'vorligi, zamonaviy ambitsiyalar va qadimiy bozor madaniyatini birlashtiradi.",
          },
        ],
      },
    },
  });

  await prisma.place.upsert({
    where: { slug: 'chorsu-bazaar-tashkent' },
    update: {},
    create: {
      slug: 'chorsu-bazaar-tashkent',
      cityId: tashkent.id,
      category: 'bazaar',
      featured: false,
      coverImage:
        'https://images.unsplash.com/photo-1573155993874-d5d48af862ba?auto=format&fit=crop&w=800&q=80',
      latitude: 41.3289,
      longitude: 69.232,
      translations: {
        create: [
          {
            locale: 'en',
            title: 'Chorsu Bazaar',
            shortDescription:
              "Central Asia's largest and most vibrant traditional market, housed under iconic blue domes, offering everything from spices and dried fruits to handicrafts and live animals.",
            fullDescription:
              "Chorsu Bazaar is the ancient heart of Tashkent's commercial life and one of the oldest bazaars in Central Asia. The name 'Chorsu' means 'four streams' in Persian, reflecting its historical location at the crossroads of major trading routes.\n\nThe bazaar is centered around a massive covered rotunda with distinctive turquoise domes, surrounded by open-air stalls stretching in every direction. Here you'll find a dizzying array of products: mounds of colorful spices, pyramids of dried fruits and nuts, fresh produce, flatbreads baked in clay tandoor ovens, traditional Uzbek textiles, ceramics, carpets, and much more.\n\nThe bazaar is also a wonderful place to try Uzbek street food, including samsa (savory pastries), non (flatbread), and fresh lagman noodle soup. The energy, colors, and aromas make it one of the most immersive market experiences in the world.",
          },
          {
            locale: 'ru',
            title: 'Базар Чорсу',
            shortDescription:
              'Крупнейший традиционный рынок Центральной Азии под культовыми голубыми куполами, предлагающий специи, сухофрукты и изделия народных промыслов.',
            fullDescription:
              'Базар Чорсу — древнее торговое сердце Ташкента и один из старейших базаров Центральной Азии. Название «Чорсу» означает «четыре потока» на персидском языке. Здесь можно найти специи, сухофрукты, свежие продукты, лепёшки, традиционные узбекские ткани и многое другое.',
          },
          {
            locale: 'uz',
            title: "Chorsu bozori",
            shortDescription:
              "Markaziy Osiyoning eng katta va jonli an'anaviy bozori, ko'k gumbazlar ostida joylashgan bo'lib, ziravorlardan to hunarmandchilik mahsulotlarigacha hamma narsani taklif etadi.",
            fullDescription:
              "Chorsu bozori Toshkentning tijorat hayotining qadimiy markazi va Markaziy Osiyodagi eng qadimgi bozorlardan biridir. 'Chorsu' nomi forscha 'to'rt oqim' degan ma'noni anglatadi. Bu yerda rangbarang ziravorlar, quritilgan mevalar, yangi mahsulotlar, non, an'anaviy o'zbek to'qimalari va ko'p narsa topiladi.",
          },
        ],
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1573155993874-d5d48af862ba?auto=format&fit=crop&w=1200&q=80',
            caption: 'Chorsu Bazaar domes',
            sortOrder: 0,
          },
        ],
      },
      videos: {
        create: [{ youtubeId: 'dQw4w9WgXcQ', title: 'Tashkent Chorsu Bazaar Tour' }],
      },
    },
  });

  // ============================================================
  // ITALY
  // ============================================================
  const italy = await prisma.country.upsert({
    where: { slug: 'italy' },
    update: {},
    create: {
      slug: 'italy',
      flagEmoji: '🇮🇹',
      featured: true,
      coverImage:
        'https://images.unsplash.com/photo-1552832226-7647ab8b6561?auto=format&fit=crop&w=1200&q=80',
      translations: {
        create: [
          {
            locale: 'en',
            name: 'Italy',
            description:
              "Italy is a country of extraordinary beauty — from the ruins of ancient Rome to the canals of Venice, from the Renaissance art of Florence to the stunning Amalfi Coast. One of the world's most visited destinations.",
          },
          {
            locale: 'ru',
            name: 'Италия',
            description:
              'Италия — страна исключительной красоты: руины Древнего Рима, каналы Венеции, искусство эпохи Возрождения во Флоренции и потрясающее побережье Амальфи.',
          },
          {
            locale: 'uz',
            name: 'Italiya',
            description:
              "Italiya — Qadimgi Rim xarobalaridan Venetsiya kanallarigacha, Florentsiya Uyg'onish davri san'atidan Amalfi qirg'og'igacha ajoyib go'zallik mamlakati.",
          },
        ],
      },
    },
  });

  // ---- ROME ----
  const rome = await prisma.city.upsert({
    where: { slug: 'rome' },
    update: {},
    create: {
      slug: 'rome',
      countryId: italy.id,
      featured: true,
      coverImage:
        'https://images.unsplash.com/photo-1552832226-7647ab8b6561?auto=format&fit=crop&w=800&q=80',
      translations: {
        create: [
          {
            locale: 'en',
            name: 'Rome',
            description:
              "The Eternal City, Rome is an open-air museum where ancient ruins, Renaissance art, and baroque fountains coexist in a living, breathing metropolis that has been the center of Western civilization for millennia.",
          },
          {
            locale: 'ru',
            name: 'Рим',
            description:
              'Вечный город — открытый музей, где древние руины, искусство эпохи Возрождения и барочные фонтаны сосуществуют в живом мегаполисе.',
          },
          {
            locale: 'uz',
            name: 'Rim',
            description:
              "Abadiy shahar Rim — qadimiy xarobalar, Uyg'onish davri san'ati va barokko favvoralar bir-biri bilan yashayotgan ochiq havoli muzeydir.",
          },
        ],
      },
    },
  });

  // Colosseum
  await prisma.place.upsert({
    where: { slug: 'colosseum-rome' },
    update: {},
    create: {
      slug: 'colosseum-rome',
      cityId: rome.id,
      category: 'monument',
      featured: true,
      coverImage:
        'https://images.unsplash.com/photo-1552832226-7647ab8b6561?auto=format&fit=crop&w=800&q=80',
      latitude: 41.8902,
      longitude: 12.4922,
      mapEmbedUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2970!2d12.4922!3d41.8902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132f61b2bd3e7bb3%3A0x8b281ce3e3bc3a58!2sColosseum!5e0!3m2!1sen!2s!4v1620000000000',
      translations: {
        create: [
          {
            locale: 'en',
            title: 'The Colosseum',
            shortDescription:
              "The iconic symbol of Imperial Rome, the Colosseum is the world's largest ancient amphitheater, capable of holding 50,000 to 80,000 spectators for gladiatorial contests and public spectacles.",
            fullDescription:
              "The Colosseum, also known as the Flavian Amphitheatre, is an oval amphitheater in the center of Rome, built between 70 and 80 CE under the Flavian emperors. It is the largest ancient amphitheater ever built and is considered one of the greatest works of architecture and engineering in history.\n\nThe Colosseum could hold between 50,000 and 80,000 spectators and was used for gladiatorial contests, public spectacles including animal hunts, mock sea battles, executions, re-enactments of famous battles, and dramas based on classical mythology.\n\nThe structure is elliptical in plan, measuring 188 meters by 156 meters, with four stories of arches and columns. Despite being partially ruined by earthquakes and stone-robbers over the centuries, the Colosseum is an iconic symbol of Rome and was listed as one of the New Seven Wonders of the World.\n\nBeneath the arena floor lies the hypogeum — a network of underground tunnels and cages where gladiators and animals waited before entering the arena. These tunnels are now partially open to visitors on special tours.",
          },
          {
            locale: 'ru',
            title: 'Колизей',
            shortDescription:
              'Знаковый символ имперского Рима — крупнейший в мире древний амфитеатр, вмещавший от 50 000 до 80 000 зрителей гладиаторских боёв.',
            fullDescription:
              'Колизей, также известный как амфитеатр Флавиев — овальный амфитеатр в центре Рима, построенный в 70–80 годах нашей эры. Это крупнейший из когда-либо построенных античных амфитеатров, вмещавший от 50 000 до 80 000 зрителей. Он использовался для гладиаторских боёв, охоты на животных и других зрелищ.\n\nКолизей — один из Новых семи чудес света и символ Рима.',
          },
          {
            locale: 'uz',
            title: 'Kolizey',
            shortDescription:
              "Imperator Rimining ikonik ramzi bo'lgan Kolizey — gladiatorlar musobaqalari va ommaviy tomoshalar uchun 50 000 dan 80 000 gacha tomoshabin sig'dira oladigan dunyodagi eng katta qadimiy amfiteatr.",
            fullDescription:
              "Kolizey, shuningdek Flavianlar amfiteatri sifatida ham tanilgan, Rim markazidagi oval amfiteatr bo'lib, milodiy 70-80 yillarda qurilgan. U barpo etilgan eng katta qadimiy amfiteatr bo'lib, tarixdagi eng buyuk me'morlik va muhandislik asarlaridan biri hisoblanadi.\n\nKolizey 50 000 dan 80 000 gacha tomoshabinni sig'dira olgan va gladiatorlar musobaqalari, hayvon ovi va boshqa tomoshalar uchun ishlatilgan.",
          },
        ],
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1552832226-7647ab8b6561?auto=format&fit=crop&w=1200&q=80',
            caption: 'Colosseum exterior',
            sortOrder: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=1200&q=80',
            caption: 'Colosseum interior arena',
            sortOrder: 1,
          },
          {
            url: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=1200&q=80',
            caption: 'Colosseum at night',
            sortOrder: 2,
          },
        ],
      },
      videos: {
        create: [{ youtubeId: '_3T8pLTFjzA', title: 'Colosseum Virtual Tour' }],
      },
    },
  });

  // Vatican
  await prisma.place.upsert({
    where: { slug: 'vatican-city-rome' },
    update: {},
    create: {
      slug: 'vatican-city-rome',
      cityId: rome.id,
      category: 'religious',
      featured: true,
      coverImage:
        'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=800&q=80',
      latitude: 41.9022,
      longitude: 12.4534,
      translations: {
        create: [
          {
            locale: 'en',
            title: 'Vatican City & St. Peter\'s Basilica',
            shortDescription:
              "The world's smallest sovereign state and spiritual center of Catholicism, home to St. Peter's Basilica with Michelangelo's Pietà and the breathtaking Sistine Chapel ceiling.",
            fullDescription:
              "Vatican City is an independent city-state enclaved within Rome, and the headquarters of the Roman Catholic Church. At just 44 hectares, it is the world's smallest internationally recognized independent state.\n\nThe centerpiece is St. Peter's Basilica, one of the largest churches in the world and a masterpiece of Renaissance and Baroque architecture. Designed by architects including Bramante, Raphael, and Michelangelo, it can hold up to 60,000 people. Inside is Michelangelo's exquisite Pietà, depicting the Virgin Mary cradling the body of Jesus.\n\nBeneath the basilica are the Vatican Grottoes, containing the tombs of many popes. Above it soars Michelangelo's magnificent dome, which can be climbed for panoramic views over Rome.\n\nThe Vatican Museums contain one of the world's greatest art collections, culminating in the Sistine Chapel, where Michelangelo's ceiling frescoes (including 'The Creation of Adam') rank among the greatest achievements in the history of art. The museums also house Raphael's Rooms, the Gallery of Maps, and countless Greek and Roman antiquities.",
          },
          {
            locale: 'ru',
            title: 'Ватикан и Собор Святого Петра',
            shortDescription:
              'Наименьшее суверенное государство мира и духовный центр католицизма с собором Святого Петра, «Пьетой» Микеланджело и Сикстинской капеллой.',
            fullDescription:
              'Ватикан — независимый город-государство, анклав в Риме, штаб-квартира Римско-католической церкви. Это наименьшее международно признанное независимое государство в мире.\n\nСобор Святого Петра — один из крупнейших храмов мира, шедевр архитектуры Ренессанса и барокко. Внутри хранится «Пьета» Микеланджело. Музеи Ватикана завершаются Сикстинской капеллой с фресками Микеланджело.',
          },
          {
            locale: 'uz',
            title: "Vatikan va Muqaddas Pyotr sobori",
            shortDescription:
              "Dunyo'ning eng kichik suveren davlati va katolitsizmning ma'naviy markazi — Muqaddas Pyotr sobori, Mikelanjelo Pieta haykali va nafas rostlaydigan Sikstina kapellasi.",
            fullDescription:
              "Vatikan — Rim ichida joylashgan mustaqil shahar-davlat va Rim-katolik cherkovining bosh qarorgohidir. Atigi 44 gektarlik hududda joylashgan bu dunyodagi eng kichik xalqaro tan olingan mustaqil davlatdir.\n\nMarkaziy diqqatga sazovor joy — Muqaddas Pyotr sobori, dunyodagi eng katta cherkovlardan biri va Uyg'onish va Barokko me'morchiligining durdonasi. Vatikan muzeylarida Mikelanjelo formalari bilan Sikstina kapellasi mavjud.",
          },
        ],
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=1200&q=80',
            caption: "St. Peter's Square and Basilica",
            sortOrder: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1570650581290-0e25b67264a3?auto=format&fit=crop&w=1200&q=80',
            caption: 'Sistine Chapel ceiling',
            sortOrder: 1,
          },
        ],
      },
      videos: {
        create: [{ youtubeId: '1V-n4P3AQ0g', title: 'Vatican Virtual Tour' }],
      },
    },
  });

  // Trevi Fountain
  await prisma.place.upsert({
    where: { slug: 'trevi-fountain-rome' },
    update: {},
    create: {
      slug: 'trevi-fountain-rome',
      cityId: rome.id,
      category: 'fountain',
      coverImage:
        'https://images.unsplash.com/photo-1555992336-fb0d29498b13?auto=format&fit=crop&w=800&q=80',
      latitude: 41.9009,
      longitude: 12.4833,
      translations: {
        create: [
          {
            locale: 'en',
            title: 'Trevi Fountain',
            shortDescription:
              "The world's most famous fountain and Rome's largest Baroque fountain, where visitors throw coins to ensure a return to the Eternal City — collecting €1.5 million annually for charity.",
            fullDescription:
              "The Trevi Fountain (Fontana di Trevi) is the most famous fountain in the world and the largest Baroque fountain in Rome. Standing 26 meters high and 49 meters wide, it was designed by Nicola Salvi and completed in 1762.\n\nThe fountain marks the terminal point of one of Rome's ancient aqueducts, the Aqua Virgo, which has been supplying water to Rome since 19 BCE. The dramatic central figure is Neptune, god of the sea, riding a chariot shell pulled by two sea horses — one calm, one wild — representing the moods of the sea.\n\nThe famous tradition of throwing a coin into the fountain dates back to the 1954 film 'Three Coins in the Fountain.' Today, visitors throw approximately €3,000 per day into the fountain, totaling over €1.5 million annually — all of which is collected for a Roman charity that feeds the city's needy.\n\nAt night, the fountain is illuminated and especially magical. The best time to visit is early morning before the crowds arrive.",
          },
          {
            locale: 'ru',
            title: 'Фонтан Треви',
            shortDescription:
              'Самый знаменитый фонтан в мире и крупнейший фонтан барокко в Риме — место, куда посетители бросают монеты, чтобы вернуться в Вечный город.',
            fullDescription:
              'Фонтан Треви — самый знаменитый фонтан в мире, высотой 26 метров и шириной 49 метров, спроектированный Никола Сальви и завершённый в 1762 году. Ежедневно в фонтан бросают около €3000, и все средства идут на благотворительность. Традиция bросания монет восходит к фильму 1954 года «Три монеты в фонтане».',
          },
          {
            locale: 'uz',
            title: 'Trevi favvorasi',
            shortDescription:
              "Dunyo'ning eng mashhur favvorasi va Rimning eng katta barokko favvorasi bo'lib, tashrif buyuruvchilar Abadiy shaharga qaytishni ta'minlash uchun tangalar tashlaydi.",
            fullDescription:
              "Trevi favvorasi dunyo'ning eng mashhur favvorasi bo'lib, balandligi 26 metr va kengligi 49 metr, Nikola Salvi tomonidan loyihalashtirilgan va 1762 yilda tugallangan. Har kuni favvoraga taxminan €3000 tashlanadi va barcha mablag'lar xayriya maqsadida ishlatiladi.",
          },
        ],
      },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?auto=format&fit=crop&w=1200&q=80',
            caption: 'Trevi Fountain at dusk',
            sortOrder: 0,
          },
        ],
      },
      videos: {
        create: [{ youtubeId: 'dQw4w9WgXcQ', title: 'Trevi Fountain Virtual Visit' }],
      },
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('📌 Countries: Uzbekistan, Italy');
  console.log('📌 Cities: Samarkand, Bukhara, Khiva, Tashkent, Rome');
  console.log('📌 Places: Registan, Gur-e-Amir, Shah-i-Zinda, Kalon Minaret, Ark Fortress,');
  console.log('         Itchan Kala, Chorsu Bazaar, Colosseum, Vatican, Trevi Fountain');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
