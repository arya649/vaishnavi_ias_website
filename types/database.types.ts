export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      courses: {
        Row: {
          description: string | null
          duration_label: string | null
          id: string
          is_active: boolean
          is_price_tbd: boolean
          name: string
          position: number
          price_paise: number | null
          site_id: string
          track: string
        }
        Insert: {
          description?: string | null
          duration_label?: string | null
          id?: string
          is_active?: boolean
          is_price_tbd?: boolean
          name: string
          position?: number
          price_paise?: number | null
          site_id: string
          track: string
        }
        Update: {
          description?: string | null
          duration_label?: string | null
          id?: string
          is_active?: boolean
          is_price_tbd?: boolean
          name?: string
          position?: number
          price_paise?: number | null
          site_id?: string
          track?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      current_affairs_posts: {
        Row: {
          body_markdown: string
          created_at: string
          id: string
          is_published: boolean
          post_date: string
          site_id: string
          slug: string
          thumbnail_url: string | null
          title: string
          youtube_url: string | null
        }
        Insert: {
          body_markdown: string
          created_at?: string
          id?: string
          is_published?: boolean
          post_date?: string
          site_id: string
          slug: string
          thumbnail_url?: string | null
          title: string
          youtube_url?: string | null
        }
        Update: {
          body_markdown?: string
          created_at?: string
          id?: string
          is_published?: boolean
          post_date?: string
          site_id?: string
          slug?: string
          thumbnail_url?: string | null
          title?: string
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "current_affairs_posts_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      enquiries: {
        Row: {
          created_at: string
          email: string | null
          id: string
          installment_access: boolean
          interested_in: string | null
          message: string | null
          name: string
          phone: string
          site_id: string
          source_page: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          installment_access?: boolean
          interested_in?: string | null
          message?: string | null
          name: string
          phone: string
          site_id: string
          source_page?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          installment_access?: boolean
          interested_in?: string | null
          message?: string | null
          name?: string
          phone?: string
          site_id?: string
          source_page?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "enquiries_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      faq_items: {
        Row: {
          answer_markdown: string
          category: string | null
          id: string
          is_published: boolean
          position: number
          question: string
          site_id: string
        }
        Insert: {
          answer_markdown: string
          category?: string | null
          id?: string
          is_published?: boolean
          position?: number
          question: string
          site_id: string
        }
        Update: {
          answer_markdown?: string
          category?: string | null
          id?: string
          is_published?: boolean
          position?: number
          question?: string
          site_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "faq_items_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      nav_items: {
        Row: {
          href: string
          id: string
          is_visible: boolean
          label: string
          parent_id: string | null
          position: number
          site_id: string
        }
        Insert: {
          href: string
          id?: string
          is_visible?: boolean
          label: string
          parent_id?: string | null
          position?: number
          site_id: string
        }
        Update: {
          href?: string
          id?: string
          is_visible?: boolean
          label?: string
          parent_id?: string | null
          position?: number
          site_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nav_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "nav_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nav_items_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          created_at: string
          id: string
          is_published: boolean
          meta_description: string | null
          meta_title: string | null
          site_id: string
          slug: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          site_id: string
          slug: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          site_id?: string
          slug?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "pages_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_plans: {
        Row: {
          category: string
          description: string | null
          id: string
          is_active: boolean
          is_price_tbd: boolean
          name: string
          position: number
          price_paise: number | null
          site_id: string
          supports_installments: boolean
          unit_label: string | null
        }
        Insert: {
          category: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_price_tbd?: boolean
          name: string
          position?: number
          price_paise?: number | null
          site_id: string
          supports_installments?: boolean
          unit_label?: string | null
        }
        Update: {
          category?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_price_tbd?: boolean
          name?: string
          position?: number
          price_paise?: number | null
          site_id?: string
          supports_installments?: boolean
          unit_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pricing_plans_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          category: string | null
          created_at: string
          file_url: string
          id: string
          is_published: boolean
          position: number
          site_id: string
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          file_url: string
          id?: string
          is_published?: boolean
          position?: number
          site_id: string
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string
          file_url?: string
          id?: string
          is_published?: boolean
          position?: number
          site_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "resources_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      sections: {
        Row: {
          content: Json
          id: string
          is_visible: boolean
          page_id: string
          position: number
          type: string
          updated_at: string
        }
        Insert: {
          content?: Json
          id?: string
          is_visible?: boolean
          page_id: string
          position?: number
          type: string
          updated_at?: string
        }
        Update: {
          content?: Json
          id?: string
          is_visible?: boolean
          page_id?: string
          position?: number
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      site_branding: {
        Row: {
          accent_color: string
          contact_address: string | null
          contact_email: string | null
          contact_phone: string | null
          favicon_url: string | null
          logo_url: string | null
          primary_color: string
          seo_default_desc: string | null
          seo_default_title: string | null
          site_id: string
          social_links: Json
          tagline: string | null
          updated_at: string
        }
        Insert: {
          accent_color?: string
          contact_address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          favicon_url?: string | null
          logo_url?: string | null
          primary_color?: string
          seo_default_desc?: string | null
          seo_default_title?: string | null
          site_id: string
          social_links?: Json
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          accent_color?: string
          contact_address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          favicon_url?: string | null
          logo_url?: string | null
          primary_color?: string
          seo_default_desc?: string | null
          seo_default_title?: string | null
          site_id?: string
          social_links?: Json
          tagline?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_branding_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: true
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      sites: {
        Row: {
          created_at: string
          domain: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          domain?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          domain?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
        }
        Relationships: []
      }
      test_series_categories: {
        Row: {
          details_markdown: string | null
          icon_url: string | null
          id: string
          is_active: boolean
          name: string
          position: number
          site_id: string
          slug: string
          summary: string | null
        }
        Insert: {
          details_markdown?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          name: string
          position?: number
          site_id: string
          slug: string
          summary?: string | null
        }
        Update: {
          details_markdown?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          name?: string
          position?: number
          site_id?: string
          slug?: string
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_series_categories_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          created_at: string
          id: string
          is_published: boolean
          photo_url: string | null
          position: number
          quote: string
          rank_or_batch: string | null
          site_id: string
          student_name: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_published?: boolean
          photo_url?: string | null
          position?: number
          quote: string
          rank_or_batch?: string | null
          site_id: string
          student_name: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_published?: boolean
          photo_url?: string | null
          position?: number
          quote?: string
          rank_or_batch?: string | null
          site_id?: string
          student_name?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
