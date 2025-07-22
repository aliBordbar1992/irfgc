import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsSections extends Struct.ComponentSchema {
  collectionName: 'components_sections_sections';
  info: {
    displayName: 'sections';
    icon: 'apps';
  };
  attributes: {
    news_posts: Schema.Attribute.Relation<
      'oneToMany',
      'api::news-post.news-post'
    >;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'sections.sections': SectionsSections;
    }
  }
}
