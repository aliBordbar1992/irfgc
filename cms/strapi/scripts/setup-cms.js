const { Strapi } = require('@strapi/strapi');

async function setupCMS() {
  try {
    console.log('🚀 Setting up IRFGC CMS...');

    // Initialize Strapi
    const strapi = await Strapi().load();

    // Create sample games
    console.log('📝 Creating sample games...');
    const games = [
      {
        slug: 'mk',
        name: 'MK',
        fullName: 'Mortal Kombat',
        description: 'Mortal Kombat community for Iranian players',
        imageUrl: '/images/games/mk.jpg',
        isActive: true,
        discordUrl: 'https://discord.gg/irfgc-mk',
      },
      {
        slug: 'sf',
        name: 'SF',
        fullName: 'Street Fighter',
        description: 'Street Fighter community for Iranian players',
        imageUrl: '/images/games/sf.jpg',
        isActive: true,
        discordUrl: 'https://discord.gg/irfgc-sf',
      },
      {
        slug: 'tk',
        name: 'TK',
        fullName: 'Tekken',
        description: 'Tekken community for Iranian players',
        imageUrl: '/images/games/tk.jpg',
        isActive: true,
        discordUrl: 'https://discord.gg/irfgc-tk',
      },
      {
        slug: 'gg',
        name: 'GG',
        fullName: 'Guilty Gear',
        description: 'Guilty Gear community for Iranian players',
        imageUrl: '/images/games/gg.jpg',
        isActive: true,
        discordUrl: 'https://discord.gg/irfgc-gg',
      },
      {
        slug: 'bb',
        name: 'BB',
        fullName: 'BlazBlue',
        description: 'BlazBlue community for Iranian players',
        imageUrl: '/images/games/bb.jpg',
        isActive: true,
        discordUrl: 'https://discord.gg/irfgc-bb',
      },
      {
        slug: 'uni',
        name: 'UNI',
        fullName: 'Under Night In-Birth',
        description: 'Under Night In-Birth community for Iranian players',
        imageUrl: '/images/games/uni.jpg',
        isActive: true,
        discordUrl: 'https://discord.gg/irfgc-uni',
      },
    ];

    for (const gameData of games) {
      const existingGame = await strapi.entityService.findMany('api::game.game', {
        filters: { slug: gameData.slug },
      });

      if (existingGame.length === 0) {
        await strapi.entityService.create('api::game.game', {
          data: gameData,
        });
        console.log(`✅ Created game: ${gameData.fullName}`);
      } else {
        console.log(`⏭️  Game already exists: ${gameData.fullName}`);
      }
    }

    // Create sample events
    console.log('📅 Creating sample events...');
    const sampleEvents = [
      {
        title: 'IRFGC Mortal Kombat Championship 2024',
        description: 'Join us for the biggest Mortal Kombat tournament in Iran!',
        type: 'TOURNAMENT',
        status: 'UPCOMING',
        startDate: new Date('2024-12-15T10:00:00Z'),
        endDate: new Date('2024-12-15T18:00:00Z'),
        location: 'Tehran Gaming Center',
        maxParticipants: 32,
        currentParticipants: 0,
        featured: true,
        gameSlug: 'mk',
      },
      {
        title: 'Street Fighter Casual Night',
        description: 'A casual gathering for Street Fighter enthusiasts',
        type: 'CASUAL',
        status: 'UPCOMING',
        startDate: new Date('2024-11-20T19:00:00Z'),
        endDate: new Date('2024-11-20T23:00:00Z'),
        location: 'Online',
        onlineUrl: 'https://discord.gg/irfgc-sf',
        featured: false,
        gameSlug: 'sf',
      },
    ];

    for (const eventData of sampleEvents) {
      const game = await strapi.entityService.findMany('api::game.game', {
        filters: { slug: eventData.gameSlug },
      });

      if (game.length > 0) {
        const eventToCreate = {
          ...eventData,
          game: game[0].id,
        };
        delete eventToCreate.gameSlug;

        await strapi.entityService.create('api::event.event', {
          data: eventToCreate,
        });
        console.log(`✅ Created event: ${eventData.title}`);
      }
    }

    // Create sample news posts
    console.log('📰 Creating sample news posts...');
    const sampleNews = [
      {
        title: 'Welcome to IRFGC Platform',
        content: 'Welcome to the Iranian Fighting Game Community platform! We are excited to bring together fighting game enthusiasts from across Iran.',
        excerpt: 'Welcome to the Iranian Fighting Game Community platform!',
        category: 'ANNOUNCEMENT',
        featured: true,
        gameSlug: 'mk',
      },
      {
        title: 'Upcoming Tournament Schedule',
        content: 'Check out our upcoming tournament schedule for the next quarter. We have exciting events planned for all major fighting games.',
        excerpt: 'Check out our upcoming tournament schedule for the next quarter.',
        category: 'TOURNAMENT',
        featured: false,
        gameSlug: 'sf',
      },
    ];

    for (const newsData of sampleNews) {
      const game = await strapi.entityService.findMany('api::game.game', {
        filters: { slug: newsData.gameSlug },
      });

      if (game.length > 0) {
        const newsToCreate = {
          ...newsData,
          game: game[0].id,
        };
        delete newsToCreate.gameSlug;

        await strapi.entityService.create('api::news-post.news-post', {
          data: newsToCreate,
        });
        console.log(`✅ Created news post: ${newsData.title}`);
      }
    }

    console.log('🎉 CMS setup completed successfully!');
    console.log('📋 Next steps:');
    console.log('1. Start Strapi: npm run develop');
    console.log('2. Access admin panel: http://localhost:1337/admin');
    console.log('3. Create your admin account');
    console.log('4. Generate API token in Settings > API Tokens');

  } catch (error) {
    console.error('❌ Error setting up CMS:', error);
    process.exit(1);
  }
}

setupCMS(); 