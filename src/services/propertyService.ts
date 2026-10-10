import { supabase, Property } from '@/lib/supabase'
import { wildSearchProperties } from '@/lib/wildSearch'

// Property Image type definition
export interface PropertyImage {
  id: string
  property_id: string
  image_url: string
  created_at: string
  /** 0 = cover image (shown first on the website), then 1, 2, 3 … */
  display_order?: number
}

export const propertyService = {
  // Fetch all properties from the properties table
  async getAllProperties(): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Error fetching properties: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error in getAllProperties:', error)
      throw error
    }
  },

  // Fetch properties by property_type (New, Rental, Resale)
  async getPropertiesByType(propertyType: string): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('property_type', propertyType)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Error fetching properties by type: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error in getPropertiesByType:', error)
      throw error
    }
  },

  // Fetch properties by usage_type (Residential, Commercial)
  async getPropertiesByUsageType(usageType: string): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('usage_type', usageType)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Error fetching properties by usage type: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error in getPropertiesByUsageType:', error)
      throw error
    }
  },

  // Get property by ID
  async getPropertyById(id: string): Promise<Property | null> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        throw new Error(`Error fetching property: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error in getPropertyById:', error)
      throw error
    }
  },

  // Add new property
  async addProperty(property: Omit<Property, 'id' | 'created_at'>): Promise<Property> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert([property])
        .select()
        .single()

      if (error) {
        throw new Error(`Error adding property: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error in addProperty:', error)
      throw error
    }
  },

  // Update property
  async updateProperty(id: string, updates: Partial<Omit<Property, 'id' | 'created_at'>>): Promise<Property> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(`Error updating property: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error in updateProperty:', error)
      throw error
    }
  },

  // Delete property
  async deleteProperty(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(`Error deleting property: ${error.message}`)
      }
    } catch (error) {
      console.error('Error in deleteProperty:', error)
      throw error
    }
  },

  // Bulk insert properties (for CSV upload)
  async bulkInsertProperties(properties: Omit<Property, 'id' | 'created_at'>[]): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert(properties)
        .select()

      if (error) {
        throw new Error(`Error bulk inserting properties: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error in bulkInsertProperties:', error)
      throw error
    }
  },

  // Upload image to Supabase Storage
  async uploadImage(file: File, propertyId: string): Promise<string> {
    try {
      // Unique name per file. The old name used only Date.now(), so images uploaded together
      // got the SAME name in the same millisecond – only the first one succeeded and every
      // other image failed with "The resource already exists".
      const rawExt = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
      const fileExt = rawExt || 'jpg'
      const unique =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
      const fileName = `${propertyId}/${unique}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('listings')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || undefined
        })

      if (error) {
        throw new Error(`Error uploading image: ${error.message}`)
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('listings')
        .getPublicUrl(fileName)

      return urlData.publicUrl
    } catch (error) {
      console.error('Error in uploadImage:', error)
      throw error
    }
  },

  // Save image record to database
  async saveImageRecord(propertyId: string, imageUrl: string, displayOrder?: number): Promise<PropertyImage> {
    try {
      const row: Record<string, unknown> = { property_id: propertyId, image_url: imageUrl }
      if (displayOrder !== undefined) row.display_order = displayOrder

      let { data, error } = await supabase.from('property_images').insert([row]).select().single()

      // Column not created yet? Save without it so uploading never breaks.
      if (error && /display_order/i.test(error.message)) {
        delete row.display_order
        ;({ data, error } = await supabase.from('property_images').insert([row]).select().single())
      }

      if (error) {
        throw new Error(`Error saving image record: ${error.message}`)
      }

      return data as PropertyImage
    } catch (error) {
      console.error('Error in saveImageRecord:', error)
      throw error
    }
  },

  // Upload multiple images for a property.
  // Images are uploaded one after another (reliable on slow connections / big photos).
  // If some fail, the ones that worked are kept and the error lists exactly which failed.
  async uploadMultipleImages(files: File[], propertyId: string): Promise<PropertyImage[]> {
    const saved: PropertyImage[] = []
    const failed: string[] = []

    // New images go after the existing ones, in the order they were selected
    let nextOrder = 0
    try {
      const existing = await this.getPropertyImages(propertyId)
      nextOrder = existing.reduce((m, img) => Math.max(m, (img.display_order ?? 0) + 1), existing.length)
    } catch {
      nextOrder = 0
    }

    for (const file of files) {
      try {
        const imageUrl = await this.uploadImage(file, propertyId)
        saved.push(await this.saveImageRecord(propertyId, imageUrl, nextOrder++))
      } catch (error) {
        console.error('Image upload failed:', file.name, error)
        const reason = error instanceof Error ? error.message.replace(/^Error (uploading image|saving image record): /, '') : 'unknown error'
        failed.push(`${file.name} (${reason})`)
      }
    }

    if (failed.length > 0) {
      throw new Error(
        `${saved.length} of ${files.length} images uploaded. Failed: ${failed.join('; ')}`
      )
    }
    return saved
  },

  // Get images for a property.
  // Order = display_order (0 = cover), then upload time. So the first image selected is shown first.
  async getPropertyImages(propertyId: string): Promise<PropertyImage[]> {
    try {
      const { data, error } = await supabase
        .from('property_images')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: true })

      if (error) {
        throw new Error(`Error fetching property images: ${error.message}`)
      }

      const images = (data || []) as PropertyImage[]
      // Stable sort: display_order first, ties keep upload order
      return images
        .map((img, i) => ({ img, i }))
        .sort((a, b) => (a.img.display_order ?? 0) - (b.img.display_order ?? 0) || a.i - b.i)
        .map(x => x.img)
    } catch (error) {
      console.error('Error in getPropertyImages:', error)
      throw error
    }
  },

  // Make one image the cover (shown first on the website) and renumber the rest 1, 2, 3 …
  async setCoverImage(propertyId: string, imageId: string): Promise<void> {
    const images = await this.getPropertyImages(propertyId)
    const chosen = images.find(i => i.id === imageId)
    if (!chosen) throw new Error('Image not found')
    const reordered = [chosen, ...images.filter(i => i.id !== imageId)]

    const results = await Promise.all(
      reordered.map((img, index) =>
        supabase.from('property_images').update({ display_order: index }).eq('id', img.id)
      )
    )
    const failed = results.find(r => r.error)
    if (failed?.error) {
      throw new Error(
        `Could not set cover image: ${failed.error.message}. Make sure migrations/008_cover_image.sql has been run in Supabase.`
      )
    }
  },

  // Wild search: matches across EVERY field (see src/lib/wildSearch.ts for syntax:
  // multiple words, wildcards * and ?, "exact phrases", -exclusions, typo tolerance).
  async searchProperties(query: string): Promise<Property[]> {
    try {
      const q = (query || '').trim()
      if (!q) return []

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Error searching properties: ${error.message}`)
      }

      return wildSearchProperties((data || []) as Property[], q)
    } catch (error) {
      console.error('Error in searchProperties:', error)
      throw error
    }
  },

  // Get properties by category (primary_category or category_assignments)
  async getPropertiesByCategory(categorySlug: string): Promise<Property[]> {
    try {
      // Query for properties where primary_category matches OR category_assignments array contains the slug
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .or(`primary_category.eq.${categorySlug},category_assignments.cs.{${categorySlug}}`)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Error fetching properties by category: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error in getPropertiesByCategory:', error)
      throw error
    }
  },

  // Get properties by multiple categories (properties that belong to any of the specified categories)
  async getPropertiesByCategories(categorySlugs: string[]): Promise<Property[]> {
    try {
      if (categorySlugs.length === 0) {
        return []
      }

      // For multiple categories, we'll fetch all and filter in JavaScript for better reliability
      // This ensures we catch properties in primary_category OR category_assignments
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Error fetching properties: ${error.message}`)
      }

      // Filter properties that match any of the specified categories
      const filtered = (data || []).filter(property => {
        const primaryMatch = property.primary_category && categorySlugs.includes(property.primary_category)
        const assignmentsMatch = property.category_assignments && 
          property.category_assignments.some((slug: string) => categorySlugs.includes(slug))
        return primaryMatch || assignmentsMatch
      })

      return filtered
    } catch (error) {
      console.error('Error in getPropertiesByCategories:', error)
      throw error
    }
  },

  // Get properties that belong to ALL specified categories (intersection)
  async getPropertiesByAllCategories(categorySlugs: string[]): Promise<Property[]> {
    try {
      if (categorySlugs.length === 0) {
        return []
      }

      // For intersection, we need to check that category_assignments contains all specified slugs
      // This is more complex and may require filtering in JavaScript for better accuracy
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Error fetching properties: ${error.message}`)
      }

      // Filter properties that have all specified categories in their assignments
      const filtered = (data || []).filter(property => {
        const assignments = property.category_assignments || []
        return categorySlugs.every(slug => 
          assignments.includes(slug) || property.primary_category === slug
        )
      })

      return filtered
    } catch (error) {
      console.error('Error in getPropertiesByAllCategories:', error)
      throw error
    }
  },

  // Delete image
  async deleteImage(imageId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('property_images')
        .delete()
        .eq('id', imageId)

      if (error) {
        throw new Error(`Error deleting image: ${error.message}`)
      }
    } catch (error) {
      console.error('Error in deleteImage:', error)
      throw error
    }
  }
} 
