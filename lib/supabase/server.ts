import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 10;

export async function createClient() {
  if (!CONFIGURED) {
    // Return a mocked Supabase client for seamless UI prototyping
    return {
      auth: {
        getUser: async () => ({
          data: {
            user: {
              id: "mock-user-id",
              email: "collector@gemstoneempire.com",
              user_metadata: { full_name: "John Doe" }
            }
          },
          error: null
        }),
        getSession: async () => ({
          data: {
            session: {
              user: {
                id: "mock-user-id",
                email: "collector@gemstoneempire.com",
                user_metadata: { full_name: "John Doe" }
              }
            }
          },
          error: null
        }),
        signOut: async () => ({ error: null })
      },
      from: (table: string) => {
        return {
          select: (fields?: string, options?: { count?: string }) => {
            const builder = {
              eq: (field: string, value: any) => {
                const eqBuilder = {
                  single: async () => {
                    if (table === "profiles") {
                      return { data: { id: "mock-user-id", full_name: "John Doe", created_at: new Date().toISOString() }, error: null };
                    }
                    if (table === "orders") {
                      return {
                        data: {
                          id: "order-1",
                          order_number: "GE-2026-9874",
                          created_at: new Date().toISOString(),
                          status: "delivered",
                          total: 12500,
                          items: [
                            { id: "item-1", product_name: "Burmese Ruby 1.5ct Cushion", quantity: 1, total_price: 12500 }
                          ]
                        },
                        error: null
                      };
                    }
                    return { data: null, error: null };
                  },
                  order: (sortField: string, orderOptions?: any) => {
                    const orderBuilder = {
                      range: async (from: number, to: number) => {
                        if (table === "orders") {
                          return {
                            data: [
                              {
                                id: "order-1",
                                order_number: "GE-2026-9874",
                                created_at: new Date().toISOString(),
                                status: "delivered",
                                total: 12500,
                                items: [
                                  { id: "item-1", product_name: "Burmese Ruby 1.5ct Cushion", quantity: 1, total_price: 12500 }
                                ]
                              }
                            ],
                            count: 1,
                            error: null
                          };
                        }
                        return { data: [], error: null };
                      }
                    };
                    return orderBuilder;
                  }
                };
                return eqBuilder;
              },
              order: (sortField: string, orderOptions?: any) => {
                const orderBuilder = {
                  range: async (from: number, to: number) => {
                    if (table === "addresses") {
                      return {
                        data: [
                          {
                            id: "addr-1",
                            user_id: "mock-user-id",
                            first_name: "John",
                            last_name: "Doe",
                            address_line1: "100 Emerald Lane",
                            city: "Hampshire",
                            state: "NH",
                            postal_code: "03049",
                            country: "United States",
                            phone: "+1 603-814-8360",
                            is_default: true
                          }
                        ],
                        count: 1,
                        error: null
                      };
                    }
                    return { data: [], error: null };
                  }
                };
                return orderBuilder;
              },
              single: async () => {
                if (table === "profiles") {
                  return { data: { id: "mock-user-id", full_name: "John Doe", created_at: new Date().toISOString() }, error: null };
                }
                return { data: null, error: null };
              }
            };
            return builder;
          }
        };
      }
    } as any;
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component
          }
        },
      },
    }
  );
}

export async function createServiceClient() {
  if (!CONFIGURED) {
    return {
      auth: {},
      from: () => ({})
    } as any;
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component
          }
        },
      },
    }
  );
}
