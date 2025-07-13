import { Game, Event, NewsPost } from "@/types";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiSingleResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

interface StrapiData<T> {
  id: number;
  attributes: T;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

class StrapiClient {
  private baseUrl: string;
  private token: string | undefined;

  constructor() {
    this.baseUrl = STRAPI_URL;
    this.token = STRAPI_API_TOKEN;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Games API
  async getGames(): Promise<Game[]> {
    const response: StrapiResponse<StrapiData<Game>> = await this.request(
      "/games?populate=*"
    );

    return response.data.map((item) => ({
      ...item.attributes,
      id: item.id.toString(),
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    }));
  }

  async getGame(slug: string): Promise<Game | null> {
    const response: StrapiSingleResponse<StrapiData<Game>> = await this.request(
      `/games?filters[slug][$eq]=${slug}&populate=*`
    );

    if (!response.data) return null;

    return {
      id: response.data.id.toString(),
      ...response.data.attributes,
      createdAt: new Date(response.data.createdAt),
      updatedAt: new Date(response.data.updatedAt),
    };
  }

  // Events API
  async getEvents(
    gameSlug?: string,
    page = 1,
    limit = 10
  ): Promise<{
    events: Event[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    let endpoint = `/events?populate=*&pagination[page]=${page}&pagination[pageSize]=${limit}&sort[0]=startDate:asc`;

    if (gameSlug) {
      endpoint += `&filters[game][slug][$eq]=${gameSlug}`;
    }

    const response: StrapiResponse<StrapiData<Event>> = await this.request(
      endpoint
    );

    const events = response.data.map((item) => ({
      id: item.id.toString(),
      ...item.attributes,
      startDate: new Date(item.attributes.startDate),
      endDate: new Date(item.attributes.endDate),
      registrationDeadline: item.attributes.registrationDeadline
        ? new Date(item.attributes.registrationDeadline)
        : undefined,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    }));

    return {
      events,
      pagination: {
        page: response.meta.pagination.page,
        limit: response.meta.pagination.pageSize,
        total: response.meta.pagination.total,
        totalPages: response.meta.pagination.pageCount,
      },
    };
  }

  async getEvent(id: string): Promise<Event | null> {
    const response: StrapiSingleResponse<StrapiData<Event>> =
      await this.request(`/events/${id}?populate=*`);

    if (!response.data) return null;

    return {
      id: response.data.id.toString(),
      ...response.data.attributes,
      startDate: new Date(response.data.attributes.startDate),
      endDate: new Date(response.data.attributes.endDate),
      registrationDeadline: response.data.attributes.registrationDeadline
        ? new Date(response.data.attributes.registrationDeadline)
        : null,
      createdAt: new Date(response.data.createdAt),
      updatedAt: new Date(response.data.updatedAt),
    };
  }

  // News API
  async getNewsPosts(
    gameSlug?: string,
    page = 1,
    limit = 10
  ): Promise<{
    newsPosts: NewsPost[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    let endpoint = `/news-posts?populate=*&pagination[page]=${page}&pagination[pageSize]=${limit}&sort[0]=publishedAt:desc`;

    if (gameSlug) {
      endpoint += `&filters[game][slug][$eq]=${gameSlug}`;
    }

    const response: StrapiResponse<StrapiData<NewsPost>> = await this.request(
      endpoint
    );

    const newsPosts = response.data.map((item) => ({
      id: item.id.toString(),
      ...item.attributes,
      publishedAt: new Date(item.publishedAt),
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    }));

    return {
      newsPosts,
      pagination: {
        page: response.meta.pagination.page,
        limit: response.meta.pagination.pageSize,
        total: response.meta.pagination.total,
        totalPages: response.meta.pagination.pageCount,
      },
    };
  }

  async getNewsPost(id: string): Promise<NewsPost | null> {
    const response: StrapiSingleResponse<StrapiData<NewsPost>> =
      await this.request(`/news-posts/${id}?populate=*`);

    if (!response.data) return null;

    return {
      id: response.data.id.toString(),
      ...response.data.attributes,
      publishedAt: new Date(response.data.publishedAt),
      createdAt: new Date(response.data.createdAt),
      updatedAt: new Date(response.data.updatedAt),
    };
  }

  // Create/Update operations (requires authentication)
  async createEvent(eventData: Partial<Event>): Promise<Event> {
    const response: StrapiSingleResponse<StrapiData<Event>> =
      await this.request("/events", {
        method: "POST",
        body: JSON.stringify({ data: eventData }),
      });

    return {
      id: response.data.id.toString(),
      ...response.data.attributes,
      startDate: new Date(response.data.attributes.startDate),
      endDate: new Date(response.data.attributes.endDate),
      registrationDeadline: response.data.attributes.registrationDeadline
        ? new Date(response.data.attributes.registrationDeadline)
        : null,
      createdAt: new Date(response.data.createdAt),
      updatedAt: new Date(response.data.updatedAt),
    };
  }

  async createNewsPost(newsData: Partial<NewsPost>): Promise<NewsPost> {
    const response: StrapiSingleResponse<StrapiData<NewsPost>> =
      await this.request("/news-posts", {
        method: "POST",
        body: JSON.stringify({ data: newsData }),
      });

    return {
      id: response.data.id.toString(),
      ...response.data.attributes,
      publishedAt: new Date(response.data.publishedAt),
      createdAt: new Date(response.data.createdAt),
      updatedAt: new Date(response.data.updatedAt),
    };
  }

  async updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
    const response: StrapiSingleResponse<StrapiData<Event>> =
      await this.request(`/events/${id}`, {
        method: "PUT",
        body: JSON.stringify({ data: eventData }),
      });

    return {
      id: response.data.id.toString(),
      ...response.data.attributes,
      startDate: new Date(response.data.attributes.startDate),
      endDate: new Date(response.data.attributes.endDate),
      registrationDeadline: response.data.attributes.registrationDeadline
        ? new Date(response.data.attributes.registrationDeadline)
        : null,
      createdAt: new Date(response.data.createdAt),
      updatedAt: new Date(response.data.updatedAt),
    };
  }

  async updateNewsPost(
    id: string,
    newsData: Partial<NewsPost>
  ): Promise<NewsPost> {
    const response: StrapiSingleResponse<StrapiData<NewsPost>> =
      await this.request(`/news-posts/${id}`, {
        method: "PUT",
        body: JSON.stringify({ data: newsData }),
      });

    return {
      id: response.data.id.toString(),
      ...response.data.attributes,
      publishedAt: new Date(response.data.publishedAt),
      createdAt: new Date(response.data.createdAt),
      updatedAt: new Date(response.data.updatedAt),
    };
  }

  async deleteEvent(id: string): Promise<void> {
    await this.request(`/events/${id}`, {
      method: "DELETE",
    });
  }

  async deleteNewsPost(id: string): Promise<void> {
    await this.request(`/news-posts/${id}`, {
      method: "DELETE",
    });
  }
}

export const strapiClient = new StrapiClient();
